import React from "react";

export default function EmailCard({ email }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-colors">
      <h2 className="text-xl font-bold text-white">{email.subject || "Kein Betreff"}</h2>
      <p className="text-gray-300 mt-2">{email.body || "Keine Nachricht"}</p>

      {email.summary && (
        <p className="text-gray-400 mt-2 italic">
          <span className="font-semibold">Zusammenfassung:</span> {email.summary}
        </p>
      )}

      {email.priority && (
        <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white rounded">
          PRIORITÄT: {email.priority}
        </span>
      )}

      {email.spam && (
        <span className="inline-block mt-2 px-2 py-1 bg-yellow-600 text-black rounded ml-2">
          SPAM
        </span>
      )}

      {email.action_items?.length > 0 && (
        <div className="mt-2">
          <span className="font-semibold text-gray-300">Action Items:</span>
          <ul className="list-disc list-inside text-gray-400">
            {email.action_items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {email.language && (
        <p className="mt-2 text-gray-400">
          <span className="font-semibold">Sprache:</span> {email.language}
        </p>
      )}

      {email.detected_dates?.length > 0 && (
        <p className="mt-2 text-gray-400">
          <span className="font-semibold">Erkannte Termine:</span>{" "}
          {email.detected_dates.join(", ")}
        </p>
      )}
    </div>
  );
}
