import { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

/* ── kleine Style-Helfer ─────────────────────────────────── */
const inputStyle = {
  width: "100%", padding: "0.55rem 0.7rem",
  background: "var(--nill-surface)", border: "1px solid var(--nill-border)",
  borderRadius: 8, color: "var(--nill-text)", fontSize: "0.85rem", outline: "none",
};
const btnGold = {
  display: "inline-flex", alignItems: "center", gap: "0.4rem",
  padding: "0.5rem 1rem", borderRadius: 9, border: "1px solid rgba(197,165,114,0.28)",
  background: "var(--nill-gold-dim, rgba(197,165,114,0.12))", color: "var(--nill-gold)",
  fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
};
const btnGhost = {
  padding: "0.5rem 0.9rem", borderRadius: 9, border: "1px solid var(--nill-border)",
  background: "transparent", color: "var(--nill-text-dim)", fontSize: "0.8rem", cursor: "pointer",
};

function Overlay({ children, onClose }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000, padding: "1rem",
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        background: "var(--nill-bg)", border: "1px solid var(--nill-border)",
        borderRadius: 16, padding: "1.6rem", width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: "1rem",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ── Vorlagen-Editor (nur Admin) ─────────────────────────── */
function TemplateModal({ template, roles, onClose, onSaved }) {
  const editing = !!template;
  const [title, setTitle] = useState(template?.title || "");
  const [description, setDescription] = useState(template?.description || "");
  const [items, setItems] = useState(
    template?.items?.length ? template.items.map((i) => ({ id: i.id, text: i.text })) : [{ id: null, text: "" }]
  );
  const [roleIds, setRoleIds] = useState((template?.role_ids || []).map(String));
  const [active, setActive] = useState(template?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setItemText = (idx, val) =>
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, text: val } : it)));
  const addItem = () => setItems((arr) => [...arr, { id: null, text: "" }]);
  const removeItem = (idx) => setItems((arr) => arr.filter((_, i) => i !== idx));
  const toggleRole = (id) =>
    setRoleIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  async function save() {
    const cleanItems = items.filter((i) => i.text.trim()).map((i) => ({ id: i.id, text: i.text.trim() }));
    if (!title.trim()) { setError("Titel ist erforderlich"); return; }
    if (cleanItems.length === 0) { setError("Mindestens ein Punkt erforderlich"); return; }
    setSaving(true); setError("");
    try {
      const payload = {
        title: title.trim(), description: description || null,
        items: cleanItems, role_ids: roleIds.length ? roleIds : null, active,
      };
      if (editing) await api.put(`/checklists/templates/${template.id}`, payload);
      else await api.post("/checklists/templates", payload);
      onSaved();
      onClose();
    } catch (e) {
      setError(e?.response?.data?.detail || "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--nill-text)" }}>
          {editing ? "Checkliste bearbeiten" : "Neue Checkliste"}
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--nill-text-dim)", fontSize: "1.2rem" }}>✕</button>
      </div>

      <input style={inputStyle} placeholder="Titel (z. B. Schließdienst Abend)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea style={{ ...inputStyle, minHeight: 52, resize: "vertical" }} placeholder="Beschreibung (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />

      {/* Punkte */}
      <div>
        <label style={{ fontSize: "0.69rem", color: "var(--nill-text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Punkte</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.4rem" }}>
          {items.map((it, idx) => (
            <div key={idx} style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <span style={{ color: "var(--nill-text-dim)", fontSize: "0.8rem", width: 18 }}>{idx + 1}.</span>
              <input style={inputStyle} placeholder={`Punkt ${idx + 1}`} value={it.text} onChange={(e) => setItemText(idx, e.target.value)} />
              <button onClick={() => removeItem(idx)} disabled={items.length === 1}
                style={{ ...btnGhost, padding: "0.4rem 0.6rem", opacity: items.length === 1 ? 0.4 : 1 }}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={addItem} style={{ ...btnGhost, marginTop: "0.5rem" }}>+ Punkt hinzufügen</button>
      </div>

      {/* Rollen-Ziel */}
      <div>
        <label style={{ fontSize: "0.69rem", color: "var(--nill-text-dim)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Sichtbar für
        </label>
        <p style={{ fontSize: "0.72rem", color: "var(--nill-text-mute)", margin: "0.25rem 0 0.4rem" }}>
          {roleIds.length === 0 ? "Ganzes Team (keine Rolle ausgewählt)" : "Nur ausgewählte Rollen"}
        </p>
        {roles.length === 0 ? (
          <p style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)" }}>Keine Rollen angelegt.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {roles.map((r) => (
              <label key={r.id} style={{
                display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer",
                padding: "0.3rem 0.6rem", borderRadius: 8, fontSize: "0.78rem",
                border: `1px solid ${roleIds.includes(String(r.id)) ? "rgba(197,165,114,0.5)" : "var(--nill-border)"}`,
                background: roleIds.includes(String(r.id)) ? "rgba(197,165,114,0.12)" : "transparent",
                color: "var(--nill-text)",
              }}>
                <input type="checkbox" checked={roleIds.includes(String(r.id))} onChange={() => toggleRole(String(r.id))} />
                {r.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "var(--nill-text)" }}>
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Aktiv (kann durchgeführt werden)
      </label>

      {error && <p style={{ color: "#f87171", fontSize: "0.8rem", margin: 0 }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        <button onClick={onClose} style={btnGhost}>Abbrechen</button>
        <button onClick={save} disabled={saving} style={{ ...btnGold, opacity: saving ? 0.6 : 1 }}>
          {saving ? "Speichern…" : "Speichern"}
        </button>
      </div>
    </Overlay>
  );
}

/* ── Durchführung (jeder Mitarbeiter) ────────────────────── */
function RunModal({ run: initial, onClose, onChanged }) {
  const [run, setRun] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const readOnly = run.editable === false || run.status === "completed";

  const setChecked = (id, checked) =>
    setRun((r) => ({ ...r, items: r.items.map((it) => (it.id === id ? { ...it, checked } : it)) }));
  const setNote = (id, note) =>
    setRun((r) => ({ ...r, items: r.items.map((it) => (it.id === id ? { ...it, note } : it)) }));

  const done = run.items.filter((i) => i.checked).length;

  async function persist(status) {
    setSaving(true); setError("");
    try {
      const payload = {
        items: run.items.map((i) => ({ id: i.id, checked: !!i.checked, note: i.note ?? null })),
        note: run.note ?? null,
      };
      if (status) payload.status = status;
      const res = await api.put(`/checklists/runs/${run.id}`, payload);
      setRun(res.data);
      onChanged?.();
      if (status === "completed") onClose();
    } catch (e) {
      setError(e?.response?.data?.detail || "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--nill-text)" }}>{run.title}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--nill-text-mute)" }}>
            {done}/{run.items.length} erledigt
            {run.status === "completed" ? " · abgeschlossen" : ""}
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--nill-text-dim)", fontSize: "1.2rem" }}>✕</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {run.items.map((it) => (
          <div key={it.id} style={{
            border: "1px solid var(--nill-border)", borderRadius: 10, padding: "0.6rem 0.75rem",
            background: it.checked ? "rgba(197,165,114,0.06)" : "transparent",
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: readOnly ? "default" : "pointer" }}>
              <input type="checkbox" checked={!!it.checked} disabled={readOnly}
                onChange={(e) => setChecked(it.id, e.target.checked)}
                style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span style={{
                fontSize: "0.88rem", color: "var(--nill-text)",
                textDecoration: it.checked ? "line-through" : "none",
                opacity: it.checked ? 0.7 : 1,
              }}>{it.text}</span>
            </label>
            {!readOnly && (
              <input style={{ ...inputStyle, marginTop: "0.4rem", fontSize: "0.78rem", padding: "0.35rem 0.5rem" }}
                placeholder="Notiz (optional)" value={it.note || ""} onChange={(e) => setNote(it.id, e.target.value)} />
            )}
            {readOnly && it.note && (
              <p style={{ fontSize: "0.75rem", color: "var(--nill-text-mute)", margin: "0.3rem 0 0" }}>📝 {it.note}</p>
            )}
          </div>
        ))}
      </div>

      {error && <p style={{ color: "#f87171", fontSize: "0.8rem", margin: 0 }}>{error}</p>}

      {!readOnly && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button onClick={() => persist(null)} disabled={saving} style={btnGhost}>Zwischenspeichern</button>
          <button onClick={() => persist("completed")} disabled={saving} style={{ ...btnGold, opacity: saving ? 0.6 : 1 }}>
            {saving ? "…" : "Abschließen"}
          </button>
        </div>
      )}
    </Overlay>
  );
}

