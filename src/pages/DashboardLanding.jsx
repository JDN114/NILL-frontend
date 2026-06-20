// src/pages/DashboardLanding.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PageLayout from "../components/layout/PageLayout";
import Footer from "../components/Footer";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import WelcomeToNILLModal from "../components/WelcomeToNILLModal";
import GuidedTourModal from "../components/GuidedTourModal";

/* ─── Design Tokens (inline, kein Tailwind-Konflikt) ────────────── */
const S = `
  .nd-root { --bg:#040407; --bg2:#08080c; --ink:#efede7; --ink-dim:rgba(var(--ink-tint),.5); --ink-faint:rgba(var(--ink-tint),.12); --line:rgba(var(--ink-tint),.07); --glass:rgba(var(--tint),.035); --accent:#c6ff3c; --a2:#7a5cff; --a3:#ff4d8d; --a4:#38f5d0; --serif:"Fraunces",Georgia,serif; --sans:"Inter",system-ui,sans-serif; --mono:"JetBrains Mono",monospace; --r:14px; --r2:20px; }

  /* Welcome strip */
  .nd-welcome { position:relative; border-radius:var(--r2); border:1px solid var(--line); background:linear-gradient(135deg,rgba(122,92,255,.08),rgba(198,255,60,.04)); padding:32px 36px; margin-bottom:32px; overflow:hidden; }
  .nd-welcome::before { content:""; position:absolute; inset:-60%; background:radial-gradient(50% 40% at 30% 30%,rgba(122,92,255,.12),transparent 60%); pointer-events:none; }
  .nd-welcome-eyebrow { font-family:var(--mono); font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--ink-dim); display:flex; align-items:center; gap:8px; margin-bottom:12px; }
  .nd-welcome-eyebrow::before { content:""; width:16px; height:1px; background:currentColor; opacity:.5; }
  .nd-welcome h1 { font-family:var(--serif); font-weight:400; font-size:clamp(24px,3.5vw,40px); letter-spacing:-.025em; line-height:.95; color:var(--ink); margin:0 0 8px; }
  .nd-welcome h1 em { font-style:italic; color:var(--accent); }
  .nd-welcome-sub { font-size:14px; color:var(--ink-dim); margin:0; line-height:1.5; }

  /* Notification pills */
  .nd-notifs { margin-top:20px; display:flex; flex-direction:column; gap:8px; }
  .nd-notif { display:flex; align-items:flex-start; gap:10px; background:rgba(var(--tint),.03); border:1px solid var(--line); border-radius:10px; padding:10px 14px; font-size:13px; color:var(--ink-dim); }
  .nd-notif-nill { background:rgba(122,92,255,.07); border-color:rgba(122,92,255,.2); cursor:pointer; transition:background .2s,border-color .2s; }
  .nd-notif-nill:hover { background:rgba(122,92,255,.13); border-color:rgba(122,92,255,.35); }
  .nd-notif-label { font-family:var(--mono); font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:var(--a2); }
  .nd-notif-action { margin-left:auto; flex-shrink:0; font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; background:rgba(198,255,60,.1); border:1px solid rgba(198,255,60,.25); color:var(--accent); border-radius:99px; padding:3px 9px; white-space:nowrap; }

  /* Section label */
  .nd-section-label { font-family:var(--mono); font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--ink-dim); margin-bottom:16px; display:flex; align-items:center; gap:10px; }
  .nd-section-label::after { content:""; flex:1; height:1px; background:var(--line); }

  /* Grid */
  .nd-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px; }

  /* Base card */
  .nd-card { position:relative; border-radius:var(--r2); border:1px solid var(--line); background:var(--glass); padding:24px; display:flex; flex-direction:column; gap:14px; transition:border-color .25s,background .25s,transform .3s; cursor:pointer; text-decoration:none; overflow:hidden; }
  .nd-card:hover { border-color:var(--ink-faint); background:rgba(var(--tint),.05); transform:translateY(-2px); }
  .nd-card-icon { width:36px; height:36px; border-radius:10px; background:rgba(var(--tint),.05); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .nd-card-title { font-family:var(--serif); font-weight:400; font-size:20px; letter-spacing:-.02em; color:var(--ink); line-height:1; }
  .nd-card-desc { font-size:12px; color:var(--ink-dim); line-height:1.45; margin:0; }
  .nd-card-arrow { margin-top:auto; font-family:var(--mono); font-size:11px; color:var(--ink-dim); display:flex; align-items:center; gap:6px; transition:color .2s,gap .2s; }
  .nd-card:hover .nd-card-arrow { color:var(--ink); gap:10px; }

  /* NILL card */
  .nd-card-nill { border-color:rgba(122,92,255,.25); background:linear-gradient(135deg,rgba(122,92,255,.08),rgba(56,245,208,.04)); }
  .nd-card-nill:hover { border-color:rgba(122,92,255,.45); background:linear-gradient(135deg,rgba(122,92,255,.13),rgba(56,245,208,.07)); }
  .nd-card-nill .nd-card-icon { background:rgba(122,92,255,.15); border-color:rgba(122,92,255,.3); }
  .nd-card-nill .nd-card-arrow { color:rgba(122,92,255,.7); }
  .nd-card-nill:hover .nd-card-arrow { color:var(--a2); }
  .nd-nill-badge { font-family:var(--mono); font-size:10px; color:var(--a2); background:rgba(122,92,255,.12); border:1px solid rgba(122,92,255,.2); border-radius:99px; padding:2px 10px; letter-spacing:.1em; align-self:flex-start; }
  .nd-nill-modules { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
  .nd-nill-module { background:rgba(122,92,255,.08); border:1px solid rgba(122,92,255,.15); border-radius:8px; padding:8px 4px; text-align:center; }
  .nd-nill-module-icon { font-size:14px; }
  .nd-nill-module-label { font-family:var(--mono); font-size:9px; letter-spacing:.1em; color:rgba(122,92,255,.8); margin-top:3px; text-transform:uppercase; }
  .nd-action-dot { position:absolute; top:16px; right:16px; width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 8px rgba(198,255,60,.6); }

  /* Locked card */
  .nd-card-locked { opacity:.45; cursor:pointer; }
  .nd-card-locked:hover { opacity:.65; transform:none; }
  .nd-lock-icon { color:var(--ink-faint); }

  /* Coming soon card */
  .nd-card-soon { opacity:.55; cursor:default; pointer-events:none; }
  .nd-card-soon:hover { transform:none; }
  .nd-soon-badge { font-family:var(--mono); font-size:9px; color:var(--ink-dim); background:rgba(var(--tint),.06); border:1px solid var(--line); border-radius:99px; padding:2px 9px; letter-spacing:.12em; text-transform:uppercase; align-self:flex-start; }

  .nd-mode-toggle { display:inline-flex; align-items:center; gap:5px; margin-top:8px; padding:3px 3px 3px 10px; border-radius:99px; border:1px solid var(--line); background:rgba(var(--tint),.04); cursor:pointer; transition:border-color .2s,background .2s; user-select:none; }
  .nd-mode-toggle:hover { border-color:var(--ink-faint); background:rgba(var(--tint),.07); }
  .nd-mode-toggle-label { font-family:var(--mono); font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-dim); }
  .nd-mode-pill { font-family:var(--mono); font-size:9px; letter-spacing:.12em; text-transform:uppercase; border-radius:99px; padding:2px 9px; font-weight:600; transition:background .2s,color .2s; }
  .nd-mode-pill-doppelt { background:rgba(198,255,60,.15); color:var(--accent); }
  .nd-mode-pill-einfach { background:rgba(122,92,255,.15); color:var(--a2); }

  /* AI activation banner */
  .nd-ai-banner { border-radius:var(--r2); border:1px solid rgba(197,165,114,0.28); background:linear-gradient(135deg,rgba(197,165,114,0.07),rgba(197,165,114,0.03)); padding:20px 24px; margin-bottom:24px; display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
  .nd-ai-banner-icon { width:40px; height:40px; border-radius:12px; background:rgba(197,165,114,0.12); border:1px solid rgba(197,165,114,0.25); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .nd-ai-banner-body { flex:1; min-width:200px; }
  .nd-ai-banner-title { font-family:var(--sans); font-size:14px; font-weight:700; color:var(--ink); margin:0 0 4px; }
  .nd-ai-banner-desc { font-size:12px; color:var(--ink-dim); margin:0; line-height:1.5; }
  .nd-ai-banner-cta { font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; background:rgba(197,165,114,0.15); border:1px solid rgba(197,165,114,0.35); color:#c5a572; border-radius:99px; padding:7px 16px; white-space:nowrap; text-decoration:none; cursor:pointer; transition:background .2s,border-color .2s; flex-shrink:0; }
  .nd-ai-banner-cta:hover { background:rgba(197,165,114,0.25); border-color:rgba(197,165,114,0.55); }
  .nd-ai-banner-tag { font-family:var(--mono); font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:rgba(197,165,114,0.6); background:rgba(197,165,114,0.08); border:1px solid rgba(197,165,114,0.18); border-radius:99px; padding:2px 8px; display:inline-block; margin-bottom:6px; }

  /* ── Activity Feed ──────────────────────────────────────────── */
  .nd-bell-btn { position:absolute; top:18px; right:18px; width:34px; height:34px; border-radius:50%; background:rgba(var(--tint),.05); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; color:var(--ink-dim); }
  .nd-bell-btn:hover { background:rgba(var(--tint),.09); border-color:var(--ink-faint); color:var(--ink); }
  .nd-bell-badge { position:absolute; top:-5px; right:-5px; min-width:17px; height:17px; background:var(--a3); border-radius:99px; font-family:var(--mono); font-size:9px; font-weight:700; color:#fff; display:flex; align-items:center; justify-content:center; padding:0 4px; border:2px solid var(--bg); animation:nd-badge-pop .25s cubic-bezier(.34,1.56,.64,1); }
  @keyframes nd-badge-pop { from { transform:scale(0); } to { transform:scale(1); } }

  .nd-feed-backdrop { position:fixed; inset:0; z-index:200; background:rgba(4,4,7,.55); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); }
  .nd-feed-panel { position:fixed; top:0; right:0; bottom:0; width:380px; max-width:100vw; z-index:201; background:var(--bg2); border-left:1px solid var(--line); display:flex; flex-direction:column; animation:ndSlideIn .22s cubic-bezier(.2,.8,.4,1); }
  @keyframes ndSlideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }

  .nd-feed-hdr { display:flex; align-items:center; gap:8px; padding:18px 18px 14px; border-bottom:1px solid var(--line); flex-shrink:0; }
  .nd-feed-hdr-title { font-family:var(--serif); font-size:17px; font-weight:600; color:var(--ink); flex:1; }
  .nd-feed-read-btn { font-family:var(--mono); font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-dim); cursor:pointer; padding:4px 9px; border-radius:6px; background:rgba(var(--tint),.04); border:1px solid var(--line); transition:all .15s; white-space:nowrap; }
  .nd-feed-read-btn:hover { color:var(--accent); border-color:rgba(198,255,60,.3); }
  .nd-feed-close { width:28px; height:28px; border-radius:8px; background:rgba(var(--tint),.05); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--ink-dim); font-size:11px; flex-shrink:0; transition:all .15s; }
  .nd-feed-close:hover { background:rgba(var(--tint),.1); color:var(--ink); }

  .nd-feed-body { flex:1; overflow-y:auto; scrollbar-width:none; }
  .nd-feed-body::-webkit-scrollbar { display:none; }
  .nd-feed-group { font-family:var(--mono); font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:var(--ink-dim); padding:14px 18px 6px; }
  .nd-feed-item { display:flex; gap:11px; padding:11px 18px; cursor:pointer; transition:background .12s; border-bottom:1px solid rgba(var(--ink-tint),.035); text-decoration:none; }
  .nd-feed-item:hover { background:rgba(var(--tint),.025); }
  .nd-feed-item.nd-unread { background:rgba(var(--tint),.018); }
  .nd-feed-item-dot { width:5px; height:5px; border-radius:50%; background:var(--accent); flex-shrink:0; margin-top:5px; transition:opacity .2s; }
  .nd-feed-item:not(.nd-unread) .nd-feed-item-dot { opacity:0; }
  .nd-feed-item-icon { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; }
  .nd-feed-item-body { flex:1; min-width:0; }
  .nd-feed-item-title { font-size:12.5px; color:var(--ink); line-height:1.35; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .nd-feed-item.nd-unread .nd-feed-item-title { font-weight:500; }
  .nd-feed-item-desc { font-size:11px; color:var(--ink-dim); line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .nd-feed-item-time { font-family:var(--mono); font-size:10px; color:var(--ink-dim); flex-shrink:0; padding-top:1px; }
  .nd-feed-empty { padding:48px 20px; text-align:center; color:var(--ink-dim); font-size:13px; }

  @media(max-width:768px) {
    /* On phones the whole page scrolls naturally with the document (see
       PageLayout .nill-shell-noscroll). The root is a normal block in that
       flow — no nested scroll container, no body lock — so it feels native
       and nothing gets clipped behind the bottom tab bar. */
    .nd-root { padding-bottom:env(safe-area-inset-bottom,0); }

    .nd-welcome { padding:14px 16px; margin-bottom:10px; }
    .nd-welcome h1 { font-size:clamp(18px,5vw,26px); margin-bottom:2px; }
    .nd-welcome-sub { font-size:11.5px; }
    .nd-welcome-eyebrow { font-size:9px; margin-bottom:6px; }
    .nd-bell-btn { width:30px; height:30px; top:14px; right:14px; }

    /* Module grid becomes a compact icon-tile grid (Google-style app
       launcher) — title only, no description/arrow — so all modules fit
       on one screen without scrolling. */
    .nd-section-label { font-size:9px; margin-bottom:8px; }
    .nd-grid { grid-template-columns:repeat(2,1fr); gap:8px; }
    .nd-card { padding:12px; gap:4px; flex-direction:row; align-items:center; }
    .nd-card-icon { width:30px; height:30px; font-size:13px; border-radius:8px; margin-bottom:0; }
    .nd-card > div:nth-child(2) { flex:1; min-width:0; }
    .nd-card-title { font-size:13.5px; line-height:1.2; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .nd-card-desc { display:none; }
    .nd-card-arrow { display:none; }
    .nd-soon-badge { font-size:8px; padding:1px 6px; }
    .nd-mode-toggle { margin-top:4px; padding:2px 2px 2px 7px; }
    .nd-mode-toggle-label { display:none; }

    .nd-ai-banner { padding:12px; gap:8px; margin-bottom:10px; }
    .nd-ai-banner-icon { width:30px; height:30px; font-size:13px; border-radius:8px; }
    .nd-ai-banner-title { font-size:12.5px; }
    .nd-ai-banner-desc { font-size:10.5px; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .nd-ai-banner-cta { font-size:10px; padding:6px 12px; }

    .nd-nill-modules { gap:4px; }
    .nd-nill-module { padding:6px 3px; }
    .nd-nill-module-icon { font-size:12px; }
    .nd-nill-module-label { font-size:8px; }
    .nd-notif { padding:7px 10px; font-size:11.5px; }
    .nd-feed-panel { width:100vw; }

    /* Footer stays attached at the bottom, compacted so it never forces
       the page (or .nd-root) into scroll territory on small screens. */
    footer { flex-shrink:0; }
    footer > div { padding:8px 0 !important; gap:4px 10px !important; }
    footer a, footer button { font-size:9px !important; letter-spacing:.08em !important; }
  }
  @media(max-width:420px) {
    .nd-welcome { padding:12px 14px; margin-bottom:8px; }
    .nd-card { padding:10px; }
    .nd-grid { gap:6px; }
    .nd-nill-modules { grid-template-columns:repeat(3,1fr); }
  }

  /* ── Light-mode overrides ──────────────────────────────────────────
     Flip all hardcoded dark tokens so the page reads on bone white.  */
  html[data-theme="light"] .nd-root {
    --ink:       #201d15;
    --ink-dim:   rgba(var(--ink-tint), .55);
    --ink-faint: rgba(var(--ink-tint), .22);
    --line:      rgba(var(--ink-tint), .14);
    --glass:     rgba(var(--tint), .05);
    --accent:    #806228;
    --a2:        #1f5fe0;
    --a3:        #be3c28;
    --bg:        #eae3d4;
    --bg2:       #ddd6c6;
  }

  /* Welcome banner — warm gold glow instead of neon-purple */
  html[data-theme="light"] .nd-welcome {
    background: linear-gradient(135deg, rgba(128,98,40,.1), rgba(128,98,40,.04));
  }
  html[data-theme="light"] .nd-welcome::before {
    background: radial-gradient(50% 40% at 30% 30%, rgba(128,98,40,.12), transparent 60%);
  }

  /* NILL card — blue accent fits bone white better than purple */
  html[data-theme="light"] .nd-card-nill {
    border-color: rgba(31,95,224,.2);
    background: linear-gradient(135deg, rgba(31,95,224,.07), rgba(31,95,224,.03));
  }
  html[data-theme="light"] .nd-card-nill:hover {
    border-color: rgba(31,95,224,.35);
    background: linear-gradient(135deg, rgba(31,95,224,.11), rgba(31,95,224,.06));
  }
  html[data-theme="light"] .nd-card-nill .nd-card-icon {
    background: rgba(31,95,224,.1); border-color: rgba(31,95,224,.2);
  }
  html[data-theme="light"] .nd-nill-badge {
    background: rgba(31,95,224,.1); border-color: rgba(31,95,224,.2);
  }
  html[data-theme="light"] .nd-nill-module {
    background: rgba(31,95,224,.07); border-color: rgba(31,95,224,.13);
  }
  html[data-theme="light"] .nd-nill-module-label { color: rgba(31,95,224,.8); }
  html[data-theme="light"] .nd-notif-nill {
    background: rgba(31,95,224,.06); border-color: rgba(31,95,224,.18);
  }
  html[data-theme="light"] .nd-notif-nill:hover {
    background: rgba(31,95,224,.11); border-color: rgba(31,95,224,.3);
  }

  /* Mode pills */
  html[data-theme="light"] .nd-mode-pill-doppelt { background: rgba(128,98,40,.15); }
  html[data-theme="light"] .nd-mode-pill-einfach { background: rgba(31,95,224,.12); }

  /* Action dot — gold glow, no neon */
  html[data-theme="light"] .nd-action-dot { box-shadow: 0 0 8px rgba(128,98,40,.5); }

  /* Feed read-btn hover */
  html[data-theme="light"] .nd-feed-read-btn:hover {
    color: var(--accent); border-color: rgba(128,98,40,.3);
  }

  /* Activity feed slide-over */
  html[data-theme="light"] .nd-feed-panel { background: var(--bg2); }
  html[data-theme="light"] .nd-feed-backdrop { background: rgba(30,24,14,.3); }

  /* AI banner CTA — gold readable on bone white */
  html[data-theme="light"] .nd-ai-banner-cta { color: #6b5120; }
`;

