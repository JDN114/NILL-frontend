// src/pages/AccountingPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../services/api";
import {
  AreaChart, Area, PieChart, Pie, Cell, Sector,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
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
import AusgangsrechnungTab  from "../components/accounting/AusgangsrechnungTab";

// ── design system ─────────────────────────────────────────────────────────────
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
  .recharts-wrapper,.recharts-surface{outline:none !important;}
  svg:focus{outline:none;}
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

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;
const PIE_COLORS = [
  "#c6ff3c",
  "#7a5cff",
  "rgba(198,255,60,0.55)",
  "rgba(122,92,255,0.6)",
  "rgba(198,255,60,0.3)",
  "rgba(122,92,255,0.35)",
  "#9b9890",
  "rgba(155,152,144,0.5)",
];

const PieActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="var(--ink)" fontSize={13} fontWeight={600}
        fontFamily="JetBrains Mono,monospace">{fmtEur(value)}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--ink2)" fontSize={10}>{payload.name}</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 10} outerRadius={outerRadius + 13}
        startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.5} />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",fontSize:".82rem"}}>
      <div style={{color:"var(--ink2)",marginBottom:6,fontSize:".75rem"}}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{color:p.color,fontFamily:"JetBrains Mono,monospace",marginBottom:2}}>
          {p.name}: {fmtEur(p.value)}
        </div>
      ))}
    </div>
  );
};

// ── Übersicht ─────────────────────────────────────────────────────────────────────────────────
const PERIODEN = [
  { key:"3", label:"3M" }, { key:"6", label:"6M" },
  { key:"12", label:"12M" }, { key:"all", label:"Alle" },
];

