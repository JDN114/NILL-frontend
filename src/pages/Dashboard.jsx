import React, { useEffect, useState } from "react";
import { getGmailAuthUrl, getGmailStatus, getGmailEmails } from "../services/api";

export default function Dashboard() {
  const [gmailConnected, setGmailConnected] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Status prüfen
  const fetchStatus = async () => {
    try {
      const res = await getGmailStatus();
      setGmailConnected(res.connected);
      if (res.connected) fetchEmails();
    } catch (err) {
      console.error(err);
    }
  };

  // Emails laden
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await getGmailEmails();
      setEmails(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Gmail verbinden
  const connectGmail = async () => {
    try {
      const { auth_url } = await getGmailAuthUrl();
      window.location.href = auth_url; // Weiterleitung zu Google
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Gmail Integration</h2>
        {gmailConnected ? (
          <p style={{ color: "green" }}>Gmail verbunden ✅</p>
        ) : (
          <button onClick={connectGmail}>Mit Gmail verbinden</button>
        )}
      </div>

      {gmailConnected && (
        <div>
          <h3>Letzte Emails</h3>
          {loading ? (
            <p>Lade...</p>
          ) : (
            <ul>
              {emails.map((email) => (
                <li key={email.id}>
                  <b>{email.subject}</b> von {email.from} <br />
                  {email.snippet}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