const ICONS = {
  nill:          "◈",
  emails:        "✉",
  accounting:    "◎",
  calendar:      "▦",
  team:          "⌘",
  arbeitsstation:"▤",
  settings:      "◉",
  ausweis:       "▣",
};

const CAT = {
  rechnung: { bg:"rgba(198,255,60,.1)",  color:"#c6ff3c", icon:"◎", label:"Rechnung" },
  buchung:  { bg:"rgba(122,92,255,.12)", color:"#a585ff", icon:"⊕", label:"Buchung"  },
  steuer:   { bg:"rgba(255,179,71,.1)",  color:"#ffb347", icon:"◈", label:"Steuer"   },
  export:   { bg:"rgba(255,179,71,.1)",  color:"#ffb347", icon:"⊠", label:"Export"   },
  team:     { bg:"rgba(56,245,208,.1)",  color:"#38f5d0", icon:"⬡", label:"Team"     },
  update:   { bg:"rgba(197,165,114,.1)", color:"#c5a572", icon:"◧", label:"Update"   },
  email:    { bg:"rgba(198,255,60,.08)", color:"#c6ff3c", icon:"✉", label:"E-Mail"   },
  system:   { bg:"rgba(122,92,255,.08)", color:"#7a5cff", icon:"◈", label:"System"   },
};

