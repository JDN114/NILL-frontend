import { useEffect, useState, useCallback, useRef } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import QrScannerStation from "../../components/QrScannerStation";
import api from "../../services/api";

const ACCENT       = "#ff4d8d";
const ACCENT_OUT   = "#38f5d0";
const DISPLAY_MS   = 60_000; // 60 seconds before auto-return

// ── Helpers ───────────────────────────────────────────────────────────────────

function padZ(n) { return String(n).padStart(2, "0"); }

function msToHm(ms) {
  const totalMin = Math.floor(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${padZ(m)}m`;
}

function decimalToHm(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${padZ(m)}m`;
}

function fmtTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
}

function fmtHmLive(clockInIso, now) {
  const start = new Date(clockInIso).getTime();
  return msToHm(now - start);
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{
      width: 22, height: 22,
      border: "2.5px solid rgba(255,255,255,0.08)",
      borderTopColor: ACCENT,
      borderRadius: "50%",
      animation: "as-spin 0.75s linear infinite",
    }} />
  );
}

// ── Countdown ring ────────────────────────────────────────────────────────────

function CountdownRing({ remainingMs, totalMs, onBack }) {
  const pct  = Math.max(0, remainingMs / totalMs);
  const r    = 22;
  const circ = 2 * Math.PI * r;
  const sec  = Math.ceil(remainingMs / 1000);
  return (
    <button
      onClick={onBack}
      title="Zurück zum Scanner"
      style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      }}
    >
      <svg width={54} height={54} viewBox="0 0 54 54">
        <circle cx={27} cy={27} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
        <circle
          cx={27} cy={27} r={r} fill="none"
          stroke="rgba(239,237,231,0.35)"
          strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 27 27)"
          style={{ transition: "stroke-dashoffset 0.5s linear" }}
        />
        <text x={27} y={32} textAnchor="middle"
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fill: "rgba(239,237,231,0.5)", fontWeight: 700 }}>
          {sec}
        </text>
      </svg>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.55rem",
        letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(239,237,231,0.3)" }}>
        Zurück
      </span>
    </button>
  );
}

// ── ResultScreen ──────────────────────────────────────────────────────────────

