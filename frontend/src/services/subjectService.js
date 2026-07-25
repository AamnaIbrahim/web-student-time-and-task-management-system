import apiClient from "./apiClient";

/**
 * @returns {Promise<{ data: object[] }>}
 */
export function getSubjects() {
  return apiClient.get("/subjects");
}

/**
 * @param {string} id
 * @returns {Promise<{ data: object }>}
 */
export function getSubjectById(id) {
  return apiClient.get(`/subjects/${id}`);
}

/**
 * @param {{ name: string, code: string, instructor: string, color?: string }} subjectData
 * @returns {Promise<{ data: object }>}
 */
export function createSubject(subjectData) {
  return apiClient.post("/subjects", subjectData);
}

/**
 * @param {string} id
 * @param {object} updates
 * @returns {Promise<{ data: object }>}
 */
export function updateSubject(id, updates) {
  return apiClient.put(`/subjects/${id}`, updates);
}

/**
 * @param {string} id
 * @returns {Promise<{ data: { id: string } }>}
 */
export function deleteSubject(id) {
  return apiClient.delete(`/subjects/${id}`);
}