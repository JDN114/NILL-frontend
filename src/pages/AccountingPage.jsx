// src/pages/AccountingPage.jsx
import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, Sector,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ReferenceLine,
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
const FahrtenbuchTab       = lazy(() => import("../components/accounting/FahrtenbuchTab"));
const SteuerberaterTab     = lazy(() => import("../components/accounting/SteuerberaterTab"));
const KassenmeldungTab     = lazy(() => import("../components/accounting/KassenmeldungTab"));
const OssTab               = lazy(() => import("../components/accounting/OssTab"));
const AuditLogTab          = lazy(() => import("../components/accounting/AuditLogTab"));
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

  /* ── App shell ──────────────────────────────────────────────── */
  .ac-shell{
    display:grid;
    grid-template-columns:210px 1fr;
    grid-template-rows:52px 1fr;
    height:100vh;
    overflow:hidden;
  }

  /* ── Top bar ─────────────────────────────────────────────────*/
  .ac-topbar{
    grid-column:1/-1;grid-row:1;
    display:flex;align-items:center;gap:12px;
    padding:0 18px;
    background:var(--surface);
    border-bottom:1px solid var(--border);
    z-index:10;
  }
  .ac-logo{font-family:Fraunces,serif;font-size:1.3rem;font-weight:700;color:var(--ink);text-decoration:none;cursor:pointer;transition:color .15s;flex-shrink:0;}
  .ac-logo:hover{color:var(--accent);}
  .ac-logo span{color:var(--accent);}
  .ac-topbar-sep{width:1px;height:18px;background:var(--border);flex-shrink:0;}
  .ac-topbar-title{font-size:.82rem;color:var(--ink2);font-weight:500;letter-spacing:.01em;}
  .ac-topbar-right{margin-left:auto;display:flex;gap:7px;align-items:center;}

  /* ── Sidebar ─────────────────────────────────────────────────*/
  .ac-sidebar{
    grid-column:1;grid-row:2;
    background:var(--surface);
    border-right:1px solid var(--border);
    overflow-y:auto;overflow-x:hidden;
    scrollbar-width:none;
    padding:12px 8px 24px;
    display:flex;flex-direction:column;
  }
  .ac-sidebar::-webkit-scrollbar{display:none;}

  .ac-nav-standalone{
    display:flex;align-items:center;gap:8px;
    width:100%;padding:8px 10px;
    border-radius:8px;border:none;
    background:transparent;
    color:var(--ink);font-size:.85rem;font-weight:500;
    font-family:Inter,sans-serif;cursor:pointer;
    text-align:left;transition:all .12s;
    margin-bottom:6px;
  }
  .ac-nav-standalone:hover{background:rgba(255,255,255,.04);}
  .ac-nav-standalone.active{background:rgba(198,255,60,.1);color:var(--accent);}

  .ac-nav-group{margin-bottom:2px;}
  .ac-nav-group-label{
    font-size:.62rem;font-weight:600;
    color:var(--ink2);
    text-transform:uppercase;letter-spacing:.09em;
    padding:14px 10px 5px;
    display:block;
  }
  .ac-nav-item{
    display:flex;align-items:center;gap:8px;
    width:100%;padding:6px 10px 6px 14px;
    border-radius:8px;border:none;
    background:transparent;
    color:var(--ink2);font-size:.82rem;
    font-family:Inter,sans-serif;cursor:pointer;
    text-align:left;transition:all .12s;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    min-height:32px;
  }
  .ac-nav-item:hover{color:var(--ink);background:rgba(255,255,255,.04);}
  .ac-nav-item.active{
    background:rgba(198,255,60,.1);
    color:var(--accent);font-weight:600;
  }
  .ac-nav-item-dot{
    width:5px;height:5px;border-radius:50%;
    background:currentColor;opacity:.4;flex-shrink:0;
  }
  .ac-nav-item.active .ac-nav-item-dot{opacity:1;}
  .ac-nav-item:focus-visible,.ac-nav-standalone:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}

  .ac-sidebar-bottom{
    margin-top:auto;padding-top:14px;
    border-top:1px solid var(--border);
    display:flex;flex-direction:column;gap:2px;
  }

  /* ── Content area ────────────────────────────────────────────*/
  .ac-content{
    grid-column:2;grid-row:2;
    overflow-y:auto;
    padding:28px 28px;
  }

  .ac-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
  .ac-skip-link{position:absolute;top:-48px;left:16px;background:var(--accent);color:#000;padding:6px 14px;border-radius:0 0 8px 8px;font-size:.85rem;font-weight:600;z-index:10000;text-decoration:none;transition:top .15s;}
  .ac-skip-link:focus{top:0;outline:2px solid #000;outline-offset:2px;}

  /* ── Mobile ──────────────────────────────────────────────────*/
  @media(max-width:768px){
    .ac-shell{
      grid-template-columns:1fr;
      grid-template-rows:50px auto 1fr;
      height:100dvh;
    }
    .ac-topbar{grid-column:1;padding:0 14px;}
    .ac-topbar-title{display:none;}
    .ac-topbar-sep{display:none;}
    .ac-sidebar{
      grid-column:1;grid-row:2;
      flex-direction:row;flex-wrap:nowrap;
      overflow-x:auto;overflow-y:hidden;
      padding:6px 8px;gap:2px;
      border-right:none;border-bottom:1px solid var(--border);
      height:auto;
    }
    .ac-sidebar-bottom{
      margin-top:0;padding-top:0;border-top:none;
      flex-direction:row;gap:2px;
    }
    .ac-nav-group{display:contents;}
    .ac-nav-group-label{display:none;}
    .ac-nav-standalone,.ac-nav-item{
      flex-shrink:0;
      padding:5px 12px;font-size:.78rem;
      min-height:30px;
    }
    .ac-nav-item{padding-left:12px;}
    .ac-nav-item-dot{display:none;}
    .ac-content{grid-column:1;grid-row:3;padding:16px 14px;}
  }

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

const DASH_MODES = [
  { key:"universal", label:"Universal", desc:"Ausgewogene Ansicht für alle Unternehmenstypen" },
  { key:"b2b",       label:"B2B",       desc:"Fokus auf Forderungen, Angebote und Zahlungsmoral" },
  { key:"b2c",       label:"B2C",       desc:"Fokus auf Tagesumsatz, Kasse und Zahlungsarten" },
];

const WIDGET_META = {
  cashflow:          { label:"Cashflow-Verlauf",        desc:"Einnahmen/Ausgaben pro Monat" },
  categories:        { label:"Ausgaben-Kategorien",     desc:"Tortendiagramm nach Kostenstelle" },
  recent:            { label:"Letzte Buchungen",         desc:"Die 8 neuesten Journaleinträge" },
  ar:                { label:"Offene Forderungen",       desc:"Summe offener & überfälliger Rechnungen" },
  overdue:           { label:"Überfällige Rechnungen",  desc:"Anzahl und Betrag der fälligen Rechnungen" },
  proposals:         { label:"Offene Angebote",          desc:"Angebote im Status Gesendet" },
  today:             { label:"Heutiger Umsatz",          desc:"Kassenbons heute — Summe & Anzahl" },
  kassenstand:       { label:"Kassenbestand",            desc:"Laufender Saldo des Kassenbuchs" },
  payment_split:     { label:"Zahlungsarten heute",      desc:"Bar / EC / Kreditkarte-Aufteilung" },
  gewinnmarge:       { label:"Gewinnmarge",              desc:"Nettogewinn in % der Einnahmen — lfd. Jahr" },
  steuerruecklage:   { label:"Steuerrücklage",           desc:"Empfohlene Rücklage für Steuern (30 % des Gewinns)" },
  monatsumsatz:      { label:"Monatsumsatz lfd.",        desc:"Einnahmen diesen Monat vs. Vormonat" },
  deb_zahlungsziel:     { label:"Ø Zahlungsverzug",           desc:"Älteste offene Ausgangsrechnung in Tagen" },
  jahresvgl:            { label:"Jahr-über-Jahr",              desc:"Einnahmen: aktuelles vs. letztes Jahr pro Monat" },
  top_ausgaben:         { label:"Top Ausgabenposten",          desc:"Balkendiagramm der größten Kostenstellen" },
  forderungsquote:      { label:"Forderungsstruktur",          desc:"Aufteilung offen / überfällig (B2B)" },
  wochen_umsatz:        { label:"Wochenumsatz",                desc:"Tagesumsatz der laufenden Woche (B2C)" },
  bon_trend:            { label:"Ø Bonwert-Trend",             desc:"Durchschnittlicher Bonwert letzte Tage (B2C)" },
  umsatzziel:           { label:"Umsatzziel",                  desc:"Jahresfortschritt in % deines Umsatzziels" },
  kunden_aktivitaet:    { label:"Kundenaktivität",             desc:"Unique Kunden und Umsatz: Heute / 3 Tage / Woche / Monat" },
  top_kunden:           { label:"Top-Kunden",                  desc:"Die umsatzstärksten Kunden im laufenden Jahr" },
  gewinn_verlauf:       { label:"Gewinn/Verlust-Verlauf",      desc:"Monatliches Nettoergebnis — positiv/negativ" },
  umsatz_prognose:      { label:"Umsatzprognose",              desc:"Trendbasierte Hochrechnung für die nächsten 3 Monate" },
  ausgaben_trend:       { label:"Ausgabenentwicklung",         desc:"Monatliche Ausgaben mit Trendlinie" },
  stornoquote:          { label:"Stornoquote",                 desc:"Anteil stornierter Kassenbons diese Woche (B2C)" },
  zahlungsarten_tag:    { label:"Zahlungsarten nach Tag",      desc:"Welche Zahlungsart dominiert an welchem Wochentag (B2C)" },
};

const MODE_DEFAULTS = {
  universal: ["cashflow","categories","recent","gewinnmarge","steuerruecklage","monatsumsatz",
              "umsatzziel","jahresvgl","gewinn_verlauf","top_ausgaben","umsatz_prognose","kunden_aktivitaet"],
  b2b:       ["ar","overdue","proposals","cashflow","recent","gewinnmarge","deb_zahlungsziel",
              "umsatzziel","jahresvgl","top_ausgaben","forderungsquote","kunden_aktivitaet","top_kunden","gewinn_verlauf","umsatz_prognose"],
  b2c:       ["today","kassenstand","payment_split","cashflow","recent",
              "umsatzziel","wochen_umsatz","bon_trend","top_ausgaben","stornoquote","zahlungsarten_tag","kunden_aktivitaet"],
};

const KUNDEN_PERIODS = [
  { key:"heute",   label:"Heute",   days:0  },
  { key:"3tage",   label:"3 Tage",  days:3  },
  { key:"woche",   label:"Woche",   days:7  },
  { key:"monat",   label:"Monat",   days:30 },
  { key:"quartal", label:"Quartal", days:90 },
];

const ZAHLART_COLORS = { bar:"#c6ff3c", ec:"#7a5cff", kreditkarte:"#ff4d8d", gutschein:"#ffb347", sepa:"#9b9890" };

const ZAHLART_LABELS = { bar:"Bar", ec:"EC", kreditkarte:"Kreditkarte", gutschein:"Gutschein", sepa:"SEPA" };

function useLStorage(key, fallback) {
  const [val, setVal] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  });
  const save = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, save];
}

