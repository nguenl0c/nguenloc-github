import React, { useState, useRef } from 'react';

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
          label: status,
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

export default function TaskTable({ tasks = [], onDeleteTask, onUpdateTask }) {
  // State để lưu trữ width của các cột
  const [columnWidths, setColumnWidths] = useState({
    index: 32, // w-16
    title: 350, // w-80
    assignees: 200, // w-48
    status: 200, // w-32
    priority: 200, // w-28
    estimate: 200, // w-24
    size: 200, // w-20
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

  return (
    <div className="overflow-x-auto bg-white ">
      <table
        ref={tableRef}
        className="min-w-full border border-gray-300 table-fixed shadow-[5px_0_15px_rgba(0,0,0,0.1)]"
        
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
              className="px-4 py-2 border-r border-gray-300 relative"
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
              className="px-4 py-2 border-r border-gray-300 relative"
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
              className="px-4 py-2 border-r border-gray-300 relative"
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
              className="px-4 py-2 border-r border-gray-300 relative"
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
              className="px-4 py-2 border-r border-gray-300 relative"
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
              className="px-4 py-2"
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
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-2 border-r border-gray-300">
                {task.priority}
              </td>
              <td className="px-4 py-2 border-r border-gray-300">
                {task.estimate}
              </td>
              <td className="px-4 py-2 border-r border-gray-300">
                {task.size}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
