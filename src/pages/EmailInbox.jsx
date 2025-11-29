import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EmailInbox({ goBack }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Emails vom Backend laden
  useEffect(() => {
    async function fetchEmails() {
      try {
        const response = await axios.get("/api/emails"); // Dein CRUD-Endpoint
        setEmails(response.data);
      } catch (err) {
        console.error("Fehler beim Laden der Mails:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, []);

  if (loading) return <p>Lade E-Mails...</p>;

  return (
    <div className="flex flex-col">
      <button
        onClick={goBack}
        className="mb-6 text-sm text-[var(--accent)] hover:underline self-start"
      >
        ← Zurück zur Übersicht
      </button>

      <h2 className="text-3xl font-bold mb-6">Posteingang</h2>

      {emails.length === 0 ? (
        <p>Keine E-Mails vorhanden.</p>
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <div key={email.id} className="glass p-4 rounded-xl shadow hover:scale-105 transition-transform cursor-pointer">
              <p className="text-gray-400 text-sm">Von: {email.sender}</p>
              <p className="font-semibold text-white">{email.subject}</p>
              <p className="text-gray-300">{email.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
