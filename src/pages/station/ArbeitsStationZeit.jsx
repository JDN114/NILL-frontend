import { useEffect, useState } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../lib/api";
import { format, startOfMonth, endOfMonth } from "date-fns";

const ACCENT = "#ff4d8d";

const formatHM = (ms) => {
  const totalMin = Math.floor(ms / 1000 / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
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

export default function ArbeitsStationZeit() {
  const [activeEntry, setActiveEntry] = useState(null);
  const [entries, setEntries]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [busy, setBusy]               = useState(false);
  const [now, setNow]                 = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [activeRes, histRes] = await Promise.all([
        api.get("/workflow/time/active"),
        api.get("/workflow/time", {
          params: {
            start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
            end:   format(endOfMonth(new Date()), "yyyy-MM-dd"),
          },
        }),
      ]);
      setActiveEntry(activeRes.data?.clock_in ? activeRes.data : null);
      setEntries(histRes.data?.items || histRes.data?.entries || []);
    } catch { /* non-fatal */ }
    finally { setLoading(false); }
  }

  async function clockIn() {
    setBusy(true);
    try { setActiveEntry((await api.post("/workflow/time/clock-in")).data); }
    catch { /* non-fatal */ }
    finally { setBusy(false); }
  }

  async function clockOut() {
    setBusy(true);
    try { await api.post("/workflow/time/clock-out"); setActiveEntry(null); fetchAll(); }
    catch { /* non-fatal */ }
    finally { setBusy(false); }
  }

  const startMs   = activeEntry?.clock_in ? new Date(activeEntry.clock_in).getTime() : null;
  const workedMs  = startMs ? now - startMs : 0;
  const todayH    = entries
    .filter(e => new Date(e.clock_out || e.end_at || e.date).toDateString() === new Date().toDateString())
    .reduce((s, e) => s + (e.hours || 0), 0);
  const monthH    = entries.reduce((s, e) => s + (e.hours || 0), 0);
  const isIn      = !!activeEntry;

  return (
    <ArbeitsStationLayout title="Zeiterfassung" icon="⏱" accent={ACCENT}>
      <style>{`
        @keyframes as-spin { to { transform: rotate(360deg); } }
        @keyframes as-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes as-glow  { 0%,100%{box-shadow:0 0 24px rgba(255,77,141,.3)} 50%{box-shadow:0 0 48px rgba(255,77,141,.6)} }
      `}</style>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <Spinner />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── Main clock card ── */}
          <div style={{
            borderRadius: 24,
            border: `1px solid ${isIn ? "rgba(255,77,141,0.3)" : "rgba(239,237,231,0.08)"}`,
            background: isIn
              ? "linear-gradient(135deg, rgba(255,77,141,0.07), rgba(255,77,141,0.02))"
              : "rgba(255,255,255,0.03)",
            padding: "clamp(28px, 5vw, 56px) clamp(24px, 5vw, 56px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            animation: isIn ? "as-glow 3s ease-in-out infinite" : "none",
          }}>
            {/* Status indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 10, height: 10, borderRadius: "50%",
                background: isIn ? ACCENT : "rgba(239,237,231,0.2)",
                boxShadow: isIn ? `0 0 10px ${ACCENT}` : "none",
                animation: isIn ? "as-pulse 2s ease-in-out infinite" : "none",
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: isIn ? ACCENT : "rgba(239,237,231,0.4)",
              }}>
                {isIn ? "Eingestempelt" : "Ausgestempelt"}
              </span>
            </div>

            {/* Timer display */}
            {isIn && (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "clamp(2.5rem, 7vw, 5rem)",
                  fontWeight: 700,
                  color: "#efede7",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {formatHM(workedMs)}
                </div>
                <div style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.78rem",
                  color: "rgba(239,237,231,0.4)",
                  marginTop: 8,
                }}>
                  seit {new Date(activeEntry.clock_in).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
                </div>
              </div>
            )}

            {/* Clock-in / Clock-out button */}
            <button
              onClick={isIn ? clockOut : clockIn}
              disabled={busy}
              style={{
                padding: "clamp(14px, 2.5vw, 20px) clamp(40px, 7vw, 72px)",
                borderRadius: 99,
                border: `1px solid ${isIn ? "rgba(255,77,141,0.4)" : "rgba(255,255,255,0.15)"}`,
                background: isIn
                  ? "rgba(255,77,141,0.12)"
                  : "rgba(255,255,255,0.06)",
                color: isIn ? ACCENT : "#efede7",
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                fontWeight: 400,
                cursor: busy ? "not-allowed" : "pointer",
                transition: "background 0.2s, border-color 0.2s, transform 0.15s",
                display: "flex", alignItems: "center", gap: 10,
                opacity: busy ? 0.6 : 1,
              }}
              onPointerDown={e => !busy && (e.currentTarget.style.transform = "scale(0.97)")}
              onPointerUp={e => (e.currentTarget.style.transform = "scale(1)")}
              onPointerLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              {busy ? <Spinner /> : null}
              {isIn ? "Ausstempeln" : "Einstempeln"}
            </button>
          </div>

          {/* ── Stats row ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 14,
          }}>
            {[
              { label: "Heute", value: `${todayH.toFixed(1)}h`, accent: isIn },
              { label: "Dieser Monat", value: `${monthH.toFixed(1)}h` },
              { label: "Einträge", value: entries.length },
            ].map(({ label, value, accent: a }) => (
              <div key={label} style={{
                padding: "20px 24px",
                borderRadius: 16,
                border: `1px solid ${a ? "rgba(255,77,141,0.2)" : "rgba(239,237,231,0.07)"}`,
                background: a ? "rgba(255,77,141,0.05)" : "rgba(255,255,255,0.025)",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: a ? ACCENT : "#efede7",
                  lineHeight: 1,
                }}>{value}</div>
                <div style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.72rem",
                  color: "rgba(239,237,231,0.4)",
                  marginTop: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Recent entries ── */}
          {entries.length > 0 && (
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(239,237,231,0.3)",
                marginBottom: 12,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                Letzte Einträge
                <span style={{ flex: 1, height: 1, background: "rgba(239,237,231,0.07)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {entries.slice(0, 5).map((e, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid rgba(239,237,231,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    gap: 12,
                  }}>
                    <span style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: "0.82rem",
                      color: "rgba(239,237,231,0.6)",
                    }}>
                      {new Date(e.clock_in || e.start_at || e.date).toLocaleDateString("de-DE", {
                        weekday: "short", day: "2-digit", month: "2-digit",
                      })}
                    </span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.82rem",
                      color: "#efede7",
                      fontWeight: 600,
                    }}>
                      {(e.hours || 0).toFixed(2)}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ArbeitsStationLayout>
  );
}
