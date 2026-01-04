// src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.nillai.de";

// ----------------------------
// Axios-Instanz
// ----------------------------
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // optional, falls Cookies verwendet werden
});

// ----------------------------
// Request Interceptor: Token automatisch hinzufügen
// ----------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ----------------------------
// AUTH-FUNKTIONEN
// ----------------------------
export async function loginUser(email, password) {
  const res = await api.post("/auth/login", { email, password });
  console.log("Login response:", res.data);
  localStorage.setItem("access_token", res.data.access_token);
  return res.data;
}

export function logoutUser() {
  localStorage.removeItem("access_token");
}

// Aktuellen User abrufen
export async function getCurrentUser() {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    console.error("Error fetching current user:", err);
    return null;
  }
}

// ----------------------------
// GMAIL-FUNKTIONEN
// ----------------------------
export async function getGmailAuthUrl() {
  const res = await api.get("/gmail/auth-url");
  return res.data.auth_url;
}

export async function getGmailStatus() {
  const res = await api.get("/gmail/status");
  return res.data.connected;
}

export async function getGmailEmails() {
  const res = await api.get("/gmail/emails");
  return res.data.emails;
}

export async function getGmailEmailDetail(id) {
  const res = await api.get(`/gmail/emails/${id}`);
  return res.data;
}

export async function markEmailRead(id) {
  await api.post(`/gmail/emails/${id}/read`);
}

// ----------------------------
// Export Axios-Instanz für Admin / weitere Services
// ----------------------------
export default api;
