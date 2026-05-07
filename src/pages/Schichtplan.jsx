import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const inp = {
  width: "100%", padding: "0.5rem 0.75rem",
  background: "var(--nill-surface)", border: "1px solid var(--nill-border)",
  borderRadius: 7, color: "var(--nill-text)", fontSize: "0.8rem",
  outline: "none", boxSizing: "border-box",
};
const lbl = {
  fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
  letterSpacing: "0.06em", color: "var(--nill-text-dim)", marginBottom: 3,
  display: "block",
};

function monday(d) {
  const dt = new Date(d);
  const day = dt.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  dt.setDate(dt.getDate() + diff);
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function addDays(d, n) {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt;
}
function isoDate(d) {
  return d.toISOString().slice(0, 10);
}
function fmtDay(d) {
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ── Vorlage-Modal ────────────────────────────────────────────────────────────
function TemplateModal({ tpl, onSave, onClose }) {
  const [form, setForm] = useState({
    name: tpl?.name || "",
    start_time: tpl?.start_time || "08:00",
    end_time: tpl?.end_time || "16:00",
    color: tpl?.color || "#C5A572",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (tpl?.id) await api.put(`/shifts/templates/${tpl.id}`, form);
      else await api.post("/shifts/templates", form);
      onSave();
    } finally { setSaving(false); }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }}>
      <div style={{
        background: "var(--nill-bg)", border: "1px solid var(--nill-border)",
        borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 380,
        display: "flex", flexDirection: "column", gap: "1rem",
      }}>
        <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--nill-text)" }}>
          {tpl?.id ? "Vorlage bearbeiten" : "Neue Schicht-Vorlage"}
        </div>
        <div>
          <label style={lbl}>Name</label>
          <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="z.B. Frühschicht" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          <div>
            <label style={lbl}>Von</label>
            <input style={inp} type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
          </div>
          <div>
            <label style={lbl}>Bis</label>
            <input style={inp} type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
          </div>
        </div>
        <div>
          <label style={lbl}>Farbe</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              style={{ width: 44, height: 36, borderRadius: 7, border: "1px solid var(--nill-border)", cursor: "pointer", padding: 2 }} />
            <span style={{ fontSize: "0.78rem", color: "var(--nill-text-dim)" }}>{form.color}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "0.5rem 1.1rem", background: "transparent", border: "1px solid var(--nill-border)", borderRadius: 8, color: "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.82rem" }}>
            Abbrechen
          </button>
          <button onClick={save} disabled={saving || !form.name.trim()} style={{ padding: "0.5rem 1.3rem", background: "var(--nill-gold)", border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Zell-Popup (Schicht zuweisen) ─────────────────────────────────────────────
function CellPopup({ userId, date, templates, existing, onAssign, onRemove, onClose, anchorRect }) {
  const ref = useRef();

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const top = Math.min(anchorRect.bottom + 6, window.innerHeight - 260);
  const left = Math.min(anchorRect.left, window.innerWidth - 240);

  return (
    <div ref={ref} style={{
      position: "fixed", top, left, zIndex: 200,
      background: "#0d1628", border: "1px solid var(--nill-border)",
      borderRadius: 10, padding: "0.75rem", width: 230,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--nill-text-dim)", marginBottom: "0.5rem" }}>
        Schicht zuweisen
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {templates.map(t => {
          const assigned = existing.find(a => a.template_id === t.id);
          return (
            <button key={t.id} onClick={() => assigned ? onRemove(assigned.id) : onAssign(userId, date, t.id)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.45rem 0.65rem", borderRadius: 7, cursor: "pointer",
                background: assigned ? `rgba(${hexToRgb(t.color)},0.15)` : "rgba(255,255,255,0.04)",
                border: assigned ? `1px solid rgba(${hexToRgb(t.color)},0.4)` : "1px solid var(--nill-border)",
                color: assigned ? t.color : "var(--nill-text-dim)",
                fontSize: "0.8rem", fontWeight: assigned ? 700 : 400,
                transition: "all 0.12s", textAlign: "left",
              }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{t.name}</span>
              <span style={{ fontSize: "0.68rem", opacity: 0.7 }}>{t.start_time}–{t.end_time}</span>
              {assigned && <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>✕</span>}
            </button>
          );
        })}
        {templates.length === 0 && (
          <p style={{ fontSize: "0.78rem", color: "var(--nill-text-mute)", margin: 0 }}>
            Keine Vorlagen vorhanden.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export function SchichtplanContent() {
  const { isCompanyAdmin } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin());

  const [weekStart, setWeekStart] = useState(() => monday(new Date()));
  const [members, setMembers]     = useState([]);
  const [templates, setTemplates] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]     = useState(true);

  const [tplModal, setTplModal]   = useState(null); // null | "new" | {template}
  const [cellPopup, setCellPopup] = useState(null); // {userId, date, rect}
  const [showTplPanel, setShowTplPanel] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => { loadAll(); }, [weekStart]);

  async function loadAll() {
    setLoading(true);
    try {
      const [mRes, tRes, aRes] = await Promise.all([
        api.get("/team/members"),
        api.get("/shifts/templates"),
        api.get("/shifts/assignments", { params: { week_start: isoDate(weekStart) } }),
      ]);
      setMembers(Array.isArray(mRes.data) ? mRes.data : []);
      setTemplates(tRes.data?.templates ?? []);
      setAssignments(aRes.data?.assignments ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleAssign(userId, date, templateId) {
    setCellPopup(null);
    await api.post("/shifts/assignments", { user_id: userId, shift_date: date, template_id: templateId });
    await loadAssignments();
  }
  async function handleRemove(assignmentId) {
    setCellPopup(null);
    await api.delete(`/shifts/assignments/${assignmentId}`);
    await loadAssignments();
  }
  async function loadAssignments() {
    const r = await api.get("/shifts/assignments", { params: { week_start: isoDate(weekStart) } });
    setAssignments(r.data?.assignments ?? []);
  }
  async function deleteTemplate(id) {
    await api.delete(`/shifts/templates/${id}`);
    const r = await api.get("/shifts/templates");
    setTemplates(r.data?.templates ?? []);
  }

  function getAssignmentsFor(userId, date) {
    return assignments.filter(a => a.user_id === userId && a.shift_date === date);
  }

  const weekLabel = `${fmtDay(weekStart)} – ${fmtDay(addDays(weekStart, 6))} ${weekStart.getFullYear()}`;

  return (
    <>
      <style>{`
        .sp-grid { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .sp-cell:hover { background: rgba(255,255,255,0.05) !important; }
        .sp-chip { display:inline-flex; align-items:center; gap:3px; font-size:0.68rem;
                   font-weight:700; padding:2px 7px; border-radius:20px; white-space:nowrap; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.3rem", color: "var(--nill-text)" }}>
          Schichtplan
        </h2>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
          Wöchentliche Schichteinteilung für dein Team
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {/* Week nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={() => setWeekStart(w => addDays(w, -7))} style={{ width: 32, height: 32, borderRadius: 8, background: "var(--nill-surface)", border: "1px solid var(--nill-border)", color: "var(--nill-text)", cursor: "pointer", fontSize: "1rem" }}>‹</button>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--nill-text)", minWidth: 170, textAlign: "center" }}>{weekLabel}</span>
          <button onClick={() => setWeekStart(w => addDays(w, 7))}  style={{ width: 32, height: 32, borderRadius: 8, background: "var(--nill-surface)", border: "1px solid var(--nill-border)", color: "var(--nill-text)", cursor: "pointer", fontSize: "1rem" }}>›</button>
          <button onClick={() => setWeekStart(monday(new Date()))} style={{ padding: "0.3rem 0.75rem", borderRadius: 8, background: "transparent", border: "1px solid var(--nill-border)", color: "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.75rem" }}>Heute</button>
        </div>

        {isAdmin && (
          <button onClick={() => setShowTplPanel(v => !v)} style={{ padding: "0.45rem 1rem", background: showTplPanel ? "rgba(197,165,114,0.12)" : "var(--nill-surface)", border: `1px solid ${showTplPanel ? "rgba(197,165,114,0.4)" : "var(--nill-border)"}`, borderRadius: 8, color: showTplPanel ? "var(--nill-gold)" : "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
            ⚙ Schicht-Vorlagen
          </button>
        )}
      </div>

      {/* Vorlagen-Panel */}
      {showTplPanel && isAdmin && (
        <div style={{ marginBottom: "1.25rem", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.025)", border: "1px solid var(--nill-border)", borderRadius: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--nill-text)" }}>Schicht-Vorlagen</span>
            <button onClick={() => setTplModal("new")} style={{ padding: "0.3rem 0.75rem", background: "var(--nill-gold)", border: "none", borderRadius: 7, color: "#000", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>
              + Neue Vorlage
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {templates.length === 0 && <span style={{ fontSize: "0.8rem", color: "var(--nill-text-mute)" }}>Noch keine Vorlagen</span>}
            {templates.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.75rem", background: `rgba(${hexToRgb(t.color)},0.1)`, border: `1px solid rgba(${hexToRgb(t.color)},0.3)`, borderRadius: 20 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: t.color }}>{t.name}</span>
                <span style={{ fontSize: "0.7rem", color: "var(--nill-text-dim)" }}>{t.start_time}–{t.end_time}</span>
                <button onClick={() => setTplModal(t)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--nill-text-dim)", fontSize: "0.75rem", padding: "0 2px" }}>✏</button>
                <button onClick={() => { if (window.confirm(`"${t.name}" löschen?`)) deleteTemplate(t.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.5)", fontSize: "0.75rem", padding: "0 2px" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wochenplan-Grid */}
      {loading ? (
        <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "3rem 0", textAlign: "center" }}>Lädt…</div>
      ) : members.length === 0 ? (
        <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "3rem 0", textAlign: "center", border: "1px dashed var(--nill-border)", borderRadius: 12 }}>
          Noch keine Teammitglieder vorhanden.
        </div>
      ) : (
        <div className="sp-grid">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--nill-text-dim)", width: 160 }}>
                  Mitarbeiter
                </th>
                {days.map((d, i) => {
                  const isToday = isoDate(d) === isoDate(new Date());
                  return (
                    <th key={i} style={{ padding: "0.6rem 0.5rem", textAlign: "center", fontSize: "0.72rem", fontWeight: 700, color: isToday ? "var(--nill-gold)" : "var(--nill-text-dim)", minWidth: 90 }}>
                      <div>{DAY_LABELS[i]}</div>
                      <div style={{ fontSize: "0.68rem", fontWeight: 400, opacity: 0.7 }}>{fmtDay(d)}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {members.map((member, mi) => (
                <tr key={member.id} style={{ borderTop: "1px solid var(--nill-border)" }}>
                  <td style={{ padding: "0.65rem 1rem", whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--nill-text)" }}>
                      {member.full_name || member.email?.split("@")[0]}
                    </div>
                    {member.full_name && <div style={{ fontSize: "0.7rem", color: "var(--nill-text-mute)" }}>{member.email?.split("@")[0]}</div>}
                  </td>
                  {days.map((d, di) => {
                    const dateStr = isoDate(d);
                    const cellAssignments = getAssignmentsFor(member.id, dateStr);
                    const isToday = dateStr === isoDate(new Date());

                    return (
                      <td key={di}
                        className="sp-cell"
                        onClick={isAdmin ? (e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setCellPopup({ userId: member.id, date: dateStr, rect });
                        } : undefined}
                        style={{
                          padding: "0.4rem 0.35rem",
                          textAlign: "center",
                          verticalAlign: "middle",
                          cursor: isAdmin ? "pointer" : "default",
                          background: isToday ? "rgba(197,165,114,0.04)" : "transparent",
                          borderLeft: isToday ? "1px solid rgba(197,165,114,0.15)" : "1px solid transparent",
                          borderRight: isToday ? "1px solid rgba(197,165,114,0.15)" : "1px solid transparent",
                          transition: "background 0.1s",
                          minHeight: 48,
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                          {cellAssignments.length === 0 ? (
                            isAdmin ? <span style={{ fontSize: "0.65rem", color: "var(--nill-border)", userSelect: "none" }}>+</span> : null
                          ) : (
                            cellAssignments.map(a => (
                              <span key={a.id} className="sp-chip"
                                style={{ background: `rgba(${hexToRgb(a.color || "#C5A572")},0.15)`, border: `1px solid rgba(${hexToRgb(a.color || "#C5A572")},0.35)`, color: a.color || "var(--nill-gold)" }}>
                                {a.template_name}
                              </span>
                            ))
                          )}
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

      {/* Legende */}
      {templates.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.68rem", color: "var(--nill-text-dim)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>Legende:</span>
          {templates.map(t => (
            <span key={t.id} className="sp-chip"
              style={{ background: `rgba(${hexToRgb(t.color)},0.12)`, border: `1px solid rgba(${hexToRgb(t.color)},0.3)`, color: t.color }}>
              {t.name} {t.start_time}–{t.end_time}
            </span>
          ))}
        </div>
      )}

      {/* Zell-Popup */}
      {cellPopup && (
        <CellPopup
          userId={cellPopup.userId}
          date={cellPopup.date}
          templates={templates}
          existing={getAssignmentsFor(cellPopup.userId, cellPopup.date)}
          onAssign={handleAssign}
          onRemove={handleRemove}
          onClose={() => setCellPopup(null)}
          anchorRect={cellPopup.rect}
        />
      )}

      {/* Vorlage-Modal */}
      {tplModal && (
        <TemplateModal
          tpl={tplModal === "new" ? null : tplModal}
          onSave={async () => {
            setTplModal(null);
            const r = await api.get("/shifts/templates");
            setTemplates(r.data?.templates ?? []);
          }}
          onClose={() => setTplModal(null)}
        />
      )}
    </>
  );
}
