import React, { useEffect, useState } from "react";

/**
 * Dashboard.jsx
 * Komplettes Email-Dashboard mit:
 * - Gmail connect
 * - Inbox
 * - Email detail panel
 * - Intelligent tags + Filters
 * - KI-Aktionen (via backend endpoints)
 *
 * Anpassung: setze BASE_URL auf dein Backend (z. B. https://api.nillai.de)
 */

const BASE_URL = "https://5.75.175.150"; // <-- anpassen

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [gmailConnected, setGmailConnected] = useState(false);

  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [loadingEmails, setLoadingEmails] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState(null);

  const [tagFilters, setTagFilters] = useState([]); // e.g. ["invoice","meeting"]
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  const [aiResult, setAiResult] = useState("");

  const token = localStorage.getItem("token"); // passe an, falls anders

  const TAGS = [
    { key: "all", label: "Alle" },
    { key: "inbox", label: "Posteingang" },
    { key: "invoice", label: "Rechnungen" },
    { key: "meeting", label: "Meeting" },
    { key: "personal", label: "Persönlich" },
    { key: "spam", label: "Spam" },
    { key: "important", label: "Wichtig" },
  ];

  // --- Helper: headers
  const authHeaders = () => {
    const h = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  };

  // --- on mount: check gmail status
  useEffect(() => {
    checkGmailStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- fetch gmail connected status
  const checkGmailStatus = async () => {
    try {
      const res = await fetch(`${BASE_URL}/gmail/status`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("status fetch failed");
      const json = await res.json();
      setGmailConnected(Boolean(json.connected));
    } catch (e) {
      console.warn("Gmail status:", e);
      setGmailConnected(false);
    }
  };

  // --- connect -> get OAuth url and redirect
  const connectGmail = async () => {
    try {
      const res = await fetch(`${BASE_URL}/gmail/auth-url`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("could not get auth url");
      const json = await res.json();
      // redirect to Google's OAuth consent screen
      window.location.href = json.url;
    } catch (e) {
      console.error(e);
      setError("Fehler beim Starten der Gmail-Verbindung.");
    }
  };

  // --- load emails from backend
  const loadEmails = async () => {
    setLoadingEmails(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/emails/list`, {
        headers: authHeaders(),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server: ${txt || res.status}`);
      }
      const data = await res.json();
      setEmails(data || []);
      setFilteredEmails(data || []);
      setLoadingEmails(false);
    } catch (e) {
      console.error(e);
      setError("Fehler beim Laden der E-Mails.");
      setLoadingEmails(false);
    }
  };

  // --- open email detail
  const openEmail = async (email) => {
    setSelectedEmail(null);
    setLoadingAction(true);
    try {
      // fetch fresh detail (optional), or use the email object already included
      const res = await fetch(`${BASE_URL}/emails/${email.id}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("fetch detail failed");
      const json = await res.json();
      setSelectedEmail(json);
    } catch (e) {
      console.warn("fallback to provided email", e);
      setSelectedEmail(email);
    } finally {
      setLoadingAction(false);
      // open detail panel automatically
      setActiveTab("email");
    }
  };

  // --- run AI action (summarize, reply, categorize, priority)
  const runAI = async (action, emailId) => {
    setAiModalOpen(true);
    setAiTitle("Lädt...");
    setAiResult("");
    setLoadingAction(true);

    let endpoint = "";
    if (action === "summarize") endpoint = `/emails/${emailId}/summarize`;
    if (action === "reply") endpoint = `/emails/${emailId}/reply`;
    if (action === "categorize") endpoint = `/emails/${emailId}/categorize`;
    if (action === "priority") endpoint = `/emails/${emailId}/priority`;

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "AI call failed");
      }
      const json = await res.json();
      // backend returns { result: "..." } or model-specific structure
      const resultText = json.result || json.summary || JSON.stringify(json);
      setAiTitle(
        action === "summarize"
          ? "Zusammenfassung"
          : action === "reply"
          ? "Antwort-Vorschlag"
          : action === "categorize"
          ? "Kategorie"
          : "Priorität"
      );
      setAiResult(resultText);
    } catch (e) {
      console.error(e);
      setAiTitle("Fehler");
      setAiResult("Die KI-Aktion konnte nicht ausgeführt werden.");
    } finally {
      setLoadingAction(false);
    }
  };

  // --- toggle tag filter
  const toggleTagFilter = (tagKey) => {
    if (tagKey === "all") {
      setTagFilters([]);
      setFilteredEmails(emails);
      return;
    }
    let newFilters = [...tagFilters];
    if (newFilters.includes(tagKey)) {
      newFilters = newFilters.filter((t) => t !== tagKey);
    } else {
      newFilters.push(tagKey);
    }
    setTagFilters(newFilters);

    // apply filter: emails with email.tags includes any of newFilters
    if (newFilters.length === 0) {
      setFilteredEmails(emails);
    } else {
      const filtered = emails.filter((e) => {
        if (!e.tags || e.tags.length === 0) return false;
        return newFilters.some((f) => e.tags.includes(f));
      });
      setFilteredEmails(filtered);
    }
  };

  // --- mark email read (simple patch)
  const markRead = async (id, read = true) => {
    try {
      await fetch(`${BASE_URL}/emails/${id}/mark-read`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ is_read: read }),
      });
      // update UI quickly
      setEmails((prev) => prev.map((p) => (p.id === id ? { ...p, is_read: read } : p)));
      setFilteredEmails((prev) => prev.map((p) => (p.id === id ? { ...p, is_read: read } : p)));
      if (selectedEmail && selectedEmail.id === id) setSelectedEmail({ ...selectedEmail, is_read: read });
    } catch (e) {
      console.warn("mark read error", e);
    }
  };

  // --- refresh single email in list after AI actions
  const refreshEmailInList = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/emails/${id}`, { headers: authHeaders() });
      if (!res.ok) return;
      const json = await res.json();
      setEmails((prev) => prev.map((e) => (e.id === id ? json : e)));
      setFilteredEmails((prev) => prev.map((e) => (e.id === id ? json : e)));
      if (selectedEmail && selectedEmail.id === id) setSelectedEmail(json);
    } catch (e) {
      console.warn(e);
    }
  };

  // --- initial load helper when clicking Gmail connect or update
  useEffect(() => {
    if (gmailConnected) {
      loadEmails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gmailConnected]);

  // --- simple spinner component
  const Spinner = ({ size = 6 }) => (
    <div className={`animate-spin border-4 border-transparent border-t-[var(--accent)] rounded-full w-${size} h-${size}`} />
  );

  // --- UI
  return (
    <div className="min-h-screen p-10 bg-gradient-to-tr from-[#071023] to-[#03060a] text-white">
      <div className="flex items-start gap-8">
        {/* LEFT: main column */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">NILL – Übersicht</h1>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-md ${activeTab === "overview" ? "bg-[var(--accent)] text-black" : "bg-black/20 text-gray-300"}`}
              >
                Übersicht
              </button>

              <button
                onClick={() => setActiveTab("email")}
                className={`px-4 py-2 rounded-md ${activeTab === "email" ? "bg-[var(--accent)] text-black" : "bg-black/20 text-gray-300"}`}
              >
                E-Mail
              </button>
            </div>
          </div>

          {/* Overview card */}
          {activeTab === "overview" && (
            <div className="glass p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-semibold mb-2">Willkommen zurück 👋</h2>
              <p className="text-gray-300">Verbinde Gmail und sehe dein Postfach an – oder teste das System mit einer Test-Mail.</p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={connectGmail}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Gmail verbinden
                </button>

                <button
                  onClick={loadEmails}
                  className="px-5 py-3 bg-[var(--accent)] rounded-lg text-black"
                >
                  E-Mails laden
                </button>
              </div>
            </div>
          )}

          {/* Email inbox */}
          {activeTab === "email" && (
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">Posteingang</h2>
                  <p className="text-gray-400 text-sm">Verbunden: {gmailConnected ? <span className="text-green-400">Ja</span> : <span className="text-red-400">Nein</span>}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { checkGmailStatus(); }}
                    className="px-4 py-2 bg-black/20 rounded-md"
                  >
                    Status prüfen
                  </button>

                  <button
                    onClick={loadEmails}
                    className="px-4 py-2 bg-[var(--accent)] rounded-md text-black"
                  >
                    {loadingEmails ? "Lädt..." : "Aktualisieren"}
                  </button>
                </div>
              </div>

              {/* Tag filters */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {TAGS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => toggleTagFilter(t.key)}
                    className={`px-3 py-1 rounded-full text-sm ${tagFilters.includes(t.key) ? "bg-[var(--accent)] text-black" : "bg-black/10 text-gray-300"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Main content column: list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email list */}
                <div>
                  {error && (
                    <div className="text-red-400 mb-3">{error}</div>
                  )}

                  {loadingEmails && (
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-6 h-6 border-4 border-transparent border-t-[var(--accent)] rounded-full animate-spin" />
                      Lade E-Mails...
                    </div>
                  )}

                  {!loadingEmails && filteredEmails.length === 0 && (
                    <div className="text-gray-400">Keine E-Mails gefunden.</div>
                  )}

                  <div className="space-y-3">
                    {filteredEmails.map((mail) => (
                      <div key={mail.id} className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-[var(--accent)] transition">
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold truncate">{mail.subject || "(kein Betreff)"}</p>
                              {mail.is_read ? <span className="text-sm text-gray-400">gelesen</span> : <span className="text-sm text-yellow-300">neu</span>}
                            </div>
                            <p className="text-gray-300 text-sm truncate">{mail.sender}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button onClick={() => openEmail(mail)} className="px-3 py-1 bg-black/10 rounded-md text-sm">Öffnen</button>
                            <button onClick={() => markRead(mail.id, !mail.is_read)} className="px-3 py-1 bg-black/10 rounded-md text-sm">Lesen/ungelesen</button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-gray-400 text-sm line-clamp-2">{mail.summary || (mail.body ? (mail.body.length > 120 ? mail.body.slice(0, 120) + "..." : mail.body) : "")}</p>

                          <div className="flex items-center gap-2">
                            {/* quick tags */}
                            {(mail.tags || []).slice(0,3).map((tg) => (
                              <span key={tg} className="text-xs px-2 py-0.5 bg-black/10 rounded-full">{tg}</span>
                            ))}

                            <button onClick={() => runAI("summarize", mail.id)} className="px-3 py-1 bg-blue-600 rounded-md text-sm">AI</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Email detail (wenn geöffnet) */}
                <div>
                  <div className="bg-black/10 p-4 rounded-lg min-h-[300px]">
                    {!selectedEmail && (
                      <div className="p-6 text-gray-400">
                        Wähle eine E-Mail, um Details zu sehen.
                      </div>
                    )}

                    {selectedEmail && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{selectedEmail.subject}</h3>
                            <p className="text-gray-300 text-sm">{selectedEmail.sender} • <span className="text-gray-500">{selectedEmail.date}</span></p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => markRead(selectedEmail.id, !selectedEmail.is_read)} className="px-3 py-1 bg-black/20 rounded-md">Lesen/ungelesen</button>
                            <button onClick={() => refreshEmailInList(selectedEmail.id)} className="px-3 py-1 bg-black/20 rounded-md">Aktualisieren</button>
                          </div>
                        </div>

                        <div className="bg-black/20 p-4 rounded-md">
                          <p className="text-gray-300 whitespace-pre-line">{selectedEmail.body}</p>
                        </div>

                        {/* AI action area */}
                        <div className="flex gap-3">
                          <button onClick={() => runAI("summarize", selectedEmail.id)} className="px-4 py-2 bg-blue-600 rounded-lg">Zusammenfassen</button>
                          <button onClick={() => runAI("reply", selectedEmail.id)} className="px-4 py-2 bg-green-600 rounded-lg">Antwort generieren</button>
                          <button onClick={() => runAI("categorize", selectedEmail.id)} className="px-4 py-2 bg-purple-600 rounded-lg">Kategorie</button>
                          <button onClick={() => runAI("priority", selectedEmail.id)} className="px-4 py-2 bg-red-600 rounded-lg">Priorität</button>
                        </div>

                        {/* intelligent tags & action items */}
                        <div className="mt-4">
                          <h4 className="text-sm text-gray-300 mb-2">Intelligente Tags</h4>
                          <div className="flex gap-2 flex-wrap">
                            {(selectedEmail.tags || []).length === 0 && <span className="text-gray-500">Keine Tags.</span>}
                            {(selectedEmail.tags || []).map((t) => (
                              <span key={t} className="px-3 py-1 bg-black/10 rounded-full text-sm">{t}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm text-gray-300 mb-2 mt-4">Action Items</h4>
                          {(selectedEmail.action_items || []).length === 0 ? (
                            <p className="text-gray-500">Keine Action Items gefunden.</p>
                          ) : (
                            <ul className="list-disc ml-5 text-gray-300">
                              {selectedEmail.action_items.map((it, idx) => <li key={idx}>{it}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: small utilities */}
        <aside className="w-80">
          <div className="glass p-4 rounded-2xl border border-white/10">
            <h4 className="text-lg font-semibold mb-2">Aktionen</h4>

            <button onClick={connectGmail} className="w-full px-4 py-2 bg-blue-600 rounded-md mb-2">Gmail verbinden</button>
            <button onClick={loadEmails} className="w-full px-4 py-2 bg-[var(--accent)] rounded-md text-black mb-2">Postfach sync</button>

            <div className="mt-4 text-sm text-gray-400">
              <div>Connected: {gmailConnected ? <span className="text-green-400">Ja</span> : <span className="text-red-400">Nein</span>}</div>
              <div className="mt-2">E-Mails: {emails.length}</div>
            </div>
          </div>

          <div className="glass p-4 rounded-2xl border border-white/10 mt-4">
            <h4 className="text-lg font-semibold mb-2">Kurzbefehl</h4>
            <p className="text-gray-300 text-sm">Wähle eine Mail → nutze die AI-Buttons → Ergebnisse erscheinen im Modal.</p>
          </div>
        </aside>
      </div>

      {/* AI Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0d1524] p-6 rounded-2xl w-[90%] max-w-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{aiTitle}</h3>
              <div className="flex items-center gap-2">
                {loadingAction && <div className="w-4 h-4 border-2 border-transparent border-t-[var(--accent)] rounded-full animate-spin" />}
                <button onClick={() => setAiModalOpen(false)} className="px-3 py-1 bg-black/10 rounded-md">Schließen</button>
              </div>
            </div>

            <div className="bg-black/20 p-4 rounded-md min-h-[120px] text-gray-200 whitespace-pre-wrap">
              {aiResult || <span className="text-gray-400">Keine Antwort.</span>}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
