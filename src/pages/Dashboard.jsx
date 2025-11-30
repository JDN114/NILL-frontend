import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Einzelnes Email-Element
function EmailCard({ email }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 p-4 rounded-xl shadow mb-4 border border-gray-700 hover:border-blue-500 transition-colors"
    >
      <h2 className="text-xl font-bold text-white">{email.subject}</h2>
      <p className="text-gray-300 mt-2">{email.body}</p>
      {email.summary && (
        <p className="text-gray-400 mt-2 italic">Zusammenfassung: {email.summary}</p>
      )}
      {email.priority && (
        <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white rounded">
          PRIORITÄT: {email.priority}
        </span>
      )}
      {email.category && (
        <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white rounded">
          Kategorie: {email.category}
        </span>
      )}
      {email.action_items && email.action_items.length > 0 && (
        <div className="mt-2 text-yellow-400">
          <strong>Action Items:</strong>
          <ul className="list-disc list-inside">
            {email.action_items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {email.language && (
        <span className="inline-block mt-2 px-2 py-1 bg-green-600 text-white rounded">
          Sprache: {email.language}
        </span>
      )}
    </motion.div>
  );
}

// Dashboard-Komponente
export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Emails vom Backend abrufen
  const fetchEmails = async () => {
    try {
      const response = await axios.get("/emails/"); // Backend-URL anpassen
      setEmails(response.data);
    } catch (err) {
      console.error("Fehler beim Laden der Emails:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();

    // Automatisches Aktualisieren alle 30 Sekunden
    const interval = setInterval(fetchEmails, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-wrapper p-6">
      <h1 className="text-4xl font-bold text-white mb-6">NILL Email Dashboard</h1>

      {loading && <p className="text-gray-300">Lade Emails...</p>}

      {!loading && emails.length === 0 && (
        <p className="text-gray-300">Keine Emails vorhanden.</p>
      )}

      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}
