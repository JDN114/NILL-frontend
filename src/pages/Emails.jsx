import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Emails() {
  const [emails, setEmails] = useState([]); // alle Emails
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Alle");

  // Emails vom Backend laden
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get("/api/emails"); // Endpunkt anpassen
        console.log("Backend Response:", res.data);
        setEmails(Array.isArray(res.data) ? res.data : []); // Sicherstellen, dass es ein Array ist
      } catch (err) {
        console.error("Fehler beim Laden der Emails:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  // Filter Logik
  const filteredEmails = Array.isArray(emails)
    ? selectedCategory === "Alle"
      ? emails
      : emails.filter((email) => email.category === selectedCategory)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-xl">Lade Emails...</p>
      </div>
    );
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Posteingang</h1>

      {/* Kategorien Auswahl */}
      <div className="flex gap-3 mb-6">
        {["Alle", "Support", "Vertrieb", "Marketing"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Emails Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmails.length > 0 ? (
          filteredEmails.map((email) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-colors"
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
          ))
        ) : (
          <p className="text-gray-300 col-span-full">Keine Emails gefunden.</p>
        )}
      </div>
    </section>
  );
}
