import React, { useState, useRef } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL'];

const TABLE_COLUMNS = [
    // { key: 'index', label: '', resizable: false },
    { key: 'title', label: 'Title', resizable: true },
    { key: 'assignees', label: 'Assignees', resizable: true },
    { key: 'status', label: 'Status', resizable: true },
    { key: 'priority', label: 'Priority', resizable: true },
    { key: 'estimate', label: 'Estimate', resizable: true },
    { key: 'size', label: 'Size', resizable: true },
];

export default function TaskTable({ tasks = [], statuses = [], onDeleteTask, onUpdateTask }) {
    const [columnWidths, setColumnWidths] = useState({
        index: 60,
        title: 300,
        assignees: 200,
        status: 150,
        priority: 120,
        estimate: 100,
        size: 80,
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');

    const tableRef = useRef(null);
    const isResizing = useRef(false);
    const resizingColumn = useRef(null);
    const startX = useRef(0);
    const startWidth = useRef(0);

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.assignees.some(assignee =>
                assignee.toLowerCase().includes(searchTerm.toLowerCase())
            );
        const matchesStatus = !filterStatus || task.status === filterStatus;
        const matchesPriority = !filterPriority || task.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

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
        setColumnWidths(prev => ({
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

    const totalWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0) + 60;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Table */}
            <div className="overflow-x-auto">
                <table
                    ref={tableRef}
                    className="divide-y divide-gray-200 min-w-full table-fixed w-full"
                    // style={{ width: `${totalWidth}px` }}
                >
                    <TableHeader
                        columns={TABLE_COLUMNS}
                        columnWidths={columnWidths}
                        onMouseDown={handleMouseDown}
                    />

                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task, index) => (
                                <TableRow
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    statuses={statuses}
                                    onUpdateTask={onUpdateTask}
                                    onDeleteTask={onDeleteTask}
                                    priorityOptions={PRIORITY_OPTIONS}
                                    sizeOptions={SIZE_OPTIONS}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={TABLE_COLUMNS.length + 1} className="px-6 py-8 text-center text-gray-500">
                                    {searchTerm || filterStatus || filterPriority ?
                                        "No tasks match your filters" :
                                        "No tasks found"
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {filteredTasks.length} of {tasks.length} tasks
                    </div>
                </div>
            </div>
        </div>
    );
}