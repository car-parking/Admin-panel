import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, message, Space, Input } from 'antd';
import { useAxios } from '../../hook/useAxsios';
import ReservationDetails from './components/ReservationDetails';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import VisibilityComponent from '../../components/VisibilityComponent';
import TableVisibilityComponent from '../../components/TableVisibilityComponent';

const { Search } = Input;

interface Reservation {
    id: string;
    start_time: string;
    end_time: string;
    status: string;
    user_id: string;
    spot_id: string;
    car_type: string;
    created_at: string;
}

const Reservations = () => {
    const axios = useAxios();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
        id: true,
        start_time: true,
        end_time: true,
        status: true,
        car_type: true,
        user_id: true,
        spot_id: true,
        actions: true,
    });

    const getStatusCounts = () => {
        const counts: { [key: string]: number } = {
            active: 0,
            pending: 0,
            completed: 0,
            cancelled: 0
        };

        reservations.forEach(reservation => {
            if (counts[reservation.status] !== undefined) {
                counts[reservation.status]++;
            }
        });

        return counts;
    };

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await axios({ url: '/reservations' });
            const data = Array.isArray(response) ? response : response.data || [];
            setReservations(data);
            setFilteredReservations(data);
        } catch (error) {
            message.error("Rezervatsiyalarni yuklashda xatolik!");
            setReservations([]);
            setFilteredReservations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleSearch = (value: string) => {
        const searchText = value.toLowerCase();
        const filtered = reservations.filter(reservation =>
            reservation.id.toLowerCase().includes(searchText) ||
            reservation.status.toLowerCase().includes(searchText) ||
            reservation.car_type.toLowerCase().includes(searchText) ||
            reservation.user_id.toLowerCase().includes(searchText) ||
            reservation.spot_id.toLowerCase().includes(searchText) ||
            new Date(reservation.start_time).toLocaleString().toLowerCase().includes(searchText) ||
            new Date(reservation.end_time).toLocaleString().toLowerCase().includes(searchText)
        );
        setFilteredReservations(filtered);
    };

    const handleDelete = async (id: string) => {
        try {
            await axios({
                url: `/reservations/${id}`,
                method: 'DELETE'
            });
            message.success("Rezervatsiya o'chirildi");
            fetchReservations();
        } catch (error) {
            message.error("O'chirishda xatolik!");
        }
    };

    const baseColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Boshlanish vaqti',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Tugash vaqti',
            dataIndex: 'end_time',
            key: 'end_time',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Holati',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusColors = {
                    active: 'green',
                    pending: 'orange',
                    completed: 'blue',
                    cancelled: 'red',
                };
                return (
                    <span style={{ color: statusColors[status as keyof typeof statusColors] }}>
                        {status}
                    </span>
                );
            },
        },
        {
            title: 'Mashina turi',
            dataIndex: 'car_type',
            key: 'car_type',
        },
        {
            title: 'Foydalanuvchi ID',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Parking ID',
            dataIndex: 'spot_id',
            key: 'spot_id',
        },
        {
            title: 'Amallar',
            key: 'actions',
            render: (_: any, record: Reservation) => (
                <Space>
                    <Button 
                        type="text" 
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedReservation(record.id);
                            setIsEditMode(false);
                            setIsModalVisible(true);
                        }}
                        style={{
                            border: '1px solid #d9d9d9',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            borderRadius: '6px'
                        }}
                    />
                    <Button 
                        type="text" 
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedReservation(record.id);
                            setIsEditMode(true);
                            setIsModalVisible(true);
                        }}
                        style={{
                            border: '1px solid #d9d9d9',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            borderRadius: '6px'
                        }}
                    />
                    <Button 
                        type="text" 
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        style={{
                            border: '1px solid #ff4d4f',
                            boxShadow: '0 2px 4px rgba(255,77,79,0.8)',
                            borderRadius: '6px'
                        }}
                    />
                </Space>
            ),
        },
    ];

    const columns = useMemo(() => {
        return baseColumns.filter(col => visibleColumns[col.key]);
    }, [visibleColumns]);

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

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedReservation(undefined);
        setIsEditMode(false);
        setIsAddMode(false);
    };

    return (
        <div style={{ padding: 24 }}>
            <VisibilityComponent
                totalCount={reservations.length}
                statusCounts={getStatusCounts()}
                type="reservation"
            />

            <div style={{ marginBottom: 16 }}>
                <h2>Rezervatsiyalar</h2>
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
                            onClick={() => {
                                setIsAddMode(true);
                                setIsModalVisible(true);
                            }}
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
                dataSource={filteredReservations}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title={isAddMode ? "Yangi rezervatsiya" : isEditMode ? "Rezervatsiyani tahrirlash" : "Rezervatsiya tafsilotlari"}
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
            >
                {(selectedReservation || isAddMode) && (
                    <ReservationDetails
                        reservationId={selectedReservation}
                        isEditMode={isEditMode}
                        isAddMode={isAddMode}
                        onClose={handleModalClose}
                        onUpdate={fetchReservations}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Reservations; 