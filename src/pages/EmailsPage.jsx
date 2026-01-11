import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext, useState, useEffect } from "react";
import { GmailContext } from "../context/GmailContext";
import SafeEmailHtml from "../components/SafeEmailHtml";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";

export default function EmailsPage() {
  const { emails, activeEmail, openEmail, closeEmail, loadingEmail, loadMoreEmails } =
    useContext(GmailContext);

  const [expandedEmailId, setExpandedEmailId] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // KI-Daten laden, wenn Email geöffnet wird
  useEffect(() => {
    if (!expandedEmailId) {
      setAiData(null);
      return;
    }

    const fetchAI = async () => {
      setLoadingAI(true);
      try {
        const res = await axios.get(`/emails/${expandedEmailId}/process`);
        setAiData(res.data);
      } catch (err) {
        console.error("KI Analyse fehlgeschlagen:", err);
        setAiData(null);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAI();
  }, [expandedEmailId]);

  const toggleEmail = (id) => {
    if (expandedEmailId === id) {
      setExpandedEmailId(null);
    } else {
      setExpandedEmailId(id);
    }
  };

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
      <h1 className="text-3xl font-bold mb-6">Postfach</h1>

      <div className="space-y-4">
        {emails?.length ? (
          <>
            {emails.map((mail) => {
              const isExpanded = expandedEmailId === mail.id;
              return (
                <Card key={mail.id} className="p-4 bg-gray-900 rounded-lg">
                  {/* Header der Email */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleEmail(mail.id)}
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold text-lg truncate">{mail.subject || "(Kein Betreff)"}</p>
                      <p className="text-xs text-gray-400">{mail.from}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {mail.priority && (
                        <span
                          className={`px-2 py-0.5 rounded text-white text-xs ${getPriorityColor(mail.priority)}`}
                        >
                          {mail.priority}
                        </span>
                      )}
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>

                  {/* Detailbereich */}
                  {isExpanded && (
                    <div className="mt-4 border-t border-gray-700 pt-4 space-y-4">
                      {loadingEmail ? (
                        <p className="text-gray-400">Lade Email …</p>
                      ) : (
                        <>
                          <SafeEmailHtml html={mail.body} />

                          {loadingAI ? (
                            <p className="text-gray-400">KI-Analyse läuft …</p>
                          ) : aiData ? (
                            <div className="bg-gray-800 p-3 rounded space-y-2">
                              {aiData.summary && (
                                <div>
                                  <span className="font-semibold">Zusammenfassung:</span>
                                  <p className="text-gray-300">{aiData.summary}</p>
                                </div>
                              )}
                              {aiData.priority && (
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">Priorität:</span>
                                  <span className={`px-2 py-1 rounded text-white ${getPriorityColor(aiData.priority)}`}>
                                    {aiData.priority}
                                  </span>
                                </div>
                              )}
                              {aiData.category && (
                                <div>
                                  <span className="font-semibold">Kategorie:</span>
                                  <span className="ml-2 text-gray-300">{aiData.category}</span>
                                </div>
                              )}
                              {aiData.action_items?.length > 0 && (
                                <div>
                                  <span className="font-semibold">Action Items:</span>
                                  <ul className="list-disc list-inside text-gray-300">
                                    {aiData.action_items.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
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
            })}

            {/* Load More Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMoreEmails}
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                Ältere Emails laden
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-center">Keine Emails gefunden.</p>
        )}
      </div>
    </PageLayout>
  );
}
