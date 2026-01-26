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
    fetchInboxEmails,
    fetchSentEmails,
  } = useContext(GmailContext);

  const [mailbox, setMailbox] = useState("inbox");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  // Filters
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [categoryGroupFilter, setCategoryGroupFilter] = useState(null);

  // ---------------- Emails laden ----------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (mailbox === "inbox") {
          await fetchInboxEmails();
        } else {
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
  }, [mailbox, fetchInboxEmails, fetchSentEmails]);

  // ---------------- Filter angewendet ----------------
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

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Postfach</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

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

          {/* Filter UI */}
          <div className="flex gap-2 mt-2 flex-wrap">
            <select
              value={priorityFilter || ""}
              onChange={(e) => setPriorityFilter(e.target.value || null)}
              className="px-3 py-1 rounded bg-gray-700 text-white"
            >
              <option value="">Alle Prioritäten</option>
              <option value="high">Hoch</option>
              <option value="medium">Mittel</option>
              <option value="low">Niedrig</option>
            </select>

            <select
              value={categoryGroupFilter || ""}
              onChange={(e) => setCategoryGroupFilter(e.target.value || null)}
              className="px-3 py-1 rounded bg-gray-700 text-white"
            >
              <option value="">Alle Kategorien</option>
              <option value="ARBEIT">ARBEIT</option>
              <option value="PRIVAT">PRIVAT</option>
              <option value="SONSTIGES">SONSTIGES</option>
            </select>
          </div>
        </div>
      )}

      {/* Emails anzeigen */}
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
                  className="px-6 py-4 cursor-pointer hover:bg-gray-800 transition rounded"
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

      {/* Email Detail + Modals */}
      {activeEmail && (
        <Card className="p-4 max-h-[80vh] overflow-y-auto relative">
          {/* ... rest bleibt unverändert ... */}
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
