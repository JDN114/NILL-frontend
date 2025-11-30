import React, { useState, useEffect } from "react";
import axios from "axios";
import EmailCard from "../components/EmailCard"; // Dein Design für einzelne Emails

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all"); // für künftige Kategorien

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/emails"); // Dein Backend-Endpunkt
        setEmails(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
        console.error(err);
        setError("Fehler beim Laden der Emails");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  // Filterfunktion für Kategorien (z. B. alle, wichtig, spam, etc.)
  const filteredEmails = emails.filter(email => {
    if (selectedCategory === "all") return true;
    return email.category === selectedCategory;
  });

  return (
    <div className="dashboard-wrapper p-6 min-h-screen bg-gradient-to-br from-[#071023] to-[#03060a] text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">NILL Email Dashboard</h1>
        <p className="text-gray-300">Übersicht deiner Emails</p>
      </header>

      {/* Kategorien */}
      <div className="flex gap-4 mb-6">
        {["all", "priority", "spam"].map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Ladezustand */}
      {loading && <p className="text-gray-300">Lade Emails...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && filteredEmails.length === 0 && (
        <p className="text-gray-300">Keine Emails in dieser Kategorie.</p>
      )}

      {/* Emails */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(filteredEmails) &&
          filteredEmails.map((email) => (
            <EmailCard key={email.id} email={email} />
          ))}
      </div>
    </div>
  );
}
