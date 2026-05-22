import { useEffect, useState, useRef, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// ── Datum-Helfer ─────────────────────────────────────────────────────────────
const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const ABSENCE_COLORS = {
  "Urlaub":           "#60a5fa",
  "Krankheit":        "#f87171",
  "Sonderurlaub":     "#a78bfa",
  "Elternzeit":       "#34d399",
  "Überstundenabbau": "#94a3b8",
  "Sonstiges":        "#94a3b8",
};
const ABSENCE_SHORT = {
  "Urlaub":           "Urlaub",
  "Krankheit":        "Krank",
  "Sonderurlaub":     "Sond.",
  "Elternzeit":       "Eltern",
  "Überstundenabbau": "ÜSA",
  "Sonstiges":        "Abw.",
};

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
const hexRgb  = hex => {
  const h = hex.replace("#", "");
  return [0,2,4].map(i => parseInt(h.slice(i,i+2),16)).join(",");
};
const initials = name => name ? name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "?";
const displayName = m => m.full_name || m.email?.split("@")[0] || m.email;

// ── Styles ───────────────────────────────────────────────────────────────────
const INP = {
  width: "100%", padding: "0.5rem 0.75rem",
  background: "var(--nill-surface)", border: "1px solid var(--nill-border)",
  borderRadius: 7, color: "var(--nill-text)", fontSize: "0.8rem",
  outline: "none", boxSizing: "border-box",
};
const LBL = {
  fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
  letterSpacing: "0.06em", color: "var(--nill-text-dim)", marginBottom: 3, display: "block",
};

// ── TemplateModal ─────────────────────────────────────────────────────────────
function TemplateModal({ tpl, onSave, onClose }) {
  const [form, setForm] = useState({
    name: tpl?.name || "",
    start_time: tpl?.start_time || "08:00",
    end_time:   tpl?.end_time   || "17:00",
    color:      tpl?.color      || "#C5A572",
    checkin_early_minutes: tpl?.checkin_early_minutes ?? 10,
  });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (tpl?.id) await api.put(`/shifts/templates/${tpl.id}`, form);
      else         await api.post("/shifts/templates", form);
      onSave();
    } finally { setSaving(false); }
  }

  return (
    <Overlay onClose={onClose}>
      <ModalBox maxWidth={380}>
        <ModalHeader title={tpl?.id ? "Vorlage bearbeiten" : "Neue Schicht-Vorlage"} onClose={onClose} />
        <div style={{ display:"flex", flexDirection:"column", gap:"0.85rem" }}>
          <Field label="Name">
            <input style={INP} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="z.B. Frühschicht" />
          </Field>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.65rem" }}>
            <Field label="Von"><input style={INP} type="time" value={form.start_time} onChange={e=>set("start_time",e.target.value)}/></Field>
            <Field label="Bis"><input style={INP} type="time" value={form.end_time}   onChange={e=>set("end_time",  e.target.value)}/></Field>
          </div>
          <Field label="Einstempeln ab (Minuten vor Schichtbeginn)">
            <input style={INP} type="number" min={0} max={120} value={form.checkin_early_minutes}
              onChange={e=>set("checkin_early_minutes", parseInt(e.target.value)||0)}/>
            <span style={{ fontSize:"0.69rem", color:"var(--nill-text-mute)", marginTop:3, display:"block" }}>
              Mitarbeiter können sich {form.checkin_early_minutes} Min. vor Schichtbeginn einstempeln.
            </span>
          </Field>
          <Field label="Farbe">
            <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
              <input type="color" value={form.color} onChange={e=>set("color",e.target.value)}
                style={{ width:44, height:36, border:"1px solid var(--nill-border)", borderRadius:7, padding:2, cursor:"pointer" }}/>
              <span style={{ fontSize:"0.75rem", color:"var(--nill-text-dim)" }}>{form.color}</span>
            </div>
          </Field>
          <ModalFooter>
            <GhostBtn onClick={onClose}>Abbrechen</GhostBtn>
            <GoldBtn onClick={save} disabled={saving||!form.name.trim()}>{saving?"Speichern…":"Speichern"}</GoldBtn>
          </ModalFooter>
        </div>
      </ModalBox>
    </Overlay>
  );
}

