import axios from "axios";

const API_URL = "https://api.nillai.de";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT automatisch anhängen
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------------- AUTH ---------------- */
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  if (res.data?.access_token) {
    localStorage.setItem("access_token", res.data.access_token);
  }
  return res.data;
};

/* ---------------- GMAIL ---------------- */

// ❗ PUBLIC – KEIN AUTH ERFORDERLICH
export const getGmailAuthUrl = async () => {
  const res = await axios.get(`${API_URL}/gmail/auth-url`);
  return res.data;
};

// AUTH REQUIRED
export const getGmailStatus = async () => {
  const res = await api.get("/gmail/status");
  return res.data;
};

export default api;
