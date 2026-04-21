// src/components/accounting/TaxDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";

const S = `
  .td { font-family:"Inter",system-ui,sans-serif; color:#efede7; }
  .td-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:12px; }
  @media(max-width:700px) { .td-grid-3 { grid-template-columns:1fr 1fr; } }
  .td-card { background:rgba(255,255,255,.035); border:1px solid rgba(239,237,231,.07); border-radius:16px; padding:20px; text-align:center; }
  .td-val { font-family:"Fraunces",Georgia,serif; font-size:24px; letter-spacing:-.03em; margin-bottom:4px; }
  .td-val em { font-style:normal; color:#c6ff3c; }
  .td-label { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:rgba(239,237,231,.5); }
  .td-section { font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:rgba(239,237,231,.4); margin:20px 0 12px; display:flex; align-items:center; gap:10px; }
  .td-section::after { content:""; flex:1; height:1px; background:rgba(239,237,231,.07); }
  .td-modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.75); backdrop-filter:blur(8px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
  .td-modal { background:#08080c; border:1px solid rgba(239,237,231,.07); border-radius:20px; padding:32px; width:100%; max-width:400px; }
  .td-modal-title { font-family:"Fraunces",Georgia,serif; font-weight:400; font-size:26px; letter-spacing:-.02em; margin:0 0 20px; }
  .td-modal-title em { font-style:italic; color:#c6ff3c; }
  .td-select { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(239,237,231,.08); border-radius:10px; padding:11px 14px; color:#efede7; font-size:14px; font-family:inherit; outline:none; margin-bottom:20px; transition:border-color .2s; appearance:none; cursor:pointer; }
  .td-select:focus { border-color:rgba(198,255,60,.3); }
  .td-btn { width:100%; padding:13px; background:#c6ff3c; color:#050505; font-size:14px; font-weight:500; border:none; border-radius:99px; cursor:pointer; transition:background .2s; font-family:inherit; }
  .td-btn:hover:not(:disabled) { background:#fff; }
  .td-btn:disabled { opacity:.4; cursor:not-allowed; }
  .td-loading { text-align:center; padding:40px; color:rgba(239,237,231,.4); font-family:"JetBrains Mono",monospace; font-size:12px; letter-spacing:.1em; }
`;

const fmt = (v) => Number(v || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TaxDashboard() {
  const [forms, setForms]           = useState([]);
  const [legalForm, setLegalForm]   = useState("");
  const [selectedForm, setSelected] = useState("");
  const [summary, setSummary]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [showModal, setShowModal]   = useState(false);

  useEffect(() => {
    api.get("/tax/business-profile/options").then(r => setForms(r.data?.forms || [])).catch(() => {});
    api.get("/tax/business-profile")
      .then(r => { if (!r.data?.legal_form) { setShowModal(true); } else { setLegalForm(r.data.legal_form); } })
      .catch(() => setShowModal(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!legalForm) return;
    api.get("/tax/summary").then(r => setSummary(r.data || {})).catch(() => setSummary({}));
  }, [legalForm]);

  const save = async () => {
    if (!selectedForm) return;
    setSaving(true);
    try {
      await api.post("/tax/business-profile/legal-form", { legal_form: selectedForm });
      setLegalForm(selectedForm);
      setShowModal(false);
    } catch { alert("Fehler beim Speichern"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <>
      <style>{S}</style>
      <div className="td-loading">Lade Steuerdaten…</div>
    </>
  );

  const vat = summary?.vat || {};

  return (
    <>
      <style>{S}</style>
      <div className="td">
        <div style={{ filter: !legalForm ? "blur(6px)" : "none", pointerEvents: !legalForm ? "none" : "auto", transition: "filter .3s" }}>
          {legalForm && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontFamily: "var(--mono,monospace)", fontSize: 11, color: "rgba(239,237,231,.5)", letterSpacing: ".14em", textTransform: "uppercase" }}>Rechtsform</span>
              <span style={{ fontFamily: "var(--mono,monospace)", fontSize: 12, color: "#c6ff3c", background: "rgba(198,255,60,.08)", border: "1px solid rgba(198,255,60,.2)", borderRadius: 99, padding: "2px 10px" }}>{legalForm}</span>
              <button onClick={() => setShowModal(true)} style={{ marginLeft: "auto", background: "transparent", border: "1px solid rgba(239,237,231,.08)", borderRadius: 99, color: "rgba(239,237,231,.5)", fontSize: 11, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>Ändern</button>
            </div>
          )}

          <div className="td-section">Ergebnis</div>
          <div className="td-grid-3">
            {[
              { label: "Einnahmen",    val: fmt(summary?.income)       + " €" },
              { label: "Ausgaben",     val: fmt(summary?.expenses)     + " €" },
              { label: "Gewinn",       val: fmt(summary?.profit)       + " €", accent: true },
            ].map(c => (
              <div key={c.label} className="td-card">
                <div className="td-val">{c.accent ? <em>{c.val}</em> : c.val}</div>
                <div className="td-label">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="td-section">Steuer</div>
          <div className="td-grid-3">
            {[
              { label: "Steuerlast",      val: fmt(summary?.tax_total)   + " €" },
              { label: "Netto nach Steuern", val: fmt(summary?.net_after_tax) + " €", accent: true },
              { label: "Steuersatz (est.)", val: summary?.profit ? ((summary?.tax_total / summary?.profit) * 100).toFixed(1) + " %" : "—" },
            ].map(c => (
              <div key={c.label} className="td-card">
                <div className="td-val">{c.accent ? <em>{c.val}</em> : c.val}</div>
                <div className="td-label">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="td-section">Mehrwertsteuer</div>
          <div className="td-grid-3">
            {[
              { label: "Vorsteuer",   val: fmt(vat.input)  + " €" },
              { label: "Umsatzsteuer",val: fmt(vat.output) + " €" },
              { label: "Erstattung",  val: fmt(vat.refund) + " €", accent: true },
            ].map(c => (
              <div key={c.label} className="td-card">
                <div className="td-val">{c.accent ? <em>{c.val}</em> : c.val}</div>
                <div className="td-label">{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="td-modal-bg" onClick={() => legalForm && setShowModal(false)}>
            <div className="td-modal" onClick={e => e.stopPropagation()}>
              <h2 className="td-modal-title">Rechts<em>form.</em></h2>
              <p style={{ fontSize: 13, color: "rgba(239,237,231,.5)", marginBottom: 18, lineHeight: 1.5 }}>
                Wähle deine Unternehmensform — sie bestimmt den Steuersatz und die Berechnungsmethode.
              </p>
              <select className="td-select" value={selectedForm} onChange={e => setSelected(e.target.value)}>
                <option value="">Bitte wählen…</option>
                {forms.map((f, i) => <option key={i} value={f.legal_form}>{f.legal_form}</option>)}
              </select>
              <button className="td-btn" onClick={save} disabled={!selectedForm || saving}>
                {saving ? "Speichern…" : "Bestätigen →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
