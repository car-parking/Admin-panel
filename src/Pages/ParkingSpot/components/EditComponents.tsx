import { useAxios } from "../../../hook/useAxsios";
import { useEffect, useState } from "react";
import { Button, Input, Form, message, Select, InputNumber, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

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

    const findCoordinates = async () => {
        try {
            const address = form.getFieldValue('address');
            if (!address) {
                message.warning("Avval manzilni kiriting!");
                return;
            }

            // OpenStreetMap Nominatim API dan foydalanish
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=uz`,
                {
                    headers: {
                        'Accept-Language': 'uz', // Uzbek tilida natijalarni olish
                        'User-Agent': 'ParkingApp/1.0' // API talabi
                    }
                }
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                form.setFieldsValue({
                    latitude: lat,
                    longitude: lon
                });
                message.success("Koordinatalar topildi!");
            } else {
                message.error("Koordinatalar topilmadi! Manzilni aniqroq kiriting");
            }
        } catch (error) {
            console.error("Koordinatalarni topishda xatolik:", error);
            message.error("Koordinatalarni topishda xatolik!");
        }
    };

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
                <Space.Compact style={{ width: '100%' }}>
                    <Input placeholder="Manzilni kiriting" />
                    <Button 
                        icon={<SearchOutlined />} 
                        onClick={findCoordinates}
                        title="Koordinatalarni topish"
                    />
                </Space.Compact>
            </Form.Item>

            <Form.Item label="Koordinatalar">
                <Space style={{ width: '100%' }}>
                    <Form.Item
                        name="longitude"
                        rules={[{ required: true, message: "Longitude majburiy!" }]}
                        style={{ marginBottom: 0, width: '50%' }}
                    >
                        <InputNumber 
                            placeholder="Longitude" 
                            style={{ width: '100%' }} 
                            precision={6}
                        />
                    </Form.Item>
                    <Form.Item
                        name="latitude"
                        rules={[{ required: true, message: "Latitude majburiy!" }]}
                        style={{ marginBottom: 0, width: '50%' }}
                    >
                        <InputNumber 
                            placeholder="Latitude" 
                            style={{ width: '100%' }} 
                            precision={6}
                        />
                    </Form.Item>
                </Space>
            </Form.Item>

            <Form.Item label="B toifali joylar">
                <Space style={{ width: '100%' }}>
                    <Form.Item
                        name="b_total_spots"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 0, width: '33%' }}
                    >
                        <InputNumber placeholder="Umumiy" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="b_available_spots"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 0, width: '33%' }}
                    >
                        <InputNumber placeholder="Bo'sh" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="b_cost"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 0, width: '33%' }}
                    >
                        <InputNumber placeholder="Narxi" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                </Space>
            </Form.Item>

            <Form.Item label="C toifali joylar">
                <Space style={{ width: '100%' }}>
                    <Form.Item
                        name="c_total_spots"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 0, width: '33%' }}
                    >
                        <InputNumber placeholder="Umumiy" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="c_available_spots"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 0, width: '33%' }}
                    >
                        <InputNumber placeholder="Bo'sh" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="c_cost"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 0, width: '33%' }}
                    >
                        <InputNumber placeholder="Narxi" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                </Space>
            </Form.Item>

            <Form.Item label="Elektromobil joylari">
                <Space style={{ width: '100%' }}>
                    <Form.Item
                        name="ev_total_spots"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 0, width: '33%' }}
                    >
                        <InputNumber placeholder="Umumiy" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="ev_available_spots"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 0, width: '33%' }}
                    >
                        <InputNumber placeholder="Bo'sh" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="ev_charging_cost"
                        rules={[{ required: true }]}
                        style={{ marginBottom: 0, width: '33%' }}
                    >
                        <InputNumber placeholder="Zaryadlash narxi" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                </Space>
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