// ── MemberShiftModal ──────────────────────────────────────────────────────────
function MemberShiftModal({ member, weekDays, templates, assignments, onSave, onRemove, onClose }) {
  const myShifts = assignments.filter(a => a.user_id === member.id);
  const [form, setForm] = useState({
    shift_date: isoDate(weekDays[0]),
    template_id: templates[0]?.id || "",
    start_time: "",
    end_time: "",
    use_custom: false,
  });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  // When template changes, prefill times
  useEffect(() => {
    const t = templates.find(t => t.id === form.template_id);
    if (t && !form.use_custom) {
      setForm(f => ({ ...f, start_time: t.start_time || "", end_time: t.end_time || "" }));
    }
  }, [form.template_id, form.use_custom]);

  async function save() {
    setSaving(true);
    try {
      await api.post("/shifts/assignments", {
        user_id:     member.id,
        shift_date:  form.shift_date,
        template_id: form.use_custom ? null : (form.template_id || null),
        start_time:  form.use_custom ? form.start_time : null,
        end_time:    form.use_custom ? form.end_time   : null,
      });
      onSave();
    } catch (e) {
      alert(e?.response?.data?.detail || "Fehler beim Speichern");
    } finally { setSaving(false); }
  }

  return (
    <Overlay onClose={onClose}>
      <ModalBox maxWidth={460}>
        <ModalHeader onClose={onClose} title={
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.65rem" }}>
              <Avatar name={displayName(member)} />
              <div>
                <div style={{ fontWeight:800, fontSize:"1rem", color:"var(--nill-text)" }}>{displayName(member)}</div>
                {member.org_role_name && (
                  <div style={{ fontSize:"0.72rem", color:"var(--nill-text-dim)" }}>{member.org_role_name}</div>
                )}
              </div>
            </div>
          </div>
        }/>

        {/* Bestehende Schichten diese Woche */}
        {myShifts.length > 0 && (
          <div style={{ marginBottom:"1rem" }}>
            <label style={LBL}>Schichten diese Woche</label>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem" }}>
              {myShifts.map(a => (
                <div key={a.id} style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"0.45rem 0.75rem",
                  background:`rgba(${hexRgb(a.color||"#C5A572")},0.1)`,
                  border:`1px solid rgba(${hexRgb(a.color||"#C5A572")},0.25)`,
                  borderRadius:8,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:a.color||"#C5A572",flexShrink:0 }}/>
                    <span style={{ fontSize:"0.8rem", fontWeight:600, color:"var(--nill-text)" }}>
                      {DAY_LABELS[new Date(a.shift_date).getDay()===0?6:new Date(a.shift_date).getDay()-1]}
                      {" "}{fmtDay(a.shift_date)}
                    </span>
                    <span style={{ fontSize:"0.75rem", color:"var(--nill-text-dim)" }}>
                      {a.template_name || "Eigene Zeit"}
                      {a.start_time && ` · ${a.start_time}–${a.end_time}`}
                    </span>
                  </div>
                  <button onClick={() => onRemove(a.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(239,68,68,0.6)",fontSize:"0.85rem" }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Neue Schicht */}
        <div style={{ padding:"0.85rem", background:"rgba(255,255,255,0.025)", border:"1px solid var(--nill-border)", borderRadius:10 }}>
          <label style={LBL}>Neue Schicht hinzufügen</label>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem" }}>
            <Field label="Tag">
              <select style={INP} value={form.shift_date} onChange={e=>set("shift_date",e.target.value)}>
                {weekDays.map((d,i) => (
                  <option key={i} value={isoDate(d)}>
                    {DAY_LABELS[i]}, {fmtDay(d)}
                  </option>
                ))}
              </select>
            </Field>

            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <input type="checkbox" id="use_custom" checked={form.use_custom} onChange={e=>set("use_custom",e.target.checked)}
                style={{ cursor:"pointer" }}/>
              <label htmlFor="use_custom" style={{ fontSize:"0.8rem", color:"var(--nill-text-dim)", cursor:"pointer" }}>
                Eigene Zeit (ohne Vorlage)
              </label>
            </div>

            {!form.use_custom ? (
              <Field label="Schicht-Vorlage">
                <select style={INP} value={form.template_id} onChange={e=>set("template_id",e.target.value)}>
                  <option value="">— Vorlage wählen —</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.start_time}–{t.end_time})</option>
                  ))}
                </select>
              </Field>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.65rem" }}>
                <Field label="Von"><input style={INP} type="time" value={form.start_time} onChange={e=>set("start_time",e.target.value)}/></Field>
                <Field label="Bis"><input style={INP} type="time" value={form.end_time}   onChange={e=>set("end_time",  e.target.value)}/></Field>
              </div>
            )}

            <GoldBtn onClick={save} disabled={saving||(form.use_custom?(!form.start_time||!form.end_time):!form.template_id)}>
              {saving ? "Speichern…" : "+ Schicht hinzufügen"}
            </GoldBtn>
          </div>
        </div>
      </ModalBox>
    </Overlay>
  );
}

