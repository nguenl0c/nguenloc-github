import React, { useState, useRef } from 'react';
import Dropdown from './Dropdown.jsx';
import StatusBadge from './StatusBadge.jsx';


const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL'];

export default function TaskTable({ tasks = [], statuses = [], onDeleteTask, onUpdateTask }) {

  console.log("TaskTable props:", { tasks, statuses });
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
    
  );
  
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleMouseDown = (e, column) => {
    isResizing.current = true;
    resizingColumn.current = column;
    startX.current = e.clientX;
    startWidth.current = columnWidths[column];

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    const diff = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + diff);
    setColumnWidths((prev) => ({
      ...prev,
      [resizingColumn.current]: newWidth,
    }));
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    resizingColumn.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTaskUpdate = (taskId, field, newValue) => {
    onUpdateTask(taskId, { [field]: newValue });
    console.log(
      `Cập nhật task ID: ${taskId}, trường: ${field}, giá trị mới: ${newValue}`
    );
  };

  // --- CÁC HÀM XỬ LÝ MỚI ---
  const handleDoubleClick = (task, field) => {
    setEditingCell({ taskId: task.id, field });
    //mảng assignees, ta join lại để chỉnh sửa
    const currentValue =
      field === "assignees" ? task.assignees.join(", ") : task[field];
    setEditValue(currentValue);
  };

  const handleUpdate = () => {
    if (!editingCell) return;

    const { taskId, field } = editingCell;
    const originalTask = tasks.find((t) => t.id === taskId);

    // Xử lý giá trị trước khi gửi đi
    let finalValue = editValue;
    if (field === "assignees") {
      finalValue = editValue
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
    } else if (field === "estimate") {
      finalValue = parseInt(editValue, 10) || 0;
    }

    // Chỉ cập nhật nếu có sự thay đổi
    if (JSON.stringify(finalValue) !== JSON.stringify(originalTask[field])) {
      onUpdateTask(taskId, { [field]: finalValue });
    }

    setEditingCell(null); // Thoát khỏi chế độ chỉnh sửa
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUpdate();
    } else if (e.key === "Escape") {
      setEditingCell(null); // Hủy bỏ chỉnh sửa
    }
  };

  const renderEditableCell = (task, field) => {
    const isEditing =
      editingCell &&
      editingCell.taskId === task.id &&
      editingCell.field === field;

    if (isEditing) {
      return (
        <input
          type={field === "estimate" ? "number" : "text"}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleUpdate} // Tự động lưu khi click ra ngoài
          autoFocus // Tự động focus vào input
          className="w-full h-full p-1 box-border bg-white border-2 border-blue-500 rounded outline-none"
        />
      );
    }

    // Hiển thị bình thường
    return (
      <div
        className="w-full h-full truncate p-1"
        onDoubleClick={() => handleDoubleClick(task, field)}
      >
        {field === "assignees" ? task.assignees.join(", ") : task[field]}
      </div>
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
          {tasks.map((task, idx) => {
            const taskStatusObject = statuses.find(
              (s) => s.name === task.status
            );
            return (
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
                {renderEditableCell(task, "assignees")}
              </td>{" "}

              <td className="px-4 py-2 border-r border-gray-300">
                <div className="flex items-center justify-between">
                  <StatusBadge statusObject={taskStatusObject} />
                  <Dropdown
                    options={statuses.map(s => s.name)}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
