// src/components/accounting/TaxDashboard.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} EUR`;

const KZ_META = {
  kz_21_umsaetze_19:         { kz:"21", label:"Umsatze 19%" },
  kz_35_umsaetze_7:          { kz:"35", label:"Umsatze 7%" },
  kz_41_ust_19:              { kz:"41", label:"USt 19%" },
  kz_44_ust_7:               { kz:"44", label:"USt 7%" },
  kz_59_vorsteuer_allgemein: { kz:"59", label:"Vorsteuer" },
  kz_65_zahllast:            { kz:"65", label:"Zahllast" },
};

function LegalFormModal({ onClose }) {
  const [form, setForm] = useState({ rechtsform: "", umsatzsteuer_pflichtig: true, kleinunternehmer: false });
  const [loading, setLoading] = useState(false);
  const save = async () => {
    setLoading(true);
    try { await api.post("/tax/business-profile/legal-form", { legal_form: form.rechtsform }); onClose(); }
    catch(e) { alert(e.response?.data?.detail || "Fehler"); }
    finally { setLoading(false); }
  };
  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal">
        <div className="ac-modal-title">Unternehmensprofil</div>
        <div className="ac-form-col" style={{ marginBottom:12 }}>
          <label className="ac-label">Rechtsform</label>
          <select className="ac-select" value={form.rechtsform}
            onChange={e => setForm(f => ({...f, rechtsform: e.target.value}))}>
            <option value="">-- wahlen --</option>
            <option value="einzelunternehmen">Einzelunternehmen</option>
            <option value="gbr">GbR</option>
            <option value="ug">UG (haftungsbeschrankt)</option>
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
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={loading}>{loading ? "..." : "Speichern"}</button>
        </div>
      </div>
    </div>
  );
}

function SteuerrueckstellungPanel() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]       = useState(false);
  const yr = new Date().getFullYear();

  useEffect(() => {
    api.get("/tax/steuerrueckstellung")
      .then(r => setData(r.data))
      .catch(() => setErr(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="ac-card" style={{ marginTop: 16 }}>
      <div className="ac-loading" style={{ padding: 20 }}><span className="ac-spinner" />Steuerrückstellung berechnen…</div>
    </div>
  );
  if (err || !data) return null;

  const brkKeys = Object.keys(data.breakdown || {});

  return (
    <div className="ac-card" style={{ marginTop: 16, borderColor: "rgba(198,255,60,.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "Fraunces,serif", fontSize: "1.05rem", fontWeight: 600, marginBottom: 2 }}>
            Steuerrückstellungs-Rechner {yr}
          </div>
          <div style={{ fontSize: ".78rem", color: "var(--ink2)" }}>
            Rechtsform: <strong style={{ color: "var(--ink)" }}>{data.rechtsform}</strong>
            {" · "}Effektiver Steuersatz: <strong style={{ color: "var(--a3)" }}>{data.effektiver_steuersatz}%</strong>
          </div>
        </div>
        <div style={{
          background: "rgba(198,255,60,.1)", border: "1px solid rgba(198,255,60,.25)",
          borderRadius: 10, padding: "10px 18px", textAlign: "center", flexShrink: 0,
        }}>
          <div style={{ fontSize: ".7rem", color: "var(--ink2)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>
            Monatliche Rücklage
          </div>
          <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)" }}>
            {fmtEur(data.monatliche_ruecklage)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: ".7rem", color: "var(--ink2)", textTransform: "uppercase", marginBottom: 4 }}>Einnahmen netto</div>
          <div className="ac-mono" style={{ fontWeight: 700, color: "var(--accent)" }}>{fmtEur(data.einnahmen_netto)}</div>
        </div>
        <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: ".7rem", color: "var(--ink2)", textTransform: "uppercase", marginBottom: 4 }}>Ausgaben netto</div>
          <div className="ac-mono" style={{ fontWeight: 700, color: "var(--a3)" }}>{fmtEur(data.ausgaben_netto)}</div>
        </div>
        <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: ".7rem", color: "var(--ink2)", textTransform: "uppercase", marginBottom: 4 }}>Gewinn</div>
          <div className="ac-mono" style={{ fontWeight: 700 }}>{fmtEur(data.gewinn)}</div>
        </div>
        <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: ".7rem", color: "var(--ink2)", textTransform: "uppercase", marginBottom: 4 }}>Gesamtsteuer</div>
          <div className="ac-mono" style={{ fontWeight: 700, color: "var(--a3)" }}>{fmtEur(data.gesamtsteuer)}</div>
        </div>
      </div>

      {brkKeys.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          {brkKeys.map(k => (
            <div key={k} style={{
              background: "var(--surface2)", borderRadius: 8, padding: "8px 14px",
              fontSize: ".8rem", display: "flex", gap: 8, alignItems: "center",
            }}>
              <span style={{ color: "var(--ink2)" }}>
                {{
                  einkommensteuer:       "Einkommensteuer",
                  koerperschaftsteuer:   "Körperschaftsteuer",
                  solidaritaetszuschlag: "Solidaritätszuschlag",
                  gewerbesteuer:         "Gewerbesteuer",
                }[k] || k}
              </span>
              <span className="ac-mono" style={{ fontWeight: 600, color: "var(--ink)" }}>{fmtEur(data.breakdown[k])}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: ".75rem", color: "var(--ink2)", fontStyle: "italic" }}>{data.hinweis}</div>
    </div>
  );
}

