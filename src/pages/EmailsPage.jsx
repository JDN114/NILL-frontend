import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { MailContext } from "../context/MailContext";

import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";

// =======================
// Helper
// =======================
function extractSender(mail) {
  if (mail.from_address) return mail.from_address;
  if (mail.from) return mail.from;

  if (mail.from_raw) {
    const match = mail.from_raw.match(/<(.+?)>/);
    return match ? match[1] : mail.from_raw;
  }

  return "Unbekannt";
}

function sortEmails(emails) {
  return [...emails].sort((a, b) => {
    const da = new Date(a.received_at || a.date || 0).getTime();
    const db = new Date(b.received_at || b.date || 0).getTime();
    return db - da;
  });
}

export default function EmailsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    provider,
    connected,
    activeEmail,
    fetchEmails,
    openEmail,
    closeEmail,
    initializing,
    disconnectProvider,
  } = useContext(MailContext);

  const [mailbox, setMailbox] = useState("inbox");
  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const pollingRef = useRef(null);
  const activeEmailRef = useRef(null);

  useEffect(() => {
    activeEmailRef.current = activeEmail;
  }, [activeEmail]);

  // =======================
  // Auth Guard
  // =======================
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  // =======================
  // Emails laden
  // =======================
  const loadEmails = useCallback(async () => {
    if (!connected) return;

    setLoading(true);
    setFetchError(null);

    try {
      const fetched = (await fetchEmails(mailbox)) ?? [];

      const normalized = fetched.map((mail) => ({
        ...mail,
        _sender: extractSender(mail),
        _date: mail.received_at || mail.date || null,
      }));

      const sorted = sortEmails(normalized);

      setFilteredEmails(sorted);
    } catch (err) {
      console.error("Fehler beim Laden der Emails:", err);
      setFetchError("E-Mails konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [connected, mailbox, fetchEmails]);

  useEffect(() => {
    if (!connected || initializing) return;
    loadEmails();
  }, [connected, mailbox, initializing]);

  // =======================
  // AI Polling
  // =======================
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startPolling = (emailId) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const updated = await openEmail(emailId);
        if (
          updated?.ai_status === "done" ||
          updated?.ai_status === "success" ||
          !activeEmailRef.current
        ) {
          stopPolling();
        }
      } catch {
        stopPolling();
      }
    }, 3000);
  };

  useEffect(() => () => stopPolling(), []);

  // =======================
  // Email öffnen / schließen
  // =======================
  const handleOpenEmail = async (id) => {
    if (!id || loading) return;
    if (activeEmailRef.current?.id === id) return;

    stopPolling();

    try {
      await openEmail(id);
      startPolling(id);
    } catch (err) {
      console.error("Fehler beim Öffnen der Mail:", err);
    }
  };

  const handleCloseEmail = () => {
    stopPolling();
    setTimeout(() => closeEmail(), 50);
  };

  // =======================
  // Disconnect
  // =======================
  const handleDisconnect = async () => {
    if (!window.confirm(`${provider} wirklich trennen?`)) return;
    await disconnectProvider?.();
  };

  // =======================
  // UI STATES
  // =======================
  if (initializing) {
    return (
      <PageLayout>
        <p className="text-gray-400 text-center py-10">
          Verbindung wird geprüft…
        </p>
      </PageLayout>
    );
  }

  if (!connected) {
    return (
      <PageLayout>
        <h1 className="text-2xl font-bold mb-6 text-white">Postfach</h1>
        <p className="text-red-400">Kein E-Mail-Konto verbunden</p>
      </PageLayout>
    );
  }

  // =======================
  // MAIN UI
  // =======================
  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          Postfach{" "}
          <span className="text-sm text-gray-400 ml-2">
            ({provider})
          </span>
        </h1>

        <button
          onClick={handleDisconnect}
          className="text-xs text-gray-500 hover:text-red-400"
        >
          Trennen
        </button>
      </div>

      {!activeEmail && (
        <>
          <div className="flex items-center gap-2 mb-4">
            {["inbox", "sent"].map((box) => (
              <button
                key={box}
                onClick={() => setMailbox(box)}
                className={`px-4 py-2 rounded ${
                  mailbox === box
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {box === "inbox" ? "Posteingang" : "Gesendet"}
              </button>
            ))}

            <button
              onClick={loadEmails}
              disabled={loading}
              className="bg-gray-700 px-4 py-2 rounded text-white"
            >
              {loading ? "Lädt…" : "Aktualisieren"}
            </button>

            <button
              onClick={() => setComposeOpen(true)}
              className="ml-auto bg-green-600 px-4 py-2 rounded text-white"
            >
              Neue E-Mail
            </button>
          </div>

          {fetchError && (
            <p className="text-red-400 text-sm mb-4">{fetchError}</p>
          )}

          <Card className="p-0 overflow-hidden relative">
            {loading && filteredEmails.length === 0 ? (
              <p className="text-center p-6 text-gray-400">Lädt…</p>
            ) : filteredEmails.length === 0 ? (
              <p className="text-center p-6 text-gray-400">
                Keine E-Mails gefunden
              </p>
            ) : (
              <>
                {loading && (
                  <div className="absolute top-2 right-3 text-xs text-gray-500">
                    Aktualisiere…
                  </div>
                )}

                <ul className="divide-y divide-gray-800">
                  {filteredEmails.map((mail) => (
                    <li
                      key={mail.id}
                      onClick={() => handleOpenEmail(mail.id)}
                      className="px-6 py-4 hover:bg-gray-800 cursor-pointer"
                    >
                      <div className="flex justify-between mb-1">
                        <p className="font-semibold truncate">
                          {mail.subject ?? "(Kein Betreff)"}
                        </p>

                        <span className="text-xs text-gray-400 ml-3">
                          {mail._date
                            ? new Date(mail._date).toLocaleString("de-DE")
                            : ""}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 truncate">
                        {mail._sender}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </>
      )}

      {activeEmail && (
        <Card className="p-6 space-y-6">
          <button
            onClick={handleCloseEmail}
            className="text-gray-400 hover:text-white"
          >
            ← Zurück
          </button>

          <div>
            <h2 className="text-xl font-bold">
              {activeEmail.subject ?? "(Kein Betreff)"}
            </h2>

            <p className="text-gray-400 text-sm">
              {extractSender(activeEmail)}
            </p>

            {activeEmail.received_at && (
              <p className="text-gray-500 text-xs">
                {new Date(activeEmail.received_at).toLocaleString("de-DE")}
              </p>
            )}
          </div>

          <SafeEmailHtml html={activeEmail.body ?? "<p>Kein Inhalt</p>"} />

          {activeEmail.ai_status === "pending" && (
            <p className="text-gray-400">Analyse läuft…</p>
          )}

          {["done", "success"].includes(activeEmail.ai_status) &&
            activeEmail.summary && (
              <div className="p-4 bg-gray-800 rounded">
                <p className="text-sm">{activeEmail.summary}</p>
              </div>
            )}

          <button
            onClick={() => setReplyOpen(true)}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Antworten
          </button>
        </Card>
      )}

      <EmailReplyModal
        emailId={activeEmail?.id}
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
      />

      <EmailComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
      />
    </PageLayout>
  );
}
