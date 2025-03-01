import { useAxios } from "../../../hook/useAxsios";
import { useEffect, useState } from "react";
import { Button, Input, Form, message, Select, InputNumber } from "antd";

interface EditComponentsProps {
    parkingSpot: any;
    onClose: () => void;
}

const EditComponents: React.FC<EditComponentsProps> = ({ parkingSpot, onClose }) => {
    const axios = useAxios();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (parkingSpot) {
            form.setFieldsValue(parkingSpot);
        }
    }, [parkingSpot, form]);

    const onFinish = (values: any) => {
        setLoading(true);
        axios({
            url: `/parking-spots/${parkingSpot.id}`,
            method: "PUT",
            body: values
        })
            .then(() => {
                message.success("Parking joy muvaffaqiyatli yangilandi!");
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
            {/* AddComponents dagi forma elementlarining aynan o'zi */}
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
                        style={{ display: 'inline-block', width: 'calc(33% - 8px)', marginRight: '8px' }}
                    >
                        <InputNumber placeholder="Umumiy" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="b_available_spots"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(33% - 8px)', marginRight: '8px' }}
                    >
                        <InputNumber placeholder="Bo'sh" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="b_cost"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}
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
                        style={{ display: 'inline-block', width: 'calc(33% - 8px)', marginRight: '8px' }}
                    >
                        <InputNumber placeholder="Umumiy" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="c_available_spots"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(33% - 8px)', marginRight: '8px' }}
                    >
                        <InputNumber placeholder="Bo'sh" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="c_cost"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}
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
                        style={{ display: 'inline-block', width: 'calc(33% - 8px)', marginRight: '8px' }}
                    >
                        <InputNumber placeholder="Umumiy" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="ev_available_spots"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(33% - 8px)', marginRight: '8px' }}
                    >
                        <InputNumber placeholder="Bo'sh" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="ev_charging_cost"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}
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
                    Yangilash
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditComponents; 