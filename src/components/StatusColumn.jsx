// src/components/StatusColumn.jsx
import React, { useState } from "react";
import { FiClipboard } from "react-icons/fi";
import TaskCard from "./TaskCard";
import { getColorClasses } from "../assets/colors"; 

export default function StatusColumn({
  statusObject, // Nhận cả object status
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  // Lấy tên status từ object để xử lý logic
  const statusName = statusObject ? statusObject.name : "No Status";

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
    const taskId = e.dataTransfer.getData("text/plain");
    // Khi thả task, cập nhật status bằng statusName (chuỗi)
    onUpdateTask(taskId, { status: statusName });
  };

  // Lấy class màu từ object, nếu không có thì dùng màu xám
  const headerColorClasses = statusObject
    ? getColorClasses(statusObject.color)
    : getColorClasses("gray");

  return (
    <div
      className={`w-80 h-auto bg-[#f7f8fa] rounded-lg border border-gray-300 flex flex-col flex-shrink-0 transition-all duration-200  ${isDragOver ? "border-blue-500 bg-blue-50" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Áp dụng màu sắc động cho viền trên của header */}
      <div className={`p-4 border-b-4 ${headerColorClasses.split(" ")[2]}`}>
        <h3 className="font-semibold text-lg flex items-center justify-start gap-2 text-gray-800">
          {statusName}
          <span className="text-sm font-normal bg-gray-200 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h3>
      </div>

      <div className="p-2 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FiClipboard className="inline-block text-4xl mb-2" />
            <p>No tasks yet</p>
          </div>
        )}
        <button
          onClick={() => onAddTask && onAddTask(statusName)}
          className="w-full mt-3 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span>
          <span className="text-sm font-medium">Add Task</span>
        </button>
      </div>
    </div>
  );
}
