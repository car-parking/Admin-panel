import { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { useAxios } from '../../../hook/useAxsios';
import type { ParkingSpot } from '../types';

interface NearbySpotProps {
    longitude: number;
    latitude: number;
    radius: number;
}

const NearbySpots: React.FC<NearbySpotProps> = ({ longitude, latitude, radius }) => {
    const axios = useAxios();
    const [spots, setSpots] = useState<ParkingSpot[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNearbySpots = async () => {
        setLoading(true);
        try {
            const data = await axios({
                url: `/parking-spots/${radius}/${longitude}/${latitude}`
            });
            setSpots(data);
        } catch (error) {
            message.error("Yaqin atrofdagi joylarni yuklashda xatolik!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNearbySpots();
    }, [longitude, latitude, radius]);

    const columns = [
        {
            title: 'Joylashuv',
            dataIndex: 'location_name',
            key: 'location_name',
        },
        {
            title: 'Manzil',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Masofa (km)',
            dataIndex: 'distance',
            key: 'distance',
            render: (distance: number) => distance.toFixed(2),
        },
        {
            title: "Bo'sh joylar (B)",
            dataIndex: 'b_available_spots',
            key: 'b_available_spots',
        },
        {
            title: "Bo'sh joylar (C)",
            dataIndex: 'c_available_spots',
            key: 'c_available_spots',
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={spots}
            loading={loading}
            rowKey="id"
            pagination={false}
        />
    );
};

export default NearbySpots; 