// StatusColumn.jsx
import React, { useState } from "react";
import { FiClipboard } from "react-icons/fi";
import TaskCard from "./TaskCard"; // Import TaskCard vừa tạo

export default function StatusColumn({
  title,
  tasks,
  status = "No Status",
  onUpdateTask,
  onDeleteTask,
  onAddTask,
}) {
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
      className={`min-h-96 w-95 bg-[#f7f8fa] rounded-lg border-1 border-gray-300 transition-all duration-200 ${isDragOver ? "border-blue-400 bg-blue-50" : ""}`}
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
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <FiClipboard className="inline-block text-4xl mb-2" />
            <p>No tasks yet</p>
            <p className="text-xs">Drag tasks here</p>
          </div>
        )}
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
