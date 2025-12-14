// /root/nill/frontend/src/services/api.js
import axios from "axios";

/**
 * Backend-Basis-URL
 *
 * PROD:
 *  - über NGINX: /api  → http://127.0.0.1:8000
 *
 * DEV (optional):
 *  - VITE_API_URL=http://localhost:8000
 */
const API_BASE =
  import.meta?.env?.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * JWT automatisch anhängen
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   AUTH
========================= */

export const registerUser = (email, password) =>
  api.post("/auth/register", { email, password });

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

/* =========================
   DASHBOARD
========================= */

export const fetchDashboardData = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};

/* =========================
   GMAIL
========================= */

/**
 * Gmail OAuth Start
 */
export const getGmailAuthUrl = async () => {
  const res = await api.get("/gmail/auth-url");
  return res.data;
};

/**
 * Gmail Callback (optional manuell)
 */
export const handleGmailCallback = async (code, state) => {
  const res = await api.get("/gmail/callback", {
    params: { code, state },
  });
  return res.data;
};

/* =========================
   EMAILS
========================= */

export const getEmails = async () => {
  const res = await api.get("/emails");
  return res.data;
};

export const createEmail = async (email) => {
  const res = await api.post("/emails", email);
  return res.data;
};

export const summarizeEmail = async (email_id) => {
  const res = await api.post(`/emails/${email_id}/summarize`);
  return res.data;
};

export default api;
