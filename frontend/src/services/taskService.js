import { mockResolve, mockReject, generateMockId } from "../utils/mockApiHelper";
import { mockTasks, TASK_STATUS } from "../mockData/tasks";

let tasks = [...mockTasks];

export function getTasks() {
  return mockResolve([...tasks]);
}

export function getTaskById(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return mockReject("Task not found.");
  }
  return mockResolve(task);
}

export function createTask(taskData) {
  if (!taskData.title || !taskData.subjectId || !taskData.dueDate) {
    return mockReject("Title, subject, and due date are required.");
  }

  const newTask = {
    id: generateMockId(),
    status: TASK_STATUS.PENDING,
    ...taskData,
  };
  tasks = [...tasks, newTask];
  return mockResolve(newTask);
}

export function updateTask(id, updates) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return mockReject("Task not found.");
  }

  const updatedTask = { ...tasks[index], ...updates };
  tasks = tasks.map((t) => (t.id === id ? updatedTask : t));
  return mockResolve(updatedTask);
}

export function deleteTask(id) {
  const exists = tasks.some((t) => t.id === id);
  if (!exists) {
    return mockReject("Task not found.");
  }

  tasks = tasks.filter((t) => t.id !== id);
  return mockResolve({ id });
}

export function updateTaskStatus(id, status) {
  return updateTask(id, { status });
}