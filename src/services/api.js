// src/services/api.js
import axios from "axios";

// --------------------------------------------------
// BASIS-URL
// --------------------------------------------------
const API_URL =
  import.meta.env.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "https://api.nillai.de";

// --------------------------------------------------
// AXIOS INSTANZ
// --------------------------------------------------
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // wichtig für Cookies / CORS
});

// --------------------------------------------------
// REQUEST INTERCEPTOR – JWT
// --------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// AUTH
// --------------------------------------------------
export async function registerUser(email, password) {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await api.post("/auth/login", { email, password });
  if (res.data?.access_token) {
    localStorage.setItem("access_token", res.data.access_token);
  }
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
  } catch (err) {
    return null;
  }
}

// --------------------------------------------------
// GMAIL – EXAKT PASSEND ZUM BACKEND
// --------------------------------------------------

/**
 * GET /gmail/auth-url
 * → { auth_url: string }
 */
export async function getGmailAuthUrl() {
  const res = await api.get("/gmail/auth-url");
  return res.data?.auth_url ?? null;
}

/**
 * GET /gmail/status
 * → {
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
 * GET /gmail/emails
 * → { emails: [...] }
 */
export async function getGmailEmails(mailbox = "inbox") {
  const res = await api.get("/gmail/emails", {
    params: { mailbox },
  });
  return res.data;
}

/**
 * GET /gmail/emails/{id}
 * → {
 *   id,
 *   from,
 *   subject,
 *   body,
 *   ai: {
 *     status,
 *     summary,
 *     priority,
 *     category,
 *     sentiment
 *   }
 * }
 */
export async function getGmailEmailDetail(id) {
  if (!id) throw new Error("Email id missing");
  const res = await api.get(`/gmail/emails/${id}`);
  return res.data;
}

/**
 * POST /gmail/emails/{id}/read
 * (optional – aktuell no-op im Backend, aber safe)
 */
export async function markEmailRead(id) {
  if (!id) return;
  try {
    await api.post(`/gmail/emails/${id}/read`);
  } catch {
    // Backend hat evtl. keinen read-endpoint → ignorieren
  }
}

// --------------------------------------------------
// DEFAULT EXPORT
// --------------------------------------------------
export default api;