function ResultScreen({ result, onBack }) {
  const [now, setNow]           = useState(Date.now());
  const [remainingMs, setRemaining] = useState(DISPLAY_MS);
  const startTs = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - startTs.current;
      const rem = Math.max(0, DISPLAY_MS - elapsed);
      setNow(Date.now());
      setRemaining(rem);
      if (rem <= 0) onBack();
    }, 500);
    return () => clearInterval(id);
  }, [onBack]);

  const isIn    = result.action === "in";
  const entry   = result.entry;
  const emp     = result.employee;
  const monthly = result.monthly_entries ?? [];
  const monthlyHours = result.monthly_hours ?? 0;
  const color   = isIn ? ACCENT : ACCENT_OUT;

  const clockInMs = isIn && entry?.clock_in
    ? new Date(entry.clock_in).getTime() : null;

  // Current month label
  const monthLabel = new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100%", padding: "clamp(16px, 3vw, 32px)",
      gap: "clamp(12px, 2vw, 20px)",
      overflow: "hidden",
    }}>

      {/* ── Top row: status + countdown ───────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>

        {/* Action badge + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
            background: `${color}18`,
            border: `2px solid ${color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", color,
          }}>✓</div>
          <div>
            <div style={{
              fontFamily: "'Fraunces',Georgia,serif",
              fontSize: "clamp(1.3rem,2.5vw,1.9rem)", fontWeight: 400,
              color: "#efede7", letterSpacing: "-0.02em", lineHeight: 1.1,
            }}>
              {isIn ? "Eingestempelt" : "Ausgestempelt"}
            </div>
            <div style={{
              fontSize: "clamp(0.75rem,1.2vw,0.9rem)", color: "rgba(239,237,231,0.55)",
              fontFamily: "'Inter',system-ui,sans-serif", marginTop: 3,
            }}>
              {emp?.name} · {fmtTime(new Date().toISOString())} Uhr
            </div>
          </div>
        </div>

        <CountdownRing remainingMs={remainingMs} totalMs={DISPLAY_MS} onBack={onBack} />
      </div>

      {/* ── Live timers (clock-in only) ─────────────────────────────────── */}
      {isIn && clockInMs && (
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}>
          {/* Eingestempelt seit */}
          <div style={{
            padding: "12px 16px", borderRadius: 12,
            background: "rgba(255,77,141,0.07)",
            border: `1px solid ${ACCENT}28`,
          }}>
            <div style={{
              fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(239,237,231,0.4)", fontFamily: "'JetBrains Mono',monospace",
              marginBottom: 4,
            }}>Eingestempelt seit</div>
            <div style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: "clamp(1rem,2vw,1.35rem)", fontWeight: 700,
              color: ACCENT, letterSpacing: "0.04em",
              fontVariantNumeric: "tabular-nums",
            }}>
              {fmtTime(entry.clock_in)} Uhr
            </div>
          </div>

          {/* Arbeitszeit dieser Sitzung */}
          <div style={{
            padding: "12px 16px", borderRadius: 12,
            background: "rgba(255,77,141,0.07)",
            border: `1px solid ${ACCENT}28`,
          }}>
            <div style={{
              fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(239,237,231,0.4)", fontFamily: "'JetBrains Mono',monospace",
              marginBottom: 4,
            }}>Arbeitszeit heute</div>
            <div style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: "clamp(1rem,2vw,1.35rem)", fontWeight: 700,
              color: ACCENT, letterSpacing: "0.04em",
              fontVariantNumeric: "tabular-nums",
            }}>
              {fmtHmLive(entry.clock_in, now)}
            </div>
          </div>
        </div>
      )}

      {/* ── Monthly summary ──────────────────────────────────────────────── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: "flex", flexDirection: "column",
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(239,237,231,0.4)",
          }}>
            {monthLabel}
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem",
            fontWeight: 700, color: "rgba(239,237,231,0.7)",
          }}>
            Gesamt: <span style={{ color: "#efede7" }}>{decimalToHm(monthlyHours)}</span>
          </div>
        </div>

        {/* Entry list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
          {monthly.length === 0 ? (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "100%", padding: "1rem",
              fontFamily: "'Inter',system-ui,sans-serif",
              fontSize: "0.8rem", color: "rgba(239,237,231,0.3)",
            }}>
              Noch keine Einträge diesen Monat
            </div>
          ) : (
            monthly.map((e, i) => {
              const isActive = !e.clock_out;
              const dur = isActive
                ? msToHm(now - new Date(e.clock_in).getTime())
                : decimalToHm(e.hours);
              return (
                <div key={e.id ?? i} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "4px 12px",
                  padding: "7px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  alignItems: "center",
                  background: isActive ? "rgba(255,77,141,0.05)" : "transparent",
                }}>
                  {/* Date */}
                  <div style={{
                    fontFamily: "'Inter',system-ui,sans-serif",
                    fontSize: "0.78rem", color: "rgba(239,237,231,0.65)",
                  }}>
                    {fmtDate(e.clock_in)}
                    {isActive && (
                      <span style={{
                        marginLeft: 6, fontSize: "0.6rem",
                        color: ACCENT, fontFamily: "'JetBrains Mono',monospace",
                        letterSpacing: "0.08em",
                      }}>● AKTIV</span>
                    )}
                  </div>

                  {/* In → Out */}
                  <div style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "0.72rem", color: "rgba(239,237,231,0.45)",
                    whiteSpace: "nowrap",
                  }}>
                    {fmtTime(e.clock_in)} → {isActive ? "läuft" : fmtTime(e.clock_out)}
                  </div>

                  {/* Duration */}
                  <div style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "0.75rem", fontWeight: 600,
                    color: isActive ? ACCENT : "rgba(239,237,231,0.7)",
                    whiteSpace: "nowrap", textAlign: "right",
                    minWidth: 52,
                  }}>
                    {dur}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}

// ── ScanScreen ────────────────────────────────────────────────────────────────

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
          fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(239,237,231,0.35)", marginBottom: 10,
        }}>
          Zeiterfassung
        </div>
        <div style={{
          fontFamily: "'Fraunces',Georgia,serif",
          fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400,
          color: "#efede7", letterSpacing: "-0.02em",
        }}>
          {loading ? "Prüfe Ausweis…" : "Ausweis scannen"}
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
        <QrScannerStation
          onScan={handleScan}
          accent={ACCENT}
          label="Mitarbeiterausweis vor die Kamera halten"
          disabled={loading}
        />
        {loading && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 12,
            background: "rgba(4,4,15,0.6)",
            borderRadius: 20,
          }}>
            <Spinner />
            <span style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: "0.65rem", letterSpacing: "0.15em",
              color: "rgba(239,237,231,0.5)", textTransform: "uppercase",
            }}>
              Prüfe Ausweis…
            </span>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          padding: "0.5rem 1.2rem", borderRadius: 8,
          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
          color: "#f87171", fontSize: "0.82rem",
          fontFamily: "'Inter',system-ui,sans-serif",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

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
