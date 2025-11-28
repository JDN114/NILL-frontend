// /root/nill/frontend/src/services/api.js
import axios from "axios";

const BACKEND = process.env.REACT_APP_API_URL || "https://api.nillai.de"; 
// lokal testing: "http://localhost:8000"

const api = axios.create({
  baseURL: BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // falls Cookies benutzt werden
});

// Request interceptor: fügt JWT hinzu wenn vorhanden
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function registerUser(email, password) {
  return api.post("/auth/auth/register", { email, password });
}

export async function loginUser(email, password) {
  return api.post("/auth/auth/login", { email, password });
}

// Beispiel: geschützter Endpunkt
export async function fetchProtected() {
  return api.get("/protected-endpoint");
}

export default api;
