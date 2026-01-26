// src/services/api.js
import axios from "axios";

// --------------------------------------------------
// BASIS-URL (KEIN HARDCODED PROD FALLBACK)
// --------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL ist nicht gesetzt – Abbruch aus Sicherheitsgründen"
  );
}

// --------------------------------------------------
// AXIOS INSTANZ
// --------------------------------------------------
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔐 HttpOnly Cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// --------------------------------------------------
// RESPONSE INTERCEPTOR – AUTH & FEHLER
// --------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 🔐 Session abgelaufen / ungültig
    if (status === 401) {
      // optional: global logout event
      window.dispatchEvent(new Event("auth:logout"));
    }

    // ❌ KEINE sensitiven Daten loggen
    if (import.meta.env.DEV) {
      console.error("API Error:", {
        url: error?.config?.url,
        status,
        message: error?.message,
      });
    }

    return Promise.reject(error);
  }
);

// --------------------------------------------------
// AUTH
// --------------------------------------------------
export async function registerUser(email, password) {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

export async function loginUser(email, password) {
  // Backend setzt HttpOnly Cookie
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function logoutUser() {
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

// --------------------------------------------------
// GMAIL
// --------------------------------------------------
export async function getGmailAuthUrl() {
  const res = await api.get("/gmail/auth-url");
  return res.data?.auth_url ?? null;
}

export async function getGmailStatus() {
  const res = await api.get("/gmail/status");
  return res.data;
}

export async function getGmailEmails(mailbox = "inbox") {
  const res = await api.get("/gmail/emails", {
    params: { mailbox },
  });
  return res.data;
}

export async function getGmailEmailDetail(id, mailbox = "inbox") {
  if (!id) {
    throw new Error("Email-ID fehlt");
  }

  const res = await api.get(`/gmail/emails/${id}`, {
    params: { mailbox },
  });

  return res.data;
}

export async function markEmailRead(id) {
  if (!id) return;
  try {
    await api.post(`/gmail/emails/${id}/read`);
  } catch {
    // absichtlich still
  }
}

// --------------------------------------------------
// DEFAULT EXPORT
// --------------------------------------------------
export default api;
