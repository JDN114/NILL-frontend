// src/pages/AccountingPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

import BuchungenTab         from "../components/accounting/BuchungenTab";
import KontenplanTab        from "../components/accounting/KontenplanTab";
import AnlagenTab           from "../components/accounting/AnlagenTab";
import UstVaTab             from "../components/accounting/UstVaTab";
import BerichteTab          from "../components/accounting/BerichteTab";
import GeschaeftspartnerTab from "../components/accounting/GeschaeftspartnerTab";
import TaxDashboard         from "../components/accounting/TaxDashboard";
import InvoiceList          from "../components/accounting/InvoiceList";
import BankInsights         from "../components/accounting/BankInsights";
import ReceiptUploadModal   from "../components/accounting/ReceiptUploadModal";

const S = `
  :root {
    --accent:#c6ff3c; --a2:#7a5cff; --a3:#ff4d8d;
    --ink:#efede7; --ink2:#9b9890; --bg:#040407;
    --surface:#0d0d14; --surface2:#16161f;
    --border:rgba(239,237,231,.08); --radius:12px;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--ink);font-family:Inter,sans-serif;}

  .ac-page{min-height:100vh;padding:28px 24px;max-width:1400px;margin:0 auto;}
  .ac-header{display:flex;align-items:center;gap:16px;margin-bottom:28px;}
  .ac-logo{font-family:Fraunces,serif;font-size:1.6rem;font-weight:700;color:var(--ink);text-decoration:none;cursor:pointer;transition:color .15s;flex-shrink:0;}
  .ac-logo:hover{color:var(--accent);}
  .ac-logo span{color:var(--accent);}
  .ac-header-divider{width:1px;height:28px;background:var(--border);flex-shrink:0;}
  .ac-title{font-family:Fraunces,serif;font-size:1.3rem;font-weight:600;color:var(--ink2);}
  .ac-header-right{margin-left:auto;display:flex;gap:8px;align-items:center;}

  .ac-tabs{display:flex;gap:4px;background:var(--surface);border-radius:var(--radius);padding:4px;flex-wrap:wrap;margin-bottom:24px;}
  .ac-tab{padding:7px 14px;border-radius:8px;border:none;background:transparent;color:var(--ink2);font-size:.82rem;cursor:pointer;font-family:Inter,sans-serif;white-space:nowrap;transition:all .15s;}
  .ac-tab:hover{color:var(--ink);background:var(--surface2);}
  .ac-tab.active{background:var(--accent);color:#000;font-weight:600;}

  .ac-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;}
  .ac-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-bottom:20px;}
  .ac-kpi{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;}
  .ac-kpi-label{font-size:.72rem;color:var(--ink2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;}
  .ac-kpi-value{font-family:JetBrains Mono,monospace;font-size:1.4rem;font-weight:700;}
  .ac-kpi-value.green{color:var(--accent);}
  .ac-kpi-value.purple{color:var(--a2);}
  .ac-kpi-value.pink{color:var(--a3);}
  .ac-kpi-delta{font-size:.72rem;color:var(--ink2);margin-top:4px;}
  .ac-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  @media(max-width:900px){.ac-grid-2{grid-template-columns:1fr;}}
  .ac-section-title{font-family:Fraunces,serif;font-size:1.05rem;font-weight:600;margin-bottom:14px;}

  .ac-btn{padding:8px 18px;border-radius:8px;border:none;font-family:Inter,sans-serif;font-size:.85rem;cursor:pointer;transition:all .15s;font-weight:500;}
  .ac-btn-primary{background:var(--accent);color:#000;}
  .ac-btn-primary:hover{opacity:.9;}
  .ac-btn-ghost{background:transparent;border:1px solid var(--border);color:var(--ink);}
  .ac-btn-ghost:hover{border-color:var(--accent);color:var(--accent);}
  .ac-btn-danger{background:transparent;border:1px solid rgba(255,77,141,.3);color:var(--a3);}
  .ac-btn-danger:hover{background:rgba(255,77,141,.1);}
  .ac-btn-sm{padding:5px 12px;font-size:.78rem;}

  .ac-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:.72rem;font-weight:600;}
  .ac-badge-green{background:rgba(198,255,60,.15);color:var(--accent);}
  .ac-badge-purple{background:rgba(122,92,255,.15);color:var(--a2);}
  .ac-badge-pink{background:rgba(255,77,141,.15);color:var(--a3);}
  .ac-badge-gray{background:rgba(155,152,144,.1);color:var(--ink2);}

  .ac-table{width:100%;border-collapse:collapse;font-size:.85rem;}
  .ac-table th{text-align:left;padding:10px 14px;border-bottom:1px solid var(--border);color:var(--ink2);font-weight:500;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;}
  .ac-table td{padding:11px 14px;border-bottom:1px solid var(--border);}
  .ac-table tr:last-child td{border-bottom:none;}
  .ac-table tr:hover td{background:rgba(255,255,255,.02);}

  .ac-mono{font-family:JetBrains Mono,monospace;}
  .ac-input{background:var(--surface2);border:1px solid var(--border);color:var(--ink);padding:9px 12px;border-radius:8px;font-family:Inter,sans-serif;font-size:.85rem;outline:none;width:100%;}
  .ac-input:focus{border-color:var(--accent);}
  .ac-select{background:var(--surface2);border:1px solid var(--border);color:var(--ink);padding:9px 12px;border-radius:8px;font-family:Inter,sans-serif;font-size:.85rem;outline:none;cursor:pointer;}
  .ac-select:focus{border-color:var(--accent);}
  .ac-form-row{display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;margin-bottom:16px;}
  .ac-form-col{display:flex;flex-direction:column;gap:6px;flex:1;min-width:130px;}
  .ac-label{font-size:.75rem;color:var(--ink2);}

  .ac-empty{text-align:center;padding:48px;color:var(--ink2);font-size:.9rem;}
  .ac-alert{padding:12px 16px;border-radius:8px;font-size:.85rem;margin-bottom:16px;}
  .ac-alert-warn{background:rgba(255,165,0,.1);border:1px solid rgba(255,165,0,.2);color:#ffb347;}
  .ac-alert-err{background:rgba(255,77,141,.1);border:1px solid rgba(255,77,141,.2);color:var(--a3);}
  .ac-alert-ok{background:rgba(198,255,60,.1);border:1px solid rgba(198,255,60,.2);color:var(--accent);}

  .ac-spinner{display:inline-block;width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .ac-loading{display:flex;align-items:center;justify-content:center;gap:12px;padding:40px;color:var(--ink2);}

  .ac-modal-backdrop{position:fixed;inset:0;background:rgba(4,4,7,.85);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;}
  .ac-modal{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;}
  .ac-modal-title{font-family:Fraunces,serif;font-size:1.2rem;font-weight:600;margin-bottom:20px;}
  .ac-modal-footer{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;}

  .ac-help-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
  .ac-help-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;cursor:pointer;transition:border-color .15s;}
  .ac-help-card:hover{border-color:var(--accent);}
  .ac-help-icon{font-size:1.6rem;margin-bottom:10px;}
  .ac-help-title{font-family:Fraunces,serif;font-weight:600;font-size:.95rem;margin-bottom:6px;}
  .ac-help-desc{font-size:.82rem;color:var(--ink2);line-height:1.5;}
  .ac-help-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;}
`;

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;
const PIE_COLORS = ["#c6ff3c","#7a5cff","#ff4d8d","#ffb347","#38bdf8"];

