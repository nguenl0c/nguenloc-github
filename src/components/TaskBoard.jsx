// TaskBoard.jsx
import React from "react";
// Giữ lại các icon dùng cho tiêu đề cột
import { FiClipboard, FiLoader, FiCheckSquare } from "react-icons/fi";
// Import component cột mới
import StatusColumn from "./StatusColumn";

// Main TaskBoard component
export default function TaskBoard({
    tasks = [],
    onUpdateTask,
    onDeleteTask,
    onAddTask,
}) {
    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    const columns = [
        {
            title: (
                <span className="flex items-center">
                    <FiClipboard className="mr-2" /> Todo
                </span>
            ),
            status: "Todo",
        },
        {
            title: (
                <span className="flex items-center">
                    <FiLoader className="mr-2" /> In Progress
                </span>
            ),
            status: "In Progress",
        },
        {
            title: (
                <span className="flex items-center">
                    <FiCheckSquare className="mr-2" /> Done
                </span>
            ),
            status: "Done",
        },
    ];

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex gap-6 min-h-32">
                {columns.map((column) => (
                    // Sử dụng component StatusColumn đã được import
                    <StatusColumn
                        key={column.status}
                        title={column.title}
                        status={column.status}
                        tasks={getTasksByStatus(column.status)}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                        onAddTask={onAddTask}
                    />
                ))}
            </div>
        </div>
    );
}
