import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [gmailUrl, setGmailUrl] = useState("");
  const [error, setError] = useState(null);

  const fetchGmailAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("/gmail/auth-url", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGmailUrl(res.data.auth_url);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  useEffect(() => {
    fetchGmailAuth();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">NILL Dashboard</h1>
      {error && <div className="text-red-600 mb-4">Fehler: {error}</div>}
      {gmailUrl && (
        <a
          href={gmailUrl}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Gmail verbinden
        </a>
      )}
    </div>
  );
}
