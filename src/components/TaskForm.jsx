import React, { useState, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

// Bước 1: Imports mới từ TextEditor.jsx
import {
  ClassicEditor,
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  CloudServices,
  Code,
  CodeBlock,
  Emoji,
  Essentials,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Mention,
  Paragraph,
  PasteFromOffice,
  TextTransformation,
  TodoList,
  Underline,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

export default function TaskForm({ onAddTask, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignees: "",
    status: "Todo",
    priority: "Medium",
    estimate: 1,
    size: "M",
  });

  // Bước 2: Dán License Key và cấu hình vào đây
  const LICENSE_KEY =
    "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTE0MTQzOTksImp0aSI6IjQwYjljNGJjLTMwNWYtNDI5Mi1iMGU2LTkwODJlZDBhNzJjMyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjY1YTlmMGM5In0.AEF3bMx_BHuo8nGThI4HgVCQJXiLdb4lmOru5Cx6IfwdwoG6rwzOCoqdX_ETktm_ruCpesCn85cTJSGPLlUyqw";

  const editorConfig = useMemo(
    () => ({
      plugins: [
        Autoformat,
        AutoImage,
        Autosave,
        BlockQuote,
        Bold,
        CloudServices,
        Code,
        CodeBlock,
        Emoji,
        Essentials,
        Heading,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        Mention,
        Paragraph,
        PasteFromOffice,
        TextTransformation,
        TodoList,
        Underline,
      ],
      toolbar: {
        items: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "link",
          "bulletedList",
          "numberedList",
          "todoList",
          "|",
          "blockQuote",
          "codeBlock",
          "mediaEmbed",
          "|",
          "undo",
          "redo",
        ],
        shouldNotGroupWhenFull: false,
      },
      placeholder: "Add a description for your task...",
      licenseKey: LICENSE_KEY,
      // QUAN TRỌNG: KHÔNG có "initialData" ở đây
    }),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prev) => ({ ...prev, description: data }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
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
    <div className="fixed inset-0 bg-gray-500/15 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create new issue in project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add a title
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div className="border border-gray-300 rounded-md">
              {/* Bước 3: Cập nhật component CKEditor */}
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                data={formData.description}
                onChange={handleEditorChange}
              />
            </div>
          </div>
          {/* ...Phần còn lại của form giữ nguyên... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignees (comma separated)
            </label>
            <input
              type="text"
              name="assignees"
              value={formData.assignees}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John, Jane, Bob"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimate (hours)
              </label>
              <input
                type="number"
                name="estimate"
                value={formData.estimate}
                onChange={handleChange}
                min="1"
                max="40"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