const NILL_UPDATES = [
  { id:"u-260608", cat:"update", title:"NILL v2.4 — Buchhaltung Sidebar",
    desc:"Neue Sidebar-Navigation mit gruppierten Bereichen, 20 neue Statistik-Widgets (Kundentaktivität, Prognose, Stornoquote, Jahr-über-Jahr, …)",
    ts:"2026-06-08T10:00:00Z", link:"/changelog" },
  { id:"u-260607", cat:"update", title:"NILL v2.3 — Push-Benachrichtigungen",
    desc:"Native Push-Notifications für neue E-Mails — auch wenn die App im Hintergrund läuft (PWA & Safari).",
    ts:"2026-06-07T09:00:00Z", link:"/changelog" },
  { id:"u-260604", cat:"update", title:"NILL v2.2 — Mobile PWA",
    desc:"Bottom Tab Bar, Safe-Area Support für iPhone-Notch, mobiles Buchhaltungs-Layout überarbeitet.",
    ts:"2026-06-04T08:00:00Z", link:"/changelog" },
  { id:"u-260523", cat:"update", title:"NILL v2.1 — Sicherheits-Patch",
    desc:"4 kritische Sicherheitslücken geschlossen (Session-Token, CORS, Content-Security-Policy, Rate-Limiting).",
    ts:"2026-05-23T08:00:00Z", link:"/changelog" },
];

function fmtFeedTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffH  = diffMs / 3600000;
  const diffD  = diffMs / 86400000;
  if (diffH < 1)  return `vor ${Math.max(1, Math.round(diffH*60))} Min.`;
  if (diffH < 24) return `vor ${Math.round(diffH)} Std.`;
  if (diffD < 2)  return "Gestern";
  if (diffD < 7)  return `vor ${Math.round(diffD)} Tagen`;
  return d.toLocaleDateString("de-DE", { day:"2-digit", month:"short" });
}

function groupByDay(items) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now()-86400000).toDateString();
  const groups = {};
  for (const item of items) {
    const d = new Date(item.ts);
    const ds = d.toDateString();
    const label = ds===today ? "Heute" : ds===yesterday ? "Gestern" : d.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"});
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }
  return Object.entries(groups);
}

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}


export default function DashboardLanding() {
  const [showWelcome, setShowWelcome]       = useState(false);
  const [showTour, setShowTour]             = useState(false);
  const [userName, setUserName]             = useState(null);
  const [notifications, setNotifications]   = useState([]);
  const [aiConsentDone, setAiConsentDone]   = useState(null);
  const [accountingMode, setAccountingMode] = useState(
    () => localStorage.getItem("nill_accounting_mode") || "doppelt"
  );
  const [feedOpen,   setFeedOpen]   = useState(false);
  const [feedItems,  setFeedItems]  = useState([]);
  const [lastSeen,   setLastSeen]   = useState(
    () => localStorage.getItem("nill_feed_seen") || "1970-01-01T00:00:00Z"
  );
  const { hasFeature, hasModule, isCompanyAdmin, org } = useAuth();

  const toggleAccountingMode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = accountingMode === "doppelt" ? "einfach" : "doppelt";
    localStorage.setItem("nill_accounting_mode", next);
    setAccountingMode(next);
  };

  // Lock the background only while the activity feed slide-over is open, so the
  // page behind it can't scroll under the panel. The dashboard itself scrolls
  // naturally (no global body lock — that caused the non-native rubber-band).
  useEffect(() => {
    if (!feedOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [feedOpen]);

  useEffect(() => {
    api.get("/me/profile").then(r => setUserName(r.data.name || null)).catch(() => {});
    api.get("/me/onboarding-status").then(r => {
      if (r.data.is_subscription_active && !r.data.has_seen_onboarding) setShowWelcome(true);
      setAiConsentDone(r.data.ai_email_processing_consent === true);
    }).catch(() => { setAiConsentDone(true); });
    api.get("/me/notifications").then(r => setNotifications(r.data || [])).catch(() => {});

    // Build activity feed
    const items = NILL_UPDATES.map(u => ({ ...u }));
    const addItems = (newItems) => setFeedItems(prev => {
      const merged = [...prev, ...newItems].sort((a,b) => new Date(b.ts)-new Date(a.ts));
      const seen = new Set(); return merged.filter(i => !seen.has(i.id) && seen.add(i.id));
    });
    setFeedItems([...items]);

    Promise.allSettled([
      api.get("/api/v1/aktivitaeten").then(r => {
        const evts = (r.data||[]).slice(0,30).map(e => ({
          id: `act-${e.id||e.ts}`,
          cat: e.kategorie || e.typ || "system",
          title: e.titel || e.nachricht || "Aktivität",
          desc: e.beschreibung || null,
          ts: e.erstellt_am || e.ts || new Date().toISOString(),
          link: e.link || null,
        }));
        if (evts.length) addItems(evts);
      }),
      api.get("/api/v1/rechnungen", { params:{ limit:8 } }).then(r => {
        const evts = (r.data||[]).map(re => ({
          id: `rec-${re.id}`,
          cat: "rechnung",
          title: `Rechnung ${re.nummer||re.id||""} — ${re.partner_name||re.partner||re.empfaenger_name||"Kunde"}`,
          desc: `${Number(re.betrag_netto||re.betrag_brutto||0).toLocaleString("de-DE",{minimumFractionDigits:2})} €`,
          ts: re.datum || re.erstellt_am || new Date().toISOString(),
          link: "/dashboard/accounting",
        }));
        if (evts.length) addItems(evts);
      }),
      api.get("/api/v1/buchhaltung/buchungen", { params:{ limit:6 } }).then(r => {
        const evts = (r.data||[]).map(b => ({
          id: `bch-${b.id}`,
          cat: "buchung",
          title: b.buchungstext || "Buchung",
          desc: `${Number(b.betrag||0).toLocaleString("de-DE",{minimumFractionDigits:2})} €`,
          ts: b.buchungsdatum || b.erstellt_am || new Date().toISOString(),
          link: "/dashboard/accounting",
        }));
        if (evts.length) addItems(evts);
      }),
      api.get("/api/v1/steuerexport").then(r => {
        const evts = (r.data||[]).slice(0,4).map(e => ({
          id: `tax-${e.id}`,
          cat: "export",
          title: `Steuerexport erstellt — ${e.typ||"UStVA"} ${e.zeitraum||""}`,
          desc: e.erstellt_von ? `von ${e.erstellt_von}` : null,
          ts: e.erstellt_am || new Date().toISOString(),
          link: "/dashboard/accounting",
        }));
        if (evts.length) addItems(evts);
      }),
      api.get("/api/v1/mitarbeiter").then(r => {
        const evts = (r.data||[]).filter(m => m.beigetreten_am).slice(0,5).map(m => ({
          id: `emp-${m.id}`,
          cat: "team",
          title: `${m.name||"Mitarbeiter"} beigetreten`,
          desc: m.rolle || m.abteilung || null,
          ts: m.beigetreten_am,
          link: "/dashboard/workflow",
        }));
        if (evts.length) addItems(evts);
      }),
      // Inventory changes — who changed what (by name), and when.
      api.get("/inventory/activity", { params: { limit: 20 } }).then(r => {
        const ACTION_LABELS = {
          "inventory.item.create": "Artikel angelegt",
          "inventory.item.update": "Artikel geändert",
          "inventory.item.delete": "Artikel gelöscht",
          "inventory.item.quantity": "Bestand aktualisiert",
          "inventory.list.create": "Liste angelegt",
          "inventory.list.update": "Liste geändert",
          "inventory.list.delete": "Liste gelöscht",
          "inventory.delivery_note.confirm": "Lieferschein bestätigt",
          "inventory.entry.create": "Eintrag hinzugefügt",
          "inventory.entry.delete": "Eintrag gelöscht",
        };
        const evts = (r.data?.items || []).map(e => {
          const what = e.details?.name ? ` — ${e.details.name}` : "";
          return {
            id: `inv-${e.id}`,
            cat: "inventur",
            title: `${ACTION_LABELS[e.action] || "Inventur-Änderung"}${what}`,
            desc: e.actor_name ? `von ${e.actor_name}` : null,
            ts: e.created_at || new Date().toISOString(),
            link: "/dashboard/workflow/Delivery-notes",
          };
        });
        if (evts.length) addItems(evts);
      }),
      // Completed tasks — who finished them, and when.
      api.get("/workflow/tasks", { params: { status: "completed", limit: 15 } }).then(r => {
        const evts = (r.data?.items || []).filter(t => t.completed_at).map(t => ({
          id: `task-${t.id}`,
          cat: "task",
          title: `Aufgabe erledigt — ${t.title}`,
          desc: t.completed_by_name ? `von ${t.completed_by_name}` : null,
          ts: t.completed_at,
          link: "/dashboard/workflow/tasks",
        }));
        if (evts.length) addItems(evts);
      }),
    ]);
  }, []);

  const handleWelcomeClose = async () => {
    setShowWelcome(false);
    setTimeout(() => setShowTour(true), 400);
    api.post("/me/onboarding-complete").catch(() => {});
  };

  // Simplified landing: only modules the org actually has are shown — nothing
  // locked is rendered. The Arbeitsstation tile always shows (kiosk activation).
  const cards = [
    { key: "emails",        title: "E-Mails",       desc: "Postfach, Filter & Kategorien",          link: "/dashboard/emails",   feature: "email",      module: "emails"     },
    { key: "team",          title: "Team",          desc: "Aufgaben, Prozesse & Rollen",            link: "/dashboard/workflow", feature: null,         module: null         },
    { key: "arbeitsstation",title: "Arbeitsstation",desc: "Zeiterfassung, Aufgaben & Lieferscheine",link: "/station",            feature: null,         module: null,        isStation: true },
    { key: "ausweis",       title: "Mein Ausweis",  desc: "QR-Code zum Ein-/Ausstempeln",           link: "/ausweis",            feature: null,         module: null         },
    { key: "accounting",    title: "Buchhaltung",   desc: "Rechnungen, Einnahmen & Ausgaben",       link: "/dashboard/accounting", feature: "accounting", module: "accounting" },
    { key: "calendar",      title: "Kalender",      desc: "Termine, Planung & Events",              link: "/dashboard/calendar", feature: "calendar",   module: "calendar"   },
    { key: "settings",      title: "Einstellungen", desc: "Account & Verbindungen",                 link: "/dashboard/settings", feature: null,         module: null,        adminOnly: true },
  ]
    .filter(c => !c.adminOnly || isCompanyAdmin())
    // Hide anything the org can't access — no locked/greyed cards in the UI.
    .filter(c => (!c.module || hasModule(c.module)) && (!c.feature || hasFeature(c.feature)));

  const unreadCount = feedItems.filter(i => new Date(i.ts) > new Date(lastSeen)).length;

  const openFeed = () => setFeedOpen(true);
  const markAllRead = () => {
    const now = new Date().toISOString();
    setLastSeen(now);
    localStorage.setItem("nill_feed_seen", now);
  };

  const greeting    = org?.name ?? userName ?? null;
  const hour        = new Date().getHours();
  const timeOfDay   = hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";

  return (
    <>
      <style>{S}</style>
      <WelcomeToNILLModal isOpen={showWelcome} onClose={handleWelcomeClose} />
      <GuidedTourModal isOpen={showTour} onFinish={() => setShowTour(false)} />

      {feedOpen && (
        <>
          <div className="nd-feed-backdrop" onClick={() => setFeedOpen(false)}/>
          <div className="nd-feed-panel" role="dialog" aria-label="Aktivitäten">
            <div className="nd-feed-hdr">
              <div className="nd-feed-hdr-title">Aktivitäten</div>
              {unreadCount > 0 && (
                <button className="nd-feed-read-btn" onClick={markAllRead}>Alle gelesen</button>
              )}
              <button className="nd-feed-close" onClick={() => setFeedOpen(false)} aria-label="Schließen">✕</button>
            </div>
            <div className="nd-feed-body">
              {feedItems.length === 0 ? (
                <div className="nd-feed-empty">Noch keine Aktivitäten</div>
              ) : groupByDay(feedItems).map(([day, items]) => (
                <div key={day}>
                  <div className="nd-feed-group">{day}</div>
                  {items.map(item => {
                    const style = CAT[item.cat] || CAT.system;
                    const isUnread = new Date(item.ts) > new Date(lastSeen);
                    const Inner = (
                      <>
                        <span className="nd-feed-item-dot"/>
                        <div className="nd-feed-item-icon" style={{background:style.bg}}>
                          <span style={{color:style.color}}>{style.icon}</span>
                        </div>
                        <div className="nd-feed-item-body">
                          <div className="nd-feed-item-title">{item.title}</div>
                          {item.desc && <div className="nd-feed-item-desc">{item.desc}</div>}
                        </div>
                        <div className="nd-feed-item-time">{fmtFeedTime(item.ts)}</div>
                      </>
                    );
                    return item.link ? (
                      <a key={item.id} href={item.link}
                        className={`nd-feed-item${isUnread?" nd-unread":""}`}
                        onClick={() => setFeedOpen(false)}
                      >{Inner}</a>
                    ) : (
                      <div key={item.id} className={`nd-feed-item${isUnread?" nd-unread":""}`}>{Inner}</div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <PageLayout noScroll footer={<Footer />}>
        <div className="nd-root">

          {/* ── Welcome ── */}
          <motion.div
            className="nd-welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
          >
            <button className="nd-bell-btn" onClick={openFeed} aria-label="Aktivitäten & Mitteilungen">
              <BellIcon />
              {unreadCount > 0 && (
                <span className="nd-bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </button>

            <div className="nd-welcome-eyebrow">Dashboard</div>
            <h1>
              {greeting
                ? <>{timeOfDay}, <em>{greeting}.</em></>
                : <>{timeOfDay}<em>.</em></>
              }
            </h1>
            <p className="nd-welcome-sub">Alles im grünen Bereich — keine offenen Aufgaben.</p>

            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="nd-notifs">
                {notifications.slice(0, 2).map((n, i) => (
                  <div key={i} className="nd-notif">{n.message}</div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── KI-Aktivierungs-Banner ── */}
          {aiConsentDone === false && isCompanyAdmin() && (
            <motion.div
              className="nd-ai-banner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .45 }}
            >
              <div className="nd-ai-banner-icon">◈</div>
              <div className="nd-ai-banner-body">
                <div className="nd-ai-banner-tag">EU AI Act · Deine Zustimmung erforderlich</div>
                <div className="nd-ai-banner-title">KI E-Mail-Analyse noch nicht aktiviert</div>
                <p className="nd-ai-banner-desc">
                  NILL kann eingehende E-Mails automatisch zusammenfassen, priorisieren und kategorisieren —
                  aber nur mit deiner ausdrücklichen Zustimmung. Aktiviere die Funktion in den Einstellungen.
                </p>
              </div>
              <Link to="/dashboard/settings?tab=integrationen" className="nd-ai-banner-cta">
                Jetzt aktivieren →
              </Link>
            </motion.div>
          )}

          {/* ── Module ── */}
          <div className="nd-section-label">Module</div>

          <div className="nd-grid">
            {cards.map((card, idx) => {
              if (card.isStation) {
                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * .05 }}
                  >
                    <Link to={card.link} className="nd-card" style={{ display: "flex" }}>
                      <div className="nd-card-icon">{ICONS[card.key] || "▤"}</div>
                      <div>
                        <div className="nd-card-title">{card.title}</div>
                        <span className="nd-soon-badge" style={{ background: "rgba(198,255,60,.1)", borderColor: "rgba(198,255,60,.25)", color: "var(--accent)" }}>Tablet & Kiosk</span>
                        <p className="nd-card-desc" style={{ marginTop: 6 }}>{card.desc}</p>
                      </div>
                      <div className="nd-card-arrow">Station öffnen <span>→</span></div>
                    </Link>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * .05 }}
                >
                  <Link to={card.link} className="nd-card" style={{ display: "flex" }}>
                    <div className="nd-card-icon">{ICONS[card.key] || "◎"}</div>
                    <div>
                      <div className="nd-card-title">{card.title}</div>
                      <p className="nd-card-desc">{card.desc}</p>
                      {card.key === "accounting" && (
                        <span className="nd-mode-toggle" onClick={toggleAccountingMode} title="Buchhaltungsart umschalten">
                          <span className="nd-mode-toggle-label">Modus</span>
                          <span className={`nd-mode-pill nd-mode-pill-${accountingMode}`}>
                            {accountingMode === "doppelt" ? "Doppelt" : "Einfach"}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="nd-card-arrow">Öffnen <span>→</span></div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

        </div>
      </PageLayout>
    </>
  );
}
