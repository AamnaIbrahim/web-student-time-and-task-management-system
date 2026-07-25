import { createContext, useEffect, useReducer, useCallback } from "react";
import { authReducer, initialAuthState } from "./authReducer";
import { AUTH_ACTIONS } from "./authActionTypes";
import * as authService from "../services/authService";
import { API_CONFIG } from "../constants/apiConfig";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const token = localStorage.getItem(API_CONFIG.SESSION_TOKEN_KEY);

    if (!token) {
      dispatch({ type: AUTH_ACTIONS.HYDRATE_END });
      return;
    }

    authService
      .getCurrentUser()
      .then((res) => {
        dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: res.data });
      })
      .catch(() => {
        localStorage.removeItem(API_CONFIG.SESSION_TOKEN_KEY);
        dispatch({ type: AUTH_ACTIONS.HYDRATE_END });
      });
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    try {
      const res = await authService.login(credentials);
      localStorage.setItem(API_CONFIG.SESSION_TOKEN_KEY, res.data.token);
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: res.data.user });
      return res.data.user;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: err.message });
      throw err;
    }
  }, []);

  const register = useCallback(async (details) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    try {
      const res = await authService.register(details);
      localStorage.setItem(API_CONFIG.SESSION_TOKEN_KEY, res.data.token);
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: res.data.user });
      return res.data.user;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: err.message });
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await authService.updateProfile(updates);
      dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: err.message });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem(API_CONFIG.SESSION_TOKEN_KEY);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    login,
    register,
    updateProfile,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}