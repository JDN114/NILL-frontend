import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { MailContext } from "../context/MailContext";

import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";

import { FiArrowLeft, FiEdit2, FiRefreshCw } from "react-icons/fi";

export default function EmailsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    provider,
    connected,
    emails: contextEmails = [],
    activeEmail,
    initializing,
    fetchEmails,
    openEmail,
    closeEmail,
  } = useContext(MailContext);

  const [mailbox, setMailbox] = useState("inbox"); // inbox oder sent
  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localEmails, setLocalEmails] = useState([]);

  const initializedRef = useRef(false);

  // =====================================================
  // Auth Guard
  // =====================================================
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  // =====================================================
  // Hilfsfunktion: Lade Emails & filter nach mailbox
  // =====================================================
  const loadEmails = async () => {
    if (!connected) return [];
    setLoading(true);
    try {
      const fetched = (await fetchEmails()) ?? [];

      // Eindeutige IDs + Postfachfilter
      const seen = new Set();
      const filtered = fetched
        .filter((e) => e?.id && !seen.has(e.id) && (e.mailbox ?? "inbox") === mailbox)
        .map((e) => {
          seen.add(e.id);
          return {
            id: e.id,
            subject: e.subject ?? "(Kein Betreff)",
            from: e.from ?? "(Absender unbekannt)",
            received_at: e.received_at ?? null,
            mailbox: e.mailbox ?? "inbox",
            body: e.body ?? "",
          };
        });

      setLocalEmails(filtered);
      return filtered;
    } catch (err) {
      console.error("Fehler beim Laden der Emails:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Initial Load
  // =====================================================
  useEffect(() => {
    if (!connected || initializedRef.current) return;
    initializedRef.current = true;
    loadEmails();
  }, [connected, mailbox]);

  // =====================================================
  // Refresh
  // =====================================================
  const handleRefresh = async () => {
    await loadEmails();
  };

  // =====================================================
  // Öffne Detail-View
  // =====================================================
  const handleOpenEmail = async (id) => {
    if (!id || activeEmail?.id === id || loading) return;
    setLoading(true);
    try {
      await openEmail(id);
    } catch (err) {
      console.error("Fehler beim Öffnen der Mail:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Schließe Detail-View
  // =====================================================
  const handleCloseEmail = () => closeEmail();

  // =====================================================
  // Loading / No Provider
  // =====================================================
  if (initializing || loading)
    return (
      <PageLayout>
        <p className="text-gray-400 text-center py-10">E-Mails werden geladen…</p>
      </PageLayout>
    );

  if (!connected)
    return (
      <PageLayout>
        <h1 className="text-2xl font-bold mb-6 text-white">Postfach</h1>
        <p className="text-red-400">Kein E-Mail-Konto verbunden</p>
      </PageLayout>
    );

  // =====================================================
  // UI
  // =====================================================
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">
        Postfach <span className="text-sm text-gray-400 ml-3">({provider})</span>
      </h1>

      {!activeEmail && (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4">
            {["inbox", "sent"].map((box) => (
              <button
                key={box}
                onClick={() => setMailbox(box)}
                className={`px-4 py-2 rounded ${
                  mailbox === box
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                {box === "inbox" ? "Posteingang" : "Gesendet"}
              </button>
            ))}

            <button
              onClick={handleRefresh}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FiRefreshCw /> Aktualisieren
            </button>

            <button
              onClick={() => setComposeOpen(true)}
              className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              <FiEdit2 /> Neue E-Mail
            </button>
          </div>

          {/* Email-Liste */}
          <Card className="p-0 overflow-hidden">
            {localEmails.length === 0 ? (
              <p className="text-center p-6 text-gray-400">Keine E-Mails gefunden</p>
            ) : (
              <ul className="divide-y divide-gray-800">
                {localEmails.map((mail) => {
                  const sender = mail.from;
                  const received = mail.received_at ? new Date(mail.received_at).toLocaleString() : "-";
                  return (
                    <li
                      key={mail.id}
                      onClick={() => handleOpenEmail(mail.id)}
                      className="px-6 py-4 hover:bg-gray-800 cursor-pointer"
                    >
                      <div className="flex justify-between mb-1">
                        <p className="font-semibold truncate">{mail.subject}</p>
                        <span className="text-xs text-gray-400">{received}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{sender}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </>
      )}

      {/* Detail-View */}
      {activeEmail && (
        <Card className="p-6">
          <button onClick={handleCloseEmail} className="flex items-center text-gray-400 mb-4">
            <FiArrowLeft className="mr-2" /> Zurück
          </button>
          <h2 className="text-xl font-bold mb-2">{activeEmail.subject ?? "(Kein Betreff)"}</h2>
          <p className="text-gray-400 mb-4">{activeEmail.from ?? "(Absender unbekannt)"}</p>
          <SafeEmailHtml html={activeEmail.body ?? "<p>Kein Inhalt</p>"} />
          <button onClick={() => setReplyOpen(true)} className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
            Antworten
          </button>
        </Card>
      )}

      {/* MODALS */}
      <EmailReplyModal emailId={activeEmail?.id} open={replyOpen} onClose={() => setReplyOpen(false)} />
      <EmailComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
    </PageLayout>
  );
}
