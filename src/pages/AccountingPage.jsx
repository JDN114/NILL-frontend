// src/pages/AccountingPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

// ── sub-tabs ────────────────────────────────────────────────────────────────
import BuchungenTab       from "../components/accounting/BuchungenTab";
import KontenplanTab      from "../components/accounting/KontenplanTab";
import AnlagenTab         from "../components/accounting/AnlagenTab";
import UstVaTab           from "../components/accounting/UstVaTab";
import BerichteTab        from "../components/accounting/BerichteTab";
import GeschaeftspartnerTab from "../components/accounting/GeschaeftspartnerTab";
import TaxDashboard       from "../components/accounting/TaxDashboard";
import InvoiceList        from "../components/accounting/InvoiceList";
import BankInsights       from "../components/accounting/BankInsights";
import ReceiptUploadModal from "../components/accounting/ReceiptUploadModal";

// ── design system ────────────────────────────────────────────────────────────
const S = `
  :root {
    --accent: #c6ff3c;
    --a2: #7a5cff;
    --a3: #ff4d8d;
    --ink: #efede7;
    --ink2: #9b9890;
    --bg: #040407;
    --surface: #0d0d14;
    --surface2: #16161f;
    --border: rgba(239,237,231,.08);
    --radius: 12px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--ink); font-family: Inter, sans-serif; }

  .ac-page { min-height: 100vh; padding: 32px 24px; max-width: 1400px; margin: 0 auto; }
  .ac-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
  .ac-title  { font-family: Fraunces, serif; font-size: 2rem; font-weight: 700; }
  .ac-title span { color: var(--accent); }

  .ac-tabs   { display:flex; gap:4px; background:var(--surface); border-radius:var(--radius); padding:4px; flex-wrap:wrap; margin-bottom:28px; }
  .ac-tab    { padding:8px 16px; border-radius:8px; border:none; background:transparent; color:var(--ink2); font-size:.85rem; cursor:pointer; font-family:Inter,sans-serif; white-space:nowrap; transition:all .15s; }
  .ac-tab:hover   { color:var(--ink); background:var(--surface2); }
  .ac-tab.active  { background:var(--accent); color:#000; font-weight:600; }

  .ac-card   { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:24px; }
  .ac-card-sm { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:16px; }

  .ac-kpi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-bottom:24px; }
  .ac-kpi      { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; }
  .ac-kpi-label { font-size:.75rem; color:var(--ink2); text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px; }
  .ac-kpi-value { font-family: JetBrains Mono, monospace; font-size:1.5rem; font-weight:700; }
  .ac-kpi-value.green  { color:var(--accent); }
  .ac-kpi-value.purple { color:var(--a2); }
  .ac-kpi-value.pink   { color:var(--a3); }
  .ac-kpi-delta { font-size:.75rem; color:var(--ink2); margin-top:4px; }

  .ac-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .ac-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
  @media(max-width:900px){ .ac-grid-2,.ac-grid-3 { grid-template-columns:1fr; } }

  .ac-section-title { font-family:Fraunces,serif; font-size:1.1rem; font-weight:600; margin-bottom:16px; }

  .ac-btn       { padding:8px 18px; border-radius:8px; border:none; font-family:Inter,sans-serif; font-size:.85rem; cursor:pointer; transition:all .15s; font-weight:500; }
  .ac-btn-primary { background:var(--accent); color:#000; }
  .ac-btn-primary:hover { opacity:.9; }
  .ac-btn-ghost   { background:transparent; border:1px solid var(--border); color:var(--ink); }
  .ac-btn-ghost:hover { border-color:var(--accent); color:var(--accent); }
  .ac-btn-danger  { background:transparent; border:1px solid rgba(255,77,141,.3); color:var(--a3); }
  .ac-btn-danger:hover { background:rgba(255,77,141,.1); }
  .ac-btn-sm { padding:5px 12px; font-size:.78rem; }

  .ac-badge { display:inline-block; padding:2px 8px; border-radius:20px; font-size:.72rem; font-weight:600; }
  .ac-badge-green  { background:rgba(198,255,60,.15);  color:var(--accent); }
  .ac-badge-purple { background:rgba(122,92,255,.15); color:var(--a2); }
  .ac-badge-pink   { background:rgba(255,77,141,.15);  color:var(--a3); }
  .ac-badge-gray   { background:rgba(155,152,144,.1);  color:var(--ink2); }

  .ac-table { width:100%; border-collapse:collapse; font-size:.85rem; }
  .ac-table th { text-align:left; padding:10px 14px; border-bottom:1px solid var(--border); color:var(--ink2); font-weight:500; font-size:.75rem; text-transform:uppercase; letter-spacing:.04em; }
  .ac-table td { padding:12px 14px; border-bottom:1px solid var(--border); }
  .ac-table tr:last-child td { border-bottom:none; }
  .ac-table tr:hover td { background:rgba(255,255,255,.02); }

  .ac-mono { font-family:JetBrains Mono,monospace; }

  .ac-input { background:var(--surface2); border:1px solid var(--border); color:var(--ink); padding:9px 12px; border-radius:8px; font-family:Inter,sans-serif; font-size:.85rem; outline:none; width:100%; }
  .ac-input:focus { border-color:var(--accent); }
  .ac-select { background:var(--surface2); border:1px solid var(--border); color:var(--ink); padding:9px 12px; border-radius:8px; font-family:Inter,sans-serif; font-size:.85rem; outline:none; cursor:pointer; }
  .ac-select:focus { border-color:var(--accent); }

  .ac-form-row { display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; margin-bottom:16px; }
  .ac-form-col { display:flex; flex-direction:column; gap:6px; flex:1; min-width:140px; }
  .ac-label    { font-size:.75rem; color:var(--ink2); }

  .ac-empty { text-align:center; padding:48px; color:var(--ink2); font-size:.9rem; }

  .ac-alert { padding:12px 16px; border-radius:8px; font-size:.85rem; margin-bottom:16px; }
  .ac-alert-warn { background:rgba(255,165,0,.1); border:1px solid rgba(255,165,0,.2); color:#ffb347; }
  .ac-alert-err  { background:rgba(255,77,141,.1); border:1px solid rgba(255,77,141,.2); color:var(--a3); }
  .ac-alert-ok   { background:rgba(198,255,60,.1); border:1px solid rgba(198,255,60,.2); color:var(--accent); }

  .ac-spinner { display:inline-block; width:20px; height:20px; border:2px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .ac-loading { display:flex; align-items:center; justify-content:center; gap:12px; padding:40px; color:var(--ink2); }

  .ac-modal-backdrop { position:fixed; inset:0; background:rgba(4,4,7,.8); z-index:100; display:flex; align-items:center; justify-content:center; padding:16px; }
  .ac-modal { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:28px; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; }
  .ac-modal-title { font-family:Fraunces,serif; font-size:1.2rem; font-weight:600; margin-bottom:20px; }
  .ac-modal-footer { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
`;

