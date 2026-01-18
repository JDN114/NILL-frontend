import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import { useContext, useState } from "react";
import { GmailContext } from "../context/GmailContext";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import EmailReplyModal from "../components/EmailReplyModal";

export default function EmailsPage() {
  const { emails, activeEmail, openEmail, closeEmail } = useContext(GmailContext);
  const [replyOpen, setReplyOpen] = useState(false);

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

      {/* ======================= */}
      {/* 📥 EMAIL LIST */}
      {/* ======================= */}
      {!activeEmail && (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-gray-800">
            {emails.length === 0 && (
              <li className="px-6 py-6 text-center text-gray-400 text-sm">
                Keine Emails gefunden
              </li>
            )}
            {emails.map((mail) => (
              <li
                key={mail.id}
                onClick={() => openEmail(mail.id)}
                className="px-6 py-4 cursor-pointer hover:bg-gray-800 transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold truncate">
                    {mail.subject || "(Kein Betreff)"}
                  </p>
                  {mail.received_at && (
                    <span className="text-xs text-gray-400">
                      {new Date(mail.received_at).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 truncate">{mail.from || "(unbekannt)"}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ======================= */}
      {/* 📄 EMAIL DETAIL */}
      {/* ======================= */}
      {activeEmail && (
        <Card className="p-4 max-h-[80vh] overflow-y-auto relative email-detail-card">
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
          <p className="text-xs text-gray-400 mb-4">{activeEmail.from || "(unbekannt)"}</p>

          {/* 🤖 KI BOX */}
          {ai?.status === "processing" && (
            <p className="text-gray-400 mb-4 text-sm">KI analysiert …</p>
          )}
          {ai?.status === "failed" && (
            <div className="mb-4 p-2 bg-red-900/30 rounded text-sm">
              KI aktuell nicht verfügbar
            </div>
          )}
          {ai?.status === "success" && (
            <div className="mb-6 p-3 bg-gray-800 rounded space-y-2 text-sm text-gray-100">
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
                    className={`px-2 py-0.5 rounded text-white text-xs ${priorityColor(ai.priority)}`}
                  >
                    {ai.priority}
                  </span>
                </div>
              )}
              {ai.category && (
                <div>
                  <span className="font-semibold">Kategorie:</span>
                  <span className="ml-1">{ai.category}</span>
                </div>
              )}
              {ai.sentiment && (
                <div>
                  <span className="font-semibold">Sentiment:</span>
                  <span className="ml-1">{ai.sentiment}</span>
                </div>
              )}
            </div>
          )}

          {/* ✉️ EMAIL BODY */}
          <SafeEmailHtml html={activeEmail.body || "<i>Kein Inhalt</i>"} />

          {/* ======================= */}
          {/* ✉️ REPLY BUTTON */}
          {/* ======================= */}
          <div className="mt-4">
            <button
              onClick={() => setReplyOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Antworten
            </button>
          </div>

          {/* ======================= */}
          {/* ✉️ REPLY MODAL */}
          {/* ======================= */}
          {activeEmail?.id && (
            <EmailReplyModal
              emailId={activeEmail.id}
              open={replyOpen}
              onClose={() => setReplyOpen(false)}
            />
          )}
        </Card>
      )}
    </PageLayout>
  );
}
