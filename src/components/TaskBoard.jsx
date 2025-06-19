// TaskBoard.jsx
import React, { useState } from "react";
// Thay đổi ở đây: Import icon từ thư viện react-icons
import {
    FiClock,
    FiTrash2,
    FiClipboard,
    FiLoader,
    FiCheckSquare,
} from "react-icons/fi";

import CircleIcon from "./CircleIcon";

// TaskCard component cho từng task trong board
function TaskCard({ task, onUpdateTask, onDeleteTask }) {
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
            className={`bg-white rounded-lg p-4 mb-3 shadow-sm border-l-4 cursor-move transition-all duration-200 ${getPriorityColor(
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
                    {/* Thay đổi ở đây: Dùng icon thay cho "✕" */}
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
                        {/* Thay đổi ở đây: Sửa lỗi gọi hàm và dùng component SizeIcon */}
                        <CircleIcon size={task.size} /> {task.size}
                    </span>
                    <span className="flex items-center gap-1">
                        {/* Thay đổi ở đây: Dùng icon thay cho "⏱️" */}
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

// BoardColumn component cho từng cột trong kanban
function BoardColumn({ title, tasks, status = 'No Status', onUpdateTask, onDeleteTask, onAddTask }) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const taskId = parseInt(e.dataTransfer.getData("text/plain"));
        onUpdateTask(taskId, { status });
    };



    const getHeaderColor = () => {
        switch (status) {
            case "Todo":
                return "text-gray-700";
            case "In Progress":
                return "text-yellow-700";
            case "Done":
                return "text-green-700";
            default:
                return "text-gray-700";
        }
    };

    return (
        <div
            className={`min-h-96 w-95 rounded-lg border-1 border-gray-300 transition-all duration-200 ${isDragOver ? "border-blue-400 bg-blue-50" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={`p-4 border-b ${getHeaderColor()}`}>
                <h3 className="font-semibold text-lg flex items-center justify-start gap-2">
                    {title}
                    <span className="text-sm font-normal bg-white px-1 rounded-full">
                        {tasks.length}
                    </span>
                </h3>
            </div>

            <div className="p-4">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                    />
                    ))}                {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <FiClipboard className="inline-block text-4xl mb-2" />
                        <p>No tasks yet</p>
                        <p className="text-xs">Drag tasks here</p>
                    </div>
                )}

                {/* New Task Button */}
                <button
                    onClick={() => onAddTask && onAddTask(status)}
                    className="w-full mt-3 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <span className="text-lg">+</span>
                    <span className="text-sm font-medium">Add Task</span>
                </button>
            </div>
        </div>
    );
}

// Main TaskBoard component
export default function TaskBoard({ tasks = [], onUpdateTask, onDeleteTask, onAddTask }) {
    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    // Thay đổi ở đây: Chuyển title từ string thành JSX để chứa icon
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
        <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex gap-6 min-h-32">                
                {columns.map((column) => (
                    <BoardColumn
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
