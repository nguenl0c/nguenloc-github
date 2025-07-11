import React from "react";

export default function ResizeHandle({ onMouseDown }) {
    return (
        <div className="absolute right-0 top-0 h-full w-1 cursor-col-resize group">
            <div
                className="h-full w-1 group-hover:w-2 transition-all bg-transparent"
                onMouseDown={onMouseDown}
            />
        </div>
    );
}
