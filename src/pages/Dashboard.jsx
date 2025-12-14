// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  getGmailAuthUrl,
  getGmailStatus,
  getGmailEmails,
} from "../services/api";

export default function Dashboard() {
  const [gmailConnected, setGmailConnected] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lade Status beim Start
  useEffect(() => {
    checkGmail();
  }, []);

  const checkGmail = async () => {
    try {
      const res = await getGmailStatus();
      if (res.connected) {
        setGmailConnected(true);
        loadEmails();
      }
    } catch (e) {
      console.error("Gmail Status Fehler:", e);
    }
  };

  const loadEmails = async () => {
    setLoading(true);
    try {
      const res = await getGmailEmails();
      setEmails(res);
    } catch (e) {
      console.error("Emails laden fehlgeschlagen:", e);
    }
    setLoading(false);
  };

  const connectGmail = async () => {
    try {
      const res = await getGmailAuthUrl();
      if (res.auth_url) {
        // Weiterleitung zu Google OAuth
        window.location.href = res.auth_url;
      }
    } catch (e) {
      console.error("Gmail verbinden fehlgeschlagen:", e);
    }
  };

  const getTag = (mail) => {
    const s = (mail.subject || "").toLowerCase();
    if (s.includes("rechnung") || s.includes("invoice")) return "Finance";
    if (s.includes("meeting")) return "Meeting";
    if (s.includes("bewerbung")) return "Career";
    return "General";
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>NILL</h2>
        <div style={styles.navItemActive}>Dashboard</div>
        <div style={styles.navItem}>Inbox</div>
        <div style={styles.navItem}>AI</div>
        <div style={styles.navItem}>Settings</div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Dashboard</h1>
          {!gmailConnected ? (
            <button style={styles.primaryBtn} onClick={connectGmail}>
              Gmail verbinden
            </button>
          ) : (
            <span style={styles.connected}>● Gmail verbunden</span>
          )}
        </header>

        {/* Loader */}
        {loading && (
          <div style={styles.loaderWrap}>
            <div className="loader" />
            <p>Lade E-Mails…</p>
          </div>
        )}

        {/* Emails anzeigen */}
        {!loading && gmailConnected && emails.length > 0 && (
          <div style={styles.mailGrid}>
            {emails.map((mail) => (
              <div key={mail.id} style={styles.mailCard}>
                <div style={styles.mailHeader}>
                  <span style={styles.tag}>{getTag(mail)}</span>
                </div>
                <h3 style={styles.subject}>{mail.subject}</h3>
                <p style={styles.snippet}>{mail.snippet}</p>
                <span style={styles.from}>{mail.from}</span>
              </div>
            ))}
          </div>
        )}

        {/* Kein Gmail verbunden */}
        {!gmailConnected && !loading && (
          <div style={styles.empty}>
            <h2>📬 Verbinde dein Gmail-Konto</h2>
            <p>Damit NILL deine Mails automatisch analysieren kann.</p>
          </div>
        )}

        {/* Gmail verbunden, aber keine Mails */}
        {gmailConnected && !loading && emails.length === 0 && (
          <div style={styles.empty}>
            <h2>Keine E-Mails gefunden</h2>
            <p>Neue E-Mails erscheinen hier automatisch.</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------- Styles ---------- */
const styles = {
  page: {
    display: "flex",
    height: "100vh",
    background: "#0b0b0f",
    color: "#fff",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  sidebar: {
    width: 220,
    padding: 24,
    background: "#0f1016",
    borderRight: "1px solid #1c1d26",
  },
  logo: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 40,
  },
  navItem: {
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    opacity: 0.7,
    marginBottom: 8,
  },
  navItemActive: {
    padding: "12px 16px",
    borderRadius: 10,
    background: "#1c1d26",
    marginBottom: 8,
  },
  main: {
    flex: 1,
    padding: 40,
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  primaryBtn: {
    background: "#4f46e5",
    border: "none",
    padding: "12px 20px",
    borderRadius: 10,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s",
  },
  connected: {
    color: "#22c55e",
    fontWeight: 600,
  },
  mailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  mailCard: {
    background: "#13141c",
    padding: 20,
    borderRadius: 16,
    border: "1px solid #1f2030",
    transition: "0.2s",
    cursor: "pointer",
    hover: {
      transform: "scale(1.02)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
    },
  },
  mailHeader: {
    display: "flex",
    justifyContent: "flex-end",
  },
  tag: {
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    background: "#1f2030",
  },
  subject: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 600,
  },
  snippet: {
    opacity: 0.7,
    fontSize: 14,
    marginTop: 8,
  },
  from: {
    display: "block",
    marginTop: 14,
    fontSize: 12,
    opacity: 0.5,
  },
  empty: {
    marginTop: 80,
    textAlign: "center",
    opacity: 0.7,
  },
  loaderWrap: {
    marginTop: 80,
    textAlign: "center",
  },
};

const css = `
.loader {
  width: 42px;
  height: 42px;
  border: 4px solid #1f2030;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
