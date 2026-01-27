import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GmailContext } from "../context/GmailContext";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";
import { FiArrowLeft, FiMoreVertical, FiEdit2, FiFilter } from "react-icons/fi";

export default function EmailsPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const {
    emails,
    sentEmails,
    activeEmail,
    loading: contextLoading,
    openEmail,
    closeEmail,
    fetchInboxEmails,
    fetchSentEmails,
  } = useContext(GmailContext);

  const [mailbox, setMailbox] = useState("inbox");
  const [error, setError] = useState(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  const [priorityFilter, setPriorityFilter] = useState(null);
  const [categoryGroupFilter, setCategoryGroupFilter] = useState(null);

  // Filter UI
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // ---------------- Auth Guard ----------------
  useEffect(() => {
    if (!currentUser) navigate("/login", { replace: true });
  }, [currentUser, navigate]);

  // ---------------- Emails laden ----------------
  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      setError(null);
      try {
        if (mailbox === "inbox") await fetchInboxEmails();
        else await fetchSentEmails();
      } catch {
        setError("Fehler beim Laden der E-Mails");
      }
    };

    load();
  }, [currentUser, mailbox, fetchInboxEmails, fetchSentEmails]);

  // ---------------- Click Outside ----------------
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ---------------- Filter anwenden ----------------
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

  // ---------------- Priority Badge ----------------
  const priorityBadge = (p) => {
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

  // ---------------- Loading ----------------
  if (contextLoading) {
    return (
      <PageLayout>
        <p className="text-gray-400 text-center py-10">Lädt E-Mails…</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Postfach</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* ================= TOPBAR ================= */}
      {!activeEmail && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {["inbox", "sent"].map((box) => (
            <button
              key={box}
              onClick={() => {
                setMailbox(box);
                setPriorityFilter(null);
                setCategoryGroupFilter(null);
              }}
              className={`px-4 py-2 rounded ${
                mailbox === box
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {box === "inbox" ? "Posteingang" : "Gesendet"}
            </button>
          ))}

          {/* FILTER DROPDOWN */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
            >
              <FiFilter />
              Filter
            </button>

            <div
              className={`absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-4 transform transition-all duration-200 origin-top ${
                filterOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              {/* PRIORITY */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-300 mb-2">
                  Priorität
                </p>
                {["high", "medium", "low"].map((p) => (
                  <label
                    key={p}
                    className="flex items-center gap-2 text-sm text-gray-300 mb-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={priorityFilter === p}
                      onChange={() =>
                        setPriorityFilter(priorityFilter === p ? null : p)
                      }
                    />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </label>
                ))}
              </div>

              {/* CATEGORY */}
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2">
                  Kategorie
                </p>
                {["ARBEIT", "PRIVAT", "SONSTIGES"].map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-2 text-sm text-gray-300 mb-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={categoryGroupFilter === c}
                      onChange={() =>
                        setCategoryGroupFilter(
                          categoryGroupFilter === c ? null : c
                        )
                      }
                    />
                    {c}
                  </label>
                ))}
              </div>

              {(priorityFilter || categoryGroupFilter) && (
                <button
                  onClick={() => {
                    setPriorityFilter(null);
                    setCategoryGroupFilter(null);
                  }}
                  className="mt-4 w-full text-sm text-red-400 hover:text-red-300"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setComposeOpen(true)}
            className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <FiEdit2 /> Neue E-Mail
          </button>
        </div>
      )}

      {/* ================= EMAIL LIST ================= */}
      {!activeEmail && (
        <Card className="p-0 overflow-hidden">
          {displayedEmails.length === 0 ? (
            <p className="text-center p-6 text-gray-400">
              Keine E-Mails gefunden
            </p>
          ) : (
            <ul className="divide-y divide-gray-800">
              {displayedEmails.map((mail) => (
                <li
                  key={mail.id}
                  onClick={() => openEmail(mail.id, mailbox)}
                  className="px-6 py-4 hover:bg-gray-800 cursor-pointer"
                >
                  <div className="flex justify-between mb-1">
                    <p className="font-semibold truncate">
                      {mail.subject || "(Kein Betreff)"}
                    </p>
                    <span className="text-xs text-gray-400">
                      {mail.received_at &&
                        new Date(mail.received_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {mailbox === "inbox" ? mail.from : mail.to}
                  </p>
                  {mail.priority && (
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs text-white rounded ${priorityBadge(
                        mail.priority
                      )}`}
                    >
                      {mail.priority}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* ================= EMAIL DETAIL ================= */}
      {activeEmail && (
        <Card className="p-4 max-h-[80vh] overflow-y-auto">
          <button
            onClick={closeEmail}
            className="flex items-center text-sm text-gray-400 hover:text-white mb-4"
          >
            <FiArrowLeft className="mr-2" /> Zurück
          </button>

          <h2 className="text-2xl font-bold mb-1">
            {activeEmail.subject || "(Kein Betreff)"}
          </h2>

          <SafeEmailHtml html={activeEmail.body || "<i>Kein Inhalt</i>"} />
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
