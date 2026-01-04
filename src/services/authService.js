// src/services/authService.js
import api from "./api";

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.access_token);
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export async function getCurrentUser() {
  try {
    const res = await api.get("/auth/me");
    return res.data; // { id, email }
  } catch (err) {
    return null;
  }
}

export function isAdmin(user) {
  // Du kannst hier optional das Admin-Flag prüfen, falls es im Payload steckt
  return user?.is_admin === true;
}
