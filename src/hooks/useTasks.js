import { useState, useEffect, useMemo, useCallback } from 'react';
// import { tasks as initialTasks } from '../data/tasks.js';

const API_URL = "http://localhost:3004/tasks"; 

export function useTasks() {
  
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Lấy dữ liệu từ API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Không lấy được dữ liệu từ API');
        }
        const data = await response.json();
        setTasks(data); //Cập nhật state tasks với dữ liệu từ API
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  
  const addTask = useCallback(async (newTaskData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskData),
      });
      if (!response.ok) throw new Error("Failed to add task.");
      
      const createdTask = await response.json();
      // Cập nhật UI với task đã được tạo (có ID từ server)
      setTasks((prev) => [...prev, createdTask]);
    } catch (err) {
      console.error(err);
      // Có thể thêm logic xử lý lỗi ở đây, ví dụ: alert(err.message);
    }
  }, []);
  
  const deleteTask = useCallback(async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task.");
      
      // Xóa task khỏi UI sau khi đã xóa thành công trên server
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "PATCH", // Hoặc 'PUT'
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update task.");
      
      const updatedTask = await response.json();
      // Cập nhật UI với dữ liệu mới nhất từ server
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
    );
  } catch (err) {
    console.error(err);
  }
}, []);

//fILLER
const [filters, setFilters] = useState({
  search: '',
  status: 'all',
  priority: 'all',
});

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
    loading,
    error,
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
