// src/pages/AccountingPage.jsx
import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  AreaChart, Area, PieChart, Pie, Cell, Sector,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

// ── Lazy-loaded sub-tab components (split into separate chunks, loaded on demand) ─
const BuchungenTab         = lazy(() => import("../components/accounting/BuchungenTab"));
const KontenplanTab        = lazy(() => import("../components/accounting/KontenplanTab"));
const AnlagenTab           = lazy(() => import("../components/accounting/AnlagenTab"));
const UstVaTab             = lazy(() => import("../components/accounting/UstVaTab"));
const BerichteTab          = lazy(() => import("../components/accounting/BerichteTab"));
const GeschaeftspartnerTab = lazy(() => import("../components/accounting/GeschaeftspartnerTab"));
const TaxDashboard         = lazy(() => import("../components/accounting/TaxDashboard"));
const InvoiceList          = lazy(() => import("../components/accounting/InvoiceList"));
const ReceiptUploadModal   = lazy(() => import("../components/accounting/ReceiptUploadModal"));
const AusgangsrechnungTab  = lazy(() => import("../components/accounting/AusgangsrechnungTab"));
const ImportTab            = lazy(() => import("../components/accounting/ImportTab"));
const OposTab              = lazy(() => import("../components/accounting/OposTab"));
const MahnwesenTab         = lazy(() => import("../components/accounting/MahnwesenTab"));
const GutschriftTab        = lazy(() => import("../components/accounting/GutschriftTab"));
const SerienrechnungTab    = lazy(() => import("../components/accounting/SerienrechnungTab"));
const BelegarchivTab       = lazy(() => import("../components/accounting/BelegarchivTab"));
const ErechnungTab         = lazy(() => import("../components/accounting/ErechnungTab"));
const BankSyncTab          = lazy(() => import("../components/accounting/BankSyncTab"));
const AngeboteTab          = lazy(() => import("../components/accounting/AngeboteTab"));
const ReisekostenTab       = lazy(() => import("../components/accounting/ReisekostenTab"));
const KassenbuchTab        = lazy(() => import("../components/accounting/KassenbuchTab"));
const TagesabschlussTab    = lazy(() => import("../components/accounting/TagesabschlussTab"));
const GewerbesteuerTab     = lazy(() => import("../components/accounting/GewerbesteuerTab"));
const BelegEmailTab        = lazy(() => import("../components/accounting/BelegEmailTab"));
const ProjektTab           = lazy(() => import("../components/accounting/ProjektTab"));
const BudgetTab            = lazy(() => import("../components/accounting/BudgetTab"));
const LieferscheinTab      = lazy(() => import("../components/accounting/LieferscheinTab"));
const SteuerkalenderTab    = lazy(() => import("../components/accounting/SteuerkalenderTab"));
const WechselkurseTab      = lazy(() => import("../components/accounting/WechselkurseTab"));
const ZahlungsmoralTab     = lazy(() => import("../components/accounting/ZahlungsmoralTab"));
const OnboardingWizard     = lazy(() => import("../components/accounting/OnboardingWizard"));
const WiderrufSettingsPanel = lazy(() => import("../components/accounting/WiderrufSettingsPanel"));
const KostenstellenTab     = lazy(() => import("../components/accounting/KostenstellenTab"));
const JahresabschlussTab   = lazy(() => import("../components/accounting/JahresabschlussTab"));
const KassenbonTab         = lazy(() => import("../components/accounting/KassenbonTab"));
const TrinkgeldTab         = lazy(() => import("../components/accounting/TrinkgeldTab"));
const EcClearingTab        = lazy(() => import("../components/accounting/EcClearingTab"));
const GutscheinTab         = lazy(() => import("../components/accounting/GutscheinTab"));
const LohnbuchhaltungContent = lazy(() =>
  import("./LohnbuchhaltungLanding").then(m => ({ default: m.LohnbuchhaltungContent }))
);

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
  .ac-header{display:flex;align-items:center;gap:16px;margin-bottom:28px;flex-wrap:wrap;}
  .ac-logo{font-family:Fraunces,serif;font-size:1.6rem;font-weight:700;color:var(--ink);text-decoration:none;cursor:pointer;transition:color .15s;flex-shrink:0;}
  .ac-logo:hover{color:var(--accent);}
  .ac-logo span{color:var(--accent);}
  .ac-header-divider{width:1px;height:28px;background:var(--border);flex-shrink:0;}
  .ac-title{font-family:Fraunces,serif;font-size:1.3rem;font-weight:600;color:var(--ink2);}
  .ac-header-right{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap;}

  .ac-tabs{display:flex;gap:4px;background:var(--surface);border-radius:var(--radius);padding:4px;overflow-x:auto;overflow-y:hidden;margin-bottom:24px;scrollbar-width:none;-webkit-overflow-scrolling:touch;}
  .ac-tabs::-webkit-scrollbar{display:none;}
  .ac-tab{padding:7px 14px;border-radius:8px;border:none;background:transparent;color:var(--ink2);font-size:.82rem;cursor:pointer;font-family:Inter,sans-serif;white-space:nowrap;transition:all .15s;flex-shrink:0;}
  .ac-tab:hover{color:var(--ink);background:var(--surface2);}
  .ac-tab.active{background:var(--accent);color:#000;font-weight:600;}
  .ac-tab:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
  .ac-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
  .ac-skip-link{position:absolute;top:-48px;left:16px;background:var(--accent);color:#000;padding:6px 14px;border-radius:0 0 8px 8px;font-size:.85rem;font-weight:600;z-index:10000;text-decoration:none;transition:top .15s;}
  .ac-skip-link:focus{top:0;outline:2px solid #000;outline-offset:2px;}
  .ac-tab-soon{opacity:.5;}
  .ac-tab-soon:hover{opacity:.7;}

  .ac-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;}
  .ac-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;margin-bottom:20px;}
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
  .ac-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  @media(max-width:640px){
    .ac-page{padding:16px 12px;}
    .ac-header{margin-bottom:16px;}
    .ac-card{padding:16px;overflow-x:auto;-webkit-overflow-scrolling:touch;}
    .ac-kpi-grid{grid-template-columns:1fr 1fr;}
    .ac-table{min-width:480px;}
    .ac-modal{padding:20px 16px;}
  }

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
  .ac-badge-purple{background:rgba(122,92,255,.15);color:#a585ff;}
  .ac-badge-pink{background:rgba(255,77,141,.15);color:var(--a3);}
  .ac-badge-gray{background:rgba(155,152,144,.1);color:var(--ink2);}

  .ac-table{width:100%;border-collapse:collapse;font-size:.85rem;}
  .ac-table th{text-align:left;padding:10px 14px;border-bottom:1px solid var(--border);color:var(--ink2);font-weight:500;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;}
  .ac-table td{padding:11px 14px;border-bottom:1px solid var(--border);}
  .ac-table tr:last-child td{border-bottom:none;}
  .ac-table tr:hover td{background:rgba(255,255,255,.02);}

  .ac-mono{font-family:JetBrains Mono,monospace;}
  .ac-input{background:var(--surface2);border:1px solid var(--border);color:var(--ink);padding:9px 12px;border-radius:8px;font-family:Inter,sans-serif;font-size:.85rem;width:100%;}
  .ac-input:focus{border-color:var(--accent);outline:none;}
  .ac-input:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
  .ac-select{background:var(--surface2);border:1px solid var(--border);color:var(--ink);padding:9px 12px;border-radius:8px;font-family:Inter,sans-serif;font-size:.85rem;cursor:pointer;}
  .ac-select:focus{border-color:var(--accent);outline:none;}
  .ac-select:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
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

  .recharts-wrapper svg:focus,
  .recharts-wrapper svg *:focus,
  .recharts-surface:focus { outline: none !important; }

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

// ── Session Loading Screen ─────────────────────────────────────────────────
function NillLoader({ text = "Wird geladen…" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={text}
      style={{
        position:"fixed", inset:0,
        background:"#040407",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        zIndex:9999,
      }}
    >
      <style>{`
        @keyframes nill-pulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.35; }
        }
        @keyframes nill-bar {
          0%   { transform:scaleX(0);   opacity:1; }
          80%  { transform:scaleX(1);   opacity:1; }
          100% { transform:scaleX(1);   opacity:0; }
        }
        @keyframes nill-dot {
          0%,80%,100% { transform:scale(0.6); opacity:0.3; }
          40%          { transform:scale(1);   opacity:1;   }
        }
      `}</style>
      <div style={{
        fontFamily:"Fraunces,serif", fontSize:"2.8rem", fontWeight:700,
        color:"#efede7", letterSpacing:"-.02em", marginBottom:40,
        animation:"nill-pulse 2.4s ease-in-out infinite",
      }}>
        NILL<span style={{color:"#c6ff3c"}}>.</span>
      </div>
      <div style={{
        width:180, height:2, background:"rgba(239,237,231,.08)",
        borderRadius:2, overflow:"hidden", marginBottom:28,
      }}>
        <div style={{
          height:"100%", background:"#c6ff3c", borderRadius:2,
          transformOrigin:"left",
          animation:"nill-bar 1.6s cubic-bezier(.4,0,.2,1) infinite",
        }}/>
      </div>
      <div style={{display:"flex", gap:8, marginBottom:24}}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:5, height:5, borderRadius:"50%",
            background:"#c6ff3c",
            animation:`nill-dot 1.2s ease-in-out ${i*0.2}s infinite`,
          }}/>
        ))}
      </div>
      <div style={{
        color:"rgba(155,152,144,.6)", fontSize:".78rem",
        letterSpacing:".08em", textTransform:"uppercase",
        fontFamily:"Inter,sans-serif",
      }}>
        {text}
      </div>
      <div style={{ color:"rgba(155,152,144,.35)", fontSize:".72rem", marginTop:8, fontFamily:"Inter,sans-serif" }}>
        Normalerweise unter 3 Sekunden
      </div>
    </div>
  );
}

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;
const PIE_COLORS = [
  "#c6ff3c",
  "rgba(198,255,60,0.70)",
  "rgba(198,255,60,0.45)",
  "rgba(198,255,60,0.25)",
  "#9b9890",
  "rgba(155,152,144,0.65)",
  "rgba(155,152,144,0.40)",
  "rgba(155,152,144,0.20)",
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

function OverviewTab({ onNavigate, onUpload }) {
  const [dash,      setDash]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [dashError, setDashError] = useState(false);
  const [periode,   setPeriode]   = useState("12");
  const [activeIdx, setActiveIdx] = useState(null);
  const [activeKat, setActiveKat] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setDashError(false);
    api.get("/api/v1/buchhaltung/dashboard")
      .then(r => setDash(r.data))
      .catch(() => setDashError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const fmtMonat = (iso) => {
    const [y, mo] = iso.split("-");
    return new Date(parseInt(y), parseInt(mo) - 1).toLocaleDateString("de-DE", { month: "short", year: "2-digit" });
  };

  const allArea = useMemo(() =>
    (dash?.monatsverlauf || []).map(m => ({
      name: fmtMonat(m.monat), Einnahmen: m.einnahmen, Ausgaben: m.ausgaben,
    })), [dash]);

  const areaData = useMemo(() => {
    if (periode === "all") return allArea;
    const n = parseInt(periode, 10);
    return allArea.slice(-n);
  }, [allArea, periode]);

  const allPie = useMemo(() =>
    (dash?.ausgaben_kategorien || []).map(k => ({ name: k.kategorie, value: k.betrag })),
  [dash]);

  if (loading) return <div role="status" aria-label="Dashboard wird geladen" className="ac-loading"><span className="ac-spinner" aria-hidden="true"/>Lade Dashboard…</div>;
  if (dashError) return (
    <div className="ac-alert ac-alert-err" style={{ display:"flex", alignItems:"center", gap:12 }}>
      Dashboard konnte nicht geladen werden.
      <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={load}>Erneut versuchen</button>
    </div>
  );
  if (!dash) return (
    <div className="ac-empty" style={{ padding:40 }}>
      <div style={{ marginBottom:12 }}>Noch keine Buchungsdaten vorhanden.</div>
      <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
        <button className="ac-btn ac-btn-primary" onClick={() => onNavigate("rechnungen")}>Erste Rechnung erstellen →</button>
        <button className="ac-btn ac-btn-ghost" onClick={load}>↺ Erneut laden</button>
      </div>
    </div>
  );

  const gewinn = (dash.einnahmen || 0) - (dash.ausgaben || 0);
  const perioden = [
    { key:"3", label:"3M" }, { key:"6", label:"6M" },
    { key:"12", label:"12M" }, { key:"all", label:"Alle" },
  ];

  return (
    <div>
      {/* I — Echtzeit-Gewinnübersicht Hero */}
      <div style={{
        display:"flex", gap:24, alignItems:"center",
        background: gewinn>=0 ? "rgba(198,255,60,.06)" : "rgba(255,77,141,.06)",
        border: `1px solid ${gewinn>=0?"rgba(198,255,60,.2)":"rgba(255,77,141,.2)"}`,
        borderRadius:12, padding:"16px 24px", marginBottom:20, flexWrap:"wrap",
      }}>
        <div>
          <div style={{fontSize:".72rem",color:"var(--ink2)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>
            Gewinn lfd. Jahr — Echtzeit
          </div>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:"2.2rem",fontWeight:800,color:gewinn>=0?"var(--accent)":"var(--a3)",letterSpacing:"-.02em"}}>
            {fmtEur(gewinn)}
          </div>
          <div style={{fontSize:".75rem",fontWeight:600,color:gewinn>=0?"var(--accent)":"var(--a3)",marginTop:2}}>
            {gewinn>=0 ? "▲ Gewinn" : "▼ Verlust"}
          </div>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:".7rem",color:"var(--ink2)"}}>Einnahmen</div>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700,color:"var(--accent)"}}>{fmtEur(dash.einnahmen)}</div>
          </div>
          <div>
            <div style={{fontSize:".7rem",color:"var(--ink2)"}}>Ausgaben</div>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700,color:"var(--a3)"}}>{fmtEur(dash.ausgaben)}</div>
          </div>
          <div>
            <div style={{fontSize:".7rem",color:"var(--ink2)"}}>USt-Zahllast</div>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>{fmtEur(dash.ust_zahllast)}</div>
          </div>
          <div>
            <div style={{fontSize:".7rem",color:"var(--ink2)"}}>Buchungen</div>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>{dash.buchungen_gesamt ?? 0}</div>
          </div>
        </div>
      </div>
      {/* Quick actions */}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={() => onNavigate?.("rechnungen")}>
          + Rechnung
        </button>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={onUpload}>
          + Beleg hochladen
        </button>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => onNavigate?.("posten")}>
          Offene Posten
        </button>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" title="Umsatzsteuer-Voranmeldung berechnen und als ELSTER-XML exportieren" onClick={() => onNavigate?.("steuern")}>
          UStVA
        </button>
      </div>

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
            <ResponsiveContainer width="100%" height={220} aria-label="Cashflow-Verlauf: Einnahmen und Ausgaben nach Monat">
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
          ) : <div className="ac-empty" style={{padding:40}}>Noch keine Verlaufsdaten — erstelle deine ersten Rechnungen und Buchungen, um den Cashflow-Verlauf zu sehen.</div>}
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
              <ResponsiveContainer width="100%" height={200} aria-label="Ausgaben nach Kategorie – Tortendiagramm">
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
              <div style={{display:"flex",flexWrap:"wrap",gap:"5px 12px",marginTop:6,justifyContent:"center"}} role="group" aria-label="Kategorien filtern">
                {allPie.slice(0,7).map((p,i) => (
                  <button key={p.name}
                    onClick={() => setActiveKat(prev => prev===p.name ? null : p.name)}
                    aria-pressed={activeKat===p.name}
                    style={{
                      display:"flex", alignItems:"center", gap:5, fontSize:".72rem",
                      cursor:"pointer", background:"transparent", border:"none", padding:"2px 4px", borderRadius:4,
                      color: activeKat===p.name ? "var(--ink)" : "var(--ink2)",
                      opacity: activeKat && activeKat!==p.name ? 0.3 : 1,
                      transition:"all .15s",
                    }}>
                    <div style={{width:7,height:7,borderRadius:2,background:PIE_COLORS[i%PIE_COLORS.length],flexShrink:0}} aria-hidden="true"/>
                    {p.name}
                  </button>
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
const ELSTER_MONATE = [
  {value:"01",label:"Januar"},{value:"02",label:"Februar"},{value:"03",label:"März"},
  {value:"04",label:"April"},{value:"05",label:"Mai"},{value:"06",label:"Juni"},
  {value:"07",label:"Juli"},{value:"08",label:"August"},{value:"09",label:"September"},
  {value:"10",label:"Oktober"},{value:"11",label:"November"},{value:"12",label:"Dezember"},
  {value:"41",label:"Q1 (Jan–Mär)"},{value:"42",label:"Q2 (Apr–Jun)"},
  {value:"43",label:"Q3 (Jul–Sep)"},{value:"44",label:"Q4 (Okt–Dez)"},
];

function ExportTab() {
  const today = new Date();
  const [von, setVon]             = useState(`${today.getFullYear()}-01-01`);
  const [bis, setBis]             = useState(today.toISOString().slice(0,10));
  const [beraternr, setBeraternr] = useState("99999");
  const [mandantnr, setMandantnr] = useState("00001");
  const [loadingD, setLoadingD]   = useState(false);

  // ELSTER state
  const [elsterVon, setElsterVon]         = useState(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-01`);
  const [elsterBis, setElsterBis]         = useState(today.toISOString().slice(0,10));
  const [steuernummer, setSteuernummer]   = useState("");
  const [finanzamtId, setFinanzamtId]     = useState("9300");
  const [zeitraum, setZeitraum]           = useState(String(today.getMonth()+1).padStart(2,"0"));
  const [testModus, setTestModus]         = useState(true);
  const [loadingE, setLoadingE]           = useState(false);
  const [msg, setMsg]                     = useState(null);

  const doDatev = async () => {
    setLoadingD(true); setMsg(null);
    try {
      const r = await api.get("/api/v1/buchhaltung/export/datev", {
        params: { von, bis, beraternummer: beraternr, mandantennummer: mandantnr },
        responseType: "blob",
      });
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a"); a.href=url; a.download=`DATEV_${von}_${bis}.csv`; a.click();
      URL.revokeObjectURL(url);
      setMsg({type:"ok", text:"DATEV-Export heruntergeladen."});
    } catch(e) { setMsg({type:"err", text:"DATEV-Export fehlgeschlagen."}); }
    finally { setLoadingD(false); }
  };

  const doElster = async () => {
    if (!steuernummer.trim()) { setMsg({type:"err", text:"Bitte Steuernummer eingeben."}); return; }
    setLoadingE(true); setMsg(null);
    try {
      const r = await api.post(
        "/api/v1/buchhaltung/export/elster",
        {
          von: elsterVon, bis: elsterBis,
          steuernummer: steuernummer.trim(),
          finanzamt_id: finanzamtId,
          zeitraum,
          test_modus: true,  // Produktiv-Modus gesperrt bis valide HerstellerID vorliegt
        },
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ELSTER_UStVA_${elsterVon.slice(0,7)}.xml`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg({type:"ok", text:"ELSTER XML heruntergeladen. Bitte auf elster.de unter 'Formulare & Leistungen → Umsatzsteuervoranmeldung → Datei hochladen' einreichen."});
    } catch(e) { setMsg({type:"err", text:"ELSTER-Export fehlgeschlagen."}); }
    finally { setLoadingE(false); }
  };

  return (
    <div>
      {msg && (
        <div className={`ac-alert ${msg.type==="ok"?"ac-alert-ok":"ac-alert-err"}`}
          style={{cursor:"pointer",marginBottom:16}} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      {/* G — Steuerberater-Paket */}
      <div className="ac-card" style={{marginBottom:16,borderColor:"rgba(198,255,60,.35)",background:"rgba(198,255,60,.03)"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
          <div className="ac-section-title" style={{marginBottom:0}}>🗂️ Steuerberater-Übergabe mit 1 Klick</div>
        </div>
        <p style={{fontSize:".85rem",color:"var(--ink2)",marginBottom:14,lineHeight:1.6}}>
          DATEV Buchungsstapel + Stammdaten + Anleitung — alles in einem ZIP. Direkt an Ihren Steuerberater schicken.
        </p>
        <div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap"}}>
          <div className="ac-form-col"><label className="ac-label">Von</label><input className="ac-input" type="date" value={von} onChange={e=>setVon(e.target.value)}/></div>
          <div className="ac-form-col"><label className="ac-label">Bis</label><input className="ac-input" type="date" value={bis} onChange={e=>setBis(e.target.value)}/></div>
          <div className="ac-form-col" style={{maxWidth:120}}><label className="ac-label">Beraternr.</label><input className="ac-input" value={beraternr} onChange={e=>setBeraternr(e.target.value)} maxLength={5}/></div>
          <button className="ac-btn ac-btn-primary" style={{fontSize:".9rem",padding:"9px 20px"}} onClick={async () => {
            try {
              const r = await api.get("/api/v1/buchhaltung/export/steuerberater-paket", {
                params:{von,bis,beraternummer:beraternr,mandantennummer:mandantnr}, responseType:"blob"
              });
              const url = URL.createObjectURL(r.data);
              const a = document.createElement("a"); a.href=url; a.download=`Steuerberater_Paket_${von}_${bis}.zip`; a.click();
              URL.revokeObjectURL(url);
              setMsg({type:"ok",text:"Steuerberater-Paket heruntergeladen."});
            } catch { setMsg({type:"err",text:"Paket-Export fehlgeschlagen."}); }
          }}>📦 ZIP herunterladen</button>
        </div>
      </div>

      {/* DATEV Stammdaten (F20 + F22) */}
      <div className="ac-card" style={{marginBottom:16,borderColor:"rgba(198,255,60,.15)"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
          <div className="ac-section-title" style={{marginBottom:0}}>DATEV Stammdaten-Export (Debitoren/Kreditoren)</div>
          <span className="ac-badge ac-badge-green" style={{fontSize:".7rem"}}>Neu</span>
        </div>
        <p style={{fontSize:".82rem",color:"var(--ink2)",marginBottom:12}}>
          Exportiert alle Geschäftspartner mit DATEV-Personenkontennummern (Debitoren ab 10000, Kreditoren ab 70000). Direkt importierbar in DATEV.
        </p>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <div className="ac-form-col" style={{maxWidth:160}}>
            <label className="ac-label">Beraternr.</label>
            <input className="ac-input" value={beraternr} onChange={e=>setBeraternr(e.target.value)} maxLength={5}/>
          </div>
          <div className="ac-form-col" style={{maxWidth:160}}>
            <label className="ac-label">Mandantennr.</label>
            <input className="ac-input" value={mandantnr} onChange={e=>setMandantnr(e.target.value)} maxLength={5}/>
          </div>
          <div style={{display:"flex",alignItems:"flex-end"}}>
            <button className="ac-btn ac-btn-primary" onClick={async () => {
              try {
                const r = await api.get("/api/v1/buchhaltung/export/datev-stammdaten", {
                  params:{beraternummer:beraternr,mandantennummer:mandantnr}, responseType:"blob"
                });
                const url = URL.createObjectURL(r.data);
                const a = document.createElement("a"); a.href=url; a.download="DATEV_Stammdaten.csv"; a.click();
                URL.revokeObjectURL(url);
                setMsg({type:"ok",text:"DATEV Stammdaten heruntergeladen."});
              } catch(e) { setMsg({type:"err",text:"Stammdaten-Export fehlgeschlagen."}); }
            }}>Stammdaten exportieren</button>
          </div>
        </div>
      </div>

      {/* DATEV */}
      <div className="ac-card" style={{marginBottom:16}}>
        <div className="ac-section-title">DATEV-Export (Format 700, CP1252)</div>
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Von</label><input className="ac-input" type="date" value={von} onChange={e=>setVon(e.target.value)}/></div>
          <div className="ac-form-col"><label className="ac-label">Bis</label><input className="ac-input" type="date" value={bis} onChange={e=>setBis(e.target.value)}/></div>
          <div className="ac-form-col"><label className="ac-label">Beraternr.</label><input className="ac-input" value={beraternr} onChange={e=>setBeraternr(e.target.value)} maxLength={5}/></div>
          <div className="ac-form-col"><label className="ac-label">Mandantennr.</label><input className="ac-input" value={mandantnr} onChange={e=>setMandantnr(e.target.value)} maxLength={5}/></div>
          <div style={{display:"flex",alignItems:"flex-end"}}>
            <button className="ac-btn ac-btn-primary" onClick={doDatev} disabled={loadingD}>{loadingD?"…":"DATEV exportieren"}</button>
          </div>
        </div>
        <p style={{fontSize:".8rem",color:"var(--ink2)"}}>Direkt importierbar in DATEV Kanzlei-Rechnungswesen und DATEV Unternehmen Online.</p>
      </div>

      {/* ELSTER */}
      <div className="ac-card" style={{borderColor:"rgba(122,92,255,.25)"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
          <div className="ac-section-title" style={{marginBottom:0}}>ELSTER UStVA-Export (XML)</div>
          <span className="ac-badge ac-badge-gray" style={{fontSize:".7rem"}}>Nur manueller Upload</span>
        </div>
        <div style={{
          background:"rgba(255,160,0,.08)",border:"1px solid rgba(255,160,0,.35)",
          borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:".82rem",color:"var(--ink)",lineHeight:1.6,
        }}>
          <strong>Manueller Upload auf elster.de erforderlich.</strong> Erzeugte XML-Datei bitte unter{" "}
          <em>Formulare &amp; Leistungen → Umsatzsteuervoranmeldung → Datei hochladen</em> einreichen.
          <br/>
          <span style={{color:"var(--ink2)",fontSize:".78rem"}}>
            Direkte API-Übermittlung (Produktiv-Modus) ist gesperrt — eine gültige, bei ELSTER
            registrierte HerstellerID (§ 87a Abs. 6 AO) liegt noch nicht vor. <strong>Immer im Testmodus exportieren.</strong>
          </span>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Von</label><input className="ac-input" type="date" value={elsterVon} onChange={e=>setElsterVon(e.target.value)}/></div>
          <div className="ac-form-col"><label className="ac-label">Bis</label><input className="ac-input" type="date" value={elsterBis} onChange={e=>setElsterBis(e.target.value)}/></div>
          <div className="ac-form-col" style={{flex:2}}>
            <label className="ac-label">Steuernummer *</label>
            <input className="ac-input ac-mono" value={steuernummer} placeholder="21/815/08150"
              onChange={e=>setSteuernummer(e.target.value)}/>
          </div>
          <div className="ac-form-col" style={{maxWidth:120}}>
            <label className="ac-label">Finanzamt-Nr.</label>
            <input className="ac-input ac-mono" value={finanzamtId} maxLength={4}
              onChange={e=>setFinanzamtId(e.target.value)} placeholder="9300"/>
          </div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col" style={{maxWidth:220}}>
            <label className="ac-label">Voranmeldezeitraum</label>
            <select className="ac-select" value={zeitraum} onChange={e=>setZeitraum(e.target.value)}>
              {ELSTER_MONATE.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="ac-form-col" style={{maxWidth:240,justifyContent:"flex-end"}}>
            <label className="ac-label">Modus</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:".85rem",color:"var(--ink2)"}}>
                <input type="checkbox" checked={true} disabled
                  style={{accentColor:"var(--a2)"}}/>
                Testmodus (Produktiv-Modus gesperrt)
              </label>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",marginLeft:"auto"}}>
            <button className="ac-btn ac-btn-primary" onClick={doElster} disabled={loadingE}
              style={{background:"var(--a2)",color:"#fff"}}>
              {loadingE?"…":"ELSTER XML herunterladen"}
            </button>
          </div>
        </div>
        <p style={{fontSize:".78rem",color:"var(--ink2)",marginTop:4}}>
          Steuernummer beim Finanzamt erfragen. Finanzamt-Nr.: 4-stellige Nummer Ihres Finanzamts
          (Bsp. Bayern Mitte: 9162, Berlin: 1121). XML prüfen und manuell auf elster.de hochladen.
        </p>
      </div>
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
          {[["eingehend","Eingehende Rechnungen"],["ausgehend","Ausgehende Rechnungen"]].map(([s,l]) => (
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
    icon: "", id: "overview", title: "Übersicht",
    desc: "Das Buchhaltungs-Cockpit. Zeigt Einnahmen, Ausgaben und Gewinn des laufenden Jahres auf einen Blick — mit Cashflow-Chart (monatlich), Ausgaben-Kreisdiagramm nach Kategorie und einer Vorschau der letzten Buchungen. Ideal als täglicher Einstieg.",
    tags: ["Dashboard","KPIs","Cashflow","Jahresübersicht"],
    tips: [
      "Der Cashflow-Chart aktualisiert sich bei jeder neuen Buchung automatisch.",
      "Fehlende Kategorien? Buchungssätze mit aussagekräftigem Buchungstext anlegen.",
    ],
  },
  {
    icon: "", id: "rechnungen", title: "Rechnungen",
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
    icon: "", id: "buchungen", title: "Journal (Buchungen)",
    desc: "Das Herzstück der doppelten Buchführung nach HGB/GoB. Buchungssätze bestehen aus mindestens einer Soll- und einer Haben-Zeile, die bilanziell ausgeglichen sein müssen (Soll = Haben). GoBD-konformer Storno per Gegenbuchung statt Löschen. Buchungen können festgeschrieben werden.",
    tags: ["Doppelte Buchführung","HGB","GoBD","Storno","Festschreibung"],
    tips: [
      "Soll-Konto = wo der Betrag herkommt, Haben-Konto = wo er hingeht (z.B. Kasse Soll / Umsatz Haben).",
      "Stornobuchungen heben den ursprünglichen Buchungssatz auf — die Originalzeile bleibt sichtbar.",
      "Automatische Buchungen aus Belegen erscheinen hier sofort.",
    ],
  },
  {
    icon: "", id: "kontenplan", title: "Kontenplan",
    desc: "Vollständiger SKR03-Kontenrahmen, automatisch beim ersten Login für deinen Account angelegt. Konten sind nach Klassen 0–9 (Anlagevermögen, Umlaufvermögen, Eigenkapital, Verbindlichkeiten, Kosten, Erlöse) strukturiert. Salden werden aus den Buchungszeilen live berechnet.",
    tags: ["SKR03","Kontenrahmen","Klassen 0–9","Salden"],
    tips: [
      "Eigene Konten (z.B. für Projektkostenstellen) im Bereich 9000–9999 anlegen.",
      "Konto-Saldo = Summe aller Soll-Buchungen minus Haben-Buchungen auf diesem Konto.",
      "Konten mit Saldo ≠ 0 erscheinen fett in der Saldenliste unter Berichte.",
    ],
  },
  {
    icon: "", id: "anlagen", title: "Anlagenbuch",
    desc: "Anlagevermögen (Computer, Maschinen, Fahrzeuge, Software) erfassen und automatisch abschreiben. Unterstützt lineare AfA, Sofortabschreibung für GWG bis 800 € netto und degressive Methode. AfA-Vorschau zeigt Abschreibung für jedes Jahr der Nutzungsdauer. Ein Knopfdruck bucht die Jahres-AfA ins Journal.",
    tags: ["AfA","GWG","Lineare AfA","Degressive AfA","§7 EStG"],
    tips: [
      "GWG-Grenze: 250 € → sofort als Aufwand, 250–800 € → Sofortabschreibung im Anlagenbuch.",
      "Nutzungsdauer richtet sich nach der AfA-Tabelle des BMF (z.B. PC = 3 Jahre, Pkw = 6 Jahre).",
      "Die AfA-Buchung auf Knopfdruck bucht auf Konto 4830 (AfA) gegen das jeweilige Anlage-Konto.",
    ],
  },
  {
    icon: "", id: "ustva", title: "UStVA",
    desc: "Umsatzsteuer-Voranmeldung vorbereiten. NILL berechnet alle ELSTER-Kennzahlen (KZ 21, 35, 41, 44, 59, 61, 65, 81, 86) aus deinen Buchungen für einen frei wählbaren Zeitraum. Zeigt Zahllast oder Erstattungsbetrag (KZ 65). Perioden-Übersicht mit Fälligkeitsdaten.",
    tags: ["UStVA","ELSTER","KZ 21–86","§18 UStG","Voranmeldung"],
    tips: [
      "Fälligkeit der UStVA: Monatlich bis zum 10. des Folgemonats (ggf. Dauerfristverlängerung möglich).",
      "Reverse-Charge-Umsätze (§13b) erscheinen in KZ 86 und erhöhen KZ 59 automatisch.",
      "Die Berechnung ist eine Vorschau — die offizielle Meldung erfolgt via ELSTER-Portal.",
    ],
  },
  {
    icon: "", id: "berichte", title: "Berichte",
    desc: "Vollwertige gesetzliche Abschlüsse auf Knopfdruck: Bilanz nach §266 HGB (Aktiva/Passiva), GuV nach §275 HGB (Gesamtkostenverfahren), EÜR nach §4 Abs. 3 EStG für Freiberufler und Kleingewerbe, Betriebswirtschaftliche Auswertung (BWA) und Summen-/Saldenliste aller Konten.",
    tags: ["Bilanz §266","GuV §275","EÜR §4 EStG","BWA","Saldenliste"],
    tips: [
      "EÜR vs. Bilanz: Bei Umsatz < 600.000 € oder Gewinn < 60.000 € reicht die EÜR.",
      "Die BWA ist kein Pflichtbericht, aber für Bankgespräche und Controlling unverzichtbar.",
      "Berichte sind zeitraumbezogen — für Jahresabschluss: 01.01.–31.12. wählen.",
    ],
  },
  {
    icon: "", id: "partner", title: "Geschäftspartner",
    desc: "Stammdaten für Debitoren (Kunden) und Kreditoren (Lieferanten) pflegen: Name, Anschrift, USt-IdNr., E-Mail, Bankverbindung. Mahnwesen mit drei Mahnstufen (freundlich → Frist → letzte) und Übergabe an Inkasso. Mahngebühren und individuelle Mahntexte einstellbar.",
    tags: ["Debitoren","Kreditoren","Mahnwesen","Inkasso","§286 HGB"],
    tips: [
      "Typ 'Beide': Partner, der sowohl Lieferant als auch Kunde ist (z.B. Schwesterunternehmen).",
      "Mahngebühren sind ab der 2. Mahnung zulässig (§ 280 BGB, Verzugsschadensersatz).",
      "USt-IdNr. wird für innergemeinschaftliche Lieferungen (§6a UStG) benötigt.",
    ],
  },
  {
    icon: "", id: "bank", title: "Bank",
    desc: "Bankkonten-Übersicht mit aktuellem Kontostand und vollständiger Transaktionsliste. Monatlicher Cashflow-Chart (Einnahmen grün, Ausgaben pink). Volltext-Suche über alle Transaktionsdetails. Grundlage für den Bankabgleich mit deinen Buchungen.",
    tags: ["Banking","Kontostand","Transaktionen","Cashflow","Kontoabgleich"],
    tips: [
      "Transaktionen lassen sich nach Betrag, Datum oder Verwendungszweck durchsuchen.",
      "Fehlende Buchungen? Über 'Eingangsbelege' können Bankumsätze direkt mit Belegen verknüpft werden.",
    ],
  },
  {
    icon: "", id: "steuern", title: "Steuern",
    desc: "Steuer-Cockpit mit laufenden Kennzahlen: Einnahmen, Ausgaben, Gewinn und geschätzte Steuerlast (Einkommensteuer/Körperschaftsteuer je nach Rechtsform). UStVA-Schnellübersicht. Unternehmensprofil: Rechtsform, USt-Pflicht und Kleinunternehmer-Status einstellbar.",
    tags: ["Steuerlast","EkSt","KSt","Rechtsform","§19 UStG"],
    tips: [
      "Steuerschätzung ist ein Richtwert — der genaue Betrag hängt von Sonderausgaben, Freibeträgen etc. ab.",
      "Rechtsform beeinflusst die Steuerberechnung: Einzelunternehmen/Freiberufler = EkSt, GmbH/AG = KSt + GewSt.",
      "Kleinunternehmer (§19 UStG): Umsatz < 22.000 € im Vorjahr und < 50.000 € im laufenden Jahr.",
    ],
  },
  {
    icon: "", id: "export", title: "Export",
    desc: "DATEV Buchungsstapel im Format 700, CP1252-kodiert — direkt importierbar in DATEV Kanzlei-Rechnungswesen und DATEV Unternehmen Online. Export mit Beraternummer, Mandantennummer und frei wählbarem Zeitraum. Erleichtert die Zusammenarbeit mit dem Steuerberater erheblich.",
    tags: ["DATEV","Format 700","CP1252","Steuerberater","Schnittstelle"],
    tips: [
      "Beraternummer und Mandantennummer beim Steuerberater erfragen.",
      "Export für das Vorjahr zum 31. März abliefern (Abgabefrist Jahresabschluss).",
      "DATEV-Datei nicht manuell öffnen oder bearbeiten — Zeichencodierung CP1252 würde zerstört.",
    ],
  },
];

function ComingSoonTab({ title = "Dieses Feature", desc = "Demnächst verfügbar." }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:320, gap:16, opacity:.7 }}>
      <div style={{ fontSize:36 }}></div>
      <div style={{ fontFamily:"var(--mono,monospace)", fontSize:11, letterSpacing:".15em", textTransform:"uppercase", color:"var(--ink-dim,rgba(255,255,255,.4))" }}>In Entwicklung</div>
      <div style={{ fontFamily:"var(--serif,serif)", fontSize:22, color:"var(--ink,#efede7)" }}>{title}</div>
      <p style={{ fontSize:13, color:"var(--ink-dim,rgba(255,255,255,.5))", textAlign:"center", maxWidth:340 }}>{desc}</p>
    </div>
  );
}

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
                Tipps & Hinweise
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

// ── Sub-tab nav helper ────────────────────────────────────────────────────────
function SubNav({ tabs, active, onChange }) {
  return (
    <div style={{display:"flex",gap:4,background:"var(--surface2)",borderRadius:10,padding:4,marginBottom:20,overflowX:"auto",scrollbarWidth:"none",flexWrap:"nowrap"}}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{
            padding:"6px 14px",borderRadius:8,border:"none",whiteSpace:"nowrap",flexShrink:0,
            background:active===t.id?"var(--accent)":"transparent",
            color:active===t.id?"#000":"var(--ink2)",
            fontFamily:"Inter,sans-serif",fontSize:".8rem",cursor:"pointer",transition:"all .15s",
            fontWeight:active===t.id?600:400,
          }}>{t.label}</button>
      ))}
    </div>
  );
}

// ── Mega-tab wrapper components ───────────────────────────────────────────────
function RechnungenGruppe({ onUpload, onRefresh, refreshKey }) {
  const [sub, setSub] = useState("eingehend");
  const SUBS = [
    {id:"eingehend",    label:"Eingehend"},
    {id:"ausgehend",    label:"Ausgehend"},
    {id:"erechnung",    label:"E-Rechnung"},
    {id:"angebote",     label:"Angebote"},
    {id:"lieferscheine",label:"Lieferscheine"},
    {id:"gutschriften", label:"Gutschriften"},
    {id:"serienrechnung",label:"Serienrechnungen"},
    {id:"widerruf",     label:"Widerrufsrecht"},
  ];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <SubNav tabs={SUBS} active={sub} onChange={setSub}/>
        {sub==="eingehend" && <button className="ac-btn ac-btn-primary ac-btn-sm" style={{marginBottom:20,marginLeft:8}} onClick={onUpload}>+ Beleg</button>}
      </div>
      {sub==="eingehend"    && <InvoiceList key={refreshKey} onRefresh={onRefresh}/>}
      {sub==="ausgehend"    && <AusgangsrechnungTab key={refreshKey}/>}
      {sub==="erechnung"    && <ErechnungTab key={refreshKey}/>}
      {sub==="angebote"     && <AngeboteTab key={refreshKey}/>}
      {sub==="lieferscheine"&& <LieferscheinTab key={refreshKey}/>}
      {sub==="gutschriften" && <GutschriftTab key={refreshKey}/>}
      {sub==="serienrechnung"&&<SerienrechnungTab key={refreshKey}/>}
      {sub==="widerruf"     && <WiderrufSettingsPanel key={refreshKey}/>}
    </div>
  );
}

function PostenGruppe({ refreshKey, onNavigate }) {
  const [sub, setSub] = useState("opos");
  return (
    <div>
      <SubNav tabs={[{id:"opos",label:"Offene Posten"},{id:"mahnwesen",label:"Mahnwesen"}]} active={sub} onChange={setSub}/>
      {sub==="opos"     && <OposTab key={refreshKey} onNavigate={onNavigate}/>}
      {sub==="mahnwesen"&& <MahnwesenTab key={refreshKey}/>}
    </div>
  );
}

function SteuernGruppe({ refreshKey }) {
  const [sub, setSub] = useState("dashboard");
  return (
    <div>
      <SubNav tabs={[
        {id:"dashboard",      label:"Steuer-Cockpit"},
        {id:"ustva",          label:"UStVA"},
        {id:"gewerbesteuer",  label:"GewSt / ZM"},
        {id:"jahresabschluss",label:"Jahresabschluss"},
        {id:"steuerkalender", label:"Steuer-Kalender"},
      ]} active={sub} onChange={setSub}/>
      {sub==="dashboard"       && <TaxDashboard key={refreshKey}/>}
      {sub==="ustva"           && <UstVaTab key={refreshKey}/>}
      {sub==="gewerbesteuer"   && <GewerbesteuerTab key={refreshKey}/>}
      {sub==="jahresabschluss" && <JahresabschlussTab key={refreshKey}/>}
      {sub==="steuerkalender"  && <SteuerkalenderTab key={refreshKey}/>}
    </div>
  );
}

function BuchhaltungGruppe({ refreshKey }) {
  const [sub, setSub] = useState("buchungen");
  return (
    <div>
      <SubNav tabs={[
        {id:"buchungen",    label:"Journal"},
        {id:"kontenplan",   label:"Kontenplan"},
        {id:"anlagen",      label:"Anlagenbuch"},
        {id:"kostenstellen",label:"Kostenstellen"},
      ]} active={sub} onChange={setSub}/>
      {sub==="buchungen"     && <BuchungenTab key={refreshKey}/>}
      {sub==="kontenplan"    && <KontenplanTab key={refreshKey}/>}
      {sub==="anlagen"       && <AnlagenTab key={refreshKey}/>}
      {sub==="kostenstellen" && <KostenstellenTab key={refreshKey}/>}
    </div>
  );
}

function PlanungGruppe({ refreshKey }) {
  const [sub, setSub] = useState("projekte");
  return (
    <div>
      <SubNav tabs={[{id:"projekte",label:"Projekte & Zeit"},{id:"budget",label:"Budget"},{id:"reisekosten",label:"Reisekosten"},{id:"kassenbuch",label:"Kassenbuch"},{id:"tagesabschluss",label:"Tagesabschluss"}]} active={sub} onChange={setSub}/>
      {sub==="projekte"       && <ProjektTab key={refreshKey}/>}
      {sub==="budget"         && <BudgetTab key={refreshKey}/>}
      {sub==="reisekosten"    && <ReisekostenTab key={refreshKey}/>}
      {sub==="kassenbuch"     && <KassenbuchTab key={refreshKey}/>}
      {sub==="tagesabschluss" && <TagesabschlussTab key={refreshKey}/>}
    </div>
  );
}

function BelegeGruppe({ refreshKey }) {
  const [sub, setSub] = useState("archiv");
  return (
    <div>
      <SubNav tabs={[{id:"archiv",label:"Belegarchiv"},{id:"email",label:"Belege per E-Mail"}]} active={sub} onChange={setSub}/>
      {sub==="archiv"&& <BelegarchivTab key={refreshKey}/>}
      {sub==="email" && <BelegEmailTab key={refreshKey}/>}
    </div>
  );
}

function GeschaeftspartnerGruppe({ refreshKey }) {
  const [sub, setSub] = useState("partner");
  return (
    <div>
      <SubNav tabs={[{id:"partner",label:"Partner"},{id:"zahlungsmoral",label:"Zahlungsmoral"},{id:"waehrungen",label:"Währungen"}]} active={sub} onChange={setSub}/>
      {sub==="partner"      && <GeschaeftspartnerTab key={refreshKey}/>}
      {sub==="zahlungsmoral"&& <ZahlungsmoralTab key={refreshKey}/>}
      {sub==="waehrungen"   && <WechselkurseTab key={refreshKey}/>}
    </div>
  );
}

function BerichteExportGruppe({ refreshKey }) {
  const [sub, setSub] = useState("berichte");
  return (
    <div>
      <SubNav tabs={[{id:"berichte",label:"Berichte"},{id:"export",label:"Export & DATEV"}]} active={sub} onChange={setSub}/>
      {sub==="berichte"&& <BerichteTab key={refreshKey}/>}
      {sub==="export"  && <ExportTab/>}
    </div>
  );
}

// ── Kasse / POS ──────────────────────────────────────────────────────────────
function KasseGruppe({ refreshKey }) {
  const [sub, setSub] = useState("kassenbons");
  return (
    <div>
      <SubNav tabs={[
        { id: "kassenbons",    label: "Kassenbons + TSE" },
        { id: "ec",            label: "EC-Clearing"      },
        { id: "trinkgeld",     label: "Trinkgeld"        },
        { id: "gutscheine",    label: "Gutscheine"       },
        { id: "tagesabschluss",label: "Tagesabschluss"  },
      ]} active={sub} onChange={setSub} />
      {sub === "kassenbons"     && <KassenbonTab    key={refreshKey} />}
      {sub === "ec"             && <EcClearingTab   key={refreshKey} />}
      {sub === "trinkgeld"      && <TrinkgeldTab    key={refreshKey} />}
      {sub === "gutscheine"     && <GutscheinTab    key={refreshKey} />}
      {sub === "tagesabschluss" && <TagesabschlussTab key={refreshKey} />}
    </div>
  );
}

// ── Tabs config ───────────────────────────────────────────────────────────────
const ALL_TABS = [
  {id:"overview",       label:"Übersicht",          modes:["einfach","doppelt"]},
  {id:"hilfe",          label:"❓ Hilfe",             modes:["einfach","doppelt"]},
  {id:"rechnungen",     label:"Rechnungen",         modes:["einfach","doppelt"]},
  {id:"posten",         label:"Posten & Mahnwesen", modes:["einfach","doppelt"]},
  {id:"planung",        label:"Planung",            modes:["einfach","doppelt"]},
  {id:"steuern",        label:"Steuern",            modes:["einfach","doppelt"]},
  {id:"buchhaltung",    label:"Buchführung",        modes:["doppelt"]},
  {id:"belege",         label:"Belege",             modes:["einfach","doppelt"]},
  {id:"partner",        label:"Geschäftspartner",   modes:["einfach","doppelt"]},
  {id:"bank",           label:"Bank",               modes:["doppelt"]},
  {id:"kasse",          label:"Kasse / POS",        modes:["einfach","doppelt"]},
  {id:"berichte",       label:"Berichte & Export",  modes:["einfach","doppelt"]},
  {id:"import",         label:"Import",             modes:["einfach","doppelt"]},
  {id:"lohnsteuer",     label:"Lohnsteuer",         modes:["doppelt"]},
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AccountingPage() {
  const navigate = useNavigate();
  const [tab, setTab]               = useState("overview");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sessionReady, setSessionReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [accountingMode, setAccountingMode] = useState(
    () => localStorage.getItem("nill_accounting_mode") || "einfach"
  );
  const TABS = useMemo(
    () => ALL_TABS.filter(t => t.modes.includes(accountingMode)),
    [accountingMode]
  );

  useEffect(() => {
    if (!localStorage.getItem("nill_onboarding_done")) {
      setShowOnboarding(true);
    }
    api.post("/api/v1/buchhaltung/kontenrahmen/init")
      .catch(() => {})
      .finally(() => setSessionReady(true));
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  useEffect(() => {
    const tabLabel = TABS.find(t => t.id === tab)?.label?.replace(/^❓\s*/, "") || "Buchhaltung";
    document.title = `${tabLabel} – NILL Buchhaltung`;
    return () => { document.title = "NILL"; };
  }, [tab, TABS]);

  const goTo = (tabId) => setTab(tabId);

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const renderTab = () => {
    switch(tab) {
      case "overview":    return <OverviewTab key={refreshKey} onNavigate={goTo} onUpload={() => setUploadOpen(true)}/>;
      case "rechnungen":  return <RechnungenGruppe onUpload={() => setUploadOpen(true)} onRefresh={triggerRefresh} refreshKey={refreshKey}/>;
      case "posten":      return <PostenGruppe refreshKey={refreshKey} onNavigate={goTo}/>;
      case "planung":     return <PlanungGruppe refreshKey={refreshKey}/>;
      case "steuern":     return <SteuernGruppe refreshKey={refreshKey}/>;
      case "buchhaltung": return <BuchhaltungGruppe refreshKey={refreshKey}/>;
      case "belege":      return <BelegeGruppe refreshKey={refreshKey}/>;
      case "partner":     return <GeschaeftspartnerGruppe refreshKey={refreshKey}/>;
      case "bank":        return <BankSyncTab key={refreshKey}/>;
      case "kasse":       return <KasseGruppe refreshKey={refreshKey}/>;
      case "berichte":    return <BerichteExportGruppe refreshKey={refreshKey}/>;
      case "import":      return <ImportTab onDone={triggerRefresh}/>;
      case "lohnsteuer":  return <LohnbuchhaltungContent key={refreshKey} onNavigate={(tabKey) => navigate(`/dashboard/workflow/team?tab=${tabKey}`)} />;
      case "hilfe":       return <HilfeTab onNavigate={goTo}/>;
      default:            return null;
    }
  };

  if (!sessionReady) return <NillLoader text="Buchhaltung wird initialisiert…" />;

  return (
    <>
      <style>{S}</style>
      <div className="ac-page">
        <a href="#ac-main-content" className="ac-skip-link">Zum Hauptinhalt springen</a>

        <div className="ac-header">
          <a className="ac-logo" href="/dashboard" title="Zurück zum Dashboard">
            NILL<span>.</span>
          </a>
          <div className="ac-header-divider"/>
          <span className="ac-title">Buchhaltung</span>
          <div className="ac-header-right">
            {/* H — GoBD-Badge */}
            <div style={{
              display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
              borderRadius:20,background:"rgba(198,255,60,.1)",border:"1px solid rgba(198,255,60,.25)",
              fontSize:".72rem",color:"var(--accent)",fontWeight:600,cursor:"default",
            }} title="NILL entspricht den GoBD-Anforderungen (§147 AO, BMF-Schreiben 2019)">
              GoBD-konform
            </div>
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setShowOnboarding(true)}>Setup</button>
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={()=>setTab("hilfe")}>Hilfe</button>
            <button className="ac-btn ac-btn-primary" onClick={()=>setUploadOpen(true)}>+ Beleg</button>
          </div>
        </div>

        <nav aria-label="Buchhaltungs-Navigation">
        <div className="ac-tabs" role="tablist">
          {TABS.map(t => (
            <button
              key={t.id}
              id={`ac-tab-${t.id}`}
              role="tab"
              aria-selected={tab===t.id}
              aria-controls="ac-main-content"
              className={`ac-tab${tab===t.id?" active":""}${t.comingSoon?" ac-tab-soon":""}`}
              onClick={()=>setTab(t.id)}
              title={t.comingSoon ? "Demnächst verfügbar" : undefined}
            >
              {t.label}
              {t.comingSoon && <span aria-hidden="true" style={{marginLeft:5,fontSize:"9px",opacity:.6,fontFamily:"monospace",verticalAlign:"middle"}}>soon</span>}
              {t.id === "rechnungen" && !localStorage.getItem("nill_first_invoice") && (
                <span aria-hidden="true" style={{marginLeft:4,fontSize:"9px",background:"var(--accent)",color:"var(--surface)",borderRadius:20,padding:"1px 5px",verticalAlign:"middle",fontWeight:700}}>Start</span>
              )}
            </button>
          ))}
        </div>
        </nav>

        <main id="ac-main-content" role="tabpanel" aria-labelledby={`ac-tab-${tab}`}>
        <Suspense fallback={<div className="ac-loading"><span className="ac-spinner" aria-hidden="true"/>Wird geladen…</div>}>
          {renderTab()}
        </Suspense>
        </main>

        {uploadOpen && (
          <Suspense fallback={null}>
            <ReceiptUploadModal
              onClose={()=>{ setUploadOpen(false); triggerRefresh(); }}
            />
          </Suspense>
        )}

        {showOnboarding && (
          <Suspense fallback={null}>
            <OnboardingWizard
              onClose={() => setShowOnboarding(false)}
              onComplete={(mode) => {
                setAccountingMode(mode);
                setShowOnboarding(false);
                setTab("rechnungen");
              }}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}

