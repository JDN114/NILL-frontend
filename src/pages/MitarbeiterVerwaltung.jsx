import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const CONTRACT_TYPES = ["Vollzeit", "Teilzeit", "Minijob", "Werkstudent", "Praktikant", "Freiberuflich"];
const TAX_CLASSES = [1, 2, 3, 4, 5, 6];
const HEALTH_INS_TYPES = ["gesetzlich", "privat"];

const inputStyle = {
  width: "100%", padding: "0.5rem 0.75rem",
  background: "var(--nill-surface)",
  border: "1px solid var(--nill-border)",
  borderRadius: 7, color: "var(--nill-text)",
  fontSize: "0.8rem", outline: "none", boxSizing: "border-box",
};

function ContractBadge({ type }) {
  const colors = {
    Vollzeit: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)", text: "#34d399" },
    Teilzeit: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)", text: "#fbbf24" },
    Minijob: { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)", text: "#94a3b8" },
  };
  const c = colors[type] || { bg: "rgba(197,165,114,0.1)", border: "rgba(197,165,114,0.25)", text: "var(--nill-gold)" };
  return (
    <span style={{
      fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      whiteSpace: "nowrap",
    }}>
      {type || "—"}
    </span>
  );
}

function ProfileForm({ employee, onSave, onClose }) {
  const p = employee.profile || {};
  const [userInfo, setUserInfo] = useState({ full_name: employee.full_name || "" });
  const [form, setForm] = useState({
    birthday: p.birthday || "",
    contract_type: p.contract_type || "Vollzeit",
    start_date: p.start_date || "",
    end_date: p.end_date || "",
    pay_grade: p.pay_grade || "",
    department: p.department || "",
    salary_monthly: p.salary_monthly || "",
    tax_class: p.tax_class || 1,
    health_insurance: p.health_insurance || "",
    health_insurance_type: p.health_insurance_type || "gesetzlich",
    annual_vacation_days: p.annual_vacation_days ?? 24,
    notes: p.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSave() {
    setSaving(true); setError("");
    try {
      await Promise.all([
        api.patch(`/hr/employees/${employee.id}/user-info`, { full_name: userInfo.full_name || null }),
        (async () => {
          const method = employee.profile ? "patch" : "post";
          await api[method](`/hr/employees/${employee.id}/profile`, {
            ...form,
            salary_monthly: form.salary_monthly ? parseFloat(form.salary_monthly) : null,
            tax_class: parseInt(form.tax_class),
            annual_vacation_days: parseInt(form.annual_vacation_days),
            birthday: form.birthday || null,
            start_date: form.start_date || null,
            end_date: form.end_date || null,
          });
        })(),
      ]);
      onSave();
    } catch (err) {
      setError(err?.response?.data?.detail || "Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  const row = (children) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>{children}</div>
  );
  const field = (label, children) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <label style={{ fontSize: "0.69rem", color: "var(--nill-text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        background: "var(--nill-bg)",
        border: "1px solid var(--nill-border)",
        borderRadius: 16, padding: "1.75rem",
        width: "100%", maxWidth: 580,
        maxHeight: "90vh", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: "1rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--nill-text)" }}>
            Mitarbeiterprofil — {employee.email}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer",
            color: "var(--nill-text-dim)", fontSize: "1.2rem" }}>✕</button>
        </div>

        {row(
          <>
            {field("Vollständiger Name",
              <input style={inputStyle} value={userInfo.full_name}
                onChange={e => setUserInfo(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Max Mustermann" />
            )}
            {field("Geburtstag",
              <input style={inputStyle} type="date" value={form.birthday}
                onChange={e => set("birthday", e.target.value)} />
            )}
          </>
        )}

        {row(
          <>
            {field("Vertragsart",
              <select style={inputStyle} value={form.contract_type} onChange={e => set("contract_type", e.target.value)}>
                {CONTRACT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            )}
            {field("Abteilung",
              <input style={inputStyle} value={form.department} onChange={e => set("department", e.target.value)} placeholder="z.B. Vertrieb" />
            )}
          </>
        )}
        {row(
          <>
            {field("Eintrittsdatum",
              <input style={inputStyle} type="date" value={form.start_date} onChange={e => set("start_date", e.target.value)} />
            )}
            {field("Austrittsdatum (optional)",
              <input style={inputStyle} type="date" value={form.end_date} onChange={e => set("end_date", e.target.value)} />
            )}
          </>
        )}
        {row(
          <>
            {field("Lohngruppe / Gehaltsstufe",
              <input style={inputStyle} value={form.pay_grade} onChange={e => set("pay_grade", e.target.value)} placeholder="z.B. EG 5" />
            )}
            {field("Bruttogehalt / Monat (€)",
              <input style={inputStyle} type="number" value={form.salary_monthly} onChange={e => set("salary_monthly", e.target.value)} placeholder="3500" />
            )}
          </>
        )}
        {row(
          <>
            {field("Steuerklasse",
              <select style={inputStyle} value={form.tax_class} onChange={e => set("tax_class", e.target.value)}>
                {TAX_CLASSES.map(c => <option key={c} value={c}>Klasse {c}</option>)}
              </select>
            )}
            {field("Urlaubsanspruch (Tage/Jahr)",
              <input style={inputStyle} type="number" value={form.annual_vacation_days}
                onChange={e => set("annual_vacation_days", e.target.value)} min={0} max={60} />
            )}
          </>
        )}
        {row(
          <>
            {field("Krankenversicherung",
              <input style={inputStyle} value={form.health_insurance} onChange={e => set("health_insurance", e.target.value)} placeholder="TK, AOK, …" />
            )}
            {field("KV-Typ",
              <select style={inputStyle} value={form.health_insurance_type} onChange={e => set("health_insurance_type", e.target.value)}>
                {HEALTH_INS_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            )}
          </>
        )}
        {field("Notizen (intern)",
          <textarea style={{ ...inputStyle, minHeight: 64, resize: "vertical" }}
            value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Interne Anmerkungen" />
        )}

        {error && <span style={{ fontSize: "0.78rem", color: "#f87171" }}>{error}</span>}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "0.55rem 1.2rem", background: "transparent",
            border: "1px solid var(--nill-border)", borderRadius: 8,
            color: "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.82rem",
          }}>
            Abbrechen
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            padding: "0.55rem 1.4rem",
            background: saving ? "var(--nill-border)" : "var(--nill-gold)",
            color: saving ? "var(--nill-text-mute)" : "#000",
            border: "none", borderRadius: 8,
            fontWeight: 700, fontSize: "0.82rem", cursor: saving ? "not-allowed" : "pointer",
          }}>
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeeRow({ employee, onEdit, onDelete }) {
  const p = employee.profile;
  const fmt = (n) => n != null
    ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n)
    : "—";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
      gap: "1rem",
      alignItems: "center",
      padding: "0.85rem 1.1rem",
      border: "1px solid var(--nill-border)",
      borderRadius: 10,
      background: "transparent",
      transition: "background 0.12s",
    }}
      onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
      onMouseOut={e => e.currentTarget.style.background = "transparent"}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--nill-text)" }}>
          {employee.full_name || employee.email}
        </div>
        {employee.full_name && (
          <div style={{ fontSize: "0.72rem", color: "var(--nill-text-mute)" }}>{employee.email}</div>
        )}
        {p?.department && (
          <div style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)", marginTop: 1 }}>{p.department}</div>
        )}
        {p?.birthday && (
          <div style={{ fontSize: "0.7rem", color: "var(--nill-text-dim)", marginTop: 1 }}>
            🎂 {new Date(p.birthday).toLocaleDateString("de-DE")}
          </div>
        )}
      </div>

      <div>
        {p ? <ContractBadge type={p.contract_type} /> : <span style={{ color: "var(--nill-text-dim)", fontSize: "0.78rem" }}>—</span>}
      </div>

      <div style={{ fontSize: "0.8rem", color: "var(--nill-text-dim)" }}>
        {p?.start_date ? new Date(p.start_date).toLocaleDateString("de-DE") : "—"}
      </div>

      <div style={{ fontSize: "0.8rem", color: "var(--nill-text-dim)" }}>
        {p?.pay_grade || "—"}
      </div>

      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--nill-text)" }}>
        {fmt(p?.salary_monthly)}
      </div>

      <div style={{ display: "flex", gap: "0.4rem" }}>
        <button onClick={() => onEdit(employee)} style={{
          padding: "0.4rem 0.85rem",
          background: "var(--nill-surface)",
          border: "1px solid var(--nill-border)",
          borderRadius: 7, color: "var(--nill-text-dim)",
          cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
          transition: "border-color 0.12s, color 0.12s",
        }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(197,165,114,0.4)"; e.currentTarget.style.color = "var(--nill-gold)"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "var(--nill-border)"; e.currentTarget.style.color = "var(--nill-text-dim)"; }}
        >
          Bearbeiten
        </button>
        <button onClick={() => onDelete(employee)} style={{
          padding: "0.4rem 0.7rem",
          background: "transparent",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 7, color: "rgba(239,68,68,0.6)",
          cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
          transition: "border-color 0.12s, color 0.12s, background 0.12s",
        }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; e.currentTarget.style.color = "rgba(239,68,68,0.6)"; e.currentTarget.style.background = "transparent"; }}
        >
          Entfernen
        </button>
      </div>
    </div>
  );
}

