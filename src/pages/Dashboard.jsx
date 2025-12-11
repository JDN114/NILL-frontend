import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// --------------------------------------------------------
// Dashboard Komponente
// --------------------------------------------------------
export default function Dashboard() {
  const location = useLocation();

  // Gmail / Mail States
  const [authUrl, setAuthUrl] = useState("");
  const [emails, setEmails] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tags, setTags] = useState({}); // { emailId: ["tag1", "tag2"] }

  // --------------------------------------------------------
  // 1) Gmail Auth URL laden
  // --------------------------------------------------------
  const fetchGmailAuthUrl = async () => {
    try {
      const res = await fetch("https://api.nillai.de/gmail/auth-url");
      const data = await res.json();
      setAuthUrl(data.auth_url);
    } catch (err) {
      console.log("Fehler beim Holen der Auth URL:", err);
    }
  };

  // --------------------------------------------------------
  // 2) Gmail Callback auswerten
  // --------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("gmail") === "connected") {
      alert("Gmail erfolgreich verbunden!");
      window.history.replaceState({}, document.title, "/dashboard");
      loadEmails();
    }

    if (params.get("gmail") === "error") {
      alert("Fehler beim Verbinden deines Gmail-Kontos.");
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [location]);

  // --------------------------------------------------------
  // 3) Emails laden
  // --------------------------------------------------------
  const loadEmails = async () => {
    setLoadingEmails(true);
    try {
      const res = await fetch("https://api.nillai.de/gmail/emails");
      const data = await res.json();
      setEmails(data.emails || []);
    } catch (err) {
      console.log("Fehler beim Laden der E-Mails:", err);
    }
    setLoadingEmails(false);
  };

  // --------------------------------------------------------
  // UI Initial Setup
  // --------------------------------------------------------
  useEffect(() => {
    fetchGmailAuthUrl();
  }, []);

  // --------------------------------------------------------
  // Tagging
  // --------------------------------------------------------
  const addTag = (emailId, newTag) => {
    if (!newTag) return;

    setTags((prev) => ({
      ...prev,
      [emailId]: [...(prev[emailId] || []), newTag]
    }));
  };

  // --------------------------------------------------------
  // Render
  // --------------------------------------------------------
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* ------------------------------------------------------------------ */}
      {/* Sidebar */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-xl transition-all duration-300 p-4 flex flex-col`}
      >
        <h2 className="text-xl font-bold mb-10">NILL AI</h2>

        <button
          onClick={sidebarOpen ? () => setSidebarOpen(false) : () => setSidebarOpen(true)}
          className="px-3 py-2 bg-gray-100 rounded-lg mb-8 hover:bg-gray-200 transition"
        >
          {sidebarOpen ? "Zurück" : "→"}
        </button>

        <button
          onClick={() => (window.location.href = authUrl)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
        >
          Gmail verbinden
        </button>

        <button
          onClick={loadEmails}
          className="mt-4 px-4 py-2 bg-gray-300 text-black rounded-xl shadow hover:bg-gray-400 transition"
        >
          E-Mails aktualisieren
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main Content */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* -------------------------- */}
        {/* Loading Animation */}
        {/* -------------------------- */}
        {loadingEmails && (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 h-full">
          {/* --------------------------------------------------------------- */}
          {/* Email Liste */}
          {/* --------------------------------------------------------------- */}
          <div className="col-span-1 bg-white rounded-2xl shadow p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">E-Mails</h2>

            {emails.map((mail, index) => (
              <div
                key={index}
                onClick={() => setSelectedEmail(mail)}
                className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition rounded-lg"
              >
                <p className="font-semibold">{mail.subject || "(Kein Betreff)"}</p>
                <p className="text-sm text-gray-500">{mail.from}</p>
              </div>
            ))}
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Email Detailansicht */}
          {/* --------------------------------------------------------------- */}
          <div className="col-span-2 bg-white rounded-2xl shadow p-6 overflow-y-auto">
            {selectedEmail ? (
              <>
                <h2 className="text-2xl font-bold mb-2">{selectedEmail.subject}</h2>
                <p className="text-gray-500 mb-4">{selectedEmail.from}</p>

                <div className="bg-gray-100 p-4 rounded-xl mb-6 whitespace-pre-wrap">
                  {selectedEmail.body || "(Kein Inhalt)"}
                </div>

                {/* Tagging */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(tags[selectedEmail.id] || []).map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Tag Input */}
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      id="newTag"
                      placeholder="Neuer Tag"
                      className="border p-2 rounded-lg flex-1"
                    />
                    <button
                      onClick={() => {
                        const val = document.getElementById("newTag").value;
                        addTag(selectedEmail.id, val);
                        document.getElementById("newTag").value = "";
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Hinzufügen
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-lg">Wähle eine E-Mail aus…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
