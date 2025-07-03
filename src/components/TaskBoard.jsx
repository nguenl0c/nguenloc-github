// TaskBoard.jsx
import React, { useState } from "react";
import StatusColumn from "./StatusColumn";
import { FiPlus } from "react-icons/fi"; // Thêm icon cho nút Add Column

// Component mới để thêm cột
const AddColumn = ({ onAddStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [columnName, setColumnName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (columnName.trim()) {
            onAddStatus(columnName.trim());
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
        <div className="w-95 bg-[#f7f8fa] rounded-lg p-4 border-1 border-gray-400">
            <form onSubmit={handleSubmit}>
                <input
                    autoFocus
                    type="text"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    placeholder="Enter column name..."
                    className="w-full p-2 border rounded-md"
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
    statuses = [], // 1. NHẬN `statuses` LÀM PROP
    onUpdateTask,
    onDeleteTask,
    onAddTask,
    onAddStatus, // 2. NHẬN HÀM `onAddStatus` LÀM PROP
}) {
    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    // 3. BỎ HOÀN TOÀN MẢNG `columns` CỐ ĐỊNH

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex gap-2 min-h-32">
                {/* 4. DÙNG `statuses.map` ĐỂ RENDER CÁC CỘT ĐỘNG */}
                {statuses.map((status) => (
                    <StatusColumn
                        key={status}
                        title={status}
                        status={status}
                        tasks={getTasksByStatus(status)}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                        onAddTask={onAddTask}
                    />
                ))}
                {/* 5. Thêm component cho phép tạo cột mới */}
                <AddColumn onAddStatus={onAddStatus} />
            </div>
        </div>
    );
}
