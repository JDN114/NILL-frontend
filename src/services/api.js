// frontend/src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://api.nillai.de";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🍪 wichtig für Session-Cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT automatisch mitsenden
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------- Gmail --------------------

export const getGmailAuthUrl = async () => {
  const res = await api.get("/gmail/auth-url");
  return res.data;
};

export const getGmailStatus = async () => {
  const res = await api.get("/gmail/status");
  return res.data;
};

export default api;
