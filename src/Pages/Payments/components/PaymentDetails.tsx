import { useEffect, useState } from 'react';
import { Card, Button, message, Descriptions, Space, Form, Input, Select } from 'antd';
import { useAxios } from '../../../hook/useAxsios';

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

interface PaymentDetailsProps {
    paymentId?: string;
    isEditMode?: boolean;
    isAddMode?: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ 
    paymentId, 
    isEditMode = false,
    isAddMode = false,
    onClose, 
    onUpdate 
}) => {
    const axios = useAxios();
    const [payment, setPayment] = useState<Payment | null>(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchPaymentDetails = async () => {
        if (!paymentId) return;
        
        setLoading(true);
        try {
            const data = await axios({ url: `/payments/${paymentId}` });
            setPayment(data);
            if (isEditMode) {
                form.setFieldsValue(data);
            }
        } catch (error) {
            message.error("To'lov ma'lumotlarini yuklashda xatolik!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (paymentId && !isAddMode) {
            fetchPaymentDetails();
        }
    }, [paymentId]);

    const handleSubmit = async (values: any) => {
        try {
            if (isAddMode) {
                await axios({
                    url: '/payments',
                    method: 'POST',
                    body: values
                });
                message.success("To'lov qo'shildi");
            } else if (isEditMode && paymentId) {
                await axios({
                    url: `/payments/${paymentId}`,
                    method: 'PUT',
                    body: values
                });
                message.success("To'lov yangilandi");
            }
            onUpdate();
            onClose();
        } catch (error) {
            message.error(isAddMode ? "Qo'shishda xatolik!" : "Yangilashda xatolik!");
        }
    };

    if (!isEditMode && !isAddMode) {
        if (!payment) return null;

        return (
            <Card loading={loading}>
                <Descriptions title="To'lov tafsilotlari" bordered column={1}>
                    <Descriptions.Item label="ID">{payment.id}</Descriptions.Item>
                    <Descriptions.Item label="Summa">
                        {payment.amount.toLocaleString()} so'm
                    </Descriptions.Item>
                    <Descriptions.Item label="To'lov usuli">
                        {payment.payment_method}
                    </Descriptions.Item>
                    <Descriptions.Item label="Holati">
                        <span style={{
                            color: payment.payment_status === 'completed' ? 'green' :
                                   payment.payment_status === 'pending' ? 'orange' : 'red'
                        }}>
                            {payment.payment_status}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tranzaksiya ID">
                        {payment.transaction_id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Karta ID">
                        {payment.card_id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Rezervatsiya ID">
                        {payment.reservation_id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Sana">
                        {new Date(payment.created_at).toLocaleString()}
                    </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <Button onClick={onClose}>
                        Yopish
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card loading={loading}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    payment_status: 'pending',
                    payment_method: 'card'
                }}
            >
                <Form.Item
                    name="amount"
                    label="Summa"
                    rules={[{ required: true, message: "Summani kiriting!" }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="payment_method"
                    label="To'lov usuli"
                    rules={[{ required: true, message: "To'lov usulini tanlang!" }]}
                >
                    <Select>
                        <Select.Option value="card">Karta</Select.Option>
                        <Select.Option value="cash">Naqd</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="payment_status"
                    label="Holati"
                    rules={[{ required: true, message: "Holatni tanlang!" }]}
                >
                    <Select>
                        <Select.Option value="pending">Kutilmoqda</Select.Option>
                        <Select.Option value="completed">Yakunlangan</Select.Option>
                        <Select.Option value="failed">Bekor qilingan</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="transaction_id"
                    label="Tranzaksiya ID"
                    rules={[{ required: true, message: "Tranzaksiya ID ni kiriting!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="card_id"
                    label="Karta ID"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="reservation_id"
                    label="Rezervatsiya ID"
                    rules={[{ required: true, message: "Rezervatsiya ID ni kiriting!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item style={{ marginTop: 16, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={onClose}>
                            Bekor qilish
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {isAddMode ? "Qo'shish" : "Saqlash"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default PaymentDetails; 