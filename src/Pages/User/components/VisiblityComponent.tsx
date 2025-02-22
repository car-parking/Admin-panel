import { Drawer, Checkbox, CheckboxChangeEvent } from "antd";



type VisiblityComponentProps = {
    selectedColumns: Record<string, boolean>;
    setSelectedColumns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    onClose: () => void;
    visible: boolean;
};

const VisiblityComponent: React.FC<VisiblityComponentProps> = ({ selectedColumns, setSelectedColumns, onClose, visible }) => {
    const handleChange = (column: string) => {
        setSelectedColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const handleSelectAll = (e:CheckboxChangeEvent) => {
        const isChecked = e.target.checked;
        const newColumns = Object.keys(selectedColumns).reduce((acc, column) => {
            acc[column] = isChecked;
            return acc;
        }, {} as Record<string, boolean>);
        setSelectedColumns(newColumns);
    };

    return (
        <Drawer title="Ustunlarni boshqarish" open={visible} onClose={onClose}>
            <Checkbox 
                onChange={handleSelectAll} 
                checked={Object.values(selectedColumns).every(Boolean)}
            >
                Barchasini tanlash
            </Checkbox>
            {Object.keys(selectedColumns).map((column) => (
               <div>
                 <Checkbox 
                    key={column} 
                    checked={selectedColumns[column]} 
                    onChange={() => handleChange(column)}
                >
                    {column.replace("_", " ").toUpperCase()}
                </Checkbox>
               </div>
            ))}
        </Drawer>
    );
};


export default VisiblityComponent