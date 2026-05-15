// src/components/accounting/AnlagenTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmt    = (n) => Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtEur = (n) => `${fmt(n)} EUR`;

const ANLAGEN_ARTEN = [
  "IT-Hardware", "Software", "PKW / Fahrzeug", "Maschinen", "Buroausstattung",
  "Gebaude", "GWG (bis 800 EUR)", "Sonstiges",
];

const ND_VORGABEN = [
  { label: "GWG Sofortabschreibung (1 Monat)", months: 1 },
  { label: "PC / Notebook (36 Monate)",        months: 36 },
  { label: "PKW (72 Monate)",                  months: 72 },
  { label: "Buroausstattung (156 Monate)",     months: 156 },
  { label: "Maschinen (120 Monate)",           months: 120 },
  { label: "Gebaude (600 Monate)",             months: 600 },
];

function NeuAnlageModal({ onClose, onSaved }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    anlagen_nummer: "", bezeichnung: "", anlagen_art: "IT-Hardware",
    kaufdatum: today, anschaffungskosten: "",
    nutzungsdauer_monate: 36, afa_methode: "linear", afa_beginn: today,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.anlagen_nummer || !form.bezeichnung || !form.anschaffungskosten) {
      setError("Anlagennummer, Bezeichnung und Anschaffungskosten sind Pflichtfelder."); return;
    }
    setLoading(true);
    try {
      await api.post("/api/v1/buchhaltung/anlagen", {
        anlagen_nummer:       form.anlagen_nummer,
        bezeichnung:          form.bezeichnung,
        anlagen_art:          form.anlagen_art,
        kaufdatum:            form.kaufdatum,
        anschaffungskosten:   parseFloat(form.anschaffungskosten),
        nutzungsdauer_monate: parseInt(form.nutzungsdauer_monate),
        afa_methode:          form.afa_methode,
        afa_beginn:           form.afa_beginn,
      });
      onSaved(); onClose();
    } catch(e) {
      setError(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setLoading(false); }
  };

  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal">
        <div className="ac-modal-title">Neue Anlage erfassen</div>
        {error && <div className="ac-alert ac-alert-err">{error}</div>}
        <div className="ac-form-row">
          <div className="ac-form-col" style={{ maxWidth: 140 }}>
            <label className="ac-label">Anlagennummer *</label>
            <input className="ac-input ac-mono" value={form.anlagen_nummer} placeholder="A-001"
              onChange={e => set("anlagen_nummer", e.target.value)} />
          </div>
          <div className="ac-form-col" style={{ flex: 2 }}>
            <label className="ac-label">Bezeichnung *</label>
            <input className="ac-input" value={form.bezeichnung} placeholder="z.B. MacBook Pro M3"
              onChange={e => set("bezeichnung", e.target.value)} />
          </div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Anlagenart</label>
            <select className="ac-select" value={form.anlagen_art}
              onChange={e => set("anlagen_art", e.target.value)}>
              {ANLAGEN_ARTEN.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Anschaffungskosten (EUR) *</label>
            <input className="ac-input ac-mono" type="number" step="0.01" value={form.anschaffungskosten}
              onChange={e => set("anschaffungskosten", e.target.value)} />
          </div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Kaufdatum</label>
            <input className="ac-input" type="date" value={form.kaufdatum}
              onChange={e => { set("kaufdatum", e.target.value); set("afa_beginn", e.target.value); }} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">AfA-Beginn</label>
            <input className="ac-input" type="date" value={form.afa_beginn}
              onChange={e => set("afa_beginn", e.target.value)} />
          </div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Nutzungsdauer</label>
            <select className="ac-select" value={form.nutzungsdauer_monate}
              onChange={e => set("nutzungsdauer_monate", e.target.value)}>
              {ND_VORGABEN.map(v => <option key={v.months} value={v.months}>{v.label}</option>)}
            </select>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Methode</label>
            <select className="ac-select" value={form.afa_methode}
              onChange={e => set("afa_methode", e.target.value)}>
              <option value="linear">Linear (gleichmassig)</option>
              <option value="degressiv">Degressiv</option>
              <option value="sofort">Sofortabschreibung (GWG)</option>
            </select>
          </div>
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={loading}>
            {loading ? "..." : "Anlage erfassen"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AfaVorschau({ anlage }) {
  const [vorschau, setVorschau]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [buchungJahr, setBuchungJahr] = useState(new Date().getFullYear());
  const [buchungMonat, setBuchungMonat] = useState(new Date().getMonth() + 1);
  const [buchungMsg, setBuchungMsg]   = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/v1/buchhaltung/anlagen/${anlage.id}/afa-vorschau`, { params: { jahr: buchungJahr } })
      .then(r => setVorschau(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [anlage.id, buchungJahr]);

  const buchen = async () => {
    try {
      await api.post(`/api/v1/buchhaltung/anlagen/${anlage.id}/afa-buchen`, null, {
        params: { geschaeftsjahr: buchungJahr, monat: buchungMonat }
      });
      setBuchungMsg({ type:"ok", text:`AfA ${buchungMonat}/${buchungJahr} gebucht.` });
    } catch(e) {
      setBuchungMsg({ type:"err", text: e.response?.data?.detail || "Fehler" });
    }
  };

  return (
    <div style={{ padding:"16px 0" }}>
      <div className="ac-form-row" style={{ marginBottom:12 }}>
        <label className="ac-label" style={{ alignSelf:"center" }}>Jahr:</label>
        <select className="ac-select" value={buchungJahr} onChange={e => setBuchungJahr(Number(e.target.value))}>
          {Array.from({length: 6}, (_, i) => new Date().getFullYear() - 2 + i).map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {buchungMsg && (
        <div className={`ac-alert ${buchungMsg.type==="ok"?"ac-alert-ok":"ac-alert-err"}`}
          style={{cursor:"pointer"}} onClick={() => setBuchungMsg(null)}>{buchungMsg.text}</div>
      )}
      {loading ? <div className="ac-loading"><span className="ac-spinner"/>Lade...</div> : vorschau && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10, marginBottom:16 }}>
            {[
              { label:"AfA dieses Jahr", value: vorschau.afa_dieses_jahr, color:"var(--a3)" },
              { label:"Buchwert Anfang", value: vorschau.buchwert_anfang },
              { label:"Buchwert Ende",   value: vorschau.buchwert_ende, color:"var(--accent)" },
              { label:"Bereits abgeschrieben", value: vorschau.bereits_abgeschrieben, color:"var(--ink2)" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontSize:".72rem", color:"var(--ink2)", textTransform:"uppercase", letterSpacing:".04em", marginBottom:4 }}>{label}</div>
                <div className="ac-mono" style={{ fontWeight:700, color: color || "var(--ink)" }}>{fmtEur(value)}</div>
              </div>
            ))}
            <div style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 12px" }}>
              <div style={{ fontSize:".72rem", color:"var(--ink2)", textTransform:"uppercase", letterSpacing:".04em", marginBottom:4 }}>Restlaufzeit</div>
              <div className="ac-mono" style={{ fontWeight:700 }}>{vorschau.restlaufzeit_monate} Mon.</div>
            </div>
          </div>
          <div className="ac-form-row" style={{ alignItems:"flex-end", gap:8 }}>
            <div className="ac-form-col" style={{ maxWidth:140 }}>
              <label className="ac-label">Monat buchen</label>
              <select className="ac-select" value={buchungMonat} onChange={e => setBuchungMonat(Number(e.target.value))}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={buchen}>AfA buchen</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnlagenTab() {
  const [anlagen, setAnlagen]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded]   = useState({});

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/anlagen")
      .then(r => setAnlagen(r.data || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const totalAHK  = anlagen.reduce((s,a) => s + Number(a.anschaffungskosten || 0), 0);
  const totalRest = anlagen.reduce((s,a) => s + Number(a.buchwert_aktuell || 0), 0);

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Anlagebuch...</div>;

  return (
    <div>
      <div className="ac-kpi-grid" style={{ marginBottom:16 }}>
        <div className="ac-kpi"><div className="ac-kpi-label">Anlagen gesamt</div><div className="ac-kpi-value">{anlagen.length}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Anschaffungskosten gesamt</div><div className="ac-kpi-value purple">{fmtEur(totalAHK)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Buchwert (Restwert)</div><div className="ac-kpi-value green">{fmtEur(totalRest)}</div></div>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
        <button className="ac-btn ac-btn-primary" onClick={() => setShowModal(true)}>+ Anlage erfassen</button>
      </div>
      <div className="ac-card" style={{ padding:0 }}>
        <table className="ac-table">
          <thead><tr><th>Bezeichnung</th><th>Datum</th><th>Kategorie</th><th style={{textAlign:"right"}}>AHK</th><th style={{textAlign:"right"}}>Restwert</th><th>ND</th><th>Methode</th><th></th></tr></thead>
          <tbody>
            {anlagen.length === 0 && <tr><td colSpan={8} className="ac-empty">Noch keine Anlagen erfasst.</td></tr>}
            {anlagen.map(a => (
              <React.Fragment key={a.id}>
                <tr style={{ cursor:"pointer" }} onClick={() => setExpanded(e => ({...e, [a.id]: !e[a.id]}))}>
                  <td>{a.bezeichnung}</td>
                  <td className="ac-mono">{a.kaufdatum}</td>
                  <td><span className="ac-badge ac-badge-gray">{a.anlagen_art || "--"}</span></td>
                  <td className="ac-mono" style={{textAlign:"right"}}>{fmtEur(a.anschaffungskosten)}</td>
                  <td className="ac-mono" style={{textAlign:"right", color:"var(--accent)"}}>{fmtEur(a.buchwert_aktuell)}</td>
                  <td className="ac-mono">{Math.round((a.nutzungsdauer_monate || 0) / 12)} J</td>
                  <td><span className="ac-badge ac-badge-purple">{a.afa_methode}</span></td>
                  <td style={{ color:"var(--ink2)", fontSize:".8rem" }}>{expanded[a.id] ? "A" : "V"}</td>
                </tr>
                {expanded[a.id] && (
                  <tr><td colSpan={8} style={{ padding:"0 24px 16px" }}><AfaVorschau anlage={a} /></td></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <NeuAnlageModal onClose={() => setShowModal(false)} onSaved={load} />}
    </div>
  );
}
