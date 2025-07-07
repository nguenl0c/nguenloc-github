// TaskBoard.jsx
import React, { useState } from "react";
import StatusColumn from "./StatusColumn";
import { FiPlus } from "react-icons/fi";
import { STATUS_COLORS } from "../assets/colors"; // Import colors from assets
import ColorPicker from "./ColorPicker";

// Component mới để thêm cột
const AddColumn = ({ onAddStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [columnName, setColumnName] = useState("");
    const [selectedColor, setSelectedColor] = useState(STATUS_COLORS[0].name);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (columnName.trim()) {
            onAddStatus(columnName.trim(), selectedColor);
            setColumnName("");
            setIsEditing(false);
        }
    };

    if (!isEditing) {
        return (
            <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center w-10 h-8 bg-gray-100 rounded-lg border-1 border-gray-400 hover:bg-gray-200 hover:border-gray-400 transition-all text-gray-500"
            >
                <FiPlus/>
            </button>
        );
    }

    return (
        <div className="w-95 h-30 bg-[#f7f8fa] rounded-lg p-4 border-1 border-gray-400">
            <form onSubmit={handleSubmit}>
                <input
                    autoFocus
                    type="text"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    placeholder="Enter column name..."
                    className="w-full p-2 border rounded-md mb-2"
                />

                <ColorPicker
                    colors={STATUS_COLORS}
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                />
                
                <div className="flex gap-2 mt-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Create
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

// Component TaskBoard chính được cập nhật
export default function TaskBoard({
    tasks = [],
    statuses = [],
    onUpdateTask,
    onDeleteTask,
    onAddTask,
    onAddStatus,
}) {
    const getTasksByStatus = (statusName) => {
        return tasks.filter((task) => task.status === statusName);
    };

    return (
        <div className="bg-white p-4 h-full flex flex-col">
            <div className="flex gap-2 h-100vh overflow-x-auto">
                {/*DÙNG `statuses.map` ĐỂ RENDER CÁC CỘT ĐỘNG */}
                {statuses.map((statusObj) => (
                    <StatusColumn
                        key={statusObj.name} 
                        statusObject={statusObj}
                        tasks={getTasksByStatus(statusObj.name)}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                        onAddTask={onAddTask}
                    />
                ))}
                <AddColumn onAddStatus={onAddStatus} />
            </div>
        </div>
    );
}
