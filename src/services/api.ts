import axios from "axios";

const token = localStorage.getItem("token"); // aus Login
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.nillai.de",
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

// src/services/api.ts (weiter unten hinzufügen)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.error("Nicht authentifiziert, bitte neu einloggen.");
        // hier könnte ein Redirect oder Logout erfolgen
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
