// src/services/gmailService.js
import api from "./api";

/**
 * Gmail OAuth – Auth URL abrufen
 * GET /gmail/auth-url
 */
export async function getGmailAuthUrl() {
  try {
    const res = await api.get("/gmail/auth-url");

    if (!res.data?.auth_url) {
      throw new Error("Ungültige Gmail Auth URL");
    }

    return res.data.auth_url;
  } catch (err) {
    const status = err?.response?.status;

    if (status === 401) {
      throw new Error("Nicht authentifiziert");
    }

    throw new Error("Gmail Login konnte nicht gestartet werden");
  }
}

/**
 * Gmail Status abrufen
 * GET /gmail/status
 */
export async function getGmailStatus() {
  try {
    const res = await api.get("/gmail/status");
    const data = res.data || {};

    return {
      connected: Boolean(data.connected),
      email: data.email ?? null,
      expired: data.expired ?? null,
    };
  } catch (err) {
    const status = err?.response?.status;

    if (status === 401) {
      throw new Error("Nicht authentifiziert");
    }

    throw new Error("Gmail Status konnte nicht geladen werden");
  }
}
