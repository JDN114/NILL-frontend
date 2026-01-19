// src/pages/EmailsPage.jsx
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import { useContext, useEffect, useState } from "react";
import { GmailContext } from "../context/GmailContext";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import EmailReplyModal from "../components/EmailReplyModal";
import NewEmailModal from "../components/NewEmailModal";

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
  const [newEmailOpen, setNewEmailOpen] = useState(false);

  const [priorityFilterOpen, setPriorityFilterOpen] = useState(false);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);

  // Modal immer schließen, wenn eine neue Email geöffnet wird
  useEffect(() => {
    setReplyOpen(false);
  }, [activeEmail?.id]);

  // Gesendete Emails laden (nur wenn auf Sent gewechselt)
  useEffect(() => {
    if (mailbox === "sent" && sentEmails.length === 0) {
      fetchSentEmails();
    }
  }, [mailbox]);

  const displayedEmails = mailbox === "inbox" ? emails : sentEmails;

  // Filter anwenden
  const filteredEmails = displayedEmails.filter((mail) => {
    if (priorityFilter) return mail.ai?.priority?.toLowerCase() === priorityFilter;
    if (categoryFilter) return mail.category?.toLowerCase() === categoryFilter;
    return true;
  });

  const priorityColor = (p) => {
    switch ((p || "").toLowerCase()) {
      case "high":
      case "hoch":
        return "bg-red-600";
      case "medium":
      case "mittel":
        return "bg-yellow-500";
      case "low":
      case "niedrig":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const ai = activeEmail?.ai;

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      {/* 📂 Top Controls */}
      {!activeEmail && (
        <div className="flex gap-2 mb-4 items-center">
          {/* Neue Email */}
          <button
            onClick={() => setNewEmailOpen(true)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Neue Email
          </button>

          {/* Posteingang / Gesendet */}
          <button
            onClick={() => setMailbox("inbox")}
            className={`px-4 py-2 rounded ${
              mailbox === "inbox"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
          >
            Posteingang
          </button>
          <button
            onClick={() => setMailbox("sent")}
            className={`px-4 py-2 rounded ${
              mailbox === "sent"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
          >
            Gesendet
          </button>

          {/* Priorität / Kategorie Buttons */}
          {!priorityFilterOpen && !categoryFilterOpen && (
            <>
              <button
                onClick={() => setPriorityFilterOpen(true)}
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Priorität
              </button>
              <button
                onClick={() => setCategoryFilterOpen(true)}
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Kategorie
              </button>
            </>
          )}
        </div>
      )}

      {/* Unterfilter Priorität */}
      {priorityFilterOpen && !activeEmail && (
        <div className="flex gap-2 mb-4">
          {["hoch", "mittel", "niedrig"].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-4 py-2 rounded ${
                priorityFilter === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <button
            onClick={() => {
              setPriorityFilterOpen(false);
              setPriorityFilter(null);
            }}
            className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            Zurück
          </button>
        </div>
      )}

      {/* Unterfilter Kategorie */}
      {categoryFilterOpen && !activeEmail && (
        <div className="flex gap-2 mb-4">
          {["Arbeit", "Privat", "Sonstiges"].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c.toLowerCase())}
              className={`px-4 py-2 rounded ${
                categoryFilter === c.toLowerCase()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {c}
            </button>
          ))}
          <button
            onClick={() => {
              setCategoryFilterOpen(false);
              setCategoryFilter(null);
            }}
            className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            Zurück
          </button>
        </div>
      )}

      {/* 📥 / 📤 EMAIL LIST */}
      {!activeEmail && (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-gray-800">
            {filteredEmails.length === 0 && (
              <li className="px-6 py-6 text-center text-gray-400 text-sm">
                Keine Emails gefunden
              </li>
            )}

            {filteredEmails.map((mail) => (
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

                {/* 🔖 KI-Status nur in Inbox */}
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

      {/* 📄 EMAIL DETAIL */}
      {activeEmail && (
        <Card className="p-4 max-h-[80vh] overflow-y-auto relative">
          {/* Top Bar */}
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

          {/* Header */}
          <h2 className="text-2xl font-bold mb-1">
            {activeEmail.subject || "(Kein Betreff)"}
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            {mailbox === "inbox"
              ? activeEmail.from || "(unbekannt)"
              : activeEmail.to || "(unbekannt)"}
          </p>

          {/* 🤖 KI BOX – NUR INBOX */}
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

          {/* ✉️ BODY */}
          <SafeEmailHtml html={activeEmail.body || "<i>Kein Inhalt</i>"} />

          {/* ✉️ REPLY BUTTON – NUR INBOX */}
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

      {/* ✉️ REPLY MODAL */}
      <EmailReplyModal
        emailId={activeEmail?.id}
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
      />

      {/* ✉️ NEW EMAIL MODAL */}
      <NewEmailModal
        open={newEmailOpen}
        onClose={() => setNewEmailOpen(false)}
      />
    </PageLayout>
  );
}
