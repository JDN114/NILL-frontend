import{a as s,j as e}from"./vendor-react--hPKs4bs.js";import{L as S}from"./vendor-router-DAf3mJ4C.js";import{P as V}from"./PageLayout-BF85_oo0.js";import{u as q,a as m,F as X}from"./index-mog6Kxy3.js";import{A as P,m as f}from"./vendor-motion-DyRgipUS.js";import"./vendor-misc-Mfy8f7jx.js";function Q({isOpen:g,onClose:d}){return s.useEffect(()=>{g?document.body.style.overflow="hidden":document.body.style.overflow="auto"},[g]),e.jsx(P,{children:g&&e.jsxs(e.Fragment,{children:[e.jsx(f.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.4},className:"fixed inset-0 z-50 bg-black/60 backdrop-blur-xl"}),e.jsx(f.div,{initial:{opacity:0,scale:.95,y:30},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.96,y:20},transition:{duration:.5,ease:"easeOut"},className:"fixed inset-0 z-50 flex items-center justify-center p-6",children:e.jsxs("div",{className:"relative w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 backdrop-blur-2xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]",children:[e.jsx("div",{className:"absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"}),e.jsxs("div",{className:"relative text-center",children:[e.jsx("h1",{className:"text-4xl font-semibold tracking-tight text-white",children:"Willkommen bei NILL"}),e.jsx("p",{className:"mt-6 text-lg leading-relaxed text-zinc-300",children:"Danke für dein Vertrauen. Dein intelligenter Workspace ist jetzt aktiviert."}),e.jsxs("div",{className:"mt-10 space-y-6 text-zinc-400 text-base leading-relaxed max-w-xl mx-auto",children:[e.jsx("p",{children:"NILL analysiert, priorisiert und strukturiert deine digitale Kommunikation – damit du dich auf das Wesentliche konzentrieren kannst."}),e.jsx("p",{children:"Automatisierte Workflows reduzieren Reibung, sparen Zeit und schaffen Klarheit in komplexen Prozessen."}),e.jsx("p",{children:"Digital-first bedeutet für uns auch Nachhaltigkeit: weniger Papier, weniger unnötige Prozesse, weniger Ressourcenverbrauch."})]}),e.jsx("div",{className:"mt-12",children:e.jsxs("button",{onClick:d,className:"group relative rounded-full bg-white px-8 py-3 text-black font-medium transition-all duration-300 hover:scale-[1.02]",children:[e.jsx("span",{className:"relative z-10",children:"Workspace öffnen"}),e.jsx("div",{className:"absolute inset-0 rounded-full bg-white opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"})]})}),e.jsx("p",{className:"mt-6 text-xs text-zinc-500",children:"Dein Plan ist jederzeit kündbar. Keine versteckten Kosten."})]})]})})]})})}const y=[{title:"Intelligente Priorisierung",description:"NILL analysiert eingehende Inhalte automatisch und hebt relevante Informationen hervor – damit du dich auf das Wesentliche konzentrierst."},{title:"Automatisierte Workflows",description:"Wiederkehrende Prozesse laufen im Hintergrund. Aufgaben werden strukturiert, verteilt und effizient abgewickelt."},{title:"Nachhaltig digital",description:"Durch digitale Prozesse reduzierst du Papier, unnötige Kommunikation und Ressourcenverbrauch – messbar und langfristig."}];function Y({isOpen:g,onFinish:d}){const[u,l]=s.useState(0);if(!g)return null;const c=u===y.length-1;return e.jsx(P,{children:e.jsx(f.div,{className:"fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-6",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(f.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.4},className:"relative w-full max-w-xl rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 backdrop-blur-2xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]",children:[e.jsxs("div",{className:"mb-6 text-xs text-zinc-500",children:[u+1," / ",y.length]}),e.jsx("h2",{className:"text-3xl font-semibold text-white tracking-tight",children:y[u].title}),e.jsx("p",{className:"mt-6 text-zinc-300 leading-relaxed",children:y[u].description}),e.jsxs("div",{className:"mt-10 flex justify-between items-center",children:[e.jsx("button",{onClick:d,className:"text-sm text-zinc-500 hover:text-white transition",children:"Tour überspringen"}),e.jsx("button",{onClick:()=>c?d():l(x=>x+1),className:"rounded-full bg-white px-6 py-2 text-black font-medium transition hover:scale-[1.03]",children:c?"Starten":"Weiter"})]})]},u)})})}const ee=`
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .nd-root { --bg:#040407; --bg2:#08080c; --ink:#efede7; --ink-dim:rgba(239,237,231,.5); --ink-faint:rgba(239,237,231,.12); --line:rgba(239,237,231,.07); --glass:rgba(255,255,255,.035); --accent:#c6ff3c; --a2:#7a5cff; --a3:#ff4d8d; --a4:#38f5d0; --serif:"Fraunces",Georgia,serif; --sans:"Inter",system-ui,sans-serif; --mono:"JetBrains Mono",monospace; --r:14px; --r2:20px; }

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
  .nd-notif { display:flex; align-items:flex-start; gap:10px; background:rgba(255,255,255,.03); border:1px solid var(--line); border-radius:10px; padding:10px 14px; font-size:13px; color:var(--ink-dim); }
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
  .nd-card:hover { border-color:var(--ink-faint); background:rgba(255,255,255,.05); transform:translateY(-2px); }
  .nd-card-icon { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.05); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
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
  .nd-soon-badge { font-family:var(--mono); font-size:9px; color:var(--ink-dim); background:rgba(255,255,255,.06); border:1px solid var(--line); border-radius:99px; padding:2px 9px; letter-spacing:.12em; text-transform:uppercase; align-self:flex-start; }

  .nd-mode-toggle { display:inline-flex; align-items:center; gap:5px; margin-top:8px; padding:3px 3px 3px 10px; border-radius:99px; border:1px solid var(--line); background:rgba(255,255,255,.04); cursor:pointer; transition:border-color .2s,background .2s; user-select:none; }
  .nd-mode-toggle:hover { border-color:var(--ink-faint); background:rgba(255,255,255,.07); }
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
  .nd-bell-btn { position:absolute; top:18px; right:18px; width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,.05); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; color:var(--ink-dim); }
  .nd-bell-btn:hover { background:rgba(255,255,255,.09); border-color:var(--ink-faint); color:var(--ink); }
  .nd-bell-badge { position:absolute; top:-5px; right:-5px; min-width:17px; height:17px; background:var(--a3); border-radius:99px; font-family:var(--mono); font-size:9px; font-weight:700; color:#fff; display:flex; align-items:center; justify-content:center; padding:0 4px; border:2px solid var(--bg); animation:nd-badge-pop .25s cubic-bezier(.34,1.56,.64,1); }
  @keyframes nd-badge-pop { from { transform:scale(0); } to { transform:scale(1); } }

  .nd-feed-backdrop { position:fixed; inset:0; z-index:200; background:rgba(4,4,7,.55); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); }
  .nd-feed-panel { position:fixed; top:0; right:0; bottom:0; width:380px; max-width:100vw; z-index:201; background:var(--bg2); border-left:1px solid var(--line); display:flex; flex-direction:column; animation:ndSlideIn .22s cubic-bezier(.2,.8,.4,1); }
  @keyframes ndSlideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }

  .nd-feed-hdr { display:flex; align-items:center; gap:8px; padding:18px 18px 14px; border-bottom:1px solid var(--line); flex-shrink:0; }
  .nd-feed-hdr-title { font-family:var(--serif); font-size:17px; font-weight:600; color:var(--ink); flex:1; }
  .nd-feed-read-btn { font-family:var(--mono); font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-dim); cursor:pointer; padding:4px 9px; border-radius:6px; background:rgba(255,255,255,.04); border:1px solid var(--line); transition:all .15s; white-space:nowrap; }
  .nd-feed-read-btn:hover { color:var(--accent); border-color:rgba(198,255,60,.3); }
  .nd-feed-close { width:28px; height:28px; border-radius:8px; background:rgba(255,255,255,.05); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--ink-dim); font-size:11px; flex-shrink:0; transition:all .15s; }
  .nd-feed-close:hover { background:rgba(255,255,255,.1); color:var(--ink); }

  .nd-feed-body { flex:1; overflow-y:auto; scrollbar-width:none; }
  .nd-feed-body::-webkit-scrollbar { display:none; }
  .nd-feed-group { font-family:var(--mono); font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:var(--ink-dim); padding:14px 18px 6px; }
  .nd-feed-item { display:flex; gap:11px; padding:11px 18px; cursor:pointer; transition:background .12s; border-bottom:1px solid rgba(239,237,231,.035); text-decoration:none; }
  .nd-feed-item:hover { background:rgba(255,255,255,.025); }
  .nd-feed-item.nd-unread { background:rgba(255,255,255,.018); }
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
    /* Safety net only — the tile grid below is sized to fit one screen, so
       this should rarely engage. Keeps the page from ever leaking into a
       document-level scroll if content is unexpectedly tall (long org name,
       many notifications, …). The page itself stays non-scrolling. */
    .nd-root { overflow-y:auto; -webkit-overflow-scrolling:touch; height:100%; padding-bottom:env(safe-area-inset-bottom,0); display:flex; flex-direction:column; }

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
`,T={nill:"◈",emails:"✉",accounting:"◎",calendar:"▦",team:"⌘",arbeitsstation:"▤",settings:"◉",ausweis:"▣"},C={rechnung:{bg:"rgba(198,255,60,.1)",color:"#c6ff3c",icon:"◎",label:"Rechnung"},buchung:{bg:"rgba(122,92,255,.12)",color:"#a585ff",icon:"⊕",label:"Buchung"},steuer:{bg:"rgba(255,179,71,.1)",color:"#ffb347",icon:"◈",label:"Steuer"},export:{bg:"rgba(255,179,71,.1)",color:"#ffb347",icon:"⊠",label:"Export"},team:{bg:"rgba(56,245,208,.1)",color:"#38f5d0",icon:"⬡",label:"Team"},update:{bg:"rgba(197,165,114,.1)",color:"#c5a572",icon:"◧",label:"Update"},email:{bg:"rgba(198,255,60,.08)",color:"#c6ff3c",icon:"✉",label:"E-Mail"},system:{bg:"rgba(122,92,255,.08)",color:"#7a5cff",icon:"◈",label:"System"}},ne=[{id:"u-260608",cat:"update",title:"NILL v2.4 — Buchhaltung Sidebar",desc:"Neue Sidebar-Navigation mit gruppierten Bereichen, 20 neue Statistik-Widgets (Kundentaktivität, Prognose, Stornoquote, Jahr-über-Jahr, …)",ts:"2026-06-08T10:00:00Z",link:"/changelog"},{id:"u-260607",cat:"update",title:"NILL v2.3 — Push-Benachrichtigungen",desc:"Native Push-Notifications für neue E-Mails — auch wenn die App im Hintergrund läuft (PWA & Safari).",ts:"2026-06-07T09:00:00Z",link:"/changelog"},{id:"u-260604",cat:"update",title:"NILL v2.2 — Mobile PWA",desc:"Bottom Tab Bar, Safe-Area Support für iPhone-Notch, mobiles Buchhaltungs-Layout überarbeitet.",ts:"2026-06-04T08:00:00Z",link:"/changelog"},{id:"u-260523",cat:"update",title:"NILL v2.1 — Sicherheits-Patch",desc:"4 kritische Sicherheitslücken geschlossen (Session-Token, CORS, Content-Security-Policy, Rate-Limiting).",ts:"2026-05-23T08:00:00Z",link:"/changelog"}];function te(g){const d=new Date(g),l=new Date-d,c=l/36e5,x=l/864e5;return c<1?`vor ${Math.max(1,Math.round(c*60))} Min.`:c<24?`vor ${Math.round(c)} Std.`:x<2?"Gestern":x<7?`vor ${Math.round(x)} Tagen`:d.toLocaleDateString("de-DE",{day:"2-digit",month:"short"})}function ie(g){const d=new Date().toDateString(),u=new Date(Date.now()-864e5).toDateString(),l={};for(const c of g){const x=new Date(c.ts),b=x.toDateString(),h=b===d?"Heute":b===u?"Gestern":x.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"});l[h]||(l[h]=[]),l[h].push(c)}return Object.entries(l)}function ae(){return e.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"}),e.jsx("path",{d:"M13.73 21a2 2 0 0 1-3.46 0"})]})}function pe(){const[g,d]=s.useState(!1),[u,l]=s.useState(!1),[c,x]=s.useState(null),[b,h]=s.useState([]),[F,A]=s.useState(null),[w,B]=s.useState(()=>localStorage.getItem("nill_accounting_mode")||"doppelt"),[W,v]=s.useState(!1),[j,D]=s.useState([]),[_,O]=s.useState(()=>localStorage.getItem("nill_feed_seen")||"1970-01-01T00:00:00Z"),{hasFeature:K,hasModule:R,isCompanyAdmin:L,org:N}=q(),G=t=>{t.preventDefault(),t.stopPropagation();const r=w==="doppelt"?"einfach":"doppelt";localStorage.setItem("nill_accounting_mode",r),B(r)};s.useEffect(()=>{const t=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=t}},[]),s.useEffect(()=>{m.get("/me/profile").then(i=>x(i.data.name||null)).catch(()=>{}),m.get("/me/onboarding-status").then(i=>{i.data.is_subscription_active&&!i.data.has_seen_onboarding&&d(!0),A(i.data.ai_email_processing_consent===!0)}).catch(()=>{A(!0)}),m.get("/me/notifications").then(i=>h(i.data||[])).catch(()=>{});const t=ne.map(i=>({...i})),r=i=>D(a=>{const n=[...a,...i].sort((p,z)=>new Date(z.ts)-new Date(p.ts)),o=new Set;return n.filter(p=>!o.has(p.id)&&o.add(p.id))});D([...t]),Promise.allSettled([m.get("/api/v1/aktivitaeten").then(i=>{const a=(i.data||[]).slice(0,30).map(n=>({id:`act-${n.id||n.ts}`,cat:n.kategorie||n.typ||"system",title:n.titel||n.nachricht||"Aktivität",desc:n.beschreibung||null,ts:n.erstellt_am||n.ts||new Date().toISOString(),link:n.link||null}));a.length&&r(a)}),m.get("/api/v1/rechnungen",{params:{limit:8}}).then(i=>{const a=(i.data||[]).map(n=>({id:`rec-${n.id}`,cat:"rechnung",title:`Rechnung ${n.nummer||n.id||""} — ${n.partner_name||n.partner||n.empfaenger_name||"Kunde"}`,desc:`${Number(n.betrag_netto||n.betrag_brutto||0).toLocaleString("de-DE",{minimumFractionDigits:2})} €`,ts:n.datum||n.erstellt_am||new Date().toISOString(),link:"/dashboard/accounting"}));a.length&&r(a)}),m.get("/api/v1/buchhaltung/buchungen",{params:{limit:6}}).then(i=>{const a=(i.data||[]).map(n=>({id:`bch-${n.id}`,cat:"buchung",title:n.buchungstext||"Buchung",desc:`${Number(n.betrag||0).toLocaleString("de-DE",{minimumFractionDigits:2})} €`,ts:n.buchungsdatum||n.erstellt_am||new Date().toISOString(),link:"/dashboard/accounting"}));a.length&&r(a)}),m.get("/api/v1/steuerexport").then(i=>{const a=(i.data||[]).slice(0,4).map(n=>({id:`tax-${n.id}`,cat:"export",title:`Steuerexport erstellt — ${n.typ||"UStVA"} ${n.zeitraum||""}`,desc:n.erstellt_von?`von ${n.erstellt_von}`:null,ts:n.erstellt_am||new Date().toISOString(),link:"/dashboard/accounting"}));a.length&&r(a)}),m.get("/api/v1/mitarbeiter").then(i=>{const a=(i.data||[]).filter(n=>n.beigetreten_am).slice(0,5).map(n=>({id:`emp-${n.id}`,cat:"team",title:`${n.name||"Mitarbeiter"} beigetreten`,desc:n.rolle||n.abteilung||null,ts:n.beigetreten_am,link:"/dashboard/workflow"}));a.length&&r(a)}),m.get("/inventory/activity",{params:{limit:20}}).then(i=>{var o;const a={"inventory.item.create":"Artikel angelegt","inventory.item.update":"Artikel geändert","inventory.item.delete":"Artikel gelöscht","inventory.item.quantity":"Bestand aktualisiert","inventory.list.create":"Liste angelegt","inventory.list.update":"Liste geändert","inventory.list.delete":"Liste gelöscht","inventory.delivery_note.confirm":"Lieferschein bestätigt","inventory.entry.create":"Eintrag hinzugefügt","inventory.entry.delete":"Eintrag gelöscht"},n=(((o=i.data)==null?void 0:o.items)||[]).map(p=>{var E;const z=(E=p.details)!=null&&E.name?` — ${p.details.name}`:"";return{id:`inv-${p.id}`,cat:"inventur",title:`${a[p.action]||"Inventur-Änderung"}${z}`,desc:p.actor_name?`von ${p.actor_name}`:null,ts:p.created_at||new Date().toISOString(),link:"/dashboard/workflow/Delivery-notes"}});n.length&&r(n)}),m.get("/workflow/tasks",{params:{status:"completed",limit:15}}).then(i=>{var n;const a=(((n=i.data)==null?void 0:n.items)||[]).filter(o=>o.completed_at).map(o=>({id:`task-${o.id}`,cat:"task",title:`Aufgabe erledigt — ${o.title}`,desc:o.completed_by_name?`von ${o.completed_by_name}`:null,ts:o.completed_at,link:"/dashboard/workflow/tasks"}));a.length&&r(a)})])},[]);const Z=async()=>{d(!1),setTimeout(()=>l(!0),400),m.post("/me/onboarding-complete").catch(()=>{})},U=[{key:"emails",title:"E-Mails",desc:"Postfach, Filter & Kategorien",link:"/dashboard/emails",feature:"email",module:"emails"},{key:"team",title:"Team",desc:"Aufgaben, Prozesse & Rollen",link:"/dashboard/workflow",feature:null,module:null},{key:"arbeitsstation",title:"Arbeitsstation",desc:"Zeiterfassung, Aufgaben & Lieferscheine",link:"/station",feature:null,module:null,isStation:!0},{key:"ausweis",title:"Mein Ausweis",desc:"QR-Code zum Ein-/Ausstempeln",link:"/ausweis",feature:null,module:null},{key:"accounting",title:"Buchhaltung",desc:"Rechnungen, Einnahmen & Ausgaben",link:"/dashboard/accounting",feature:"accounting",module:"accounting"},{key:"calendar",title:"Kalender",desc:"Termine, Planung & Events",link:"/dashboard/calendar",feature:"calendar",module:"calendar"},{key:"settings",title:"Einstellungen",desc:"Account & Verbindungen",link:"/dashboard/settings",feature:null,module:null,adminOnly:!0}].filter(t=>!t.adminOnly||L()).filter(t=>(!t.module||R(t.module))&&(!t.feature||K(t.feature))),k=j.filter(t=>new Date(t.ts)>new Date(_)).length,H=()=>v(!0),J=()=>{const t=new Date().toISOString();O(t),localStorage.setItem("nill_feed_seen",t)},I=(N==null?void 0:N.name)??c??null,M=new Date().getHours(),$=M<12?"Guten Morgen":M<18?"Guten Tag":"Guten Abend";return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:ee}),e.jsx(Q,{isOpen:g,onClose:Z}),e.jsx(Y,{isOpen:u,onFinish:()=>l(!1)}),W&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"nd-feed-backdrop",onClick:()=>v(!1)}),e.jsxs("div",{className:"nd-feed-panel",role:"dialog","aria-label":"Aktivitäten",children:[e.jsxs("div",{className:"nd-feed-hdr",children:[e.jsx("div",{className:"nd-feed-hdr-title",children:"Aktivitäten"}),k>0&&e.jsx("button",{className:"nd-feed-read-btn",onClick:J,children:"Alle gelesen"}),e.jsx("button",{className:"nd-feed-close",onClick:()=>v(!1),"aria-label":"Schließen",children:"✕"})]}),e.jsx("div",{className:"nd-feed-body",children:j.length===0?e.jsx("div",{className:"nd-feed-empty",children:"Noch keine Aktivitäten"}):ie(j).map(([t,r])=>e.jsxs("div",{children:[e.jsx("div",{className:"nd-feed-group",children:t}),r.map(i=>{const a=C[i.cat]||C.system,n=new Date(i.ts)>new Date(_),o=e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"nd-feed-item-dot"}),e.jsx("div",{className:"nd-feed-item-icon",style:{background:a.bg},children:e.jsx("span",{style:{color:a.color},children:a.icon})}),e.jsxs("div",{className:"nd-feed-item-body",children:[e.jsx("div",{className:"nd-feed-item-title",children:i.title}),i.desc&&e.jsx("div",{className:"nd-feed-item-desc",children:i.desc})]}),e.jsx("div",{className:"nd-feed-item-time",children:te(i.ts)})]});return i.link?e.jsx("a",{href:i.link,className:`nd-feed-item${n?" nd-unread":""}`,onClick:()=>v(!1),children:o},i.id):e.jsx("div",{className:`nd-feed-item${n?" nd-unread":""}`,children:o},i.id)})]},t))})]})]}),e.jsx(V,{noScroll:!0,footer:e.jsx(X,{}),children:e.jsxs("div",{className:"nd-root",children:[e.jsxs(f.div,{className:"nd-welcome",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6},children:[e.jsxs("button",{className:"nd-bell-btn",onClick:H,"aria-label":"Aktivitäten & Mitteilungen",children:[e.jsx(ae,{}),k>0&&e.jsx("span",{className:"nd-bell-badge",children:k>9?"9+":k})]}),e.jsx("div",{className:"nd-welcome-eyebrow",children:"Dashboard"}),e.jsx("h1",{children:I?e.jsxs(e.Fragment,{children:[$,", ",e.jsxs("em",{children:[I,"."]})]}):e.jsxs(e.Fragment,{children:[$,e.jsx("em",{children:"."})]})}),e.jsx("p",{className:"nd-welcome-sub",children:"Alles im grünen Bereich — keine offenen Aufgaben."}),b.length>0&&e.jsx("div",{className:"nd-notifs",children:b.slice(0,2).map((t,r)=>e.jsx("div",{className:"nd-notif",children:t.message},r))})]}),F===!1&&L()&&e.jsxs(f.div,{className:"nd-ai-banner",initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.45},children:[e.jsx("div",{className:"nd-ai-banner-icon",children:"◈"}),e.jsxs("div",{className:"nd-ai-banner-body",children:[e.jsx("div",{className:"nd-ai-banner-tag",children:"EU AI Act · Deine Zustimmung erforderlich"}),e.jsx("div",{className:"nd-ai-banner-title",children:"KI E-Mail-Analyse noch nicht aktiviert"}),e.jsx("p",{className:"nd-ai-banner-desc",children:"NILL kann eingehende E-Mails automatisch zusammenfassen, priorisieren und kategorisieren — aber nur mit deiner ausdrücklichen Zustimmung. Aktiviere die Funktion in den Einstellungen."})]}),e.jsx(S,{to:"/dashboard/settings?tab=integrationen",className:"nd-ai-banner-cta",children:"Jetzt aktivieren →"})]}),e.jsx("div",{className:"nd-section-label",children:"Module"}),e.jsx("div",{className:"nd-grid",children:U.map((t,r)=>t.isStation?e.jsx(f.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{delay:r*.05},children:e.jsxs(S,{to:t.link,className:"nd-card",style:{display:"flex"},children:[e.jsx("div",{className:"nd-card-icon",children:T[t.key]||"▤"}),e.jsxs("div",{children:[e.jsx("div",{className:"nd-card-title",children:t.title}),e.jsx("span",{className:"nd-soon-badge",style:{background:"rgba(198,255,60,.1)",borderColor:"rgba(198,255,60,.25)",color:"var(--accent)"},children:"Tablet & Kiosk"}),e.jsx("p",{className:"nd-card-desc",style:{marginTop:6},children:t.desc})]}),e.jsxs("div",{className:"nd-card-arrow",children:["Station öffnen ",e.jsx("span",{children:"→"})]})]})},t.key):e.jsx(f.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{delay:r*.05},children:e.jsxs(S,{to:t.link,className:"nd-card",style:{display:"flex"},children:[e.jsx("div",{className:"nd-card-icon",children:T[t.key]||"◎"}),e.jsxs("div",{children:[e.jsx("div",{className:"nd-card-title",children:t.title}),e.jsx("p",{className:"nd-card-desc",children:t.desc}),t.key==="accounting"&&e.jsxs("span",{className:"nd-mode-toggle",onClick:G,title:"Buchhaltungsart umschalten",children:[e.jsx("span",{className:"nd-mode-toggle-label",children:"Modus"}),e.jsx("span",{className:`nd-mode-pill nd-mode-pill-${w}`,children:w==="doppelt"?"Doppelt":"Einfach"})]})]}),e.jsxs("div",{className:"nd-card-arrow",children:["Öffnen ",e.jsx("span",{children:"→"})]})]})},t.key))})]})})]})}export{pe as default};
