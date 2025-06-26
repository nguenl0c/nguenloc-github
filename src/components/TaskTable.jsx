import React, { useState, useRef } from 'react';
import Dropdown from './Dropdown.jsx';

// Component StatusBadge với màu sắc và icon
function StatusBadge({ status }) {
  const getStatusConfig = status => {
    switch (status) {
      case 'Todo':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          label: 'Todo',
        };
      case 'In Progress':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          label: 'In Progress',
        };
      case 'Done':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          label: 'Done',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          label: 'No Status',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
    >
      <span className='mr-1 text-sm'>{config.icon}</span>
      {config.label}
    </span>
  );
}

const STATUS_OPTIONS = ['Todo', 'In Progress', 'Done', 'No Status'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL'];

export default function TaskTable({ tasks = [], onDeleteTask, onUpdateTask }) {
  // State để lưu trữ width của các cột
  const [columnWidths, setColumnWidths] = useState({
    index: 32, 
    title: 350, 
    assignees: 200,
    status: 200,
    priority: 150,
    estimate: 100, 
    size: 100,
  });

  const tableRef = useRef(null);
  const isResizing = useRef(false);
  const resizingColumn = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Tính tổng width của table
  const totalWidth = Object.values(columnWidths).reduce(
    (sum, width) => sum + width,
    0
  );

  const handleMouseDown = (e, column) => {
    isResizing.current = true;
    resizingColumn.current = column;
    startX.current = e.clientX;
    startWidth.current = columnWidths[column];

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = e => {
    if (!isResizing.current) return;

    const diff = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + diff);
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn.current]: newWidth,
    }));
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    resizingColumn.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTaskUpdate = (taskId, field, newValue) => {
    onUpdateTask(taskId, { [field]: newValue });
    console.log(
      `Cập nhật task ID: ${taskId}, trường: ${field}, giá trị mới: ${newValue}`
    );
  };

  return (
    <div className="overflow-x-auto bg-white">
      <table
        ref={tableRef}
        className="min-w-full border border-gray-300 table-fixed shadow-[5px_0_15px_rgba(0,0,0,0.1)]"
        style={{ width: `${totalWidth}px` }}
      >
        <thead>
          <tr className="bg-white border-b-2 border-gray-400 text-sm text-left">
            <th
              className="px-4 py-2 border-gray-300 relative"
              style={{ width: `${columnWidths.index}px` }}
            >
              <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 group">
                <div
                  className="h-full w-1 group-hover:w-2 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, "index")}
                ></div>
              </div>
            </th>
            <th
              className="px-4 py-2 border-r border-gray-300 relative truncate"
              style={{ width: `${columnWidths.title}px` }}
            >
              Title
              <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 group">
                <div
                  className="h-full w-1 group-hover:w-2 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, "title")}
                ></div>
              </div>
            </th>

            <th
              className="px-4 py-2 border-r border-gray-300 relative truncate"
              style={{ width: `${columnWidths.assignees}px` }}
            >
              Assignees
              <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 group">
                <div
                  className="h-full w-1 group-hover:w-2 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, "assignees")}
                ></div>
              </div>
            </th>

            <th
              className="px-4 py-2 border-r border-gray-300 relative truncate"
              style={{ width: `${columnWidths.status}px` }}
            >
              Status
              <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 group">
                <div
                  className="h-full w-1 group-hover:w-2 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, "status")}
                ></div>
              </div>
            </th>

            <th
              className="px-4 py-2 border-r border-gray-300 relative truncate"
              style={{ width: `${columnWidths.priority}px` }}
            >
              Priority
              <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 group">
                <div
                  className="h-full w-1 group-hover:w-2 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, "priority")}
                ></div>
              </div>
            </th>

            <th
              className="px-4 py-2 border-r border-gray-300 relative truncate"
              style={{ width: `${columnWidths.estimate}px` }}
            >
              Estimate
              <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 group">
                <div
                  className="h-full w-1 group-hover:w-2 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, "estimate")}
                ></div>
              </div>
            </th>{" "}

            <th
              className="px-4 py-2 border-r border-gray-300 relative truncate"
              style={{ width: `${columnWidths.size}px` }}
            >
              Size
              <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 group">
                <div
                  className="h-full w-1 group-hover:w-2 transition-all"
                  onMouseDown={(e) => handleMouseDown(e, "size")}
                ></div>
              </div>
            </th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>{" "}
        <tbody>
          {tasks.map((task, idx) => (
            <tr key={task.id} className="border-t border-gray-400 ">
              <td className="px-4 py-2 border-gray-300 text-right">
                {idx + 1}
              </td>
              <td
                className="px-4 py-2 border-r border-gray-300 truncate"
                title={task.title}
              >
                {task.title}
              </td>
              <td
                className="px-4 py-2 border-r border-gray-300 truncate"
                title={task.assignees.join(", ")}
              >
                {task.assignees.join(", ")}
              </td>{" "}
              <td className="px-4 py-2 border-r border-gray-300">
                <div className="flex items-center justify-between">
                  <StatusBadge status={task.status} />
                  <Dropdown
                    options={STATUS_OPTIONS}
                    onValueChange={(newValue) =>
                      handleTaskUpdate(task.id, "status", newValue)
                    }
                  />
                </div>
              </td>
              <td className="px-4 py-2 border-r border-gray-300">
                <div className="flex items-center justify-between">
                  {task.priority}
                  <Dropdown
                    options={PRIORITY_OPTIONS}
                    onValueChange={(newValue) =>
                      handleTaskUpdate(task.id, "priority", newValue)
                    }
                  />
                </div>
              </td>
              <td className="px-4 py-2 border-r border-gray-300">
                {task.estimate}
              </td>
              <td className="px-4 py-2 border-r border-gray-300">
                <div className="flex items-center justify-between">
                  {task.size}
                  <Dropdown
                    options={SIZE_OPTIONS}
                    onValueChange={(newValue) =>
                      handleTaskUpdate(task.id, "size", newValue)
                    }
                  />
                </div>
              </td>
              <td className="px-4 py-2"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
