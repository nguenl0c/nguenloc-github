import React from 'react';
import { CiViewBoard, CiViewTable } from "react-icons/ci";

export default function ViewSwitcher({ currentView, onViewChange }) {
  const views = [
    { key: "table", label: "Table View", icon: <CiViewTable /> },
    { key: "board", label: "Board View", icon: <CiViewBoard /> },
  ];

  return (
    <div className='flex bg-gray-100 rounded-lg p-1'>
      {views.map(view => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
            currentView === view.key
              ? 'bg-white shadow-sm text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span>{view.icon}</span>
          {view.label}
        </button>
      ))}
    </div>
  );
}
