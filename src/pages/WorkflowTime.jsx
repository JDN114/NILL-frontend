import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { format, startOfMonth, endOfMonth } from "date-fns";

/* ── Hilfsfunktionen ────────────────────────────────────── */
const formatHM = (ms) => {
  const totalMin = Math.floor(ms / 1000 / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
};
const formatDecimal = (ms) => (ms / 1000 / 60 / 60).toFixed(2);

/* ── kleine Panel-Komponente ───────────────────────────── */
function Panel({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid var(--nill-border)",
      borderRadius: 14,
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

function PanelHeader({ title }) {
  return (
    <div style={{
      padding: "0.75rem 1.25rem",
      borderBottom: "1px solid var(--nill-border)",
      fontSize: "0.68rem", fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.09em",
      color: "var(--nill-text-mute)",
    }}>
      {title}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 18, height: 18,
      border: "2px solid rgba(255,255,255,0.08)",
      borderTopColor: "var(--nill-gold)",
      borderRadius: "50%",
      animation: "em-spin 0.75s linear infinite",
      flexShrink: 0,
    }} />
  );
}

/* ── Haupt-Seite ────────────────────────────────────────── */
export default function WorkflowTimePage() {
  const { isCompanyAdmin, isSolo, org } = useAuth();
  const isAdmin = isCompanyAdmin || isSolo;

  const [entries, setEntries]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(false);
  const [selectedMonth, setSelectedMonth]   = useState(new Date());
  const [activeEntry, setActiveEntry]       = useState(null);
  const [now, setNow]                       = useState(Date.now());
  const [actionLoading, setActionLoading]   = useState(false);
  const [autoHours, setAutoHours]           = useState(10);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved]   = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { fetchTimeEntries(); fetchActive(); }, [selectedMonth]);
  useEffect(() => { if (org?.auto_clockout_hours) setAutoHours(org.auto_clockout_hours); }, [org]);

  async function fetchActive() {
    try {
      const res = await api.get("/workflow/time/active");
      setActiveEntry(res.data?.clock_in ? res.data : null);
    } catch (e) { console.error(e); }
  }

  async function fetchTimeEntries() {
    setLoading(true);
    try {
      const res = await api.get("/workflow/time", {
        params: {
          start: format(startOfMonth(selectedMonth), "yyyy-MM-dd"),
          end:   format(endOfMonth(selectedMonth),   "yyyy-MM-dd"),
        },
      });
      setEntries(res.data?.items || res.data?.entries || []);
      setError(false);
    } catch (err) {
      console.error(err);
      setEntries([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function clockIn() {
    setActionLoading(true);
    try { setActiveEntry((await api.post("/workflow/time/clock-in")).data); }
    catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  }

  async function clockOut() {
    setActionLoading(true);
    try { await api.post("/workflow/time/clock-out"); setActiveEntry(null); fetchTimeEntries(); }
    catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  }

  async function saveSettings() {
    setSavingSettings(true);
    try {
      await api.post("/workflow/time/settings", { auto_clockout_hours: autoHours });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (e) { console.error(e); }
    finally { setSavingSettings(false); }
  }

  const startTime  = activeEntry?.clock_in ? new Date(activeEntry.clock_in).getTime() : null;
  const workedMs   = startTime ? now - startTime : 0;
  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0);

  const handleMonthChange = (delta) => {
    const d = new Date(selectedMonth);
    d.setMonth(d.getMonth() + delta);
    setSelectedMonth(d);
  };

  return (
    <PageLayout>

      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ marginBottom: "1.75rem" }}>
        <span style={{
          fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--nill-text-dim)",
        }}>
          Betrieb / Zeiterfassung
        </span>
        <h1 style={{
          fontSize: "1.85rem", fontWeight: 800, margin: "0.25rem 0 0",
          color: "var(--nill-text)", letterSpacing: "-0.01em", lineHeight: 1.15,
        }}>
          Zeiterfassung
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 680 }}>

        {/* ── Clock Card ──────────────────────────────────── */}
        <Panel style={{
          border: activeEntry
            ? "1px solid rgba(134,239,172,0.2)"
            : "1px solid var(--nill-border)",
          background: activeEntry
            ? "rgba(134,239,172,0.04)"
            : "rgba(255,255,255,0.025)",
        }}>
          <div style={{ padding: "1.25rem 1.5rem" }}>
            {activeEntry ? (
              <>
                {/* Status */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  marginBottom: "1rem",
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#86efac",
                    boxShadow: "0 0 7px rgba(134,239,172,0.8)",
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#86efac" }}>
                    Eingestempelt
                  </span>
                </div>

                {/* Timer */}
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{
                    fontSize: "2.25rem", fontWeight: 800, margin: 0,
                    color: "var(--nill-text)", fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.02em", lineHeight: 1,
                  }}>
                    {formatHM(workedMs)}
                  </p>
                  <p style={{ fontSize: "0.73rem", color: "var(--nill-text-mute)", margin: "0.35rem 0 0" }}>
                    seit {new Date(activeEntry.clock_in).toLocaleString("de-DE")}
                    <span style={{ marginLeft: "0.75rem", color: "var(--nill-text-dim)" }}>
                      ({formatDecimal(workedMs)} h)
                    </span>
                  </p>
                </div>

                <button
                  onClick={clockOut}
                  disabled={actionLoading}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.45rem",
                    padding: "0.55rem 1.2rem",
                    background: "rgba(248,113,113,0.1)",
                    border: "1px solid rgba(248,113,113,0.25)",
                    borderRadius: 9, cursor: "pointer",
                    color: "#f87171", fontSize: "0.8rem", fontWeight: 600,
                    transition: "background 0.15s, border-color 0.15s",
                    opacity: actionLoading ? 0.5 : 1,
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "rgba(248,113,113,0.18)";
                    e.currentTarget.style.borderColor = "rgba(248,113,113,0.45)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "rgba(248,113,113,0.1)";
                    e.currentTarget.style.borderColor = "rgba(248,113,113,0.25)";
                  }}
                >
                  {actionLoading ? <Spinner /> : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="6" width="12" height="12" rx="1"/>
                    </svg>
                  )}
                  Ausstempeln
                </button>
              </>
            ) : (
              <>
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  marginBottom: "1rem",
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "var(--nill-text-dim)", flexShrink: 0,
                  }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--nill-text-mute)" }}>
                    Nicht eingestempelt
                  </span>
                </div>

                <button
                  onClick={clockIn}
                  disabled={actionLoading}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.45rem",
                    padding: "0.55rem 1.2rem",
                    background: "var(--nill-gold-dim)",
                    border: "1px solid rgba(197,165,114,0.28)",
                    borderRadius: 9, cursor: "pointer",
                    color: "var(--nill-gold)", fontSize: "0.8rem", fontWeight: 600,
                    transition: "background 0.15s, border-color 0.15s",
                    opacity: actionLoading ? 0.5 : 1,
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "var(--nill-gold-glow)";
                    e.currentTarget.style.borderColor = "rgba(197,165,114,0.5)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "var(--nill-gold-dim)";
                    e.currentTarget.style.borderColor = "rgba(197,165,114,0.28)";
                  }}
                >
                  {actionLoading ? <Spinner /> : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  )}
                  Einstempeln
                </button>
              </>
            )}
          </div>
        </Panel>

        {/* ── Admin: Auto-Clockout ─────────────────────────── */}
        {isAdmin && (
          <Panel>
            <PanelHeader title="Auto-Ausstempeln — Admin" />
            <div style={{ padding: "1rem 1.25rem" }}>
              <p style={{ fontSize: "0.78rem", color: "var(--nill-text-mute)", margin: "0 0 0.85rem", lineHeight: 1.5 }}>
                Mitarbeiter werden automatisch ausgestempelt, wenn sie es vergessen.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--nill-text-sub)" }}>Nach</span>
                <input
                  type="number" min="1" max="24" step="0.5"
                  value={autoHours}
                  onChange={e => setAutoHours(parseFloat(e.target.value))}
                  style={{
                    width: 64, padding: "0.35rem 0.65rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--nill-border)",
                    borderRadius: 8, color: "var(--nill-text)",
                    fontSize: "0.82rem", textAlign: "center", outline: "none",
                  }}
                />
                <span style={{ fontSize: "0.8rem", color: "var(--nill-text-sub)" }}>
                  Stunden automatisch ausstempeln
                </span>
                <button
                  onClick={saveSettings}
                  disabled={savingSettings}
                  style={{
                    padding: "0.4rem 1rem",
                    background: settingsSaved ? "rgba(134,239,172,0.1)" : "var(--nill-gold-dim)",
                    border: `1px solid ${settingsSaved ? "rgba(134,239,172,0.25)" : "rgba(197,165,114,0.28)"}`,
                    borderRadius: 8, cursor: "pointer",
                    color: settingsSaved ? "#86efac" : "var(--nill-gold)",
                    fontSize: "0.78rem", fontWeight: 600,
                    opacity: savingSettings ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  {savingSettings ? "…" : settingsSaved ? "✓ Gespeichert" : "Speichern"}
                </button>
              </div>
            </div>
          </Panel>
        )}

        {/* ── Monats-Navigation ───────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={() => handleMonthChange(-1)}
              style={{
                padding: "0.4rem 0.75rem",
                background: "var(--nill-panel)", border: "1px solid var(--nill-border)",
                borderRadius: 8, color: "var(--nill-text-sub)",
                fontSize: "0.8rem", cursor: "pointer",
                transition: "background 0.12s, color 0.12s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "var(--nill-panel-hov)"; e.currentTarget.style.color = "var(--nill-text)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "var(--nill-panel)"; e.currentTarget.style.color = "var(--nill-text-sub)"; }}
            >
              ‹
            </button>

            <span style={{
              fontSize: "0.88rem", fontWeight: 700,
              color: "var(--nill-text)", minWidth: 140, textAlign: "center",
            }}>
              {format(selectedMonth, "MMMM yyyy")}
            </span>

            <button
              onClick={() => handleMonthChange(1)}
              style={{
                padding: "0.4rem 0.75rem",
                background: "var(--nill-panel)", border: "1px solid var(--nill-border)",
                borderRadius: 8, color: "var(--nill-text-sub)",
                fontSize: "0.8rem", cursor: "pointer",
                transition: "background 0.12s, color 0.12s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "var(--nill-panel-hov)"; e.currentTarget.style.color = "var(--nill-text)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "var(--nill-panel)"; e.currentTarget.style.color = "var(--nill-text-sub)"; }}
            >
              ›
            </button>
          </div>

          {/* Gesamt-Badge */}
          <div style={{
            display: "flex", alignItems: "baseline", gap: "0.4rem",
            padding: "0.4rem 1rem",
            background: "var(--nill-gold-dim)",
            border: "1px solid rgba(197,165,114,0.2)",
            borderRadius: 22,
          }}>
            <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--nill-gold)" }}>
              {totalHours.toFixed(2)}
            </span>
            <span style={{ fontSize: "0.72rem", color: "rgba(197,165,114,0.7)", fontWeight: 600 }}>h gesamt</span>
          </div>
        </div>

        {/* ── Einträge ─────────────────────────────────────── */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "1.5rem 0", color: "var(--nill-text-mute)", fontSize: "0.8rem" }}>
            <Spinner /> Lädt…
          </div>
        )}

        {!loading && error && (
          <div style={{
            padding: "0.85rem 1.25rem",
            background: "rgba(248,113,113,0.06)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 12, color: "#f87171", fontSize: "0.82rem",
          }}>
            Fehler beim Laden der Einträge.
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <p style={{ fontSize: "0.8rem", color: "var(--nill-text-dim)", padding: "1rem 0" }}>
            Keine Einträge in diesem Monat.
          </p>
        )}

        {!loading && !error && entries.length > 0 && (
          <Panel>
            <PanelHeader title={`Einträge — ${entries.length}`} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {entries.map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.8rem 1.25rem",
                    borderBottom: i < entries.length - 1 ? "1px solid var(--nill-border)" : "none",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--nill-text)" }}>
                      {e.clock_in && format(new Date(e.clock_in), "dd.MM.yyyy")}
                    </span>
                    <span style={{ fontSize: "0.73rem", color: "var(--nill-text-mute)" }}>
                      {e.clock_in && format(new Date(e.clock_in), "HH:mm")}
                      {" – "}
                      {e.clock_out
                        ? format(new Date(e.clock_out), "HH:mm")
                        : <span style={{ color: "#86efac" }}>läuft</span>
                      }
                    </span>
                  </div>

                  <span style={{
                    fontSize: "0.85rem", fontWeight: 700,
                    color: "var(--nill-gold)",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {(e.hours || 0).toFixed(2)} h
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </PageLayout>
  );
}
