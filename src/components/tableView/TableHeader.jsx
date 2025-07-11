import React from 'react';
import ResizeHandle from './ResizeHandle';

export default function TableHeader({ columns, columnWidths, onMouseDown }) {
    return (
        <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-12"></th>
                {columns.map((column) => (
                    <th
                        key={column.key}
                        className="px-2 py-2 text-left text-xs font-medium text-gray-500 truncate border-r border-gray-200 tracking-wider relative"
                        style={{ width: `${columnWidths[column.key]}px` }}
                    >
                        {column.label}
                        {column.resizable && (
                            <ResizeHandle
                                onMouseDown={(e) => onMouseDown(e, column.key)}
                            />
                        )}
                    </th>
                ))}
                <th className="px-2 py-2 w-12">Actions</th>
                <th className="px-2 py-2"> </th>
            </tr>
        </thead>
    );
}