// src/components/accounting/AnlagenTab.jsx
// Fixed-asset ledger: AfA preview and booking
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmt    = (n) => Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtEur = (n) => `${fmt(n)} €`;

const NUTZUNGSDAUER_VORGABEN = [
  { label: "GWG (Sofortabschreibung ≤ 800 €)",  value: 1  },
  { label: "PC / Notebook (3 Jahre)",             value: 3  },
  { label: "PKW (6 Jahre)",                       value: 6  },
  { label: "Büroausstattung (13 Jahre)",          value: 13 },
  { label: "Maschinen (10 Jahre)",                value: 10 },
  { label: "Gebäude (50 Jahre)",                  value: 50 },
];

function NeuAnlageModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    bezeichnung: "",
    anschaffungsdatum: new Date().toISOString().slice(0,10),
    anschaffungskosten: "",
    nutzungsdauer_jahre: 3,
    abschreibungsmethode: "linear",
    kategorie: "",
    seriennummer: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.bezeichnung || !form.anschaffungskosten) {
      setError("Bezeichnung und Anschaffungskosten sind Pflichtfelder.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/v1/buchhaltung/anlagen", {
        ...form,
        anschaffungskosten: parseFloat(form.anschaffungskosten),
        nutzungsdauer_jahre: parseInt(form.nutzungsdauer_jahre),
      });
      onSaved();
      onClose();
    } catch(e) {
      setError(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal">
        <div className="ac-modal-title">Neue Anlage erfassen</div>
        {error && <div className="ac-alert ac-alert-err">{error}</div>}

        <div className="ac-form-col" style={{ marginBottom:12 }}>
          <label className="ac-label">Bezeichnung *</label>
          <input className="ac-input" value={form.bezeichnung} placeholder="z.B. MacBook Pro M3"
            onChange={e => set("bezeichnung", e.target.value)} />
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Anschaffungsdatum</label>
            <input className="ac-input" type="date" value={form.anschaffungsdatum}
              onChange={e => set("anschaffungsdatum", e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Anschaffungskosten (€) *</label>
            <input className="ac-input ac-mono" type="number" step="0.01" value={form.anschaffungskosten}
              onChange={e => set("anschaffungskosten", e.target.value)} />
          </div>
        </div>

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Nutzungsdauer (Jahre)</label>
            <select className="ac-select" value={form.nutzungsdauer_jahre}
              onChange={e => set("nutzungsdauer_jahre", e.target.value)}>
              {NUTZUNGSDAUER_VORGABEN.map(v => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
              {[2,4,5,7,8,9,15,20,25,30,40].map(y => (
                <option key={y} value={y}>{y} Jahre (individuell)</option>
              ))}
            </select>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Methode</label>
            <select className="ac-select" value={form.abschreibungsmethode}
              onChange={e => set("abschreibungsmethode", e.target.value)}>
              <option value="linear">Linear (gleichmäßig)</option>
              <option value="degressiv">Degressiv</option>
              <option value="sofort">Sofortabschreibung (GWG)</option>
            </select>
          </div>
        </div>

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Kategorie</label>
            <input className="ac-input" value={form.kategorie} placeholder="z.B. IT-Hardware"
              onChange={e => set("kategorie", e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Seriennummer</label>
            <input className="ac-input" value={form.seriennummer}
              onChange={e => set("seriennummer", e.target.value)} />
          </div>
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={loading}>
            {loading ? "…" : "Anlage erfassen"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AfaVorschau({ anlage }) {
  const [vorschau, setVorschau] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buchungJahr, setBuchungJahr] = useState(new Date().getFullYear());
  const [buchungMsg, setBuchungMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/v1/buchhaltung/anlagen/${anlage.id}/afa-vorschau`, {
      params: { jahr: buchungJahr }
    }).then(r => setVorschau(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [anlage.id, buchungJahr]);

  const buchen = async (monat) => {
    try {
      await api.post(`/api/v1/buchhaltung/anlagen/${anlage.id}/afa-buchen`, null, {
        params: { geschaeftsjahr: buchungJahr, monat }
      });
      setBuchungMsg({ type:"ok", text:`AfA ${monat}/${buchungJahr} gebucht.` });
    } catch(e) {
      setBuchungMsg({ type:"err", text: e.response?.data?.detail || "Fehler" });
    }
  };

  return (
    <div style={{ padding:"16px 0" }}>
      <div className="ac-form-row" style={{ marginBottom:8 }}>
        <label className="ac-label" style={{ alignSelf:"center" }}>Vorschau für Jahr:</label>
        <select className="ac-select" value={buchungJahr} onChange={e => setBuchungJahr(Number(e.target.value))}>
          {[2023,2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {buchungMsg && (
        <div className={`ac-alert ${buchungMsg.type==="ok"?"ac-alert-ok":"ac-alert-err"}`} style={{cursor:"pointer"}}
          onClick={() => setBuchungMsg(null)}>{buchungMsg.text}</div>
      )}
      {loading ? <div className="ac-loading"><span className="ac-spinner"/>Lade…</div> : (
        <table className="ac-table" style={{ fontSize:".82rem" }}>
          <thead>
            <tr>
              <th>Monat</th>
              <th style={{textAlign:"right"}}>AfA-Betrag</th>
              <th style={{textAlign:"right"}}>Restwert nach AfA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(vorschau?.monate || []).map(m => (
              <tr key={m.monat}>
                <td className="ac-mono">{m.monat}/{buchungJahr}</td>
                <td className="ac-mono" style={{textAlign:"right", color:"var(--a3)"}}>{fmtEur(m.afa_betrag)}</td>
                <td className="ac-mono" style={{textAlign:"right"}}>{fmtEur(m.restwert)}</td>
                <td>
                  <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => buchen(m.monat)}>
                    Buchen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function AnlagenTab() {
  const [anlagen, setAnlagen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/anlagen")
      .then(r => setAnlagen(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalAHK  = anlagen.reduce((s,a) => s + Number(a.anschaffungskosten || 0), 0);
  const totalRest = anlagen.reduce((s,a) => s + Number(a.restwert || 0), 0);

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Anlagebuch…</div>;

  return (
    <div>
      <div className="ac-kpi-grid" style={{ marginBottom:16 }}>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Anlagen gesamt</div>
          <div className="ac-kpi-value">{anlagen.length}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Anschaffungskosten gesamt</div>
          <div className="ac-kpi-value purple">{fmtEur(totalAHK)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Buchwert (Restwert)</div>
          <div className="ac-kpi-value green">{fmtEur(totalRest)}</div>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
        <button className="ac-btn ac-btn-primary" onClick={() => setShowModal(true)}>+ Anlage erfassen</button>
      </div>

      <div className="ac-card" style={{ padding:0 }}>
        <table className="ac-table">
          <thead>
            <tr>
              <th>Bezeichnung</th>
              <th>Datum</th>
              <th>Kategorie</th>
              <th style={{textAlign:"right"}}>AHK</th>
              <th style={{textAlign:"right"}}>Restwert</th>
              <th>ND</th>
              <th>Methode</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {anlagen.length === 0 && (
              <tr><td colSpan={8} className="ac-empty">Noch keine Anlagen erfasst.</td></tr>
            )}
            {anlagen.map(a => (
              <React.Fragment key={a.id}>
                <tr style={{ cursor:"pointer" }} onClick={() => setExpanded(e => ({...e, [a.id]: !e[a.id]}))}>
                  <td>{a.bezeichnung}</td>
                  <td className="ac-mono">{a.anschaffungsdatum}</td>
                  <td>
                    <span className="ac-badge ac-badge-gray">{a.kategorie || "—"}</span>
                  </td>
                  <td className="ac-mono" style={{textAlign:"right"}}>{fmtEur(a.anschaffungskosten)}</td>
                  <td className="ac-mono" style={{textAlign:"right", color:"var(--accent)"}}>
                    {fmtEur(a.restwert)}
                  </td>
                  <td className="ac-mono">{a.nutzungsdauer_jahre} J</td>
                  <td>
                    <span className="ac-badge ac-badge-purple">{a.abschreibungsmethode}</span>
                  </td>
                  <td style={{ color:"var(--ink2)", fontSize:".8rem" }}>
                    {expanded[a.id] ? "▲" : "▼"}
                  </td>
                </tr>
                {expanded[a.id] && (
                  <tr>
                    <td colSpan={8} style={{ padding:"0 24px 16px" }}>
                      <AfaVorschau anlage={a} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <NeuAnlageModal onClose={() => setShowModal(false)} onSaved={load} />
      )}
    </div>
  );
}
