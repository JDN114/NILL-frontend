// src/services/api.js
import axios from "axios";

// ----------------------------
// Basis-URL
// ----------------------------
const API_URL = process.env.REACT_APP_API_URL || "https://api.nillai.de";

// ----------------------------
// Axios-Instanz
// ----------------------------
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ----------------------------
// Request Interceptor
// ----------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------------
// AUTH
// ----------------------------
export async function registerUser(email, password) {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("access_token", res.data.access_token);
  return res.data;
}

export async function logoutUser() {
  localStorage.removeItem("access_token");
  await api.post("/auth/logout");
}

export async function getCurrentUser() {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
}

// ----------------------------
// GMAIL
// ----------------------------
export async function getGmailAuthUrl() {
  const res = await api.get("/gmail/auth-url");
  return res.data?.auth_url || null;
}

/**
 * Backend liefert:
 * {
 *   connected: boolean,
 *   email: string | null,
 *   expired: boolean | null
 * }
 */
export async function getGmailStatus() {
  const res = await api.get("/gmail/status");
  return res.data;
}

/**
 * Backend liefert:
 * { emails: [...] }
 */
export async function getGmailEmails() {
  const res = await api.get("/gmail/emails");
  return res.data;
}

export async function getGmailEmailDetail(id) {
  const res = await api.get(`/gmail/emails/${id}`);
  return res.data;
}

export async function markEmailRead(id) {
  await api.post(`/gmail/emails/${id}/read`);
}

export default api;
