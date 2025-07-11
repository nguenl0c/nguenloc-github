import React, { useEffect, useState } from 'react';
import TaskTable from '../components/tableView/TaskTalbe.jsx';
import TaskBoard from '../components/TaskBoard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import ViewSwitcher from '../components/ViewSwitcher.jsx';
import TaskFilters from '../components/TaskFilters.jsx';
import { useTasks } from "../hooks/useTasksOptimized.js";
// import { useTasksOptimized } from "../hooks/useTasksOptimized.js";

export function Home() {
  const {
    tasks,
    statuses, 
    loading,
    error,
    addTask,
    addStatus,
    deleteStatus,
    updateStatus,
    deleteTask,
    updateTask,
    updateFilter,
    updateSearch,
  } = useTasks();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentView, setCurrentView] = useState(
    () => localStorage.getItem("task-manager-view") || "table"
  );
  const [newTaskStatus, setNewTaskStatus] = useState('Todo'); // Track status for new task

  useEffect(() => {
    localStorage.setItem("task-manager-view", currentView);
  }, [currentView]);

  const handleFilterChange = (filterType, value) => {
    updateFilter(filterType, value);
  };

  const handleSearchChange = searchTerm => {
    updateSearch(searchTerm);
  };

  // Handle adding task from board columns
  const handleAddTaskFromBoard = (status) => {
    setNewTaskStatus(status);
    setShowTaskForm(true);
  };

  // Handle adding task with specified status
  const handleAddTask = (taskData) => {
    addTask({ ...taskData, status: newTaskStatus });
    setShowTaskForm(false);
    setNewTaskStatus('Todo'); // Reset to default
  };

  return (
    <div className='mx-auto h-screen flex flex-col'>
      {/* Header Section - không co giãn */}
      <div className='flex-shrink-0 flex flex-col px-4 pt-4 md:flex-row justify-between items-start md:items-center gap-4 mb-4'>
        <div>
          <h1 className='pl-3 text-xl font-extraboldd text-gray-900 self-center'>nguenl0c's project reactJS</h1>
        </div>

        <div className='flex items-center gap-4'>
          <ViewSwitcher
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          <button
            onClick={() => {
              setNewTaskStatus('Todo');
              setShowTaskForm(true);
            }}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors'
          >
            <span>+</span>
            New Task
          </button>
        </div>
      </div>

      {/* Filters - không co giãn */}
      <div className='flex-shrink-0'>
        <TaskFilters
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Content Area - chiếm hết không gian còn lại */}
      <div className='flex-1 overflow-hidden'>
        {currentView === 'table' ? (
          <div className='w-full h-full overflow-auto'>
            <TaskTable
              tasks={tasks}
              statuses={statuses}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
          </div>
        ) : (
          <div className='w-full h-full overflow-hidden'>
            <TaskBoard
              tasks={tasks}
              statuses={statuses}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              onAddTask={handleAddTaskFromBoard}
              onAddStatus={addStatus}
              onDeleteStatus={deleteStatus}
              onUpdateStatus={updateStatus}
            />
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm onAddTask={handleAddTask} onClose={() => setShowTaskForm(false)} statuses={statuses} />
      )}
    </div>
  );
}
