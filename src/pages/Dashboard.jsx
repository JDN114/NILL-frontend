import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { GmailContext } from "../context/GmailContext";

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const gmail = useContext(GmailContext);

  // 🔒 HARD GUARDS – niemals destructuren, bevor Context existiert
  if (!auth || !gmail) {
    return (
      <div className="p-6 text-red-600">
        Context nicht initialisiert (Auth oder Gmail)
      </div>
    );
  }

  const { user, logout } = auth;
  const {
    emails = [],
    connected = false,
    fetchStatus,
    fetchEmails,
    connectGmail,
  } = gmail;

  useEffect(() => {
    fetchStatus?.();
  }, []);

  useEffect(() => {
    if (connected) {
      fetchEmails?.();
    }
  }, [connected]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-4 flex items-center gap-4">
        <span>Eingeloggt als: {user?.email ?? "Unbekannt"}</span>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        {connected ? (
          <span className="text-green-600 font-medium">
            Gmail verbunden
          </span>
        ) : (
          <button
            onClick={connectGmail}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Gmail verbinden
          </button>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Emails</h2>

        {emails.length === 0 ? (
          <p className="text-gray-500">Keine Emails gefunden</p>
        ) : (
          <ul className="space-y-3">
            {emails.map((e) => (
              <li key={e.id} className="p-3 border rounded">
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
