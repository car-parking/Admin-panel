import { useAxios } from "../../../hook/useAxsios";
import { useState } from "react";
import { Button, Input, Form, message, Select, InputNumber } from "antd";

const AddComponents: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const axios = useAxios();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        setLoading(true);
        axios({url: "/parking-spots", body: values})
            .then(() => {
                message.success("Parking joy muvaffaqiyatli qo'shildi!");
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
            <Form.Item 
                label="Joylashuv nomi" 
                name="location_name" 
                rules={[{ required: true, message: "Joylashuv nomi majburiy!" }]}
            >
                <Input placeholder="Joylashuv nomini kiriting" />
            </Form.Item>

            <Form.Item 
                label="Manzil" 
                name="address" 
                rules={[{ required: true, message: "Manzil majburiy!" }]}
            >
                <Input placeholder="Manzilni kiriting" />
            </Form.Item>

            <Form.Item label="Koordinatalar">
                <Input.Group compact>
                    <Form.Item
                        name="longitude"
                        rules={[{ required: true, message: "Longitude majburiy!" }]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '16px' }}
                    >
                        <InputNumber placeholder="Longitude" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="latitude"
                        rules={[{ required: true, message: "Latitude majburiy!" }]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    >
                        <InputNumber placeholder="Latitude" style={{ width: '100%' }} />
                    </Form.Item>
                </Input.Group>
            </Form.Item>

            <Form.Item label="B toifali joylar">
                <Input.Group compact>
                    <Form.Item
                        name="b_total_spots"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '16px' }}
                    >
                        <InputNumber placeholder="Umumiy" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="b_cost"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    >
                        <InputNumber placeholder="Narxi" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                </Input.Group>
            </Form.Item>

            <Form.Item label="C toifali joylar">
                <Input.Group compact>
                    <Form.Item
                        name="c_total_spots"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '16px' }}
                    >
                        <InputNumber placeholder="Umumiy" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="c_cost"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    >
                        <InputNumber placeholder="Narxi" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                </Input.Group>
            </Form.Item>

            <Form.Item label="Elektromobil joylari">
                <Input.Group compact>
                    <Form.Item
                        name="ev_total_spots"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '16px' }}
                    >
                        <InputNumber placeholder="Umumiy" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="ev_charging_cost"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    >
                        <InputNumber placeholder="Zaryadlash narxi" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                </Input.Group>
            </Form.Item>

            <Form.Item 
                label="Parking turi" 
                name="parking_type" 
                rules={[{ required: true, message: "Parking turi majburiy!" }]}
            >
                <Select placeholder="Parking turini tanlang">
                    <Select.Option value="open">Ochiq</Select.Option>
                    <Select.Option value="closed">Yopiq</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item 
                label="Admin ID" 
                name="admin_id" 
                rules={[{ required: true, message: "Admin ID majburiy!" }]}
            >
                <Input placeholder="Admin ID-sini kiriting" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Saqlash
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddComponents; 