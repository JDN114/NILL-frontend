import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { GmailContext } from "../context/GmailContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const { emails, connected, fetchStatus, fetchEmails, connectGmail } = useContext(GmailContext);

  useEffect(() => {
    fetchStatus();
    if (connected) fetchEmails();
  }, [connected]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        <span className="mr-4">Eingeloggt als: {user?.email}</span>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
      </div>

      <div className="mb-4">
        {connected ? (
          <span className="text-green-600">Gmail verbunden</span>
        ) : (
          <button onClick={connectGmail} className="px-4 py-2 bg-blue-500 text-white rounded">
            Gmail verbinden
          </button>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Emails</h2>
        {emails.length === 0 ? (
          <p>Keine Emails gefunden</p>
        ) : (
          <ul>
            {emails.map((e) => (
              <li key={e.id} className="mb-2 p-2 border rounded">
                <div><strong>Von:</strong> {e.from}</div>
                <div><strong>Betreff:</strong> {e.subject}</div>
                <div><strong>Snippet:</strong> {e.snippet}</div>
                <div><strong>Zusammenfassung:</strong> {e.summary}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
