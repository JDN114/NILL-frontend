import React, { useEffect } from "react";
import { useEmails } from "../context/EmailContext";

export default function EmailList() {
  const { emails, loading, fetchNextPage } = useEmails();

  useEffect(() => {
    fetchNextPage();
  }, []);

  return (
    <div>
      {emails.map((email) => (
        <div key={email.id} className="p-4 border-b">
          <p><strong>Von:</strong> {email.from}</p>
          <p><strong>Betreff:</strong> {email.subject}</p>
          <p>{email.snippet}</p>
        </div>
      ))}

      {loading && <p>Lädt...</p>}

      {!loading && (
        <button
          onClick={fetchNextPage}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Mehr laden
        </button>
      )}
    </div>
  );
}
