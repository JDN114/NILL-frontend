// src/components/accounting/BudgetTab.jsx — Budget-Planung (F26)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const MONATE = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const KATEGORIEN_AUSGABEN = ["Miete/Büro","Software/Tools","Marketing","Personalkosten","Steuer","Versicherung","Reisekosten","Sonstiges"];
const KATEGORIEN_EINNAHMEN = ["Umsatz Hauptkunden","Umsatz Neukunden","Sonstige Einnahmen"];

export default function BudgetTab() {
  const now = new Date();
  const [monat, setMonat] = useState(now.getMonth() + 1);
  const [jahr, setJahr]   = useState(now.getFullYear());
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({}); // {key: value}

  const load = useCallback(() => {
    setLoading(true);
    api.get(`/api/v1/budget?jahr=${jahr}&monat=${monat}`)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jahr, monat]);

  useEffect(() => { load(); }, [load]);

  const getGeplant = (kat, typ) => {
    if (!data) return 0;
    const pos = data.positionen?.find(p => p.kategorie === kat && p.typ === typ);
    return pos ? Number(pos.geplant) : 0;
  };

  const save = async (kat, typ, val) => {
    const geplant = parseFloat(val) || 0;
    await api.put("/api/v1/budget", { jahr, monat, kategorie: kat, typ, geplant });
    setEditing(prev => { const n = { ...prev }; delete n[`${kat}_${typ}`]; return n; });
    load();
  };

  const BudgetRow = ({ kat, typ }) => {
    const key = `${kat}_${typ}`;
    const geplant = getGeplant(kat, typ);
    const isEditing = key in editing;
    return (
      <tr>
        <td>{kat}</td>
        <td style={{ textAlign: "right", width: 150 }}>
          {isEditing ? (
            <input
              className="ac-input" type="number" min="0" step="50"
              defaultValue={geplant}
              autoFocus
              style={{ width: 120, textAlign: "right" }}
              onBlur={e => save(kat, typ, e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") save(kat, typ, e.target.value); if (e.key === "Escape") setEditing(prev => { const n={...prev}; delete n[key]; return n; }); }}
            />
          ) : (
            <span style={{ cursor: "pointer", color: geplant > 0 ? "var(--ink)" : "var(--ink2)", textDecoration: "underline dotted" }}
              onClick={() => setEditing(prev => ({ ...prev, [key]: geplant }))}>
              {geplant > 0 ? fmtEur(geplant) : "— klicken —"}
            </span>
          )}
        </td>
      </tr>
    );
  };

  const istAusgaben = data?.ist_ausgaben || 0;
  const istEinnahmen = data?.ist_einnahmen || 0;
  const geplAusgaben = data?.gesamt_geplant_ausgaben || 0;
  const geplEinnahmen = data?.gesamt_geplant_einnahmen || 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Budget-Planung</span>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="ac-select" value={monat} onChange={e => setMonat(+e.target.value)}>
            {MONATE.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
          </select>
          <select className="ac-select" value={jahr} onChange={e => setJahr(+e.target.value)}>
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Vergleich */}
      <div className="ac-kpi-grid" style={{ marginBottom: 16 }}>
        {[
          ["Geplante Einnahmen", geplEinnahmen, "green"],
          ["Ist-Einnahmen", istEinnahmen, "green"],
          ["Geplante Ausgaben", geplAusgaben, "pink"],
          ["Ist-Ausgaben", istAusgaben, "pink"],
          ["Geplanter Gewinn", geplEinnahmen - geplAusgaben, geplEinnahmen - geplAusgaben >= 0 ? "green" : "pink"],
          ["Ist-Gewinn", istEinnahmen - istAusgaben, istEinnahmen - istAusgaben >= 0 ? "green" : "pink"],
        ].map(([label, val, col]) => (
          <div key={label} className="ac-kpi">
            <div className="ac-kpi-label">{label}</div>
            <div className={`ac-kpi-value ${col}`}>{fmtEur(val)}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: ".82rem", color: "var(--ink2)", marginBottom: 16 }}>
        Klicken Sie auf einen Wert um ihn zu bearbeiten. Drücken Sie Enter oder klicken Sie außerhalb zum Speichern.
      </p>

      <div className="ac-grid-2">
        <div className="ac-card">
          <div className="ac-section-title" style={{ color: "var(--accent)" }}>Einnahmen — Plan</div>
          {loading ? <div className="ac-spinner" /> : (
            <table className="ac-table">
              <thead><tr><th>Kategorie</th><th style={{ textAlign: "right" }}>Geplant</th></tr></thead>
              <tbody>
                {KATEGORIEN_EINNAHMEN.map(k => <BudgetRow key={k} kat={k} typ="einnahme" />)}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ fontWeight: 700, paddingTop: 10 }}>Gesamt</td>
                  <td style={{ fontWeight: 700, textAlign: "right", color: "var(--accent)", paddingTop: 10 }}>{fmtEur(geplEinnahmen)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        <div className="ac-card">
          <div className="ac-section-title" style={{ color: "var(--a3)" }}>Ausgaben — Plan</div>
          {loading ? <div className="ac-spinner" /> : (
            <table className="ac-table">
              <thead><tr><th>Kategorie</th><th style={{ textAlign: "right" }}>Geplant</th></tr></thead>
              <tbody>
                {KATEGORIEN_AUSGABEN.map(k => <BudgetRow key={k} kat={k} typ="ausgabe" />)}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ fontWeight: 700, paddingTop: 10 }}>Gesamt</td>
                  <td style={{ fontWeight: 700, textAlign: "right", color: "var(--a3)", paddingTop: 10 }}>{fmtEur(geplAusgaben)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
