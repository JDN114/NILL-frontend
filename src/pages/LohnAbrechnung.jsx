import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MONTHS = [
  "", "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const inputStyle = {
  padding: "0.45rem 0.7rem",
  background: "var(--nill-surface)",
  border: "1px solid var(--nill-border)",
  borderRadius: 7, color: "var(--nill-text)",
  fontSize: "0.8rem", outline: "none",
};

function fmt(v) {
  if (v == null) return "—";
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(v);
}

function StatusBadge({ status }) {
  const c = status === "finalized"
    ? { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)", text: "#34d399" }
    : { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)", text: "#fbbf24" };
  return (
    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {status === "finalized" ? "Finalisiert" : "Entwurf"}
    </span>
  );
}

function SlipEditModal({ slip, onSave, onClose }) {
  const [form, setForm] = useState({
    bonus: slip.bonus || 0,
    christmas_bonus: slip.christmas_bonus || 0,
    vacation_bonus: slip.vacation_bonus || 0,
    deductions_other: slip.deductions_other || 0,
    notes: slip.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  const bonusSum = (parseFloat(form.bonus) || 0) + (parseFloat(form.christmas_bonus) || 0) + (parseFloat(form.vacation_bonus) || 0);
  const estimatedNet = slip.gross_salary + bonusSum - (slip.social_security || 0) - (slip.income_tax || 0) - (parseFloat(form.deductions_other) || 0);

  async function handleSave() {
    setSaving(true); setError("");
    try {
      await api.patch(`/hr/payroll/${slip.run_id}/payslips/${slip.id}`, {
        bonus: parseFloat(form.bonus) || 0,
        christmas_bonus: parseFloat(form.christmas_bonus) || 0,
        vacation_bonus: parseFloat(form.vacation_bonus) || 0,
        deductions_other: parseFloat(form.deductions_other) || 0,
        notes: form.notes || null,
      });
      onSave();
    } catch (err) {
      setError(err?.response?.data?.detail || "Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  }

  const numField = (label, key) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <label style={{ fontSize: "0.69rem", color: "var(--nill-text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <input style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
        type="number" step="0.01" min="0"
        value={form[key]} onChange={e => set(key, e.target.value)} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "var(--nill-bg)", border: "1px solid var(--nill-border)", borderRadius: 16, padding: "1.75rem", width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--nill-text)" }}>
            Zulagen & Abzüge — {slip.user_name || slip.user_email}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--nill-text-dim)", fontSize: "1.2rem" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          {numField("Prämie (€)", "bonus")}
          {numField("Weihnachtsgeld (€)", "christmas_bonus")}
          {numField("Urlaubsgeld (€)", "vacation_bonus")}
          {numField("Sonstige Abzüge (€)", "deductions_other")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ fontSize: "0.69rem", color: "var(--nill-text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Notiz</label>
          <textarea style={{ ...inputStyle, width: "100%", boxSizing: "border-box", minHeight: 56, resize: "vertical" }}
            value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Interne Anmerkung…" />
        </div>

        <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--nill-border)", borderRadius: 8, fontSize: "0.78rem", color: "var(--nill-text-dim)" }}>
          Brutto: <strong style={{ color: "var(--nill-text)" }}>{fmt(slip.gross_salary)}</strong>
          {" "}→ Netto (geschätzt): <strong style={{ color: "var(--nill-gold)" }}>{fmt(estimatedNet)}</strong>
        </div>

        {error && <span style={{ fontSize: "0.78rem", color: "#f87171" }}>{error}</span>}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "0.5rem 1.1rem", background: "transparent", border: "1px solid var(--nill-border)", borderRadius: 8, color: "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.8rem" }}>Abbrechen</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: "0.5rem 1.3rem", background: saving ? "var(--nill-border)" : "var(--nill-gold)", color: saving ? "var(--nill-text-mute)" : "#000", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.8rem", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RunDetail({ run: initialRun, allRuns, onBack, onRefresh }) {
  const run = allRuns.find(r => r.id === initialRun.id) || initialRun;
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSlip, setEditSlip] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(`/hr/payroll/${run.id}`);
      setSlips(res.data.payslips ?? []);
    } catch { setSlips([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [run.id]);

  async function handleFinalize() {
    if (!window.confirm(`Abrechnung ${MONTHS[run.month]} ${run.year} finalisieren? Danach keine Änderungen mehr möglich.`)) return;
    setBusy(true); setError("");
    try { await api.post(`/hr/payroll/${run.id}/finalize`); await onRefresh(); }
    catch (e) { setError(e?.response?.data?.detail || "Fehler."); }
    finally { setBusy(false); }
  }

  async function handleDelete() {
    if (!window.confirm(`Abrechnung ${MONTHS[run.month]} ${run.year} löschen?`)) return;
    setBusy(true); setError("");
    try { await api.delete(`/hr/payroll/${run.id}`); onBack(); await onRefresh(); }
    catch (e) { setError(e?.response?.data?.detail || "Fehler."); }
    finally { setBusy(false); }
  }

  function handlePdf() {
    const base = import.meta.env.VITE_API_BASE || "https://api.nillai.de";
    window.open(`${base}/hr/payroll/${run.id}/pdf`, "_blank");
  }

  const isFinalized = run.status === "finalized";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid var(--nill-border)", borderRadius: 7, padding: "0.4rem 0.8rem", color: "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.8rem" }}>← Zurück</button>
        <div>
          <span style={{ fontSize: "0.68rem", color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Lohnabrechnung</span>
          <h2 style={{ margin: "0.1rem 0 0", fontSize: "1.4rem", fontWeight: 800, color: "var(--nill-text)" }}>{MONTHS[run.month]} {run.year}</h2>
        </div>
        <StatusBadge status={run.status} />
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
          <button onClick={handlePdf} style={{ padding: "0.45rem 1rem", background: "var(--nill-surface)", border: "1px solid var(--nill-border)", borderRadius: 8, color: "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>PDF Export</button>
          {!isFinalized && (
            <>
              <button onClick={handleFinalize} disabled={busy} style={{ padding: "0.45rem 1rem", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 8, color: "#34d399", cursor: busy ? "not-allowed" : "pointer", fontSize: "0.8rem", fontWeight: 700 }}>
                {busy ? "…" : "Finalisieren"}
              </button>
              <button onClick={handleDelete} disabled={busy} style={{ padding: "0.45rem 0.9rem", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.22)", borderRadius: 8, color: "#f87171", cursor: busy ? "not-allowed" : "pointer", fontSize: "0.8rem" }}>
                Löschen
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {[
          { label: "Mitarbeiter", value: slips.length },
          { label: "Gesamtbrutto", value: fmt(run.total_gross) },
          { label: "Gesamtnetto (geschätzt)", value: fmt(run.total_net) },
        ].map(s => (
          <div key={s.label} style={{ padding: "0.65rem 1rem", background: "rgba(255,255,255,0.025)", border: "1px solid var(--nill-border)", borderRadius: 9, display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: "0.68rem", color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{s.label}</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--nill-text)" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {error && <div style={{ marginBottom: "0.75rem", fontSize: "0.8rem", color: "#f87171" }}>{error}</div>}

      {/* Table */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto", gap: "0.65rem", padding: "0.45rem 1rem", marginBottom: "0.3rem" }}>
        {["Mitarbeiter", "Brutto", "Zulagen", "SV-Anteil*", "Lohnsteuer*", "Netto*", ""].map(h => (
          <span key={h} style={{ fontSize: "0.63rem", fontWeight: 700, color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
        ))}
      </div>

      {loading ? (
        <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "2rem 0" }}>Lädt…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {slips.map(slip => {
            const bonusTotal = (slip.bonus || 0) + (slip.christmas_bonus || 0) + (slip.vacation_bonus || 0);
            return (
              <div key={slip.id}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto", gap: "0.65rem", alignItems: "center", padding: "0.75rem 1rem", border: "1px solid var(--nill-border)", borderRadius: 10, background: "transparent", transition: "background 0.12s" }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.83rem", color: "var(--nill-text)" }}>{slip.user_name || slip.user_email}</div>
                  {slip.user_name && <div style={{ fontSize: "0.7rem", color: "var(--nill-text-mute)" }}>{slip.user_email}</div>}
                  {slip.notes && <div style={{ fontSize: "0.7rem", color: "var(--nill-text-dim)", marginTop: 1, fontStyle: "italic" }}>{slip.notes}</div>}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--nill-text)" }}>{fmt(slip.gross_salary)}</div>
                <div style={{ fontSize: "0.82rem", color: bonusTotal > 0 ? "#34d399" : "var(--nill-text-dim)" }}>{bonusTotal > 0 ? fmt(bonusTotal) : "—"}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--nill-text-dim)" }}>{fmt(slip.social_security)}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--nill-text-dim)" }}>{fmt(slip.income_tax)}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--nill-gold)" }}>{fmt(slip.net_salary)}</div>
                {!isFinalized ? (
                  <button onClick={() => setEditSlip(slip)} style={{ padding: "0.35rem 0.7rem", background: "var(--nill-surface)", border: "1px solid var(--nill-border)", borderRadius: 7, color: "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.73rem", fontWeight: 600, whiteSpace: "nowrap" }}>Bearbeiten</button>
                ) : <div />}
              </div>
            );
          })}
        </div>
      )}

      <p style={{ marginTop: "0.9rem", fontSize: "0.71rem", color: "var(--nill-text-mute)" }}>
        * Steuer- und SV-Beträge sind Schätzwerte. Keine Steuer- oder Rechtsberatung.
      </p>

      {editSlip && (
        <SlipEditModal
          slip={editSlip}
          onSave={() => { setEditSlip(null); load(); onRefresh(); }}
          onClose={() => setEditSlip(null)}
        />
      )}
    </div>
  );
}

export function LohnAbrechnungContent() {
  const { isCompanyAdmin } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin());
  const now = new Date();

  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [selectedRun, setSelectedRun] = useState(null);
  const [newMonth, setNewMonth] = useState(now.getMonth() + 1);
  const [newYear, setNewYear] = useState(now.getFullYear());

  async function loadRuns() {
    setLoading(true);
    try {
      const res = await api.get("/hr/payroll");
      setRuns(res.data.runs ?? []);
    } catch { setRuns([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (isAdmin) loadRuns(); }, [isAdmin]);

  async function handleCreate() {
    setCreating(true); setCreateError("");
    try {
      const res = await api.post("/hr/payroll", { month: parseInt(newMonth), year: parseInt(newYear) });
      await loadRuns();
      setSelectedRun(res.data);
    } catch (err) {
      setCreateError(err?.response?.data?.detail || "Fehler beim Erstellen.");
    } finally {
      setCreating(false);
    }
  }

  if (!isAdmin) {
    return (
      <div style={{ color: "var(--nill-text-mute)", fontSize: "0.9rem", marginTop: "3rem", textAlign: "center" }}>
        Nur Administratoren können Lohnabrechnungen erstellen.
      </div>
    );
  }

  if (selectedRun) {
    return <RunDetail run={selectedRun} allRuns={runs} onBack={() => setSelectedRun(null)} onRefresh={loadRuns} />;
  }

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.3rem", color: "var(--nill-text)", letterSpacing: "-0.01em" }}>
          Lohnabrechnung
        </h2>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
          Monatliche Abrechnungen generieren, prüfen & als PDF exportieren
        </p>
      </div>

      {/* Neue Abrechnung */}
      <div style={{ padding: "1.25rem 1.4rem", background: "rgba(255,255,255,0.025)", border: "1px solid var(--nill-border)", borderRadius: 14, marginBottom: "1.75rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.85rem" }}>
          Neue Abrechnung erstellen
        </div>
        <div style={{ display: "flex", gap: "0.65rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: "0.68rem", color: "var(--nill-text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Monat</label>
            <select style={inputStyle} value={newMonth} onChange={e => setNewMonth(e.target.value)}>
              {MONTHS.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: "0.68rem", color: "var(--nill-text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Jahr</label>
            <select style={inputStyle} value={newYear} onChange={e => setNewYear(e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={handleCreate} disabled={creating} style={{ padding: "0.5rem 1.3rem", background: creating ? "var(--nill-border)" : "var(--nill-gold)", color: creating ? "var(--nill-text-mute)" : "#000", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.82rem", cursor: creating ? "not-allowed" : "pointer" }}>
            {creating ? "Erstelle…" : "Abrechnung erstellen"}
          </button>
        </div>
        {createError && <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "#f87171" }}>{createError}</div>}
      </div>

      {/* Liste */}
      <div style={{ fontSize: "0.73rem", fontWeight: 700, color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>
        Abrechnungsläufe
      </div>

      {loading ? (
        <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "2rem 0" }}>Lädt…</div>
      ) : runs.length === 0 ? (
        <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "2rem 0", textAlign: "center" }}>
          Noch keine Abrechnungen vorhanden.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {runs.map(run => (
            <div key={run.id} onClick={() => setSelectedRun(run)}
              style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr 1.5fr auto", gap: "1rem", alignItems: "center", padding: "0.9rem 1.2rem", border: "1px solid var(--nill-border)", borderRadius: 10, cursor: "pointer", transition: "background 0.12s, border-color 0.12s", background: "transparent" }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(197,165,114,0.25)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--nill-border)"; }}
            >
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--nill-text)" }}>{MONTHS[run.month]} {run.year}</span>
              <StatusBadge status={run.status} />
              <span style={{ fontSize: "0.82rem", color: "var(--nill-text-dim)" }}>Brutto: <strong style={{ color: "var(--nill-text)" }}>{fmt(run.total_gross)}</strong></span>
              <span style={{ fontSize: "0.82rem", color: "var(--nill-text-dim)" }}>Netto: <strong style={{ color: "var(--nill-gold)" }}>{fmt(run.total_net)}</strong></span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--nill-text-dim)" }}>
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function LohnAbrechnung() {
  return <PageLayout><LohnAbrechnungContent /></PageLayout>;
}
