import axios from "axios";
import { API_CONFIG } from "../constants/apiConfig";

// Single configured Axios instance every service file uses.
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

// Attach the stored JWT (if any) to every outgoing request, so the
// backend's `protect` middleware can identify the logged-in user.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.SESSION_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Expired/invalid token — clear the session and bounce to Login,
    // the same outcome as a manual logout.
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem(API_CONFIG.SESSION_TOKEN_KEY);
      window.location.href = "/login";
    }

    const message = error.response?.data?.message || error.message || "Something went wrong.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;