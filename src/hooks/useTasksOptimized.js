import { useState, useEffect, useMemo, useCallback } from "react";
// import { tasks as initialTasks } from '../data/tasks.js';

const API_URL = "http://localhost:3004/tasks";

// Giả sử bạn cũng có thể lưu và tải statuses từ API trong tương lai
// const STATUS_API_URL = "http://localhost:3004/statuses";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Lấy dữ liệu từ API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const [taskResponse, statusResponse] = await Promise.all([
          fetch("http://localhost:3004/tasks"),
          fetch("http://localhost:3004/statuses"),
        ]);

        if (!taskResponse.ok || !statusResponse.ok) {
          throw new Error("Không lấy được dữ liệu từ API");
        }

        const taskData = await taskResponse.json();
        const statusData = await statusResponse.json();

        setTasks(taskData);
        setStatuses(statusData.map(status => status.name)); 

      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addStatus = useCallback(
    async (newStatusName) => {
      if (!newStatusName || statuses.includes(newStatusName)) {
        alert(`Status "${newStatusName}" đã tồn tại hoặc không hợp lệ.`);
        return;
      }

      try {
        // Dữ liệu để gửi lên server
        const newStatusObject = { name: newStatusName };

        const response = await fetch("http://localhost:3004/statuses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStatusObject),
        });

        if (!response.ok) throw new Error("Failed to add status.");

        const createdStatus = await response.json();

        // Cập nhật UI với status đã được tạo
        setStatuses((prevStatuses) => [...prevStatuses, createdStatus.name]);
      } catch (err) {
        console.error(err);
        alert("Không thể thêm trạng thái mới. Vui lòng thử lại.");
      }
    },
    [statuses]
  );

  const addTask = useCallback(async (newTaskData) => {
    try {
      const response = await fetch("http://localhost:3004/tasks", {
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
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3004/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task.");

      // Xóa task khỏi UI sau khi đã xóa thành công trên server
      setTasks((prev) => prev.filter((task) => task.id != taskId));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const updateTask = useCallback(
    async (taskId, updates) => {

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id == taskId ? { ...task, ...updates } : task
        )
      );

      try {
        const response = await fetch(`http://localhost:3004/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          // Nếu server báo lỗi, chúng ta sẽ throw error để kích hoạt khối catch bên dưới
          const errorData = await response.text();
          throw new Error(`Failed to update task: ${errorData}`);
        }

        // Nếu thành công, bạn có thể chọn đồng bộ lại state với dữ liệu trả về từ server
        // Điều này đảm bảo UI khớp 100% với database
        const updatedTaskFromServer = await response.json();
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id == taskId ? updatedTaskFromServer : task
          )
        );
      } catch (err) {
        console.error(err);
        alert(
          "Không thể cập nhật công việc. Đang khôi phục lại trạng thái cũ."
        );

      }
    },
    [API_URL]
  );

  //fILLER
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
  });

  const updateFilter = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const updateSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignees.some((assignee) =>
          assignee.toLowerCase().includes(filters.search.toLowerCase())
        );

      // Status filter
      const matchesStatus =
        filters.status === "all" || task.status === filters.status;

      // Priority filter
      const matchesPriority =
        filters.priority === "all" || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const getTasksByStatus = (status) => {
    const filteredTasks = getFilteredTasks();
    return filteredTasks.filter((task) => task.status === status);
  };

  const getTaskStats = () => {
    const filteredTasks = getFilteredTasks();
    const todo = filteredTasks.filter((task) => task.status === "Todo").length;
    const inProgress = filteredTasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const done = filteredTasks.filter((task) => task.status === "Done").length;
    const total = tasks.length;
    const filtered = filteredTasks.length;

    return { todo, inProgress, done, total, filtered };
  };

  return {
    tasks: getFilteredTasks(),
    allTasks: tasks,
    statuses,
    loading,
    error,
    filters,
    addStatus,
    addTask,
    deleteTask,
    updateTask,
    updateFilter,
    updateSearch,
    getTasksByStatus,
    getTaskStats,
  };
}
