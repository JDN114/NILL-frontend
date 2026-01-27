// src/pages/EmailsPage.jsx
import {
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GmailContext } from "../context/GmailContext";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";
import {
  FiArrowLeft,
  FiMoreVertical,
  FiEdit2,
  FiFilter,
  FiX,
} from "react-icons/fi";

export default function EmailsPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  const {
    emails,
    sentEmails,
    activeEmail,
    initializing,
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

  // UI only
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef(null);

  // ---------------- Auth Guard ----------------
  useEffect(() => {
    if (!currentUser) navigate("/login", { replace: true });
  }, [currentUser, navigate]);

  // ---------------- Emails laden ----------------
  useEffect(() => {
    if (!currentUser) return;

    const loadEmails = async () => {
      setError(null);
      try {
        mailbox === "inbox"
          ? await fetchInboxEmails()
          : await fetchSentEmails();
      } catch (err) {
        console.error(err);
        setError("Fehler beim Laden der E-Mails");
      }
    };

    loadEmails();
  }, [currentUser, mailbox, fetchInboxEmails, fetchSentEmails]);

  // ---------------- Click Outside ----------------
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ---------------- Filter (STABIL) ----------------
  const displayedEmails = useMemo(() => {
    let list = mailbox === "inbox" ? emails : sentEmails;
    if (!Array.isArray(list)) return [];

    if (priorityFilter) {
      list = list.filter(
        (e) => (e.priority || "").toLowerCase() === priorityFilter
      );
    }

    if (categoryGroupFilter) {
      list = list.filter(
        (e) => e.category_group === categoryGroupFilter
      );
    }

    return list;
  }, [
    mailbox,
    emails,
    sentEmails,
    priorityFilter,
    categoryGroupFilter,
  ]);

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

  if (initializing) {
    return (
      <PageLayout>
        <p className="text-gray-400 text-center py-10">
          Initialisiere Gmail…
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Postfach</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* ================= TOPBAR ================= */}
      {!activeEmail && (
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-2">
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

            {/* Filter Button */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-200"
              >
                <FiFilter />
                Filter
              </button>

              {/* Dropdown */}
              {filtersOpen && (
                <div className="absolute z-20 mt-2 w-64 bg-[#0b0f16] border border-gray-800 rounded-xl p-4 shadow-xl animate-[fadeIn_0.15s_ease-out]">
                  <p className="text-xs text-gray-400 mb-2">Priorität</p>
                  <div className="flex gap-2 mb-4">
                    {["high", "medium", "low"].map((p) => (
                      <button
                        key={p}
                        onClick={() =>
                          setPriorityFilter(
                            priorityFilter === p ? null : p
                          )
                        }
                        className={`flex-1 py-1 rounded text-sm ${
                          priorityFilter === p
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 mb-2">Kategorie</p>
                  <div className="flex flex-col gap-2">
                    {["Arbeit", "Privat", "Sonstiges"].map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          setCategoryGroupFilter(
                            categoryGroupFilter === c ? null : c
                          )
                        }
                        className={`py-1 rounded text-sm ${
                          categoryGroupFilter === c
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setComposeOpen(true)}
              className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              <FiEdit2 /> Neue E-Mail
            </button>
          </div>

          {/* Active Filters */}
          {(priorityFilter || categoryGroupFilter) && (
            <div className="flex gap-2 flex-wrap">
              {priorityFilter && (
                <span className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600/20 text-blue-400 rounded-full">
                  {priorityFilter}
                  <FiX
                    className="cursor-pointer"
                    onClick={() => setPriorityFilter(null)}
                  />
                </span>
              )}
              {categoryGroupFilter && (
                <span className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600/20 text-blue-400 rounded-full">
                  {categoryGroupFilter}
                  <FiX
                    className="cursor-pointer"
                    onClick={() => setCategoryGroupFilter(null)}
                  />
                </span>
              )}
            </div>
          )}
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
                  className="px-6 py-4 cursor-pointer hover:bg-gray-800"
                >
                  <div className="flex justify-between mb-1">
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
                    {mailbox === "inbox" ? mail.from : mail.to}
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
          )}
        </Card>
      )}

      {/* ================= EMAIL DETAIL ================= */}
      {activeEmail && (
        <Card className="p-4 max-h-[80vh] overflow-y-auto">
          <button
            onClick={closeEmail}
            className="flex items-center text-sm text-gray-400 mb-4"
          >
            <FiArrowLeft className="mr-2" /> Zurück
          </button>

          <h2 className="text-2xl font-bold mb-1">
            {activeEmail.subject}
          </h2>

          <SafeEmailHtml html={activeEmail.body} />

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
