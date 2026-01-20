import { useContext, useEffect, useState } from "react";
import { GmailContext } from "../context/GmailContext";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";
import { FiArrowLeft, FiMoreVertical, FiEdit2 } from "react-icons/fi";

export default function EmailsPage() {
  const {
    emails,
    sentEmails,
    activeEmail,
    openEmail,
    closeEmail,
    fetchSentEmails,
  } = useContext(GmailContext);

  const [mailbox, setMailbox] = useState("inbox");

  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  // Filter UI State
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  // Aktive Filter
  const [priorityFilter, setPriorityFilter] = useState(null);       // "high" | "medium" | "low"
  const [categoryGroupFilter, setCategoryGroupFilter] = useState(null); // "ARBEIT" | "PRIVAT" | "SONSTIGES"

  useEffect(() => {
    setReplyOpen(false);
  }, [activeEmail?.id]);

  useEffect(() => {
    if (mailbox === "sent" && sentEmails.length === 0) {
      fetchSentEmails();
    }
  }, [mailbox]);

  // -----------------------------
  // 🔍 FILTER LOGIK (Frontend)
  // -----------------------------
  let displayedEmails = mailbox === "inbox" ? emails : sentEmails;

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
        return "bg-gray-600";
      case "medium":
        return "bg-gray-500";
      case "low":
        return "bg-gray-400";
      default:
        return "bg-gray-700";
    }
  };

  const ai = activeEmail?.ai;

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      {/* ========================= */}
      {/* 🧭 TOP BAR – NUR LISTE */}
      {/* ========================= */}
      {!activeEmail && (
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2 items-center flex-wrap">
            {/* Mailbox */}
            <button
              onClick={() => {
                setMailbox("inbox");
                setPriorityFilter(null);
                setCategoryGroupFilter(null);
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
                setCategoryGroupFilter(null);
              }}
              className={`px-4 py-2 rounded ${
                mailbox === "sent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              Gesendet
            </button>

            {/* Hauptfilter */}
            {!priorityOpen && !categoryOpen && (
              <>
                <button
                  onClick={() => {
                    setPriorityOpen(true);
                    setCategoryOpen(false);
                  }}
                  className="px-4 py-2 rounded bg-gray-600 text-white"
                >
                  Priorität
                </button>

                <button
                  onClick={() => {
                    setCategoryOpen(true);
                    setPriorityOpen(false);
                  }}
                  className="px-4 py-2 rounded bg-gray-600 text-white"
                >
                  Kategorie
                </button>
              </>
            )}

            {/* Compose */}
            <button
              onClick={() => setComposeOpen(true)}
              className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              <FiEdit2 />
              Neue E-Mail
            </button>
          </div>

          {/* PRIORITY FILTER */}
          {priorityOpen && (
            <div className="flex gap-2">
              {[
                { key: "high", label: "Hoch" },
                { key: "medium", label: "Mittel" },
                { key: "low", label: "Niedrig" },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    setPriorityFilter(p.key);
                    setPriorityOpen(false);
                  }}
                  className="px-3 py-1 rounded bg-gray-500 text-white"
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => setPriorityOpen(false)}
                className="px-3 py-1 rounded bg-gray-700 text-white"
              >
                Abbrechen
              </button>
            </div>
          )}

          {/* CATEGORY GROUP FILTER */}
          {categoryOpen && (
            <div className="flex gap-2">
              {[
                { key: "ARBEIT", label: "Arbeit" },
                { key: "PRIVAT", label: "Privat" },
                { key: "SONSTIGES", label: "Sonstiges" },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    setCategoryGroupFilter(c.key);
                    setCategoryOpen(false);
                  }}
                  className="px-3 py-1 rounded bg-gray-500 text-white"
                >
                  {c.label}
                </button>
              ))}
              <button
                onClick={() => setCategoryOpen(false)}
                className="px-3 py-1 rounded bg-gray-700 text-white"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================= */}
      {/* 📬 EMAIL LIST */}
      {/* ========================= */}
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
                      : ""}
                  </span>
                </div>

                <p className="text-sm text-gray-400 truncate">
                  {mailbox === "inbox"
                    ? mail.from || "(unbekannt)"
                    : mail.to || "(unbekannt)"}
                </p>

                {mail.priority && (
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-xs rounded text-white ${priorityBadge(
                      mail.priority
                    )}`}
                  >
                    {mail.priority}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ========================= */}
      {/* 📄 EMAIL DETAIL */}
      {/* ========================= */}
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
