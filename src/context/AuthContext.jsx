import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Quelle der Wahrheit: /auth/me
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get("/auth/me", {
          withCredentials: true, // 👈 extrem wichtig für OAuth-Redirects
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (_) {}

    localStorage.removeItem("access_token"); // optional, UX only
    setUser(null);
  };

  // ⏳ Verhindert UI-Glitches beim Initialisieren
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Lade Session…
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
