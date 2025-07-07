export const STATUS_COLORS = [
    { name: "gray", classes: "bg-gray-100 text-gray-800 border-gray-300" },
    { name: "red", classes: "bg-red-100 text-red-800 border-red-300" },
    { name: "yellow", classes: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    { name: "green", classes: "bg-green-100 text-green-800 border-green-300" },
    { name: "blue", classes: "bg-blue-100 text-blue-800 border-blue-300" },
    { name: "indigo", classes: "bg-indigo-100 text-indigo-800 border-indigo-300" },
    { name: "purple", classes: "bg-purple-100 text-purple-800 border-purple-300" },
    { name: "pink", classes: "bg-pink-100 text-pink-800 border-pink-300" },
];

export const getColorClasses = (colorName) => {
    const color = STATUS_COLORS.find(c => c.name === colorName);
    // Nếu không tìm thấy màu, trả về màu xám mặc định
    return color ? color.classes : 'bg-gray-100 text-gray-800 border-gray-300';
};