// ── helpers ─────────────────────────────────────────────────────────────────
const fmt = (n, digits = 2) =>
  Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const fmtEur = (n) => `${fmt(n)} €`;

const PIE_COLORS = ["#c6ff3c", "#7a5cff", "#ff4d8d", "#ffb347", "#38bdf8"];

// ── Overview / Dashboard tab ─────────────────────────────────────────────────
function OverviewTab() {
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/dashboard")
      .then(r => setDash(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Dashboard…</div>;
  if (!dash) return <div className="ac-empty">Dashboard nicht verfügbar.</div>;

  const gewinn = (dash.einnahmen || 0) - (dash.ausgaben || 0);

  const areaData = (dash.monatsverlauf || []).map(m => ({
    name: m.monat,
    Einnahmen: m.einnahmen,
    Ausgaben: m.ausgaben,
    Gewinn: m.gewinn,
  }));

  const pieData = (dash.ausgaben_kategorien || []).map(k => ({
    name: k.kategorie,
    value: k.betrag,
  }));

  return (
    <div>
      <div className="ac-kpi-grid">
        <div className="ac-kpi">
          <div className="ac-kpi-label">Einnahmen (lfd. Jahr)</div>
          <div className="ac-kpi-value green">{fmtEur(dash.einnahmen)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Ausgaben (lfd. Jahr)</div>
          <div className="ac-kpi-value pink">{fmtEur(dash.ausgaben)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Gewinn / Verlust</div>
          <div className={`ac-kpi-value ${gewinn >= 0 ? "green" : "pink"}`}>{fmtEur(gewinn)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Offene Rechnungen</div>
          <div className="ac-kpi-value purple">{dash.offene_rechnungen ?? "—"}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Buchungssätze gesamt</div>
          <div className="ac-kpi-value">{dash.buchungen_gesamt ?? "—"}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">USt-Zahllast lfd. Quartal</div>
          <div className="ac-kpi-value">{fmtEur(dash.ust_zahllast)}</div>
        </div>
      </div>

      <div className="ac-grid-2" style={{ marginBottom: 16 }}>
        <div className="ac-card">
          <div className="ac-section-title">Einnahmen vs. Ausgaben</div>
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="gEin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c6ff3c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c6ff3c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gAus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d8d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff4d8d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.05)"/>
                <XAxis dataKey="name" tick={{ fill:"#9b9890", fontSize:11 }} />
                <YAxis tick={{ fill:"#9b9890", fontSize:11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => fmtEur(v)} contentStyle={{ background:"#0d0d14", border:"1px solid rgba(239,237,231,.08)", borderRadius:8 }} />
                <Area type="monotone" dataKey="Einnahmen" stroke="#c6ff3c" fill="url(#gEin)" strokeWidth={2}/>
                <Area type="monotone" dataKey="Ausgaben"  stroke="#ff4d8d" fill="url(#gAus)"  strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <div className="ac-empty">Noch keine Daten</div>}
        </div>

        <div className="ac-card">
          <div className="ac-section-title">Ausgaben nach Kategorie</div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={e => e.name}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={v => fmtEur(v)} contentStyle={{ background:"#0d0d14", border:"1px solid rgba(239,237,231,.08)", borderRadius:8 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="ac-empty">Noch keine Daten</div>}
        </div>
      </div>

      {dash.letzte_buchungen?.length > 0 && (
        <div className="ac-card">
          <div className="ac-section-title">Letzte Buchungen</div>
          <table className="ac-table">
            <thead>
              <tr>
                <th>Datum</th><th>Text</th><th>Beleg</th><th style={{textAlign:"right"}}>Betrag</th>
              </tr>
            </thead>
            <tbody>
              {dash.letzte_buchungen.slice(0,8).map(b => (
                <tr key={b.id}>
                  <td className="ac-mono">{b.buchungsdatum}</td>
                  <td>{b.buchungstext}</td>
                  <td className="ac-mono" style={{color:"var(--ink2)"}}>{b.beleg_nummer}</td>
                  <td className="ac-mono" style={{textAlign:"right"}}>{fmtEur(b.betrag)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Invoices wrapper tab ─────────────────────────────────────────────────────
function RechnungenTab({ onUpload }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div className="ac-section-title" style={{margin:0}}>Rechnungen</div>
        <button className="ac-btn ac-btn-primary" onClick={onUpload}>+ Beleg hochladen</button>
      </div>
      <InvoiceList />
    </div>
  );
}

// ── Bank tab ─────────────────────────────────────────────────────────────────
function BankTab() {
  return <BankInsights />;
}

// ── Steuern tab ─────────────────────────────────────────────────────────────
function SteuernTab() {
  return <TaxDashboard />;
}

// ── Export tab ───────────────────────────────────────────────────────────────
function ExportTab() {
  const today = new Date();
  const [von, setVon] = useState(`${today.getFullYear()}-01-01`);
  const [bis, setBis] = useState(today.toISOString().slice(0, 10));
  const [beraternr, setBeraternr] = useState("99999");
  const [mandantennr, setMandantennr] = useState("00001");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const doExport = async (format) => {
    setLoading(true);
    setMsg(null);
    try {
      if (format === "datev") {
        const resp = await api.get("/api/v1/buchhaltung/export/datev", {
          params: { von, bis, beraternummer: beraternr, mandantennummer: mandantennr },
          responseType: "blob",
        });
        const url = URL.createObjectURL(resp.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `DATEV_${von}_${bis}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setMsg({ type: "ok", text: "DATEV-Export heruntergeladen." });
      } else if (format === "csv") {
        const resp = await api.get("/api/v1/buchhaltung/berichte/guv", {
          params: { von, bis },
        });
        const data = resp.data;
        const rows = [
          ["Position", "Betrag"],
          ...Object.entries(data).map(([k, v]) => [k, v]),
        ];
        const csv = rows.map(r => r.join(";")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GuV_${von}_${bis}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setMsg({ type: "ok", text: "GuV-Export heruntergeladen." });
      }
    } catch (e) {
      setMsg({ type: "err", text: "Export fehlgeschlagen." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="ac-card" style={{ marginBottom: 16 }}>
        <div className="ac-section-title">DATEV-Export (Format 700)</div>
        {msg && <div className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}>{msg.text}</div>}
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Von</label>
            <input className="ac-input" type="date" value={von} onChange={e => setVon(e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Bis</label>
            <input className="ac-input" type="date" value={bis} onChange={e => setBis(e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Beraternummer</label>
            <input className="ac-input" value={beraternr} onChange={e => setBeraternr(e.target.value)} maxLength={5} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Mandantennummer</label>
            <input className="ac-input" value={mandantennr} onChange={e => setMandantennr(e.target.value)} maxLength={5} />
          </div>
          <button className="ac-btn ac-btn-primary" onClick={() => doExport("datev")} disabled={loading}>
            {loading ? "…" : "DATEV exportieren"}
          </button>
        </div>
        <p style={{ fontSize:".8rem", color:"var(--ink2)", marginTop:8 }}>
          Exportiert Buchungsstapel als CP1252-kodierte CSV, direkt importierbar in DATEV Kanzlei-Rechnungswesen.
        </p>
      </div>

      <div className="ac-card">
        <div className="ac-section-title">GuV-Schnellexport</div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Von</label>
            <input className="ac-input" type="date" value={von} onChange={e => setVon(e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Bis</label>
            <input className="ac-input" type="date" value={bis} onChange={e => setBis(e.target.value)} />
          </div>
          <button className="ac-btn ac-btn-ghost" onClick={() => doExport("csv")} disabled={loading}>
            GuV als CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",     label: "Übersicht" },
  { id: "rechnungen",   label: "Rechnungen" },
  { id: "buchungen",    label: "Journal" },
  { id: "kontenplan",   label: "Kontenplan" },
  { id: "anlagen",      label: "Anlagenbuch" },
  { id: "ustva",        label: "UStVA" },
  { id: "berichte",     label: "Berichte" },
  { id: "partner",      label: "Geschäftspartner" },
  { id: "bank",         label: "Bank" },
  { id: "steuern",      label: "Steuern" },
  { id: "export",       label: "Export" },
];

export default function AccountingPage() {
  const [tab, setTab] = useState("overview");
  const [uploadOpen, setUploadOpen] = useState(false);

  // init Kontenrahmen once on mount
  useEffect(() => {
    api.get("/api/v1/buchhaltung/kontenrahmen/init").catch(() => {});
  }, []);

  const renderTab = () => {
    switch (tab) {
      case "overview":   return <OverviewTab />;
      case "rechnungen": return <RechnungenTab onUpload={() => setUploadOpen(true)} />;
      case "buchungen":  return <BuchungenTab />;
      case "kontenplan": return <KontenplanTab />;
      case "anlagen":    return <AnlagenTab />;
      case "ustva":      return <UstVaTab />;
      case "berichte":   return <BerichteTab />;
      case "partner":    return <GeschaeftspartnerTab />;
      case "bank":       return <BankTab />;
      case "steuern":    return <SteuernTab />;
      case "export":     return <ExportTab />;
      default:           return null;
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="ac-page">
        <div className="ac-header">
          <h1 className="ac-title">NILL <span>Buchhaltung</span></h1>
          <button className="ac-btn ac-btn-primary" onClick={() => setUploadOpen(true)}>
            + Beleg
          </button>
        </div>

        <div className="ac-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`ac-tab${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {renderTab()}

        {uploadOpen && (
          <ReceiptUploadModal onClose={() => setUploadOpen(false)} />
        )}
      </div>
    </>
  );
}
