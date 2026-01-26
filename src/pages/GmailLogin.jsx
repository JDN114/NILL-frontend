// src/pages/GmailLogin.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function GmailLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // 🔐 CSRF-Protect state
      const state = crypto.randomUUID();
      sessionStorage.setItem("oauth_state", state);

      // ✅ API über Axios
      const res = await api.get("/gmail/auth-url", {
        params: { state },
      });

      if (!res.data?.auth_url) throw new Error("Keine Auth-URL erhalten");

      // Weiterleitung zu Google OAuth
      window.location.href = res.data.auth_url;
    } catch (err) {
      console.error("Gmail Login Fehler:", err?.response?.data || err.message);
      setError("Fehler beim Verbinden des Gmail-Kontos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleLogin}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-white ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Verbinden…" : "Gmail Konto verbinden"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
