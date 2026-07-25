import apiClient from "./apiClient";

/**
 * @returns {Promise<{ data: object[] }>}
 */
export function getTasks() {
  return apiClient.get("/tasks");
}

/**
 * @param {string} id
 * @returns {Promise<{ data: object }>}
 */
export function getTaskById(id) {
  return apiClient.get(`/tasks/${id}`);
}

/**
 * @param {object} taskData - title, description, subjectId, priority, dueDate, dueTime, status
 * @returns {Promise<{ data: object }>}
 */
export function createTask(taskData) {
  return apiClient.post("/tasks", taskData);
}

/**
 * @param {string} id
 * @param {object} updates
 * @returns {Promise<{ data: object }>}
 */
export function updateTask(id, updates) {
  return apiClient.put(`/tasks/${id}`, updates);
}

/**
 * @param {string} id
 * @returns {Promise<{ data: { id: string } }>}
 */
export function deleteTask(id) {
  return apiClient.delete(`/tasks/${id}`);
}

/**
 * Convenience helper for the Task Management module's status toggle.
 * @param {string} id
 * @param {string} status - "Pending" | "Completed"
 * @returns {Promise<{ data: object }>}
 */
export function updateTaskStatus(id, status) {
  return updateTask(id, { status });
}