// src/components/accounting/LieferscheinTab.jsx — Lieferscheine (F28)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const EMPTY_POS = { beschreibung: "", menge: 1, einheit: "Stk.", einzelpreis: 0 };

function PositionenEditor({ positionen, onChange }) {
  const add = () => onChange([...positionen, { ...EMPTY_POS }]);
  const remove = (i) => onChange(positionen.filter((_, j) => j !== i));
  const update = (i, field, val) => {
    const next = positionen.map((p, j) => j === i ? { ...p, [field]: val } : p);
    onChange(next);
  };
  return (
    <div>
      <div style={{ fontSize: ".75rem", color: "var(--ink2)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Positionen</div>
      {positionen.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input className="ac-input" placeholder="Beschreibung" style={{ flex: 3, minWidth: 140 }}
            value={p.beschreibung} onChange={e => update(i, "beschreibung", e.target.value)} />
          <input className="ac-input" type="number" placeholder="Menge" style={{ width: 80 }}
            value={p.menge} onChange={e => update(i, "menge", e.target.value)} />
          <input className="ac-input" placeholder="Einheit" style={{ width: 70 }}
            value={p.einheit} onChange={e => update(i, "einheit", e.target.value)} />
          <input className="ac-input" type="number" placeholder="Preis" style={{ width: 100 }}
            value={p.einzelpreis} onChange={e => update(i, "einzelpreis", e.target.value)} />
          <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={add} style={{ marginTop: 4 }}>+ Position</button>
    </div>
  );
}

const INIT_FORM = {
  empfaenger_name: "", empfaenger_strasse: "", empfaenger_plz: "",
  empfaenger_ort: "", empfaenger_land: "DE", lieferdatum: new Date().toISOString().slice(0, 10),
  betreff: "", notiz: "", positionen: [{ ...EMPTY_POS }],
};

function LieferscheinModal({ onClose, onSaved }) {
  const [form, setForm] = useState(INIT_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.empfaenger_name.trim()) { setErr("Empfänger erforderlich."); return; }
    setSaving(true); setErr(null);
    try {
      await api.post("/api/v1/lieferscheine", {
        ...form,
        positionen: form.positionen.map(p => ({
          ...p,
          menge: parseFloat(p.menge) || 1,
          einzelpreis: parseFloat(p.einzelpreis) || 0,
        })),
      });
      onSaved();
      onClose();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 680 }}>
        <div className="ac-modal-title">Neuer Lieferschein</div>
        {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Empfänger *</label>
            <input className="ac-input" value={form.empfaenger_name} onChange={e => set("empfaenger_name", e.target.value)} />
          </div>
          <div className="ac-form-col" style={{ maxWidth: 140 }}>
            <label className="ac-label">Lieferdatum *</label>
            <input className="ac-input" type="date" value={form.lieferdatum} onChange={e => set("lieferdatum", e.target.value)} />
          </div>
        </div>

        <div className="ac-form-row">
          <div className="ac-form-col" style={{ flex: 2 }}>
            <label className="ac-label">Straße</label>
            <input className="ac-input" value={form.empfaenger_strasse} onChange={e => set("empfaenger_strasse", e.target.value)} />
          </div>
          <div className="ac-form-col" style={{ maxWidth: 90 }}>
            <label className="ac-label">PLZ</label>
            <input className="ac-input" value={form.empfaenger_plz} onChange={e => set("empfaenger_plz", e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Ort</label>
            <input className="ac-input" value={form.empfaenger_ort} onChange={e => set("empfaenger_ort", e.target.value)} />
          </div>
          <div className="ac-form-col" style={{ maxWidth: 80 }}>
            <label className="ac-label">Land</label>
            <input className="ac-input" value={form.empfaenger_land} onChange={e => set("empfaenger_land", e.target.value)} />
          </div>
        </div>

        <div className="ac-form-col" style={{ marginBottom: 16 }}>
          <label className="ac-label">Betreff</label>
          <input className="ac-input" value={form.betreff} onChange={e => set("betreff", e.target.value)} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <PositionenEditor
            positionen={form.positionen}
            onChange={p => setForm(f => ({ ...f, positionen: p }))}
          />
        </div>

        <div className="ac-form-col" style={{ marginBottom: 20 }}>
          <label className="ac-label">Notiz</label>
          <textarea className="ac-input" rows={2} value={form.notiz} onChange={e => set("notiz", e.target.value)}
            style={{ resize: "vertical" }} />
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={submit} disabled={saving}>
            {saving ? "…" : "Lieferschein erstellen"}
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_LABEL = { erstellt: "Erstellt", konvertiert: "→ Rechnung" };
const STATUS_CLASS = { erstellt: "ac-badge-green", konvertiert: "ac-badge-purple" };

export default function LieferscheinTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [converting, setConverting] = useState(null);
  const [msg, setMsg] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/lieferscheine")
      .then(r => setItems(r.data?.lieferscheine || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const zuRechnung = async (lid) => {
    setConverting(lid);
    try {
      const r = await api.post(`/api/v1/lieferscheine/${lid}/zu-rechnung`);
      setMsg({ type: "ok", text: `Rechnung ${r.data.rechnungsnummer} erstellt.` });
      load();
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Konvertierung fehlgeschlagen." });
    } finally { setConverting(null); }
  };

  const del = async (lid) => {
    if (!confirm("Lieferschein löschen?")) return;
    try {
      await api.delete(`/api/v1/lieferscheine/${lid}`);
      load();
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Fehler beim Löschen." });
    }
  };

  const total = (ls) =>
    (ls.positionen || []).reduce((s, p) => s + (parseFloat(p.menge) || 0) * (parseFloat(p.einzelpreis) || 0), 0);

  return (
    <div>
      {msg && (
        <div className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
          style={{ marginBottom: 16, cursor: "pointer" }} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Lieferscheine</span>
        <button className="ac-btn ac-btn-primary" onClick={() => setShowModal(true)}>+ Lieferschein</button>
      </div>

      <p style={{ fontSize: ".82rem", color: "var(--ink2)", marginBottom: 16 }}>
        Lieferscheine dokumentieren die Warenlieferung. Mit einem Klick in eine Ausgangsrechnung umwandeln.
      </p>

      {loading ? (
        <div className="ac-loading"><span className="ac-spinner" />Lade Lieferscheine…</div>
      ) : items.length === 0 ? (
        <div className="ac-empty">Noch keine Lieferscheine. Erstellen Sie Ihren ersten.</div>
      ) : (
        <div className="ac-card" style={{ padding: 0 }}>
          <table className="ac-table">
            <thead>
              <tr>
                <th>Nr.</th>
                <th>Empfänger</th>
                <th>Lieferdatum</th>
                <th>Betreff</th>
                <th style={{ textAlign: "right" }}>Warenwert</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {items.map(ls => (
                <React.Fragment key={ls.id}>
                  <tr style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === ls.id ? null : ls.id)}>
                    <td className="ac-mono" style={{ color: "var(--accent)" }}>{ls.lieferschein_nr}</td>
                    <td style={{ fontWeight: 600 }}>{ls.empfaenger_name}</td>
                    <td className="ac-mono">{ls.lieferdatum}</td>
                    <td style={{ color: "var(--ink2)", fontSize: ".85rem" }}>{ls.betreff || "—"}</td>
                    <td className="ac-mono" style={{ textAlign: "right" }}>{fmtEur(total(ls))}</td>
                    <td>
                      <span className={`ac-badge ${STATUS_CLASS[ls.status] || "ac-badge-gray"}`}>
                        {STATUS_LABEL[ls.status] || ls.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                        {ls.status === "erstellt" && (
                          <>
                            <button className="ac-btn ac-btn-primary ac-btn-sm"
                              disabled={converting === ls.id}
                              onClick={() => zuRechnung(ls.id)}>
                              {converting === ls.id ? "…" : "→ Rechnung"}
                            </button>
                            <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => del(ls.id)}>✕</button>
                          </>
                        )}
                        {ls.status === "konvertiert" && ls.rechnung_id && (
                          <span style={{ fontSize: ".78rem", color: "var(--ink2)" }}>
                            RE #{ls.rechnung_id}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === ls.id && (ls.positionen || []).length > 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: "0 14px 14px", background: "var(--surface2)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".82rem", marginTop: 8 }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: "left", color: "var(--ink2)", padding: "4px 8px", fontWeight: 400 }}>Beschreibung</th>
                              <th style={{ textAlign: "right", color: "var(--ink2)", padding: "4px 8px", fontWeight: 400 }}>Menge</th>
                              <th style={{ textAlign: "left", color: "var(--ink2)", padding: "4px 8px", fontWeight: 400 }}>Einheit</th>
                              <th style={{ textAlign: "right", color: "var(--ink2)", padding: "4px 8px", fontWeight: 400 }}>Einzelpreis</th>
                              <th style={{ textAlign: "right", color: "var(--ink2)", padding: "4px 8px", fontWeight: 400 }}>Gesamt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ls.positionen.map((p, i) => (
                              <tr key={i}>
                                <td style={{ padding: "4px 8px" }}>{p.beschreibung}</td>
                                <td style={{ padding: "4px 8px", textAlign: "right", fontFamily: "JetBrains Mono,monospace" }}>{p.menge}</td>
                                <td style={{ padding: "4px 8px", color: "var(--ink2)" }}>{p.einheit}</td>
                                <td style={{ padding: "4px 8px", textAlign: "right", fontFamily: "JetBrains Mono,monospace" }}>{fmtEur(p.einzelpreis)}</td>
                                <td style={{ padding: "4px 8px", textAlign: "right", fontFamily: "JetBrains Mono,monospace" }}>{fmtEur(parseFloat(p.menge) * parseFloat(p.einzelpreis))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <LieferscheinModal onClose={() => setShowModal(false)} onSaved={load} />
      )}
    </div>
  );
}
