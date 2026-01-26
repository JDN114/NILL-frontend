// src/components/GmailInbox.tsx
import { useEffect, useState, FC } from "react";
import { getGmailEmails } from "../services/api";

interface GmailEmail {
  id: string;
  subject: string;
  from: string;
  snippet: string;
}

const sanitize = (value: unknown): string =>
  typeof value === "string" ? value.slice(0, 500) : "";

const GmailInbox: FC = () => {
  const [emails, setEmails] = useState<GmailEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEmails = async () => {
      try {
        setLoading(true);
        const data = await getGmailEmails({ signal: controller.signal });

        setEmails(
          (Array.isArray(data) ? data : []).map((mail) => ({
            id: sanitize(mail.id),
            subject: sanitize(mail.subject),
            from: sanitize(mail.from),
            snippet: sanitize(mail.snippet),
          }))
        );
      } catch (err: any) {
        if (err.name === "AbortError") return;

        const status = err?.response?.status;
        if (status === 401) {
          setError("Session abgelaufen. Bitte erneut einloggen.");
        } else if (status === 403) {
          setError("Gmail ist nicht verbunden.");
        } else {
          setError("Fehler beim Laden der Gmail Inbox.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
    return () => controller.abort();
  }, []);

  if (loading) return <p>Lade Gmail Inbox…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (emails.length === 0) return <p>Keine E-Mails gefunden.</p>;

  return (
    <div role="list" aria-label="Gmail Inbox">
      <h2 className="text-xl font-bold mb-4">📬 Gmail Inbox</h2>
      {emails.map((mail) => (
        <div
          key={mail.id}
          role="listitem"
          className="border-b border-gray-700 py-2"
        >
          <p className="font-semibold text-white">{mail.subject}</p>
          <p className="text-gray-300">{mail.from}</p>
          <p className="text-gray-400 text-sm">{mail.snippet}</p>
        </div>
      ))}
    </div>
  );
};

export default GmailInbox;
