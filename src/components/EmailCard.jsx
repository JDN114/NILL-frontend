import React from "react";

export default function EmailCard({ email }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="font-bold text-lg">{email.subject}</h2>
      <p>{email.body}</p>
      {email.summary && (
        <p className="mt-2 text-gray-500 italic">Zusammenfassung: {email.summary}</p>
      )}
    </div>
  );
}
