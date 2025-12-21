import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { GmailContext } from "../context/GmailContext";

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const gmail = useContext(GmailContext);

  if (!auth || !gmail) {
    return <div className="p-6 text-red-600">Context nicht initialisiert</div>;
  }

  const { user, logout } = auth;
  const { connected, emails, fetchStatus, fetchEmails, connectGmail } = gmail;

  useEffect(() => { fetchStatus?.(); }, []);
  useEffect(() => { if (connected) fetchEmails?.(); }, [connected]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        Eingeloggt als: {user?.email ?? "Unbekannt"} 
        <button onClick={logout}>Logout</button>
      </div>
      <div>
        {connected ? "Gmail verbunden" :
          <button onClick={connectGmail}>Gmail verbinden</button>}
      </div>
      <ul>
        {emails?.map(e => (
          <li key={e.id}>{e.subject}</li>
        ))}
      </ul>
    </div>
  );
}
