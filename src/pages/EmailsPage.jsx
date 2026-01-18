import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import { useContext, useState, useEffect } from "react";
import { GmailContext } from "../context/GmailContext";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import EmailReplyModal from "../components/EmailReplyModal";

export default function EmailsPage() {
  const { emails, activeEmail, openEmail, closeEmail } =
    useContext(GmailContext);

  const [replyOpen, setReplyOpen] = useState(false);
  const [thread, setThread] = useState([]);

  // Thread initialisieren, wenn neue Email geöffnet wird
  useEffect(() => {
    if (activeEmail) {
      setThread([
        {
          id: "incoming",
          type: "incoming",
          body: activeEmail.body,
          from: activeEmail.from,
        },
      ]);
      setReplyOpen(false);
    }
  }, [activeEmail?.id]);

  const priorityColor = (p) => {
    switch ((p || "").toLowerCase()) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const ai = activeEmail?.ai;

  // 🔁 Callback nach erfolgreichem Senden
  const handleReplySent = (text) => {
    setThread((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "outgoing",
        body: text,
      },
    ]);
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      {/* 📥 EMAIL LIST */}
      {!activeEmail && (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-gray-800">
            {emails.map((mail) => (
              <li
                key={mail.id}
                onClick={() => openEmail(mail.id)}
                className="px-6 py-4 cursor-pointer hover:bg-gray-800"
              >
                <p className="font-semibold truncate">
                  {mail.subject || "(Kein Betreff)"}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {mail.from || "(unbekannt)"}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* 📄 EMAIL DETAIL */}
      {activeEmail && (
        <Card className="p-4 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between mb-4">
            <button onClick={closeEmail} className="text-sm text-gray-400">
              <FiArrowLeft className="inline mr-2" />
              Zurück
            </button>
            <FiMoreVertical />
          </div>

          <h2 className="text-xl font-bold mb-2">{activeEmail.subject}</h2>
          <p className="text-xs text-gray-400 mb-4">{activeEmail.from}</p>

          {/* 🤖 KI BOX */}
          {ai?.status === "success" && (
            <div className="mb-4 p-3 bg-gray-800 rounded text-sm">
              <p><b>Zusammenfassung:</b> {ai.summary}</p>
              <span
                className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${priorityColor(
                  ai.priority
                )}`}
              >
                {ai.priority}
              </span>
            </div>
          )}

          {/* 💬 THREAD */}
          <div className="space-y-4">
            {thread.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] p-3 rounded ${
                  msg.type === "outgoing"
                    ? "ml-auto bg-blue-600"
                    : "mr-auto bg-gray-800"
                }`}
              >
                <SafeEmailHtml html={msg.body} />
              </div>
            ))}
          </div>

          {/* Reply */}
          <div className="mt-6">
            <button
              onClick={() => setReplyOpen(true)}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Antworten
            </button>
          </div>
        </Card>
      )}

      <EmailReplyModal
        emailId={activeEmail?.id}
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
        onSent={handleReplySent}
      />
    </PageLayout>
  );
}
