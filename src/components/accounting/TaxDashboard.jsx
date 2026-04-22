// src/components/accounting/TaxDashboard.jsx
// Updated: wired to /tax/summary + new /api/v1/buchhaltung/ust endpoints
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;

const KZ_META = {
  kz_21_umsaetze_19:          { kz:"21", label:"Umsätze 19%" },
  kz_35_umsaetze_7:           { kz:"35", label:"Umsätze 7%" },
  kz_41_ust_19:               { kz:"41", label:"USt 19%" },
  kz_44_ust_7:                { kz:"44", label:"USt 7%" },
  kz_59_vorsteuer_allgemein:  { kz:"59", label:"Vorsteuer" },
  kz_65_zahllast:             { kz:"65", label:"Zahllast" },
};

function LegalFormModal({ onClose }) {
  const [form, setForm] = useState({ rechtsform: "", umsatzsteuer_pflichtig: true, kleinunternehmer: false });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      await api.post("/tax/business-profile", form);
      onClose();
    } catch(e) {
      alert(e.response?.data?.detail || "Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal">
        <div className="ac-modal-title">Unternehmensprofil</div>
        <div className="ac-form-col" style={{ marginBottom:12 }}>
          <label className="ac-label">Rechtsform</label>
          <select className="ac-select" value={form.rechtsform}
            onChange={e => setForm(f => ({...f, rechtsform: e.target.value}))}>
            <option value="">— wählen —</option>
            <option value="einzelunternehmen">Einzelunternehmen</option>
            <option value="gbr">GbR</option>
            <option value="ug">UG (haftungsbeschränkt)</option>
            <option value="gmbh">GmbH</option>
            <option value="ag">AG</option>
            <option value="freiberufler">Freiberufler</option>
          </select>
        </div>
        <div className="ac-form-col" style={{ marginBottom:12 }}>
          <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:".9rem" }}>
            <input type="checkbox" checked={form.umsatzsteuer_pflichtig}
              onChange={e => setForm(f => ({...f, umsatzsteuer_pflichtig: e.target.checked}))} />
            Umsatzsteuerpflichtig
          </label>
        </div>
        <div className="ac-form-col" style={{ marginBottom:20 }}>
          <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:".9rem" }}>
            <input type="checkbox" checked={form.kleinunternehmer}
              onChange={e => setForm(f => ({...f, kleinunternehmer: e.target.checked}))} />
            Kleinunternehmer (§19 UStG)
          </label>
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={loading}>
            {loading ? "…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TaxDashboard() {
  const [summary, setSummary] = useState(null);
  const [ust, setUst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const today = new Date();
  const von = `${today.getFullYear()}-01-01`;
  const bis = today.toISOString().slice(0,10);

  useEffect(() => {
    Promise.all([
      api.get("/tax/summary").catch(() => null),
      api.get("/api/v1/buchhaltung/ust/berechnung", { params: { von, bis } }).catch(() => null),
    ]).then(([s, u]) => {
      setSummary(s?.data || null);
      setUst(u?.data || null);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Steuerdaten…</div>;

  const einnahmen = summary?.total_income ?? 0;
  const ausgaben  = summary?.total_expenses ?? 0;
  const gewinn    = einnahmen - ausgaben;
  const est       = summary?.estimated_tax ?? 0;
  const mwst      = summary?.vat_amount ?? 0;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <span style={{ fontFamily:"Fraunces,serif", fontSize:"1.1rem", fontWeight:600 }}>Steuer-Übersicht</span>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setShowProfile(true)}>
          ⚙ Unternehmensprofil
        </button>
      </div>

      <div className="ac-kpi-grid" style={{ marginBottom:20 }}>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Einnahmen (lfd. Jahr)</div>
          <div className="ac-kpi-value green">{fmtEur(einnahmen)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Ausgaben (lfd. Jahr)</div>
          <div className="ac-kpi-value pink">{fmtEur(ausgaben)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Gewinn / Verlust</div>
          <div className={`ac-kpi-value ${gewinn >= 0 ? "green" : "pink"}`}>{fmtEur(gewinn)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Geschätzte Steuerlast</div>
          <div className="ac-kpi-value pink">{fmtEur(est)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">MwSt (nicht abgeführt)</div>
          <div className="ac-kpi-value">{fmtEur(mwst)}</div>
        </div>
      </div>

      {ust && (
        <div className="ac-card">
          <div className="ac-section-title">UStVA-Kennzahlen (lfd. Jahr)</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
            {Object.entries(KZ_META).map(([key, meta]) => (
              <div key={key} style={{ background:"var(--surface2)", borderRadius:8, padding:14 }}>
                <div style={{ fontSize:".72rem", color:"var(--ink2)", textTransform:"uppercase", letterSpacing:".04em", marginBottom:6 }}>
                  KZ {meta.kz} – {meta.label}
                </div>
                <div className="ac-mono" style={{
                  fontSize:"1.1rem", fontWeight:700,
                  color: meta.kz==="65"
                    ? (ust[key]>=0 ? "var(--a3)" : "var(--accent)")
                    : meta.kz.startsWith("5") || meta.kz==="61"
                      ? "var(--a2)"
                      : "var(--ink)"
                }}>
                  {fmtEur(ust[key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ac-alert ac-alert-warn" style={{ marginTop:16 }}>
        ℹ Steuerliche Angaben ohne Gewähr. Bitte mit deinem Steuerberater abstimmen.
      </div>

      {showProfile && <LegalFormModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}
