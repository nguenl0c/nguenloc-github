import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';

// Task actions
const TASK_ACTIONS = {
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  SET_FILTER: 'SET_FILTER',
  SET_SEARCH: 'SET_SEARCH',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  LOAD_TASKS: 'LOAD_TASKS',
  BULK_UPDATE: 'BULK_UPDATE',
};

// Task reducer for state management
function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: Date.now() }],
      };

    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };

    case TASK_ACTIONS.SET_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterType]: action.payload.value,
        },
      };

    case TASK_ACTIONS.SET_SEARCH:
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.payload,
        },
      };

    case TASK_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          search: '',
          status: 'all',
          priority: 'all',
        },
      };

    case TASK_ACTIONS.LOAD_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };

    case TASK_ACTIONS.BULK_UPDATE:
      return {
        ...state,
        tasks: state.tasks.map(task => {
          const update = action.payload.updates.find(u => u.id === task.id);
          return update ? { ...task, ...update.changes } : task;
        }),
      };

    default:
      return state;
  }
}

// Initial state
const initialState = {
  tasks: [],
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
  },
};

// Create contexts
const TaskStateContext = createContext();
const TaskDispatchContext = createContext();

// Context provider component
export function TaskProvider({ children, initialTasks = [] }) {
  const [state, dispatch] = useReducer(taskReducer, {
    ...initialState,
    tasks: initialTasks,
  });

  return (
    <TaskStateContext.Provider value={state}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}

// Custom hooks to use the context
export function useTaskState() {
  const context = useContext(TaskStateContext);
  if (!context) {
    throw new Error('useTaskState must be used within a TaskProvider');
  }
  return context;
}

export function useTaskDispatch() {
  const context = useContext(TaskDispatchContext);
  if (!context) {
    throw new Error('useTaskDispatch must be used within a TaskProvider');
  }
  return context;
}

// Higher-level hook that combines state and actions
export function useTaskContext() {
  const state = useTaskState();
  const dispatch = useTaskDispatch();

  // Memoized action creators
  const actions = useMemo(
    () => ({
      addTask: task => dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: task }),

      deleteTask: taskId =>
        dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: taskId }),

      updateTask: (taskId, updates) =>
        dispatch({
          type: TASK_ACTIONS.UPDATE_TASK,
          payload: { id: taskId, updates },
        }),

      setFilter: (filterType, value) =>
        dispatch({
          type: TASK_ACTIONS.SET_FILTER,
          payload: { filterType, value },
        }),

      setSearch: searchTerm =>
        dispatch({
          type: TASK_ACTIONS.SET_SEARCH,
          payload: searchTerm,
        }),

      clearFilters: () => dispatch({ type: TASK_ACTIONS.CLEAR_FILTERS }),

      loadTasks: tasks =>
        dispatch({ type: TASK_ACTIONS.LOAD_TASKS, payload: tasks }),

      bulkUpdate: updates =>
        dispatch({
          type: TASK_ACTIONS.BULK_UPDATE,
          payload: { updates },
        }),
    }),
    [dispatch]
  );

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    return state.tasks.filter(task => {
      const matchesSearch =
        !state.filters.search ||
        task.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        task.assignees.some(assignee =>
          assignee.toLowerCase().includes(state.filters.search.toLowerCase())
        );

      const matchesStatus =
        state.filters.status === 'all' || task.status === state.filters.status;
      const matchesPriority =
        state.filters.priority === 'all' ||
        task.priority === state.filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [state.tasks, state.filters]);

  // Memoized statistics
  const statistics = useMemo(() => {
    const todo = filteredTasks.filter(task => task.status === 'Todo').length;
    const inProgress = filteredTasks.filter(
      task => task.status === 'In Progress'
    ).length;
    const done = filteredTasks.filter(task => task.status === 'Done').length;
    const total = state.tasks.length;
    const filtered = filteredTasks.length;

    return { todo, inProgress, done, total, filtered };
  }, [filteredTasks, state.tasks.length]);

  // Memoized tasks by status
  const getTasksByStatus = useCallback(
    status => {
      return filteredTasks.filter(task => task.status === status);
    },
    [filteredTasks]
  );

  return {
    // State
    tasks: filteredTasks,
    allTasks: state.tasks,
    filters: state.filters,
    statistics,

    // Actions
    ...actions,
    getTasksByStatus,

    // Computed properties
    isFiltered:
      state.filters.search ||
      state.filters.status !== 'all' ||
      state.filters.priority !== 'all',
  };
}

// HOC for components that need task context
export function withTaskContext(Component) {
  return function TaskContextWrapper(props) {
    const taskContext = useTaskContext();
    return <Component {...props} {...taskContext} />;
  };
}
