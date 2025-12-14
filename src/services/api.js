// /root/nill/frontend/src/services/api.js
import axios from "axios";

// Backend-URL aus Env oder Fallback
const API_URL = process.env.REACT_APP_API_URL || "https://api.nillai.de";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // falls Cookies verwendet werden
});

// JWT automatisch hinzufügen, falls vorhanden
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Auth / Nutzer ----------
export async function registerUser(email, password) {
  return api.post("/auth/auth/register", { email, password });
}

export async function loginUser(email, password) {
  return api.post("/auth/auth/login", { email, password });
}

// ---------- Dashboard ----------
export const fetchDashboardData = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

// ---------- Gmail Integration ----------
export const getGmailAuthUrl = async () => {
  const res = await api.get("/gmail/auth-url");
  return res.data;
};

export const getGmailStatus = async () => {
  const res = await api.get("/gmail/status");
  return res.data;
};

export const getGmailEmails = async () => {
  const res = await api.get("/gmail/emails");
  return res.data;
};

// Optional: einzelne Mail zusammenfassen
export const summarizeEmail = async (email_id) => {
  const res = await api.post(`/emails/${email_id}/summarize`);
  return res.data;
};

// Optional: neue Mail erstellen
export const createEmail = async (email) => {
  const res = await api.post("/emails", email);
  return res.data;
};

export default api;
