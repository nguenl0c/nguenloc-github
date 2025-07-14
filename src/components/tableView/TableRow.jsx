import React from 'react';
import EditableCell from './EditableCell';
import {StatusBadge} from '../StatusBadge';
import { PriorityBadge, SizeBadge } from './Badge';
import Dropdown from '../Dropdown';
import { FiMoreHorizontal, FiTrash2, FiEdit3 } from 'react-icons/fi';

export default function TableRow({
    task,
    index,
    statuses,
    onUpdateTask,
    onDeleteTask,
    priorityOptions,
    sizeOptions
}) {
    const taskStatusObject = statuses.find(s => s.name === task.status);

    return (
        <tr className="bg-white hover:bg-gray-50 transition-colors border-b border-gray-200">
            <td className="px-2 py-1 text-sm text-gray-500 w-12 text-right">
                {index + 1}
            </td>

            <td className="px-2 py-1 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {task.title}
                </div>
            </td>

            <td className="px-2 py-1 border-r border-gray-200">
                <EditableCell
                    value={task.assignees}
                    field="assignees"
                    task={task}
                    onUpdate={onUpdateTask}
                />
            </td>

            <td className="px-2 py-1 border-r border-gray-200">
                <div className="flex items-center justify-between">
                    <StatusBadge statusObject={taskStatusObject} />
                    <Dropdown
                        options={statuses.map(s => s.name)}
                        onValueChange={(newValue) => onUpdateTask(task.id, { status: newValue })}
                        triggerIcon={<FiMoreHorizontal className="size-4" />}
                    />
                </div>
            </td>

            <td className="px-2 py-1 border-r border-gray-200">
                <div className="flex items-center justify-between">
                    <PriorityBadge priority={task.priority} />
                    <Dropdown
                        options={priorityOptions}
                        onValueChange={(newValue) => onUpdateTask(task.id, { priority: newValue })}
                        triggerIcon={<FiMoreHorizontal className="w-4 h-4" />}
                    />
                </div>
            </td>

            <td className="px-4 py-1 border-r border-gray-200">
                <EditableCell
                    value={task.estimate}
                    field="estimate"
                    task={task}
                    onUpdate={onUpdateTask}
                    className="text-center"
                />
            </td>

            <td className="px-2 py-1 border-r border-gray-200">
                <div className="flex items-center justify-between">
                    <SizeBadge size={task.size} />
                    <Dropdown
                        options={sizeOptions}
                        onValueChange={(newValue) => onUpdateTask(task.id, { size: newValue })}
                        triggerIcon={<FiMoreHorizontal className="w-4 h-4" />}
                    />
                </div>
            </td>

            <td className="px-2 py-1 ">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 justify-center text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete task"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
            <td>
                {/* cột để lấp khoảng trống */}
            </td>
        </tr>
    );
}