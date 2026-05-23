import { useEffect, useState, useCallback } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import QrScannerStation from "../../components/QrScannerStation";
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

// ── QR-Scan-Ansicht ───────────────────────────────────────────────────────────
function ScanScreen({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleScan = useCallback(async (qr_payload) => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const r = await api.post("/workflow/time/station-qr", { qr_payload, action: "auto" });
      onResult(r.data);
    } catch (err) {
      setError(err?.response?.data?.detail ?? "Ausweis nicht erkannt");
    } finally {
      setLoading(false);
    }
  }, [loading, onResult]);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 28,
      paddingTop: "clamp(24px, 5vw, 48px)",
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
          {loading ? "Prüfe Ausweis…" : "Ausweis scannen"}
        </div>
      </div>

      {loading ? (
        <div style={{
          width: 320, height: 160,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Spinner />
        </div>
      ) : (
        <QrScannerStation
          onScan={handleScan}
          accent={ACCENT}
          label="Mitarbeiterausweis vor die Kamera halten"
        />
      )}

      {error && (
        <div style={{
          padding: "0.5rem 1.2rem", borderRadius: 8,
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
          color: "#f87171", fontSize: "0.82rem",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

// ── Ergebnis-Ansicht ──────────────────────────────────────────────────────────
function ResultScreen({ result, onBack }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(onBack, 5000);
    return () => clearTimeout(t);
  }, [onBack]);

  const isIn   = result.action === "in";
  const entry  = result.entry;
  const emp    = result.employee;
  const startMs = isIn && entry?.clock_in ? new Date(entry.clock_in).getTime() : null;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 24,
      paddingTop: "clamp(40px, 8vw, 72px)", textAlign: "center",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: isIn ? "rgba(255,77,141,0.12)" : "rgba(56,245,208,0.1)",
        border: `2px solid ${isIn ? ACCENT : "#38f5d0"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2rem", color: isIn ? ACCENT : "#38f5d0",
      }}>✓</div>

      <div>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 400,
          color: "#efede7", letterSpacing: "-0.02em", marginBottom: 8,
        }}>
          {isIn ? "Eingestempelt" : "Ausgestempelt"}
        </div>
        <div style={{
          fontSize: "0.85rem", color: "rgba(239,237,231,0.5)",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {emp?.name} · {new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
        </div>
        {isIn && emp?.nill_number && (
          <div style={{
            marginTop: 6, fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem", letterSpacing: "0.12em",
            color: "rgba(239,237,231,0.25)",
          }}>
            {emp.nill_number}
          </div>
        )}
      </div>

      {isIn && startMs && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700,
          color: ACCENT, letterSpacing: "0.04em", lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}>
          {formatHM(now - startMs)}
        </div>
      )}

      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
        letterSpacing: "0.15em", color: "rgba(239,237,231,0.2)", marginTop: 8,
      }}>
        Weiterleitung in 5 Sekunden…
      </div>
    </div>
  );
}

// ── Seite ─────────────────────────────────────────────────────────────────────
export default function ArbeitsStationZeit() {
  const [result, setResult] = useState(null);

  return (
    <ArbeitsStationLayout title="Zeiterfassung" icon="⏱" accent={ACCENT}>
      <style>{`
        @keyframes as-spin { to { transform: rotate(360deg); } }
      `}</style>

      {result
        ? <ResultScreen result={result} onBack={() => setResult(null)} />
        : <ScanScreen   onResult={setResult} />
      }
    </ArbeitsStationLayout>
  );
}
