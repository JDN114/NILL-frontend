import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://api.nillai.de";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// JWT automatisch hinzufügen
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Auth ----------
export async function registerUser(email, password) {
  return api.post("/auth/auth/register", { email, password });
}

export async function loginUser(email, password) {
  return api.post("/auth/auth/login", { email, password });
}

// ---------- Dashboard ----------
export const fetchDashboardData = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};

// ---------- Gmail ----------
export const getGmailAuthUrl = async (user_id) => {
  const res = await api.get(`/gmail/auth-url?user_id=${user_id}`);
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

export default api;
