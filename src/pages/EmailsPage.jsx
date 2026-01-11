import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext, useState, useEffect } from "react";
import { GmailContext } from "../context/GmailContext";
import SafeEmailHtml from "../components/SafeEmailHtml";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";

export default function EmailsPage() {
  const {
    emails,
    activeEmail,
    openEmail,
    closeEmail,
    loadingEmail,
    loadMoreEmails
  } = useContext(GmailContext);

  const [expandedEmailId, setExpandedEmailId] = useState(null);
  const [aiData, setAiData] = useState({});
  const [loadingAI, setLoadingAI] = useState(false);

  // 🔹 KI-Daten laden, wenn eine Email aktiv ist
  useEffect(() => {
    if (!activeEmail) return;

    const fetchAI = async () => {
      setLoadingAI(true);
      try {
        const res = await axios.get(`/emails/${activeEmail.id}/process`);
        setAiData((prev) => ({ ...prev, [activeEmail.id]: res.data }));
      } catch (err) {
        console.error("KI Analyse fehlgeschlagen:", err);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAI();
  }, [activeEmail]);

  // 🔹 Farben für Priorität
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

  const toggleEmail = (id) => {
    if (expandedEmailId === id) {
      setExpandedEmailId(null);
    } else {
      openEmail(id); // Lädt Body + setzt activeEmail
      setExpandedEmailId(id);
    }
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      <div className="space-y-4 max-h-[88vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {emails?.length ? (
          emails.map((mail) => {
            const isExpanded = expandedEmailId === mail.id;
            const ai = aiData[mail.id];

            return (
              <Card key={mail.id} className="p-4 bg-gray-900 rounded-xl">
                {/* Header / Subject */}
                <div
                  onClick={() => toggleEmail(mail.id)}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <p className="font-semibold">{mail.subject || "(Kein Betreff)"}</p>
                    <p className="text-xs text-gray-400 truncate">{mail.from}</p>
                  </div>
                  {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {/* Detail View */}
                {isExpanded && (
                  <div className="mt-4 border-t border-gray-700 pt-4 space-y-4">
                    {loadingEmail ? (
                      <p className="text-gray-400">Lade Email …</p>
                    ) : (
                      <>
                        <SafeEmailHtml html={activeEmail?.id === mail.id ? activeEmail.body : ""} />

                        {loadingAI ? (
                          <p className="text-gray-400">KI-Analyse läuft …</p>
                        ) : ai ? (
                          <div className="bg-gray-800 p-3 rounded space-y-2">
                            <div>
                              <span className="font-semibold">Zusammenfassung:</span>
                              <p className="text-gray-300">{ai.summary}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Priorität:</span>
                              <span className={`px-2 py-1 rounded text-white ${getPriorityColor(ai.priority)}`}>
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
                          </div>
                        ) : null}

                        <button
                          onClick={() => setExpandedEmailId(null)}
                          className="mt-4 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
                        >
                          Schließen
                        </button>
                      </>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <p className="text-gray-400">Keine Emails gefunden.</p>
        )}

        {/* Load More */}
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreEmails}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            Mehr Emails laden
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
