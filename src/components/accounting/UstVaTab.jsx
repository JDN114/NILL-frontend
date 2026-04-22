// src/components/accounting/UstVaTab.jsx
// VAT return (UStVA) with Kennzahlen KZ 21, 35, 41, 44, 59, 61, 65, 86
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const fmt    = (n) => Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtEur = (n) => `${fmt(n)} €`;

const KZ_BESCHREIBUNG = {
  kz_21_umsaetze_19:          { kz:"21", label:"Steuerpfl. Umsätze 19%",          typ:"umsatz" },
  kz_35_umsaetze_7:           { kz:"35", label:"Steuerpfl. Umsätze 7%",           typ:"umsatz" },
  kz_86_ig_lieferungen:       { kz:"86", label:"Innergemeinschaftliche Lieferungen", typ:"umsatz" },
  kz_81_steuerfreie_umsaetze: { kz:"81", label:"Steuerfreie Umsätze",             typ:"umsatz" },
  kz_41_ust_19:               { kz:"41", label:"Umsatzsteuer 19%",                typ:"steuer" },
  kz_44_ust_7:                { kz:"44", label:"Umsatzsteuer 7%",                 typ:"steuer" },
  kz_59_vorsteuer_allgemein:  { kz:"59", label:"Vorsteuer (allgemein)",            typ:"vorsteuer" },
  kz_61_vorsteuer_ig_erwerb:  { kz:"61", label:"Vorsteuer ig-Erwerb",             typ:"vorsteuer" },
  kz_65_zahllast:             { kz:"65", label:"Zahllast / Erstattung",            typ:"zahllast" },
};

function PeriodStatus({ perioden }) {
  return (
    <div className="ac-card" style={{ marginBottom:16 }}>
      <div className="ac-section-title">USt-Perioden</div>
      <table className="ac-table">
        <thead>
          <tr>
            <th>Periode</th>
            <th>Typ</th>
            <th>Status</th>
            <th style={{textAlign:"right"}}>Zahllast</th>
            <th>Fälligkeit</th>
          </tr>
        </thead>
        <tbody>
          {perioden.length === 0 && (
            <tr><td colSpan={5} className="ac-empty">Noch keine USt-Perioden.</td></tr>
          )}
          {perioden.map(p => (
            <tr key={p.id}>
              <td className="ac-mono">{p.bezeichnung || `${p.monat}/${p.jahr}`}</td>
              <td><span className="ac-badge ac-badge-gray">{p.typ || "monatlich"}</span></td>
              <td>
                {p.eingereicht
                  ? <span className="ac-badge ac-badge-green">Eingereicht</span>
                  : <span className="ac-badge ac-badge-gray">Offen</span>}
              </td>
              <td className="ac-mono" style={{ textAlign:"right",
                color: (p.zahllast || 0) >= 0 ? "var(--a3)" : "var(--accent)" }}>
                {fmtEur(p.zahllast)}
              </td>
              <td className="ac-mono">{p.faelligkeitsdatum || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UstVaTab() {
  const today = new Date();
  const firstOfMonth = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-01`;
  const [von, setVon] = useState(firstOfMonth);
  const [bis, setBis] = useState(today.toISOString().slice(0,10));
  const [berechnung, setBerechnung] = useState(null);
  const [perioden, setPerioden] = useState([]);
  const [loading, setLoading] = useState(false);
  const [periodLoading, setPeriodLoading] = useState(true);

  useEffect(() => {
    api.get("/api/v1/buchhaltung/ust/perioden")
      .then(r => setPerioden(r.data || []))
      .catch(() => {})
      .finally(() => setPeriodLoading(false));
  }, []);

  const berechnen = () => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/ust/berechnung", { params: { von, bis } })
      .then(r => setBerechnung(r.data))
      .catch(() => setBerechnung(null))
      .finally(() => setLoading(false));
  };

  const zahllast = berechnung?.kz_65_zahllast || 0;

  return (
    <div>
      {!periodLoading && <PeriodStatus perioden={perioden} />}

      <div className="ac-card" style={{ marginBottom:16 }}>
        <div className="ac-section-title">UStVA berechnen</div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Von</label>
            <input className="ac-input" type="date" value={von} onChange={e => setVon(e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Bis</label>
            <input className="ac-input" type="date" value={bis} onChange={e => setBis(e.target.value)} />
          </div>
          <button className="ac-btn ac-btn-primary" onClick={berechnen} disabled={loading}>
            {loading ? "…" : "Berechnen"}
          </button>
        </div>
      </div>

      {berechnung && (
        <>
          <div className="ac-kpi-grid" style={{ marginBottom:16 }}>
            <div className="ac-kpi">
              <div className="ac-kpi-label">Umsatzsteuer gesamt</div>
              <div className="ac-kpi-value pink">
                {fmtEur((berechnung.kz_41_ust_19 || 0) + (berechnung.kz_44_ust_7 || 0))}
              </div>
            </div>
            <div className="ac-kpi">
              <div className="ac-kpi-label">Vorsteuer gesamt</div>
              <div className="ac-kpi-value purple">
                {fmtEur((berechnung.kz_59_vorsteuer_allgemein || 0) + (berechnung.kz_61_vorsteuer_ig_erwerb || 0))}
              </div>
            </div>
            <div className="ac-kpi">
              <div className="ac-kpi-label">Zahllast / Erstattung (KZ 65)</div>
              <div className={`ac-kpi-value ${zahllast >= 0 ? "pink" : "green"}`}>
                {fmtEur(zahllast)}
              </div>
            </div>
          </div>

          <div className="ac-card" style={{ padding:0 }}>
            <div style={{ padding:"16px 20px" }}>
              <span className="ac-section-title">Kennzahlen-Übersicht</span>
            </div>
            <table className="ac-table">
              <thead>
                <tr>
                  <th style={{width:60}}>KZ</th>
                  <th>Beschreibung</th>
                  <th style={{textAlign:"right"}}>Betrag</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(KZ_BESCHREIBUNG).map(([key, meta]) => {
                  const wert = berechnung[key] || 0;
                  const color =
                    meta.typ === "zahllast"  ? (wert >= 0 ? "var(--a3)" : "var(--accent)") :
                    meta.typ === "steuer"    ? "var(--a3)"   :
                    meta.typ === "vorsteuer" ? "var(--a2)"   :
                    "var(--ink)";
                  return (
                    <tr key={key}>
                      <td className="ac-mono" style={{ color:"var(--accent)", fontWeight:700 }}>
                        {meta.kz}
                      </td>
                      <td style={{ fontSize:".85rem" }}>{meta.label}</td>
                      <td className="ac-mono" style={{ textAlign:"right", color, fontWeight: meta.typ==="zahllast" ? 700 : 400 }}>
                        {fmtEur(wert)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="ac-alert ac-alert-warn" style={{ marginTop:16 }}>
            ⚠ Diese Berechnung dient als Vorbereitung. Bitte mit deinem Steuerberater abstimmen und über ELSTER einreichen.
          </div>
        </>
      )}
    </div>
  );
}
