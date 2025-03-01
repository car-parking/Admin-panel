import { useAxios } from "../../../hook/useAxsios";
import { useEffect, useState } from "react";
import { Button, Input, Form, message, Select } from "antd";

const { Option } = Select;

const EditComponents: React.FC<{ user: any; onClose: () => void }> = ({ user, onClose }) => {
    const axios = useAxios();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue(user);
        }
    }, [user, form]);

    const onFinish = (values: any) => {
        setLoading(true);
        axios({
            url: `/users/${user.id}`,
            method: "PUT",
            body: values
        })
            .then(() => {
                message.success("Foydalanuvchi muvaffaqiyatli yangilandi!");
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
            <Form.Item 
                label="Ism Familiya" 
                name="full_name" 
                rules={[{ required: true, message: "Ism familiya majburiy!" }]}
            >
                <Input placeholder="Ism Familiyani kiriting" />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Email majburiy!" },
                    { type: "email", message: "Email noto‘g‘ri formatda!" }
                ]}
            >
                <Input placeholder="Emailni kiriting" />
            </Form.Item>

            <Form.Item
                label="Telefon"
                name="phone_number"
                rules={[{ required: true, message: "Telefon raqam majburiy!" }]}
            >
                <Input placeholder="Telefon raqamini kiriting" />
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
                    Yangilash
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditComponents;
