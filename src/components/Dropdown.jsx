import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";


export default function Dropdown({
    options,
    onValueChange,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Xử lý việc đóng dropdown khi người dùng click ra bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        // Cleanup event listener khi component bị unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOptionClick = (option) => {
        onValueChange(option); // Gọi hàm callback của component cha
        setIsOpen(false); // Đóng dropdown sau khi chọn
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* icon hiển thị dropdown */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <IoIosArrowDown />
            </button>

            {/* Danh sách các lựa chọn, chỉ hiển thị khi `isOpen` là true */}
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {options.map((option) => (
                            <button
                                key={option}
                                href="#"
                                className="w-full text-left font-sans font-medium  block px-4 py-2 text-sm hover:bg-gray-100"
                                role="menuitem"
                                onClick={(e) => {
                                    handleOptionClick(option);
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
