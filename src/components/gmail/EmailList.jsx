// src/components/gmail/EmailList.jsx
import React, { useContext } from "react";
import { GmailContext } from "../../context/GmailContext";

export default function EmailList() {
  const { emails, openEmail } = useContext(GmailContext);

  if (!emails.length) {
    return (
      <div className="text-gray-400 p-6 text-center">
        Keine E-Mails
      </div>
    );
  }

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {emails.map((mail) => (
        <button
          key={mail.id}
          onClick={() => openEmail(mail.id)}
          className="w-full text-left p-4 bg-gray-900 hover:bg-gray-800 focus:bg-gray-800 focus:outline-none transition flex flex-col gap-1"
        >
          <span className="font-semibold text-white truncate" title={mail.subject || "(Kein Betreff)"}>
            {mail.subject || "(Kein Betreff)"}
          </span>
          <span className="text-sm text-gray-400 truncate" title={mail.from}>
            {mail.from}
          </span>
          <span className="text-sm text-gray-500 truncate" title={mail.snippet}>
            {mail.snippet}
          </span>
        </button>
      ))}
    </div>
  );
}
