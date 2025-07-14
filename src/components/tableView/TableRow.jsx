// src/components/TableRow.jsx
import React from 'react';
import EditableCell from './EditableCell';
import {StatusBadge} from '../StatusBadge';
import Dropdown from '../Dropdown';
import { PriorityBadge, SizeBadge } from './Badge';
import { FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';

// Component này sẽ render một ô dựa trên key của cột
const renderCellContent = (task, columnKey, props) => {
    const { statuses, onUpdateTask, priorityOptions, sizeOptions } = props;
    const taskStatusObject = statuses.find(s => s.name === task.status);

    switch (columnKey) {
        case 'title':
            return <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{task.title}</div>;
        case 'assignees':
            return <EditableCell value={task.assignees} field="assignees" task={task} onUpdate={onUpdateTask} />;
        case 'status':
            return (
                <div className="flex items-center justify-between">
                    <StatusBadge statusObject={taskStatusObject} />
                    <Dropdown options={statuses.map(s => s.name)} onValueChange={(newValue) => onUpdateTask(task.id, { status: newValue })} triggerIcon={<FiMoreHorizontal />} />
                </div>
            );
        case 'priority':
            return (
                <div className="flex items-center justify-between">
                    <PriorityBadge priority={task.priority} />
                    <Dropdown options={priorityOptions} onValueChange={(newValue) => onUpdateTask(task.id, { priority: newValue })} triggerIcon={<FiMoreHorizontal />} />
                </div>
            );
        case 'estimate':
            return <EditableCell value={task.estimate} field="estimate" task={task} onUpdate={onUpdateTask} className="text-center" />;
        case 'size':
            return (
                <div className="flex items-center justify-between">
                    <SizeBadge size={task.size} />
                    <Dropdown options={sizeOptions} onValueChange={(newValue) => onUpdateTask(task.id, { size: newValue })} triggerIcon={<FiMoreHorizontal />} />
                </div>
            );
        default:
            return null;
    }
};

export default function TableRow({ task, index, columns, ...props }) {
    const { onDeleteTask } = props;
    return (
        <tr className="bg-white hover:bg-gray-50 transition-colors border-b border-gray-200">
            {/* Cột Index cố định */}
            <td className="px-4 text-sm text-gray-500 w-12 text-center">{index + 1}</td>

            {/* Render các ô theo đúng thứ tự của `columns` */}
            {columns.map(column => (
                <td key={column.key} className="px-2 py-0.5 border-r border-gray-200">
                    {renderCellContent(task, column.key, props)}
                </td>
            ))}

            {/* Cột Actions và Cột Filler */}
            <td className="px-2">
                <button onClick={() => onDeleteTask(task.id)} className="p-1 text-left text-gray-400 hover:text-red-500"><FiTrash2 /></button>
            </td>
            <td></td>
        </tr>
    );
}
