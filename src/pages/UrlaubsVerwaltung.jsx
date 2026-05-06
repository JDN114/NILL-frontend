import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ABSENCE_TYPES = ["Urlaub", "Krankheit", "Sonderurlaub", "Elternzeit", "Überstundenabbau", "Sonstiges"];

const inputStyle = {
  width: "100%", padding: "0.5rem 0.75rem",
  background: "var(--nill-surface)",
  border: "1px solid var(--nill-border)",
  borderRadius: 7, color: "var(--nill-text)",
  fontSize: "0.8rem", outline: "none", boxSizing: "border-box",
};

function StatusBadge({ status }) {
  const map = {
    pending:  { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)",  text: "#fbbf24", label: "Ausstehend" },
    approved: { bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)",  text: "#34d399", label: "Genehmigt" },
    rejected: { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)", text: "#f87171", label: "Abgelehnt" },
  };
  const c = map[status] || map.pending;
  return (
    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: c.bg, border: `1px solid ${c.border}`, color: c.text, whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
}

function TypeBadge({ type }) {
  const isVacation = type === "Urlaub";
  return (
    <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px", borderRadius: 99,
      background: isVacation ? "rgba(197,165,114,0.1)" : "rgba(148,163,184,0.1)",
      border: isVacation ? "1px solid rgba(197,165,114,0.25)" : "1px solid rgba(148,163,184,0.2)",
      color: isVacation ? "var(--nill-gold)" : "var(--nill-text-dim)",
      whiteSpace: "nowrap",
    }}>
      {type}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function workdays(start, end) {
  if (!start || !end) return 0;
  let count = 0;
  const d = new Date(start);
  const e = new Date(end);
  while (d <= e) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

function NewAbsenceModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    absence_type: "Urlaub",
    start_date: "",
    end_date: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  const days = form.start_date && form.end_date ? workdays(form.start_date, form.end_date) : 0;

  async function handleSave() {
    if (!form.start_date || !form.end_date) { setError("Bitte Start- und Enddatum angeben."); return; }
    setSaving(true); setError("");
    try {
      await api.post("/hr/absences", {
        absence_type: form.absence_type,
        start_date: form.start_date,
        end_date: form.end_date,
        days: days || null,
        notes: form.notes || null,
      });
      onSave();
    } catch (err) {
      setError(err?.response?.data?.detail || "Fehler beim Erstellen.");
    } finally {
      setSaving(false);
    }
  }

  const field = (label, children) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <label style={{ fontSize: "0.69rem", color: "var(--nill-text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "var(--nill-bg)", border: "1px solid var(--nill-border)", borderRadius: 16, padding: "1.75rem", width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--nill-text)" }}>Abwesenheit beantragen</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--nill-text-dim)", fontSize: "1.2rem" }}>✕</button>
        </div>

        {field("Art der Abwesenheit",
          <select style={inputStyle} value={form.absence_type} onChange={e => set("absence_type", e.target.value)}>
            {ABSENCE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          {field("Von", <input style={inputStyle} type="date" value={form.start_date} onChange={e => set("start_date", e.target.value)} />)}
          {field("Bis", <input style={inputStyle} type="date" value={form.end_date} onChange={e => set("end_date", e.target.value)} />)}
        </div>

        {days > 0 && (
          <div style={{ padding: "0.6rem 0.9rem", background: "rgba(197,165,114,0.08)", border: "1px solid rgba(197,165,114,0.2)", borderRadius: 8, fontSize: "0.78rem", color: "var(--nill-text-dim)" }}>
            {days} Arbeitstag{days !== 1 ? "e" : ""}
          </div>
        )}

        {field("Notiz (optional)",
          <textarea style={{ ...inputStyle, minHeight: 56, resize: "vertical" }}
            value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Weitere Infos…" />
        )}

        {error && <span style={{ fontSize: "0.78rem", color: "#f87171" }}>{error}</span>}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "0.5rem 1.1rem", background: "transparent", border: "1px solid var(--nill-border)", borderRadius: 8, color: "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.8rem" }}>Abbrechen</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: "0.5rem 1.3rem", background: saving ? "var(--nill-border)" : "var(--nill-gold)", color: saving ? "var(--nill-text-mute)" : "#000", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.8rem", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Senden…" : "Beantragen"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AbsenceRow({ absence, isAdmin, onApprove, onReject, onDelete }) {
  const days = absence.days || workdays(absence.start_date, absence.end_date);
  return (
    <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "2fr 1fr 1.5fr 1fr 1fr auto" : "1.5fr 1fr 1.5fr 1fr auto", gap: "0.75rem", alignItems: "center", padding: "0.8rem 1.1rem", border: "1px solid var(--nill-border)", borderRadius: 10, background: "transparent", transition: "background 0.12s" }}
      onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
      onMouseOut={e => e.currentTarget.style.background = "transparent"}
    >
      {isAdmin && (
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.83rem", color: "var(--nill-text)" }}>{absence.user_email}</div>
          {absence.notes && <div style={{ fontSize: "0.7rem", color: "var(--nill-text-dim)", marginTop: 1, fontStyle: "italic" }}>{absence.notes}</div>}
        </div>
      )}
      <TypeBadge type={absence.absence_type} />
      <div style={{ fontSize: "0.8rem", color: "var(--nill-text-dim)" }}>
        {formatDate(absence.start_date)} – {formatDate(absence.end_date)}
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--nill-text)" }}>{days} Tag{days !== 1 ? "e" : ""}</div>
      <StatusBadge status={absence.status} />
      <div style={{ display: "flex", gap: "0.4rem" }}>
        {isAdmin && absence.status === "pending" && (
          <>
            <button onClick={() => onApprove(absence.id)} style={{ padding: "0.3rem 0.65rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: 6, color: "#34d399", cursor: "pointer", fontSize: "0.73rem", fontWeight: 700 }}>✓</button>
            <button onClick={() => onReject(absence.id)} style={{ padding: "0.3rem 0.65rem", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.22)", borderRadius: 6, color: "#f87171", cursor: "pointer", fontSize: "0.73rem" }}>✕</button>
          </>
        )}
        {(!isAdmin && absence.status === "pending") && (
          <button onClick={() => onDelete(absence.id)} style={{ padding: "0.3rem 0.65rem", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.18)", borderRadius: 6, color: "#f87171", cursor: "pointer", fontSize: "0.72rem" }}>Zurückziehen</button>
        )}
      </div>
    </div>
  );
}

export function UrlaubsContent() {
  const { isCompanyAdmin, user } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin());

  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(`/hr/absences?year=${currentYear}`);
      setAbsences(res.data.items ?? []);
    } catch { setAbsences([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(id) {
    setError("");
    try { await api.patch(`/hr/absences/${id}`, { status: "approved" }); load(); }
    catch (e) { setError(e?.response?.data?.detail || "Fehler."); }
  }

  async function handleReject(id) {
    setError("");
    try { await api.patch(`/hr/absences/${id}`, { status: "rejected" }); load(); }
    catch (e) { setError(e?.response?.data?.detail || "Fehler."); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Antrag zurückziehen?")) return;
    setError("");
    try { await api.delete(`/hr/absences/${id}`); load(); }
    catch (e) { setError(e?.response?.data?.detail || "Fehler."); }
  }

  const filtered = filter === "all" ? absences : absences.filter(a => a.status === filter);
  const myAbsences = absences.filter(a => a.user_id === user?.id);
  const approvedVacationDays = myAbsences.filter(a => a.absence_type === "Urlaub" && a.status === "approved")
    .reduce((s, a) => s + (a.days || workdays(a.start_date, a.end_date)), 0);

  const pendingCount = absences.filter(a => a.status === "pending").length;

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .uv-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .uv-table-inner  { min-width: 520px; }
          .uv-form-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.3rem", color: "var(--nill-text)", letterSpacing: "-0.01em" }}>
          Urlaubsverwaltung
        </h2>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
          Abwesenheiten beantragen, verwalten & Resturlaub tracken ({currentYear})
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ padding: "0.65rem 1rem", background: "rgba(255,255,255,0.025)", border: "1px solid var(--nill-border)", borderRadius: 9, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: "0.68rem", color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Genommener Urlaub</span>
          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--nill-text)" }}>{approvedVacationDays} Tage</span>
        </div>
        {isAdmin && (
          <div style={{ padding: "0.65rem 1rem", background: pendingCount > 0 ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.025)", border: `1px solid ${pendingCount > 0 ? "rgba(251,191,36,0.25)" : "var(--nill-border)"}`, borderRadius: 9, display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: "0.68rem", color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Offene Anträge</span>
            <span style={{ fontSize: "1.15rem", fontWeight: 800, color: pendingCount > 0 ? "#fbbf24" : "var(--nill-text)" }}>{pendingCount}</span>
          </div>
        )}
        <div style={{ padding: "0.65rem 1rem", background: "rgba(255,255,255,0.025)", border: "1px solid var(--nill-border)", borderRadius: 9, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: "0.68rem", color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Gesamt Einträge</span>
          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--nill-text)" }}>{absences.length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.65rem" }}>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {[["all", "Alle"], ["pending", "Ausstehend"], ["approved", "Genehmigt"], ["rejected", "Abgelehnt"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding: "0.35rem 0.75rem", borderRadius: 7, fontSize: "0.77rem", fontWeight: 600,
              cursor: "pointer", border: "1px solid",
              background: filter === val ? "var(--nill-gold)" : "transparent",
              color: filter === val ? "#000" : "var(--nill-text-dim)",
              borderColor: filter === val ? "var(--nill-gold)" : "var(--nill-border)",
              transition: "all 0.12s",
            }}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowNew(true)} style={{ padding: "0.45rem 1.1rem", background: "var(--nill-gold)", color: "#000", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
          + Abwesenheit beantragen
        </button>
      </div>

      {error && <div style={{ marginBottom: "0.75rem", fontSize: "0.8rem", color: "#f87171" }}>{error}</div>}

      {/* Table (scroll on mobile) */}
      <div className="uv-table-scroll">
        <div className="uv-table-inner">

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "2fr 1fr 1.5fr 1fr 1fr auto" : "1.5fr 1fr 1.5fr 1fr auto", gap: "0.75rem", padding: "0.45rem 1.1rem", marginBottom: "0.3rem" }}>
            {(isAdmin
              ? ["Mitarbeiter", "Art", "Zeitraum", "Dauer", "Status", ""]
              : ["Art", "Zeitraum", "Dauer", "Status", ""]
            ).map(h => (
              <span key={h} style={{ fontSize: "0.63rem", fontWeight: 700, color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "2rem 0" }}>Lädt…</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "2rem 0", textAlign: "center" }}>
              Keine Einträge gefunden.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {filtered.map(a => (
                <AbsenceRow
                  key={a.id}
                  absence={a}
                  isAdmin={isAdmin}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {showNew && (
        <NewAbsenceModal
          onSave={() => { setShowNew(false); load(); }}
          onClose={() => setShowNew(false)}
        />
      )}
    </>
  );
}

export default function UrlaubsVerwaltung() {
  return <PageLayout><UrlaubsContent /></PageLayout>;
}
