import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function ResendVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/resend-verification", { email: trimmed });
      setSent(true);
    } catch (err) {
      if (err?.response?.status === 429) {
        setError("Zu viele Versuche. Bitte warte eine Stunde und versuche es erneut.");
      } else {
        setError(err?.response?.data?.detail || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{
      minHeight: "100vh",
      background: "#040407",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: '"Inter", system-ui, sans-serif',
      color: "#efede7",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "rgba(255,255,255,.035)",
        border: "1px solid rgba(239,237,231,.07)",
        borderRadius: 24,
        padding: "48px 40px",
      }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <span style={{
            width: 26, height: 26, borderRadius: 7, flexShrink: 0,
            background: "conic-gradient(from 210deg, #c6ff3c, #38f5d0, #7a5cff, #ff4d8d, #c6ff3c)",
            position: "relative",
          }} />
          <span style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 20, color: "#efede7", fontWeight: 400 }}>
            NILL
          </span>
        </div>

        {sent ? (
          <>
            <h1 style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, fontWeight: 400, marginBottom: 16, color: "#c6ff3c" }}>
              E-Mail gesendet.
            </h1>
            <p style={{ fontSize: 14, color: "rgba(239,237,231,.6)", lineHeight: 1.6, marginBottom: 32 }}>
              Falls diese Adresse registriert und noch nicht bestätigt ist, hast du einen neuen Link erhalten.
              Bitte prüfe auch deinen Spam-Ordner.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                width: "100%",
                padding: "13px",
                background: "#c6ff3c",
                color: "#050505",
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                borderRadius: 99,
                cursor: "pointer",
              }}
            >
              Zur Anmeldung →
            </button>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 32, fontWeight: 400, marginBottom: 8 }}>
              Bestätigung <em style={{ fontStyle: "italic", color: "#c6ff3c" }}>erneut senden.</em>
            </h1>
            <p style={{ fontSize: 14, color: "rgba(239,237,231,.5)", marginBottom: 32, lineHeight: 1.5 }}>
              Gib deine E-Mail-Adresse ein und wir schicken dir einen neuen Bestätigungslink.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                <label style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "rgba(239,237,231,.45)",
                }}>
                  E-Mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="du@firma.de"
                  autoComplete="email"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(239,237,231,.08)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    color: "#efede7",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {error && (
                <div style={{
                  fontSize: 12,
                  color: "#ff4d8d",
                  fontFamily: '"JetBrains Mono", monospace',
                  padding: "10px 14px",
                  background: "rgba(255,77,141,.07)",
                  border: "1px solid rgba(255,77,141,.2)",
                  borderRadius: 8,
                  marginBottom: 14,
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: "13px",
                  background: "#c6ff3c",
                  color: "#050505",
                  fontSize: 14,
                  fontWeight: 500,
                  border: "none",
                  borderRadius: 99,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? "Wird gesendet…" : "Link senden →"}
              </button>
            </form>

            <div style={{ marginTop: 28, textAlign: "center", fontSize: 13, color: "rgba(239,237,231,.4)" }}>
              <span
                style={{ color: "#c6ff3c", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Zurück zur Anmeldung
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
