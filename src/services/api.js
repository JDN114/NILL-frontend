import axios from "axios";

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  process.env.REACT_APP_API_URL || "https://api.nillai.de";

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // wichtig für Cookies / Sessions
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================================
   AUTH INTERCEPTOR (JWT)
========================================================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   AUTH
========================================================= */

export const registerUser = async (email, password) => {
  const res = await api.post("/auth/auth/register", {
    email,
    password,
  });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/auth/login", {
    email,
    password,
  });

  // 🔐 TOKEN SPEICHERN
  if (res.data?.access_token) {
    localStorage.setItem("access_token", res.data.access_token);
  }

  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
};

/* =========================================================
   GMAIL OAUTH
========================================================= */

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

/* =========================================================
   EMAIL AI (KI-INTEGRATION)
========================================================= */

/**
 * 🔍 Eine E-Mail von der KI analysieren lassen
 * Erwartet Backend: POST /emails/analyze
 */
export const analyzeEmailWithAI = async (email) => {
  const res = await api.post("/emails/analyze", {
    subject: email.subject,
    from: email.from,
    snippet: email.snippet,
    body: email.body || "",
  });

  return res.data;
};

/**
 * 🧠 Kurze Zusammenfassung einer Mail
 * Backend: POST /emails/summarize
 */
export const summarizeEmail = async (emailId) => {
  const res = await api.post(`/emails/${emailId}/summarize`);
  return res.data;
};

/**
 * 🤖 Automatische Klassifizierung (Finance / Meeting / etc.)
 */
export const classifyEmail = async (email) => {
  const res = await api.post("/emails/classify", {
    subject: email.subject,
    snippet: email.snippet,
  });

  return res.data;
};

/* =========================================================
   PIPELINE / AUTOMATION
========================================================= */

/**
 * 🔄 Manuell E-Mail-Pipeline triggern
 */
export const runEmailPipeline = async () => {
  const res = await api.post("/email-pipeline/run");
  return res.data;
};

/* =========================================================
   EXPORT DEFAULT
========================================================= */

export default api;
