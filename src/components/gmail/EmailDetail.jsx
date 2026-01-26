// src/components/gmail/EmailDetail.jsx
import React, { useContext } from "react";
import { GmailContext } from "../../context/GmailContext";

export default function EmailDetail() {
  const { activeEmail, closeEmail, loadingEmail } = useContext(GmailContext);

  if (loadingEmail) {
    return (
      <div className="p-6 flex items-center justify-center text-gray-400">
        Lade E-Mail…
      </div>
    );
  }

  if (!activeEmail) {
    return (
      <div className="p-6 text-gray-400">
        Wähle eine E-Mail aus
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-700 rounded-lg h-full bg-gray-900 text-white overflow-auto">
      <button
        onClick={closeEmail}
        className="mb-4 text-sm text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        aria-label="Zurück zur E-Mail-Liste"
      >
        ← Zurück
      </button>

      <h2 className="text-xl font-bold mb-2">{activeEmail.subject}</h2>
      <div className="text-sm text-gray-400 mb-4">
        Von: {activeEmail.from}
      </div>

      <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-gray-800 p-4 rounded-lg overflow-x-auto">
        {activeEmail.body || "(Kein Textinhalt)"}
      </pre>
    </div>
  );
}