/* ── Hauptseite ──────────────────────────────────────────── */
export default function Checklisten() {
  const { isCompanyAdmin } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin?.());

  const [templates, setTemplates] = useState([]);
  const [runs, setRuns] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTpl, setEditTpl] = useState(null);       // Objekt oder {} für neu
  const [activeRun, setActiveRun] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [t, r] = await Promise.all([
        api.get("/checklists/templates"),
        api.get("/checklists/runs", { params: { limit: 50 } }),
      ]);
      setTemplates(Array.isArray(t.data) ? t.data : []);
      setRuns(Array.isArray(r.data) ? r.data : []);
    } catch {
      setTemplates([]); setRuns([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!isAdmin) return;
    api.get("/team/roles").then((res) => setRoles(Array.isArray(res.data) ? res.data : [])).catch(() => setRoles([]));
  }, [isAdmin]);

  async function startRun(tpl) {
    try {
      const res = await api.post("/checklists/runs", { template_id: tpl.id });
      setActiveRun(res.data);
      load();
    } catch (e) {
      alert(e?.response?.data?.detail || "Konnte nicht gestartet werden");
    }
  }

  async function openRun(runId) {
    try {
      const res = await api.get(`/checklists/runs/${runId}`);
      setActiveRun(res.data);
    } catch (e) {
      alert(e?.response?.data?.detail || "Durchführung nicht gefunden");
    }
  }

  async function deleteTemplate(tpl) {
    if (!window.confirm(`Checkliste „${tpl.title}" löschen? Durchführungen bleiben erhalten.`)) return;
    try { await api.delete(`/checklists/templates/${tpl.id}`); load(); }
    catch (e) { alert(e?.response?.data?.detail || "Löschen fehlgeschlagen"); }
  }

  const openRuns = useMemo(() => runs.filter((r) => r.status !== "completed"), [runs]);

  return (
    <PageLayout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: 0, color: "var(--nill-text)" }}>Checklisten</h1>
          <p style={{ margin: "0.3rem 0 0", fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
            Wiederkehrende Abläufe – abhaken, dokumentieren, nichts vergessen.
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setEditTpl({})} style={btnGold}>+ Neue Checkliste</button>
        )}
      </div>

      {loading ? (
        <p style={{ fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>Lade Checklisten…</p>
      ) : (
        <>
          {/* Verfügbare Checklisten */}
          <SectionTitle>Verfügbare Checklisten</SectionTitle>
          {templates.length === 0 ? (
            <Empty>{isAdmin ? "Noch keine Checkliste angelegt." : "Aktuell sind keine Checklisten für dich freigegeben."}</Empty>
          ) : (
            <div style={gridStyle}>
              {templates.map((t) => (
                <div key={t.id} style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: "var(--nill-text)", fontSize: "0.95rem" }}>{t.title}</div>
                      {t.description && <div style={{ fontSize: "0.76rem", color: "var(--nill-text-mute)", marginTop: 2 }}>{t.description}</div>}
                    </div>
                    {!t.active && <span style={badge("#888")}>inaktiv</span>}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--nill-text-dim)", margin: "0.5rem 0" }}>
                    {t.items?.length || 0} Punkte
                    {t.role_names?.length ? ` · ${t.role_names.join(", ")}` : " · ganzes Team"}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button onClick={() => startRun(t)} disabled={!t.active} style={{ ...btnGold, opacity: t.active ? 1 : 0.5 }}>
                      Starten
                    </button>
                    {isAdmin && (
                      <>
                        <button onClick={() => setEditTpl(t)} style={btnGhost}>Bearbeiten</button>
                        <button onClick={() => deleteTemplate(t)} style={{ ...btnGhost, color: "#f87171" }}>Löschen</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Durchführungen */}
          <SectionTitle style={{ marginTop: "2rem" }}>
            {isAdmin ? "Durchführungen (ganzes Team)" : "Meine Durchführungen"}
          </SectionTitle>
          {runs.length === 0 ? (
            <Empty>Noch keine Durchführungen.</Empty>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {runs.map((r) => {
                const done = r.checked_count ?? 0;
                const total = r.total_count ?? (r.items?.length || 0);
                const pct = total ? Math.round((done / total) * 100) : 0;
                return (
                  <button key={r.id} onClick={() => openRun(r.id)} style={runRowStyle}>
                    <div style={{ minWidth: 0, textAlign: "left" }}>
                      <div style={{ fontWeight: 600, color: "var(--nill-text)", fontSize: "0.88rem" }}>{r.title}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--nill-text-mute)" }}>
                        {isAdmin && r.user_name ? `${r.user_name} · ` : ""}
                        {r.started_at ? new Date(r.started_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--nill-text-dim)" }}>{done}/{total}</span>
                      <span style={badge(r.status === "completed" ? "var(--nill-gold)" : "#93c5fd")}>
                        {r.status === "completed" ? "fertig" : `${pct}%`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {editTpl && (
        <TemplateModal
          template={editTpl.id ? editTpl : null}
          roles={roles}
          onClose={() => setEditTpl(null)}
          onSaved={load}
        />
      )}
      {activeRun && (
        <RunModal run={activeRun} onClose={() => setActiveRun(null)} onChanged={load} />
      )}
    </PageLayout>
  );
}

/* ── kleine Präsentations-Helfer ─────────────────────────── */
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.85rem" };
const cardStyle = {
  border: "1px solid var(--nill-border)", borderRadius: 12, padding: "0.9rem 1rem",
  background: "rgba(var(--tint),0.02)", display: "flex", flexDirection: "column",
};
const runRowStyle = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem",
  width: "100%", padding: "0.7rem 0.9rem", borderRadius: 10,
  border: "1px solid var(--nill-border)", background: "rgba(var(--tint),0.02)", cursor: "pointer",
};
const badge = (color) => ({
  fontSize: "0.64rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99,
  color, background: "rgba(255,255,255,0.05)", border: "1px solid var(--nill-border)", whiteSpace: "nowrap",
});

function SectionTitle({ children, style }) {
  return (
    <div style={{
      fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em",
      color: "var(--nill-text-mute)", margin: "0 0 0.75rem", ...style,
    }}>{children}</div>
  );
}
function Empty({ children }) {
  return <p style={{ fontSize: "0.82rem", color: "var(--nill-text-dim)" }}>{children}</p>;
}
