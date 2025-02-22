import { useEffect, useState } from "react";
import { Table, Typography, Button, Drawer, Input, Space, Popconfirm, } from "antd";
import { useAxios } from "../../hook/useAxsios";
import { AddComponents, EditCommponents, VisiblityComponent } from "./components";

const { Title } = Typography;
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
    const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
    });
    const [addVisible, setAddVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [visibilityVisible, setVisibilityVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = () => {
        axios({url:"/users"})
            .then((res) => {
                const sortedUsers = res.sort((a: User, b: User) => a.full_name.localeCompare(b.full_name));
                setUsers(sortedUsers);
                setFilteredUsers(sortedUsers);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
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

    const columns = [
        selectedColumns.id ? {
            title: "ID",
            dataIndex: "id",
            key: "id",
        } : null,
        selectedColumns.full_name ? {
            title: "Ism Familiya",
            dataIndex: "full_name",
            key: "full_name",
        } : null,
        selectedColumns.email ? {
            title: "Email",
            dataIndex: "email",
            key: "email",
        } : null,
        selectedColumns.phone_number ? {
            title: "Telefon",
            dataIndex: "phone_number",
            key: "phone_number",
        } : null,
        selectedColumns.role ? {
            title: "Roli",
            dataIndex: "role",
            key: "role",
        } : null,
        {
            title: "Amallar",
            render: (_: any, record: User) => (
                <Space>
                    <Button onClick={() => {
                        setSelectedUser(record);
                        setEditVisible(true);
                    }}>Tahrirlash</Button>
                    <Popconfirm title="Rostdan ham o‘chirmoqchimisiz?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger>O‘chirish</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ].filter((column): column is Exclude<typeof column, null> => column !== null);
    
    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Foydalanuvchilar Ro‘yxati</Title>
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <Search placeholder="Qidirish..." onSearch={handleSearch} style={{ width: 300 }} />
                <Space>
                    <Button onClick={() => setVisibilityVisible(true)}>Ustunlarni tanlash</Button>
                    <Button type="primary" onClick={() => setAddVisible(true)}>Foydalanuvchi Qo‘shish</Button>
                </Space>
            </div>
            <Table 
                columns={columns} 
                dataSource={filteredUsers} 
                rowKey="id" 
                bordered 
                pagination={{ pageSize: 5 }}
            />
            
            <VisiblityComponent 
                selectedColumns={selectedColumns} 
                setSelectedColumns={setSelectedColumns} 
                visible={visibilityVisible} 
                onClose={() => setVisibilityVisible(false)}
            />
            
            <Drawer title="Foydalanuvchi Qo‘shish" open={addVisible} onClose={() => setAddVisible(false)}>
                <AddComponents onClose={() => { setAddVisible(false); fetchUsers(); }} />
            </Drawer>
            <Drawer title="Foydalanuvchini Tahrirlash" open={editVisible} onClose={() => setEditVisible(false)}>
                <EditCommponents user={selectedUser} onClose={() => { setEditVisible(false); fetchUsers(); }} />
            </Drawer>
        </div>
    );
};

export default Users;
