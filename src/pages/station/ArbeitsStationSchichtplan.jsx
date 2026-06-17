import { useEffect, useState, useCallback } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../services/api";

const ACCENT   = "#38f5d0";
const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const ABSENCE_TYPE_COLOR = {
  "Urlaub":       { bg: "#38f5d0", label: "Urlaub" },
  "Krankheit":    { bg: "#f87171", label: "Krank" },
  "Sonderurlaub": { bg: "#a78bfa", label: "Sonder" },
  "Elternzeit":   { bg: "#fbbf24", label: "Eltern" },
};
const STATUS_STYLE = {
  approved: { color: "#86efac", border: "rgba(134,239,172,0.3)", bg: "rgba(134,239,172,0.08)", label: "Genehmigt" },
  pending:  { color: "#fbbf24", border: "rgba(251,191,36,0.3)",  bg: "rgba(251,191,36,0.08)",  label: "Ausstehend" },
  rejected: { color: "#f87171", border: "rgba(248,113,113,0.3)", bg: "rgba(248,113,113,0.08)", label: "Abgelehnt" },
};
const MONTH_LABELS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const monday = (d = new Date()) => {
  const dt = new Date(d);
  const diff = dt.getDay() === 0 ? -6 : 1 - dt.getDay();
  dt.setDate(dt.getDate() + diff); dt.setHours(0,0,0,0); return dt;
};
const addDays  = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt; };
const isoDate  = d => d instanceof Date ? d.toISOString().slice(0, 10) : d;
const fmtDay   = d => new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
const initials = name => name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
const dispName = m => m.full_name || m.email?.split("@")[0] || m.email;
const hexRgb   = hex => { const h = hex.replace("#",""); return [0,2,4].map(i => parseInt(h.slice(i,i+2),16)).join(","); };
const daysInYear = y => (new Date(y,1,29).getDate()===29) ? 366 : 365;
const dayOfYear  = d => { const s = new Date(d.getFullYear(),0,0); return Math.floor((d-s)/(1000*60*60*24)); };

function Spinner() {
  return <div style={{
    width:20, height:20,
    border:"2px solid rgba(var(--tint),0.08)",
    borderTopColor: ACCENT, borderRadius:"50%",
    animation:"as-spin 0.75s linear infinite",
  }} />;
}

function TabBar({ active, onChange }) {
  return (
    <div style={{
      display:"flex", gap:8, marginBottom:24,
      borderBottom:"1px solid rgba(var(--ink-tint),0.07)", paddingBottom:14,
    }}>
      {[
        { key:"schicht", label:"Schichtplan" },
        { key:"urlaub",  label:"Urlaubsübersicht" },
      ].map(({ key, label }) => (
        <button key={key} onClick={() => onChange(key)} style={{
          padding:"6px 18px", borderRadius:99, cursor:"pointer",
          border: active===key ? "1px solid rgba(56,245,208,0.35)" : "1px solid rgba(var(--ink-tint),0.08)",
          background: active===key ? "rgba(56,245,208,0.08)" : "rgba(var(--tint),0.03)",
          color: active===key ? ACCENT : "rgba(var(--ink-tint),0.5)",
          fontFamily:"'JetBrains Mono', monospace", fontSize:"0.72rem",
          letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.2s",
        }}>{label}</button>
      ))}
    </div>
  );
}

