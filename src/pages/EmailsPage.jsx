import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext, useEffect, useState } from "react";
import { GmailContext } from "../context/GmailContext";
import SafeEmailHtml from "../components/SafeEmailHtml";
import axios from "axios";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";

export default function EmailsPage() {
  const {
    emails,
    activeEmail,
    openEmail,
    closeEmail,
    loadingEmail,
    loadMoreEmails,
  } = useContext(GmailContext);

  const [ai, setAi] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!activeEmail) {
      setAi(null);
      return;
    }

    const fetchAI = async () => {
      setLoadingAI(true);
      try {
        const res = await axios.get(`/emails/${activeEmail.id}/process`);
        setAi(res.data);
      } catch (e) {
        setAi(null);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAI();
  }, [activeEmail]);

  const getPriorityColor = (priority) => {
    switch ((priority || "").toLowerCase()) {
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

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      {/* ========================= */}
      {/* 📥 EMAIL LIST */}
      {/* ========================= */}
      {!activeEmail && (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-gray-800">
            {emails.map((mail) => (
              <li
                key={mail.id}
                onClick={() => openEmail(mail.id)}
                className="px-6 py-4 cursor-pointer hover:bg-gray-800 transition"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">
                    {mail.subject || "(Kein Betreff)"}
                  </p>
                  <span className="text-xs text-gray-400">{mail.date}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {mail.from}
                </p>
              </li>
            ))}
          </ul>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={loadMoreEmails}
              className="w-full py-2 bg-gray-800 rounded hover:bg-gray-700"
            >
              Ältere Emails laden
            </button>
          </div>
        </Card>
      )}

      {/* ========================= */}
      {/* 📄 EMAIL DETAIL */}
      {/* ========================= */}
      {activeEmail && (
        <Card className="p-6 max-h-[80vh] overflow-y-auto relative">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={closeEmail}
              className="flex items-center text-sm text-gray-400 hover:text-white"
            >
              <FiArrowLeft className="mr-2" /> Zurück
            </button>

            {/* ⋮ Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded hover:bg-gray-800"
              >
                <FiMoreVertical />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-800">
                    Als ungelesen markieren
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-800">
                    Archivieren
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-800 text-red-400">
                    Löschen
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-bold mb-1">
            {activeEmail.subject || "(Kein Betreff)"}
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            {activeEmail.from}
          </p>

          {/* 🤖 KI BOX */}
          {loadingAI ? (
            <p className="text-gray-400 mb-6">KI-Analyse läuft …</p>
          ) : ai ? (
            <div className="mb-8 p-4 bg-gray-800 rounded-xl space-y-3">
              <div>
                <span className="font-semibold">Zusammenfassung</span>
                <p className="text-gray-300">{ai.summary}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">Priorität</span>
                <span
                  className={`px-2 py-1 rounded text-white ${getPriorityColor(
                    ai.priority
                  )}`}
                >
                  {ai.priority}
                </span>
              </div>

              {ai.category && (
                <div>
                  <span className="font-semibold">Kategorie</span>
                  <span className="ml-2 text-gray-300">{ai.category}</span>
                </div>
              )}

              {ai.action_items?.length > 0 && (
                <div>
                  <span className="font-semibold">Action Items</span>
                  <ul className="list-disc list-inside text-gray-300">
                    {ai.action_items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}

          {/* ✉️ BODY */}
          <SafeEmailHtml html={activeEmail.body} />
        </Card>
      )}
    </PageLayout>
  );
}
