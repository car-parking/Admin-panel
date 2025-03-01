import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { useAxios } from '../../hook/useAxsios';
import { UserOutlined, CarOutlined, DollarOutlined, ScheduleOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface DashboardStats {
    users: {
        total: number;
        byRole: { [key: string]: number };
    };
    parkingSpots: {
        total: number;
        available: { b: number; c: number };
        total_spots: { b: number; c: number };
    };
    payments: {
        total: number;
        totalAmount: number;
        byStatus: { [key: string]: number };
    };
    reservations: {
        total: number;
        byStatus: { [key: string]: number };
    };
}

const Dashboard: React.FC = () => {
    const axios = useAxios();
    const [stats, setStats] = useState<DashboardStats>({
        users: { total: 0, byRole: {} },
        parkingSpots: { total: 0, available: { b: 0, c: 0 }, total_spots: { b: 0, c: 0 } },
        payments: { total: 0, totalAmount: 0, byStatus: {} },
        reservations: { total: 0, byStatus: {} }
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Foydalanuvchilar statistikasi
            const usersResponse = await axios({ url: '/users' });
            const users = Array.isArray(usersResponse) ? usersResponse : usersResponse.data || [];
            const userStats = {
                total: users.length,
                byRole: users.reduce((acc: any, user: any) => {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                    return acc;
                }, {})
            };

            // Parking joylar statistikasi
            const parkingSpotsResponse = await axios({ url: '/parking-spots' });
            const parkingSpots = Array.isArray(parkingSpotsResponse) ? parkingSpotsResponse : parkingSpotsResponse.data || [];
            const parkingStats = {
                total: parkingSpots.length,
                available: parkingSpots.reduce((acc: any, spot: any) => ({
                    b: acc.b + (spot.b_available_spots || 0),
                    c: acc.c + (spot.c_available_spots || 0)
                }), { b: 0, c: 0 }),
                total_spots: parkingSpots.reduce((acc: any, spot: any) => ({
                    b: acc.b + (spot.b_total_spots || 0),
                    c: acc.c + (spot.c_total_spots || 0)
                }), { b: 0, c: 0 })
            };

            // To'lovlar statistikasi
            const paymentsResponse = await axios({ url: '/payments' });
            const payments = Array.isArray(paymentsResponse) ? paymentsResponse : paymentsResponse.data || [];
            const paymentStats = {
                total: payments.length,
                totalAmount: payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0),
                byStatus: payments.reduce((acc: any, payment: any) => {
                    if (payment.payment_status) {
                        acc[payment.payment_status] = (acc[payment.payment_status] || 0) + 1;
                    }
                    return acc;
                }, {})
            };

            // Rezervatsiyalar statistikasi
            const reservationsResponse = await axios({ url: '/reservations' });
            const reservations = Array.isArray(reservationsResponse) ? reservationsResponse : reservationsResponse.data || [];
            const reservationStats = {
                total: reservations.length,
                byStatus: reservations.reduce((acc: any, reservation: any) => {
                    if (reservation.status) {
                        acc[reservation.status] = (acc[reservation.status] || 0) + 1;
                    }
                    return acc;
                }, {})
            };

            setStats({
                users: userStats,
                parkingSpots: parkingStats,
                payments: paymentStats,
                reservations: reservationStats
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const roleColors = {
        USER: 'blue',
        PARKING_ADMIN: 'green',
        ADMIN: 'red'
    };

    const statusColors = {
        active: 'green',
        pending: 'orange',
        completed: 'blue',
        cancelled: 'red',
        failed: 'red'
    };
    console.log(stats);
    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Dashboard</Title>
            
            <Row gutter={[16, 16]}>
                {/* Asosiy statistika */}
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Jami foydalanuvchilar"
                            value={stats.users.total}
                            prefix={<UserOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Jami parking joylar"
                            value={stats.parkingSpots.total}
                            prefix={<CarOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Jami to'lovlar"
                            value={stats.payments.totalAmount}
                            prefix={<DollarOutlined />}
                            suffix="so'm"
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Jami rezervatsiyalar"
                            value={stats.reservations.total}
                            prefix={<ScheduleOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>

                {/* Parking joylar statistikasi */}
                <Col xs={24} md={12}>
                    <Card title="Parking joylar statistikasi">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="B toifa (band/jami)"
                                    value={`${stats.parkingSpots.available.b}/${stats.parkingSpots.total_spots.b}`}
                                    loading={loading}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="C toifa (band/jami)"
                                    value={`${stats.parkingSpots.available.c}/${stats.parkingSpots.total_spots.c}`}
                                    loading={loading}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Foydalanuvchilar statistikasi */}
                <Col xs={24} md={12}>
                    <Card title="Foydalanuvchilar statistikasi">
                        {Object.entries(stats.users.byRole).map(([role, count]) => (
                            <div key={role} style={{ marginBottom: 8 }}>
                                <span style={{ color: roleColors[role as keyof typeof roleColors] }}>
                                    {role}:
                                </span>
                                {' '}
                                {count} ta
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* To'lovlar statistikasi */}
                <Col xs={24} md={12}>
                    <Card title="To'lovlar statistikasi">
                        {Object.entries(stats.payments.byStatus).map(([status, count]) => (
                            <div key={status} style={{ marginBottom: 8 }}>
                                <span style={{ color: statusColors[status as keyof typeof statusColors] }}>
                                    {status}:
                                </span>
                                {' '}
                                {count} ta
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* Rezervatsiyalar statistikasi */}
                <Col xs={24} md={12}>
                    <Card title="Rezervatsiyalar statistikasi">
                        {Object.entries(stats.reservations.byStatus).map(([status, count]) => (
                            <div key={status} style={{ marginBottom: 8 }}>
                                <span style={{ color: statusColors[status as keyof typeof statusColors] }}>
                                    {status}:
                                </span>
                                {' '}
                                {count} ta
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
