import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
  // ✅ Default-Werte verhindern Fehler bei Destructuring
  const [stats, setStats] = useState({
    emails: 0,
    responses: 0,
    activeProcesses: 0,
  });

  // Optional: Daten vom Backend laden
  useEffect(() => {
    // Beispiel-API, kann angepasst werden
    // fetch("/api/dashboard")
    //   .then(res => res.json())
    //   .then(data => setStats(data))
    //   .catch(err => console.error("Dashboard API Error:", err));
  }, []);

  const { emails, responses, activeProcesses } = stats;

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-[#071023] to-[#03060a] text-white">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <Header title="Dashboard" />

        {/* DASHBOARD CONTENT */}
        <main className="p-8 flex-1">
          <h2 className="text-2xl font-semibold mb-6">Übersicht</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gesendete E-Mails */}
            <div className="glass p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Gesendete E-Mails</h3>
              <p className="text-[var(--accent)] text-3xl font-bold">{emails}</p>
            </div>

            {/* Antworten */}
            <div className="glass p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Antworten</h3>
              <p className="text-[var(--accent)] text-3xl font-bold">{responses}</p>
            </div>

            {/* Aktive Prozesse */}
            <div className="glass p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Aktive Prozesse</h3>
              <p className="text-[var(--accent)] text-3xl font-bold">{activeProcesses}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
