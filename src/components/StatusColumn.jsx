// src/components/StatusColumn.jsx
import React, { useState, useRef, useEffect } from "react";
import { FiClipboard } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import TaskCard from "./TaskCard";
import { getColorClasses } from "../assets/colors"; 

export default function StatusColumn({
  statusObject, // Nhận cả object status
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  onDeleteStatus,
  onUpdateStatus,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusName, setStatusName] = useState(statusObject ? statusObject.name : "No Status");

  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleRenameSubmit = () => {
    if (statusName.trim() && statusName.trim() !== statusObject.name) {
      onUpdateStatus(statusObject.id, statusName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") {
      setStatusName(statusObject.name);
      setIsEditing(false);
    }
  };

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

  const ColumnMenu = ({onDelete, onRename}) => {
    return (
      <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md w-48 p-2 z-10">
        <button
          onClick={onRename}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
        >
          Rename
        </button>
        <button
          onClick={onDelete}
          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
        >
          Delete Status
        </button>
      </div>
    );
  }

  return (
    <div
      className={`w-80 h-full min-h-full bg-[#f7f8fa] rounded-lg border border-gray-300 flex flex-col flex-shrink-0 transition-all duration-200  ${isDragOver ? "border-blue-500 bg-blue-50" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="pt-4 px-3 flex  justify-between items-center">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
          {statusName}
          <span className="text-sm font-normal bg-gray-200 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h3>
        <div
          className="relative cursor-pointer flex self-start items-center hover:bg-gray-200 transition-all p-1 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <BsThreeDots className="text-gray-600 text-lg font-medium cursor-pointer transition-all" />
          {isMenuOpen && (
            <ColumnMenu
              onDelete={() => {
                onDeleteStatus && onDeleteStatus(statusObject.id);
                setIsMenuOpen(false);
              }}
              onRename={() => {
                setIsEditing(true);
                setIsMenuOpen(false);
              }}
            />
          )}
        </div>
      </div>

      {/* Vùng hiển thị tasks - flex-1 để chiếm hết không gian còn lại */}
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
      </div>

      {/* Nút Add Task - cố định ở dưới cùng */}
      <div className="flex-shrink-0">
        <button
          onClick={() => onAddTask && onAddTask(statusName)}
          className="w-full p-2 text-gray-600  hover:bg-gray-200 transition-all flex items-center justify-start gap-2"
        >
          <span className=" pl-2 text-sm font-medium">+ Add Task</span>
        </button>
      </div>
    </div>
  );
}
