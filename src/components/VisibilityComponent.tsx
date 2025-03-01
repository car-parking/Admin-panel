import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

interface VisibilityComponentProps {
    totalCount: number;
    statusCounts: {
        [key: string]: number;
    };
    type: 'payment' | 'reservation' | 'user';
}

const VisibilityComponent: React.FC<VisibilityComponentProps> = ({ totalCount, statusCounts, type }) => {
    const getStatusColor = (status: string) => {
        if (type === 'payment') {
            const paymentColors: { [key: string]: string } = {
                pending: '#faad14',
                completed: '#52c41a',
                failed: '#f5222d'
            };
            return paymentColors[status] || '#000000';
        } else if (type === 'reservation') {
            const reservationColors: { [key: string]: string } = {
                active: '#52c41a',
                pending: '#faad14',
                completed: '#1890ff',
                cancelled: '#f5222d'
            };
            return reservationColors[status] || '#000000';
        } else if (type === 'user') {
            const userColors: { [key: string]: string } = {
                USER: '#1890ff',
                PARKING_ADMIN: '#52c41a',
                ADMIN: '#f5222d'
            };
            return userColors[status] || '#000000';
        }
        return '#000000';
    };

    const getStatusTitle = (status: string) => {
        if (type === 'payment') {
            const paymentTitles: { [key: string]: string } = {
                pending: 'Kutilmoqda',
                completed: 'Yakunlangan',
                failed: 'Bekor qilingan'
            };
            return paymentTitles[status] || status;
        } else if (type === 'reservation') {
            const reservationTitles: { [key: string]: string } = {
                active: 'Faol',
                pending: 'Kutilmoqda',
                completed: 'Yakunlangan',
                cancelled: 'Bekor qilingan'
            };
            return reservationTitles[status] || status;
        } else if (type === 'user') {
            const userTitles: { [key: string]: string } = {
                USER: 'Foydalanuvchi',
                PARKING_ADMIN: 'Parking Admin',
                ADMIN: 'Admin'
            };
            return userTitles[status] || status;
        }
        return status;
    };

    return (
        <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
                <Col span={6}>
                    <Statistic
                        title="Jami"
                        value={totalCount}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Col>
                {Object.entries(statusCounts).map(([status, count]) => (
                    <Col span={6} key={status}>
                        <Statistic
                            title={getStatusTitle(status)}
                            value={count}
                            valueStyle={{ color: getStatusColor(status) }}
                        />
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default VisibilityComponent; 