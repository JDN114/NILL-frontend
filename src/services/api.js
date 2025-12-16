// frontend/src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://api.nillai.de";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Cookies werden mitgesendet
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT automatisch anfügen, falls vorhanden
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------------------------
// Auth / Nutzer
// -------------------------
export const registerUser = async (email, password) => {
  return api.post("/auth/auth/register", { email, password });
};

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/auth/login", { email, password });
  if (res.data.access_token) {
    localStorage.setItem("access_token", res.data.access_token);
  }
  return res;
};

// -------------------------
// Dashboard
// -------------------------
export const fetchDashboardData = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};

// -------------------------
// Gmail Integration
// -------------------------
export const getGmailAuthUrl = async () => {
  const res = await api.get("/gmail/auth-url");
  return res.data; // { auth_url: "..." }
};

export const getGmailStatus = async () => {
  const res = await api.get("/gmail/status");
  return res.data; // { connected: true/false }
};

export const getGmailEmails = async () => {
  const res = await api.get("/gmail/emails");
  return res.data; // Array von E-Mails
};

// -------------------------
// Optional: E-Mail KI Funktionen
// -------------------------
export const summarizeEmail = async (email_id) => {
  const res = await api.post(`/emails/${email_id}/summarize`);
  return res.data;
};

export const createEmail = async (email) => {
  const res = await api.post("/emails", email);
  return res.data;
};

export default api;
