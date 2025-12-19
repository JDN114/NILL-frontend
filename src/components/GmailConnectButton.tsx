import React from "react";
import api from "../services/api";

export default function GmailConnectButton() {
  const handleConnect = async () => {
    try {
      const res = await api.get("/gmail/auth-url");
      window.location.href = res.data.auth_url;
    } catch (err: any) {
      console.error("Fehler beim Verbinden:", err);
      alert(err.response?.data?.detail || "Fehler beim Verbinden mit Gmail");
    }
  };

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Gmail verbinden
    </button>
  );
}
