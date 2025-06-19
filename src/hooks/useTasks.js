import { useState } from 'react';
import { tasks as initialTasks } from '../data/tasks.js';

export function useTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
  });

  const addTask = newTask => {
    setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
  };

  const deleteTask = taskId => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const updateFilter = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const updateSearch = searchTerm => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignees.some(assignee =>
          assignee.toLowerCase().includes(filters.search.toLowerCase())
        );

      // Status filter
      const matchesStatus =
        filters.status === 'all' || task.status === filters.status;

      // Priority filter
      const matchesPriority =
        filters.priority === 'all' || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const getTasksByStatus = status => {
    const filteredTasks = getFilteredTasks();
    return filteredTasks.filter(task => task.status === status);
  };

  const getTaskStats = () => {
    const filteredTasks = getFilteredTasks();
    const todo = filteredTasks.filter(task => task.status === 'Todo').length;
    const inProgress = filteredTasks.filter(
      task => task.status === 'In Progress'
    ).length;
    const done = filteredTasks.filter(task => task.status === 'Done').length;
    const total = tasks.length;
    const filtered = filteredTasks.length;

    return { todo, inProgress, done, total, filtered };
  };

  return {
    tasks: getFilteredTasks(),
    allTasks: tasks,
    filters,
    addTask,
    deleteTask,
    updateTask,
    updateFilter,
    updateSearch,
    getTasksByStatus,
    getTaskStats,
  };
}
