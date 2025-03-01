import React from 'react';
import { Checkbox, Drawer, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface Column {
    title: string;
    key: string;
    visible: boolean;
}

interface TableVisibilityComponentProps {
    columns: Column[];
    onChange: (key: string, visible: boolean) => void;
}

const TableVisibilityComponent: React.FC<TableVisibilityComponentProps> = ({ columns, onChange }) => {
    const [open, setOpen] = React.useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleChange = (key: string) => (e: CheckboxChangeEvent) => {
        onChange(key, e.target.checked);
    };

    return (
        <>
            <Button 
                onClick={showDrawer} 
                icon={<SettingOutlined />}
                style={{ height: '32px', display: 'flex', alignItems: 'center' }}
           />
            <Drawer
                title="Ustunlarni boshqarish"
                placement="right"
                onClose={onClose}
                open={open}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {columns.map(column => (
                        <Checkbox
                            key={column.key}
                            checked={column.visible}
                            onChange={handleChange(column.key)}
                        >
                            {column.title}
                        </Checkbox>
                    ))}
                </div>
            </Drawer>
        </>
    );
};

export default TableVisibilityComponent; 