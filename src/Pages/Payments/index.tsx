import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, message, Space, Input } from 'antd';
import { useAxios } from '../../hook/useAxsios';
import PaymentDetails from './components/PaymentDetails';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import TableVisibilityComponent from '../../components/TableVisibilityComponent';
import VisibilityComponent from '../../components/VisibilityComponent';

const { Search } = Input;

interface Payment {
    id: string;
    amount: number;
    payment_method: string;
    payment_status: string;
    transaction_id: string;
    card_id: string;
    reservation_id: string;
    created_at: string;
}

const Payments = () => {
    const axios = useAxios();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
        id: true,
        amount: true,
        payment_method: true,
        payment_status: true,
        transaction_id: true,
        created_at: true,
        actions: true,
    });

    const getStatusCounts = () => {
        const counts: { [key: string]: number } = {
            pending: 0,
            completed: 0,
            failed: 0
        };

        payments.forEach(payment => {
            if (counts[payment.payment_status] !== undefined) {
                counts[payment.payment_status]++;
            }
        });

        return counts;
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await axios({ url: '/payments' });
            const data = Array.isArray(response) ? response : response.data || [];
            setPayments(data);
            setFilteredPayments(data);
        } catch (error) {
            message.error("To'lovlarni yuklashda xatolik!");
            setPayments([]);
            setFilteredPayments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleSearch = (value: string) => {
        const searchText = value.toLowerCase();
        const filtered = payments.filter(payment =>
            payment.id.toLowerCase().includes(searchText) ||
            payment.payment_method.toLowerCase().includes(searchText) ||
            payment.payment_status.toLowerCase().includes(searchText) ||
            payment.transaction_id.toLowerCase().includes(searchText) ||
            payment.amount.toString().includes(searchText)
        );
        setFilteredPayments(filtered);
    };

    const handleDelete = async (id: string) => {
        try {
            await axios({
                url: `/payments/${id}`,
                method: 'DELETE'
            });
            message.success("To'lov o'chirildi");
            fetchPayments();
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
            title: 'Summa',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `${amount.toLocaleString()} so'm`,
        },
        {
            title: "To'lov usuli",
            dataIndex: 'payment_method',
            key: 'payment_method',
        },
        {
            title: 'Holati',
            dataIndex: 'payment_status',
            key: 'payment_status',
            render: (status: string) => {
                const statusColors = {
                    pending: 'orange',
                    completed: 'green',
                    failed: 'red',
                };
                return (
                    <span style={{ color: statusColors[status as keyof typeof statusColors] }}>
                        {status}
                    </span>
                );
            },
        },
        {
            title: 'Tranzaksiya ID',
            dataIndex: 'transaction_id',
            key: 'transaction_id',
        },
        {
            title: 'Sana',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Amallar',
            key: 'actions',
            render: (_: any, record: Payment) => (
                <Space>
                    <Button 
                        type="link" 
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedPayment(record.id);
                            setIsEditMode(false);
                            setIsModalVisible(true);
                        }}
                    />
                    <Button 
                        type="link" 
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedPayment(record.id);
                            setIsEditMode(true);
                            setIsModalVisible(true);
                        }}
                    />
                    <Button 
                        type="link" 
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
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
        setSelectedPayment(undefined);
        setIsEditMode(false);
        setIsAddMode(false);
    };

    return (
        <div style={{ padding: 24 }}>
            <VisibilityComponent
                totalCount={payments.length}
                statusCounts={getStatusCounts()}
                type="payment"
            />

            <div style={{ marginBottom: 16 }}>
                <h2>To'lovlar</h2>
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
                        >
                            Yangi to'lov
                        </Button>
                    </Space>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredPayments}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title={isAddMode ? "Yangi to'lov" : isEditMode ? "To'lovni tahrirlash" : "To'lov tafsilotlari"}
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
            >
                {(selectedPayment || isAddMode) && (
                    <PaymentDetails
                        paymentId={selectedPayment}
                        isEditMode={isEditMode}
                        isAddMode={isAddMode}
                        onClose={handleModalClose}
                        onUpdate={fetchPayments}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Payments; 