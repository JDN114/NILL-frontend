import { useEffect, useState, useCallback } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../lib/api";

const ACCENT = "#ff4d8d";

const formatHM = (ms) => {
  const h = Math.floor(ms / 1000 / 60 / 60);
  const m = Math.floor((ms / 1000 / 60) % 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
};

function Spinner() {
  return (
    <div style={{
      width: 20, height: 20,
      border: "2px solid rgba(255,255,255,0.08)",
      borderTopColor: ACCENT,
      borderRadius: "50%",
      animation: "as-spin 0.75s linear infinite",
    }} />
  );
}

// ── PIN-Eingabe ───────────────────────────────────────────────────────────────
function PinScreen({ onIdentify }) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const press = useCallback((k) => {
    if (k === "⌫") { setPin(p => p.slice(0, -1)); setError(""); }
    else if (pin.length < 6) { setPin(p => p + k); setError(""); }
  }, [pin]);

  const submit = useCallback(async (value) => {
    const p = value ?? pin;
    if (p.length < 4) return;
    setLoading(true); setError("");
    try {
      const r = await api.post("/workflow/time/station-identify", { pin: p });
      onIdentify(r.data, p);
    } catch (err) {
      setError(err?.response?.data?.detail ?? "Unbekannte PIN");
      setPin("");
    } finally {
      setLoading(false);
    }
  }, [pin, onIdentify]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      else if (e.key === "Backspace") press("⌫");
      else if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [press, submit]);

  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 32,
      paddingTop: "clamp(24px, 6vw, 64px)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(239,237,231,0.35)", marginBottom: 10,
        }}>
          Zeiterfassung
        </div>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400,
          color: "#efede7", letterSpacing: "-0.02em",
        }}>
          Bitte anmelden
        </div>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.82rem", color: "rgba(239,237,231,0.4)", marginTop: 8,
        }}>
          PIN eingeben zum Ein- oder Ausstempeln
        </div>
      </div>

      {/* PIN dots */}
      <div style={{ display: "flex", gap: 12 }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: 18, height: 18, borderRadius: "50%",
            background: i < pin.length ? ACCENT : "rgba(239,237,231,0.12)",
            border: `1.5px solid ${i < pin.length ? ACCENT : "rgba(239,237,231,0.2)"}`,
            boxShadow: i < pin.length ? `0 0 8px ${ACCENT}88` : "none",
            transition: "background 0.15s, border-color 0.15s",
          }} />
        ))}
      </div>

      {error && (
        <div style={{
          padding: "0.5rem 1.2rem", borderRadius: 8,
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
          color: "#f87171", fontSize: "0.82rem",
        }}>
          {error}
        </div>
      )}

      {/* Number pad */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12, width: "clamp(240px, 40vw, 320px)",
      }}>
        {keys.map((k, i) => k === "" ? <div key={i} /> : (
          <button
            key={i}
            onClick={() => press(k)}
            disabled={loading}
            style={{
              height: "clamp(52px, 8vw, 68px)", borderRadius: 14,
              background: k === "⌫" ? "rgba(239,237,231,0.04)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${k === "⌫" ? "rgba(239,237,231,0.08)" : "rgba(255,255,255,0.1)"}`,
              color: "#efede7",
              fontFamily: k === "⌫" ? "'JetBrains Mono', monospace" : "'Fraunces', Georgia, serif",
              fontSize: k === "⌫" ? "1.1rem" : "clamp(1.3rem, 2.5vw, 1.7rem)",
              fontWeight: 400, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s, transform 0.1s",
            }}
            onPointerDown={e => !loading && (e.currentTarget.style.transform = "scale(0.93)")}
            onPointerUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onPointerLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {k}
          </button>
        ))}
      </div>

      <button
        onClick={() => submit()}
        disabled={pin.length < 4 || loading}
        style={{
          padding: "0.7rem clamp(32px, 6vw, 56px)", borderRadius: 99,
          background: pin.length >= 4 ? ACCENT : "rgba(255,255,255,0.06)",
          border: `1px solid ${pin.length >= 4 ? ACCENT : "rgba(255,255,255,0.1)"}`,
          color: pin.length >= 4 ? "#fff" : "rgba(239,237,231,0.3)",
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(1rem, 2vw, 1.3rem)", fontWeight: 400,
          cursor: pin.length >= 4 && !loading ? "pointer" : "not-allowed",
          transition: "background 0.2s, border-color 0.2s",
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        {loading ? <Spinner /> : null}
        Anmelden
      </button>
    </div>
  );
}

