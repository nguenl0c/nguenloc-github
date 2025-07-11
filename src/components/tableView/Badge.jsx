import React from 'react';

const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
};

export function PriorityBadge({ priority }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium truncate ${priorityColors[priority] || 'bg-gray-100 text-gray-800'}`}>
            {priority}
        </span>
    );
}

const sizeColors = {
    XS: 'bg-purple-100 text-purple-800',
    S: 'bg-blue-100 text-blue-800',
    M: 'bg-green-100 text-green-800',
    L: 'bg-yellow-100 text-yellow-800',
    XL: 'bg-red-100 text-red-800'
};

export function SizeBadge({ size }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium truncate   ${sizeColors[size] || 'bg-gray-100 text-gray-800'}`}>
            {size}
        </span>
    );
}