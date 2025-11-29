import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Emails() {
  const [emails, setEmails] = useState([]);

  // Emails initial vom Backend holen
  const fetchEmails = async () => {
    try {
      const response = await axios.get("https://api.nillai.de/emails");
      setEmails(response.data);
    } catch (error) {
      console.error("Fehler beim Laden der Emails:", error);
    }
  };

  useEffect(() => {
    fetchEmails();

    // --- WebSocket Setup für Live-Updates ---
    const ws = new WebSocket("wss://api.nillai.de/ws/emails");

    ws.onmessage = (event) => {
      const newEmail = JSON.parse(event.data);
      setEmails((prev) => [newEmail, ...prev]); // neue Emails oben hinzufügen
    };

    ws.onopen = () => console.log("WebSocket verbunden!");
    ws.onclose = () => console.log("WebSocket geschlossen.");

    return () => ws.close(); // Cleanup
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-6">Postfach</h1>

      {emails.length === 0 ? (
        <p className="text-gray-400">Keine Emails vorhanden.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emails.map((email) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-bold text-white">{email.subject}</h2>
              <p className="text-gray-300 mt-2">{email.body}</p>
              {email.summary && (
                <p className="text-gray-400 mt-2 italic">
                  Zusammenfassung: {email.summary}
                </p>
              )}
              {email.priority && (
                <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white rounded">
                  PRIORITÄT: {email.priority}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