export function MitarbeiterContent() {
  const { isCompanyAdmin } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin());

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/hr/employees");
      setEmployees(res.data?.employees ?? []);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(employee) {
    setDeletingEmployee(employee);
  }

  async function confirmDelete() {
    if (!deletingEmployee) return;
    try {
      await api.delete(`/hr/employees/${deletingEmployee.id}`);
      setDeletingEmployee(null);
      load();
    } catch (err) {
      alert(err?.response?.data?.detail || "Fehler beim Entfernen.");
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = employees.filter(e =>
    (e.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.profile?.department || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalGross = employees.reduce((s, e) => s + parseFloat(e.profile?.salary_monthly || 0), 0);
  const withProfile = employees.filter(e => e.profile).length;

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .mv-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .mv-table-inner  { min-width: 560px; }
          .mv-form-grid-2  { grid-template-columns: 1fr !important; }
          .mv-modal        { padding: 1.25rem !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{
          fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.3rem",
          color: "var(--nill-text)", letterSpacing: "-0.01em",
        }}>
          Mitarbeiterverwaltung
        </h2>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
          Stammdaten, Vertragsart, Eintrittsdatum, Steuerklasse & Lohngruppe
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {[
          { label: "Mitarbeiter", value: employees.length },
          { label: "Vollständig erfasst", value: `${withProfile} / ${employees.length}` },
          { label: "Gesamtbrutto / Monat", value: totalGross > 0
            ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(totalGross) : "—" },
        ].map(s => (
          <div key={s.label} style={{
            padding: "0.65rem 1rem",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid var(--nill-border)",
            borderRadius: 9, display: "flex", flexDirection: "column", gap: 2,
          }}>
            <span style={{ fontSize: "0.68rem", color: "var(--nill-text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{s.label}</span>
            <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--nill-text)" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          style={{ ...inputStyle, maxWidth: 320 }}
          placeholder="Suche nach Name, E-Mail oder Abteilung…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table (scrollable on mobile) */}
      <div className="mv-table-scroll">
        <div className="mv-table-inner">

          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
            gap: "1rem",
            padding: "0.5rem 1.1rem",
            marginBottom: "0.35rem",
          }}>
            {["Mitarbeiter", "Vertragsart", "Eintrittsdatum", "Lohngruppe", "Bruttogehalt", ""].map(h => (
              <span key={h} style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--nill-text-dim)",
                textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "2rem 0" }}>Lädt…</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "2rem 0", textAlign: "center" }}>
              Keine Mitarbeiter gefunden.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {filtered.map(e => (
                <EmployeeRow key={e.id} employee={e} onEdit={setEditing} onDelete={handleDelete} />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <ProfileForm
          employee={editing}
          onSave={() => { setEditing(null); load(); }}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Delete confirm modal */}
      {deletingEmployee && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }}>
          <div style={{
            background: "var(--nill-bg)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 400,
            display: "flex", flexDirection: "column", gap: "1rem",
          }}>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "#ef4444" }}>Mitarbeiter entfernen</div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--nill-text-mute)", lineHeight: 1.5 }}>
              Soll <strong style={{ color: "var(--nill-text)" }}>{deletingEmployee.full_name || deletingEmployee.email}</strong> wirklich aus der Organisation entfernt werden?
              Das Konto bleibt bestehen, verliert aber den Zugang zur Organisation.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setDeletingEmployee(null)} style={{
                padding: "0.55rem 1.2rem", background: "transparent",
                border: "1px solid var(--nill-border)", borderRadius: 8,
                color: "var(--nill-text-dim)", cursor: "pointer", fontSize: "0.82rem",
              }}>Abbrechen</button>
              <button onClick={confirmDelete} style={{
                padding: "0.55rem 1.4rem", background: "#ef4444",
                border: "none", borderRadius: 8, color: "#fff",
                fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
              }}>Entfernen</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function MitarbeiterVerwaltung() {
  return <PageLayout><MitarbeiterContent /></PageLayout>;
}