// ── Kleine UI-Helfer ──────────────────────────────────────────────────────────
function Overlay({ children, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}
function ModalBox({ children, maxWidth=420 }) {
  return (
    <div style={{ background:"var(--nill-bg)", border:"1px solid var(--nill-border)", borderRadius:14, padding:"1.75rem", width:"100%", maxWidth, maxHeight:"90vh", overflowY:"auto", display:"flex", flexDirection:"column", gap:"1rem" }}>
      {children}
    </div>
  );
}
function ModalHeader({ title, onClose }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>{typeof title==="string" ? <span style={{ fontWeight:800, fontSize:"1rem", color:"var(--nill-text)" }}>{title}</span> : title}</div>
      <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--nill-text-dim)", fontSize:"1.2rem", lineHeight:1, marginLeft:8, flexShrink:0 }}>✕</button>
    </div>
  );
}
function ModalFooter({ children }) {
  return <div style={{ display:"flex", gap:"0.65rem", justifyContent:"flex-end", paddingTop:"0.25rem" }}>{children}</div>;
}
function Field({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
      <label style={LBL}>{label}</label>
      {children}
    </div>
  );
}
function GoldBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding:"0.5rem 1.3rem", background:"var(--nill-gold)", border:"none", borderRadius:8, color:"#000", fontWeight:700, fontSize:"0.82rem", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.55:1 }}>
      {children}
    </button>
  );
}
function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ padding:"0.5rem 1.1rem", background:"transparent", border:"1px solid var(--nill-border)", borderRadius:8, color:"var(--nill-text-dim)", cursor:"pointer", fontSize:"0.82rem" }}>
      {children}
    </button>
  );
}
function Avatar({ name, size = 36 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:"rgba(197,165,114,0.15)", border:"1px solid rgba(197,165,114,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: size < 30 ? "0.6rem" : "0.75rem", fontWeight:800, color:"var(--nill-gold)", flexShrink:0 }}>
      {initials(name)}
    </div>
  );
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────
export function SchichtplanContent() {
  const { isCompanyAdmin } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin());

  const [weekStart, setWeekStart] = useState(() => monday());
  const [members,     setMembers]     = useState([]);
  const [templates,   setTemplates]   = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading,     setLoading]     = useState(true);

  const [absences,     setAbsences]     = useState([]);

  const [tplModal,    setTplModal]    = useState(null);   // null | "new" | tpl
  const [memberModal, setMemberModal] = useState(null);   // null | member
  const [showTplPanel,setShowTplPanel]= useState(false);

  // Drag & drop state
  const [dragging, setDragging] = useState(null); // {id, userId, date}
  const [dropOver, setDropOver] = useState(null); // "userId|date"

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // ── Daten laden ─────────────────────────────────────────────────────────────
  const loadAssignments = useCallback(async () => {
    const r = await api.get("/shifts/assignments", { params: { week_start: isoDate(weekStart) } });
    setAssignments(r.data?.assignments ?? []);
  }, [weekStart]);

  useEffect(() => {
    setLoading(true);
    const year = weekStart.getFullYear();
    Promise.all([
      api.get("/team/members"),
      api.get("/shifts/templates"),
      api.get("/shifts/assignments", { params: { week_start: isoDate(weekStart) } }),
      api.get(`/hr/absences?status=approved&year=${year}`),
    ]).then(([mR, tR, aR, abR]) => {
      setMembers(Array.isArray(mR.data) ? mR.data : []);
      setTemplates(tR.data?.templates ?? []);
      setAssignments(aR.data?.assignments ?? []);
      setAbsences(abR.data?.items ?? []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [weekStart]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  async function handleRemoveAssignment(id) {
    await api.delete(`/shifts/assignments/${id}`);
    await loadAssignments();
  }

  async function handleDeleteTemplate(id) {
    if (!window.confirm("Vorlage löschen?")) return;
    await api.delete(`/shifts/templates/${id}`);
    const r = await api.get("/shifts/templates");
    setTemplates(r.data?.templates ?? []);
  }

  // ── Drag & Drop ──────────────────────────────────────────────────────────────
  function onDragStart(e, assignment) {
    setDragging({ id: assignment.id, userId: assignment.user_id, date: assignment.shift_date });
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e, userId, dateStr) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropOver(`${userId}|${dateStr}`);
  }

  function onDragLeave() { setDropOver(null); }

  async function onDrop(e, userId, dateStr) {
    e.preventDefault();
    setDropOver(null);
    if (!dragging) return;
    if (dragging.userId === userId && dragging.date === dateStr) { setDragging(null); return; }
    await api.patch(`/shifts/assignments/${dragging.id}`, { user_id: userId, shift_date: dateStr });
    setDragging(null);
    await loadAssignments();
  }

  // ── Grid helpers ─────────────────────────────────────────────────────────────
  const getCell = (userId, dateStr) =>
    assignments.filter(a => a.user_id === userId && a.shift_date === dateStr);

  const weekLabel = `${fmtDay(weekStart)} – ${fmtDay(addDays(weekStart, 6))} ${weekStart.getFullYear()}`;

  const weekStartStr = isoDate(weekStart);
  const weekEndStr   = isoDate(weekDays[6]);

  const getAbsencesForCell = (userId, dateStr) =>
    absences.filter(a => a.user_id === userId && dateStr >= a.start_date && dateStr <= a.end_date);

  const absentThisWeek = members.filter(m =>
    absences.some(a => a.user_id === m.id && a.start_date <= weekEndStr && a.end_date >= weekStartStr)
  );

  return (
    <>
      <style>{`
        .sp-row:hover td { background: rgba(255,255,255,0.02); }
        .sp-chip {
          display:inline-flex; align-items:center; gap:3px;
          font-size:0.68rem; font-weight:700; padding:3px 7px;
          border-radius:20px; white-space:nowrap; cursor:grab; user-select:none;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .sp-chip:active { cursor:grabbing; }
        .sp-chip:hover  { transform:scale(1.04); box-shadow:0 2px 8px rgba(0,0,0,0.3); }
        .sp-cell-drop   { background: rgba(197,165,114,0.08) !important; }
        .sp-name-btn    { background:none; border:none; cursor:pointer; text-align:left; padding:0; }
        .sp-name-btn:hover .sp-name { text-decoration: underline; text-decoration-color: var(--nill-gold); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:"1.5rem" }}>
        <h2 style={{ fontSize:"1.25rem", fontWeight:800, margin:"0 0 0.3rem", color:"var(--nill-text)" }}>Schichtplan</h2>
        <p style={{ margin:0, fontSize:"0.82rem", color:"var(--nill-text-mute)" }}>Wöchentliche Schichteinteilung · Ziehen zum Verschieben</p>
      </div>

      {/* Toolbar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.75rem", marginBottom:"1.25rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <NavBtn onClick={() => setWeekStart(w => addDays(w,-7))}>‹</NavBtn>
          <span style={{ fontSize:"0.85rem", fontWeight:700, color:"var(--nill-text)", minWidth:180, textAlign:"center" }}>{weekLabel}</span>
          <NavBtn onClick={() => setWeekStart(w => addDays(w,7))}>›</NavBtn>
          <button onClick={() => setWeekStart(monday())}
            style={{ padding:"0.3rem 0.7rem", borderRadius:8, background:"transparent", border:"1px solid var(--nill-border)", color:"var(--nill-text-dim)", cursor:"pointer", fontSize:"0.72rem" }}>
            Heute
          </button>
        </div>
        {isAdmin && (
          <button onClick={() => setShowTplPanel(v=>!v)}
            style={{ padding:"0.4rem 1rem", borderRadius:8, background:showTplPanel?"rgba(197,165,114,0.12)":"var(--nill-surface)", border:`1px solid ${showTplPanel?"rgba(197,165,114,0.4)":"var(--nill-border)"}`, color:showTplPanel?"var(--nill-gold)":"var(--nill-text-dim)", cursor:"pointer", fontSize:"0.8rem", fontWeight:600 }}>
            ⚙ Schicht-Vorlagen
          </button>
        )}
      </div>

      {/* Vorlagen-Panel */}
      {showTplPanel && isAdmin && (
        <div style={{ marginBottom:"1.25rem", padding:"1rem 1.25rem", background:"rgba(255,255,255,0.025)", border:"1px solid var(--nill-border)", borderRadius:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem" }}>
            <span style={{ fontSize:"0.82rem", fontWeight:700, color:"var(--nill-text)" }}>Schicht-Vorlagen</span>
            <button onClick={() => setTplModal("new")}
              style={{ padding:"0.3rem 0.75rem", background:"var(--nill-gold)", border:"none", borderRadius:7, color:"#000", fontWeight:700, fontSize:"0.75rem", cursor:"pointer" }}>
              + Neue Vorlage
            </button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
            {templates.length === 0 && <span style={{ fontSize:"0.8rem", color:"var(--nill-text-mute)" }}>Noch keine Vorlagen</span>}
            {templates.map(t => (
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.35rem 0.75rem", background:`rgba(${hexRgb(t.color)},0.1)`, border:`1px solid rgba(${hexRgb(t.color)},0.3)`, borderRadius:20 }}>
                <span style={{ width:8,height:8,borderRadius:"50%",background:t.color }}/>
                <span style={{ fontSize:"0.78rem", fontWeight:700, color:t.color }}>{t.name}</span>
                <span style={{ fontSize:"0.68rem", color:"var(--nill-text-dim)" }}>{t.start_time}–{t.end_time}</span>
                <span style={{ fontSize:"0.65rem", color:"var(--nill-text-mute)" }}>±{t.checkin_early_minutes}min</span>
                <button onClick={() => setTplModal(t)} style={{ background:"none",border:"none",cursor:"pointer",color:"var(--nill-text-dim)",fontSize:"0.72rem",padding:"0 2px" }}>✏</button>
                <button onClick={() => handleDeleteTemplate(t.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(239,68,68,0.5)",fontSize:"0.72rem",padding:"0 2px" }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urlaubsübersicht */}
      {!loading && absentThisWeek.length > 0 && (
        <div style={{ marginBottom:"1.25rem", padding:"0.8rem 1.1rem", background:"rgba(96,165,250,0.05)", border:"1px solid rgba(96,165,250,0.15)", borderRadius:10 }}>
          <div style={{ fontSize:"0.68rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"rgba(96,165,250,0.65)", marginBottom:"0.5rem" }}>
            Abwesend diese Woche
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
            {absentThisWeek.map(m => {
              const typeAbs = absences.find(a => a.user_id === m.id && a.start_date <= weekEndStr && a.end_date >= weekStartStr);
              const type  = typeAbs?.absence_type || "Abwesend";
              const color = ABSENCE_COLORS[type] || "#94a3b8";
              return (
                <div key={m.id} style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.3rem 0.7rem", background:`rgba(${hexRgb(color)},0.08)`, border:`1px solid rgba(${hexRgb(color)},0.22)`, borderRadius:20 }}>
                  <Avatar name={displayName(m)} size={24} />
                  <span style={{ fontSize:"0.78rem", fontWeight:600, color:"var(--nill-text)" }}>{displayName(m)}</span>
                  <span style={{ fontSize:"0.68rem", color, fontStyle:"italic" }}>{type}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wochen-Grid */}
      {loading ? (
        <div style={{ color:"var(--nill-text-mute)", padding:"3rem 0", textAlign:"center" }}>Lädt…</div>
      ) : members.length === 0 ? (
        <div style={{ color:"var(--nill-text-mute)", padding:"3rem 0", textAlign:"center", border:"1px dashed var(--nill-border)", borderRadius:12 }}>
          Noch keine Teammitglieder vorhanden.
        </div>
      ) : (
        <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:640 }}>
            <thead>
              <tr style={{ borderBottom:"2px solid var(--nill-border)" }}>
                <th style={{ padding:"0.6rem 0.85rem", textAlign:"left", width:170, fontSize:"0.68rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--nill-text-dim)" }}>
                  Mitarbeiter
                </th>
                {weekDays.map((d, i) => {
                  const isToday = isoDate(d) === isoDate(new Date());
                  return (
                    <th key={i} style={{ padding:"0.5rem 0.4rem", textAlign:"center", minWidth:95, fontSize:"0.72rem", fontWeight:700, color: isToday ? "var(--nill-gold)" : "var(--nill-text-dim)" }}>
                      <div>{DAY_LABELS[i]}</div>
                      <div style={{ fontSize:"0.65rem", fontWeight:400, opacity:0.7 }}>{fmtDay(d)}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className="sp-row" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  {/* Member name cell */}
                  <td style={{ padding:"0.6rem 0.85rem", verticalAlign:"middle" }}>
                    <button className="sp-name-btn" onClick={isAdmin ? () => setMemberModal(member) : undefined}
                      style={{ cursor: isAdmin ? "pointer" : "default" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <Avatar name={displayName(member)} />
                        <div>
                          <div className="sp-name" style={{ fontSize:"0.82rem", fontWeight:700, color:"var(--nill-text)", lineHeight:1.2 }}>
                            {displayName(member)}
                          </div>
                          {member.org_role_name && (
                            <div style={{ fontSize:"0.68rem", color:"var(--nill-text-dim)", marginTop:1 }}>{member.org_role_name}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  </td>

                  {/* Day cells */}
                  {weekDays.map((d, di) => {
                    const dateStr = isoDate(d);
                    const cellItems = getCell(member.id, dateStr);
                    const isToday   = dateStr === isoDate(new Date());
                    const isOver    = dropOver === `${member.id}|${dateStr}`;

                    return (
                      <td key={di}
                        className={isOver ? "sp-cell-drop" : ""}
                        onDragOver={isAdmin ? e => onDragOver(e, member.id, dateStr) : undefined}
                        onDragLeave={onDragLeave}
                        onDrop={isAdmin ? e => onDrop(e, member.id, dateStr) : undefined}
                        onClick={isAdmin && cellItems.length === 0 ? () => setMemberModal(member) : undefined}
                        style={{
                          padding:"0.4rem 0.3rem",
                          textAlign:"center",
                          verticalAlign:"middle",
                          cursor: isAdmin && cellItems.length === 0 ? "pointer" : "default",
                          background: isToday ? "rgba(197,165,114,0.04)" : "transparent",
                          borderLeft:  isToday ? "1px solid rgba(197,165,114,0.12)" : "none",
                          borderRight: isToday ? "1px solid rgba(197,165,114,0.12)" : "none",
                          transition:"background 0.1s",
                          minHeight:48,
                        }}
                      >
                        <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"center" }}>
                          {cellItems.length === 0 && getAbsencesForCell(member.id, dateStr).length === 0 && isAdmin && (
                            <span style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.1)", userSelect:"none" }}>+</span>
                          )}
                          {cellItems.map(a => (
                            <span
                              key={a.id}
                              className="sp-chip"
                              draggable={isAdmin}
                              onDragStart={isAdmin ? e => onDragStart(e, a) : undefined}
                              onDragEnd={() => { setDragging(null); setDropOver(null); }}
                              title={`${a.template_name||"Eigene Zeit"} · ${a.start_time||"?"}–${a.end_time||"?"}`}
                              style={{
                                background:`rgba(${hexRgb(a.color||"#C5A572")},0.15)`,
                                border:`1px solid rgba(${hexRgb(a.color||"#C5A572")},0.35)`,
                                color: a.color || "var(--nill-gold)",
                                opacity: dragging?.id === a.id ? 0.4 : 1,
                              }}
                            >
                              {a.template_name || "Eigene"}
                              {a.start_time && (
                                <span style={{ fontWeight:400, opacity:0.75, fontSize:"0.62rem" }}>
                                  {" "}{a.start_time}
                                </span>
                              )}
                            </span>
                          ))}
                          {getAbsencesForCell(member.id, dateStr).map(ab => {
                            const abColor = ABSENCE_COLORS[ab.absence_type] || "#94a3b8";
                            return (
                              <span key={ab.id} className="sp-chip" title={ab.absence_type} style={{
                                background:`rgba(${hexRgb(abColor)},0.1)`,
                                border:`1px dashed rgba(${hexRgb(abColor)},0.4)`,
                                color: abColor, cursor:"default",
                                fontStyle:"italic", fontWeight:600,
                              }}>
                                {ABSENCE_SHORT[ab.absence_type] || ab.absence_type}
                              </span>
                            );
                          })}
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
      {templates.length > 0 && !loading && (
        <div style={{ marginTop:"1rem", display:"flex", flexWrap:"wrap", gap:"0.5rem", alignItems:"center" }}>
          <span style={{ fontSize:"0.65rem", color:"var(--nill-text-dim)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Legende:</span>
          {templates.map(t => (
            <span key={t.id} style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:"0.7rem", fontWeight:700, padding:"2px 8px", borderRadius:20, background:`rgba(${hexRgb(t.color)},0.1)`, border:`1px solid rgba(${hexRgb(t.color)},0.3)`, color:t.color }}>
              {t.name} · {t.start_time}–{t.end_time}
              <span style={{ fontWeight:400, opacity:0.65, fontSize:"0.62rem" }}>±{t.checkin_early_minutes}min</span>
            </span>
          ))}
        </div>
      )}

      {/* Modals */}
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

      {memberModal && (
        <MemberShiftModal
          member={memberModal}
          weekDays={weekDays}
          templates={templates}
          assignments={assignments.filter(a => a.user_id === memberModal.id)}
          onSave={async () => { await loadAssignments(); }}
          onRemove={async (id) => { await handleRemoveAssignment(id); }}
          onClose={() => setMemberModal(null)}
        />
      )}
    </>
  );
}

function NavBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ width:32, height:32, borderRadius:8, background:"var(--nill-surface)", border:"1px solid var(--nill-border)", color:"var(--nill-text)", cursor:"pointer", fontSize:"1.1rem", lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
      {children}
    </button>
  );
}
