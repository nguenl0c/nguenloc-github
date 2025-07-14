// src/components/StatusColumn.jsx
import { useState, useRef, useEffect } from "react";
import { FiClipboard, FiTrash, FiEdit2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import TaskCard from "./TaskCard";
import {DotStatus} from "./StatusBadge";

export default function StatusColumn({
  statusObject,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  onDeleteStatus,
  onUpdateStatus,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusName, setStatusName] = useState(statusObject ? statusObject.name : "No Status");

  const inputRef = useRef(null);

  // Sync statusName khi statusObject thay đổi
  useEffect(() => {
    if (statusObject) {
      setStatusName(statusObject.name);
    }
  }, [statusObject]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleRenameSubmit = () => {
    if (statusName.trim() && statusName.trim() !== statusObject.name) {
      onUpdateStatus && onUpdateStatus(statusObject.id, statusName.trim());
    } else {
      setStatusName(statusObject.name); // Reset nếu không có thay đổi
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRenameSubmit();
    }
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
    onUpdateTask(taskId, { status: statusName });
  };


  return (
    <div
      className={`w-80 h-full min-h-full bg-[#f7f8fa] rounded-lg border border-gray-300 flex flex-col flex-shrink-0 transition-all duration-200 ${
        isDragOver ? "border-blue-500 bg-blue-50" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="pt-4 px-3 flex justify-between items-center">
        {/* Header với editing capability */}
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              ref={inputRef}
              type="text"
              value={statusName}
              onChange={(e) => setStatusName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleRenameSubmit}
              className="font-semibold text-lg text-gray-800 bg-white border-2 border-blue-500 rounded px-2 py-1 flex-1"
              maxLength={50}
            />
            <span className="text-sm font-normal bg-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">
              {tasks.length}
            </span>
          </div>
        ) : (
          <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
            <DotStatus statusObject={statusObject}/>
            <span className="truncate">{statusName}</span>
            <span className="text-sm font-normal bg-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">
              {tasks.length}
            </span>
          </h3>
        )}

        {/* Action menu */}
        {!isEditing && (
          <Menu as="div" className="relative">
            <MenuButton className="cursor-pointer flex items-center hover:bg-gray-200 transition-all p-1 rounded-md">
              <BsThreeDots className="text-gray-500 w-4 h-4" />
            </MenuButton>

            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
              <div className="py-1">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`${
                        focus ? 'bg-gray-100' : ''
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors`}
                    >
                      <FiEdit2 className="mr-3 h-4 w-4" />
                      Edit details
                    </button>
                  )}
                </MenuItem>
                
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={() => {
                        if (onDeleteStatus && statusObject) {
                          onDeleteStatus(statusObject.id);
                        }
                      }}
                      className={`${
                        focus ? 'bg-red-50' : ''
                      } flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors`}
                    >
                      <FiTrash className="mr-3 h-4 w-4" />
                      Delete
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        )}
      </div>

      {/* Tasks area */}
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

      {/* Add Task button */}
      <div className="flex-shrink-0">
        <button
          onClick={() => onAddTask && onAddTask(statusName)}
          className="w-full p-2 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-start gap-2"
          disabled={isEditing}
        >
          <span className="pl-2 text-sm font-medium">+ Add Task</span>
        </button>
      </div>
    </div>
  );
}
