import React, { useEffect, useState } from "react";
import { getGmailAuthUrl, getGmailStatus, getGmailEmails } from "../services/api";

export default function Dashboard() {
  const [connected, setConnected] = useState(false);
  const [emails, setEmails] = useState([]);

  const handleGmailConnect = async () => {
    try {
      const url = await getGmailAuthUrl();
      window.location.href = url; // Weiterleitung zu Google
    } catch (err) {
      console.error("Gmail verbinden fehlgeschlagen:", err);
    }
  };

  const fetchEmails = async () => {
    try {
      const mails = await getGmailEmails();
      setEmails(mails);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      const status = await getGmailStatus();
      setConnected(status);
      if (status) fetchEmails();
    };
    checkStatus();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {!connected && <button onClick={handleGmailConnect}>Gmail verbinden</button>}
      {connected && (
        <div>
          <h2>Emails</h2>
          <ul>
            {emails.map(email => (
              <li key={email.id}>
                <b>{email.subject}</b> - {email.from} <br /> {email.snippet}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
