// TaskCard.jsx
import React, { useState } from "react";
import { FiClock, FiTrash2 } from "react-icons/fi";

export default function TaskCard({ task, onUpdateTask, onDeleteTask }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", task.id);
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "border-l-red-500";
            case "Medium":
                return "border-l-yellow-500";
            case "Low":
                return "border-l-green-500";
            default:
                return "border-l-gray-500";
        }
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`bg-white rounded-lg px-3 py-2 mb-3 shadow-sm border-l-4 cursor-move transition-all duration-200 ${getPriorityColor(
                task.priority
            )} ${isDragging ? "opacity-50 rotate-2" : "hover:shadow-md"}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                    {task.title}
                </h4>
                <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete task"
                >
                    <FiTrash2 size={16} />
                </button>
            </div>

            {task.assignees.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {task.assignees.map((assignee, idx) => (
                        <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                            {assignee}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                        {/* <CircleIcon size={task.size} /> {task.size} */}
                        {task.size}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiClock /> {task.estimate}h
                    </span>
                </div>
                <span
                    className={`px-2 py-1 rounded text-xs ${task.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }`}
                >
                    {task.priority}
                </span>
            </div>
        </div>
    );
}
