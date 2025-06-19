import React from 'react';

// Hàm để lấy mã màu dựa trên size
const getColor = size => {
    switch (size) {
        case 'XS':
            return '#28a745'; // Green
        case 'S':
            return '#dc3545'; // Red
        case 'M':
            return '#007bff'; // Blue
        case 'L':
            return '#6f42c1'; // Purple
        case 'XL':
            return '#8B4513'; // Brown
        default:
            return '#6c757d'; // Grey
    }
};

const CircleIcon = ({ size }) => {
    // Style cho icon tròn
    const iconStyle = {
        display: 'inline-block',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: getColor(size),
        marginRight: '8px',
        verticalAlign: 'middle',
    };

    return <span style={iconStyle}></span>;
};

export default CircleIcon;
