import React, { useEffect, useContext, useRef, useState } from "react";
import EmailCard from "./EmailCard";
import { OutlookContext } from "../context/OutlookContext";
import { GmailContext } from "../context/GmailContext";

export default function EmailList() {
  const outlook = useContext(OutlookContext);
  const gmail = useContext(GmailContext);

  // Stable primitive — only changes when the actual connection state changes,
  // not on every email list update (PERF-M3: was the full context object).
  const outlookConnected = Boolean(outlook?.connected);
  const gmailConnected   = Boolean(gmail?.connected?.connected);
  const providerKey = outlookConnected ? "outlook" : gmailConnected ? "gmail" : null;

  // Always-current ref to the fetch fn — read inside the effect so the effect
  // dep stays stable (only providerKey) while the closure is never stale.
  const fetchRef = useRef(null);
  fetchRef.current = providerKey === "outlook"
    ? () => outlook.fetchEmails?.()
    : providerKey === "gmail"
      ? () => gmail.fetchInboxEmails?.()
      : null;

  const [loading, setLoading] = useState(false);

  // PERF-M3: dep is providerKey (string) not the full context object.
  // PERF-M4: cancelled flag prevents setState after unmount / provider change.
  useEffect(() => {
    if (!providerKey) return;
    let cancelled = false;
    const loadEmails = async () => {
      try {
        setLoading(true);
        await fetchRef.current?.();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadEmails();
    return () => { cancelled = true; };
  }, [providerKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!providerKey) return <p className="text-gray-400">Kein E-Mail-Konto verbunden.</p>;
  if (loading) return <p className="text-gray-400">E-Mails werden geladen…</p>;

  const emails = (outlookConnected ? outlook.emails : gmail.emails) ?? [];
  if (!emails.length) return <p className="text-gray-400">Keine E-Mails vorhanden.</p>;

  return (
    <div>
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}
