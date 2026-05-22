import { useEffect, useState, useCallback } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../lib/api";

const ACCENT = "#38f5d0";
const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function monday(d = new Date()) {
  const dt = new Date(d);
  const diff = dt.getDay() === 0 ? -6 : 1 - dt.getDay();
  dt.setDate(dt.getDate() + diff);
  dt.setHours(0, 0, 0, 0);
  return dt;
}
const addDays = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt; };
const isoDate = d => d instanceof Date ? d.toISOString().slice(0, 10) : d;
const fmtDay  = d => new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
const initials = name => name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
const displayName = m => m.full_name || m.email?.split("@")[0] || m.email;
const hexRgb = hex => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(",");
};

function Spinner() {
  return (
    <div style={{
      width: 20, height: 20,
      border: "2px solid rgba(255,255,255,0.08)",
      borderTopColor: ACCENT, borderRadius: "50%",
      animation: "as-spin 0.75s linear infinite",
    }} />
  );
}

export default function ArbeitsStationSchichtplan() {
  const [weekStart, setWeekStart] = useState(() => monday());
  const [members, setMembers]         = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);

  const weekDays  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekLabel = `${fmtDay(weekStart)} – ${fmtDay(addDays(weekStart, 6))} ${weekStart.getFullYear()}`;
  const todayStr  = isoDate(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [mR, aR] = await Promise.all([
        api.get("/team/members"),
        api.get("/shifts/assignments", { params: { week_start: isoDate(weekStart) } }),
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
    <ArbeitsStationLayout title="Schichtplan" icon="⬡" accent={ACCENT} maxWidth={1100}>
      <style>{`
        @keyframes as-spin { to { transform: rotate(360deg); } }
        .sp-st-row:hover td { background: rgba(255,255,255,0.015) !important; }
      `}</style>

      {/* Wochennavigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {[["‹", -7], ["›", 7]].map(([label, delta], i) => (
          <button key={i} onClick={() => setWeekStart(w => addDays(w, delta))} style={{
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid rgba(239,237,231,0.1)",
            background: "rgba(255,255,255,0.04)", color: "#efede7",
            cursor: "pointer", fontSize: "1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{label}</button>
        ))}
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem",
          color: "#efede7", letterSpacing: "0.03em",
          minWidth: 210, textAlign: "center",
        }}>{weekLabel}</span>
        <button onClick={() => setWeekStart(monday())} style={{
          padding: "0.3rem 0.8rem", borderRadius: 8,
          border: "1px solid rgba(239,237,231,0.08)",
          background: "rgba(255,255,255,0.03)",
          color: "rgba(239,237,231,0.45)", cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>Heute</button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
          <Spinner />
        </div>
      ) : members.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          border: "1px solid rgba(239,237,231,0.06)", borderRadius: 20,
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>⬡</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "rgba(239,237,231,0.4)" }}>
            Keine Teammitglieder vorhanden
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(239,237,231,0.08)" }}>
                <th style={{
                  padding: "0.55rem 1rem", textAlign: "left", width: 160,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
                  color: "rgba(239,237,231,0.3)",
                }}>Mitarbeiter</th>
                {weekDays.map((d, i) => {
                  const isToday = isoDate(d) === todayStr;
                  return (
                    <th key={i} style={{
                      padding: "0.5rem 0.35rem", textAlign: "center", minWidth: 86,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", fontWeight: 700,
                      color: isToday ? ACCENT : "rgba(239,237,231,0.35)",
                    }}>
                      <div>{DAY_LABELS[i]}</div>
                      <div style={{ fontSize: "0.58rem", fontWeight: 400, opacity: 0.7 }}>{fmtDay(d)}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className="sp-st-row" style={{ borderBottom: "1px solid rgba(239,237,231,0.04)" }}>
                  <td style={{ padding: "0.55rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "rgba(197,165,114,0.12)", border: "1px solid rgba(197,165,114,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.65rem", fontWeight: 800, color: "#c5a572", flexShrink: 0,
                      }}>{initials(displayName(member))}</div>
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#efede7", lineHeight: 1.2 }}>
                          {displayName(member)}
                        </div>
                        {member.org_role_name && (
                          <div style={{ fontSize: "0.6rem", color: "rgba(239,237,231,0.33)", marginTop: 1 }}>
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
                        padding: "0.4rem 0.3rem", textAlign: "center", verticalAlign: "middle",
                        background: isToday ? "rgba(56,245,208,0.03)" : "transparent",
                        borderLeft:  isToday ? "1px solid rgba(56,245,208,0.08)" : "none",
                        borderRight: isToday ? "1px solid rgba(56,245,208,0.08)" : "none",
                        transition: "background 0.1s",
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                          {shifts.length === 0 ? (
                            <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.07)" }}>—</span>
                          ) : shifts.map(a => (
                            <span key={a.id} style={{
                              display: "inline-flex", alignItems: "center", gap: 3,
                              fontSize: "0.63rem", fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                              background: `rgba(${hexRgb(a.color || "#c5a572")}, 0.15)`,
                              border: `1px solid rgba(${hexRgb(a.color || "#c5a572")}, 0.3)`,
                              color: a.color || "#c5a572", whiteSpace: "nowrap",
                              fontFamily: "'JetBrains Mono', monospace",
                            }}>
                              {a.template_name || "Schicht"}
                              {a.start_time && (
                                <span style={{ fontWeight: 400, opacity: 0.7, fontSize: "0.56rem" }}>
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
    </ArbeitsStationLayout>
  );
}
