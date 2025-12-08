import React from "react";

export default function GmailLogin({ onConnected }) {
  const handleLogin = async () => {
    try {
      const res = await fetch("/gmail/auth-url");
      const data = await res.json();
      window.location.href = data.url; // Weiterleitung zu Google OAuth
    } catch (err) {
      console.error("Gmail Login Fehler:", err);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
    >
      Gmail Konto verbinden
    </button>
  );
}
