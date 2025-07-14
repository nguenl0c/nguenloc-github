import {useState} from 'react';
import ResizeHandle from './ResizeHandle';

export default function TableHeader({ columns, columnWidths, onMouseDown, onColumnReorder }) {
    const [dragOverKey, setDragOverKey] = useState(null);

    const handleDragStart = (e, columnKey) => {
        e.dataTransfer.setData("columnKey", columnKey);
    }

    const handleDragOver = (e, columnKey) => {
        e.preventDefault();
        setDragOverKey(columnKey);
    };

    const handleDrop = (e, targetColumnKey) => {
        const draggedColumnKey = e.dataTransfer.getData("columnKey");
        onColumnReorder(draggedColumnKey, targetColumnKey);
        setDragOverKey(null);
    }
    return (
        <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
                {/* Cột Index cố định */}
                <th className="px-4 py-3 w-12"></th>
                
                {columns.map((column) => (
                    <th
                        key={column.key}
                        draggable // Cho phép kéo
                        onDragStart={(e) => handleDragStart(e, column.key)}
                        onDragOver={(e) => handleDragOver(e, column.key)}
                        onDragLeave={() => setDragOverKey(null)}
                        onDrop={(e) => handleDrop(e, column.key)}
                        className={`px-2 py-3 text-left text-xs font-medium text-gray-700 tracking-wider relative transition-colors border-r border-gray-200 truncate ${dragOverKey === column.key ? 'bg-blue-100' : ''}`}
                        style={{ width: `${columnWidths[column.key]}px` }}
                    >
                        {column.label}
                        {column.resizable && (
                            <ResizeHandle onMouseDown={(e) => onMouseDown(e, column.key)} />
                        )}
                    </th>
                ))}
                
                {/* Cột Actions và Cột Filler */}
                <th className="px-2 py-3 w-12 text-left text-xs text-gray-700 font-medium">Del</th>
                <th className="px-2 py-3"></th>
            </tr>
        </thead>
    );
}