import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("gmail") === "connected") {
      alert("Gmail erfolgreich verbunden!");
      window.history.replaceState({}, document.title, "/dashboard");
    }

    if (params.get("gmail") === "error") {
      alert("Fehler beim Verbinden von Gmail");
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [location]);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Dein Inhalt */}
    </div>
  );
}

  // ---- Gmail Auth URL laden ----
  const fetchGmailAuthUrl = async () => {
    try {
      const res = await fetch("https://api.nillai.de/gmail/auth-url");
      const data = await res.json();
      setAuthUrl(data.auth_url);
    } catch (err) {
      console.log("Fehler beim Holen der Auth URL:", err);
    }
  };

  // ---- Emails aus Backend laden ----
  const loadEmails = async () => {
    try {
      setLoadingEmails(true);
      const res = await fetch("https://api.nillai.de/gmail/emails");
      const data = await res.json();
      setEmails(data.emails || []);
    } catch (err) {
      console.log("Email Ladefehler:", err);
    } finally {
      setLoadingEmails(false);
    }
  };

  // ---- Gmail-Modal öffnen ----
  const openGmailModal = async () => {
    setShowGmailModal(true);
    await fetchGmailAuthUrl();
  };

  return (
    <div style={styles.wrapper}>
      {/* ----------------- SIDEBAR ----------------- */}
      <div style={styles.sidebar}>
        <h1 style={styles.logo}>NILL</h1>

        <button style={styles.sidebarBtn} onClick={loadEmails}>
          📥 Alle E-Mails
        </button>

        <button style={styles.sidebarBtn} onClick={openGmailModal}>
          ✨ Gmail verbinden
        </button>
      </div>

      {/* ----------------- MAIN CONTENT ----------------- */}
      <div style={styles.main}>
        <h2 style={styles.header}>Übersicht</h2>

        {/* ---------- Ladeanimation ---------- */}
        {loadingEmails && (
          <div style={styles.loaderContainer}>
            <div style={styles.loader}></div>
            <p style={{ color: "#888" }}>Lade E-Mails…</p>
          </div>
        )}

        {/* ---------- Email-Liste ---------- */}
        {!loadingEmails && emails.length > 0 && (
          <div style={styles.emailList}>
            {emails.map((email, idx) => (
              <div key={idx} style={styles.emailCard}>
                <h3 style={styles.emailSubject}>{email.subject}</h3>
                <p style={styles.emailBody}>
                  {email.body?.slice(0, 180)}...
                </p>
                <div style={styles.tags}>
                  {email.category && (
                    <span style={styles.tag}>{email.category}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingEmails && emails.length === 0 && (
          <p style={{ color: "#666", marginTop: 20 }}>
            Noch keine E-Mails geladen.
          </p>
        )}
      </div>

      {/* ----------------- GMAIL MODAL ----------------- */}
      {showGmailModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Gmail Konto verbinden</h2>
            <p>
              Du wirst zu Google weitergeleitet, um dein Gmail-Konto zu
              verknüpfen.
            </p>

            {authUrl ? (
              <a href={authUrl} style={styles.gmailButton}>
                Google Login starten
              </a>
            ) : (
              <p>URL wird geladen…</p>
            )}

            <button
              style={styles.closeModal}
              onClick={() => setShowGmailModal(false)}
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================= STYLES ======================= */

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    background: "#0d0d0d",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  sidebar: {
    width: "240px",
    background: "#111",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "40px",
  },

  sidebarBtn: {
    padding: "14px",
    background: "#1a1a1a",
    border: "1px solid #222",
    color: "white",
    textAlign: "left",
    borderRadius: "8px",
    marginBottom: "12px",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },

  header: {
    fontSize: "26px",
    marginBottom: "25px",
  },

  emailList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  emailCard: {
    background: "#111",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #1f1f1f",
  },

  emailSubject: {
    fontSize: "18px",
    marginBottom: "10px",
  },

  emailBody: {
    color: "#ccc",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  tags: {
    marginTop: "14px",
  },

  tag: {
    background: "#333",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "12px",
  },

  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "50px",
  },

  loader: {
    width: "36px",
    height: "36px",
    border: "4px solid #444",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#111",
    padding: "30px",
    borderRadius: "14px",
    width: "380px",
    textAlign: "center",
    border: "1px solid #222",
  },

  gmailButton: {
    display: "inline-block",
    background: "#ffffff",
    padding: "12px 18px",
    borderRadius: "8px",
    color: "black",
    marginTop: "15px",
    fontWeight: "bold",
    textDecoration: "none",
  },

  closeModal: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#222",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
