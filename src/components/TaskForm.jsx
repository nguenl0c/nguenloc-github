// src/components/TaskForm.jsx
import React, { useState } from "react";
// --- THAY ĐỔI 1: Import CKEditor và bản build Classic ---
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function TaskForm({ onAddTask, onClose, statuses = [] }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignees: "",
    status: statuses.length > 0 ? statuses[0].name : "Todo",
    priority: "Medium",
    estimate: 1,
    size: "M",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- THAY ĐỔI 2: Hàm xử lý cho CKEditor ---
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prev) => ({ ...prev, description: data }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const newTask = {
      title: formData.title,
      description: formData.description,
      assignees: formData.assignees
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
      status: formData.status,
      priority: formData.priority,
      estimate: parseInt(formData.estimate),
      size: formData.size,
    };
    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-lg font-semibold">Create new issue</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Thêm id vào form để nút submit bên ngoài có thể hoạt động */}
        <form id="task-form-id" onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add a title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            {/* --- THAY ĐỔI 3: Sử dụng CKEditor với bản build Classic --- */}
            <div className="prose max-w-none">
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={handleEditorChange}
                config={{
                  // Bạn có thể tùy chỉnh toolbar ở đây nếu muốn
                  toolbar: ['heading', '|', 'bold', 'italic','quote','codeBlock', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                  placeholder: "Add a description for your task...",
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignees (comma separated)</label>
            <input
              type="text"
              name="assignees"
              value={formData.assignees}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="John, Jane, Bob"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.name}>{status.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimate (hours)</label>
              <input type="number" name="estimate" value={formData.estimate} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <select name="size" value={formData.size} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
          </div>
        </form>
        <div className="flex justify-end space-x-3 pt-4 mt-4 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button type="submit" form="task-form-id" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Task</button>
        </div>
      </div>
    </div>
  );
}
