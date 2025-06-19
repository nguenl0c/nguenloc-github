import React, { useMemo, useCallback } from 'react';

/**
 * Enhanced custom hook for task management with performance optimizations
 * Includes memoization, debouncing, and optimistic updates
 */
export function useTasksOptimized() {
  const [tasks, setTasks] = React.useState(() => {
    // Load from localStorage if available
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.warn('Failed to parse saved tasks:', error);
      }
    }
    // Fallback to imported tasks
    return require('../data/tasks.js').tasks;
  });

  const [filters, setFilters] = React.useState({
    search: '',
    status: 'all',
    priority: 'all',
  });

  // Debounced search to prevent excessive filtering
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Persist tasks to localStorage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.warn('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  // Memoized task operations
  const addTask = useCallback(newTask => {
    setTasks(prev => {
      const task = { ...newTask, id: Date.now() };
      return [...prev, task];
    });
  }, []);

  const deleteTask = useCallback(taskId => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, ...updates } : task))
    );
  }, []);

  const updateFilter = useCallback((filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const updateSearch = useCallback(searchTerm => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  // Optimized filtering with useMemo
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter using debounced search
      const matchesSearch =
        !debouncedSearch ||
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.assignees.some(assignee =>
          assignee.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

      // Status filter
      const matchesStatus =
        filters.status === 'all' || task.status === filters.status;

      // Priority filter
      const matchesPriority =
        filters.priority === 'all' || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, debouncedSearch, filters.status, filters.priority]);

  // Memoized task statistics
  const taskStats = useMemo(() => {
    const todo = filteredTasks.filter(task => task.status === 'Todo').length;
    const inProgress = filteredTasks.filter(
      task => task.status === 'In Progress'
    ).length;
    const done = filteredTasks.filter(task => task.status === 'Done').length;
    const total = tasks.length;
    const filtered = filteredTasks.length;

    return { todo, inProgress, done, total, filtered };
  }, [filteredTasks, tasks.length]);

  // Memoized tasks by status for board view
  const getTasksByStatus = useCallback(
    status => {
      return filteredTasks.filter(task => task.status === status);
    },
    [filteredTasks]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
    });
  }, []);

  // Export data for backup
  const exportTasks = useCallback(() => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [tasks]);

  // Import data from file
  const importTasks = useCallback(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const importedTasks = JSON.parse(e.target.result);
          setTasks(importedTasks);
          resolve(importedTasks.length);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filters,
    taskStats,
    addTask,
    deleteTask,
    updateTask,
    updateFilter,
    updateSearch,
    getTasksByStatus,
    clearFilters,
    exportTasks,
    importTasks,
    isFiltered:
      debouncedSearch || filters.status !== 'all' || filters.priority !== 'all',
  };
}
