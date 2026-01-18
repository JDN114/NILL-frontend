import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import { useContext, useState, useEffect } from "react";
import { GmailContext } from "../context/GmailContext";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import EmailReplyModal from "../components/EmailReplyModal";
import api from "../services/api";

export default function EmailsPage() {
  const { emails, activeEmail, openEmail, closeEmail } =
    useContext(GmailContext);

  const [replyOpen, setReplyOpen] = useState(false);
  const [mailbox, setMailbox] = useState("INBOX"); // INBOX | SENT
  const [sentEmails, setSentEmails] = useState([]);

  // Modal immer schließen, wenn neue Email geöffnet wird
  useEffect(() => {
    setReplyOpen(false);
  }, [activeEmail?.id]);

  // 📤 Gesendete Emails laden
  useEffect(() => {
    if (mailbox === "SENT") {
      api
        .get("/gmail/emails/sent")
        .then((res) => setSentEmails(res.data.emails || []))
        .catch(console.error);
    }
  }, [mailbox]);

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

  const displayedEmails = mailbox === "INBOX" ? emails : sentEmails;

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      {/* 📂 Mailbox Switch */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMailbox("INBOX")}
          className={`px-4 py-2 rounded ${
            mailbox === "INBOX" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
          }`}
        >
          Posteingang
        </button>
        <button
          onClick={() => setMailbox("SENT")}
          className={`px-4 py-2 rounded ${
            mailbox === "SENT" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
          }`}
        >
          Gesendet
        </button>
      </div>

      {/* 📥 / 📤 EMAIL LIST */}
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
                  {mailbox === "INBOX" ? mail.from : mail.to || "(unbekannt)"}
                </p>
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
            {mailbox === "INBOX"
              ? activeEmail.from || "(unbekannt)"
              : activeEmail.to || "(unbekannt)"}
          </p>

          {/* 🤖 KI BOX */}
          {ai?.status === "success" && mailbox === "INBOX" && (
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

          {/* ✉️ REPLY BUTTON (nur Inbox) */}
          {mailbox === "INBOX" && (
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

      {/* ✉️ REPLY MODAL – IMMER GERENDERT */}
      <EmailReplyModal
        emailId={activeEmail?.id}
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
      />
    </PageLayout>
  );
}
