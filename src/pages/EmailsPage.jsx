// src/pages/EmailsPage.jsx
import { useContext, useEffect, useState } from "react";
import { GmailContext } from "../context/GmailContext";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";
import { FiArrowLeft, FiMoreVertical, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EmailsPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    emails,
    sentEmails,
    activeEmail,
    openEmail,
    closeEmail,
    fetchSentEmails,
    fetchInboxEmails,
  } = useContext(GmailContext);

  const [mailbox, setMailbox] = useState("inbox");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  const [priorityFilter, setPriorityFilter] = useState(null); // "high" | "medium" | "low"
  const [categoryGroupFilter, setCategoryGroupFilter] = useState(null); // "ARBEIT" | "PRIVAT" | "SONSTIGES"

  // ----------------------------
  // AUTH-GUARD
  // ----------------------------
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);

  // ----------------------------
  // Emails laden
  // ----------------------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (mailbox === "inbox") {
          await fetchInboxEmails();
        } else if (mailbox === "sent") {
          await fetchSentEmails();
        }
      } catch (err) {
        console.error(err);
        setError("Fehler beim Laden der E-Mails");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mailbox]);

  // ----------------------------
  // FILTER LOGIK
  // ----------------------------
  let displayedEmails = mailbox === "inbox" ? emails : sentEmails;
  displayedEmails = displayedEmails || [];

  if (priorityFilter) {
    displayedEmails = displayedEmails.filter(
      (e) => (e.priority || "").toLowerCase() === priorityFilter
    );
  }
  if (categoryGroupFilter) {
    displayedEmails = displayedEmails.filter(
      (e) => e.category_group === categoryGroupFilter
    );
  }

  const priorityBadge = (p) => {
    switch ((p || "").toLowerCase()) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-700";
    }
  };

  const ai = activeEmail?.ai;

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Postfach</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* ========================= */}
      {/* TOPBAR */}
      {/* ========================= */}
      {!activeEmail && (
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2 items-center flex-wrap">
            {["inbox", "sent"].map((box) => (
              <button
                key={box}
                onClick={() => {
                  setMailbox(box);
                  setPriorityFilter(null);
                  setCategoryGroupFilter(null);
                }}
                className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  mailbox === box
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                {box === "inbox" ? "Posteingang" : "Gesendet"}
              </button>
            ))}

            <button
              onClick={() => setComposeOpen(true)}
              className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <FiEdit2 /> Neue E-Mail
            </button>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* EMAIL LISTE */}
      {/* ========================= */}
      {!activeEmail && (
        <Card className="p-0 overflow-hidden">
          {loading ? (
            <p className="text-center p-6 text-gray-400">Lädt…</p>
          ) : displayedEmails.length === 0 ? (
            <p className="text-center p-6 text-gray-400">Keine E-Mails gefunden</p>
          ) : (
            <ul className="divide-y divide-gray-800">
              {displayedEmails.map((mail) => (
                <li
                  key={mail.id}
                  onClick={() => openEmail(mail.id, mailbox)}
                  className="px-6 py-4 cursor-pointer hover:bg-gray-800 transition rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openEmail(mail.id, mailbox)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold truncate">{mail.subject || "(Kein Betreff)"}</p>
                    <span className="text-xs text-gray-400">
                      {mail.received_at ? new Date(mail.received_at).toLocaleString() : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {mailbox === "inbox" ? mail.from || "(unbekannt)" : mail.to || "(unbekannt)"}
                  </p>
                  {mail.priority && (
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded text-white ${priorityBadge(mail.priority)}`}>
                      {mail.priority}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* ========================= */}
      {/* EMAIL DETAIL */}
      {/* ========================= */}
      {activeEmail && (
        <Card className="p-4 max-h-[80vh] overflow-y-auto relative">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={closeEmail}
              className="flex items-center text-sm text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)] rounded"
            >
              <FiArrowLeft className="mr-2" /> Zurück
            </button>
            <button className="p-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]">
              <FiMoreVertical />
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-1">{activeEmail.subject || "(Kein Betreff)"}</h2>
          <p className="text-xs text-gray-400 mb-4">
            {mailbox === "inbox" ? activeEmail.from || "(unbekannt)" : activeEmail.to || "(unbekannt)"}
          </p>

          {mailbox === "inbox" && ai?.status === "success" && ai?.summary && (
            <div className="mb-6 p-3 bg-gray-800 rounded text-sm">
              <span className="font-semibold">Zusammenfassung:</span>
              <p>{ai.summary}</p>
            </div>
          )}

          <SafeEmailHtml html={activeEmail.body || "<i>Kein Inhalt</i>"} />

          {mailbox === "inbox" && (
            <div className="mt-6">
              <button
                onClick={() => setReplyOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Antworten
              </button>
            </div>
          )}
        </Card>
      )}

      {/* ========================= */}
      {/* MODALS */}
      {/* ========================= */}
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
