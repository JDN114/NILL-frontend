import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ── Helfer ──────────────────────────────────────────────── */

const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

// Stunden dezimal → "8:30 h"
function fmtH(h) {
  if (h == null || isNaN(h)) return "–";
  const neg = h < 0;
  const abs = Math.abs(h);
  const hh = Math.floor(abs);
  const mm = Math.round((abs - hh) * 60);
  const mmFix = mm === 60 ? 0 : mm;
  const hhFix = mm === 60 ? hh + 1 : hh;
  return `${neg ? "−" : ""}${hhFix}:${String(mmFix).padStart(2, "0")} h`;
}

function fmtClock(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
  } catch {
    return iso;
  }
}

/* ── Kleine Bausteine ───────────────────────────────────── */

function Tile({ label, value, accent }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 2,
      padding: "0.7rem 0.9rem", minWidth: 110,
      background: accent ? "rgba(197,165,114,0.07)" : "rgba(var(--tint),0.03)",
      border: `1px solid ${accent ? "rgba(197,165,114,0.22)" : "var(--nill-border)"}`,
      borderRadius: 11,
    }}>
      <span style={{
        fontSize: "1.05rem", fontWeight: 800, lineHeight: 1.1,
        color: accent ? "var(--nill-gold)" : "var(--nill-text)",
      }}>{value}</span>
      <span style={{
        fontSize: "0.62rem", color: "var(--nill-text-mute)", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.06em",
      }}>{label}</span>
    </div>
  );
}

