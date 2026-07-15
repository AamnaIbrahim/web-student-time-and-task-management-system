import { createContext, useEffect, useReducer, useCallback } from "react";
import { taskReducer, initialTaskState } from "./taskReducer";
import { TASK_ACTIONS } from "./taskActionTypes";
import * as taskService from "../services/taskService";

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  const fetchTasks = useCallback(async () => {
    dispatch({ type: TASK_ACTIONS.FETCH_START });
    try {
      const res = await taskService.getTasks();
      dispatch({ type: TASK_ACTIONS.FETCH_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: TASK_ACTIONS.FETCH_FAILURE, payload: err.message });
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (taskData) => {
    const res = await taskService.createTask(taskData);
    dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: res.data });
    return res.data;
  }, []);

  const editTask = useCallback(async (id, updates) => {
    const res = await taskService.updateTask(id, updates);
    dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: res.data });
    return res.data;
  }, []);

  const removeTask = useCallback(async (id) => {
    await taskService.deleteTask(id);
    dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: { id } });
  }, []);

  const toggleTaskStatus = useCallback(
    async (id, status) => {
      return editTask(id, { status });
    },
    [editTask]
  );

  const value = {
    ...state,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggleTaskStatus,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}