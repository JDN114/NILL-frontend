import React, { useEffect, useContext, useState } from "react";
import EmailCard from "./EmailCard";
import { OutlookContext } from "../context/OutlookContext";
import { GmailContext } from "../context/GmailContext";

export default function EmailList() {
  const outlook = useContext(OutlookContext);
  const gmail = useContext(GmailContext);

  // ---------------- Aktiver Provider ----------------
  const provider = outlook.connected ? outlook : gmail.connected ? gmail : null;

  const [loading, setLoading] = useState(false);

  // ---------------- Emails laden ----------------
  useEffect(() => {
    if (!provider) return;

    const loadEmails = async () => {
      try {
        setLoading(true);
        if (provider === outlook) await provider.fetchEmails?.();
        else if (provider === gmail) await provider.fetchInboxEmails?.();
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, [provider]);

  if (!provider) return <p className="text-gray-400">Kein E-Mail-Konto verbunden.</p>;
  if (loading) return <p className="text-gray-400">E-Mails werden geladen…</p>;

  const emails = provider.emails ?? [];
  if (!emails.length) return <p className="text-gray-400">Keine E-Mails vorhanden.</p>;

  return (
    <div>
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}