export default function TaxDashboard() {
  const [summary, setSummary]       = useState(null);
  const [ust, setUst]               = useState(null);
  const [loading, setLoading]       = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [gobdExporting, setGobdExporting] = useState(false);
  const [gobdVon, setGobdVon] = useState(`${new Date().getFullYear()}-01-01`);
  const [gobdBis, setGobdBis] = useState(new Date().toISOString().slice(0, 10));

  const today = new Date();
  const von = `${today.getFullYear()}-01-01`;
  const bis = today.toISOString().slice(0,10);

  const downloadGobdExport = async () => {
    if (!gobdVon || !gobdBis) { alert("Bitte Von- und Bis-Datum wählen."); return; }
    setGobdExporting(true);
    try {
      const r = await api.get("/tax/gobd-export", {
        params: { von: gobdVon, bis: gobdBis },
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([r.data], { type: "application/zip" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `GoBD_Export_${gobdVon}_${gobdBis}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      const detail = e.response?.data
        ? await e.response.data.text?.().then(t => { try { return JSON.parse(t).detail; } catch { return t; } }).catch(() => null)
        : null;
      alert(detail || "GoBD-Export fehlgeschlagen.");
    } finally {
      setGobdExporting(false);
    }
  };

  useEffect(() => {
    Promise.all([
      api.get("/tax/summary").catch(() => null),
      api.get("/api/v1/buchhaltung/ust/berechnung", { params: { von, bis } }).catch(() => null),
    ]).then(([s, u]) => {
      setSummary(s?.data || null);
      setUst(u?.data || null);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Steuerdaten...</div>;

  const einnahmen = summary?.income    ?? 0;
  const ausgaben  = summary?.expenses  ?? 0;
  const gewinn    = summary?.profit    ?? (einnahmen - ausgaben);
  const est       = summary?.tax_total ?? 0;
  const mwst      = summary?.vat?.kz_65_zahllast ?? 0;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <span style={{ fontFamily:"Fraunces,serif", fontSize:"1.1rem", fontWeight:600 }}>Steuer-Ubersicht</span>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setShowProfile(true)}>Unternehmensprofil</button>
      </div>
      <div className="ac-kpi-grid" style={{ marginBottom:20 }}>
        <div className="ac-kpi"><div className="ac-kpi-label">Einnahmen (lfd. Jahr)</div><div className="ac-kpi-value green">{fmtEur(einnahmen)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Ausgaben (lfd. Jahr)</div><div className="ac-kpi-value pink">{fmtEur(ausgaben)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Gewinn / Verlust</div><div className={`ac-kpi-value ${gewinn >= 0 ? "green" : "pink"}`}>{fmtEur(gewinn)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Geschatzte Steuerlast</div><div className="ac-kpi-value pink">{fmtEur(est)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">MwSt (nicht abgefuhrt)</div><div className="ac-kpi-value">{fmtEur(mwst)}</div></div>
      </div>
      {ust && (
        <div className="ac-card">
          <div className="ac-section-title">UStVA-Kennzahlen (lfd. Jahr)</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
            {Object.entries(KZ_META).map(([key, meta]) => (
              <div key={key} style={{ background:"var(--surface2)", borderRadius:8, padding:14 }}>
                <div style={{ fontSize:".72rem", color:"var(--ink2)", textTransform:"uppercase", letterSpacing:".04em", marginBottom:6 }}>
                  KZ {meta.kz} - {meta.label}
                </div>
                <div className="ac-mono" style={{
                  fontSize:"1.1rem", fontWeight:700,
                  color: meta.kz==="65" ? (ust[key]>=0 ? "var(--a3)" : "var(--accent)") : meta.kz.startsWith("5") || meta.kz==="61" ? "var(--a2)" : "var(--ink)"
                }}>
                  {fmtEur(ust[key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="ac-alert ac-alert-warn" style={{ marginTop:16 }}>
        Steuerliche Angaben ohne Gewahr. Bitte mit Steuerberater abstimmen.
      </div>

      {/* GoBD Betriebsprüfungsexport */}
      <div className="ac-card" style={{ marginTop:16 }}>
        <div className="ac-section-title" style={{ marginBottom:12 }}>
          GoBD-Export (§147 Abs. 6 AO)
        </div>
        <p style={{ fontSize:".82rem", color:"var(--ink2)", marginBottom:14, lineHeight:1.5 }}>
          Erzeugt eine prüfkonforme ZIP-Datei mit <strong>INDEX.XML</strong> und CSV-Dateien
          (Eingangsrechnungen, Ausgangsrechnungen, Banktransaktionen) — kompatibel mit IDEA und DATEV.
        </p>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            <label style={{ fontSize:".75rem", color:"var(--ink2)" }}>Von</label>
            <input
              type="date"
              className="ac-input"
              style={{ width:150 }}
              value={gobdVon}
              onChange={e => setGobdVon(e.target.value)}
            />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            <label style={{ fontSize:".75rem", color:"var(--ink2)" }}>Bis</label>
            <input
              type="date"
              className="ac-input"
              style={{ width:150 }}
              value={gobdBis}
              onChange={e => setGobdBis(e.target.value)}
            />
          </div>
          <button
            className="ac-btn ac-btn-ghost ac-btn-sm"
            style={{ marginTop:18, opacity: gobdExporting ? 0.6 : 1 }}
            disabled={gobdExporting}
            onClick={downloadGobdExport}
          >
            {gobdExporting ? "Wird exportiert…" : "⬇ GoBD-ZIP herunterladen"}
          </button>
        </div>
      </div>

      <SteuerrueckstellungPanel />

      {showProfile && <LegalFormModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}
