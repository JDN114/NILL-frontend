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
    emails = [],
    activeEmail,
    initializing,
    fetchEmails,
    openEmail,
    closeEmail,
  } = useContext(MailContext);

  const [mailbox, setMailbox] = useState("inbox");
  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredEmails, setFilteredEmails] = useState([]);

  const initializedRef = useRef(false);

  // Auth Guard
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  // Emails laden & filtern nach mailbox
  const loadAndFilterEmails = async () => {
    if (!connected) return [];
    setLoading(true);
    try {
      const fetched = (await fetchEmails()) ?? [];
      const seen = new Set();
      const filtered = fetched.filter(
        (mail) => mail?.id && !seen.has(mail.id) && mail?.mailbox === mailbox && seen.add(mail.id)
      );
      setFilteredEmails(filtered);
      return filtered;
    } catch (err) {
      console.error("Fehler beim Laden der Emails:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initial Load oder Mailboxwechsel
  useEffect(() => {
    if (!connected) return;
    loadAndFilterEmails();
  }, [connected, mailbox]);

  // Refresh Button
  const handleRefresh = async () => {
    await loadAndFilterEmails();
  };

  // Open / Close Email
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

  const handleCloseEmail = () => closeEmail();

  // Loading / No Provider
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

  // UI
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

          {/* Email List */}
          <Card className="p-0 overflow-hidden">
            {filteredEmails.length === 0 ? (
              <p className="text-center p-6 text-gray-400">Keine E-Mails gefunden</p>
            ) : (
              <ul className="divide-y divide-gray-800">
                {filteredEmails.map((mail) => (
                  <li
                    key={mail?.id ?? Math.random()}
                    onClick={() => handleOpenEmail(mail?.id)}
                    className="px-6 py-4 hover:bg-gray-800 cursor-pointer"
                  >
                    <div className="flex justify-between mb-1">
                      <p className="font-semibold truncate">{mail?.subject ?? "(Kein Betreff)"}</p>
                      <span className="text-xs text-gray-400">
                        {mail?.received_at ? new Date(mail.received_at).toLocaleString() : ""}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{mail?.from ?? "(Absender unbekannt)"}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}

      {activeEmail && (
        <Card className="p-6 space-y-6">
          <button onClick={handleCloseEmail} className="flex items-center text-gray-400 mb-4">
            <FiArrowLeft className="mr-2" /> Zurück
          </button>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">{activeEmail.subject ?? "(Kein Betreff)"}</h2>
            <p className="text-gray-400">{activeEmail.from ?? "(Absender unbekannt)"}</p>
          </div>

          <SafeEmailHtml html={activeEmail.body ?? "<p>Kein Inhalt</p>"} />

          {/* ========================= */}
          {/* KI Ergebnisse */}
          {/* ========================= */}
          {activeEmail.ai_status === "done" && (
            <div className="mt-6 p-4 bg-gray-800 rounded space-y-4">
              <h3 className="text-lg font-semibold mb-2">KI Insights</h3>

              {activeEmail.summary && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-300">Zusammenfassung:</h4>
                  <p className="text-gray-200">{activeEmail.summary}</p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {activeEmail.priority && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                    Priority: {activeEmail.priority}
                  </span>
                )}
                {activeEmail.category && (
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Kategorie: {activeEmail.category}
                  </span>
                )}
                {activeEmail.category_group && (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                    Gruppe: {activeEmail.category_group}
                  </span>
                )}
              </div>

              {activeEmail.action_items?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-300">Action Items:</h4>
                  <ul className="list-disc list-inside text-gray-200">
                    {activeEmail.action_items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeEmail.detected_dates?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-300">Erkannte Termine:</h4>
                  <ul className="list-disc list-inside text-gray-200">
                    {activeEmail.detected_dates.map((date, idx) => (
                      <li key={idx}>{new Date(date).toLocaleString()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setReplyOpen(true)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Antworten
          </button>
        </Card>
      )}

      <EmailReplyModal emailId={activeEmail?.id} open={replyOpen} onClose={() => setReplyOpen(false)} />
      <EmailComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
    </PageLayout>
  );
}
