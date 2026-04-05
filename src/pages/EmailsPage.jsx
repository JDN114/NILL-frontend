import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { MailContext } from "../context/MailContext";

import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";

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
  } = useContext(MailContext);

  const [mailbox, setMailbox] = useState("inbox");
  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredEmails, setFilteredEmails] = useState([]);

  const pollingRef = useRef(null);
  const activeEmailRef = useRef(null);

  // 🔁 keep ref in sync (fix stale state)
  useEffect(() => {
    activeEmailRef.current = activeEmail;
  }, [activeEmail]);

  // =====================================================
  // Auth Guard
  // =====================================================
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  // =====================================================
  // Emails laden
  // =====================================================
  const loadAndFilterEmails = async () => {
    if (!connected) return [];
    setLoading(true);
    try {
      const fetched = (await fetchEmails(mailbox)) ?? [];
      setFilteredEmails(fetched);
      return fetched;
    } catch (err) {
      console.error("Fehler beim Laden der Emails:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!connected) return;
    loadAndFilterEmails();
  }, [connected, mailbox]);

  // =====================================================
  // Polling FIXED
  // =====================================================
  const stopPollingAI = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startPollingAI = (emailId) => {
    stopPollingAI();

    pollingRef.current = setInterval(async () => {
      try {
        const updated = await openEmail(emailId);

        // ✅ stop when done (NO stale state anymore)
        if (updated?.ai_status === "done" || updated?.ai_status === "success") {
          stopPollingAI();
        }

        // ✅ stop if user closed email meanwhile
        if (!activeEmailRef.current) {
          stopPollingAI();
        }
      } catch (err) {
        console.error("Polling Error:", err);
        stopPollingAI();
      }
    }, 3000);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => stopPollingAI();
  }, []);

  // =====================================================
  // Open / Close Email
  // =====================================================
  const handleOpenEmail = async (id) => {
    if (!id || loading) return;
    if (activeEmailRef.current?.id === id) return;

    stopPollingAI();

    setLoading(true);
    try {
      await openEmail(id);
      startPollingAI(id);
    } catch (err) {
      console.error("Fehler beim Öffnen der Mail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEmail = () => {
    stopPollingAI();

    // kleine safety delay gegen race conditions
    setTimeout(() => {
      closeEmail();
    }, 50);
  };

  // =====================================================
  // UI STATES
  // =====================================================
  if (initializing || loading)
    return (
      <PageLayout>
        <p className="text-gray-400 text-center py-10">
          E-Mails werden geladen…
        </p>
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
        Postfach{" "}
        <span className="text-sm text-gray-400 ml-3">({provider})</span>
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
              onClick={async () => await loadAndFilterEmails()}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Aktualisieren
            </button>

            <button
              onClick={() => setComposeOpen(true)}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Neue E-Mail
            </button>
          </div>

          {/* Email List */}
          <Card className="p-0 overflow-hidden">
            {filteredEmails.length === 0 ? (
              <p className="text-center p-6 text-gray-400">
                Keine E-Mails gefunden
              </p>
            ) : (
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
                      <span className="text-xs text-gray-400">
                        {mail.received_at
                          ? new Date(mail.received_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {mail.from ?? "(Absender unbekannt)"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}

      {activeEmail && (
        <Card className="p-6 space-y-6">
          <button
            onClick={handleCloseEmail}
            className="text-gray-400 mb-4"
          >
            Zurück
          </button>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">
              {activeEmail.subject ?? "(Kein Betreff)"}
            </h2>
            <p className="text-gray-400">
              {activeEmail.from ?? "(Absender unbekannt)"}
            </p>
          </div>

          <SafeEmailHtml html={activeEmail.body ?? "<p>Kein Inhalt</p>"} />

          {/* KI Status */}
          {activeEmail.ai_status === "pending" && (
            <div className="flex items-center justify-center py-6">
              <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-400">Analyse läuft…</span>
            </div>
          )}

          {["done", "success"].includes(activeEmail.ai_status) && (
            <div className="mt-6 p-4 bg-gray-800 rounded space-y-4">
              <h3 className="text-lg font-semibold mb-2">KI Insights</h3>

              {activeEmail.summary && (
                <p className="text-gray-200">{activeEmail.summary}</p>
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