function OverviewTab() {
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/dashboard")
      .then(r => setDash(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Dashboard...</div>;
  if (!dash)   return <div className="ac-empty">Dashboard nicht verfuegbar.</div>;

  const gewinn   = (dash.einnahmen||0) - (dash.ausgaben||0);
  const areaData = (dash.monatsverlauf||[]).map(m => ({ name:m.monat, Einnahmen:m.einnahmen, Ausgaben:m.ausgaben }));
  const pieData  = (dash.ausgaben_kategorien||[]).map(k => ({ name:k.kategorie, value:k.betrag }));

  return (
    <div>
      <div className="ac-kpi-grid">
        <div className="ac-kpi"><div className="ac-kpi-label">Einnahmen lfd. Jahr</div><div className="ac-kpi-value green">{fmtEur(dash.einnahmen)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Ausgaben lfd. Jahr</div><div className="ac-kpi-value pink">{fmtEur(dash.ausgaben)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Gewinn / Verlust</div><div className={`ac-kpi-value ${gewinn>=0?"green":"pink"}`}>{fmtEur(gewinn)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Buchungen gesamt</div><div className="ac-kpi-value">{dash.buchungen_gesamt??0}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">USt-Zahllast lfd. Jahr</div><div className="ac-kpi-value">{fmtEur(dash.ust_zahllast)}</div></div>
      </div>
      <div className="ac-grid-2" style={{marginBottom:16}}>
        <div className="ac-card">
          <div className="ac-section-title">Cashflow</div>
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c6ff3c" stopOpacity={0.3}/><stop offset="95%" stopColor="#c6ff3c" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff4d8d" stopOpacity={0.3}/><stop offset="95%" stopColor="#ff4d8d" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.05)"/>
                <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:11}}/>
                <YAxis tick={{fill:"#9b9890",fontSize:11}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                <Tooltip formatter={v=>fmtEur(v)} contentStyle={{background:"#0d0d14",border:"1px solid rgba(239,237,231,.08)",borderRadius:8}}/>
                <Area type="monotone" dataKey="Einnahmen" stroke="#c6ff3c" fill="url(#gE)" strokeWidth={2}/>
                <Area type="monotone" dataKey="Ausgaben"  stroke="#ff4d8d" fill="url(#gA)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <div className="ac-empty" style={{padding:24}}>Noch keine Verlaufsdaten</div>}
        </div>
        <div className="ac-card">
          <div className="ac-section-title">Ausgaben nach Kategorie</div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={e=>e.name}>
                  {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={v=>fmtEur(v)} contentStyle={{background:"#0d0d14",border:"1px solid rgba(239,237,231,.08)",borderRadius:8}}/>
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="ac-empty" style={{padding:24}}>Noch keine Daten</div>}
        </div>
      </div>
      {dash._error && <div className="ac-alert ac-alert-warn" style={{marginBottom:16}}>&#9888; {dash._error}</div>}
      {dash.letzte_buchungen?.length > 0 && (
        <div className="ac-card">
          <div className="ac-section-title">Letzte Buchungen</div>
          <table className="ac-table">
            <thead><tr><th>Datum</th><th>Text</th><th>Beleg</th><th style={{textAlign:"right"}}>Betrag</th></tr></thead>
            <tbody>
              {dash.letzte_buchungen.slice(0,8).map(b => (
                <tr key={b.id}>
                  <td className="ac-mono">{b.buchungsdatum}</td>
                  <td>{b.buchungstext||"--"}</td>
                  <td className="ac-mono" style={{color:"var(--ink2)"}}>{b.beleg_nummer||"--"}</td>
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

function ExportTab() {
  const today = new Date();
  const [von, setVon]             = useState(`${today.getFullYear()}-01-01`);
  const [bis, setBis]             = useState(today.toISOString().slice(0,10));
  const [beraternr, setBeraternr] = useState("99999");
  const [mandantnr, setMandantnr] = useState("00001");
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState(null);

  const doExport = async () => {
    setLoading(true); setMsg(null);
    try {
      const r = await api.get("/api/v1/buchhaltung/export/datev", {
        params: { von, bis, beraternummer: beraternr, mandantennummer: mandantnr },
        responseType: "blob",
      });
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a"); a.href=url; a.download=`DATEV_${von}_${bis}.csv`; a.click();
      URL.revokeObjectURL(url);
      setMsg({type:"ok", text:"DATEV-Export heruntergeladen."});
    } catch(e) { setMsg({type:"err", text:"Export fehlgeschlagen."}); }
    finally { setLoading(false); }
  };

  return (
    <div className="ac-card">
      <div className="ac-section-title">DATEV-Export (Format 700, CP1252)</div>
      {msg && <div className={`ac-alert ${msg.type==="ok"?"ac-alert-ok":"ac-alert-err"}`}>{msg.text}</div>}
      <div className="ac-form-row">
        <div className="ac-form-col"><label className="ac-label">Von</label><input className="ac-input" type="date" value={von} onChange={e=>setVon(e.target.value)}/></div>
        <div className="ac-form-col"><label className="ac-label">Bis</label><input className="ac-input" type="date" value={bis} onChange={e=>setBis(e.target.value)}/></div>
        <div className="ac-form-col"><label className="ac-label">Beraternr.</label><input className="ac-input" value={beraternr} onChange={e=>setBeraternr(e.target.value)} maxLength={5}/></div>
        <div className="ac-form-col"><label className="ac-label">Mandantennr.</label><input className="ac-input" value={mandantnr} onChange={e=>setMandantnr(e.target.value)} maxLength={5}/></div>
        <button className="ac-btn ac-btn-primary" onClick={doExport} disabled={loading}>{loading?"...":"DATEV exportieren"}</button>
      </div>
      <p style={{fontSize:".8rem",color:"var(--ink2)"}}>Direkt importierbar in DATEV Kanzlei-Rechnungswesen und DATEV Unternehmen Online.</p>
    </div>
  );
}

const HELP_MODULES = [
  { icon:"📊", id:"overview",   title:"Ubersicht",          desc:"Das Buchhaltungs-Cockpit. Zeigt Einnahmen, Ausgaben und Gewinn des laufenden Jahres. Cashflow-Chart und Kategorie-Auswertung.", tags:["Dashboard","KPIs","Cashflow"] },
  { icon:"🧾", id:"rechnungen", title:"Rechnungen",          desc:"Alle Eingangs- und Ausgangsrechnungen. Belege per KI-Scan hochladen, Status verfolgen (offen / bezahlt / uberfallig) und direkt buchen.", tags:["Invoices","Upload","KI-Erkennung"] },
  { icon:"📒", id:"buchungen",  title:"Journal (Buchungen)", desc:"Das Buchungsjournal der doppelten Buchfuhrung (HGB/GoB). Buchungssatze manuell anlegen, GoBD-konformer Storno statt Loschen.", tags:["Doppelte Buchfuhrung","GoBD","Storno"] },
  { icon:"📋", id:"kontenplan", title:"Kontenplan",          desc:"SKR03-Kontenrahmen automatisch geseeded. Alle Konten nach Klassen 0-9 gruppiert. Eigene Konten anlegen, Salden einsehen.", tags:["SKR03","Konten","Klassen 0-9"] },
  { icon:"🏗️",id:"anlagen",    title:"Anlagenbuch",         desc:"Anlagevermogen erfassen und automatisch abschreiben. Lineare AfA, Sofortabschreibung (GWG) und degressiv. AfA-Vorschau auf Knopfdruck.", tags:["AfA","GWG","Abschreibung"] },
  { icon:"🏦", id:"ustva",      title:"UStVA",               desc:"Umsatzsteuer-Voranmeldung. Berechnet alle ELSTER-Kennzahlen (KZ 21, 35, 41, 44, 59, 61, 65, 86). Unterstuetzt Reverse Charge, OSS.", tags:["UStVA","ELSTER","Kennzahlen"] },
  { icon:"📈", id:"berichte",   title:"Berichte",            desc:"HGB-Berichte: Bilanz §266, GuV §275, EUR §4 EStG, BWA und Summmen-/Saldenliste. Auf Knopfdruck fur beliebige Zeitraume.", tags:["Bilanz","GuV","EUR","BWA"] },
  { icon:"🤝", id:"partner",    title:"Geschaftspartner",   desc:"Debitoren und Kreditoren verwalten. Adresse, USt-ID, Zahlungsziele. Mahnwesen: 1.-3. Mahnung und Inkasso mit Mahngebuhren.", tags:["Debitoren","Kreditoren","Mahnwesen"] },
  { icon:"💳", id:"bank",       title:"Bank",                desc:"Bankkonten-Ubersicht mit Kontostand und Transaktionsliste. Cashflow-Chart nach Monat, Volltext-Suche uber alle Transaktionen.", tags:["Banking","Kontostand","Transaktionen"] },
  { icon:"📉", id:"steuern",    title:"Steuern",             desc:"Steuerubersicht mit geschatzter Steuerlast. Zeigt aktuelle UStVA-Kennzahlen und Rechtsform fur die Berechnung.", tags:["Steuer","Steuerlast","Rechtsform"] },
  { icon:"📤", id:"export",     title:"Export",              desc:"DATEV Buchungsstapel Format 700, CP1252 — direkt importierbar in DATEV Kanzlei-Rechnungswesen. Mit Beraternummer, Mandantennummer und Zeitraum.", tags:["DATEV","Format 700","Steuerberater"] },
];

function HilfeTab({ onNavigate }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const m = HELP_MODULES.find(x => x.id === selected);
    return (
      <div>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={()=>setSelected(null)} style={{marginBottom:20}}>
          Zuruck zur Ubersicht
        </button>
        <div className="ac-card" style={{maxWidth:640}}>
          <div style={{fontSize:"2.5rem",marginBottom:12}}>{m.icon}</div>
          <div className="ac-modal-title">{m.title}</div>
          <p style={{color:"var(--ink2)",lineHeight:1.7,marginBottom:16}}>{m.desc}</p>
          <div className="ac-help-tags">
            {m.tags.map(t => <span key={t} className="ac-badge ac-badge-purple">{t}</span>)}
          </div>
          <div style={{marginTop:24}}>
            <button className="ac-btn ac-btn-primary" onClick={()=>onNavigate(m.id)}>
              Zu {m.title}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div className="ac-section-title">Alle Module im Uberblick</div>
        <p style={{color:"var(--ink2)",fontSize:".9rem"}}>NILL Buchhaltung ist ein vollwertiges deutsches Buchhaltungssystem nach HGB/GoB/GoBD. Klicke auf ein Modul fur Details.</p>
      </div>
      <div className="ac-help-grid">
        {HELP_MODULES.map(m => (
          <div key={m.id} className="ac-help-card" onClick={()=>setSelected(m.id)}>
            <div className="ac-help-icon">{m.icon}</div>
            <div className="ac-help-title">{m.title}</div>
            <div className="ac-help-desc">{m.desc.slice(0,100)}...</div>
            <div className="ac-help-tags" style={{marginTop:10}}>
              {m.tags.map(t => <span key={t} className="ac-badge ac-badge-gray" style={{fontSize:".68rem"}}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="ac-card" style={{marginTop:24,borderColor:"rgba(198,255,60,.15)"}}>
        <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
          <div style={{fontSize:"1.5rem",flexShrink:0}}>&#9878;</div>
          <div>
            <div style={{fontWeight:600,marginBottom:6}}>Rechtliche Hinweise</div>
            <p style={{fontSize:".82rem",color:"var(--ink2)",lineHeight:1.6}}>NILL Buchhaltung dient als Hilfssystem. Alle steuerlichen Angaben ohne Gewahr -- bitte stimme Jahresabschlusse, UStVA-Meldungen und DATEV-Exporte mit deinem Steuerberater ab.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  {id:"overview",  label:"Ubersicht"},
  {id:"rechnungen",label:"Rechnungen"},
  {id:"buchungen", label:"Journal"},
  {id:"kontenplan",label:"Kontenplan"},
  {id:"anlagen",   label:"Anlagenbuch"},
  {id:"ustva",     label:"UStVA"},
  {id:"berichte",  label:"Berichte"},
  {id:"partner",   label:"Geschaftspartner"},
  {id:"bank",      label:"Bank"},
  {id:"steuern",   label:"Steuern"},
  {id:"export",    label:"Export"},
  {id:"hilfe",     label:"Hilfe"},
];

export default function AccountingPage() {
  const [tab, setTab]               = useState("overview");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.post("/api/v1/buchhaltung/kontenrahmen/init").catch(() => {});
  }, []);

  const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);
  const goTo = (tabId) => setTab(tabId);
  const goToDashboard = () => { window.location.href = "/"; };

  const renderTab = () => {
    switch(tab) {
      case "overview":   return <OverviewTab key={refreshKey}/>;
      case "rechnungen": return (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div className="ac-section-title" style={{margin:0}}>Rechnungen</div>
            <button className="ac-btn ac-btn-primary" onClick={()=>setUploadOpen(true)}>+ Beleg hochladen</button>
          </div>
          <InvoiceList key={refreshKey} onRefresh={triggerRefresh}/>
        </div>
      );
      case "buchungen":  return <BuchungenTab key={refreshKey}/>;
      case "kontenplan": return <KontenplanTab key={refreshKey}/>;
      case "anlagen":    return <AnlagenTab key={refreshKey}/>;
      case "ustva":      return <UstVaTab key={refreshKey}/>;
      case "berichte":   return <BerichteTab key={refreshKey}/>;
      case "partner":    return <GeschaeftspartnerTab key={refreshKey}/>;
      case "bank":       return <BankInsights key={refreshKey}/>;
      case "steuern":    return <TaxDashboard key={refreshKey}/>;
      case "export":     return <ExportTab/>;
      case "hilfe":      return <HilfeTab onNavigate={goTo}/>;
      default:           return null;
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="ac-page">
        <div className="ac-header">
          <a className="ac-logo" onClick={goToDashboard} title="Zuruck zum Dashboard">
            NILL<span>.</span>
          </a>
          <div className="ac-header-divider"/>
          <span className="ac-title">Buchhaltung</span>
          <div className="ac-header-right">
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={()=>setTab("hilfe")}>Hilfe</button>
            <button className="ac-btn ac-btn-primary" onClick={()=>setUploadOpen(true)}>+ Beleg</button>
          </div>
        </div>
        <div className="ac-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`ac-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        {renderTab()}
        {uploadOpen && (
          <ReceiptUploadModal onClose={()=>{ setUploadOpen(false); triggerRefresh(); }}/>
        )}
      </div>
    </>
  );
}
