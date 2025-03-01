import { useEffect, useState } from "react";
import { Table, Typography, Button, Drawer, Input, Space, Popconfirm } from "antd";
import { useAxios } from "../../hook/useAxsios";
import { AddComponents, EditComponents, VisiblityComponent } from "./components";
import SpotDetails from './components/SpotDetails';

const { Title } = Typography;
const { Search } = Input;

type ParkingSpot = {
    id: number;
    location_name: string;
    address: string;
    longitude: number;
    latitude: number;
    b_total_spots: number;
    c_total_spots: number;
    b_available_spots: number;
    c_available_spots: number;
    b_cost: number;
    c_cost: number;
    ev_total_spots: number;
    ev_available_spots: number;
    ev_charging_cost: number;
    parking_type: string;
    admin_id: string;
};

const ParkingSpots: React.FC = () => {
    const axios = useAxios();
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
    const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({
        id: true,
        location_name: true,
        address: true,
        b_total_spots: true,
        c_total_spots: true,
        parking_type: true,
    });
    const [addVisible, setAddVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [visibilityVisible, setVisibilityVisible] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [selectedSpotId, setSelectedSpotId] = useState<string>('');


    const fetchParkingSpots = () => {
        axios({url: "/parking-spots"})
            .then((res) => {
                console.log(res);
                
                const sortedSpots = res.data
                    .filter((spot: ParkingSpot) => spot?.location_name)
                    .sort((a: ParkingSpot, b: ParkingSpot) => 
                        a.location_name.localeCompare(b.location_name));
                setParkingSpots(sortedSpots);
                setFilteredSpots(sortedSpots);
            })
            .catch((err) => {
                console.error("Error fetching parking spots:", err);
            });
    };

    useEffect(() => {
        fetchParkingSpots();
    }, []);

    const handleSearch = (value: string) => {
        const filtered = parkingSpots.filter(spot =>
            spot.location_name.toLowerCase().includes(value.toLowerCase()) ||
            spot.address.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSpots(filtered);
    };

    const handleDelete = (id: number) => {
        axios({url: `/parking-spots/${id}`, method: "DELETE"})
            .then(() => {
                fetchParkingSpots();
            })
            .catch(err => console.error("Error deleting parking spot:", err));
    };

    const columns = [
        selectedColumns.id ? {
            title: "ID",
            dataIndex: "id",
            key: "id",
        } : null,
        selectedColumns.location_name ? {
            title: "Joylashuv nomi",
            dataIndex: "location_name",
            key: "location_name",
        } : null,
        selectedColumns.address ? {
            title: "Manzil",
            dataIndex: "address",
            key: "address",
        } : null,
        selectedColumns.b_total_spots ? {
            title: "B joylar soni",
            dataIndex: "b_total_spots",
            key: "b_total_spots",
        } : null,
        selectedColumns.c_total_spots ? {
            title: "C joylar soni",
            dataIndex: "c_total_spots",
            key: "c_total_spots",
        } : null,
        selectedColumns.parking_type ? {
            title: "Parking turi",
            dataIndex: "parking_type",
            key: "parking_type",
        } : null,
        {
            title: "Amallar",
            render: (_: any, record: ParkingSpot) => (
                <Space>
                    <Button onClick={() => {
                        setSelectedSpotId(record.id.toString());
                        setDetailsVisible(true);
                    }}>Batafsil</Button>
                    <Button onClick={() => {
                        setSelectedSpot(record);
                        setEditVisible(true);
                    }}>Tahrirlash</Button>
                    <Popconfirm 
                        title="Rostdan ham o'chirmoqchimisiz?" 
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger>O'chirish</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ].filter((column): column is Exclude<typeof column, null> => column !== null);

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Parking Joylari Ro'yxati</Title>
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <Search placeholder="Qidirish..." onSearch={handleSearch} style={{ width: 300 }} />
                <Space>
                    <Button onClick={() => setVisibilityVisible(true)}>Ustunlarni tanlash</Button>
                    <Button type="primary" onClick={() => setAddVisible(true)}>
                        Parking Joy Qo'shish
                    </Button>
                </Space>
            </div>
            <Table 
                columns={columns} 
                dataSource={filteredSpots} 
                rowKey="id" 
                bordered 
                pagination={{ pageSize: 5 }}
            />
            
            <VisiblityComponent 
                selectedColumns={selectedColumns} 
                setSelectedColumns={setSelectedColumns} 
                visible={visibilityVisible} 
                onClose={() => setVisibilityVisible(false)}
            />
            
            <Drawer 
                title="Parking Joy Qo'shish" 
                open={addVisible} 
                onClose={() => setAddVisible(false)}
                width={720}
                afterOpenChange={(visible) => {
                    if (!visible) {
                        fetchParkingSpots();
                    }
                }}
            >
                <AddComponents 
                    onClose={() => setAddVisible(false)} 
                />
            </Drawer>
            
            <Drawer 
                title="Parking Joyni Tahrirlash" 
                open={editVisible} 
                onClose={() => setEditVisible(false)}
                width={720}
                afterOpenChange={(visible) => {
                    if (!visible) {
                        fetchParkingSpots();
                    }
                }}
            >
                <EditComponents 
                    parkingSpot={selectedSpot} 
                    onClose={() => setEditVisible(false)} 
                />
            </Drawer>

            <Drawer 
                title="Parking joy tafsilotlari" 
                open={detailsVisible} 
                onClose={() => setDetailsVisible(false)}
                width={720}
            >
                <SpotDetails 
                    parkingId={selectedSpotId} 
                    onClose={() => setDetailsVisible(false)} 
                    onUpdate={() => fetchParkingSpots()}
                />
            </Drawer>
        </div>
    );
};

export default ParkingSpots; 