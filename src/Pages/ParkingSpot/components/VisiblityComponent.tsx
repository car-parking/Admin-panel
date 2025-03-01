import { Drawer, Checkbox, CheckboxChangeEvent } from "antd";

type VisiblityComponentProps = {
    selectedColumns: Record<string, boolean>;
    setSelectedColumns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    onClose: () => void;
    visible: boolean;
};

const VisiblityComponent: React.FC<VisiblityComponentProps> = ({ 
    selectedColumns, 
    setSelectedColumns, 
    onClose, 
    visible 
}) => {
    const handleChange = (column: string) => {
        setSelectedColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const handleSelectAll = (e: CheckboxChangeEvent) => {
        const isChecked = e.target.checked;
        const newColumns = Object.keys(selectedColumns).reduce((acc, column) => {
            acc[column] = isChecked;
            return acc;
        }, {} as Record<string, boolean>);
        setSelectedColumns(newColumns);
    };

    const columnLabels: Record<string, string> = {
        id: "ID",
        location_name: "Joylashuv nomi",
        address: "Manzil",
        longitude: "Longitude",
        latitude: "Latitude",
        b_total_spots: "B umumiy joylar",
        c_total_spots: "C umumiy joylar",
        b_available_spots: "B bo'sh joylar",
        c_available_spots: "C bo'sh joylar",
        b_cost: "B narxi",
        c_cost: "C narxi",
        ev_total_spots: "Elektromobil umumiy joylar",
        ev_available_spots: "Elektromobil bo'sh joylar",
        ev_charging_cost: "Zaryadlash narxi",
        parking_type: "Parking turi",
        admin_id: "Admin ID"
    };

    return (
        <Drawer title="Ustunlarni boshqarish" open={visible} onClose={onClose}>
            <Checkbox 
                onChange={handleSelectAll} 
                checked={Object.values(selectedColumns).every(Boolean)}
                style={{ marginBottom: "16px" }}
            >
                Barchasini tanlash
            </Checkbox>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {Object.keys(selectedColumns).map((column) => (
                    <Checkbox 
                        key={column} 
                        checked={selectedColumns[column]} 
                        onChange={() => handleChange(column)}
                    >
                        {columnLabels[column] || column}
                    </Checkbox>
                ))}
            </div>
        </Drawer>
    );
};

export default VisiblityComponent; 