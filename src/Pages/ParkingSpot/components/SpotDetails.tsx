import { useEffect, useState } from 'react';
import { Card, Rate, List, Upload, Button, message, Space, InputNumber, Image, Carousel } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAxios } from '../../../hook/useAxsios';

interface ParkingImage {
    id: string;
    image: string;
}

interface ParkingComment {
    id: string;
    user_id: string;
    raiting: number;
    comment: string;
    created_at: string;
}

interface ParkingSpot {
    id: string;
    location_name: string;
    address: string;
    longitude: string;
    latitude: string;
    b_total_spots: number;
    c_total_spots: number;
    b_available_spots: number;
    c_available_spots: number;
    cost: number;
    rating: number;
    images: ParkingImage[];
    comments: ParkingComment[];
}

interface SpotDetailsProps {
    parkingId: string;
    onClose: () => void;
    onUpdate: () => void;
}

const SpotDetails: React.FC<SpotDetailsProps> = ({ parkingId, onClose, onUpdate }) => {
    const axios = useAxios();
    const [spot, setSpot] = useState<ParkingSpot | null>(null);
    const [bSpots, setBSpots] = useState<number>(0);
    const [cSpots, setCSpots] = useState<number>(0);

    const fetchSpotDetails = async () => {
        try {
            const data = await axios({ url: `/parking-spots/${parkingId}` });
            setSpot(data);
            setBSpots(data.b_available_spots);
            setCSpots(data.c_available_spots);
        } catch (error) {
            message.error("Ma'lumotlarni yuklashda xatolik!");
        }
    };

    useEffect(() => {
        fetchSpotDetails();
    }, [parkingId]);

    const updateSpots = async () => {
        try {
            await axios({
                url: `/parking-spots/${parkingId}`,
                method: 'PATCH',
                params: { bSpots, cSpots }
            });
            message.success("Joylar soni yangilandi");
            onUpdate();
            onClose();
        } catch (error) {
            message.error("Yangilashda xatolik!");
        }
    };

    const uploadImage = async (options: any) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios({
                url: `/parking-spots/upload/${parkingId}`,
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSuccess("OK");
            message.success("Rasm yuklandi");
            fetchSpotDetails(); // Rasmlar ro'yxatini yangilash
        } catch (error) {
            onError("Rasm yuklashda xatolik!");
        }
    };

    const deleteImage = async (fileName: string) => {
        try {
            const cleanFileName = fileName 
            // .replace('/uploads/', '/uploads/https://backend-production-149c.up.railway.app');
            
            await axios({
                url: '/parking-spots/delete-image',
                method: 'POST',
                body: { fileName: cleanFileName }
            });
            message.success("Rasm o'chirildi");
            fetchSpotDetails();
        } catch (error) {
            message.error("Rasmni o'chirishda xatolik!");
        }
    };

    if (!spot) return null;

    return (
        <div>
            <Card title={spot.location_name}>
                <p><strong>Manzil:</strong> {spot.address}</p>
                <p><strong>Koordinatalar:</strong> {spot.longitude}, {spot.latitude}</p>
                <p><strong>Narx:</strong> {spot.cost?.toLocaleString()} so'm</p>
                <p><strong>Reyting:</strong> <Rate disabled defaultValue={spot.rating} /></p>
                
                <div style={{ marginBottom: 16 }}>
                    <h4>Bo'sh joylarni yangilash</h4>
                    <Space>
                        <InputNumber 
                            value={bSpots} 
                            onChange={value => setBSpots(value || 0)} 
                            placeholder="B toifa" 
                            min={0}
                            max={spot.b_total_spots}
                        />
                        <InputNumber 
                            value={cSpots} 
                            onChange={value => setCSpots(value || 0)} 
                            placeholder="C toifa" 
                            min={0}
                            max={spot.c_total_spots}
                        />
                        <Button type="primary" onClick={updateSpots}>
                            Yangilash
                        </Button>
                    </Space>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <h4>Rasmlar</h4>
                    <Upload
                        customRequest={uploadImage}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
                    </Upload>

                    {spot.images && spot.images.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <Carousel autoplay>
                                {spot?.images?.map((img) => (
                                    <div key={img?.id}>
                                        <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                                            <Image
                                                src={`https://backend-production-149c.up.railway.app${img.image}`}
                                                alt="Parkinwg"
                                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                            />
                                            <Button 
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => deleteImage(img.image)}
                                                style={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    )}
                </div>

                <div>
                    <h4>Izohlar</h4>
                    <List
                        dataSource={spot.comments}
                        renderItem={comment => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <Rate 
                                            disabled 
                                            defaultValue={comment.raiting} 
                                            style={{ fontSize: 16 }}
                                        />
                                    }
                                    description={
                                        <>
                                            <p>{comment.comment}</p>
                                            <small>
                                                {new Date(parseInt(comment.created_at)).toLocaleDateString()}
                                            </small>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </Card>
        </div>
    );
};

export default SpotDetails; 