// ── Einstempeln-Ansicht nach Identifikation ───────────────────────────────────
function ClockScreen({ employee, onBack }) {
  const [activeEntry, setActiveEntry] = useState(employee.active_entry);
  const [busy, setBusy]   = useState(false);
  const [done, setDone]   = useState(null);
  const [error, setError] = useState("");
  const [now, setNow]     = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-reset nach Aktion
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onBack, 4000);
    return () => clearTimeout(t);
  }, [done, onBack]);

  const isIn    = !!activeEntry?.clock_in;
  const startMs = isIn ? new Date(activeEntry.clock_in).getTime() : null;

  const doAction = async () => {
    setBusy(true); setError("");
    try {
      const r = await api.post("/workflow/time/station-clock", {
        pin: employee.pin,
        action: isIn ? "out" : "in",
      });
      setDone({ action: r.data.action });
      setActiveEntry(r.data.action === "in" ? r.data.entry : null);
    } catch (err) {
      setError(err?.response?.data?.detail ?? "Fehler beim Stempeln");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 24,
        paddingTop: "clamp(40px, 8vw, 80px)", textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: done.action === "in" ? "rgba(255,77,141,0.12)" : "rgba(56,245,208,0.1)",
          border: `2px solid ${done.action === "in" ? ACCENT : "#38f5d0"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", color: done.action === "in" ? ACCENT : "#38f5d0",
        }}>✓</div>
        <div>
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 400,
            color: "#efede7", letterSpacing: "-0.02em", marginBottom: 8,
          }}>
            {done.action === "in" ? "Eingestempelt" : "Ausgestempelt"}
          </div>
          <div style={{
            fontSize: "0.85rem", color: "rgba(239,237,231,0.45)",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            {employee.name} — {new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
          </div>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
          letterSpacing: "0.15em", color: "rgba(239,237,231,0.25)", marginTop: 8,
        }}>
          Weiterleitung in 4 Sekunden…
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 28,
      paddingTop: "clamp(24px, 5vw, 56px)",
    }}>
      {/* Name badge */}
      <div style={{
        padding: "0.5rem 1.4rem", borderRadius: 99,
        background: "rgba(197,165,114,0.1)", border: "1px solid rgba(197,165,114,0.25)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c5a572", flexShrink: 0 }} />
        <span style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.9rem", color: "#c5a572", fontWeight: 500,
        }}>
          {employee.name}
        </span>
      </div>

      {/* Clock card */}
      <div style={{
        borderRadius: 24,
        border: `1px solid ${isIn ? "rgba(255,77,141,0.3)" : "rgba(239,237,231,0.08)"}`,
        background: isIn
          ? "linear-gradient(135deg, rgba(255,77,141,0.07), rgba(255,77,141,0.02))"
          : "rgba(255,255,255,0.03)",
        padding: "clamp(28px, 5vw, 48px) clamp(24px, 5vw, 56px)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
        width: "clamp(280px, 50vw, 480px)",
        animation: isIn ? "as-glow 3s ease-in-out infinite" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 10, height: 10, borderRadius: "50%",
            background: isIn ? ACCENT : "rgba(239,237,231,0.2)",
            boxShadow: isIn ? `0 0 10px ${ACCENT}` : "none",
            animation: isIn ? "as-pulse 2s ease-in-out infinite" : "none",
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: isIn ? ACCENT : "rgba(239,237,231,0.4)",
          }}>
            {isIn ? "Eingestempelt" : "Ausgestempelt"}
          </span>
        </div>

        {isIn && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700,
              color: "#efede7", letterSpacing: "0.04em", lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}>
              {formatHM(now - startMs)}
            </div>
            <div style={{
              fontSize: "0.78rem", color: "rgba(239,237,231,0.4)", marginTop: 8,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              seit {new Date(activeEntry.clock_in).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
            </div>
          </div>
        )}

        <button
          onClick={doAction}
          disabled={busy}
          style={{
            padding: "clamp(12px, 2vw, 18px) clamp(36px, 6vw, 64px)", borderRadius: 99,
            border: `1px solid ${isIn ? "rgba(255,77,141,0.4)" : "rgba(255,255,255,0.15)"}`,
            background: isIn ? "rgba(255,77,141,0.12)" : "rgba(255,255,255,0.06)",
            color: isIn ? ACCENT : "#efede7",
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", fontWeight: 400,
            cursor: busy ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 10,
            opacity: busy ? 0.6 : 1,
            transition: "background 0.2s, transform 0.15s",
          }}
          onPointerDown={e => !busy && (e.currentTarget.style.transform = "scale(0.97)")}
          onPointerUp={e => (e.currentTarget.style.transform = "scale(1)")}
          onPointerLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          {busy ? <Spinner /> : null}
          {isIn ? "Ausstempeln" : "Einstempeln"}
        </button>
      </div>

      {error && (
        <div style={{
          fontSize: "0.82rem", color: "#f87171",
          background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 8, padding: "0.5rem 1rem",
        }}>
          {error}
        </div>
      )}

      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", padding: "0.3rem",
          color: "rgba(239,237,231,0.3)", fontSize: "0.75rem",
          cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8,
        }}
      >
        ← Abmelden
      </button>
    </div>
  );
}

// ── Seite ─────────────────────────────────────────────────────────────────────
export default function ArbeitsStationZeit() {
  const [employee, setEmployee] = useState(null);

  return (
    <ArbeitsStationLayout title="Zeiterfassung" icon="⏱" accent={ACCENT}>
      <style>{`
        @keyframes as-spin  { to { transform: rotate(360deg); } }
        @keyframes as-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes as-glow  { 0%,100%{box-shadow:0 0 24px rgba(255,77,141,.3)} 50%{box-shadow:0 0 48px rgba(255,77,141,.6)} }
      `}</style>

      {employee
        ? <ClockScreen employee={employee} onBack={() => setEmployee(null)} />
        : <PinScreen   onIdentify={(data, pin) => setEmployee({ ...data, pin })} />
      }
    </ArbeitsStationLayout>
  );
}
