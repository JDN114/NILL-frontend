import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://api.nillai.de";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 🔑 JWT automatisch mitsenden
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("access_token", res.data.access_token);
  return res.data;
};

// ---------- GMAIL ----------
export const getGmailAuthUrl = async () => {
  const res = await api.get("/gmail/auth-url");
  return res.data;
};

export const getGmailStatus = async () => {
  const res = await api.get("/gmail/status");
  return res.data;
};

// ---------- Gmail ----------
export const getGmailEmails = async () => {
  const res = await api.get("/gmail/emails");
  return res.data;
};

export default api;
