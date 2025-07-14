// src/components/StatusBadge.jsx
import React from "react";
// Giả định bạn đã có file này từ các bước trước
import { getColorClasses } from "../assets/colors";

/**
 * Component hiển thị một "huy hiệu" trạng thái với màu sắc động.
 * @param {object} statusObject - Object chứa thông tin của status, vd: { name: 'Todo', color: 'green' }
 */
export function StatusBadge({ statusObject }) {
    // Nếu không tìm thấy thông tin status, hiển thị một badge mặc định
    if (!statusObject || !statusObject.name) {
        const defaultColorClasses = getColorClasses("gray");
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${defaultColorClasses}`}
            >
                No Status
            </span>
        );
    }
    // Lấy các class màu sắc dựa trên tên màu được lưu trong status object
    const colorClasses = getColorClasses(statusObject.color);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium truncate border ${colorClasses}`}>
            {statusObject.name}
        </span>
    );
}

export function DotStatus({ statusObject }) {

    const getDot = (color) => {
        const dotColors = {
            red: "bg-red-200 border-red-600",
            yellow: "bg-yellow-200 border-yellow-600",
            green: "bg-green-200 border-green-600",
            blue: "bg-blue-200 border-blue-600",
            indigo: "bg-indigo-200 border-indigo-600",
            purple: "bg-purple-200 border-purple-600",
            pink: "bg-pink-200 border-pink-600",
        };
        return dotColors[color] || "bg-gray-500 border-gray-600";
    }

    const dotClasses = getDot(statusObject.color);

        return (
            <span
                className={`w-3 h-3 rounded-full ${dotClasses} border-2 inline-block`}
                title={statusObject.name}
            ></span>
        );
}
