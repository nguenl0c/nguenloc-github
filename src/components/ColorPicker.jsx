import React from "react";

export default function ColorPicker({
    colors = [],
    selectedColor,
    onSelectColor,
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {Array.isArray(colors) &&
                colors.map((color) => (
                    <button
                        key={color.name}
                        type="button"
                        onClick={() => onSelectColor(color.name)}
                        className={`w-6 h-6 rounded-full transition-transform duration-150 ${color.classes.split(" ")[0]
                            } ${selectedColor === color.name
                                ? "ring-2 ring-offset-1 ring-blue-500 transform scale-110"
                                : "hover:scale-110"
                            }`}
                        aria-label={`Select color ${color.name}`}
                    />
                ))}
        </div>
    );
}