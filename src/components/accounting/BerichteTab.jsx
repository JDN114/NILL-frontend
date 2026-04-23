// src/components/accounting/BerichteTab.jsx
import React, { useState } from "react";
import api from "../../services/api";

const fmt    = (n) => Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtEur = (n) => `${fmt(n)} EUR`;

function Saldenliste({ von, bis }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const load = () => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/berichte/saldenliste", { params: { von, bis } })
      .then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Saldenliste...</div>;
  if (!data) return <div className="ac-card"><div className="ac-empty"><button className="ac-btn ac-btn-primary" onClick={load}>Saldenliste laden</button></div></div>;
  return (
    <div className="ac-card" style={{ padding:0 }}>
      <div style={{ padding:"16px 20px" }}><span className="ac-section-title">Saldenliste {von} - {bis}</span></div>
      <table className="ac-table" style={{ fontSize:".82rem" }}>
        <thead><tr><th>Kontonr.</th><th>Bezeichnung</th><th style={{textAlign:"right"}}>Soll</th><th style={{textAlign:"right"}}>Haben</th><th style={{textAlign:"right"}}>Saldo</th></tr></thead>
        <tbody>
          {(data.konten || []).map(k => (
            <tr key={k.kontonummer}>
              <td className="ac-mono" style={{color:"var(--accent)"}}>{k.kontonummer}</td>
              <td>{k.bezeichnung}</td>
              <td className="ac-mono" style={{textAlign:"right"}}>{fmtEur(k.soll)}</td>
              <td className="ac-mono" style={{textAlign:"right"}}>{fmtEur(k.haben)}</td>
              <td className="ac-mono" style={{textAlign:"right", color: (k.saldo||0) < 0 ? "var(--a3)" : "var(--accent)"}}>{fmtEur(k.saldo)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ borderTop:"1px solid rgba(239,237,231,.15)" }}>
            <td colSpan={2} style={{ padding:"12px 14px", fontWeight:600 }}>Summe</td>
            <td className="ac-mono" style={{textAlign:"right", padding:"12px 14px", fontWeight:600}}>{fmtEur(data.summe_soll)}</td>
            <td className="ac-mono" style={{textAlign:"right", padding:"12px 14px", fontWeight:600}}>{fmtEur(data.summe_haben)}</td>
            <td className="ac-mono" style={{textAlign:"right", padding:"12px 14px", fontWeight:600, color: Math.abs(data.summe_soll - data.summe_haben) < 0.01 ? "var(--accent)" : "var(--a3)"}}>
              {fmtEur((data.summe_soll || 0) - (data.summe_haben || 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Bilanz({ stichtag }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const load = () => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/berichte/bilanz", { params: { stichtag } })
      .then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Bilanz...</div>;
  if (!data) return <div className="ac-card"><div className="ac-empty"><button className="ac-btn ac-btn-primary" onClick={load}>Bilanz laden (Stichtag: {stichtag})</button></div></div>;

  const renderSection = (title, items, color) => (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontFamily:"Fraunces,serif", fontWeight:600, fontSize:"1rem", borderBottom:"1px solid var(--border)", paddingBottom:8, marginBottom:8 }}>{title}</div>
      {(items || []).map((item, i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", paddingLeft: item.indent ? (item.indent * 16)+"px" : "0" }}>
          <span style={{ fontSize:".85rem", color: item.bold ? "var(--ink)" : "var(--ink2)" }}>{item.bezeichnung}</span>
          <span className="ac-mono" style={{ color, fontWeight: item.bold ? 700 : 400, fontSize:".85rem" }}>{fmtEur(item.betrag)}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="ac-grid-2">
      <div className="ac-card">
        <div className="ac-section-title">Aktiva (§266 Abs. 2 HGB)</div>
        {renderSection("A. Anlagevermogen", data.aktiva?.anlage, "var(--accent)")}
        {renderSection("B. Umlaufvermogen", data.aktiva?.umlauf, "var(--accent)")}
        <div style={{ borderTop:"2px solid var(--accent)", paddingTop:12, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"Fraunces,serif", fontWeight:700 }}>Bilanzsumme Aktiva</span>
          <span className="ac-mono" style={{ color:"var(--accent)", fontWeight:700, fontSize:"1.1rem" }}>{fmtEur(data.aktiva?.summe)}</span>
        </div>
      </div>
      <div className="ac-card">
        <div className="ac-section-title">Passiva (§266 Abs. 3 HGB)</div>
        {renderSection("A. Eigenkapital", data.passiva?.eigenkapital, "var(--a2)")}
        {renderSection("B. Ruckstellungen", data.passiva?.rueckstellungen, "var(--a2)")}
        {renderSection("C. Verbindlichkeiten", data.passiva?.verbindlichkeiten, "var(--a2)")}
        <div style={{ borderTop:"2px solid var(--a2)", paddingTop:12, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"Fraunces,serif", fontWeight:700 }}>Bilanzsumme Passiva</span>
          <span className="ac-mono" style={{ color:"var(--a2)", fontWeight:700, fontSize:"1.1rem" }}>{fmtEur(data.passiva?.summe)}</span>
        </div>
      </div>
    </div>
  );
}

function GuV({ von, bis }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const load = () => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/berichte/guv", { params: { von, bis } })
      .then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade GuV...</div>;
  if (!data) return <div className="ac-card"><div className="ac-empty"><button className="ac-btn ac-btn-primary" onClick={load}>GuV laden</button></div></div>;
  const gewinn = (data.gesamtleistung || 0) - (data.gesamtkosten || 0);
  return (
    <div className="ac-card">
      <div className="ac-section-title">GuV {von} - {bis} (§275 HGB Gesamtkostenverfahren)</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <div>
          <div style={{ color:"var(--ink2)", fontSize:".75rem", marginBottom:8, textTransform:"uppercase", letterSpacing:".04em" }}>Ertrage</div>
          {[["1. Umsatzerlose", data.umsatzerloese],["2. Bestandsveranderungen", data.bestandsveraenderungen],["3. Sonstige betr. Ertrage", data.sonstige_ertraege],["Gesamtleistung", data.gesamtleistung, true]].map(([label, val, bold], i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderTop: bold ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize:".85rem", color: bold ? "var(--ink)" : "var(--ink2)" }}>{label}</span>
              <span className="ac-mono" style={{ color:"var(--accent)", fontWeight: bold ? 700 : 400, fontSize:".85rem" }}>{fmtEur(val)}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ color:"var(--ink2)", fontSize:".75rem", marginBottom:8, textTransform:"uppercase", letterSpacing:".04em" }}>Aufwendungen</div>
          {[["4. Materialaufwand", data.materialaufwand],["6. Personalaufwand", data.personalaufwand],["7. Abschreibungen", data.abschreibungen],["8. Sonstige betr. Aufwendungen", data.sonstige_aufwendungen],["Gesamtkosten", data.gesamtkosten, true]].map(([label, val, bold], i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderTop: bold ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize:".85rem", color: bold ? "var(--ink)" : "var(--ink2)" }}>{label}</span>
              <span className="ac-mono" style={{ color:"var(--a3)", fontWeight: bold ? 700 : 400, fontSize:".85rem" }}>{fmtEur(val)}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop:"2px solid var(--border)", paddingTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"Fraunces,serif", fontWeight:700, fontSize:"1.1rem" }}>{gewinn >= 0 ? "Jahresuberschuss" : "Jahresfehlbetrag"}</span>
        <span className="ac-mono" style={{ fontSize:"1.5rem", fontWeight:700, color: gewinn >= 0 ? "var(--accent)" : "var(--a3)" }}>{fmtEur(Math.abs(gewinn))}</span>
      </div>
    </div>
  );
}

function EueR({ jahr }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const load = () => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/berichte/euer", { params: { jahr } })
      .then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade EUR...</div>;
  if (!data) return <div className="ac-card"><div className="ac-empty"><button className="ac-btn ac-btn-primary" onClick={load}>EUR {jahr} laden</button></div></div>;
  const gewinn = (data.betriebseinnahmen || 0) - (data.betriebsausgaben || 0);
  return (
    <div className="ac-card">
      <div className="ac-section-title">EUR {jahr} (§4 Abs. 3 EStG)</div>
      <div className="ac-grid-2">
        <div>
          <div className="ac-label" style={{ marginBottom:12 }}>Betriebseinnahmen</div>
          {(data.einnahmen_positionen || []).map((p, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0" }}>
              <span style={{ fontSize:".85rem", color:"var(--ink2)" }}>{p.bezeichnung}</span>
              <span className="ac-mono" style={{ color:"var(--accent)", fontSize:".85rem" }}>{fmtEur(p.betrag)}</span>
            </div>
          ))}
          <div style={{ borderTop:"1px solid var(--border)", paddingTop:8, marginTop:8, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontWeight:600 }}>Summe Einnahmen</span>
            <span className="ac-mono" style={{ color:"var(--accent)", fontWeight:700 }}>{fmtEur(data.betriebseinnahmen)}</span>
          </div>
        </div>
        <div>
          <div className="ac-label" style={{ marginBottom:12 }}>Betriebsausgaben</div>
          {(data.ausgaben_positionen || []).map((p, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0" }}>
              <span style={{ fontSize:".85rem", color:"var(--ink2)" }}>{p.bezeichnung}</span>
              <span className="ac-mono" style={{ color:"var(--a3)", fontSize:".85rem" }}>{fmtEur(p.betrag)}</span>
            </div>
          ))}
          <div style={{ borderTop:"1px solid var(--border)", paddingTop:8, marginTop:8, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontWeight:600 }}>Summe Ausgaben</span>
            <span className="ac-mono" style={{ color:"var(--a3)", fontWeight:700 }}>{fmtEur(data.betriebsausgaben)}</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop:20, borderTop:"2px solid var(--border)", paddingTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"Fraunces,serif", fontWeight:700, fontSize:"1.1rem" }}>Gewinn / Verlust</span>
        <span className="ac-mono" style={{ fontSize:"1.5rem", fontWeight:700, color: gewinn >= 0 ? "var(--accent)" : "var(--a3)" }}>{fmtEur(gewinn)}</span>
      </div>
    </div>
  );
}

function BWA({ von, bis }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const load = () => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/berichte/bwa", { params: { von, bis } })
      .then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade BWA...</div>;
  if (!data) return <div className="ac-card"><div className="ac-empty"><button className="ac-btn ac-btn-primary" onClick={load}>BWA laden</button></div></div>;
  return (
    <div className="ac-card">
      <div className="ac-section-title">BWA {von} - {bis}</div>
      <table className="ac-table" style={{ fontSize:".85rem" }}>
        <thead><tr><th>Position</th><th style={{textAlign:"right"}}>Betrag</th><th style={{textAlign:"right"}}>%</th></tr></thead>
        <tbody>
          {(data.positionen || []).map((p, i) => (
            <tr key={i} style={{ fontWeight: p.summe ? 600 : 400 }}>
              <td style={{ paddingLeft: p.einzug ? 24 : 14 }}>{p.bezeichnung}</td>
              <td className="ac-mono" style={{ textAlign:"right", color: p.betrag < 0 ? "var(--a3)" : p.summe ? "var(--accent)" : "var(--ink)" }}>{fmtEur(p.betrag)}</td>
              <td className="ac-mono" style={{ textAlign:"right", color:"var(--ink2)" }}>{p.prozent !== undefined ? `${Number(p.prozent).toFixed(1)} %` : "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const BERICHT_TABS = [
  { id:"saldenliste", label:"Saldenliste" },
  { id:"bilanz",      label:"Bilanz (§266 HGB)" },
  { id:"guv",         label:"GuV (§275 HGB)" },
  { id:"euer",        label:"EUR (§4 EStG)" },
  { id:"bwa",         label:"BWA" },
];

export default function BerichteTab() {
  const today = new Date();
  const [bericht, setBericht]   = useState("guv");
  const [von, setVon]           = useState(`${today.getFullYear()}-01-01`);
  const [bis, setBis]           = useState(today.toISOString().slice(0,10));
  const [stichtag, setStichtag] = useState(today.toISOString().slice(0,10));
  const [jahr, setJahr]         = useState(today.getFullYear());

  return (
    <div>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:16 }}>
        {BERICHT_TABS.map(t => (
          <button key={t.id} className={`ac-btn ${bericht===t.id ? "ac-btn-primary" : "ac-btn-ghost"}`} onClick={() => setBericht(t.id)}>{t.label}</button>
        ))}
      </div>
      {(bericht==="saldenliste" || bericht==="guv" || bericht==="bwa") && (
        <div className="ac-form-row" style={{ marginBottom:16 }}>
          <div className="ac-form-col"><label className="ac-label">Von</label><input className="ac-input" type="date" value={von} onChange={e => setVon(e.target.value)} /></div>
          <div className="ac-form-col"><label className="ac-label">Bis</label><input className="ac-input" type="date" value={bis} onChange={e => setBis(e.target.value)} /></div>
        </div>
      )}
      {bericht==="bilanz" && (
        <div className="ac-form-row" style={{ marginBottom:16 }}>
          <div className="ac-form-col" style={{ maxWidth:220 }}><label className="ac-label">Bilanzstichtag</label><input className="ac-input" type="date" value={stichtag} onChange={e => setStichtag(e.target.value)} /></div>
        </div>
      )}
      {bericht==="euer" && (
        <div className="ac-form-row" style={{ marginBottom:16 }}>
          <div className="ac-form-col" style={{ maxWidth:160 }}>
            <label className="ac-label">Geschaftsjahr</label>
            <select className="ac-select" value={jahr} onChange={e => setJahr(Number(e.target.value))}>
              {[2022,2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      )}
      {bericht==="saldenliste" && <Saldenliste von={von} bis={bis} key={`sl${von}${bis}`} />}
      {bericht==="bilanz"      && <Bilanz stichtag={stichtag} key={`bi${stichtag}`} />}
      {bericht==="guv"         && <GuV    von={von} bis={bis} key={`gv${von}${bis}`} />}
      {bericht==="euer"        && <EueR   jahr={jahr}         key={`eu${jahr}`} />}
      {bericht==="bwa"         && <BWA    von={von} bis={bis} key={`bw${von}${bis}`} />}
    </div>
  );
}
