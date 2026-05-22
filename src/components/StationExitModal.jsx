// src/components/StationExitModal.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const overlay = {
  position: "fixed", inset: 0, zIndex: 9999,
  background: "rgba(4,7,15,0.88)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "1rem",
};

const card = {
  background: "rgba(15,18,28,0.98)",
  border: "1px solid rgba(239,237,231,0.1)",
  borderRadius: 20,
  padding: "2rem 2.25rem",
  width: "100%",
  maxWidth: 400,
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
  fontFamily: "'Inter', system-ui, sans-serif",
};

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.9rem",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  color: "#efede7",
  fontSize: "0.95rem",
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: "0.1em",
  outline: "none",
  boxSizing: "border-box",
};

const btnPrimary = {
  width: "100%",
  padding: "0.7rem",
  background: "#c5a572",
  border: "none",
  borderRadius: 10,
  color: "#000",
  fontWeight: 700,
  fontSize: "0.9rem",
  cursor: "pointer",
};

const btnGhost = {
  background: "none",
  border: "none",
  color: "rgba(239,237,231,0.45)",
  fontSize: "0.8rem",
  cursor: "pointer",
  padding: "0.3rem 0",
  textDecoration: "underline",
  textUnderlineOffset: 3,
};

export default function StationExitModal({ onClose, hasPassword }) {
  const navigate = useNavigate();
  // Kein freier Exit ohne Passwort — kein Passwort gesetzt → OTP-Flow
  const [mode, setMode] = useState(hasPassword ? "password" : "otp");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const exit = () => navigate("/dashboard");

  // Kein Passwort gesetzt → OTP sofort beim Öffnen anfordern
  useEffect(() => {
    if (!hasPassword) {
      handleRequestOtp();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePassword = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true); setError("");
    try {
      await api.post("/auth/station/verify-exit-password", { password });
      exit();
    } catch (err) {
      setError(err?.response?.data?.detail ?? "Falsches Passwort.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setLoading(true); setError("");
    try {
      const r = await api.post("/auth/station/request-exit-reset");
      setAdminEmail(r.data.admin_email ?? "");
      setMode("otp");
    } catch (err) {
      setError(err?.response?.data?.detail ?? "Fehler beim Senden des Codes.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true); setError("");
    try {
      await api.post("/auth/station/verify-exit-reset", { code: otp });
      exit();
    } catch (err) {
      setError(err?.response?.data?.detail ?? "Ungültiger oder abgelaufener Code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={card}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(239,237,231,0.35)",
            marginBottom: 6,
          }}>
            ArbeitsStation
          </div>
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "1.4rem",
            fontWeight: 400,
            color: "#efede7",
            letterSpacing: "-0.02em",
          }}>
            {mode === "otp" ? "Einmal-Code eingeben" : "Station verlassen?"}
          </div>
        </div>

        {/* ── Password mode ── */}
        {mode === "password" && (
          <form onSubmit={handlePassword} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(239,237,231,0.5)", lineHeight: 1.55 }}>
              Bitte gib das Stations-Passwort ein, um den Kiosk-Modus zu beenden.
            </p>
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              autoFocus
            />
            {error && <div style={{ fontSize: "0.78rem", color: "#f87171" }}>{error}</div>}
            <button type="submit" disabled={loading || !password} style={{ ...btnPrimary, opacity: loading || !password ? 0.6 : 1 }}>
              {loading ? "Prüfen…" : "Bestätigen"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" style={btnGhost} onClick={handleRequestOtp} disabled={loading}>
                Passwort vergessen?
              </button>
              <button type="button" style={btnGhost} onClick={onClose}>
                Abbrechen
              </button>
            </div>
          </form>
        )}

        {/* ── OTP mode (auch wenn kein Passwort gesetzt) ── */}
        {mode === "otp" && (
          <form onSubmit={handleOtp} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {loading && !adminEmail ? (
              <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(239,237,231,0.5)", lineHeight: 1.55 }}>
                Code wird gesendet…
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(239,237,231,0.5)", lineHeight: 1.55 }}>
                Ein 6-stelliger Code wurde an{adminEmail ? <> <strong style={{ color: "#efede7" }}>{adminEmail}</strong></> : " den Admin"} gesendet. Der Code ist 15 Minuten gültig.
              </p>
            )}
            <input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              style={{ ...inputStyle, textAlign: "center", fontSize: "1.6rem", letterSpacing: "0.4em" }}
              autoFocus
              disabled={loading && !adminEmail}
            />
            {error && <div style={{ fontSize: "0.78rem", color: "#f87171" }}>{error}</div>}
            <button type="submit" disabled={loading || otp.length < 6} style={{ ...btnPrimary, opacity: loading || otp.length < 6 ? 0.6 : 1 }}>
              {loading ? "Prüfen…" : "Code bestätigen"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {hasPassword ? (
                <button type="button" style={btnGhost} onClick={() => { setMode("password"); setError(""); setOtp(""); }}>
                  ← Zurück
                </button>
              ) : (
                <button type="button" style={btnGhost} onClick={handleRequestOtp} disabled={loading}>
                  Code erneut senden
                </button>
              )}
              <button type="button" style={btnGhost} onClick={onClose}>
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
