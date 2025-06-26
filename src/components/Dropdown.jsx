import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoIosArrowDown } from "react-icons/io";

export default function Dropdown({ options, onValueChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // Ref cho nút bấm để lấy vị trí
    const buttonRef = useRef(null);
    // Ref cho chính menu dropdown để kiểm tra click
    const menuRef = useRef(null);

    // Tính toán vị trí của dropdown khi mở
    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = 224; // Chiều rộng của menu (w-56 trong tailwind)

            // Đặt vị trí ngay dưới nút bấm và căn lề phải
            setMenuPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.right + window.scrollX - menuWidth,
            });
        }
        setIsOpen(!isOpen);
    };

    // Đóng dropdown khi click ra ngoài hoặc scroll
    useEffect(() => {
        if (!isOpen) return; // Chỉ chạy logic khi dropdown đang mở

        const handleClickOutside = (event) => {
            // Đóng dropdown NẾU click nằm ngoài CẢ nút bấm VÀ menu
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target) &&
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }   
        };

        const handleScroll = () => {
            if (isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [isOpen]);

    const handleOptionClick = (option) => {
        onValueChange(option); // Gọi hàm callback của component cha
        setIsOpen(false); // Đóng dropdown
    };

    const DropdownMenu = () =>
        createPortal(
            <div
                ref={menuRef} // Gán ref vào đây để theo dõi
                className="fixed z-50 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                role="menu"
                aria-orientation="vertical"
            >
                <div className="py-1">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>,
            document.body
        );

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <IoIosArrowDown />
            </button>

            {isOpen && <DropdownMenu />}
        </>
    );
}
