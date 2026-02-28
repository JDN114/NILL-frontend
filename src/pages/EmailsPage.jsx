import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GmailContext } from "../context/GmailContext";
import { OutlookContext } from "../context/OutlookContext";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";
import { FiArrowLeft, FiFilter, FiX, FiEdit2 } from "react-icons/fi";

export default function EmailsPage() {

  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  const gmail = useContext(GmailContext);
  const outlook = useContext(OutlookContext);

  // ✅ STABILE Provider Auswahl
  const provider =
    outlook.connected === true
      ? outlook
      : gmail.connected === true
      ? gmail
      : null;

  const [mailbox, setMailbox] = useState("inbox");
  const [loading, setLoading] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [categoryGroupFilter, setCategoryGroupFilter] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filterRef = useRef(null);

  const [replyOpen, setReplyOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  const emails = provider?.emails ?? [];

  // =====================================================
  // AUTH GUARD
  // =====================================================

  useEffect(() => {

    if (!currentUser)
      navigate("/login", { replace: true });

  }, [currentUser, navigate]);


  // =====================================================
  // EMAIL LOAD (FIXED - NO MORE INFINITE CALLS)
  // =====================================================

  useEffect(() => {

    const loadEmails = async () => {

      try {

        setLoading(true);

        if (outlook.connected) {

          await outlook.fetchEmails?.();

        }

        else if (gmail.connected) {

          if (mailbox === "inbox")
            await gmail.fetchInboxEmails?.();
          else
            await gmail.fetchSentEmails?.();

        }

      }

      finally {

        setLoading(false);

      }

    };

    if (outlook.connected || gmail.connected)
      loadEmails();

  }, [
    outlook.connected,
    gmail.connected,
    mailbox
  ]);


  // =====================================================
  // CLICK OUTSIDE FILTER
  // =====================================================

  useEffect(() => {

    const handler = (e) => {

      if (filterRef.current && !filterRef.current.contains(e.target))
        setFiltersOpen(false);

    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener("mousedown", handler);

  }, []);


  // =====================================================
  // FILTER
  // =====================================================

  const displayedEmails = emails.filter((e) => {

    if (
      priorityFilter &&
      (e.priority || "").toLowerCase() !== priorityFilter.toLowerCase()
    )
      return false;

    if (
      categoryGroupFilter &&
      e.category_group !== categoryGroupFilter
    )
      return false;

    return true;

  });


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


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    if (!provider) return;

    setLoading(true);

    try {

      if (outlook.connected)
        await outlook.fetchEmails?.();

      else if (gmail.connected) {

        if (mailbox === "inbox")
          await gmail.fetchInboxEmails?.();
        else
          await gmail.fetchSentEmails?.();

      }

    }

    finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD MORE
  // =====================================================

  const handleLoadMore = async () => {

    if (!provider) return;

    setLoading(true);

    try {

      if (outlook.connected)
        await outlook.fetchEmails?.();

      else if (gmail.connected) {

        if (mailbox === "inbox")
          await gmail.fetchInboxEmails?.({ append: true });
        else
          await gmail.fetchSentEmails?.({ append: true });

      }

    }

    finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {

    return (

      <PageLayout>

        <p className="text-gray-400 text-center py-10">
          E-Mails werden geladen…
        </p>

      </PageLayout>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <PageLayout>

      <h1 className="text-2xl font-bold mb-6 text-white">
        Postfach
      </h1>


      {!provider && (

        <p className="text-center py-6 text-red-400">
          Kein E-Mail-Konto verbunden
        </p>

      )}


      {/* Toolbar */}

      <div className="flex items-center gap-2 mb-4">

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

            {box === "inbox"
              ? "Posteingang"
              : "Gesendet"}

          </button>

        ))}


        <button
          onClick={handleRefresh}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Aktualisieren
        </button>


        <button
          onClick={() => setComposeOpen(true)}
          className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >

          <FiEdit2 />
          Neue E-Mail

        </button>

      </div>


      {/* Email List */}

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
                className="px-6 py-4 hover:bg-gray-800"
              >

                <div className="flex justify-between mb-1">

                  <p className="font-semibold truncate">
                    {mail.subject || "(Kein Betreff)"}
                  </p>

                  <span className="text-xs text-gray-400">
                    {mail.date
                      ? new Date(mail.date).toLocaleString()
                      : ""}
                  </span>

                </div>

                <p className="text-sm text-gray-400 truncate">
                  {mail.from}
                </p>

              </li>

            ))}

          </ul>

        )}

      </Card>


      <EmailReplyModal
        emailId={provider?.activeEmail?.id}
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