function EmployeeCard({ emp }) {
  const [open, setOpen] = useState(false);
  const otPositive = emp.overtime_hours >= 0;

  return (
    <div style={{
      border: "1px solid var(--nill-border)", borderRadius: 14,
      background: "rgba(var(--tint),0.02)", overflow: "hidden",
    }}>
      {/* Kopf */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem", padding: "1rem 1.15rem", flexWrap: "wrap",
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--nill-text)" }}>
            {emp.name}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)" }}>
            {emp.email}
            {emp.contract_type ? ` · ${emp.contract_type}` : ""}
            {` · ${emp.weekly_hours} h/Woche (Soll)`}
          </div>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
            color: "var(--nill-gold)", background: "rgba(197,165,114,0.08)",
            border: "1px solid rgba(197,165,114,0.25)", borderRadius: 8,
            padding: "0.4rem 0.8rem",
          }}
        >
          {open ? "Details ausblenden" : "Tage anzeigen"}
        </button>
      </div>

      {/* Kennzahlen */}
      <div style={{
        display: "flex", gap: "0.6rem", flexWrap: "wrap",
        padding: "0 1.15rem 1rem",
      }}>
        <Tile label="Arbeitszeit" value={fmtH(emp.worked_hours)} accent />
        <Tile label="Pausen" value={fmtH(emp.break_hours)} />
        <Tile label="Soll (Monat)" value={fmtH(emp.target_hours)} />
        <Tile
          label="Überstunden"
          value={(otPositive ? "+" : "") + fmtH(emp.overtime_hours).replace("−", "-")}
        />
        <Tile label="Urlaub" value={`${emp.vacation_days} T`} />
        <Tile label="Urlaubsstunden" value={fmtH(emp.vacation_hours)} />
      </div>

      {/* Detail-Tabelle */}
      {open && (
        <div style={{ padding: "0 1.15rem 1.15rem" }}>
          {emp.days.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--nill-text-dim)", margin: "0.4rem 0" }}>
              Keine Stempelzeiten in diesem Monat.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: 520 }}>
                <thead>
                  <tr style={{ color: "var(--nill-text-mute)", textAlign: "left" }}>
                    {["Datum", "Tag", "Einstempeln", "Ausstempeln", "Pause", "Arbeitszeit"].map((h) => (
                      <th key={h} style={{
                        padding: "0.4rem 0.5rem", fontWeight: 600, fontSize: "0.64rem",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        borderBottom: "1px solid var(--nill-border)",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {emp.days.map((day) =>
                    day.segments.map((s, i) => (
                      <tr key={`${day.date}-${i}`} style={{ borderBottom: "1px solid rgba(var(--tint),0.05)" }}>
                        <td style={{ padding: "0.4rem 0.5rem", color: "var(--nill-text)" }}>
                          {i === 0 ? fmtDate(day.date) : ""}
                        </td>
                        <td style={{ padding: "0.4rem 0.5rem", color: "var(--nill-text-dim)" }}>
                          {i === 0 ? day.weekday : ""}
                        </td>
                        <td style={{ padding: "0.4rem 0.5rem", color: "var(--nill-text)" }}>
                          {fmtClock(s.clock_in)}
                        </td>
                        <td style={{ padding: "0.4rem 0.5rem", color: "var(--nill-text)" }}>
                          {s.open
                            ? <span style={{ color: "var(--nill-gold)" }}>läuft…</span>
                            : fmtClock(s.clock_out)}
                        </td>
                        <td style={{ padding: "0.4rem 0.5rem", color: "var(--nill-text-dim)" }}>
                          {s.break > 0 ? fmtH(s.break) : "—"}
                        </td>
                        <td style={{ padding: "0.4rem 0.5rem", color: "var(--nill-text)", fontWeight: 600 }}>
                          {i === 0 && day.segments.length > 1
                            ? `${fmtH(s.net)} (Σ ${fmtH(day.worked)})`
                            : fmtH(s.net)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Abwesenheiten */}
          {emp.absences.length > 0 && (
            <div style={{ marginTop: "0.9rem" }}>
              <div style={{
                fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.06em", color: "var(--nill-text-mute)", marginBottom: "0.4rem",
              }}>
                Abwesenheiten im Monat
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {emp.absences.map((a, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    fontSize: "0.78rem", color: "var(--nill-text-dim)",
                  }}>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 700, padding: "1px 7px", borderRadius: 8,
                      background: a.type === "Urlaub" ? "rgba(197,165,114,0.14)" : "rgba(59,130,246,0.14)",
                      color: a.type === "Urlaub" ? "var(--nill-gold)" : "#93c5fd",
                    }}>
                      {a.type}
                    </span>
                    {new Date(a.start_date).toLocaleDateString("de-DE")} – {new Date(a.end_date).toLocaleDateString("de-DE")}
                    <span style={{ color: "var(--nill-text-mute)" }}>· {a.days_in_month} Werktag(e) im Monat</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Haupt-Content ──────────────────────────────────────── */

export function StundenlisteContent() {
  const { isCompanyAdmin } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin?.());

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");

  async function load() {
    setLoading(true); setError("");
    try {
      const res = await api.get("/hr/timesheet", { params: { year, month } });
      setData(res.data);
    } catch (e) {
      setError(e?.response?.data?.detail || "Stundenliste konnte nicht geladen werden.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (isAdmin) load(); /* eslint-disable-next-line */ }, [year, month, isAdmin]);

  function shiftMonth(delta) {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setMonth(m); setYear(y);
  }

  const employees = useMemo(() => {
    const list = data?.employees ?? [];
    return selectedUser === "all" ? list : list.filter((e) => e.user_id === selectedUser);
  }, [data, selectedUser]);

  if (!isAdmin) {
    return (
      <p style={{ fontSize: "0.85rem", color: "var(--nill-text-dim)" }}>
        Die Stundenliste ist nur für Administratoren verfügbar.
      </p>
    );
  }

  const selectStyle = {
    background: "var(--nill-surface)", border: "1px solid var(--nill-border)",
    borderRadius: 8, color: "var(--nill-text)", fontSize: "0.82rem",
    padding: "0.45rem 0.7rem", cursor: "pointer", outline: "none",
  };
  const navBtn = {
    background: "rgba(var(--tint),0.04)", border: "1px solid var(--nill-border)",
    borderRadius: 8, color: "var(--nill-text)", cursor: "pointer",
    width: 34, height: 34, fontSize: "1rem", lineHeight: 1,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      {/* GoBD-Hinweis */}
      <div style={{
        display: "flex", gap: "0.6rem", alignItems: "flex-start",
        padding: "0.8rem 1rem",
        background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.22)",
        borderRadius: 11, fontSize: "0.78rem", color: "var(--nill-text-dim)",
      }}>
        <span aria-hidden="true" style={{ fontSize: "1rem", lineHeight: 1 }}>ℹ️</span>
        <span>
          <strong style={{ color: "var(--nill-text)" }}>Keine GoBD-konforme Buchhaltung.</strong>{" "}
          Diese Stundenliste ist eine reine Übersicht über Arbeits-, Über- und
          Urlaubsstunden auf Basis der Stempelzeiten und keine rechtsverbindliche
          Arbeitszeit- oder Lohndokumentation.
        </span>
      </div>

      {/* Steuerung */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        <button style={navBtn} onClick={() => shiftMonth(-1)} aria-label="Vorheriger Monat">‹</button>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <select style={selectStyle} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select style={selectStyle} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 6 }, (_, i) => today.getFullYear() - 3 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button style={navBtn} onClick={() => shiftMonth(1)} aria-label="Nächster Monat">›</button>

        <div style={{ flex: 1 }} />

        <select
          style={selectStyle}
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="all">Alle Mitarbeiter</option>
          {(data?.employees ?? []).map((e) => (
            <option key={e.user_id} value={e.user_id}>{e.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{
          padding: "0.7rem 1rem", background: "rgba(248,113,113,0.06)",
          border: "1px solid rgba(248,113,113,0.22)", borderRadius: 10,
          color: "#f87171", fontSize: "0.8rem",
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>Lade Stundenliste…</p>
      ) : employees.length === 0 ? (
        <p style={{ fontSize: "0.82rem", color: "var(--nill-text-dim)" }}>
          Keine Mitarbeiter oder keine Daten für {MONTHS[month - 1]} {year}.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {employees.map((emp) => <EmployeeCard key={emp.user_id} emp={emp} />)}
        </div>
      )}
    </div>
  );
}

export default StundenlisteContent;
