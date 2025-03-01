import { useEffect, useState } from 'react';
import { Card, Button, message, Descriptions, Space, Form, Input, Select, DatePicker } from 'antd';
import { useAxios } from '../../../hook/useAxsios';
import dayjs from 'dayjs';

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

interface ReservationDetailsProps {
    reservationId?: string;
    isEditMode?: boolean;
    isAddMode?: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({ 
    reservationId, 
    isEditMode = false,
    isAddMode = false,
    onClose, 
    onUpdate 
}) => {
    const axios = useAxios();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchReservationDetails = async () => {
        if (!reservationId) return;
        
        setLoading(true);
        try {
            const data = await axios({ url: `/reservations/${reservationId}` });
            setReservation(data);
            if (isEditMode) {
                form.setFieldsValue({
                    ...data,
                    start_time: dayjs(data.start_time),
                    end_time: dayjs(data.end_time)
                });
            }
        } catch (error) {
            message.error("Rezervatsiya ma'lumotlarini yuklashda xatolik!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reservationId && !isAddMode) {
            fetchReservationDetails();
        }
    }, [reservationId]);

    const handleSubmit = async (values: any) => {
        const formattedValues = {
            ...values,
            start_time: values.start_time.toISOString(),
            end_time: values.end_time.toISOString()
        };

        try {
            if (isAddMode) {
                await axios({
                    url: '/reservations',
                    method: 'POST',
                    body: formattedValues
                });
                message.success("Rezervatsiya qo'shildi");
            } else if (isEditMode && reservationId) {
                await axios({
                    url: `/reservations/${reservationId}`,
                    method: 'PUT',
                    body: formattedValues
                });
                message.success("Rezervatsiya yangilandi");
            }
            onUpdate();
            onClose();
        } catch (error) {
            message.error(isAddMode ? "Qo'shishda xatolik!" : "Yangilashda xatolik!");
        }
    };

    if (!isEditMode && !isAddMode) {
        if (!reservation) return null;

        return (
            <Card loading={loading}>
                <Descriptions title="Rezervatsiya tafsilotlari" bordered column={1}>
                    <Descriptions.Item label="ID">{reservation.id}</Descriptions.Item>
                    <Descriptions.Item label="Boshlanish vaqti">
                        {new Date(reservation.start_time).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tugash vaqti">
                        {new Date(reservation.end_time).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Holati">
                        <span style={{
                            color: reservation.status === 'active' ? 'green' :
                                   reservation.status === 'pending' ? 'orange' :
                                   reservation.status === 'completed' ? 'blue' : 'red'
                        }}>
                            {reservation.status}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Mashina turi">
                        {reservation.car_type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Foydalanuvchi ID">
                        {reservation.user_id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Parking ID">
                        {reservation.spot_id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Yaratilgan sana">
                        {new Date(reservation.created_at).toLocaleString()}
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
                    status: 'pending',
                    car_type: 'B'
                }}
            >
                <Form.Item
                    name="start_time"
                    label="Boshlanish vaqti"
                    rules={[{ required: true, message: "Boshlanish vaqtini kiriting!" }]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>

                <Form.Item
                    name="end_time"
                    label="Tugash vaqti"
                    rules={[{ required: true, message: "Tugash vaqtini kiriting!" }]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Holati"
                    rules={[{ required: true, message: "Holatni tanlang!" }]}
                >
                    <Select>
                        <Select.Option value="pending">Kutilmoqda</Select.Option>
                        <Select.Option value="active">Faol</Select.Option>
                        <Select.Option value="completed">Yakunlangan</Select.Option>
                        <Select.Option value="cancelled">Bekor qilingan</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="car_type"
                    label="Mashina turi"
                    rules={[{ required: true, message: "Mashina turini tanlang!" }]}
                >
                    <Select>
                        <Select.Option value="B">B toifa</Select.Option>
                        <Select.Option value="C">C toifa</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="user_id"
                    label="Foydalanuvchi ID"
                    rules={[{ required: true, message: "Foydalanuvchi ID ni kiriting!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="spot_id"
                    label="Parking ID"
                    rules={[{ required: true, message: "Parking ID ni kiriting!" }]}
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

export default ReservationDetails; 