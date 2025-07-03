import React, { useEffect, useState } from 'react';
import TaskTable from '../components/TaskTable.jsx';
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
    <div className='p-4 mx-auto'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
        <div>
          <h1 className='text-xl font-extraboldd text-gray-900'>nguenl0c's project reactJS</h1>
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

      {/* Filters */}
      <TaskFilters
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />

      {/* Content Area */}
      <div>
        {currentView === 'table' ? (
          <div className='w-full overflow-x-auto'>
            <TaskTable
              tasks={tasks}
              statuses={statuses}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
          </div>
        ) : (
          <div className='w-full overflow-x-auto'>
            <TaskBoard
              tasks={tasks}
              statuses={statuses}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              onAddTask={handleAddTaskFromBoard}
              onAddStatus={addStatus}
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
