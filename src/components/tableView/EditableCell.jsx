import React, { useState, useEffect } from 'react';

export default function EditableCell({
    value,
    field,
    task,
    onUpdate,
    className = ""
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const handleDoubleClick = () => {
        setIsEditing(true);
        const currentValue = field === "assignees" ? value.join(", ") : value;
        setEditValue(currentValue);
    };

    const handleUpdate = () => {
        let finalValue = editValue;
        if (field === "assignees") {
            finalValue = editValue.split(",").map(name => name.trim()).filter(Boolean);
        } else if (field === "estimate") {
            finalValue = parseInt(editValue, 10) || 0;
        }

        if (JSON.stringify(finalValue) !== JSON.stringify(value)) {
            onUpdate(task.id, { [field]: finalValue });
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleUpdate();
        } else if (e.key === "Escape") {
            setIsEditing(false);
        }
    };

    const displayValue = field === "assignees" ? value.join(", ") : String(value);
    const shortValue = displayValue.length > 20 ? displayValue.substring(0, 17) + "..." : displayValue;

    if (isEditing) {
        return (
            <div className="relative">
                <input
                    type={field === "estimate" ? "number" : "text"}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleUpdate}
                    autoFocus
                    className="w-full h-8 px-2 border-2 border-blue-500 rounded focus:outline-none text-sm bg-white z-10 relative"
                    style={{ minWidth: '80px' }}
                />
            </div>
        );
    }

    return (
        <div
            className={`w-full h-8 flex items-center cursor-pointer hover:bg-gray-50 rounded overflow-hidden ${className}`}
            onDoubleClick={handleDoubleClick}
            title={displayValue}
        >
            <span className="truncate text-sm leading-tight">
                {shortValue}
            </span>
        </div>
    );
}