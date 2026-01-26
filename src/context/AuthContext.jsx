import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Quelle der Wahrheit: /auth/me
  useEffect(() => {
    let mounted = true; // Verhindert State-Updates nach Unmount
    async function loadUser() {
      try {
        const res = await api.get("/auth/me", {
          withCredentials: true, // 👈 wichtig für Cookies/OAuth
        });
        if (mounted) setUser(res.data);
      } catch (err) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (_) {}
    localStorage.removeItem("access_token"); // optional
    setUser(null);
  };

  // ⏳ Loading UI, verhindert Glitches
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
