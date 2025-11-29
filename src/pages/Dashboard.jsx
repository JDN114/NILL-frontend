import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EmailInbox from "./EmailInbox"; // neue Komponente für Postfach

export default function Dashboard() {
  const [view, setView] = useState("overview");

  // Beispiel-Daten
  const emails = [
    { id: 1, sender: "julia@example.com", subject: "Neues Projekt", summary: "Bitte beachte..." },
    { id: 2, sender: "max@example.com", subject: "Meeting Reminder", summary: "Das Meeting findet um..." },
    { id: 3, sender: "team@example.com", subject: "Update", summary: "Der neue Release..." },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-[#071023] to-[#03060a] text-white">
      <Sidebar /> {/* Sidebar bleibt gleich */}

      <div className="flex-1 flex flex-col">
        <Header title="Dashboard" /> {/* Header bleibt gleich */}

        <main className="p-8 flex-1">
          {view === "overview" && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <h2 className="text-4xl font-bold text-white">NILL</h2>
              <p className="text-2xl text-white">Übersicht</p>

              {/* Kategorie Box */}
              <div
                className="glass p-10 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setView("email")}
              >
                <h3 className="text-2xl font-semibold mb-2 text-white">E-Mail</h3>
                <p className="text-gray-300">Postfach & Automatisierungen ansehen</p>
              </div>
            </div>
          )}

          {view === "email" && (
            <EmailInbox emails={emails} goBack={() => setView("overview")} />
          )}
        </main>
      </div>
    </div>
  );
}