function OverviewTab() {
  const [dash,      setDash]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [periode,   setPeriode]   = useState("12");
  const [activeIdx, setActiveIdx] = useState(null);
  const [activeKat, setActiveKat] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/dashboard")
      .then(r => setDash(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const allArea = useMemo(() =>
    (dash?.monatsverlauf || []).map(m => ({
      name: m.monat, Einnahmen: m.einnahmen, Ausgaben: m.ausgaben,
    })), [dash]);

  const areaData = useMemo(() => {
    if (periode === "all") return allArea;
    const n = parseInt(periode, 10);
    return allArea.slice(-n);
  }, [allArea, periode]);

  const allPie = useMemo(() =>
    (dash?.ausgaben_kategorien || []).map(k => ({ name: k.kategorie, value: k.betrag })),
  [dash]);

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Dashboard…</div>;
  if (!dash)   return <div className="ac-empty">Dashboard nicht verfügbar.</div>;

  const gewinn = (dash.einnahmen || 0) - (dash.ausgaben || 0);
  const perioden = [
    { key:"3", label:"3M" }, { key:"6", label:"6M" },
    { key:"12", label:"12M" }, { key:"all", label:"Alle" },
  ];

  return (
    <div>
      <div className="ac-kpi-grid">
        <div className="ac-kpi"><div className="ac-kpi-label">Einnahmen lfd. Jahr</div><div className="ac-kpi-value green">{fmtEur(dash.einnahmen)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Ausgaben lfd. Jahr</div><div className="ac-kpi-value pink">{fmtEur(dash.ausgaben)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Gewinn / Verlust</div><div className={`ac-kpi-value ${gewinn>=0?"green":"pink"}`}>{fmtEur(gewinn)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Buchungen gesamt</div><div className="ac-kpi-value">{dash.buchungen_gesamt ?? 0}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">USt-Zahllast lfd. Jahr</div><div className="ac-kpi-value">{fmtEur(dash.ust_zahllast)}</div></div>
      </div>

      {dash._error && <div className="ac-alert ac-alert-warn" style={{marginBottom:16}}>⚠ {dash._error}</div>}

      <div className="ac-grid-2" style={{marginBottom:16}}>
        <div className="ac-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div className="ac-section-title" style={{marginBottom:0}}>Cashflow</div>
            <div style={{display:"flex",gap:4}}>
              {perioden.map(p => (
                <button key={p.key} onClick={() => setPeriode(p.key)} style={{
                  padding:"3px 10px", borderRadius:6, border:"1px solid var(--border)",
                  background: periode===p.key ? "var(--accent)" : "transparent",
                  color: periode===p.key ? "#000" : "var(--ink2)",
                  fontSize:".72rem", cursor:"pointer",
                  fontWeight: periode===p.key ? 600 : 400, transition:"all .15s",
                }}>{p.label}</button>
              ))}
            </div>
          </div>
          {areaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={areaData} margin={{top:4,right:4,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#c6ff3c" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#c6ff3c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7a5cff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7a5cff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
                <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}/>
                <Tooltip content={({active,payload,label}) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",fontSize:".82rem"}}>
                      <div style={{color:"var(--ink2)",marginBottom:6,fontSize:".75rem"}}>{label}</div>
                      {payload.map((p,i) => (
                        <div key={i} style={{color:p.color,fontFamily:"JetBrains Mono,monospace",marginBottom:2}}>
                          {p.name}: {fmtEur(p.value)}
                        </div>
                      ))}
                    </div>
                  );
                }}/>
                <Area type="monotone" dataKey="Einnahmen" stroke="#c6ff3c" fill="url(#gE)"
                  strokeWidth={2} dot={false} activeDot={{r:5,fill:"#c6ff3c",strokeWidth:0}}
                  animationDuration={600} animationEasing="ease-out"/>
                <Area type="monotone" dataKey="Ausgaben" stroke="#7a5cff" fill="url(#gA)"
                  strokeWidth={2} dot={false} activeDot={{r:5,fill:"#7a5cff",strokeWidth:0}}
                  animationDuration={600} animationEasing="ease-out" animationBegin={100}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <div className="ac-empty" style={{padding:40}}>Noch keine Verlaufsdaten</div>}
          {areaData.length > 0 && (
            <div style={{display:"flex",gap:16,marginTop:8,justifyContent:"center"}}>
              {[["Einnahmen","#c6ff3c"],["Ausgaben","#7a5cff"]].map(([l,col]) => (
                <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:".75rem",color:"var(--ink2)"}}>
                  <div style={{width:12,height:2,background:col,borderRadius:2}}/>{l}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ac-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div className="ac-section-title" style={{marginBottom:0}}>Ausgaben nach Kategorie</div>
            {activeKat && (
              <button onClick={() => setActiveKat(null)} style={{
                fontSize:".72rem", padding:"3px 10px", borderRadius:6,
                border:"1px solid var(--border)", background:"transparent",
                color:"var(--ink2)", cursor:"pointer",
              }}>✕ {activeKat}</button>
            )}
          </div>
          {allPie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={allPie} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    activeIndex={activeIdx}
                    activeShape={(props) => {
                      const {cx,cy,innerRadius,outerRadius,startAngle,endAngle,fill,payload,value} = props;
                      return (
                        <g>
                          <text x={cx} y={cy-8} textAnchor="middle" fill="var(--ink)"
                            fontSize={12} fontWeight={600} fontFamily="JetBrains Mono,monospace">
                            {fmtEur(value)}
                          </text>
                          <text x={cx} y={cy+10} textAnchor="middle" fill="var(--ink2)" fontSize={9}>
                            {payload.name}
                          </text>
                          <Sector cx={cx} cy={cy} innerRadius={innerRadius}
                            outerRadius={outerRadius+5} startAngle={startAngle}
                            endAngle={endAngle} fill={fill}/>
                          <Sector cx={cx} cy={cy} innerRadius={outerRadius+9}
                            outerRadius={outerRadius+11} startAngle={startAngle}
                            endAngle={endAngle} fill={fill} opacity={0.4}/>
                        </g>
                      );
                    }}
                    onMouseEnter={(_,i) => setActiveIdx(i)}
                    onMouseLeave={() => setActiveIdx(null)}
                    onClick={d => setActiveKat(prev => prev===d.name ? null : d.name)}
                    animationDuration={600} animationEasing="ease-out" paddingAngle={2}>
                    {allPie.map((_,i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                        opacity={activeKat && allPie[i].name!==activeKat ? 0.2 : 1}
                        style={{cursor:"pointer"}}/>
                    ))}
                  </Pie>
                  <Tooltip formatter={v => fmtEur(v)}
                    contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,fontSize:".82rem"}}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexWrap:"wrap",gap:"5px 12px",marginTop:6,justifyContent:"center"}}>
                {allPie.slice(0,7).map((p,i) => (
                  <div key={p.name}
                    onClick={() => setActiveKat(prev => prev===p.name ? null : p.name)}
                    style={{
                      display:"flex", alignItems:"center", gap:5, fontSize:".72rem",
                      cursor:"pointer",
                      color: activeKat===p.name ? "var(--ink)" : "var(--ink2)",
                      opacity: activeKat && activeKat!==p.name ? 0.3 : 1,
                      transition:"all .15s",
                    }}>
                    <div style={{width:7,height:7,borderRadius:2,background:PIE_COLORS[i%PIE_COLORS.length],flexShrink:0}}/>
                    {p.name}
                  </div>
                ))}
              </div>
            </>
          ) : <div className="ac-empty" style={{padding:40}}>Noch keine Daten</div>}
        </div>
      </div>

      {dash.letzte_buchungen?.length > 0 && (
        <div className="ac-card">
          <div className="ac-section-title">Letzte Buchungen</div>
          <table className="ac-table">
            <thead><tr><th>Datum</th><th>Text</th><th>Beleg</th><th style={{textAlign:"right"}}>Betrag</th></tr></thead>
            <tbody>
              {dash.letzte_buchungen.slice(0,8).map(b => (
                <tr key={b.id}>
                  <td className="ac-mono">{b.buchungsdatum}</td>
                  <td>{b.buchungstext || "—"}</td>
                  <td className="ac-mono" style={{color:"var(--ink2)"}}>{b.beleg_nummer || "—"}</td>
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

// ── Export ────────────────────────────────────────────────────────────────────
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
        <button className="ac-btn ac-btn-primary" onClick={doExport} disabled={loading}>{loading?"…":"DATEV exportieren"}</button>
      </div>
      <p style={{fontSize:".8rem",color:"var(--ink2)"}}>Direkt importierbar in DATEV Kanzlei-Rechnungswesen und DATEV Unternehmen Online.</p>
    </div>
  );
}

// ── Rechnungen (Eingehend + Ausgehend) ───────────────────────────────────────
function RechnungenTab({ onUpload, onRefresh, refreshKey }) {
  const [sub, setSub] = useState("eingehend");
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{display:"flex",gap:4,background:"var(--surface)",borderRadius:10,padding:4}}>
          {[["eingehend","📥 Eingehende Rechnungen"],["ausgehend","📤 Ausgehende Rechnungen"]].map(([s,l]) => (
            <button key={s}
              className={`ac-btn ${sub===s?"ac-btn-primary":"ac-btn-ghost"}`}
              style={{fontSize:".82rem"}}
              onClick={() => setSub(s)}>
              {l}
            </button>
          ))}
        </div>
        {sub === "eingehend" && (
          <button className="ac-btn ac-btn-primary" onClick={onUpload}>+ Beleg hochladen</button>
        )}
      </div>
      {sub === "eingehend" && <InvoiceList key={refreshKey} onRefresh={onRefresh} />}
      {sub === "ausgehend" && <AusgangsrechnungTab key={refreshKey} />}
    </div>
  );
}

// ── Hilfe ─────────────────────────────────────────────────────────────────────
const HELP_MODULES = [
  {
    icon: "📊", id: "overview", title: "Übersicht",
    desc: "Das Buchhaltungs-Cockpit. Zeigt Einnahmen, Ausgaben und Gewinn des laufenden Jahres auf einen Blick — mit Cashflow-Chart (monatlich), Ausgaben-Kreisdiagramm nach Kategorie und einer Vorschau der letzten Buchungen. Ideal als täglicher Einstieg.",
    tags: ["Dashboard","KPIs","Cashflow","Jahresübersicht"],
    tips: [
      "Der Cashflow-Chart aktualisiert sich bei jeder neuen Buchung automatisch.",
      "Fehlende Kategorien? Buchungssätze mit aussagekräftigem Buchungstext anlegen.",
    ],
  },
  {
    icon: "🧾", id: "rechnungen", title: "Rechnungen",
    desc: "Zentrale Rechnungsverwaltung in zwei Bereichen. Eingehende Rechnungen: Foto oder PDF hochladen, KI erkennt Vendor, Datum, Beträge und SKR03-Konto automatisch — per Klick in die doppelte Buchführung buchen. Ausgehende Rechnungen: rechtssichere Ausgangsrechnungen nach §14 UStG erstellen, mit automatischer laufender Nummer (RE-JJJJ-NNNN), Kleinunternehmer §19, Reverse Charge §13b, PDF im DIN 5008-Layout und wiederverwendbaren Vorlagen für Absenderstammdaten.",
    tags: ["Eingangsrechnung","Ausgangsrechnung","§14 UStG","KI-Erkennung","PDF","Vorlagen","DIN 5008"],
    tips: [
      "Eingehende Belege: JPG, PNG oder PDF bis 10 MB hochladen — KI befüllt alle Felder automatisch.",
      "Nach dem Scan: 'Jetzt automatisch buchen' erzeugt sofort den passenden Buchungssatz (SKR03).",
      "Ausgehende Rechnungen: Vorlage einmalig mit Firmendaten anlegen, dann bei jeder neuen Rechnung per Klick einfügen.",
      "Entwurf ist frei editierbar. Erst 'Finalisieren' sperrt die Rechnung und vergibt die GoBD-konforme Nummer.",
      "PDF-Download steht für finalisierte Rechnungen (Status Offen/Bezahlt) bereit.",
      "Stornierung ist unumkehrbar und GoBD-konform — die Originalrechnung bleibt sichtbar.",
    ],
  },
  {
    icon: "📒", id: "buchungen", title: "Journal (Buchungen)",
    desc: "Das Herzstück der doppelten Buchführung nach HGB/GoB. Buchungssätze bestehen aus mindestens einer Soll- und einer Haben-Zeile, die bilanziell ausgeglichen sein müssen (Soll = Haben). GoBD-konformer Storno per Gegenbuchung statt Löschen. Buchungen können festgeschrieben werden.",
    tags: ["Doppelte Buchführung","HGB","GoBD","Storno","Festschreibung"],
    tips: [
      "Soll-Konto = wo der Betrag herkommt, Haben-Konto = wo er hingeht (z.B. Kasse Soll / Umsatz Haben).",
      "Stornobuchungen heben den ursprünglichen Buchungssatz auf — die Originalzeile bleibt sichtbar.",
      "Automatische Buchungen aus Belegen erscheinen hier sofort.",
    ],
  },
  {
    icon: "📋", id: "kontenplan", title: "Kontenplan",
    desc: "Vollständiger SKR03-Kontenrahmen, automatisch beim ersten Login für deinen Account angelegt. Konten sind nach Klassen 0–9 (Anlagevermögen, Umlaufvermögen, Eigenkapital, Verbindlichkeiten, Kosten, Erlöse) strukturiert. Salden werden aus den Buchungszeilen live berechnet.",
    tags: ["SKR03","Kontenrahmen","Klassen 0–9","Salden"],
    tips: [
      "Eigene Konten (z.B. für Projektkostenstellen) im Bereich 9000–9999 anlegen.",
      "Konto-Saldo = Summe aller Soll-Buchungen minus Haben-Buchungen auf diesem Konto.",
      "Konten mit Saldo ≠ 0 erscheinen fett in der Saldenliste unter Berichte.",
    ],
  },
  {
    icon: "🏗️", id: "anlagen", title: "Anlagenbuch",
    desc: "Anlagevermögen (Computer, Maschinen, Fahrzeuge, Software) erfassen und automatisch abschreiben. Unterstützt lineare AfA, Sofortabschreibung für GWG bis 800 € netto und degressive Methode. AfA-Vorschau zeigt Abschreibung für jedes Jahr der Nutzungsdauer. Ein Knopfdruck bucht die Jahres-AfA ins Journal.",
    tags: ["AfA","GWG","Lineare AfA","Degressive AfA","§7 EStG"],
    tips: [
      "GWG-Grenze: 250 € → sofort als Aufwand, 250–800 € → Sofortabschreibung im Anlagenbuch.",
      "Nutzungsdauer richtet sich nach der AfA-Tabelle des BMF (z.B. PC = 3 Jahre, Pkw = 6 Jahre).",
      "Die AfA-Buchung auf Knopfdruck bucht auf Konto 4830 (AfA) gegen das jeweilige Anlage-Konto.",
    ],
  },
  {
    icon: "🧮", id: "ustva", title: "UStVA",
    desc: "Umsatzsteuer-Voranmeldung vorbereiten. NILL berechnet alle ELSTER-Kennzahlen (KZ 21, 35, 41, 44, 59, 61, 65, 81, 86) aus deinen Buchungen für einen frei wählbaren Zeitraum. Zeigt Zahllast oder Erstattungsbetrag (KZ 65). Perioden-Übersicht mit Fälligkeitsdaten.",
    tags: ["UStVA","ELSTER","KZ 21–86","§18 UStG","Voranmeldung"],
    tips: [
      "Fälligkeit der UStVA: Monatlich bis zum 10. des Folgemonats (ggf. Dauerfristverlängerung möglich).",
      "Reverse-Charge-Umsätze (§13b) erscheinen in KZ 86 und erhöhen KZ 59 automatisch.",
      "Die Berechnung ist eine Vorschau — die offizielle Meldung erfolgt via ELSTER-Portal.",
    ],
  },
  {
    icon: "📈", id: "berichte", title: "Berichte",
    desc: "Vollwertige gesetzliche Abschlüsse auf Knopfdruck: Bilanz nach §266 HGB (Aktiva/Passiva), GuV nach §275 HGB (Gesamtkostenverfahren), EÜR nach §4 Abs. 3 EStG für Freiberufler und Kleingewerbe, Betriebswirtschaftliche Auswertung (BWA) und Summen-/Saldenliste aller Konten.",
    tags: ["Bilanz §266","GuV §275","EÜR §4 EStG","BWA","Saldenliste"],
    tips: [
      "EÜR vs. Bilanz: Bei Umsatz < 600.000 € oder Gewinn < 60.000 € reicht die EÜR.",
      "Die BWA ist kein Pflichtbericht, aber für Bankgespräche und Controlling unverzichtbar.",
      "Berichte sind zeitraumbezogen — für Jahresabschluss: 01.01.–31.12. wählen.",
    ],
  },
  {
    icon: "🤝", id: "partner", title: "Geschäftspartner",
    desc: "Stammdaten für Debitoren (Kunden) und Kreditoren (Lieferanten) pflegen: Name, Anschrift, USt-IdNr., E-Mail, Bankverbindung. Mahnwesen mit drei Mahnstufen (freundlich → Frist → letzte) und Übergabe an Inkasso. Mahngebühren und individuelle Mahntexte einstellbar.",
    tags: ["Debitoren","Kreditoren","Mahnwesen","Inkasso","§286 HGB"],
    tips: [
      "Typ 'Beide': Partner, der sowohl Lieferant als auch Kunde ist (z.B. Schwesterunternehmen).",
      "Mahngebühren sind ab der 2. Mahnung zulässig (§ 280 BGB, Verzugsschadensersatz).",
      "USt-IdNr. wird für innergemeinschaftliche Lieferungen (§6a UStG) benötigt.",
    ],
  },
  {
    icon: "🏦", id: "bank", title: "Bank",
    desc: "Bankkonten-Übersicht mit aktuellem Kontostand und vollständiger Transaktionsliste. Monatlicher Cashflow-Chart (Einnahmen grün, Ausgaben pink). Volltext-Suche über alle Transaktionsdetails. Grundlage für den Bankabgleich mit deinen Buchungen.",
    tags: ["Banking","Kontostand","Transaktionen","Cashflow","Kontoabgleich"],
    tips: [
      "Transaktionen lassen sich nach Betrag, Datum oder Verwendungszweck durchsuchen.",
      "Fehlende Buchungen? Über 'Eingangsbelege' können Bankumsätze direkt mit Belegen verknüpft werden.",
    ],
  },
  {
    icon: "📉", id: "steuern", title: "Steuern",
    desc: "Steuer-Cockpit mit laufenden Kennzahlen: Einnahmen, Ausgaben, Gewinn und geschätzte Steuerlast (Einkommensteuer/Körperschaftsteuer je nach Rechtsform). UStVA-Schnellübersicht. Unternehmensprofil: Rechtsform, USt-Pflicht und Kleinunternehmer-Status einstellbar.",
    tags: ["Steuerlast","EkSt","KSt","Rechtsform","§19 UStG"],
    tips: [
      "Steuerschätzung ist ein Richtwert — der genaue Betrag hängt von Sonderausgaben, Freibeträgen etc. ab.",
      "Rechtsform beeinflusst die Steuerberechnung: Einzelunternehmen/Freiberufler = EkSt, GmbH/AG = KSt + GewSt.",
      "Kleinunternehmer (§19 UStG): Umsatz < 22.000 € im Vorjahr und < 50.000 € im laufenden Jahr.",
    ],
  },
  {
    icon: "📤", id: "export", title: "Export",
    desc: "DATEV Buchungsstapel im Format 700, CP1252-kodiert — direkt importierbar in DATEV Kanzlei-Rechnungswesen und DATEV Unternehmen Online. Export mit Beraternummer, Mandantennummer und frei wählbarem Zeitraum. Erleichtert die Zusammenarbeit mit dem Steuerberater erheblich.",
    tags: ["DATEV","Format 700","CP1252","Steuerberater","Schnittstelle"],
    tips: [
      "Beraternummer und Mandantennummer beim Steuerberater erfragen.",
      "Export für das Vorjahr zum 31. März abliefern (Abgabefrist Jahresabschluss).",
      "DATEV-Datei nicht manuell öffnen oder bearbeiten — Zeichencodierung CP1252 würde zerstört.",
    ],
  },
];

function HilfeTab({ onNavigate }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const m = HELP_MODULES.find(x => x.id === selected);
    return (
      <div>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={()=>setSelected(null)} style={{marginBottom:20}}>
          ← Zurück zur Übersicht
        </button>
        <div className="ac-card" style={{maxWidth:680}}>
          <div style={{fontSize:"2.5rem",marginBottom:12}}>{m.icon}</div>
          <div className="ac-modal-title">{m.title}</div>
          <p style={{color:"var(--ink2)",lineHeight:1.75,marginBottom:16,fontSize:".92rem"}}>{m.desc}</p>
          <div className="ac-help-tags" style={{marginBottom:20}}>
            {m.tags.map(t => <span key={t} className="ac-badge ac-badge-purple">{t}</span>)}
          </div>
          {m.tips?.length > 0 && (
            <div style={{
              background:"var(--surface2)",borderRadius:10,padding:16,marginBottom:24,
              borderLeft:"3px solid var(--accent)",
            }}>
              <div style={{fontSize:".75rem",color:"var(--accent)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10,fontWeight:600}}>
                💡 Tipps & Hinweise
              </div>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:8}}>
                {m.tips.map((tip,i) => (
                  <li key={i} style={{fontSize:".83rem",color:"var(--ink2)",lineHeight:1.55,display:"flex",gap:10}}>
                    <span style={{color:"var(--accent)",flexShrink:0}}>›</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className="ac-btn ac-btn-primary" onClick={()=>onNavigate(m.id)}>
            Zu {m.title} →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div className="ac-section-title">Alle Module im Überblick</div>
        <p style={{color:"var(--ink2)",fontSize:".9rem"}}>
          NILL Buchhaltung ist ein vollwertiges deutsches Buchhaltungssystem nach HGB/GoB/GoBD.
          Klicke auf ein Modul für Details.
        </p>
      </div>

      <div className="ac-help-grid">
        {HELP_MODULES.map(m => (
          <div key={m.id} className="ac-help-card" onClick={()=>setSelected(m.id)}>
            <div className="ac-help-icon">{m.icon}</div>
            <div className="ac-help-title">{m.title}</div>
            <div className="ac-help-desc">{m.desc.slice(0,100)}…</div>
            <div className="ac-help-tags" style={{marginTop:10}}>
              {m.tags.map(t => <span key={t} className="ac-badge ac-badge-gray" style={{fontSize:".68rem"}}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="ac-card" style={{marginTop:24,borderColor:"rgba(198,255,60,.15)"}}>
        <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
          <div style={{fontSize:"1.5rem",flexShrink:0}}>⚖️</div>
          <div>
            <div style={{fontWeight:600,marginBottom:6}}>Rechtliche Hinweise</div>
            <p style={{fontSize:".82rem",color:"var(--ink2)",lineHeight:1.6}}>
              NILL Buchhaltung dient als Hilfssystem für deine kaufmännische Buchführung.
              Alle steuerlichen Angaben ohne Gewähr — bitte stimme Jahresabschlüsse, UStVA-Meldungen
              und DATEV-Exporte mit deinem Steuerberater ab. GoBD-Konformität liegt in der
              Verantwortung des Anwenders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tabs config ───────────────────────────────────────────────────────────────
const TABS = [
  {id:"overview",   label:"Übersicht"},
  {id:"rechnungen", label:"Rechnungen"},
  {id:"buchungen",  label:"Journal"},
  {id:"kontenplan", label:"Kontenplan"},
  {id:"anlagen",    label:"Anlagenbuch"},
  {id:"ustva",      label:"UStVA"},
  {id:"berichte",   label:"Berichte"},
  {id:"partner",    label:"Geschäftspartner"},
  {id:"bank",       label:"Bank"},
  {id:"steuern",    label:"Steuern"},
  {id:"export",     label:"Export"},
  {id:"hilfe",      label:"❓ Hilfe"},
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AccountingPage() {
  const [tab, setTab]               = useState("overview");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.post("/api/v1/buchhaltung/kontenrahmen/init").catch(() => {});
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  const goTo = (tabId) => setTab(tabId);

  const goToDashboard = () => {
    window.location.href = "/";
  };

  const renderTab = () => {
    switch(tab) {
      case "overview":   return <OverviewTab key={refreshKey}/>;
      case "rechnungen": return (
        <RechnungenTab
          onUpload={() => setUploadOpen(true)}
          onRefresh={triggerRefresh}
          refreshKey={refreshKey}
        />
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
          <a className="ac-logo" onClick={goToDashboard} title="Zurück zum Dashboard">
            NILL<span>.</span>
          </a>
          <div className="ac-header-divider"/>
          <span className="ac-title">Buchhaltung</span>
          <div className="ac-header-right">
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={()=>setTab("hilfe")}>❓ Hilfe</button>
            <button className="ac-btn ac-btn-primary" onClick={()=>setUploadOpen(true)}>+ Beleg</button>
          </div>
        </div>

        <div className="ac-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`ac-tab${tab===t.id?" active":""}`}
              onClick={()=>setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {renderTab()}

        {uploadOpen && (
          <ReceiptUploadModal
            onClose={()=>{ setUploadOpen(false); triggerRefresh(); }}
          />
        )}
      </div>
    </>
  );
}

