import { useEffect, useState } from "react";
import { Table, Button, Drawer, Input, Space, Popconfirm } from "antd";
import { useAxios } from "../../hook/useAxsios";
import { AddComponents, EditCommponents } from "./components";
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import VisibilityComponent from "../../components/VisibilityComponent";
import TableVisibilityComponent from "../../components/TableVisibilityComponent";

const { Search } = Input;

type User = {
    id: number;
    full_name: string;
    email?: string;
    phone_number?: string;
    role: string;
};

const Users: React.FC = () => {
    const axios = useAxios();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
        actions: true,
    });
    const [addVisible, setAddVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [visibilityVisible, setVisibilityVisible] = useState(false);

    const getStatusCounts = () => {
        const counts: { [key: string]: number } = {
            USER: 0,
            PARKING_ADMIN: 0,
            ADMIN: 0
        };

        users.forEach(user => {
            if (counts[user.role as keyof typeof counts] !== undefined) {
                counts[user.role as keyof typeof counts]++;
            }
        });

        return counts;
    };

    const fetchUsers = () => {
        setLoading(true);
        axios({url:"/users"})
            .then((res) => {
                const sortedUsers = res
                    .filter((user: User) => user?.full_name)
                    .sort((a: User, b: User) => (a.full_name ?? "").localeCompare(b.full_name ?? ""));

                setUsers(sortedUsers);
                setFilteredUsers(sortedUsers);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (value: string) => {
        const filtered = users.filter(user =>
            user.full_name.toLowerCase().includes(value.toLowerCase()) ||
            user.email?.toLowerCase().includes(value.toLowerCase()) ||
            user.phone_number?.includes(value)
        );
        setFilteredUsers(filtered);
    };

    const handleDelete = (id: number) => {
        axios({url:`/users/${id}`,method:"DELETE"})
            .then(() => {
                fetchUsers();
            })
            .catch(err => console.error("Error deleting user:", err));
    };

    const baseColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Ism Familiya",
            dataIndex: "full_name",
            key: "full_name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Telefon",
            dataIndex: "phone_number",
            key: "phone_number",
        },
        {
            title: "Roli",
            dataIndex: "role",
            key: "role",
            render: (role: string) => {
                const roleColors = {
                    USER: 'blue',
                    PARKING_ADMIN: 'green',
                    ADMIN: 'red',
                };
                return (
                    <span style={{ color: roleColors[role as keyof typeof roleColors] }}>
                        {role}
                    </span>
                );
            },
        },
        {
            title: "Amallar",
            key: "actions",
            render: (_: any, record: User) => (
                <Space>
                    <Button 
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedUser(record);
                            setEditVisible(true);
                        }}
                        style={{
                            border: '1px solid #d9d9d9',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            borderRadius: '6px'
                        }}
                    />
                    <Popconfirm 
                        title="Rostdan ham o'chirmoqchimisiz?" 
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button 
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            style={{
                                border: '1px solid #ff4d4f',
                                boxShadow: '0 2px 4px rgba(255,77,79,0.8)',
                                borderRadius: '6px'
                            }}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const columns = baseColumns.filter(col => visibleColumns[col.key]);

    const handleColumnVisibilityChange = (key: string, visible: boolean) => {
        setVisibleColumns(prev => ({
            ...prev,
            [key]: visible
        }));
    };

    const visibilityColumns = baseColumns.map(col => ({
        title: col.title,
        key: col.key,
        visible: visibleColumns[col.key]
    }));
    
    return (
        <div style={{ padding: 24 }}>
            <VisibilityComponent
                totalCount={users.length}
                statusCounts={getStatusCounts()}
                type="user"
            />

            <div style={{ marginBottom: 16 }}>
                <h2>Foydalanuvchilar</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                    <Search 
                        placeholder="Qidirish..." 
                        onSearch={handleSearch} 
                        style={{ width: 300 }} 
                        allowClear
                    />
                    <Space size="middle">
                        <TableVisibilityComponent
                            columns={visibilityColumns}
                            onChange={handleColumnVisibilityChange}
                        />
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => setAddVisible(true)}
                            style={{
                                boxShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                borderRadius: '6px'
                            }}
                        />
                    </Space>
                </div>
            </div>

            <Table 
                columns={columns} 
                dataSource={filteredUsers} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
            
            <Drawer title="Foydalanuvchi Qo'shish" open={addVisible} onClose={() => setAddVisible(false)}>
                <AddComponents onClose={() => { setAddVisible(false); fetchUsers(); }} />
            </Drawer>
            <Drawer title="Foydalanuvchini Tahrirlash" open={editVisible} onClose={() => setEditVisible(false)}>
                <EditCommponents user={selectedUser} onClose={() => { setEditVisible(false); fetchUsers(); }} />
            </Drawer>
        </div>
    );
};

export default Users;
