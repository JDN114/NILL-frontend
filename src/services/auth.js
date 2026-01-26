// src/services/auth.js
import api from "./api";

/**
 * Aktuellen Benutzer abrufen
 * GET /auth/me
 */
export async function fetchMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

/**
 * Benutzer registrieren
 * POST /auth/register
 */
export async function register(email, password) {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

/**
 * Login
 * POST /auth/login
 * Token-Verarbeitung erfolgt zentral im api.js
 */
export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

/**
 * Logout
 * POST /auth/logout
 */
export async function logout() {
  await api.post("/auth/logout");
}
