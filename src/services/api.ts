import axios from "axios";

const apiUrl = (import.meta as any).env?.VITE_API_URL;
if (!apiUrl) {
  throw new Error("VITE_API_URL ist nicht gesetzt – Abbruch aus Sicherheitsgründen");
}

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Clear any stale state and force re-login
        document.cookie = "csrf_t=; Max-Age=0; path=/";
        window.location.href = "/login";
      } else if (status === 403) {
        console.error("Zugriff verweigert.");
      } else {
        console.error("API-Fehler:", error.response.data);
      }
    } else {
      console.error("Netzwerkfehler:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
