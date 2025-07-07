// src/components/StatusBadge.jsx
import React from "react";
// Giả định bạn đã có file này từ các bước trước
import { getColorClasses } from "../assets/colors";

/**
 * Component hiển thị một "huy hiệu" trạng thái với màu sắc động.
 * @param {object} statusObject - Object chứa thông tin của status, vd: { name: 'Todo', color: 'green' }
 */
export default function StatusBadge({ statusObject }) {
    // Nếu không tìm thấy thông tin status, hiển thị một badge mặc định
    if (!statusObject || !statusObject.name) {
        const defaultColorClasses = getColorClasses("gray"); // Lấy màu xám mặc định
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
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
        >
            {statusObject.name}
        </span>
    );
}
