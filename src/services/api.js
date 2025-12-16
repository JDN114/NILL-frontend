import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://api.nillai.de";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // falls Cookies genutzt werden
});

// JWT automatisch hinzufügen
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
  const res = await api.get("/dashboard");
  return res.data;
};

// ---------- Gmail Integration ----------

// Auth-URL abrufen
export const getGmailAuthUrl = async () => {
  try {
    const res = await api.get("/gmail/auth-url");
    return res.data.auth_url;
  } catch (err) {
    console.error("Gmail verbinden fehlgeschlagen:", err);
    throw err;
  }
};

// Gmail Status abrufen
export const getGmailStatus = async () => {
  try {
    const res = await api.get("/gmail/status");
    return res.data.connected;
  } catch (err) {
    console.error("Gmail Status abrufen fehlgeschlagen:", err);
    throw err;
  }
};

// Gmail Mails abrufen
export const getGmailEmails = async () => {
  try {
    const res = await api.get("/gmail/emails");
    return res.data.emails;
  } catch (err) {
    console.error("Gmail Emails abrufen fehlgeschlagen:", err);
    throw err;
  }
};

// Optional: einzelne Mail zusammenfassen
export const summarizeEmail = async (email_id) => {
  try {
    const res = await api.post(`/emails/${email_id}/summarize`);
    return res.data;
  } catch (err) {
    console.error("Mail Zusammenfassung fehlgeschlagen:", err);
    throw err;
  }
};

// Optional: neue Mail erstellen
export const createEmail = async (email) => {
  try {
    const res = await api.post("/emails", email);
    return res.data;
  } catch (err) {
    console.error("Mail erstellen fehlgeschlagen:", err);
    throw err;
  }
};

export default api;
