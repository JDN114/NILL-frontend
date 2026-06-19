// src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL ist nicht gesetzt – Abbruch aus Sicherheitsgründen");
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔐 HttpOnly Cookies
  timeout: 15000,
});

// Read a cookie value by name
function _getCookie(name) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// CSRF double-submit: attach token from cookie to every state-changing request
api.interceptors.request.use((config) => {
  const method = (config.method || "get").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = _getCookie("csrf_t");
    if (token) config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

// ------------------------------------
// AUTH
// ------------------------------------
export async function registerUser(email, password) {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function logoutUser() {
  await api.post("/auth/logout");
}

// Log out on ALL devices: revokes every active session server-side.
export async function logoutAllDevices() {
  await api.post("/auth/logout-all");
}

export async function getCurrentUser() {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
}

// ------------------------------------
// PASSWORD & ACCOUNT
// ------------------------------------
export async function changePassword(oldPassword, newPassword) {
  const res = await api.post("/me/change-password", { old_password: oldPassword, new_password: newPassword });
  return res.data;
}

export async function deleteAccount(password) {
  const res = await api.delete("/me/delete-account", { data: { password } });
  return res.data;
}

// ------------------------------------
// GMAIL
// ------------------------------------
export function connectGmail() {
  window.location.href = `${API_URL}/gmail/auth-url`;
}

export async function getGmailStatus() {
  const res = await api.get("/gmail/status");
  return res.data;
}

export async function getGmailEmails(mailbox = "inbox") {
  const res = await api.get("/gmail/emails", { params: { mailbox } });
  return res.data;
}

export async function getGmailEmailDetail(id) {
  if (!id) throw new Error("Email-ID fehlt");
  const res = await api.get(`/gmail/emails/${id}`);
  return res.data;
}

export async function markEmailRead(id) {
  if (!id) return;
  try {
    await api.post(`/gmail/emails/${id}/read`);
  } catch {
    // still
  }
}

// ------------------------------------
// OUTLOOK
// ------------------------------------
export function connectOutlook() {
  window.location.href = `${API_URL}/outlook/auth-url`;
}

export async function getOutlookStatus() {
  try {
    const res = await api.get("/outlook/status");
    return res.data;
  } catch {
    return { connected: false };
  }
}

export async function getOutlookEmails() {
  const res = await api.get("/outlook/emails");
  return res.data;
}

export async function getOutlookEmailDetail(id) {
  if (!id) throw new Error("Email-ID fehlt");
  const res = await api.get(`/outlook/emails/${id}`);
  return res.data;
}

export async function disconnectOutlook() {
  const res = await api.post("/outlook/disconnect");
  return res.data;
}

// ------------------------------------
// UNIFIED EMAIL FETCH (SAFE VERSION)
// ------------------------------------
export async function getEmails() {
  try {

    // 1. Gmail prüfen
    const gmailStatus = await getGmailStatus().catch(() => ({ connected: false }));

    if (gmailStatus?.connected) {
      const data = await getGmailEmails("inbox");
      return data?.emails || [];
    }

    // 2. Outlook prüfen
    const outlookStatus = await getOutlookStatus().catch(() => ({ connected: false }));

    if (outlookStatus?.connected) {
      const data = await getOutlookEmails();
      return data?.emails || [];
    }

    // nichts verbunden
    return [];

  } catch (err) {
    console.error("Unified email fetch error:", err);
    return [];
  }
}
export default api;
