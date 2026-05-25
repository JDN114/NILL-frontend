// src/components/accounting/ReisekostenTab.jsx — Reisekosten-Abrechnung § 4 Abs. 5 EStG
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  datum: today(), zweck: "", reiseziel: "",
  km_strecke: "", km_pauschale_satz: 0.30,
  tage_abwesend: 0, tagegeld_satz: 28.0,
  uebernachtung_betrag: "", sonstige_kosten: "", sonstige_beschreibung: "", notiz: "",
};

function calc(f) {
  const km  = parseFloat(f.km_strecke || 0);
  const ks  = parseFloat(f.km_pauschale_satz || 0.30);
  const tg  = parseInt(f.tage_abwesend || 0);
  const ts  = parseFloat(f.tagegeld_satz || 28);
  const ue  = parseFloat(f.uebernachtung_betrag || 0);
  const so  = parseFloat(f.sonstige_kosten || 0);
  return { km_bet: km * ks, tg_bet: tg * ts, gesamt: km * ks + tg * ts + ue + so };
}

function ReisekostenForm({ initial, onSaved, onClose }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initial || {}) }));
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const { km_bet, tg_bet, gesamt } = calc(form);

  const save = async () => {
    if (!form.zweck.trim()) { setErr("Reisezweck ist Pflichtfeld."); return; }
    setSaving(true); setErr("");
    try {
      if (initial?.id) await api.put(`/api/v1/reisekosten/${initial.id}`, form);
      else             await api.post("/api/v1/reisekosten", form);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 640 }}>
        <div className="ac-modal-title">
          {initial?.id ? "Reisekosten bearbeiten" : "Reisekosten erfassen"}
          <span style={{ fontSize: ".75rem", color: "var(--ink2)", marginLeft: 10 }}>§ 4 Abs. 5 EStG</span>
        </div>
        {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}

        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Datum *</label>
            <input className="ac-input" type="date" value={form.datum} onChange={e => set("datum", e.target.value)} /></div>
          <div className="ac-form-col" style={{ flex: 2 }}><label className="ac-label">Reisezweck *</label>
            <input className="ac-input" value={form.zweck} onChange={e => set("zweck", e.target.value)} placeholder="Kundenbesuch, Messe…" /></div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Reiseziel</label>
            <input className="ac-input" value={form.reiseziel} onChange={e => set("reiseziel", e.target.value)} placeholder="München" /></div>
        </div>

        <div style={{ fontSize: ".75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, margin: "12px 0 8px" }}>
          Kilometerpauschale (0,30 €/km PKW)
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Kilometer (Gesamtstrecke)</label>
            <input className="ac-input" type="number" min="0" step="1" value={form.km_strecke}
              onChange={e => set("km_strecke", e.target.value)} placeholder="0" /></div>
          <div className="ac-form-col" style={{ maxWidth: 120 }}><label className="ac-label">Satz €/km</label>
            <select className="ac-select" value={form.km_pauschale_satz} onChange={e => set("km_pauschale_satz", e.target.value)}>
              <option value="0.30">0,30 € PKW</option>
              <option value="0.20">0,20 € Moped</option>
              <option value="0.35">0,35 € PKW ab 2025</option>
            </select></div>
          <div className="ac-form-col" style={{ maxWidth: 120 }}>
            <label className="ac-label">Betrag</label>
            <div className="ac-input" style={{ background: "transparent", color: "var(--accent)", fontWeight: 600 }}>{fmtEur(km_bet)}</div>
          </div>
        </div>

        <div style={{ fontSize: ".75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, margin: "12px 0 8px" }}>
          Tagegeld (28 €/Tag Inland ab 24h)
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col" style={{ maxWidth: 120 }}><label className="ac-label">Tage &gt;8h abwesend</label>
            <input className="ac-input" type="number" min="0" step="1" value={form.tage_abwesend}
              onChange={e => set("tage_abwesend", e.target.value)} /></div>
          <div className="ac-form-col" style={{ maxWidth: 120 }}><label className="ac-label">Satz €/Tag</label>
            <select className="ac-select" value={form.tagegeld_satz} onChange={e => set("tagegeld_satz", e.target.value)}>
              <option value="28">28 € (ab 24h)</option>
              <option value="14">14 € (8–24h)</option>
            </select></div>
          <div className="ac-form-col" style={{ maxWidth: 120 }}>
            <label className="ac-label">Betrag</label>
            <div className="ac-input" style={{ background: "transparent", color: "var(--accent)", fontWeight: 600 }}>{fmtEur(tg_bet)}</div>
          </div>
        </div>

        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Übernachtungskosten €</label>
            <input className="ac-input" type="number" min="0" step="0.01" value={form.uebernachtung_betrag}
              onChange={e => set("uebernachtung_betrag", e.target.value)} placeholder="0" /></div>
          <div className="ac-form-col"><label className="ac-label">Sonstige Kosten €</label>
            <input className="ac-input" type="number" min="0" step="0.01" value={form.sonstige_kosten}
              onChange={e => set("sonstige_kosten", e.target.value)} placeholder="0" /></div>
          <div className="ac-form-col" style={{ flex: 2 }}><label className="ac-label">Beschreibung Sonstiges</label>
            <input className="ac-input" value={form.sonstige_beschreibung}
              onChange={e => set("sonstige_beschreibung", e.target.value)} placeholder="Parkgebühren, Taxi…" /></div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", margin: "8px 0 14px",
          fontFamily: "JetBrains Mono, monospace", fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)" }}>
          Gesamt: {fmtEur(gesamt)}
        </div>

        <div className="ac-form-col" style={{ marginBottom: 8 }}><label className="ac-label">Notiz</label>
          <textarea className="ac-input" rows={2} value={form.notiz}
            onChange={e => set("notiz", e.target.value)} style={{ resize: "vertical" }} /></div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReisekostenTab() {
  const [data, setData]   = useState({ eintraege: [], gesamt_betrag: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [msg, setMsg]     = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/reisekosten")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    if (!confirm("Reisekosten-Beleg löschen?")) return;
    try { await api.delete(`/api/v1/reisekosten/${id}`); load(); }
    catch (e) { setMsg({ type: "err", text: e.response?.data?.detail || "Fehler" }); }
  };

  return (
    <div>
      {msg && <div className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
        style={{ cursor: "pointer", marginBottom: 16 }} onClick={() => setMsg(null)}>{msg.text}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>
            Reisekosten-Abrechnung
          </span>
          <span style={{ fontSize: ".75rem", color: "var(--ink2)", marginLeft: 10 }}>§ 4 Abs. 5 EStG</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {data.gesamt_betrag > 0 && (
            <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--accent)", fontWeight: 700 }}>
              Gesamt: {fmtEur(data.gesamt_betrag)}
            </span>
          )}
          <button className="ac-btn ac-btn-primary" onClick={() => setModal("new")}>+ Reisekosten erfassen</button>
        </div>
      </div>

      <div className="ac-alert ac-alert-warn" style={{ marginBottom: 16 }}>
        Km-Pauschale PKW: 0,30 €/km · Tagegeld Inland 24h+: 28 € · 8–24h: 14 € · Übernachtungspauschale: 20 €
      </div>

      {loading ? (
        <div className="ac-loading"><span className="ac-spinner" />Lade Reisekosten…</div>
      ) : data.eintraege.length === 0 ? (
        <div className="ac-empty">
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>🚗</div>
          <div>Noch keine Reisekosten erfasst.</div>
        </div>
      ) : (
        <div className="ac-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Datum</th><th>Reisezweck</th><th>Reiseziel</th>
                  <th style={{ textAlign: "right" }}>Km</th>
                  <th style={{ textAlign: "right" }}>Tagegeld</th>
                  <th style={{ textAlign: "right" }}>Übernachtung</th>
                  <th style={{ textAlign: "right" }}>Gesamt</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.eintraege.map(r => (
                  <tr key={r.id}>
                    <td className="ac-mono" style={{ fontSize: ".82rem" }}>{r.datum}</td>
                    <td>{r.zweck}</td>
                    <td style={{ color: "var(--ink2)", fontSize: ".85rem" }}>{r.reiseziel || "—"}</td>
                    <td className="ac-mono" style={{ textAlign: "right", fontSize: ".82rem" }}>
                      {Number(r.km_betrag || 0) > 0 ? fmtEur(r.km_betrag) : "—"}
                    </td>
                    <td className="ac-mono" style={{ textAlign: "right", fontSize: ".82rem" }}>
                      {Number(r.tagegeld_betrag || 0) > 0 ? fmtEur(r.tagegeld_betrag) : "—"}
                    </td>
                    <td className="ac-mono" style={{ textAlign: "right", fontSize: ".82rem" }}>
                      {Number(r.uebernachtung_betrag || 0) > 0 ? fmtEur(r.uebernachtung_betrag) : "—"}
                    </td>
                    <td className="ac-mono" style={{ textAlign: "right", fontWeight: 700, color: "var(--accent)" }}>
                      {fmtEur(r.gesamt_betrag)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setModal(r)}>✏️</button>
                        <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => del(r.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <ReisekostenForm
          initial={modal === "new" ? null : modal}
          onSaved={() => { setModal(null); load(); setMsg({ type: "ok", text: "Gespeichert." }); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
