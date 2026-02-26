import React, { useEffect, useState, useContext } from "react";
import EmailCard from "./EmailCard";
import { GmailContext } from "../context/GmailContext";

const API_BASE = "https://api.nillai.de";

export default function EmailList() {
  const gmail = useContext(GmailContext);

  const [outlookConnected, setOutlookConnected] = useState(false);
  const [outlookEmails, setOutlookEmails] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --------------------------------------------------
  // CHECK OUTLOOK STATUS
  // --------------------------------------------------
  const fetchOutlookStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/outlook/status`, {
        credentials: "include",
      });
      const data = await res.json();
      setOutlookConnected(data.connected === true);
      return data.connected === true;
    } catch {
      return false;
    }
  };

  // --------------------------------------------------
  // FETCH OUTLOOK EMAILS
  // --------------------------------------------------
  const fetchOutlookEmails = async () => {
    try {
      const res = await fetch(`${API_BASE}/outlook/emails`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Outlook fetch failed");

      const data = await res.json();
      setOutlookEmails(data.emails || []);
    } catch (err) {
      console.error(err);
      setError("Outlook Emails konnten nicht geladen werden");
    }
  };

  // --------------------------------------------------
  // MAIN LOAD LOGIC
  // --------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        // Gmail hat Priorität
        if (gmail.connected?.connected) {
          await gmail.fetchInboxEmails();
        } else {
          const outlookOk = await fetchOutlookStatus();
          if (outlookOk) {
            await fetchOutlookEmails();
          }
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Emails konnten nicht geladen werden");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [gmail.connected]);

  // --------------------------------------------------
  // SELECT EMAIL SOURCE
  // --------------------------------------------------
  const emails =
    gmail.connected?.connected
      ? gmail.emails
      : outlookConnected
      ? outlookEmails
      : [];

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  if (loading)
    return <p className="text-gray-400">E-Mails werden geladen…</p>;

  if (error)
    return <p className="text-red-500">{error}</p>;

  if (!emails.length)
    return <p className="text-gray-400">Keine E-Mails vorhanden.</p>;

  return (
    <div>
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}
