import { useAxios } from "../../../hook/useAxsios";
import { useState } from "react";
import {  Button, Input, Form,message, Select } from "antd";
import { Option } from "antd/es/mentions";



const AddComponents: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const axios = useAxios();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        setLoading(true);
        axios({url:"/users", body:values})
            .then(() => {
                message.success("Foydalanuvchi muvaffaqiyatli qo‘shildi!");
                form.resetFields();
                onClose();
            })
            .catch(() => {
                message.error("Xatolik yuz berdi!");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Ism Familiya" name="full_name" rules={[{ required: true, message: "Ism familiya majburiy!" }]}>
                <Input placeholder="Ism Familiyani kiriting" />
            </Form.Item>
            <Form.Item
                label="Email yoki Telefon"
                name="contact"
                rules={[{ required: true, message: "Email yoki telefon majburiy!" }]}
            >
                <Input placeholder="Email yoki telefonni kiriting" />
            </Form.Item>
            <Form.Item label="Parol" name="password" rules={[{ required: true, message: "Parol majburiy!" }]}>
                <Input.Password placeholder="Parolni kiriting" />
            </Form.Item>
            <Form.Item label="Roli" name="role" rules={[{ required: true, message: "Roli majburiy!" }]}>
                <Select placeholder="Rolni tanlang">
                    <Option value="USER">Foydalanuvchi</Option>
                    <Option value="PARKING_ADMIN">Parking Admin</Option>
                    <Option value="ADMIN">Admin</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Saqlash
                </Button>
            </Form.Item>
        </Form>
    );
};


export default AddComponents