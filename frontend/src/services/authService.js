import { mockResolve, mockReject } from "../utils/mockApiHelper";
import { mockUser } from "../mockData/user";

let currentUser = { ...mockUser };

export function login({ email, password }) {
  if (email === currentUser.email && password === currentUser.password) {
    const { password: _password, ...safeUser } = currentUser;
    return mockResolve({ user: safeUser, token: "mock-token-123" });
  }
  return mockReject("Invalid email or password.");
}

export function register({ name, email, password }) {
  if (!name || !email || !password) {
    return mockReject("All fields are required.");
  }

  currentUser = { id: currentUser.id, name, email, password };
  const { password: _password, ...safeUser } = currentUser;
  return mockResolve({ user: safeUser, token: "mock-token-123" });
}

export function getCurrentUser() {
  const { password: _password, ...safeUser } = currentUser;
  return mockResolve(safeUser);
}

export function updateProfile(updates) {
  currentUser = { ...currentUser, ...updates };
  const { password: _password, ...safeUser } = currentUser;
  return mockResolve(safeUser);
}

export function logout() {
  return mockResolve(null, 200);
}