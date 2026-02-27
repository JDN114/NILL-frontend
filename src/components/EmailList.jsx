import React, { useEffect, useContext } from "react";
import EmailCard from "./EmailCard";
import { OutlookContext } from "../context/OutlookContext";
import { GmailContext } from "../context/GmailContext";

export default function EmailList() {
  const outlook = useContext(OutlookContext);
  const gmail = useContext(GmailContext);

  // Entscheide, welcher Provider aktiv ist
  const provider = outlook.connected ? outlook : gmail.connected?.connected ? gmail : null;

  // Lade Emails automatisch beim Mount
  useEffect(() => {
    if (!provider) return;

    if (provider === outlook) {
      outlook.fetchEmails();
    } else if (provider === gmail) {
      gmail.fetchInboxEmails();
    }
  }, [provider, outlook, gmail]);

  if (!provider) return <p className="text-gray-400">Kein E-Mail-Konto verbunden.</p>;

  const loading = provider.loading ?? provider.initializing ?? false;
  const emails = provider.emails ?? [];

  if (loading) return <p className="text-gray-400">E-Mails werden geladen…</p>;
  if (!emails || emails.length === 0) return <p className="text-gray-400">Keine E-Mails vorhanden.</p>;

  return (
    <div>
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}
