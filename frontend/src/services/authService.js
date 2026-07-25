import apiClient from "./apiClient";

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ data: { user: object, token: string } }>}
 */
export function login({ email, password }) {
  return apiClient.post("/auth/login", { email, password });
}

/**
 * @param {{ name: string, email: string, password: string }} details
 * @returns {Promise<{ data: { user: object, token: string } }>}
 */
export function register({ name, email, password }) {
  return apiClient.post("/auth/register", { name, email, password });
}

/**
 * @returns {Promise<{ data: object }>} the currently logged-in user
 */
export function getCurrentUser() {
  return apiClient.get("/auth/me");
}

/**
 * @param {{ name?: string, email?: string, password?: string }} updates
 * @returns {Promise<{ data: object }>} updated user
 */
export function updateProfile(updates) {
  return apiClient.put("/auth/profile", updates);
}

export function logout() {
  return Promise.resolve();
}