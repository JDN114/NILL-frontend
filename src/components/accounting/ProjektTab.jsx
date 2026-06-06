// src/components/accounting/ProjektTab.jsx — Projekt-Tracking (F24) + Zeiterfassung (F25)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const today = () => new Date().toISOString().slice(0, 10);

const STATUS_COLORS = { aktiv: "ac-badge-green", abgeschlossen: "ac-badge-gray", pausiert: "ac-badge-purple" };

// ─── Projekt-Form ─────────────────────────────────────────────────────────────
function ProjektForm({ initial, onSaved, onClose }) {
  const [form, setForm] = useState(() => ({
    name: "", beschreibung: "", kunde: "", budget: "", status: "aktiv",
    startdatum: today(), enddatum: "", farbe: "#c6ff3c",
    ...(initial || {}),
  }));
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) { setErr("Projektname ist Pflicht."); return; }
    setSaving(true); setErr("");
    try {
      if (initial?.id) await api.put(`/api/v1/projekte/${initial.id}`, form);
      else             await api.post("/api/v1/projekte", form);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 520 }}>
        <div className="ac-modal-title">{initial?.id ? "Projekt bearbeiten" : "Neues Projekt"}</div>
        {err && <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}
        <div className="ac-form-row">
          <div className="ac-form-col" style={{ flex: 3 }}>
            <label className="ac-label">Projektname *</label>
            <input aria-required="true" className="ac-input" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="ac-form-col" style={{ maxWidth: 56 }}>
            <label className="ac-label">Farbe</label>
            <input type="color" value={form.farbe} onChange={e => set("farbe", e.target.value)}
              style={{ width: "100%", height: 38, border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", padding: 2 }} />
          </div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Kunde</label>
            <input className="ac-input" value={form.kunde} onChange={e => set("kunde", e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Budget €</label>
            <input className="ac-input" type="number" min="0" step="100" value={form.budget}
              onChange={e => set("budget", e.target.value)} />
          </div>
          <div className="ac-form-col" style={{ maxWidth: 130 }}>
            <label className="ac-label">Status</label>
            <select className="ac-select" value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="aktiv">Aktiv</option>
              <option value="pausiert">Pausiert</option>
              <option value="abgeschlossen">Abgeschlossen</option>
            </select>
          </div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Startdatum</label>
            <input className="ac-input" type="date" value={form.startdatum} onChange={e => set("startdatum", e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Enddatum</label>
            <input className="ac-input" type="date" value={form.enddatum} onChange={e => set("enddatum", e.target.value)} />
          </div>
        </div>
        <div className="ac-form-col" style={{ marginBottom: 8 }}>
          <label className="ac-label">Beschreibung</label>
          <textarea className="ac-input" rows={2} value={form.beschreibung}
            onChange={e => set("beschreibung", e.target.value)} style={{ resize: "vertical" }} />
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>{saving ? "…" : "Speichern"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Zeiterfassungs-Form ──────────────────────────────────────────────────────
function ZeitForm({ projekte, initial, onSaved, onClose }) {
  const [form, setForm] = useState(() => ({
    datum: today(), beschreibung: "", stunden: "", stundensatz: "", projekt_id: "",
    ...(initial || {}),
  }));
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const betrag = (parseFloat(form.stunden || 0) * parseFloat(form.stundensatz || 0)).toFixed(2);

  const save = async () => {
    if (!form.beschreibung.trim() || !form.stunden) { setErr("Beschreibung und Stunden sind Pflicht."); return; }
    setSaving(true); setErr("");
    try {
      const payload = { ...form, projekt_id: form.projekt_id ? parseInt(form.projekt_id) : null };
      if (initial?.id) await api.put(`/api/v1/zeiterfassung/${initial.id}`, payload);
      else             await api.post("/api/v1/zeiterfassung", payload);
      onSaved();
    } catch (e) { setErr(e.response?.data?.detail || "Fehler."); }
    finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 500 }}>
        <div className="ac-modal-title">{initial?.id ? "Zeiteintrag bearbeiten" : "Zeit erfassen"}</div>
        {err && <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Datum</label>
            <input className="ac-input" type="date" value={form.datum} onChange={e => set("datum", e.target.value)} /></div>
          <div className="ac-form-col">
            <label className="ac-label">Projekt</label>
            <select className="ac-select" value={form.projekt_id} onChange={e => set("projekt_id", e.target.value)}>
              <option value="">— kein Projekt —</option>
              {projekte.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="ac-form-col" style={{ marginBottom: 12 }}>
          <label className="ac-label">Tätigkeit *</label>
          <input className="ac-input" value={form.beschreibung} onChange={e => set("beschreibung", e.target.value)} placeholder="Entwicklung, Beratung…" />
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Stunden *</label>
            <input className="ac-input" type="number" min="0.25" step="0.25" value={form.stunden}
              onChange={e => set("stunden", e.target.value)} /></div>
          <div className="ac-form-col"><label className="ac-label">Stundensatz €</label>
            <input className="ac-input" type="number" min="0" step="5" value={form.stundensatz}
              onChange={e => set("stundensatz", e.target.value)} /></div>
          <div className="ac-form-col" style={{ maxWidth: 110 }}>
            <label className="ac-label">Betrag</label>
            <div className="ac-input" style={{ background: "transparent", color: "var(--accent)", fontWeight: 700 }}>{fmtEur(betrag)}</div>
          </div>
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>{saving ? "…" : "Speichern"}</button>
        </div>
      </div>
    </div>
  );
}

export default function ProjektTab() {
  const [projekte, setProjekte] = useState([]);
  const [zeiten, setZeiten]     = useState({ eintraege: [], gesamt_stunden: 0, gesamt_betrag: 0 });
  const [loading, setLoading]   = useState(true);
  const [subTab, setSubTab]     = useState("projekte");
  const [modal, setModal]       = useState(null);
  const [msg, setMsg]           = useState(null);
  const [selected, setSelected] = useState(null); // selected Zeiteintrag IDs for fakturierung
  const [fakModal, setFakModal] = useState(false);
  const [fakEmpf, setFakEmpf]   = useState("");
  const [fakLoading, setFakLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/v1/projekte").then(r => setProjekte(r.data?.projekte || [])).catch(() => {}),
      api.get("/api/v1/zeiterfassung?fakturiert=false").then(r => setZeiten(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const del = async (type, id) => {
    if (!confirm(`${type === "projekt" ? "Projekt" : "Zeiteintrag"} löschen?`)) return;
    try {
      if (type === "projekt") await api.delete(`/api/v1/projekte/${id}`);
      else                    await api.delete(`/api/v1/zeiterfassung/${id}`);
      load();
    } catch (e) { setMsg({ type: "err", text: e.response?.data?.detail || "Fehler" }); }
  };

  const fakturieren = async () => {
    if (!fakEmpf.trim()) return;
    setFakLoading(true);
    try {
      const r = await api.post("/api/v1/zeiterfassung/fakturieren", {
        eintrag_ids: selected, empfaenger_name: fakEmpf,
      });
      setFakModal(false); setSelected(null); setFakEmpf("");
      load();
      setMsg({ type: "ok", text: `Rechnung ${r.data.rechnungsnummer} erstellt.` });
    } catch (e) { setMsg({ type: "err", text: e.response?.data?.detail || "Fehler" }); }
    finally { setFakLoading(false); }
  };

  const offeneStunden = zeiten.gesamt_stunden || 0;
  const offenesVolumen = zeiten.gesamt_betrag || 0;

  return (
    <div>
      {msg && <div role={msg.type === "ok" ? "status" : "alert"} aria-live="polite" className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
        style={{ cursor: "pointer", marginBottom: 16 }} onClick={() => setMsg(null)}>{msg.text}</div>}

      <div style={{ display: "flex", gap: 4, background: "var(--surface)", borderRadius: 10, padding: 4, marginBottom: 20, width: "fit-content" }}>
        {[["projekte","Projekte"],["zeiten","Zeiterfassung"]].map(([id, label]) => (
          <button key={id} className={`ac-tab${subTab === id ? " active" : ""}`} onClick={() => setSubTab(id)}>{label}</button>
        ))}
      </div>

      {/* ── Projekte ── */}
      {subTab === "projekte" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Projekte</span>
            <button className="ac-btn ac-btn-primary" onClick={() => setModal({ type: "projekt" })}>+ Neues Projekt</button>
          </div>
          {loading ? <div role="status" aria-live="polite" className="ac-loading"><span className="ac-spinner" aria-hidden="true" /></div> :
            projekte.length === 0 ? <div className="ac-empty"><div style={{ fontSize: "2rem" }}>📁</div><div>Noch keine Projekte.</div></div> :
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
              {projekte.map(p => {
                const pct = p.budget > 0 ? Math.min(p.ist_einnahmen / p.budget * 100, 100) : 0;
                return (
                  <div key={p.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, borderLeftColor: p.farbe || "#c6ff3c", borderLeftWidth: 3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        {p.kunde && <div style={{ fontSize: ".78rem", color: "var(--ink2)" }}>{p.kunde}</div>}
                      </div>
                      <span className={`ac-badge ${STATUS_COLORS[p.status] || "ac-badge-gray"}`}>{p.status}</span>
                    </div>
                    {p.budget > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".75rem", color: "var(--ink2)", marginBottom: 3 }}>
                          <span>{fmtEur(p.ist_einnahmen)}</span><span>{fmtEur(p.budget)}</span>
                        </div>
                        <div style={{ height: 5, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: p.farbe || "#c6ff3c", borderRadius: 3, transition: "width .3s" }} />
                        </div>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                      <button className="ac-btn ac-btn-ghost ac-btn-sm" aria-label="Projekt bearbeiten" onClick={() => setModal({ type: "projekt", ...p })}>✏️</button>
                      <button className="ac-btn ac-btn-danger ac-btn-sm" aria-label="Projekt löschen" onClick={() => del("projekt", p.id)}>🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      )}

      {/* ── Zeiterfassung ── */}
      {subTab === "zeiten" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Zeiterfassung</span>
              <span style={{ fontSize: ".78rem", color: "var(--ink2)", marginLeft: 10 }}>
                Offen: {Number(offeneStunden).toFixed(2)} h · {fmtEur(offenesVolumen)}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {selected?.length > 0 && (
                <button className="ac-btn ac-btn-primary" style={{ background: "var(--a2)", color: "#fff" }}
                  onClick={() => setFakModal(true)}>
                  → Rechnung ({selected.length})
                </button>
              )}
              <button className="ac-btn ac-btn-primary" onClick={() => setModal({ type: "zeit" })}>+ Zeit erfassen</button>
            </div>
          </div>

          {zeiten.eintraege?.length === 0 ? (
            <div className="ac-empty"><div style={{ fontSize: "2rem" }}>⏱</div><div>Noch keine Zeiteinträge.</div></div>
          ) : (
            <div className="ac-card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="ac-table-wrap">
                <table aria-label="Projekte" className="ac-table">
                  <thead>
                    <tr>
                      <th scope="col"><input type="checkbox" aria-label="Alle Einträge auswählen" onChange={e => setSelected(e.target.checked ? zeiten.eintraege.map(z => z.id) : [])} /></th>
                      <th scope="col">Datum</th><th scope="col">Tätigkeit</th><th scope="col">Projekt</th>
                      <th scope="col" style={{ textAlign: "right" }}>Stunden</th>
                      <th scope="col" style={{ textAlign: "right" }}>Stundensatz</th>
                      <th scope="col" style={{ textAlign: "right" }}>Betrag</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {zeiten.eintraege.map(z => (
                      <tr key={z.id}>
                        <td><input type="checkbox" aria-label={`Zeiteintrag ${z.datum} auswählen`} checked={selected?.includes(z.id) || false}
                          onChange={e => setSelected(prev => e.target.checked ? [...(prev||[]), z.id] : (prev||[]).filter(id => id !== z.id))} /></td>
                        <td className="ac-mono" style={{ fontSize: ".82rem" }}>{z.datum}</td>
                        <td>{z.beschreibung}</td>
                        <td style={{ color: "var(--ink2)", fontSize: ".82rem" }}>{z.projekt_name || "—"}</td>
                        <td className="ac-mono" style={{ textAlign: "right" }}>{Number(z.stunden).toFixed(2)} h</td>
                        <td className="ac-mono" style={{ textAlign: "right", color: "var(--ink2)" }}>{fmtEur(z.stundensatz)}</td>
                        <td className="ac-mono" style={{ textAlign: "right", color: "var(--accent)", fontWeight: 700 }}>{fmtEur(z.betrag)}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                            <button className="ac-btn ac-btn-ghost ac-btn-sm" aria-label="Zeiteintrag bearbeiten" onClick={() => setModal({ type: "zeit", ...z })}>✏️</button>
                            <button className="ac-btn ac-btn-danger ac-btn-sm" aria-label="Zeiteintrag löschen" onClick={() => del("zeit", z.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fakturierungs-Modal */}
      {fakModal && (
        <div className="ac-modal-backdrop">
          <div className="ac-modal" style={{ maxWidth: 400 }}>
            <div className="ac-modal-title">Zeiten fakturieren</div>
            <div className="ac-form-col" style={{ marginBottom: 16 }}>
              <label className="ac-label">Empfängername *</label>
              <input className="ac-input" value={fakEmpf} onChange={e => setFakEmpf(e.target.value)} placeholder="Kundenname" autoFocus />
            </div>
            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-ghost" onClick={() => setFakModal(false)}>Abbrechen</button>
              <button className="ac-btn ac-btn-primary" onClick={fakturieren} disabled={fakLoading || !fakEmpf.trim()}>
                {fakLoading ? "…" : "Rechnung erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal?.type === "projekt" && (
        <ProjektForm initial={modal.id ? modal : null} onSaved={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
      )}
      {modal?.type === "zeit" && (
        <ZeitForm projekte={projekte} initial={modal.id ? modal : null} onSaved={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
