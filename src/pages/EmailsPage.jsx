import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext, useState, useEffect } from "react";
import { GmailContext } from "../context/GmailContext";
import SafeEmailHtml from "../components/SafeEmailHtml";
import { FiMenu } from "react-icons/fi";
import axios from "axios";

export default function EmailsPage() {
  const { emails, activeEmail, openEmail, closeEmail, loadingEmail, loadMoreEmails } =
    useContext(GmailContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ai, setAi] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // 🔹 Wenn eine neue Email aktiv wird, KI-Daten laden
  useEffect(() => {
    if (!activeEmail) {
      setAi(null);
      return;
    }

    const fetchAI = async () => {
      setLoadingAI(true);
      try {
        const res = await axios.get(`/emails/${activeEmail.id}/process`);
        setAi(res.data); // summary, category, priority, action_items, language etc.
      } catch (err) {
        console.error("KI Analyse fehlgeschlagen:", err);
        setAi(null);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAI();
  }, [activeEmail]);

  const getPriorityColor = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "hoch":
      case "high":
        return "bg-red-600";
      case "mittel":
      case "medium":
        return "bg-yellow-500";
      case "niedrig":
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
        >
          <FiMenu className="mr-2" /> Menü
        </button>
      </div>

      <div className="flex gap-4 h-[88vh] min-h-[600px]">
        {/* Email List Sidebar */}
        <Card
          className={`
            w-[280px] flex-shrink-0 overflow-y-auto p-4
            md:flex ${sidebarOpen ? "block" : "hidden"}
            scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800
          `}
        >
          {emails?.length ? (
            <ul className="divide-y divide-gray-800">
              {emails.map((mail) => {
                const isActive = activeEmail?.id === mail.id;
                return (
                  <li
                    key={mail.id}
                    onClick={() => {
                      if (!mail.id) return;
                      openEmail(mail.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      p-3 cursor-pointer truncate transition
                      ${isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-800"}
                    `}
                  >
                    <p className="truncate">{mail.subject || "(Kein Betreff)"}</p>
                    <p className="text-xs text-gray-400 truncate">{mail.from}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400">Keine Emails gefunden.</p>
          )}
          {emails?.length > 0 && (
            <button
              onClick={loadMoreEmails}
              className="mt-4 w-full text-center px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Mehr Emails laden
            </button>
          )}
        </Card>

        {/* Detail View */}
        <Card className="flex-1 overflow-y-auto p-6 bg-gray-900 rounded-xl max-w-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {!activeEmail ? (
            <p className="text-gray-400">Wähle eine Email aus</p>
          ) : loadingEmail ? (
            <p className="text-gray-400">Lade Email …</p>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-1">
                {activeEmail.subject || "(Kein Betreff)"}
              </h2>
              <p className="text-sm text-gray-400 mb-4">{activeEmail.from}</p>

              <hr className="border-gray-700 mb-6" />

              {/* 🔹 KI-Daten ganz oben */}
              {loadingAI ? (
                <p className="text-gray-400 mb-4">KI-Analyse läuft …</p>
              ) : ai ? (
                <div className="mb-6 bg-gray-800 p-4 rounded space-y-3">
                  <div>
                    <span className="font-semibold">Zusammenfassung:</span>
                    <p className="text-gray-300">{ai.summary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Priorität:</span>
                    <span
                      className={`px-2 py-1 rounded text-white ${getPriorityColor(
                        ai.priority
                      )}`}
                    >
                      {ai.priority || "Unbekannt"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Kategorie:</span>
                    <span className="ml-2 text-gray-300">{ai.category}</span>
                  </div>
                  {ai.action_items?.length ? (
                    <div>
                      <span className="font-semibold">Action Items:</span>
                      <ul className="list-disc list-inside text-gray-300">
                        {ai.action_items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {ai.language && ai.language !== "de" ? (
                    <div>
                      <span className="font-semibold">Übersetzung:</span>
                      <p className="text-gray-300">{ai.summary}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Email Body */}
              <SafeEmailHtml html={activeEmail.body} />

              <button
                onClick={closeEmail}
                className="mt-6 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Schließen
              </button>
            </>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