// ── Schichtplan-Tab (existing logic) ─────────────────────────────────────────
function SchichtplanTab() {
  const [weekStart, setWeekStart] = useState(() => monday());
  const [members,     setMembers]     = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading,     setLoading]     = useState(true);

  const weekDays  = Array.from({ length:7 }, (_,i) => addDays(weekStart, i));
  const weekLabel = `${fmtDay(weekStart)} – ${fmtDay(addDays(weekStart, 6))} ${weekStart.getFullYear()}`;
  const todayStr  = isoDate(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [mR, aR] = await Promise.all([
        api.get("/team/members"),
        api.get("/shifts/assignments", { params:{ week_start: isoDate(weekStart) } }),
      ]);
      setMembers(Array.isArray(mR.data) ? mR.data : []);
      setAssignments(aR.data?.assignments ?? []);
    } catch {}
    finally { setLoading(false); }
  }, [weekStart]);

  useEffect(() => { load(); }, [load]);

  const getShifts = (userId, dateStr) =>
    assignments.filter(a => a.user_id === userId && a.shift_date === dateStr);

  return (
    <>
      {/* Wochennavigation */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {[["‹",-7],["›",7]].map(([lbl,delta], i) => (
          <button key={i} onClick={() => setWeekStart(w => addDays(w, delta))} style={{
            width:32, height:32, borderRadius:8,
            border:"1px solid rgba(var(--ink-tint),0.1)",
            background:"rgba(var(--tint),0.04)", color:"#efede7",
            cursor:"pointer", fontSize:"1rem",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>{lbl}</button>
        ))}
        <span style={{
          fontFamily:"'JetBrains Mono', monospace", fontSize:"0.82rem",
          color:"#efede7", letterSpacing:"0.03em", minWidth:210, textAlign:"center",
        }}>{weekLabel}</span>
        <button onClick={() => setWeekStart(monday())} style={{
          padding:"0.3rem 0.8rem", borderRadius:8,
          border:"1px solid rgba(var(--ink-tint),0.08)",
          background:"rgba(var(--tint),0.03)",
          color:"rgba(var(--ink-tint),0.45)", cursor:"pointer",
          fontFamily:"'JetBrains Mono', monospace",
          fontSize:"0.68rem", letterSpacing:"0.08em", textTransform:"uppercase",
        }}>Heute</button>
      </div>

      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", paddingTop:60 }}><Spinner /></div>
      ) : members.length === 0 ? (
        <div style={{
          textAlign:"center", padding:"4rem 2rem",
          border:"1px solid rgba(var(--ink-tint),0.06)", borderRadius:20,
          background:"rgba(var(--tint),0.02)",
        }}>
          <div style={{ fontSize:"2rem", opacity:0.3, marginBottom:12 }}>⬡</div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize:"1.1rem", color:"rgba(var(--ink-tint),0.4)" }}>
            Keine Teammitglieder vorhanden
          </div>
        </div>
      ) : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:620 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(var(--ink-tint),0.08)" }}>
                <th style={{
                  padding:"0.55rem 1rem", textAlign:"left", width:160,
                  fontFamily:"'JetBrains Mono', monospace", fontSize:"0.58rem",
                  fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em",
                  color:"rgba(var(--ink-tint),0.3)",
                }}>Mitarbeiter</th>
                {weekDays.map((d, i) => {
                  const isToday = isoDate(d) === todayStr;
                  return (
                    <th key={i} style={{
                      padding:"0.5rem 0.35rem", textAlign:"center", minWidth:86,
                      fontFamily:"'JetBrains Mono', monospace", fontSize:"0.65rem", fontWeight:700,
                      color: isToday ? ACCENT : "rgba(var(--ink-tint),0.35)",
                    }}>
                      <div>{DAY_LABELS[i]}</div>
                      <div style={{ fontSize:"0.58rem", fontWeight:400, opacity:0.7 }}>{fmtDay(d)}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} style={{ borderBottom:"1px solid rgba(var(--ink-tint),0.04)" }}>
                  <td style={{ padding:"0.55rem 1rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{
                        width:30, height:30, borderRadius:"50%",
                        background:"rgba(197,165,114,0.12)", border:"1px solid rgba(197,165,114,0.25)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"0.65rem", fontWeight:800, color:"#c5a572", flexShrink:0,
                      }}>{initials(dispName(member))}</div>
                      <div>
                        <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#efede7", lineHeight:1.2 }}>
                          {dispName(member)}
                        </div>
                        {member.org_role_name && (
                          <div style={{ fontSize:"0.6rem", color:"rgba(var(--ink-tint),0.33)", marginTop:1 }}>
                            {member.org_role_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {weekDays.map((d, di) => {
                    const dateStr = isoDate(d);
                    const shifts  = getShifts(member.id, dateStr);
                    const isToday = dateStr === todayStr;
                    return (
                      <td key={di} style={{
                        padding:"0.4rem 0.3rem", textAlign:"center", verticalAlign:"middle",
                        background: isToday ? "rgba(56,245,208,0.03)" : "transparent",
                        borderLeft:  isToday ? "1px solid rgba(56,245,208,0.08)" : "none",
                        borderRight: isToday ? "1px solid rgba(56,245,208,0.08)" : "none",
                      }}>
                        <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"center" }}>
                          {shifts.length === 0 ? (
                            <span style={{ fontSize:"0.55rem", color:"rgba(var(--tint),0.07)" }}>—</span>
                          ) : shifts.map(a => (
                            <span key={a.id} style={{
                              display:"inline-flex", alignItems:"center", gap:3,
                              fontSize:"0.63rem", fontWeight:700, padding:"2px 7px", borderRadius:20,
                              background:`rgba(${hexRgb(a.color||"#c5a572")},0.15)`,
                              border:`1px solid rgba(${hexRgb(a.color||"#c5a572")},0.3)`,
                              color: a.color||"#c5a572", whiteSpace:"nowrap",
                              fontFamily:"'JetBrains Mono', monospace",
                            }}>
                              {a.template_name || "Schicht"}
                              {a.start_time && (
                                <span style={{ fontWeight:400, opacity:0.7, fontSize:"0.56rem" }}>
                                  {" "}{a.start_time}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── Urlaubsübersicht-Tab ──────────────────────────────────────────────────────
function UrlaubsTab() {
  const [year, setYear]         = useState(new Date().getFullYear());
  const [typeFilter, setType]   = useState("all");
  const [absences, setAbsences] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [aR, eR] = await Promise.all([
        api.get("/hr/absences", { params: { year, limit: 500 } }),
        api.get("/hr/employees"),
      ]);
      setAbsences(aR.data?.items || []);
      setEmployees(eR.data?.employees || []);
    } catch { setAbsences([]); setEmployees([]); }
    finally { setLoading(false); }
  }, [year]);

  useEffect(() => { load(); }, [load]);

  // Jahres-Zeitachse: Tages-Offset + Breite für jeden Abwesenheitseintrag
  const totalDays = daysInYear(year);
  const yearStart = new Date(year, 0, 1);

  const getBarStyle = (absence) => {
    const s = new Date(absence.start_date);
    const e = new Date(absence.end_date);
    if (s.getFullYear() > year || e.getFullYear() < year) return null;
    const clampedStart = s < yearStart ? yearStart : s;
    const clampedEnd   = e > new Date(year, 11, 31) ? new Date(year, 11, 31) : e;
    const startDay = dayOfYear(clampedStart);
    const endDay   = dayOfYear(clampedEnd);
    const left  = ((startDay - 1) / totalDays) * 100;
    const width = Math.max(0.3, ((endDay - startDay + 1) / totalDays) * 100);
    return { left: `${left}%`, width: `${width}%` };
  };

  // Filtern
  const filtered = absences.filter(a =>
    (typeFilter === "all" || a.absence_type === typeFilter) &&
    a.status !== "rejected"
  );

  // Gruppieren nach Mitarbeiter
  const employeeMap = Object.fromEntries(employees.map(e => [e.id, e]));
  const byUser = {};
  filtered.forEach(a => {
    if (!byUser[a.user_id]) byUser[a.user_id] = [];
    byUser[a.user_id].push(a);
  });

  // Sortierung: Mitarbeiter mit Abwesenheiten zuerst, dann nach Name
  const sortedEmployees = employees.filter(e => byUser[e.id]).sort((a, b) =>
    (dispName(a)).localeCompare(dispName(b), "de")
  );

  // Alle Abwesenheitstypen im Datensatz
  const knownTypes = [...new Set(absences.map(a => a.absence_type).filter(Boolean))];

  // Urlaub-Statistik
  const vacDays  = (uid) => absences
    .filter(a => a.user_id === uid && a.absence_type === "Urlaub" && a.status === "approved")
    .reduce((s, a) => s + (a.days || 0), 0);
  const annualDays = (uid) => employeeMap[uid]?.profile?.annual_vacation_days ?? null;

  return (
    <>
      {/* Jahres-Navigation + Filter */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => setYear(y => y-1)} style={{
            width:30, height:30, borderRadius:8,
            border:"1px solid rgba(var(--ink-tint),0.1)", background:"rgba(var(--tint),0.04)",
            color:"#efede7", cursor:"pointer", fontSize:"1rem",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>‹</button>
          <span style={{
            fontFamily:"'JetBrains Mono', monospace", fontSize:"0.9rem",
            color:"#efede7", letterSpacing:"0.06em", minWidth:48, textAlign:"center",
          }}>{year}</span>
          <button onClick={() => setYear(y => y+1)} style={{
            width:30, height:30, borderRadius:8,
            border:"1px solid rgba(var(--ink-tint),0.1)", background:"rgba(var(--tint),0.04)",
            color:"#efede7", cursor:"pointer", fontSize:"1rem",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>›</button>
        </div>

        {/* Typ-Filter */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {["all", ...knownTypes].map(t => {
            const meta = ABSENCE_TYPE_COLOR[t] || { bg: "#94a3b8", label: t };
            const isActive = typeFilter === t;
            return (
              <button key={t} onClick={() => setType(t)} style={{
                padding:"4px 12px", borderRadius:99, cursor:"pointer",
                border: isActive
                  ? `1px solid rgba(${hexRgb(meta.bg)},0.5)`
                  : "1px solid rgba(var(--ink-tint),0.08)",
                background: isActive
                  ? `rgba(${hexRgb(meta.bg)},0.12)`
                  : "rgba(var(--tint),0.03)",
                color: isActive ? meta.bg : "rgba(var(--ink-tint),0.45)",
                fontFamily:"'JetBrains Mono', monospace", fontSize:"0.68rem",
                letterSpacing:"0.08em", textTransform:"uppercase", transition:"all 0.18s",
              }}>
                {t === "all" ? "Alle Typen" : meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", paddingTop:60 }}><Spinner /></div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {/* Monats-Skala */}
          <div style={{
            display:"grid", gridTemplateColumns:"200px 1fr",
            gap:0, marginBottom:4,
          }}>
            <div />
            <div style={{ position:"relative", height:20 }}>
              {MONTH_LABELS.map((m, i) => {
                const daysInM = new Date(year, i+1, 0).getDate();
                const startD  = new Date(year, i, 1);
                const left    = ((dayOfYear(startD)-1) / totalDays) * 100;
                const width   = (daysInM / totalDays) * 100;
                return (
                  <div key={i} style={{
                    position:"absolute", left:`${left}%`, width:`${width}%`,
                    textAlign:"center",
                    fontFamily:"'JetBrains Mono', monospace", fontSize:"0.55rem",
                    color:"rgba(var(--ink-tint),0.25)", letterSpacing:"0.06em", textTransform:"uppercase",
                    overflow:"hidden",
                  }}>{m}</div>
                );
              })}
              {/* Heute-Linie */}
              {new Date().getFullYear() === year && (() => {
                const todayPct = ((dayOfYear(new Date())-1) / totalDays) * 100;
                return (
                  <div style={{
                    position:"absolute", top:0, bottom:0,
                    left:`${todayPct}%`, width:1,
                    background: ACCENT, opacity:0.5,
                  }} />
                );
              })()}
            </div>
          </div>

          {/* Pro-Mitarbeiter-Zeile */}
          {sortedEmployees.length === 0 ? (
            <div style={{
              textAlign:"center", padding:"4rem 2rem",
              border:"1px solid rgba(var(--ink-tint),0.06)", borderRadius:20,
              background:"rgba(var(--tint),0.02)", marginTop:8,
            }}>
              <div style={{ fontSize:"2rem", opacity:0.3, marginBottom:12 }}>✈️</div>
              <div style={{ fontFamily:"'Fraunces', serif", fontSize:"1.1rem", color:"rgba(var(--ink-tint),0.4)" }}>
                Keine Abwesenheiten für {year}
              </div>
            </div>
          ) : sortedEmployees.map((emp, ri) => {
            const userAbsences = byUser[emp.id] || [];
            const used   = vacDays(emp.id);
            const annual = annualDays(emp.id);
            const pct    = annual ? Math.min(100, (used / annual) * 100) : null;

            return (
              <div key={emp.id} style={{
                display:"grid", gridTemplateColumns:"200px 1fr",
                borderBottom:"1px solid rgba(var(--ink-tint),0.05)",
                padding:"10px 0",
                background: ri % 2 === 0 ? "transparent" : "rgba(var(--tint),0.01)",
              }}>
                {/* Name + Urlaubsstatistik */}
                <div style={{ paddingRight:16, display:"flex", flexDirection:"column", justifyContent:"center", gap:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{
                      width:26, height:26, borderRadius:"50%", flexShrink:0,
                      background:"rgba(197,165,114,0.1)", border:"1px solid rgba(197,165,114,0.2)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"0.6rem", fontWeight:800, color:"#c5a572",
                    }}>{initials(dispName(emp))}</div>
                    <div style={{
                      fontSize:"0.8rem", fontWeight:600, color:"#efede7",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                    }}>{dispName(emp)}</div>
                  </div>

                  {/* Urlaubstage-Fortschrittsbalken */}
                  {typeFilter === "all" || typeFilter === "Urlaub" ? (
                    <div style={{ paddingLeft:34 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                        <span style={{
                          fontFamily:"'JetBrains Mono', monospace", fontSize:"0.6rem",
                          color: pct !== null && pct >= 90 ? "#f87171" : "rgba(var(--ink-tint),0.4)",
                        }}>
                          {used}{annual ? `/${annual}` : ""} T
                        </span>
                        {pct !== null && (
                          <span style={{
                            fontFamily:"'JetBrains Mono', monospace", fontSize:"0.55rem",
                            color:"rgba(var(--ink-tint),0.25)",
                          }}>Urlaub</span>
                        )}
                      </div>
                      {pct !== null && (
                        <div style={{
                          width:"100%", height:3, borderRadius:99,
                          background:"rgba(var(--tint),0.07)",
                        }}>
                          <div style={{
                            height:"100%", borderRadius:99,
                            width:`${pct}%`,
                            background: pct >= 90 ? "#f87171" : pct >= 75 ? "#fbbf24" : "#38f5d0",
                            transition:"width 0.4s",
                          }} />
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Zeitachse */}
                <div style={{ position:"relative", height:54, alignSelf:"center" }}>
                  {/* Monats-Trennlinien */}
                  {MONTH_LABELS.map((_, i) => {
                    if (i === 0) return null;
                    const left = ((dayOfYear(new Date(year, i, 1))-1) / totalDays) * 100;
                    return (
                      <div key={i} style={{
                        position:"absolute", top:0, bottom:0, left:`${left}%`,
                        width:1, background:"rgba(var(--tint),0.04)",
                      }} />
                    );
                  })}

                  {/* Heute-Linie */}
                  {new Date().getFullYear() === year && (() => {
                    const todayPct = ((dayOfYear(new Date())-1) / totalDays) * 100;
                    return <div style={{
                      position:"absolute", top:0, bottom:0, left:`${todayPct}%`,
                      width:1, background: `${ACCENT}55`,
                    }} />;
                  })()}

                  {/* Abwesenheits-Balken */}
                  {userAbsences.map(a => {
                    const bar = getBarStyle(a);
                    if (!bar) return null;
                    const meta = ABSENCE_TYPE_COLOR[a.absence_type] || { bg:"#94a3b8", label: a.absence_type };
                    const ss   = STATUS_STYLE[a.status] || STATUS_STYLE.pending;
                    const isPending = a.status === "pending";
                    return (
                      <div
                        key={a.id}
                        title={`${a.absence_type} · ${a.start_date} – ${a.end_date}${a.days ? ` · ${a.days} Tage` : ""} · ${ss.label}`}
                        style={{
                          position:"absolute", top:12, height:30,
                          left:bar.left, width:bar.width,
                          background: `rgba(${hexRgb(meta.bg)},${isPending ? "0.12" : "0.22"})`,
                          border:`1px solid rgba(${hexRgb(meta.bg)},${isPending ? "0.3" : "0.5"})`,
                          borderRadius:6,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          overflow:"hidden",
                          boxShadow: isPending ? "none" : `0 0 8px rgba(${hexRgb(meta.bg)},0.2)`,
                          opacity: isPending ? 0.65 : 1,
                          cursor:"default",
                        }}
                      >
                        <span style={{
                          fontFamily:"'JetBrains Mono', monospace", fontSize:"0.52rem",
                          color: meta.bg, fontWeight:700, letterSpacing:"0.05em",
                          whiteSpace:"nowrap", padding:"0 4px",
                          overflow:"hidden", textOverflow:"ellipsis",
                        }}>
                          {a.days ? `${a.days}T` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Legende */}
          <div style={{
            display:"flex", gap:12, marginTop:20, flexWrap:"wrap",
            paddingTop:12, borderTop:"1px solid rgba(var(--ink-tint),0.06)",
          }}>
            {Object.entries(ABSENCE_TYPE_COLOR).map(([type, { bg, label }]) => (
              <div key={type} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{
                  width:12, height:12, borderRadius:3,
                  background:`rgba(${hexRgb(bg)},0.3)`,
                  border:`1px solid rgba(${hexRgb(bg)},0.6)`,
                }} />
                <span style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize:"0.62rem",
                  color:"rgba(var(--ink-tint),0.35)", letterSpacing:"0.06em",
                }}>{label}</span>
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:12, height:12, borderRadius:3, border:"1px dashed rgba(var(--tint),0.2)", opacity:0.5 }} />
              <span style={{
                fontFamily:"'JetBrains Mono', monospace", fontSize:"0.62rem",
                color:"rgba(var(--ink-tint),0.3)",
              }}>Ausstehend</span>
            </div>
            {new Date().getFullYear() === year && (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:1, height:12, background: ACCENT, opacity:0.6 }} />
                <span style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize:"0.62rem",
                  color:"rgba(var(--ink-tint),0.3)",
                }}>Heute</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Hauptseite ────────────────────────────────────────────────────────────────
export default function ArbeitsStationSchichtplan() {
  const [tab, setTab] = useState("schicht");

  return (
    <ArbeitsStationLayout
      title={tab === "schicht" ? "Schichtplan" : "Urlaubsübersicht"}
      icon={tab === "schicht" ? "⬡" : "✈️"}
      accent={ACCENT}
      maxWidth={1100}
    >
      <style>{`@keyframes as-spin { to { transform: rotate(360deg); } }`}</style>

      <TabBar active={tab} onChange={setTab} />

      {tab === "schicht" ? <SchichtplanTab /> : <UrlaubsTab />}
    </ArbeitsStationLayout>
  );
}
