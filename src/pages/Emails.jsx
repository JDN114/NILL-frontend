// src/pages/Emails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Emails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [categories, setCategories] = useState(["Alle", "Marketing", "Support", "Verträge", "Sonstiges"]);

  // Lade Emails vom Backend
  useEffect(() => {
    axios.get("/api/emails")  // Passe den Endpoint an dein Backend an
      .then((res) => {
        setEmails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Emails:", err);
        setLoading(false);
      });
  }, []);

  // Filterfunktion
  const filteredEmails = selectedCategory === "Alle" 
    ? emails 
    : emails.filter((email) => email.category === selectedCategory);

  if (loading) return <p className="text-white text-center mt-10">Lade Emails...</p>;

  return (
    <section className="relative min-h-screen p-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Posteingang</h1>

        {/* Kategorien */}
        <div className="flex space-x-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Emails Liste */}
        <div className="grid grid-cols-1 gap-4">
          {filteredEmails.length === 0 && (
            <p className="text-gray-400">Keine Emails in dieser Kategorie.</p>
          )}
          {filteredEmails.map((email) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-bold text-white">{email.subject}</h2>
              <p className="text-gray-300 mt-2">{email.body}</p>

              {/* Platz für KI-Zusammenfassung */}
              {email.summary && (
                <p className="text-gray-400 mt-2 italic">
                  Zusammenfassung: {email.summary}
                </p>
              )}

              {/* Optional: Priorität / Spam anzeigen */}
              {email.priority && (
                <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white rounded">
                  PRIORITÄT: {email.priority}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
