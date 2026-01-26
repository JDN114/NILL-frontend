// src/services/gmail.service.ts
import api from "./api";

export interface GmailStatus {
  connected: boolean;
  email: string | null;
  expired?: boolean | null;
}

export async function getGmailAuthUrl(): Promise<string> {
  try {
    const res = await api.get("/gmail/auth-url");
    if (!res.data?.auth_url) {
      throw new Error("Keine Auth-URL vom Backend erhalten");
    }
    return res.data.auth_url;
  } catch (err: any) {
    console.error("Fehler beim Abrufen der Gmail Auth URL:", err?.response?.data || err.message);
    throw new Error("Gmail Login konnte nicht gestartet werden");
  }
}

export async function getGmailStatus(): Promise<GmailStatus> {
  try {
    const res = await api.get("/gmail/status");
    const data = res.data;
    return {
      connected: Boolean(data?.connected),
      email: data?.email ?? null,
      expired: data?.expired ?? null,
    };
  } catch (err: any) {
    console.error("Fehler beim Abrufen des Gmail Status:", err?.response?.data || err.message);
    return { connected: false, email: null, expired: null };
  }
}
