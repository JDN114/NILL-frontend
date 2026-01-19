// src/pages/EmailsPage.jsx
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import { useContext, useEffect, useState } from "react";
import { GmailContext } from "../context/GmailContext";
import { FiArrowLeft, FiMoreVertical, FiEdit2 } from "react-icons/fi";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";

export default function EmailsPage() {
  const {
    emails,
    sentEmails,
    activeEmail,
    openEmail,
    closeEmail,
    fetchSentEmails,
  } = useContext(GmailContext);

  const [mailbox, setMailbox] = useState("inbox"); // inbox | sent
  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  // Filter States
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(null); // "hoch" | "mittel" | "niedrig"
  const [categoryFilter, setCategoryFilter] = useState(null); // "Privat" | "Arbeit" | "Sonstiges"

  useEffect(() => {
    setReplyOpen(false);
  }, [activeEmail?.id]);

  useEffect(() => {
    if (mailbox === "sent" && sentEmails.length === 0) {
      fetchSentEmails();
    }
  }, [mailbox]);

  // Gefilterte Emails
  let displayedEmails = mailbox === "inbox" ? emails : sentEmails;
  if (priorityFilter) {
    displayedEmails = displayedEmails.filter(
      (e) => (e.ai?.priority || "").toLowerCase() === priorityFilter
    );
  }
  if (categoryFilter) {
    displayedEmails = displayedEmails.filter(
      (e) => (e.category || "").toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  const priorityColor = (p) => {
    switch ((p || "").toLowerCase()) {
      case "high":
      case "hoch":
        return "bg-gray-600"; // neutral
      case "medium":
      case "mittel":
        return "bg-gray-500";
      case "low":
      case "niedrig":
        return "bg-gray-400";
      default:
        return "bg-gray-700";
    }
  };

  const ai = activeEmail?.ai;

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      {/* Top Bar + Filter Buttons → NUR in Listenansicht */}
      {!activeEmail && (
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2 items-center">
            {/* Standard Buttons */}
            <button
              onClick={() => {
                setMailbox("inbox");
                setPriorityFilter(null);
                setCategoryFilter(null);
              }}
              className={`px-4 py-2 rounded ${
                mailbox === "inbox"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              Posteingang
            </button>
            <button
              onClick={() => {
                setMailbox("sent");
                setPriorityFilter(null);
                setCategoryFilter(null);
              }}
              className={`px-4 py-2 rounded ${
                mailbox === "sent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              Gesendet
            </button>

            {/* Priority / Category Main Buttons */}
            {!priorityOpen && !categoryOpen && (
              <>
                <button
                  onClick={() => {
                    setPriorityOpen(true);
                    setCategoryOpen(false);
                  }}
                  className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                >
                  Priorität
                </button>
                <button
                  onClick={() => {
                    setCategoryOpen(true);
                    setPriorityOpen(false);
                  }}
                  className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                >
                  Kategorie
                </button>
              </>
            )}

            {/* Compose Button */}
            <button
              onClick={() => setComposeOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-auto"
            >
              <FiEdit2 />
              Neue E-Mail
            </button>
          </div>

          {/* Priority Filters */}
          {priorityOpen && (
            <div className="flex gap-2">
              {["hoch", "mittel", "niedrig"].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPriorityFilter(p);
                    setPriorityOpen(false);
                  }}
                  className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setPriorityOpen(false)}
                className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
              >
                Abbrechen
              </button>
            </div>
          )}

          {/* Category Filters */}
          {categoryOpen && (
            <div className="flex gap-2">
              {["Privat", "Arbeit", "Sonstiges"].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCategoryFilter(c);
                    setCategoryOpen(false);
                  }}
                  className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
                >
                  {c}
                </button>
              ))}
              <button
                onClick={() => setCategoryOpen(false)}
                className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      )}

      {/* EMAIL LIST */}
      {!activeEmail && (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-gray-800">
            {displayedEmails.length === 0 && (
              <li className="px-6 py-6 text-center text-gray-400 text-sm">
                Keine Emails gefunden
              </li>
            )}
            {displayedEmails.map((mail) => (
              <li
                key={mail.id}
                onClick={() => openEmail(mail.id, mailbox)}
                className="px-6 py-4 cursor-pointer hover:bg-gray-800 transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold truncate">
                    {mail.subject || "(Kein Betreff)"}
                  </p>
                  <span className="text-xs text-gray-400">
                    {mail.received_at
                      ? new Date(mail.received_at).toLocaleString()
                      : mail.sent_at
                      ? new Date(mail.sent_at).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {mailbox === "inbox"
                    ? mail.from || "(unbekannt)"
                    : mail.to || "(unbekannt)"}
                </p>
                {mailbox === "inbox" && mail.ai_status && (
                  <div className="mt-1 text-xs text-gray-500">
                    KI-Status: {mail.ai_status}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* EMAIL DETAIL */}
      {activeEmail && (
        <Card className="p-4 max-h-[80vh] overflow-y-auto relative">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={closeEmail}
              className="flex items-center text-sm text-gray-400 hover:text-white"
            >
              <FiArrowLeft className="mr-2" />
              Zurück
            </button>
            <button className="p-2 rounded hover:bg-gray-800">
              <FiMoreVertical />
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-1">
            {activeEmail.subject || "(Kein Betreff)"}
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            {mailbox === "inbox"
              ? activeEmail.from || "(unbekannt)"
              : activeEmail.to || "(unbekannt)"}
          </p>

          {mailbox === "inbox" && ai?.status === "success" && (
            <div className="mb-6 p-3 bg-gray-800 rounded text-sm space-y-2">
              {ai.summary && (
                <div>
                  <span className="font-semibold">Zusammenfassung:</span>
                  <p>{ai.summary}</p>
                </div>
              )}
              {ai.priority && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Priorität:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs text-white ${priorityColor(
                      ai.priority
                    )}`}
                  >
                    {ai.priority}
                  </span>
                </div>
              )}
            </div>
          )}

          <SafeEmailHtml html={activeEmail.body || "<i>Kein Inhalt</i>"} />

          {mailbox === "inbox" && (
            <div className="mt-6">
              <button
                onClick={() => setReplyOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Antworten
              </button>
            </div>
          )}
        </Card>
      )}

      {/* MODALS */}
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
