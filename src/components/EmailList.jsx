import React, { useEffect, useState } from "react";
import { getEmails } from "../services/api";
import EmailCard from "./EmailCard";

export default function EmailList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Cleanup flag

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEmails();
        if (isMounted) setEmails(data);
      } catch (err) {
        console.error(err);
        if (isMounted)
          setError(
            err?.response?.data?.message || "Fehler beim Laden der E-Mails."
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Prevent setState after unmount
    };
  }, []);

  if (loading) return <p className="text-gray-400">E-Mails werden geladen…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (emails.length === 0) return <p className="text-gray-400">Keine E-Mails vorhanden.</p>;

  return (
    <div>
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}
