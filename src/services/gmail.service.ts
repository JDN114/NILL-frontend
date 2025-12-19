import api from "./api";

export async function getGmailAuthUrl() {
  const res = await api.get("/gmail/auth-url");
  return res.data.url;
}

export async function getGmailStatus() {
  const res = await api.get("/gmail/status");
  return res.data;
}