function OverviewTab({ onNavigate, onUpload }) {
  const [dash,        setDash]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [dashError,   setDashError]   = useState(false);
  const [opos,        setOpos]        = useState(null);
  const [todayBons,   setTodayBons]   = useState([]);
  const [weekBons,    setWeekBons]    = useState([]);
  const [kassenstand, setKassenstand] = useState(null);
  const [proposals,   setProposals]   = useState(null);
  const [periode,     setPeriode]     = useState("12");
  const [activeIdx,   setActiveIdx]   = useState(null);
  const [activeKat,   setActiveKat]   = useState(null);
  const [showCustom,  setShowCustom]  = useState(false);
  const [mode,        setMode]        = useLStorage("nill_dash_mode", "universal");
  const [widgetPrefs, setWidgetPrefs] = useLStorage("nill_dash_widgets", {});
  const [rechnungen,    setRechnungen]    = useState([]);
  const [rawWeekBons,   setRawWeekBons]   = useState([]);
  const [kundenPeriod,  setKundenPeriod]  = useLStorage("nill_kunden_period","woche");
  const [jahresZiel,    setJahresZiel]    = useLStorage("nill_jahres_ziel", 0);
  const [editingZiel,   setEditingZiel]   = useState(false);
  const [zielInput,     setZielInput]     = useState("");

  const activeWidgets = widgetPrefs[mode] ?? MODE_DEFAULTS[mode] ?? MODE_DEFAULTS.universal;
  const has = (id) => activeWidgets.includes(id);

  const toggleWidget = (id) => {
    const next = has(id) ? activeWidgets.filter(w => w !== id) : [...activeWidgets, id];
    setWidgetPrefs({ ...widgetPrefs, [mode]: next });
  };
  const resetWidgets = () => {
    const next = { ...widgetPrefs }; delete next[mode]; setWidgetPrefs(next);
  };

  const todayStr = useMemo(() => new Date().toISOString().slice(0,10), []);
  const weekStartStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.toISOString().slice(0,10);
  }, []);

  const load = useCallback(() => {
    setLoading(true); setDashError(false);
    api.get("/api/v1/buchhaltung/dashboard")
      .then(r => setDash(r.data)).catch(() => setDashError(true)).finally(() => setLoading(false));
    api.get("/api/v1/opos/summary").then(r => setOpos(r.data)).catch(() => {});
    api.get("/api/v1/kassenbon", { params:{ datum_von:todayStr, datum_bis:todayStr } })
      .then(r => setTodayBons((r.data||[]).filter(b => b.status !== "storniert"))).catch(() => {});
    api.get("/api/v1/kassenbon", { params:{ datum_von:weekStartStr, datum_bis:todayStr } })
      .then(r => { const all=r.data||[]; setRawWeekBons(all); setWeekBons(all.filter(b=>b.status!=="storniert")); })
      .catch(() => {});
    api.get("/api/v1/kassenbuch")
      .then(r => { const rows=r.data||[]; if(rows.length) setKassenstand(rows[rows.length-1].kassenstand??null); })
      .catch(() => {});
    api.get("/api/v1/angebote")
      .then(r => setProposals((r.data||[]).filter(a => a.status==="gesendet").length)).catch(() => {});
    api.get("/api/v1/rechnungen").then(r => setRechnungen(r.data||[])).catch(() => {});
  }, [todayStr, weekStartStr]);

  useEffect(() => { load(); }, [load]);

  const fmtMonat = (iso) => {
    const [y,mo] = iso.split("-");
    return new Date(parseInt(y),parseInt(mo)-1).toLocaleDateString("de-DE",{month:"short",year:"2-digit"});
  };

  const allArea = useMemo(() =>
    (dash?.monatsverlauf||[]).map(m => ({ name:fmtMonat(m.monat), Einnahmen:m.einnahmen, Ausgaben:m.ausgaben }))
  ,[dash]);

  const areaData = useMemo(() =>
    periode==="all" ? allArea : allArea.slice(-parseInt(periode,10))
  ,[allArea, periode]);

  const allPie = useMemo(() =>
    (dash?.ausgaben_kategorien||[]).map(k => ({ name:k.kategorie, value:k.betrag }))
  ,[dash]);

  const todayUmsatz = todayBons.reduce((s,b) => s+(b.betrag_brutto||0), 0);
  const avgBon = todayBons.length ? todayUmsatz/todayBons.length : 0;
  const paymentSplit = useMemo(() => {
    const m = {};
    for(const b of todayBons) { const z=b.zahlungsart||"bar"; m[z]=(m[z]||0)+(b.betrag_brutto||0); }
    return Object.entries(m).sort((a,b)=>b[1]-a[1]);
  }, [todayBons]);

  const perioden = [{key:"3",label:"3M"},{key:"6",label:"6M"},{key:"12",label:"12M"},{key:"all",label:"Alle"}];

  // ── New computed stats ──────────────────────────────────────────
  const topAusgaben = useMemo(() =>
    [...(dash?.ausgaben_kategorien||[])]
      .sort((a,b) => b.betrag-a.betrag)
      .slice(0,7)
      .map(k => ({ name: k.kategorie.length>18?k.kategorie.slice(0,17)+"…":k.kategorie, value: k.betrag }))
  ,[dash]);

  const jahresVglData = useMemo(() => {
    const mv = dash?.monatsverlauf||[];
    const byYear = {};
    for (const m of mv) {
      const [yr, mo] = m.monat.split("-");
      if (!byYear[yr]) byYear[yr] = {};
      byYear[yr][mo] = { ein: m.einnahmen||0, aus: m.ausgaben||0 };
    }
    const years = Object.keys(byYear).sort();
    if (years.length < 2) return null;
    const [prev, curr] = years.slice(-2);
    const MO = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    const LBL = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
    const rows = MO.map((m,i) => ({
      name: LBL[i],
      [curr]: byYear[curr]?.[m]?.ein ?? 0,
      [prev]: byYear[prev]?.[m]?.ein ?? 0,
    })).filter(r => r[curr]>0 || r[prev]>0);
    return rows.length ? { rows, curr, prev } : null;
  }, [dash]);

  const DAY_NAMES = ["Mo","Di","Mi","Do","Fr","Sa","So"];
  const wochenData = useMemo(() => {
    const map = {};
    for (const b of weekBons) {
      const d = new Date(b.datum || b.erstellt_am?.slice(0,10) || todayStr);
      const idx = (d.getDay()+6)%7;
      const key = DAY_NAMES[idx];
      if (!map[key]) map[key] = { name:key, umsatz:0, bons:0 };
      map[key].umsatz += (b.betrag_brutto||0);
      map[key].bons   += 1;
    }
    return DAY_NAMES.map(d => map[d]||{name:d,umsatz:0,bons:0});
  }, [weekBons, todayStr]);

  const bonTrendData = useMemo(() => {
    const map = {};
    for (const b of weekBons) {
      const day = b.datum || b.erstellt_am?.slice(0,10);
      if (!day) continue;
      if (!map[day]) map[day] = { day, gesamt:0, count:0 };
      map[day].gesamt += (b.betrag_brutto||0);
      map[day].count  += 1;
    }
    return Object.values(map)
      .sort((a,b) => a.day.localeCompare(b.day))
      .map(d => ({ name:d.day.slice(5), avg: d.count>0 ? d.gesamt/d.count : 0 }));
  }, [weekBons]);

  // ── Additional computed stats ─────────────────────────────────
  const gewinnVerlauf = useMemo(() =>
    (dash?.monatsverlauf||[]).slice(-12).map(m => ({
      name: fmtMonat(m.monat),
      gewinn: (m.einnahmen||0)-(m.ausgaben||0),
    }))
  , [dash]);

  const ausgabenTrend = useMemo(() => {
    const mv = (dash?.monatsverlauf||[]).slice(-12);
    if (mv.length < 2) return [];
    const n = mv.length;
    const ys = mv.map(m => m.ausgaben||0);
    const meanX = (n-1)/2;
    const meanY = ys.reduce((s,y)=>s+y,0)/n;
    const slope = ys.reduce((s,y,i)=>s+(i-meanX)*(y-meanY),0) / ys.reduce((s,_,i)=>s+(i-meanX)**2,0);
    const intercept = meanY - slope*meanX;
    return mv.map((m,i) => ({
      name: fmtMonat(m.monat),
      Ausgaben: m.ausgaben||0,
      Trend: Math.max(Math.round(intercept + slope*i), 0),
    }));
  }, [dash]);

  const umsatzPrognose = useMemo(() => {
    const mv = (dash?.monatsverlauf||[]).filter(m=>(m.einnahmen||0)>0).slice(-8);
    if (mv.length < 3) return null;
    const n = mv.length;
    const ys = mv.map(m => m.einnahmen||0);
    const meanX = (n-1)/2;
    const meanY = ys.reduce((s,y)=>s+y,0)/n;
    const denom = ys.reduce((_,__,i)=>(i-meanX)**2,0) || 1;
    const slope = ys.reduce((s,y,i)=>s+(i-meanX)*(y-meanY),0) / mv.reduce((s,_,i)=>s+(i-meanX)**2,0);
    const intercept = meanY - slope*meanX;
    const hist = mv.map((m,i) => ({ name:fmtMonat(m.monat), Einnahmen:m.einnahmen, prognose:null }));
    const [lastY, lastMo] = mv[mv.length-1].monat.split("-");
    const proj = [1,2,3].map(i => {
      const d = new Date(parseInt(lastY), parseInt(lastMo)-1+i);
      return {
        name: d.toLocaleDateString("de-DE",{month:"short",year:"2-digit"}),
        Einnahmen: null,
        prognose: Math.max(Math.round(intercept + slope*(n-1+i)), 0),
      };
    });
    return { data:[...hist,...proj], pivot:hist.length };
  }, [dash]);

  const kundenData = useMemo(() => {
    if (!rechnungen.length) return null;
    const kp = KUNDEN_PERIODS.find(p=>p.key===kundenPeriod);
    const days = kp?.days ?? 7;
    const cutoff = new Date();
    if (days===0) cutoff.setHours(0,0,0,0);
    else cutoff.setDate(cutoff.getDate()-days);
    const filtered = rechnungen.filter(r => {
      const d = new Date(r.datum||r.rechnungsdatum||r.erstellt_am);
      return !isNaN(d) && d>=cutoff;
    });
    const map = {};
    for (const r of filtered) {
      const name = r.partner_name||r.partner||r.empfaenger_name||r.kunde||r.debitor||"Unbekannt";
      if (!map[name]) map[name] = {name,umsatz:0,anzahl:0};
      map[name].umsatz  += (r.betrag_netto||r.betrag_brutto||r.betrag||0);
      map[name].anzahl  += 1;
    }
    const list = Object.values(map).sort((a,b)=>b.umsatz-a.umsatz);
    return { total:filtered.length, unique:list.length, umsatz:list.reduce((s,c)=>s+c.umsatz,0), list };
  }, [rechnungen, kundenPeriod]);

  const topKunden = useMemo(() => {
    if (!rechnungen.length) return [];
    const thisYear = new Date().getFullYear();
    const map = {};
    for (const r of rechnungen) {
      const d = new Date(r.datum||r.rechnungsdatum||r.erstellt_am);
      if (isNaN(d)||d.getFullYear()!==thisYear) continue;
      const name = r.partner_name||r.partner||r.empfaenger_name||r.kunde||r.debitor||"Unbekannt";
      if (!map[name]) map[name]={name,umsatz:0};
      map[name].umsatz += (r.betrag_netto||r.betrag_brutto||r.betrag||0);
    }
    return Object.values(map).sort((a,b)=>b.umsatz-a.umsatz).slice(0,8)
      .map(k=>({...k, name:k.name.length>22?k.name.slice(0,21)+"…":k.name}));
  }, [rechnungen]);

  const stornoquoteData = useMemo(() => {
    if (!rawWeekBons.length) return null;
    const total     = rawWeekBons.length;
    const storniert = rawWeekBons.filter(b=>b.status==="storniert").length;
    const byDay = {};
    for (const b of rawWeekBons) {
      const d = new Date(b.datum||b.erstellt_am?.slice(0,10)||todayStr);
      const key = DAY_NAMES[(d.getDay()+6)%7];
      if (!byDay[key]) byDay[key]={name:key,aktiv:0,storniert:0};
      b.status==="storniert" ? byDay[key].storniert++ : byDay[key].aktiv++;
    }
    return { total, storniert, pct:total>0?storniert/total*100:0,
      byDay: DAY_NAMES.map(d=>byDay[d]||{name:d,aktiv:0,storniert:0}) };
  }, [rawWeekBons, todayStr]);

  const zahlungsartenTagData = useMemo(() => {
    const zahlarten = new Set();
    const byDay = {};
    for (const b of weekBons) {
      const d = new Date(b.datum||b.erstellt_am?.slice(0,10)||todayStr);
      const key = DAY_NAMES[(d.getDay()+6)%7];
      const z = b.zahlungsart||"bar";
      zahlarten.add(z);
      if (!byDay[key]) byDay[key]={name:key};
      byDay[key][z]=(byDay[key][z]||0)+(b.betrag_brutto||0);
    }
    return { data:DAY_NAMES.map(d=>byDay[d]||{name:d}), zahlarten:[...zahlarten] };
  }, [weekBons, todayStr]);

  if(loading) return <div role="status" aria-label="Dashboard wird geladen" className="ac-loading"><span className="ac-spinner" aria-hidden="true"/>Lade Dashboard…</div>;
  if(dashError) return (
    <div className="ac-alert ac-alert-err" style={{display:"flex",alignItems:"center",gap:12}}>
      Dashboard konnte nicht geladen werden.
      <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={load}>Erneut versuchen</button>
    </div>
  );
  if(!dash) return (
    <div className="ac-empty" style={{padding:40}}>
      <div style={{marginBottom:12}}>Noch keine Buchungsdaten vorhanden.</div>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="ac-btn ac-btn-primary" onClick={() => onNavigate("rechnungen")}>Erste Rechnung erstellen →</button>
        <button className="ac-btn ac-btn-ghost" onClick={load}>↺ Erneut laden</button>
      </div>
    </div>
  );

  const gewinn = (dash.einnahmen||0)-(dash.ausgaben||0);
  const gewinnmarge = dash.einnahmen > 0 ? (gewinn / dash.einnahmen) * 100 : 0;
  const mv = dash.monatsverlauf ?? [];
  const lfdMonat   = mv.length > 0 ? mv[mv.length - 1]  : null;
  const vorMonat   = mv.length > 1 ? mv[mv.length - 2]  : null;
  const monatsTrend = lfdMonat && vorMonat && (vorMonat.einnahmen||0) > 0
    ? ((( lfdMonat.einnahmen||0) - (vorMonat.einnahmen||0)) / (vorMonat.einnahmen||0)) * 100
    : null;

  return (
    <div>
      {/* ─── Mode bar + Customize ─── */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:2,background:"var(--surface)",borderRadius:8,padding:3}}
          role="group" aria-label="Dashboard-Modus wählen">
          {DASH_MODES.map(m => (
            <button key={m.key} onClick={() => setMode(m.key)}
              aria-pressed={mode===m.key} title={m.desc}
              style={{
                padding:"4px 14px",borderRadius:6,border:"none",
                background:mode===m.key?"var(--accent)":"transparent",
                color:mode===m.key?"#000":"var(--ink2)",
                fontSize:".78rem",fontWeight:mode===m.key?700:400,
                cursor:"pointer",transition:"all .15s",
              }}>{m.label}</button>
          ))}
        </div>
        <button onClick={() => setShowCustom(v=>!v)} aria-expanded={showCustom}
          style={{
            marginLeft:"auto",padding:"4px 12px",borderRadius:6,
            border:"1px solid var(--border)",background:"transparent",
            color:"var(--ink2)",fontSize:".78rem",cursor:"pointer",
          }}>⚙ Anpassen</button>
      </div>

      {/* ─── Customization panel ─── */}
      {showCustom && (
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"16px 20px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:600,fontSize:".88rem"}}>Widgets für Modus „{DASH_MODES.find(m2=>m2.key===mode)?.label}"</div>
            <button onClick={resetWidgets}
              style={{fontSize:".75rem",padding:"3px 10px",borderRadius:6,border:"1px solid var(--border)",background:"transparent",color:"var(--ink2)",cursor:"pointer"}}>
              Zurücksetzen
            </button>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {Object.entries(WIDGET_META).map(([id, meta]) => (
              <label key={id} style={{
                display:"flex",alignItems:"center",gap:7,padding:"6px 12px",
                borderRadius:8,border:`1px solid ${has(id)?"var(--accent)":"var(--border)"}`,
                background:has(id)?"rgba(198,255,60,.06)":"transparent",
                cursor:"pointer",userSelect:"none",transition:"all .15s",
              }}>
                <input type="checkbox" checked={has(id)} onChange={() => toggleWidget(id)}
                  style={{accentColor:"var(--accent)"}} aria-label={meta.label}/>
                <span style={{fontSize:".82rem"}}>{meta.label}</span>
                <span style={{fontSize:".7rem",color:"var(--ink2)"}}>{meta.desc}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ─── Hero ─── */}
      <div style={{
        display:"flex",gap:24,alignItems:"center",flexWrap:"wrap",
        background:gewinn>=0?"rgba(198,255,60,.06)":"rgba(255,77,141,.06)",
        border:`1px solid ${gewinn>=0?"rgba(198,255,60,.2)":"rgba(255,77,141,.2)"}`,
        borderRadius:12,padding:"16px 24px",marginBottom:12,
      }}>
        <div>
          <div style={{fontSize:".72rem",color:"var(--ink2)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>Gewinn lfd. Jahr — Echtzeit</div>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:"2.2rem",fontWeight:800,color:gewinn>=0?"var(--accent)":"var(--a3)",letterSpacing:"-.02em"}}>{fmtEur(gewinn)}</div>
          <div style={{fontSize:".75rem",fontWeight:600,color:gewinn>=0?"var(--accent)":"var(--a3)",marginTop:2}}>{gewinn>=0?"▲ Gewinn":"▼ Verlust"}</div>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          {[["Einnahmen",fmtEur(dash.einnahmen),"var(--accent)"],["Ausgaben",fmtEur(dash.ausgaben),"var(--a3)"],["USt-Zahllast",fmtEur(dash.ust_zahllast),"var(--ink)"],["Buchungen",dash.buchungen_gesamt??0,"var(--ink)"]].map(([lbl,val,col]) => (
            <div key={lbl}>
              <div style={{fontSize:".7rem",color:"var(--ink2)"}}>{lbl}</div>
              <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700,color:col}}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Mode chips (secondary stats below hero) ─── */}
      {mode==="b2b" && opos && (
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {[
            {lbl:`${opos.total_offen} offen`,val:fmtEur(opos.summe_offen),col:"var(--ink2)",warn:false},
            {lbl:`${opos.davon_ueberfaellig_anzahl} überfällig`,val:fmtEur(opos.davon_ueberfaellig_summe),col:"var(--a3)",warn:opos.davon_ueberfaellig_anzahl>0},
            opos.aelteste_rechnung_tage>0&&{lbl:"Älteste Forderung",val:`${opos.aelteste_rechnung_tage} Tage`,col:opos.aelteste_rechnung_tage>30?"var(--a3)":"var(--ink2)",warn:opos.aelteste_rechnung_tage>30},
            proposals!=null&&{lbl:"Offene Angebote",val:`${proposals}`,col:"var(--ink2)",warn:false},
          ].filter(Boolean).map((c,i) => (
            <div key={i} style={{padding:"7px 14px",borderRadius:8,background:c.warn?"rgba(255,77,141,.07)":"var(--surface)",border:`1px solid ${c.warn?"rgba(255,77,141,.2)":"var(--border)"}`,minWidth:110}}>
              <div style={{fontSize:".68rem",color:c.col,marginBottom:2}}>{c.lbl}</div>
              <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700,fontSize:".9rem",color:c.col}}>{c.val}</div>
            </div>
          ))}
        </div>
      )}
      {mode==="b2c" && (
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {[
            {lbl:"Umsatz heute",val:fmtEur(todayUmsatz),col:"var(--accent)"},
            {lbl:`${todayBons.length} Bons`,val:avgBon>0?`Ø ${fmtEur(avgBon)}`:"—",col:"var(--ink)"},
            kassenstand!=null&&{lbl:"Kassenbestand",val:fmtEur(kassenstand),col:"var(--accent)"},
          ].filter(Boolean).map((c,i) => (
            <div key={i} style={{padding:"7px 14px",borderRadius:8,background:"var(--surface)",border:"1px solid var(--border)",minWidth:110}}>
              <div style={{fontSize:".68rem",color:"var(--ink2)",marginBottom:2}}>{c.lbl}</div>
              <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700,fontSize:".9rem",color:c.col}}>{c.val}</div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Quick actions (mode-aware) ─── */}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {mode==="b2c" ? (<>
          <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={() => onNavigate?.("kasse")}>Tagesabschluss</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => onNavigate?.("kasse")}>+ Kassenbon</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={onUpload}>+ Beleg</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => onNavigate?.("steuern")} title="Umsatzsteuer-Voranmeldung">UStVA</button>
        </>) : mode==="b2b" ? (<>
          <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={() => onNavigate?.("rechnungen")}>+ Rechnung</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => onNavigate?.("rechnungen")}>+ Angebot</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => onNavigate?.("posten")}>Offene Posten</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => onNavigate?.("posten")}>Mahnwesen</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => onNavigate?.("steuern")} title="Umsatzsteuer-Voranmeldung">UStVA</button>
        </>) : (<>
          <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={() => onNavigate?.("rechnungen")}>+ Rechnung</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={onUpload}>+ Beleg hochladen</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => onNavigate?.("posten")}>Offene Posten</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => onNavigate?.("steuern")} title="Umsatzsteuer-Voranmeldung">UStVA</button>
        </>)}
      </div>

      {/* ─── B2B KPI widgets ─── */}
      {(has("ar")||has("overdue")||has("proposals")) && opos && (
        <div className="ac-kpi-grid" style={{marginBottom:16}}>
          {has("ar") && (
            <div className="ac-kpi">
              <div className="ac-kpi-label">Offene Forderungen</div>
              <div className="ac-kpi-value">{fmtEur(opos.summe_offen)}</div>
              <div className="ac-kpi-delta">{opos.total_offen} Rechnung{opos.total_offen!==1?"en":""} offen</div>
            </div>
          )}
          {has("overdue") && (
            <div className="ac-kpi" style={opos.davon_ueberfaellig_anzahl>0?{borderColor:"rgba(255,77,141,.3)",background:"rgba(255,77,141,.04)"}:{}}>
              <div className="ac-kpi-label">Überfällig</div>
              <div className="ac-kpi-value pink">{fmtEur(opos.davon_ueberfaellig_summe)}</div>
              <div className="ac-kpi-delta">{opos.davon_ueberfaellig_anzahl} überfällig{opos.aelteste_rechnung_tage>0?` · älteste ${opos.aelteste_rechnung_tage}d`:""}</div>
            </div>
          )}
          {has("proposals") && proposals!=null && (
            <div className="ac-kpi">
              <div className="ac-kpi-label">Offene Angebote</div>
              <div className="ac-kpi-value purple">{proposals}</div>
              <div className="ac-kpi-delta">warten auf Antwort</div>
            </div>
          )}
        </div>
      )}

      {/* ─── B2C KPI widgets ─── */}
      {(has("today")||has("kassenstand")||has("payment_split")) && (
        <div className="ac-kpi-grid" style={{marginBottom:16}}>
          {has("today") && (
            <div className="ac-kpi">
              <div className="ac-kpi-label">Umsatz heute</div>
              <div className="ac-kpi-value green">{fmtEur(todayUmsatz)}</div>
              <div className="ac-kpi-delta">{todayBons.length} Bon{todayBons.length!==1?"s":""}{avgBon>0?` · Ø ${fmtEur(avgBon)}`:""}</div>
            </div>
          )}
          {has("kassenstand") && kassenstand!=null && (
            <div className="ac-kpi">
              <div className="ac-kpi-label">Kassenbestand</div>
              <div className="ac-kpi-value green">{fmtEur(kassenstand)}</div>
              <div className="ac-kpi-delta">laufender Saldo</div>
            </div>
          )}
          {has("payment_split") && paymentSplit.length>0 && (
            <div className="ac-kpi" style={{gridColumn:"span 2"}}>
              <div className="ac-kpi-label">Zahlungsarten heute</div>
              <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                {paymentSplit.map(([z,amt]) => (
                  <div key={z} style={{padding:"4px 10px",borderRadius:6,background:"var(--surface2)",fontSize:".8rem"}}>
                    <span style={{color:"var(--ink2)",marginRight:6}}>{ZAHLART_LABELS[z]||z}</span>
                    <span style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>{fmtEur(amt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Universal KPIs ─── */}
      {(has("gewinnmarge")||has("steuerruecklage")||has("monatsumsatz")||has("deb_zahlungsziel")) && (
        <div className="ac-kpi-grid" style={{marginBottom:16}}>
          {has("gewinnmarge") && dash.einnahmen > 0 && (
            <div className="ac-kpi">
              <div className="ac-kpi-label">Gewinnmarge</div>
              <div className={`ac-kpi-value ${gewinnmarge >= 0 ? "green" : "pink"}`}>
                {gewinnmarge.toFixed(1)} %
              </div>
              <div className="ac-kpi-delta">Nettogewinn / Einnahmen</div>
            </div>
          )}
          {has("steuerruecklage") && gewinn > 0 && (
            <div className="ac-kpi" style={{borderColor:"rgba(122,92,255,.2)",background:"rgba(122,92,255,.03)"}}>
              <div className="ac-kpi-label">Steuerrücklage</div>
              <div className="ac-kpi-value purple">{fmtEur(gewinn * 0.30)}</div>
              <div className="ac-kpi-delta">Empfehlung: 30 % des Gewinns zurücklegen</div>
            </div>
          )}
          {has("monatsumsatz") && lfdMonat && (
            <div className="ac-kpi">
              <div className="ac-kpi-label">Monatsumsatz lfd.</div>
              <div className="ac-kpi-value">{fmtEur(lfdMonat.einnahmen||0)}</div>
              <div className="ac-kpi-delta" style={monatsTrend != null ? {color:monatsTrend >= 0 ? "var(--accent)" : "var(--a3)"} : {}}>
                {monatsTrend != null
                  ? `${monatsTrend >= 0 ? "▲" : "▼"} ${Math.abs(monatsTrend).toFixed(0)} % ggü. Vormonat`
                  : "Kein Vormonatswert"}
              </div>
            </div>
          )}
          {has("deb_zahlungsziel") && opos?.aelteste_rechnung_tage > 0 && (
            <div className="ac-kpi" style={opos.aelteste_rechnung_tage > 30 ? {borderColor:"rgba(255,77,141,.3)",background:"rgba(255,77,141,.04)"} : {}}>
              <div className="ac-kpi-label">Ø Zahlungsverzug</div>
              <div className={`ac-kpi-value ${opos.aelteste_rechnung_tage > 30 ? "pink" : ""}`}>
                {opos.aelteste_rechnung_tage} Tage
              </div>
              <div className="ac-kpi-delta">Älteste offene Forderung</div>
            </div>
          )}
        </div>
      )}

      {/* ─── Charts ─── */}
      {(has("cashflow")||has("categories")) && (
        <div className={has("cashflow")&&has("categories")?"ac-grid-2":""} style={{marginBottom:16}}>
          {has("cashflow") && (
            <div className="ac-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="ac-section-title" style={{marginBottom:0}}>Cashflow</div>
                <div style={{display:"flex",gap:4}}>
                  {perioden.map(p => (
                    <button key={p.key} onClick={() => setPeriode(p.key)} style={{
                      padding:"3px 10px",borderRadius:6,border:"1px solid var(--border)",
                      background:periode===p.key?"var(--accent)":"transparent",
                      color:periode===p.key?"#000":"var(--ink2)",
                      fontSize:".72rem",cursor:"pointer",fontWeight:periode===p.key?600:400,transition:"all .15s",
                    }}>{p.label}</button>
                  ))}
                </div>
              </div>
              {areaData.length>0 ? (
                <ResponsiveContainer width="100%" height={220} aria-label="Cashflow-Verlauf: Einnahmen und Ausgaben nach Monat">
                  <AreaChart data={areaData} margin={{top:4,right:4,left:0,bottom:0}}>
                    <defs>
                      <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c6ff3c" stopOpacity={0.25}/><stop offset="95%" stopColor="#c6ff3c" stopOpacity={0}/></linearGradient>
                      <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7a5cff" stopOpacity={0.2}/><stop offset="95%" stopColor="#7a5cff" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
                    <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v}/>
                    <Tooltip content={({active,payload,label}) => {
                      if(!active||!payload?.length) return null;
                      return <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",fontSize:".82rem"}}><div style={{color:"var(--ink2)",marginBottom:6,fontSize:".75rem"}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color,fontFamily:"JetBrains Mono,monospace",marginBottom:2}}>{p.name}: {fmtEur(p.value)}</div>)}</div>;
                    }}/>
                    <Area type="monotone" dataKey="Einnahmen" stroke="#c6ff3c" fill="url(#gE)" strokeWidth={2} dot={false} activeDot={{r:5,fill:"#c6ff3c",strokeWidth:0}} animationDuration={600} animationEasing="ease-out"/>
                    <Area type="monotone" dataKey="Ausgaben" stroke="#7a5cff" fill="url(#gA)" strokeWidth={2} dot={false} activeDot={{r:5,fill:"#7a5cff",strokeWidth:0}} animationDuration={600} animationEasing="ease-out" animationBegin={100}/>
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div className="ac-empty" style={{padding:40}}>Noch keine Verlaufsdaten — erstelle deine ersten Rechnungen und Buchungen.</div>}
              {areaData.length>0 && (
                <div style={{display:"flex",gap:16,marginTop:8,justifyContent:"center"}}>
                  {[["Einnahmen","#c6ff3c"],["Ausgaben","#7a5cff"]].map(([l,col]) => (
                    <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:".75rem",color:"var(--ink2)"}}>
                      <div style={{width:12,height:2,background:col,borderRadius:2}}/>{l}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {has("categories") && (
            <div className="ac-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="ac-section-title" style={{marginBottom:0}}>Ausgaben nach Kategorie</div>
                {activeKat && <button onClick={() => setActiveKat(null)} style={{fontSize:".72rem",padding:"3px 10px",borderRadius:6,border:"1px solid var(--border)",background:"transparent",color:"var(--ink2)",cursor:"pointer"}}>✕ {activeKat}</button>}
              </div>
              {allPie.length>0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200} aria-label="Ausgaben nach Kategorie – Tortendiagramm">
                    <PieChart>
                      <Pie data={allPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                        activeIndex={activeIdx}
                        activeShape={({cx:cx2,cy:cy2,innerRadius:ir,outerRadius:or,startAngle:sa,endAngle:ea,fill:f,payload:pl,value:v}) => (
                          <g>
                            <text x={cx2} y={cy2-8} textAnchor="middle" fill="var(--ink)" fontSize={12} fontWeight={600} fontFamily="JetBrains Mono,monospace">{fmtEur(v)}</text>
                            <text x={cx2} y={cy2+10} textAnchor="middle" fill="var(--ink2)" fontSize={9}>{pl.name}</text>
                            <Sector cx={cx2} cy={cy2} innerRadius={ir} outerRadius={or+5} startAngle={sa} endAngle={ea} fill={f}/>
                            <Sector cx={cx2} cy={cy2} innerRadius={or+9} outerRadius={or+11} startAngle={sa} endAngle={ea} fill={f} opacity={0.4}/>
                          </g>
                        )}
                        onMouseEnter={(_,i) => setActiveIdx(i)} onMouseLeave={() => setActiveIdx(null)}
                        onClick={d => setActiveKat(prev => prev===d.name?null:d.name)}
                        animationDuration={600} animationEasing="ease-out" paddingAngle={2}>
                        {allPie.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} opacity={activeKat&&allPie[i].name!==activeKat?0.2:1} style={{cursor:"pointer"}}/>)}
                      </Pie>
                      <Tooltip formatter={v=>fmtEur(v)} contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,fontSize:".82rem"}}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px 12px",marginTop:6,justifyContent:"center"}} role="group" aria-label="Kategorien filtern">
                    {allPie.slice(0,7).map((p,i) => (
                      <button key={p.name} onClick={() => setActiveKat(prev=>prev===p.name?null:p.name)} aria-pressed={activeKat===p.name}
                        style={{display:"flex",alignItems:"center",gap:5,fontSize:".72rem",cursor:"pointer",background:"transparent",border:"none",padding:"2px 4px",borderRadius:4,color:activeKat===p.name?"var(--ink)":"var(--ink2)",opacity:activeKat&&activeKat!==p.name?0.3:1,transition:"all .15s"}}>
                        <div style={{width:7,height:7,borderRadius:2,background:PIE_COLORS[i%PIE_COLORS.length],flexShrink:0}} aria-hidden="true"/>{p.name}
                      </button>
                    ))}
                  </div>
                </>
              ) : <div className="ac-empty" style={{padding:40}}>Noch keine Daten</div>}
            </div>
          )}
        </div>
      )}

      {/* ─── Kundenaktivität ─── */}
      {has("kunden_aktivitaet") && (
        <div className="ac-card" style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <div className="ac-section-title" style={{marginBottom:0}}>Kundenaktivität</div>
            <div style={{display:"flex",gap:2,background:"rgba(255,255,255,.04)",borderRadius:8,padding:3}}>
              {KUNDEN_PERIODS.map(p=>(
                <button key={p.key} onClick={()=>setKundenPeriod(p.key)}
                  style={{padding:"4px 11px",borderRadius:6,border:"none",cursor:"pointer",
                    fontFamily:"Inter,sans-serif",fontSize:".73rem",fontWeight:kundenPeriod===p.key?600:400,
                    background:kundenPeriod===p.key?"rgba(198,255,60,.15)":"transparent",
                    color:kundenPeriod===p.key?"var(--accent)":"var(--ink2)",transition:"all .12s",
                  }}>{p.label}</button>
              ))}
            </div>
          </div>
          {kundenData ? (
            <div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:kundenData.list.length>0?16:0}}>
                {[
                  {lbl:"Unique Kunden",   val:kundenData.unique, col:"var(--accent)"},
                  {lbl:"Rechnungen",      val:kundenData.total,  col:"var(--ink)"},
                  {lbl:"Umsatz gesamt",   val:fmtEur(kundenData.umsatz), col:"var(--accent)"},
                  kundenData.unique>0&&{lbl:"Ø pro Kunde", val:fmtEur(kundenData.umsatz/kundenData.unique), col:"var(--ink2)"},
                ].filter(Boolean).map((c,i)=>(
                  <div key={i} style={{padding:"10px 16px",borderRadius:10,background:"var(--surface2)",border:"1px solid var(--border)",minWidth:110}}>
                    <div style={{fontSize:".68rem",color:"var(--ink2)",marginBottom:4}}>{c.lbl}</div>
                    <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700,fontSize:".95rem",color:c.col}}>{c.val}</div>
                  </div>
                ))}
              </div>
              {kundenData.list.length>0 && (
                <div>
                  <div style={{fontSize:".72rem",color:"var(--ink2)",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Top Kunden — {KUNDEN_PERIODS.find(p=>p.key===kundenPeriod)?.label}</div>
                  {kundenData.list.slice(0,5).map((k,i)=>{
                    const maxU = kundenData.list[0].umsatz||1;
                    return (
                      <div key={i} style={{marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:".8rem",marginBottom:3}}>
                          <span style={{color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}>{k.name}</span>
                          <span style={{fontFamily:"JetBrains Mono,monospace",color:"var(--accent)",fontWeight:600,flexShrink:0}}>{fmtEur(k.umsatz)}</span>
                        </div>
                        <div style={{height:4,background:"rgba(255,255,255,.06)",borderRadius:99}}>
                          <div style={{height:"100%",borderRadius:99,background:`rgba(198,255,60,${0.8-i*0.1})`,width:`${k.umsatz/maxU*100}%`,transition:"width .5s ease"}}/>
                        </div>
                        <div style={{fontSize:".68rem",color:"var(--ink2)",marginTop:2}}>{k.anzahl} Rechnung{k.anzahl!==1?"en":""}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {kundenData.list.length===0 && (
                <div style={{color:"var(--ink2)",fontSize:".82rem",padding:"8px 0"}}>Keine Rechnungen im gewählten Zeitraum.</div>
              )}
            </div>
          ) : (
            <div style={{color:"var(--ink2)",fontSize:".82rem",padding:"8px 0"}}>
              Kundendaten werden aus Rechnungen berechnet. Erstelle Ausgangsrechnungen, um diese Auswertung zu sehen.
            </div>
          )}
        </div>
      )}

      {/* ─── Top-Kunden (B2B, YTD bar chart) ─── */}
      {has("top_kunden") && (
        <div className="ac-card" style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div className="ac-section-title" style={{marginBottom:0}}>Top-Kunden {new Date().getFullYear()}</div>
            <span style={{fontSize:".75rem",color:"var(--ink2)"}}>nach Umsatz (netto)</span>
          </div>
          {topKunden.length>0 ? (
            <ResponsiveContainer width="100%" height={topKunden.length*38+16} aria-label="Top-Kunden nach Umsatz">
              <BarChart data={topKunden} layout="vertical" margin={{top:0,right:72,left:0,bottom:0}}>
                <XAxis type="number" hide/>
                <YAxis type="category" dataKey="name" tick={{fill:"#9b9890",fontSize:11}} axisLine={false} tickLine={false} width={140}/>
                <Tooltip
                  cursor={{fill:"rgba(255,255,255,.03)"}}
                  formatter={v=>[fmtEur(v),"Umsatz"]}
                  contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,fontSize:".82rem"}}
                />
                <Bar dataKey="umsatz" radius={[0,4,4,0]} animationDuration={700}
                  label={({x,y,width,height,value})=>(
                    <text x={x+width+6} y={y+height/2+1} fill="var(--ink2)" fontSize={10} dominantBaseline="middle" fontFamily="JetBrains Mono,monospace">
                      {value>=1000?`${(value/1000).toFixed(1)}k`:fmtEur(value)}
                    </text>
                  )}>
                  {topKunden.map((_,i)=><Cell key={i} fill={`rgba(198,255,60,${0.85-i*0.08})`}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{color:"var(--ink2)",fontSize:".82rem",padding:"12px 0"}}>
              Keine Rechnungsdaten — Top-Kunden werden aus Ausgangsrechnungen berechnet.
            </div>
          )}
        </div>
      )}

      {/* ─── Umsatzziel ─── */}
      {has("umsatzziel") && (
        <div className="ac-card" style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div className="ac-section-title" style={{marginBottom:0}}>Umsatzziel {new Date().getFullYear()}</div>
            {!editingZiel ? (
              <button onClick={() => { setZielInput(jahresZiel>0?String(jahresZiel):""); setEditingZiel(true); }}
                style={{fontSize:".75rem",padding:"3px 10px",borderRadius:6,border:"1px solid var(--border)",background:"transparent",color:"var(--ink2)",cursor:"pointer"}}>
                {jahresZiel>0?"Ziel ändern":"Ziel setzen"}
              </button>
            ) : (
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <input
                  type="number" min="0" placeholder="Ziel in €"
                  value={zielInput} onChange={e => setZielInput(e.target.value)}
                  style={{width:120,padding:"4px 8px",borderRadius:6,border:"1px solid var(--accent)",background:"var(--surface2)",color:"var(--ink)",fontSize:".82rem",outline:"none"}}
                  autoFocus onKeyDown={e => {
                    if (e.key==="Enter") { setJahresZiel(parseFloat(zielInput)||0); setEditingZiel(false); }
                    if (e.key==="Escape") setEditingZiel(false);
                  }}
                />
                <button onClick={() => { setJahresZiel(parseFloat(zielInput)||0); setEditingZiel(false); }}
                  style={{padding:"4px 10px",borderRadius:6,background:"var(--accent)",border:"none",color:"#000",fontSize:".78rem",cursor:"pointer",fontWeight:600}}>OK</button>
                <button onClick={() => setEditingZiel(false)}
                  style={{padding:"4px 8px",borderRadius:6,background:"transparent",border:"1px solid var(--border)",color:"var(--ink2)",fontSize:".78rem",cursor:"pointer"}}>✕</button>
              </div>
            )}
          </div>
          {jahresZiel > 0 ? (() => {
            const pct = Math.min((dash.einnahmen||0) / jahresZiel * 100, 100);
            const remaining = Math.max(jahresZiel - (dash.einnahmen||0), 0);
            const monthsLeft = 12 - new Date().getMonth();
            const needed = monthsLeft > 0 ? remaining / monthsLeft : 0;
            return (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:".82rem"}}>
                  <span style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700,color:"var(--accent)",fontSize:"1.1rem"}}>{fmtEur(dash.einnahmen||0)}</span>
                  <span style={{color:"var(--ink2)"}}>von {fmtEur(jahresZiel)}</span>
                </div>
                <div style={{height:10,background:"rgba(255,255,255,.06)",borderRadius:99,overflow:"hidden",marginBottom:8}}>
                  <div style={{
                    height:"100%",borderRadius:99,
                    background: pct>=100 ? "var(--accent)" : pct>=70 ? "rgba(198,255,60,.7)" : pct>=40 ? "#7a5cff" : "var(--a3)",
                    width:`${pct}%`,transition:"width .6s ease",
                  }}/>
                </div>
                <div style={{display:"flex",gap:16,fontSize:".75rem",color:"var(--ink2)",flexWrap:"wrap"}}>
                  <span style={{color:pct>=100?"var(--accent)":"var(--ink)",fontWeight:600}}>{pct.toFixed(1)} % erreicht</span>
                  {pct < 100 && <span>Noch {fmtEur(remaining)} bis zum Ziel</span>}
                  {pct < 100 && monthsLeft > 0 && <span>≈ {fmtEur(needed)} / Monat nötig ({monthsLeft} Monate verbleibend)</span>}
                  {pct >= 100 && <span style={{color:"var(--accent)",fontWeight:600}}>Ziel erreicht!</span>}
                </div>
              </div>
            );
          })() : (
            <div style={{color:"var(--ink2)",fontSize:".85rem",padding:"12px 0"}}>
              Setze ein Jahresziel, um deinen Fortschritt zu verfolgen.
            </div>
          )}
        </div>
      )}

      {/* ─── Jahr-über-Jahr ─── */}
      {has("jahresvgl") && jahresVglData && (
        <div className="ac-card" style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div className="ac-section-title" style={{marginBottom:0}}>Einnahmen Jahr-über-Jahr</div>
            <div style={{display:"flex",gap:12,fontSize:".75rem"}}>
              {[[jahresVglData.curr,"#c6ff3c"],[jahresVglData.prev,"rgba(155,152,144,.5)"]].map(([yr,col]) => (
                <div key={yr} style={{display:"flex",alignItems:"center",gap:5,color:"var(--ink2)"}}>
                  <div style={{width:10,height:10,borderRadius:2,background:col,flexShrink:0}}/>
                  {yr}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200} aria-label="Einnahmen Jahresvergleich">
            <BarChart data={jahresVglData.rows} margin={{top:4,right:4,left:0,bottom:0}} barGap={2} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={36}/>
              <Tooltip
                cursor={{fill:"rgba(255,255,255,.03)"}}
                content={({active,payload,label}) => {
                  if (!active||!payload?.length) return null;
                  return (
                    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",fontSize:".82rem"}}>
                      <div style={{color:"var(--ink2)",marginBottom:6,fontSize:".75rem"}}>{label}</div>
                      {payload.map((p,i) => <div key={i} style={{color:p.color,fontFamily:"JetBrains Mono,monospace",marginBottom:2}}>{p.dataKey}: {fmtEur(p.value)}</div>)}
                      {payload.length===2 && payload[1].value>0 && (
                        <div style={{marginTop:6,paddingTop:6,borderTop:"1px solid rgba(255,255,255,.08)",color:"var(--ink2)",fontSize:".72rem"}}>
                          {payload[0].value >= payload[1].value
                            ? `▲ +${(((payload[0].value-payload[1].value)/payload[1].value)*100).toFixed(1)} % ggü. Vorjahr`
                            : `▼ ${(((payload[0].value-payload[1].value)/payload[1].value)*100).toFixed(1)} % ggü. Vorjahr`}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <Bar dataKey={jahresVglData.curr} fill="#c6ff3c" radius={[3,3,0,0]} animationDuration={600}/>
              <Bar dataKey={jahresVglData.prev} fill="rgba(155,152,144,.3)" radius={[3,3,0,0]} animationDuration={600} animationBegin={100}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ─── Top Ausgaben + Forderungsquote row ─── */}
      {(has("top_ausgaben") || has("forderungsquote")) && (
        <div className={has("top_ausgaben")&&has("forderungsquote")&&opos?"ac-grid-2":""} style={{marginBottom:16}}>

          {has("top_ausgaben") && topAusgaben.length>0 && (
            <div className="ac-card">
              <div className="ac-section-title">Top Ausgabenposten</div>
              <ResponsiveContainer width="100%" height={topAusgaben.length*36+20} aria-label="Top Ausgabenkategorien">
                <BarChart data={topAusgaben} layout="vertical" margin={{top:0,right:60,left:0,bottom:0}}>
                  <XAxis type="number" hide tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v}/>
                  <YAxis type="category" dataKey="name" tick={{fill:"#9b9890",fontSize:11}} axisLine={false} tickLine={false} width={110}/>
                  <Tooltip
                    cursor={{fill:"rgba(255,255,255,.03)"}}
                    formatter={v => [fmtEur(v), "Ausgaben"]}
                    contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,fontSize:".82rem"}}
                  />
                  <Bar dataKey="value" radius={[0,4,4,0]} animationDuration={700}
                    label={({x,y,width,height,value}) => (
                      <text x={x+width+6} y={y+height/2+1} fill="var(--ink2)" fontSize={10} dominantBaseline="middle" fontFamily="JetBrains Mono,monospace">
                        {value>=1000?`${(value/1000).toFixed(1)}k`:value.toFixed(0)}
                      </text>
                    )}>
                    {topAusgaben.map((_,i) => (
                      <Cell key={i} fill={`rgba(198,255,60,${0.7 - i*0.08})`}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {has("forderungsquote") && opos && (
            <div className="ac-card">
              <div className="ac-section-title">Forderungsstruktur</div>
              {(() => {
                const offen   = (opos.summe_offen||0) - (opos.davon_ueberfaellig_summe||0);
                const faellig = opos.davon_ueberfaellig_summe||0;
                const total   = opos.summe_offen||0;
                if (total <= 0) return <div className="ac-empty" style={{padding:24}}>Keine offenen Forderungen</div>;
                const offenPct   = total>0 ? offen/total*100 : 0;
                const faelligPct = total>0 ? faellig/total*100 : 0;
                const pieData = [
                  {name:"Fällig (offen)",  value:offen,   color:"#c6ff3c"},
                  {name:"Überfällig",      value:faellig, color:"#ff4d8d"},
                ];
                return (
                  <>
                    <div style={{display:"flex",justifyContent:"center"}}>
                      <ResponsiveContainer width={180} height={160} aria-label="Forderungsstruktur">
                        <PieChart>
                          <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={44} outerRadius={70}
                            paddingAngle={3} animationDuration={600}>
                            {pieData.map((d,i) => <Cell key={i} fill={d.color}/>)}
                          </Pie>
                          <Tooltip formatter={v=>[fmtEur(v),"Betrag"]} contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,fontSize:".82rem"}}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
                      {[
                        {label:"Noch nicht fällig",val:offen,    pct:offenPct,   col:"#c6ff3c"},
                        {label:"Überfällig",         val:faellig, pct:faelligPct, col:"#ff4d8d"},
                      ].map(r => (
                        <div key={r.label}>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",marginBottom:3}}>
                            <span style={{color:r.col,fontWeight:600}}>{r.label}</span>
                            <span style={{fontFamily:"JetBrains Mono,monospace",color:"var(--ink)"}}>{fmtEur(r.val)}</span>
                          </div>
                          <div style={{height:5,background:"rgba(255,255,255,.06)",borderRadius:99}}>
                            <div style={{height:"100%",borderRadius:99,background:r.col,width:`${r.pct}%`,transition:"width .5s ease"}}/>
                          </div>
                          <div style={{fontSize:".7rem",color:"var(--ink2)",marginTop:2}}>{r.pct.toFixed(0)} %</div>
                        </div>
                      ))}
                      {opos.aelteste_rechnung_tage > 0 && (
                        <div style={{marginTop:4,padding:"8px 12px",borderRadius:8,background:"rgba(255,77,141,.06)",border:"1px solid rgba(255,77,141,.15)",fontSize:".78rem",color:"var(--a3)"}}>
                          Älteste offene Forderung: <strong>{opos.aelteste_rechnung_tage} Tage</strong>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ─── Gewinn/Verlust-Verlauf ─── */}
      {has("gewinn_verlauf") && gewinnVerlauf.length>0 && (
        <div className="ac-card" style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div className="ac-section-title" style={{marginBottom:0}}>Monatlicher Gewinn / Verlust</div>
            <div style={{display:"flex",gap:12,fontSize:".75rem"}}>
              <span style={{display:"flex",alignItems:"center",gap:5,color:"var(--ink2)"}}><div style={{width:10,height:10,borderRadius:2,background:"var(--accent)"}}/> Gewinn</span>
              <span style={{display:"flex",alignItems:"center",gap:5,color:"var(--ink2)"}}><div style={{width:10,height:10,borderRadius:2,background:"var(--a3)"}}/> Verlust</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200} aria-label="Monatlicher Gewinn und Verlust">
            <BarChart data={gewinnVerlauf} margin={{top:4,right:4,left:0,bottom:0}} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}
                tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v>=0?v:`-${Math.abs(v)>=1000?(Math.abs(v)/1000).toFixed(0)+"k":Math.abs(v)}`} width={40}/>
              <ReferenceLine y={0} stroke="rgba(239,237,231,.15)" strokeWidth={1}/>
              <Tooltip
                cursor={{fill:"rgba(255,255,255,.03)"}}
                content={({active,payload,label})=>{
                  if(!active||!payload?.length) return null;
                  const v=payload[0].value;
                  return (
                    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",fontSize:".82rem"}}>
                      <div style={{color:"var(--ink2)",marginBottom:4,fontSize:".75rem"}}>{label}</div>
                      <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700,color:v>=0?"var(--accent)":"var(--a3)"}}>{v>=0?"▲ ":  "▼ "}{fmtEur(Math.abs(v))}</div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="gewinn" radius={[3,3,0,0]} animationDuration={700} isAnimationActive={true}>
                {gewinnVerlauf.map((d,i)=><Cell key={i} fill={d.gewinn>=0?"var(--accent)":"var(--a3)"} opacity={0.85}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ─── Umsatzprognose + Ausgabentrend row ─── */}
      {(has("umsatz_prognose")||has("ausgaben_trend")) && (
        <div className={has("umsatz_prognose")&&has("ausgaben_trend")?"ac-grid-2":""} style={{marginBottom:16}}>

          {has("umsatz_prognose") && umsatzPrognose && (
            <div className="ac-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="ac-section-title" style={{marginBottom:0}}>Umsatzprognose</div>
                <span style={{fontSize:".72rem",color:"var(--ink2)",padding:"2px 8px",borderRadius:20,background:"rgba(122,92,255,.12)",border:"1px solid rgba(122,92,255,.2)",color:"#a585ff"}}>Trendbasiert</span>
              </div>
              <ResponsiveContainer width="100%" height={200} aria-label="Umsatzprognose nächste 3 Monate">
                <LineChart data={umsatzPrognose.data} margin={{top:4,right:4,left:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}
                    tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={36}/>
                  {umsatzPrognose.pivot>0 && (
                    <ReferenceLine x={umsatzPrognose.data[umsatzPrognose.pivot-1]?.name}
                      stroke="rgba(239,237,231,.15)" strokeDasharray="4 4" label={{value:"Heute",fill:"rgba(155,152,144,.5)",fontSize:9,position:"top"}}/>
                  )}
                  <Tooltip
                    content={({active,payload,label})=>{
                      if(!active||!payload?.length) return null;
                      const pts = payload.filter(p=>p.value!=null);
                      return (
                        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",fontSize:".82rem"}}>
                          <div style={{color:"var(--ink2)",marginBottom:4,fontSize:".75rem"}}>{label}</div>
                          {pts.map((p,i)=><div key={i} style={{color:p.color,fontFamily:"JetBrains Mono,monospace",marginBottom:2}}>{p.name==="Einnahmen"?"Ist":"Prognose"}: {fmtEur(p.value)}</div>)}
                        </div>
                      );
                    }}
                  />
                  <Line type="monotone" dataKey="Einnahmen" stroke="#c6ff3c" strokeWidth={2}
                    dot={{r:3,fill:"#c6ff3c",strokeWidth:0}} activeDot={{r:5}} connectNulls={false} animationDuration={600}/>
                  <Line type="monotone" dataKey="prognose" stroke="#7a5cff" strokeWidth={2} strokeDasharray="5 4"
                    dot={{r:3,fill:"#7a5cff",strokeWidth:0}} activeDot={{r:5}} connectNulls={false} animationDuration={700}/>
                </LineChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:8}}>
                {[["Ist-Werte","#c6ff3c","solid"],["Prognose","#7a5cff","dashed"]].map(([l,col,dash])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:".73rem",color:"var(--ink2)"}}>
                    <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke={col} strokeWidth="2" strokeDasharray={dash==="dashed"?"4 3":"0"}/></svg>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}

          {has("ausgaben_trend") && ausgabenTrend.length>0 && (
            <div className="ac-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="ac-section-title" style={{marginBottom:0}}>Ausgabenentwicklung</div>
                {ausgabenTrend.length>1 && (()=>{
                  const first = ausgabenTrend[0].Ausgaben, last = ausgabenTrend[ausgabenTrend.length-1].Ausgaben;
                  const pct = first>0?(last-first)/first*100:0;
                  return <span style={{fontSize:".75rem",fontWeight:600,color:pct>5?"var(--a3)":pct<-5?"var(--accent)":"var(--ink2)"}}>{pct>0?"▲":"▼"} {Math.abs(pct).toFixed(0)} % (12M)</span>;
                })()}
              </div>
              <ResponsiveContainer width="100%" height={200} aria-label="Ausgabenentwicklung mit Trendlinie">
                <LineChart data={ausgabenTrend} margin={{top:4,right:4,left:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}
                    tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={36}/>
                  <Tooltip formatter={(v,n)=>[fmtEur(v), n==="Trend"?"Trendlinie":"Ausgaben"]}
                    contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,fontSize:".82rem"}}/>
                  <Line type="monotone" dataKey="Ausgaben" stroke="#7a5cff" strokeWidth={2}
                    dot={{r:3,fill:"#7a5cff",strokeWidth:0}} activeDot={{r:5}} animationDuration={600}/>
                  <Line type="monotone" dataKey="Trend" stroke="rgba(255,77,141,.5)" strokeWidth={1.5} strokeDasharray="4 3"
                    dot={false} animationDuration={700}/>
                </LineChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:8}}>
                {[["Ausgaben","#7a5cff","solid"],["Trendlinie","rgba(255,77,141,.7)","dashed"]].map(([l,col,dash])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:".73rem",color:"var(--ink2)"}}>
                    <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke={col} strokeWidth="2" strokeDasharray={dash==="dashed"?"4 3":"0"}/></svg>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── B2C: Wochenumsatz + Bon-Trend ─── */}
      {(has("wochen_umsatz")||has("bon_trend")) && (
        <div className={has("wochen_umsatz")&&has("bon_trend")?"ac-grid-2":""} style={{marginBottom:16}}>

          {has("wochen_umsatz") && (
            <div className="ac-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="ac-section-title" style={{marginBottom:0}}>Umsatz diese Woche</div>
                <span style={{fontSize:".75rem",color:"var(--ink2)"}}>
                  {fmtEur(wochenData.reduce((s,d)=>s+d.umsatz,0))} gesamt
                </span>
              </div>
              {wochenData.some(d=>d.umsatz>0) ? (
                <ResponsiveContainer width="100%" height={160} aria-label="Umsatz pro Wochentag">
                  <BarChart data={wochenData} margin={{top:4,right:4,left:0,bottom:0}} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
                    <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#9b9890",fontSize:9}} axisLine={false} tickLine={false}
                      tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={32}/>
                    <Tooltip
                      cursor={{fill:"rgba(255,255,255,.03)"}}
                      content={({active,payload,label}) => {
                        if(!active||!payload?.length) return null;
                        const d = payload[0];
                        return (
                          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",fontSize:".82rem"}}>
                            <div style={{color:"var(--ink2)",marginBottom:4,fontSize:".75rem"}}>{label}</div>
                            <div style={{fontFamily:"JetBrains Mono,monospace",color:"var(--accent)",fontWeight:700}}>{fmtEur(d.value)}</div>
                            {d.payload.bons>0 && <div style={{fontSize:".72rem",color:"var(--ink2)",marginTop:2}}>{d.payload.bons} Bon{d.payload.bons!==1?"s":""}</div>}
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="umsatz" radius={[4,4,0,0]} animationDuration={600}>
                      {wochenData.map((d,i) => {
                        const isToday = DAY_NAMES[(new Date().getDay()+6)%7]===d.name;
                        return <Cell key={i} fill={isToday?"#c6ff3c":"rgba(198,255,60,.35)"}/>;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="ac-empty" style={{padding:24,fontSize:".82rem"}}>Noch kein Umsatz diese Woche</div>}
            </div>
          )}

          {has("bon_trend") && (
            <div className="ac-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="ac-section-title" style={{marginBottom:0}}>Ø Bonwert letzte Tage</div>
                {bonTrendData.length>0 && (
                  <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:".85rem",color:"var(--accent)",fontWeight:700}}>
                    {fmtEur(bonTrendData.reduce((s,d)=>s+d.avg,0)/bonTrendData.length)}
                  </span>
                )}
              </div>
              {bonTrendData.length > 1 ? (
                <ResponsiveContainer width="100%" height={160} aria-label="Durchschnittlicher Bonwert Trend">
                  <LineChart data={bonTrendData} margin={{top:4,right:4,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
                    <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#9b9890",fontSize:9}} axisLine={false} tickLine={false}
                      tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={32}/>
                    {bonTrendData.length>1 && (
                      <ReferenceLine
                        y={bonTrendData.reduce((s,d)=>s+d.avg,0)/bonTrendData.length}
                        stroke="rgba(198,255,60,.3)" strokeDasharray="4 4"
                      />
                    )}
                    <Tooltip
                      formatter={v=>[fmtEur(v),"Ø Bonwert"]}
                      contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,fontSize:".82rem"}}
                    />
                    <Line type="monotone" dataKey="avg" stroke="#c6ff3c" strokeWidth={2}
                      dot={{r:3,fill:"#c6ff3c",strokeWidth:0}}
                      activeDot={{r:5,fill:"#c6ff3c",strokeWidth:0}}
                      animationDuration={600}/>
                  </LineChart>
                </ResponsiveContainer>
              ) : <div className="ac-empty" style={{padding:24,fontSize:".82rem"}}>Noch nicht genug Daten für einen Trend</div>}
            </div>
          )}
        </div>
      )}

      {/* ─── Stornoquote + Zahlungsarten nach Tag ─── */}
      {(has("stornoquote")||has("zahlungsarten_tag")) && (
        <div className={has("stornoquote")&&has("zahlungsarten_tag")?"ac-grid-2":""} style={{marginBottom:16}}>

          {has("stornoquote") && (
            <div className="ac-card">
              <div className="ac-section-title">Stornoquote diese Woche</div>
              {stornoquoteData && stornoquoteData.total>0 ? (
                <>
                  <div style={{display:"flex",gap:12,marginBottom:14,flexWrap:"wrap"}}>
                    {[
                      {lbl:"Gesamt Bons",  val:stornoquoteData.total,     col:"var(--ink)"},
                      {lbl:"Storniert",    val:stornoquoteData.storniert, col:"var(--a3)"},
                      {lbl:"Stornoquote",  val:`${stornoquoteData.pct.toFixed(1)} %`, col:stornoquoteData.pct>5?"var(--a3)":"var(--accent)"},
                    ].map((c,i)=>(
                      <div key={i} style={{padding:"8px 14px",borderRadius:8,background:"var(--surface2)",border:"1px solid var(--border)"}}>
                        <div style={{fontSize:".68rem",color:"var(--ink2)",marginBottom:3}}>{c.lbl}</div>
                        <div style={{fontFamily:"JetBrains Mono,monospace",fontWeight:700,color:c.col}}>{c.val}</div>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={130} aria-label="Stornoquote nach Wochentag">
                    <BarChart data={stornoquoteData.byDay} margin={{top:4,right:4,left:0,bottom:0}} barCategoryGap="28%" barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
                      <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:"#9b9890",fontSize:9}} axisLine={false} tickLine={false} width={24} allowDecimals={false}/>
                      <Tooltip
                        cursor={{fill:"rgba(255,255,255,.03)"}}
                        contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,fontSize:".82rem"}}
                      />
                      <Bar dataKey="aktiv"     name="Aktiv"     fill="rgba(198,255,60,.5)"  radius={[3,3,0,0]} stackId="a" animationDuration={600}/>
                      <Bar dataKey="storniert" name="Storniert" fill="var(--a3)" radius={[3,3,0,0]} stackId="a" animationDuration={700}/>
                    </BarChart>
                  </ResponsiveContainer>
                </>
              ) : <div className="ac-empty" style={{padding:24,fontSize:".82rem"}}>Keine Kassenbons diese Woche</div>}
            </div>
          )}

          {has("zahlungsarten_tag") && zahlungsartenTagData.zahlarten.length>0 && (
            <div className="ac-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div className="ac-section-title" style={{marginBottom:0}}>Zahlungsarten nach Tag</div>
              </div>
              <ResponsiveContainer width="100%" height={180} aria-label="Zahlungsarten nach Wochentag">
                <BarChart data={zahlungsartenTagData.data} margin={{top:4,right:4,left:0,bottom:0}} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.04)" vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:"#9b9890",fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#9b9890",fontSize:9}} axisLine={false} tickLine={false}
                    tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v} width={32}/>
                  <Tooltip
                    cursor={{fill:"rgba(255,255,255,.03)"}}
                    formatter={(v,n)=>[fmtEur(v), ZAHLART_LABELS[n]||n]}
                    contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,fontSize:".82rem"}}
                  />
                  {zahlungsartenTagData.zahlarten.map(z=>(
                    <Bar key={z} dataKey={z} name={z} stackId="z"
                      fill={ZAHLART_COLORS[z]||"#9b9890"}
                      radius={zahlungsartenTagData.zahlarten.indexOf(z)===zahlungsartenTagData.zahlarten.length-1?[3,3,0,0]:[0,0,0,0]}
                      animationDuration={600}/>
                  ))}
                </BarChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginTop:8}}>
                {zahlungsartenTagData.zahlarten.map(z=>(
                  <div key={z} style={{display:"flex",alignItems:"center",gap:5,fontSize:".73rem",color:"var(--ink2)"}}>
                    <div style={{width:10,height:10,borderRadius:2,background:ZAHLART_COLORS[z]||"#9b9890"}}/>
                    {ZAHLART_LABELS[z]||z}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Recent bookings ─── */}
      {has("recent") && (dash.letzte_buchungen?.length>0) && (
        <div className="ac-card">
          <div className="ac-section-title">Letzte Buchungen</div>
          <table className="ac-table" aria-label="Letzte Buchungen">
            <thead><tr>
              <th scope="col">Datum</th><th scope="col">Text</th>
              <th scope="col">Beleg</th><th scope="col" style={{textAlign:"right"}}>Betrag</th>
            </tr></thead>
            <tbody>
              {dash.letzte_buchungen.slice(0,8).map((b,i) => (
                <tr key={b.id??`fb-${i}`}>
                  <td className="ac-mono">{b.buchungsdatum}</td>
                  <td>{b.buchungstext||"—"}</td>
                  <td className="ac-mono" style={{color:"var(--ink2)"}}>{b.beleg_nummer||"—"}</td>
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

// ── Sub-nav tab data (stable refs prevent unnecessary SubNav re-renders) ──────
const RECHNUNGEN_SUBS = [
  {id:"eingehend",     label:"Eingehend"},
  {id:"ausgehend",     label:"Ausgehend"},
  {id:"erechnung",     label:"E-Rechnung"},
  {id:"angebote",      label:"Angebote"},
  {id:"lieferscheine", label:"Lieferscheine"},
  {id:"gutschriften",  label:"Gutschriften"},
  {id:"serienrechnung",label:"Serienrechnungen"},
  {id:"widerruf",      label:"Widerrufsrecht"},
];
const POSTEN_SUBS    = [{id:"opos",label:"Offene Posten"},{id:"mahnwesen",label:"Mahnwesen"}];
const STEUERN_SUBS   = [
  {id:"dashboard",       label:"Steuer-Cockpit"},
  {id:"ustva",           label:"UStVA"},
  {id:"gewerbesteuer",   label:"GewSt / ZM"},
  {id:"oss",             label:"OSS (EU)"},
  {id:"jahresabschluss", label:"Jahresabschluss"},
  {id:"steuerkalender",  label:"Steuer-Kalender"},
];
const BUCHHALTUNG_SUBS = [
  {id:"buchungen",     label:"Journal"},
  {id:"kontenplan",    label:"Kontenplan"},
  {id:"anlagen",       label:"Anlagenbuch"},
  {id:"kostenstellen", label:"Kostenstellen"},
  {id:"auditlog",      label:"Audit-Log"},
];
const PLANUNG_SUBS = [
  {id:"projekte",       label:"Projekte & Zeit"},
  {id:"budget",         label:"Budget"},
  {id:"reisekosten",    label:"Reisekosten"},
  {id:"fahrtenbuch",    label:"Fahrtenbuch"},
  {id:"kassenbuch",     label:"Kassenbuch"},
  {id:"tagesabschluss", label:"Tagesabschluss"},
];
const BELEGE_SUBS   = [{id:"archiv",label:"Belegarchiv"},{id:"email",label:"Belege per E-Mail"}];
const PARTNER_SUBS  = [{id:"partner",label:"Partner"},{id:"zahlungsmoral",label:"Zahlungsmoral"},{id:"waehrungen",label:"Währungen"}];
const BERICHTE_SUBS = [
  {id:"berichte",      label:"Berichte"},
  {id:"export",        label:"Export & DATEV"},
  {id:"steuerberater", label:"Steuerberater-Zugang"},
];
const KASSE_SUBS = [
  {id:"kassenbons",     label:"Kassenbons + TSE"},
  {id:"meldung146a",    label:"§146a Meldung"},
  {id:"ec",             label:"EC-Clearing"},
  {id:"trinkgeld",      label:"Trinkgeld"},
  {id:"gutscheine",     label:"Gutscheine"},
  {id:"tagesabschluss", label:"Tagesabschluss"},
];

// ── Sub-tab nav helper ────────────────────────────────────────────────────────
const SubNav = React.memo(function SubNav({ tabs, active, onChange }) {
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
});

// ── Mega-tab wrapper components ───────────────────────────────────────────────
const RechnungenGruppe = React.memo(function RechnungenGruppe({ onUpload, onRefresh, refreshKey }) {
  const [sub, setSub] = useState("eingehend");
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <SubNav tabs={RECHNUNGEN_SUBS} active={sub} onChange={setSub}/>
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
});

const PostenGruppe = React.memo(function PostenGruppe({ refreshKey, onNavigate }) {
  const [sub, setSub] = useState("opos");
  return (
    <div>
      <SubNav tabs={POSTEN_SUBS} active={sub} onChange={setSub}/>
      {sub==="opos"     && <OposTab key={refreshKey} onNavigate={onNavigate}/>}
      {sub==="mahnwesen"&& <MahnwesenTab key={refreshKey}/>}
    </div>
  );
});

const SteuernGruppe = React.memo(function SteuernGruppe({ refreshKey }) {
  const [sub, setSub] = useState("dashboard");
  return (
    <div>
      <SubNav tabs={STEUERN_SUBS} active={sub} onChange={setSub}/>
      {sub==="dashboard"       && <TaxDashboard key={refreshKey}/>}
      {sub==="ustva"           && <UstVaTab key={refreshKey}/>}
      {sub==="gewerbesteuer"   && <GewerbesteuerTab key={refreshKey}/>}
      {sub==="oss"             && <OssTab key={refreshKey}/>}
      {sub==="jahresabschluss" && <JahresabschlussTab key={refreshKey}/>}
      {sub==="steuerkalender"  && <SteuerkalenderTab key={refreshKey}/>}
    </div>
  );
});

const BuchhaltungGruppe = React.memo(function BuchhaltungGruppe({ refreshKey }) {
  const [sub, setSub] = useState("buchungen");
  return (
    <div>
      <SubNav tabs={BUCHHALTUNG_SUBS} active={sub} onChange={setSub}/>
      {sub==="buchungen"     && <BuchungenTab key={refreshKey}/>}
      {sub==="kontenplan"    && <KontenplanTab key={refreshKey}/>}
      {sub==="anlagen"       && <AnlagenTab key={refreshKey}/>}
      {sub==="kostenstellen" && <KostenstellenTab key={refreshKey}/>}
      {sub==="auditlog"      && <AuditLogTab key={refreshKey}/>}
    </div>
  );
});

const PlanungGruppe = React.memo(function PlanungGruppe({ refreshKey }) {
  const [sub, setSub] = useState("projekte");
  return (
    <div>
      <SubNav tabs={PLANUNG_SUBS} active={sub} onChange={setSub}/>
      {sub==="projekte"       && <ProjektTab key={refreshKey}/>}
      {sub==="budget"         && <BudgetTab key={refreshKey}/>}
      {sub==="reisekosten"    && <ReisekostenTab key={refreshKey}/>}
      {sub==="fahrtenbuch"    && <FahrtenbuchTab key={refreshKey}/>}
      {sub==="kassenbuch"     && <KassenbuchTab key={refreshKey}/>}
      {sub==="tagesabschluss" && <TagesabschlussTab key={refreshKey}/>}
    </div>
  );
});

const BelegeGruppe = React.memo(function BelegeGruppe({ refreshKey }) {
  const [sub, setSub] = useState("archiv");
  return (
    <div>
      <SubNav tabs={BELEGE_SUBS} active={sub} onChange={setSub}/>
      {sub==="archiv"&& <BelegarchivTab key={refreshKey}/>}
      {sub==="email" && <BelegEmailTab key={refreshKey}/>}
    </div>
  );
});

const GeschaeftspartnerGruppe = React.memo(function GeschaeftspartnerGruppe({ refreshKey }) {
  const [sub, setSub] = useState("partner");
  return (
    <div>
      <SubNav tabs={PARTNER_SUBS} active={sub} onChange={setSub}/>
      {sub==="partner"      && <GeschaeftspartnerTab key={refreshKey}/>}
      {sub==="zahlungsmoral"&& <ZahlungsmoralTab key={refreshKey}/>}
      {sub==="waehrungen"   && <WechselkurseTab key={refreshKey}/>}
    </div>
  );
});

const BerichteExportGruppe = React.memo(function BerichteExportGruppe({ refreshKey }) {
  const [sub, setSub] = useState("berichte");
  return (
    <div>
      <SubNav tabs={BERICHTE_SUBS} active={sub} onChange={setSub}/>
      {sub==="berichte"      && <BerichteTab key={refreshKey}/>}
      {sub==="export"        && <ExportTab/>}
      {sub==="steuerberater" && <SteuerberaterTab/>}
    </div>
  );
});

// ── Kasse / POS ──────────────────────────────────────────────────────────────
const KasseGruppe = React.memo(function KasseGruppe({ refreshKey }) {
  const [sub, setSub] = useState("kassenbons");
  return (
    <div>
      <SubNav tabs={KASSE_SUBS} active={sub} onChange={setSub} />
      {sub === "kassenbons"     && <KassenbonTab    key={refreshKey} />}
      {sub === "meldung146a"    && <KassenmeldungTab key={refreshKey} />}
      {sub === "ec"             && <EcClearingTab   key={refreshKey} />}
      {sub === "trinkgeld"      && <TrinkgeldTab    key={refreshKey} />}
      {sub === "gutscheine"     && <GutscheinTab    key={refreshKey} />}
      {sub === "tagesabschluss" && <TagesabschlussTab key={refreshKey} />}
    </div>
  );
});

// ── Tabs config ───────────────────────────────────────────────────────────────
const ALL_TABS = [
  {id:"overview",       label:"Übersicht",     modes:["einfach","doppelt"]},
  {id:"rechnungen",     label:"Rechnungen",    modes:["einfach","doppelt"]},
  {id:"posten",         label:"Mahnwesen",     modes:["einfach","doppelt"]},
  {id:"planung",        label:"Planung",       modes:["einfach","doppelt"]},
  {id:"steuern",        label:"Steuern",       modes:["einfach","doppelt"]},
  {id:"buchhaltung",    label:"Buchführung",   modes:["doppelt"]},
  {id:"belege",         label:"Belege",        modes:["einfach","doppelt"]},
  {id:"partner",        label:"Partner",       modes:["einfach","doppelt"]},
  {id:"bank",           label:"Bank",          modes:["doppelt"]},
  {id:"kasse",          label:"Kasse",         modes:["einfach","doppelt"]},
  {id:"berichte",       label:"Berichte",      modes:["einfach","doppelt"]},
  {id:"import",         label:"Import",        modes:["einfach","doppelt"]},
  {id:"lohnsteuer",     label:"Lohnsteuer",    modes:["doppelt"]},
  {id:"hilfe",          label:"Hilfe",         modes:["einfach","doppelt"]},
];

const NAV_GROUPS = [
  {
    id:"grp-verkauf", label:"Verkauf",
    items:[
      {id:"rechnungen", label:"Rechnungen", modes:["einfach","doppelt"]},
      {id:"posten",     label:"Mahnwesen",  modes:["einfach","doppelt"]},
      {id:"partner",    label:"Partner",    modes:["einfach","doppelt"]},
    ],
  },
  {
    id:"grp-buchh", label:"Buchhaltung",
    items:[
      {id:"buchhaltung", label:"Buchführung", modes:["doppelt"]},
      {id:"belege",      label:"Belege",      modes:["einfach","doppelt"]},
      {id:"bank",        label:"Bank",        modes:["doppelt"]},
      {id:"import",      label:"Import",      modes:["einfach","doppelt"]},
    ],
  },
  {
    id:"grp-controlling", label:"Controlling",
    items:[
      {id:"planung",  label:"Planung",  modes:["einfach","doppelt"]},
      {id:"steuern",  label:"Steuern",  modes:["einfach","doppelt"]},
      {id:"berichte", label:"Berichte", modes:["einfach","doppelt"]},
    ],
  },
  {
    id:"grp-kasse", label:"Kasse",
    items:[
      {id:"kasse", label:"Kasse", modes:["einfach","doppelt"]},
    ],
  },
  {
    id:"grp-personal", label:"Personal",
    items:[
      {id:"lohnsteuer", label:"Lohnsteuer", modes:["doppelt"]},
    ],
  },
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
    const tabLabel = ALL_TABS.find(t => t.id === tab)?.label || "Buchhaltung";
    document.title = `${tabLabel} – NILL Buchhaltung`;
    return () => { document.title = "NILL"; };
  }, [tab]);

  const goTo = useCallback((tabId) => setTab(tabId), []);
  const openUpload = useCallback(() => setUploadOpen(true), []);

  const renderedTab = useMemo(() => {
    switch(tab) {
      case "overview":    return <OverviewTab key={refreshKey} onNavigate={goTo} onUpload={openUpload}/>;
      case "rechnungen":  return <RechnungenGruppe onUpload={openUpload} onRefresh={triggerRefresh} refreshKey={refreshKey}/>;
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
  }, [tab, refreshKey, triggerRefresh, openUpload, goTo, navigate]);

  if (!sessionReady) return <NillLoader text="Buchhaltung wird initialisiert…" />;

  return (
    <>
      <style>{S}</style>
      <div className="ac-shell">
        <a href="#ac-main-content" className="ac-skip-link">Zum Hauptinhalt springen</a>

        {/* ── Top bar ── */}
        <header className="ac-topbar">
          <a className="ac-logo" href="/dashboard" title="Zurück zum Dashboard">NILL<span>.</span></a>
          <div className="ac-topbar-sep"/>
          <span className="ac-topbar-title">Buchhaltung</span>
          <div className="ac-topbar-right">
            <div style={{display:"flex",background:"rgba(255,255,255,.04)",border:"1px solid var(--border)",borderRadius:7,overflow:"hidden"}}>
              {["einfach","doppelt"].map(m => (
                <button key={m}
                  onClick={() => { setAccountingMode(m); localStorage.setItem("nill_accounting_mode",m); setTab("overview"); }}
                  style={{
                    padding:"4px 11px",border:"none",cursor:"pointer",
                    fontFamily:"Inter,sans-serif",fontSize:".73rem",fontWeight:500,
                    background:accountingMode===m?"rgba(198,255,60,.15)":"transparent",
                    color:accountingMode===m?"var(--accent)":"var(--ink2)",
                    transition:"all .15s",
                  }}
                  title={m==="einfach"?"Einnahmen-Überschuss-Rechnung (§4 Abs.3 EStG)":"Doppelte Buchführung nach HGB (§238 HGB)"}
                >{m.charAt(0).toUpperCase()+m.slice(1)}</button>
              ))}
            </div>
            <a href="/gobd" target="_blank" rel="noopener" title="So ist NILL GoBD-konform — alle Details" style={{padding:"2px 8px",borderRadius:20,background:"rgba(198,255,60,.08)",border:"1px solid rgba(198,255,60,.18)",fontSize:".68rem",color:"var(--accent)",fontWeight:600,textDecoration:"none"}}>GoBD ✓</a>
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setShowOnboarding(true)}>Setup</button>
            <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={openUpload}>+ Beleg</button>
          </div>
        </header>

        {/* ── Sidebar ── */}
        <nav className="ac-sidebar" aria-label="Buchhaltungs-Navigation">
          {/* Übersicht — standalone */}
          <button
            className={`ac-nav-standalone${tab==="overview"?" active":""}`}
            onClick={()=>setTab("overview")}
            aria-current={tab==="overview"?"page":undefined}
          >
            <span aria-hidden="true" style={{fontSize:".8rem",opacity:tab==="overview"?1:.5}}>◧</span>
            Übersicht
          </button>

          {/* Groups */}
          {NAV_GROUPS.map(grp => {
            const visible = grp.items.filter(it => it.modes.includes(accountingMode));
            if (!visible.length) return null;
            return (
              <div key={grp.id} className="ac-nav-group">
                <span className="ac-nav-group-label">{grp.label}</span>
                {visible.map(it => (
                  <button
                    key={it.id}
                    className={`ac-nav-item${tab===it.id?" active":""}`}
                    onClick={()=>setTab(it.id)}
                    aria-current={tab===it.id?"page":undefined}
                  >
                    <span aria-hidden="true" className="ac-nav-item-dot"/>
                    {it.label}
                    {it.id==="rechnungen" && !localStorage.getItem("nill_first_invoice") && (
                      <span aria-hidden="true" style={{marginLeft:"auto",fontSize:"9px",background:"var(--accent)",color:"var(--surface)",borderRadius:20,padding:"1px 6px",fontWeight:700,flexShrink:0}}>Start</span>
                    )}
                  </button>
                ))}
              </div>
            );
          })}

          {/* Bottom: Hilfe */}
          <div className="ac-sidebar-bottom">
            <button
              className={`ac-nav-item${tab==="hilfe"?" active":""}`}
              onClick={()=>setTab("hilfe")}
              aria-current={tab==="hilfe"?"page":undefined}
            >
              <span aria-hidden="true" className="ac-nav-item-dot"/>
              Hilfe
            </button>
          </div>
        </nav>

        {/* ── Content ── */}
        <main id="ac-main-content" className="ac-content" aria-live="polite">
        <Suspense fallback={<div className="ac-loading"><span className="ac-spinner" aria-hidden="true"/>Wird geladen…</div>}>
          {renderedTab}
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

