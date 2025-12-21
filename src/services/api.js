import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api.nillai.de";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // ← JWT läuft über Header, nicht Cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gmail
export const getGmailAuthUrl = async () => {
  const res = await api.get("/gmail/auth-url");
  return res.data.auth_url;
};

export const getGmailStatus = async () => {
  const res = await api.get("/gmail/status");
  return res.data.connected;
};

export const getGmailEmails = async () => {
  const res = await api.get("/gmail/emails");
  return res.data.emails;
};

// Auth
export async function loginUser(email, password) {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("access_token", res.data.access_token);
  return res.data;
}

export default api;
