// src/components/accounting/KassenbuchTab.jsx — Kassenbuch mit Saldo-Übertrag
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY = { datum: today(), beschreibung: "", betrag: "", beleg_nr: "" };

function EintragForm({ initial, onSaved, onClose }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initial || {}) }));
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.beschreibung.trim() || !form.betrag) { setErr("Beschreibung und Betrag sind Pflicht."); return; }
    setSaving(true); setErr("");
    try {
      const payload = { ...form, betrag: parseFloat(form.betrag) };
      if (initial?.id) await api.put(`/api/v1/kassenbuch/${initial.id}`, payload);
      else             await api.post("/api/v1/kassenbuch", payload);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 480 }}>
        <div className="ac-modal-title">{initial?.id ? "Kasseneintrag bearbeiten" : "Kasseneintrag erfassen"}</div>
        {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Datum *</label>
            <input className="ac-input" type="date" value={form.datum} onChange={e => set("datum", e.target.value)} /></div>
          <div className="ac-form-col"><label className="ac-label">Beleg-Nr.</label>
            <input className="ac-input" value={form.beleg_nr} onChange={e => set("beleg_nr", e.target.value)} placeholder="KB-001" /></div>
        </div>
        <div className="ac-form-col" style={{ marginBottom: 12 }}><label className="ac-label">Beschreibung *</label>
          <input className="ac-input" value={form.beschreibung} onChange={e => set("beschreibung", e.target.value)} placeholder="Bareinnahme / Barzahlung…" /></div>
        <div className="ac-form-col" style={{ marginBottom: 16 }}>
          <label className="ac-label">Betrag € <span style={{ color: "var(--ink2)", fontSize: ".72rem" }}>(negativ = Ausgabe)</span></label>
          <input className="ac-input" type="number" step="0.01" value={form.betrag}
            onChange={e => set("betrag", e.target.value)} placeholder="100.00 oder -50.00" />
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>{saving ? "…" : "Speichern"}</button>
        </div>
      </div>
    </div>
  );
}

export default function KassenbuchTab() {
  const [data, setData]   = useState({ eintraege: [], kassenstand: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [msg, setMsg]     = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/kassenbuch")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    if (!window.confirm("Kasseneintrag wirklich löschen?\n\nHinweis: Das Kassenbuch unterliegt der GoBD (§ 146 AO). Einträge sollten in der Regel storniert statt gelöscht werden. Nur Testeinträge und Fehleingaben vor der Tagesabrechnung löschen.")) return;
    try { await api.delete(`/api/v1/kassenbuch/${id}`); load(); }
    catch (e) { setMsg({ type: "err", text: "Löschen fehlgeschlagen." }); }
  };

  const exportCsv = async () => {
    const r = await api.get("/api/v1/kassenbuch/export/csv", { responseType: "blob" });
    const url = URL.createObjectURL(r.data);
    const a = document.createElement("a"); a.href = url; a.download = "Kassenbuch.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const kassenstand = data.kassenstand ?? 0;

  return (
    <div>
      {msg && <div className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
        style={{ cursor: "pointer", marginBottom: 16 }} onClick={() => setMsg(null)}>{msg.text}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Kassenbuch</span>
          <span style={{ fontSize: ".75rem", color: "var(--ink2)", marginLeft: 10 }}>Bargeldtransaktionen mit Saldo-Übertrag</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={exportCsv}>CSV Export</button>
          <button className="ac-btn ac-btn-primary" onClick={() => setModal("new")}>+ Kasseneintrag</button>
        </div>
      </div>

      {/* Kassenstand */}
      <div className="ac-kpi-grid" style={{ marginBottom: 16 }}>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Aktueller Kassenstand</div>
          <div className={`ac-kpi-value ${kassenstand >= 0 ? "green" : "pink"}`}>
            {fmtEur(kassenstand)}
          </div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Einträge gesamt</div>
          <div className="ac-kpi-value">{data.total ?? data.eintraege.length}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Einnahmen gesamt</div>
          <div className="ac-kpi-value green">
            {fmtEur(data.eintraege.filter(e => e.betrag > 0).reduce((s, e) => s + Number(e.betrag), 0))}
          </div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Ausgaben gesamt</div>
          <div className="ac-kpi-value pink">
            {fmtEur(Math.abs(data.eintraege.filter(e => e.betrag < 0).reduce((s, e) => s + Number(e.betrag), 0)))}
          </div>
        </div>
      </div>

      {kassenstand < 0 && (
        <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>
          Kassenstand ist negativ — bitte prüfen!
        </div>
      )}

      {loading ? (
        <div className="ac-loading"><span className="ac-spinner" />Lade Kassenbuch…</div>
      ) : data.eintraege.length === 0 ? (
        <div className="ac-empty">
          <div style={{ fontSize: "2rem", marginBottom: 12 }}></div>
          <div>Noch keine Kasseneinträge vorhanden.</div>
        </div>
      ) : (
        <div className="ac-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Datum</th><th>Beleg-Nr.</th><th>Beschreibung</th>
                  <th style={{ textAlign: "right" }}>Einnahme</th>
                  <th style={{ textAlign: "right" }}>Ausgabe</th>
                  <th style={{ textAlign: "right" }}>Kassenstand</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.eintraege.map(e => {
                  const betrag = Number(e.betrag);
                  return (
                    <tr key={e.id}>
                      <td className="ac-mono" style={{ fontSize: ".82rem" }}>{e.datum}</td>
                      <td style={{ color: "var(--ink2)", fontSize: ".82rem" }}>{e.beleg_nr || "—"}</td>
                      <td>{e.beschreibung}</td>
                      <td className="ac-mono" style={{ textAlign: "right", color: "var(--accent)" }}>
                        {betrag > 0 ? fmtEur(betrag) : "—"}
                      </td>
                      <td className="ac-mono" style={{ textAlign: "right", color: "var(--a3)" }}>
                        {betrag < 0 ? fmtEur(Math.abs(betrag)) : "—"}
                      </td>
                      <td className="ac-mono" style={{
                        textAlign: "right", fontWeight: 700,
                        color: Number(e.kassenstand) >= 0 ? "var(--ink)" : "var(--a3)",
                      }}>
                        {fmtEur(e.kassenstand)}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setModal(e)}>Bearb.</button>
                          <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => del(e.id)}>Löschen</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <EintragForm
          initial={modal === "new" ? null : modal}
          onSaved={() => { setModal(null); load(); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
