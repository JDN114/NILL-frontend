import { useEffect } from "react";

const css = `

/* =========================================================
   DESIGN TOKENS
   ========================================================= */
:root{
  --bg:           #040407;
  --bg-2:         #08080c;
  --bg-3:         #0a0a10;
  --ink:          #efede7;          /* warm editorial off-white */
  --ink-dim:      rgba(239,237,231,0.50);
  --ink-faint:    rgba(239,237,231,0.14);
  --line:         rgba(239,237,231,0.07);
  --glass:        rgba(255,255,255,0.035);
  --glass-strong: rgba(255,255,255,0.06);
  --accent:       #c6ff3c;          /* electric lime */
  --accent-2:     #7a5cff;          /* deep violet */
  --accent-3:     #ff4d8d;          /* magenta */
  --accent-4:     #38f5d0;          /* cyan */
  --serif:        "Fraunces", "Iowan Old Style", Georgia, serif;
  --sans:         "Inter", system-ui, -apple-system, Segoe UI, sans-serif;
  --mono:         "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --radius:       18px;
  --radius-lg:    28px;
  --ease:         cubic-bezier(.2,.7,.2,1);
  --ease-out:     cubic-bezier(.16,1,.3,1);
}

*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
html{scroll-behavior:smooth}
body{overflow-x:hidden}
img,svg,canvas{display:block;max-width:100%}
a{color:inherit;text-decoration:none;cursor:pointer}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
::selection{background:var(--accent);color:#000}

/* Vignette subtil (ohne Grain — cleaner schwarzer Hintergrund) */
.vignette{
  position:fixed; inset:0; pointer-events:none; z-index:99;
  background:radial-gradient(140% 90% at 50% 10%, transparent 60%, rgba(0,0,0,.55) 100%);
}

/* =========================================================
   LAYOUT
   ========================================================= */
.wrap{width:min(1320px,100% - 48px); margin-inline:auto}
.wrap-tight{width:min(1040px,100% - 48px); margin-inline:auto}

.eyebrow{
  font-family:var(--mono); font-size:11px; letter-spacing:.22em; text-transform:uppercase;
  color:var(--ink-dim); display:inline-flex; align-items:center; gap:10px;
}
.eyebrow::before{content:""; width:22px; height:1px; background:currentColor; opacity:.6}

h1,h2,h3,h4{font-family:var(--serif); font-weight:400; font-variation-settings:"opsz" 144, "SOFT" 0, "WONK" 0; letter-spacing:-.02em; line-height:.95}
h1{font-size:clamp(56px, 11vw, 176px)}
h2{font-size:clamp(40px, 7vw, 112px); letter-spacing:-.025em}
h3{font-size:clamp(28px, 3.4vw, 52px); letter-spacing:-.02em}

p{font-size:clamp(15px, 1.1vw, 18px); line-height:1.55; color:var(--ink-dim)}
.lead{font-size:clamp(17px, 1.4vw, 22px); line-height:1.45; color:var(--ink); max-width:56ch}

/* =========================================================
   NAV
   ========================================================= */
.nav{
  position:fixed; top:0; left:0; right:0; z-index:60;
  padding:18px 0;
  transition:backdrop-filter .4s, background .4s;
}
.nav.scrolled{backdrop-filter: blur(14px) saturate(140%); background:rgba(8,8,10,.55); border-bottom:1px solid var(--line)}
.nav .wrap{display:flex; align-items:center; justify-content:space-between; gap:24px}
.brand{display:flex; align-items:center; gap:12px; font-family:var(--serif); font-size:22px; letter-spacing:-.02em}
.brand-mark{
  width:28px; height:28px; border-radius:8px;
  background:conic-gradient(from 210deg, var(--accent), var(--accent-4), var(--accent-2), var(--accent-3), var(--accent));
  position:relative; overflow:hidden;
}
.brand-mark::after{
  content:""; position:absolute; inset:4px; border-radius:5px; background:var(--bg);
}
.brand-mark::before{
  content:""; position:absolute; inset:-50%; background:conic-gradient(from 0deg, transparent 0 340deg, rgba(255,255,255,.6) 355deg, transparent 360deg);
  animation: spin 6s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}

.nav ul{display:flex; gap:8px; list-style:none}
.nav ul a{
  font-size:13px; color:var(--ink-dim); padding:8px 14px; border-radius:99px;
  transition:color .25s, background .25s;
}
.nav ul a:hover{color:var(--ink); background:var(--glass)}

.nav-auth{display:flex; align-items:center; gap:8px}
.nav-auth .btn-auth{
  font-size:13px; color:var(--ink); padding:9px 16px; border-radius:99px;
  border:1px solid var(--line); background:transparent;
  transition:border-color .25s, background .25s, color .25s;
}
.nav-auth .btn-auth:hover{border-color:var(--ink); background:var(--glass)}
.nav-auth .btn-auth.primary{background:var(--accent); color:#050505; border-color:var(--accent)}
.nav-auth .btn-auth.primary:hover{background:#fff; border-color:#fff; color:#050505}
@media (max-width: 860px){
  .nav ul{display:none}
  .nav-auth .btn-auth{padding:8px 12px; font-size:12px}
}

/* buttons */
.btn{
  display:inline-flex; align-items:center; gap:10px;
  padding:13px 22px; border-radius:99px;
  font-size:14px; font-weight:500; letter-spacing:-.005em;
  position:relative; overflow:hidden; isolation:isolate;
  transition:transform .35s var(--ease-out), color .3s;
}
.btn-primary{background:var(--accent); color:#050505}
.btn-primary::after{
  content:""; position:absolute; inset:0; z-index:-1; background:#fff;
  transform:translateY(101%); transition:transform .5s var(--ease-out);
}
.btn-primary:hover::after{transform:translateY(0)}
.btn-ghost{border:1px solid var(--line); color:var(--ink); background:transparent}
.btn-ghost:hover{border-color:var(--ink); background:var(--glass)}
.btn .arrow{
  display:inline-block; transition:transform .3s var(--ease-out);
}
.btn:hover .arrow{transform:translateX(4px)}

/* =========================================================
   HERO
   ========================================================= */
.hero{
  position:relative; min-height:100vh; min-height:100svh;
  padding: 140px 0 80px;
  display:flex; align-items:center;
  overflow:hidden;
}
#hero-canvas{position:absolute; inset:0; z-index:0}
.hero::after{ /* soft fade at bottom of hero so it blends into next section */
  content:""; position:absolute; left:0; right:0; bottom:0; height:35vh;
  background:linear-gradient(to bottom, transparent, var(--bg) 85%);
  z-index:2; pointer-events:none;
}
.hero-inner{position:relative; z-index:3; width:100%}
.hero-eyebrow{margin-bottom:24px}
.hero h1{margin-bottom:28px; max-width:14ch}
.hero h1 .word{display:inline-block; overflow:hidden; vertical-align:baseline}
.hero h1 .word > span{display:inline-block; transform:translateY(110%); transition:transform 1.1s var(--ease-out)}
.hero.revealed h1 .word > span{transform:translateY(0)}
.hero h1 em{font-style:italic; font-family:var(--serif); color:var(--accent); font-variation-settings:"opsz" 144, "SOFT" 100, "WONK" 1}
.hero .lead{margin-bottom:44px; opacity:0; transform:translateY(20px); transition:opacity .9s .6s, transform .9s .6s var(--ease-out)}
.hero.revealed .lead{opacity:1; transform:none}
.hero-cta{display:flex; gap:12px; flex-wrap:wrap; opacity:0; transform:translateY(20px); transition:opacity .9s .85s, transform .9s .85s var(--ease-out)}
.hero.revealed .hero-cta{opacity:1; transform:none}

.hero-meta{
  position:absolute; left:24px; right:24px; bottom:26px; z-index:3;
  display:flex; justify-content:space-between; align-items:end;
  font-family:var(--mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase;
  color:var(--ink-dim);
}
.hero-meta .scroll-ind{display:flex; align-items:center; gap:10px}
.hero-meta .scroll-ind .bar{width:1px; height:44px; background:var(--line); position:relative; overflow:hidden}
.hero-meta .scroll-ind .bar::after{content:""; position:absolute; left:0; right:0; top:-50%; height:50%; background:var(--accent); animation:scrollbar 2.2s infinite}
@keyframes scrollbar{0%{top:-50%}100%{top:100%}}

/* floating chips */
.hero-chips{position:absolute; inset:0; z-index:1; pointer-events:none}
.chip{
  position:absolute; padding:8px 14px; border-radius:99px;
  background:var(--glass-strong); border:1px solid var(--line); backdrop-filter: blur(14px);
  font-family:var(--mono); font-size:11px; letter-spacing:.1em; color:var(--ink);
  display:inline-flex; align-items:center; gap:8px;
  animation: float 9s ease-in-out infinite;
}
.chip .dot{width:6px;height:6px;border-radius:50%;background:var(--accent)}
.chip.c1{top:18%; left:6%; animation-delay:-1s}
.chip.c2{top:30%; right:8%; animation-delay:-3s}
.chip.c3{bottom:24%; left:12%; animation-delay:-5s}
.chip.c4{bottom:32%; right:14%; animation-delay:-7s}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}

/* =========================================================
   MARQUEE / TICKER
   ========================================================= */
.ticker{
  border-block:1px solid var(--line);
  padding: 22px 0;
  overflow:hidden;
  background:linear-gradient(to right, var(--bg-2), var(--bg) 50%, var(--bg-2));
}
.ticker-track{
  display:flex; gap:64px; white-space:nowrap;
  animation: ticker 40s linear infinite;
  font-family:var(--serif); font-size:clamp(24px,3vw,40px); letter-spacing:-.02em;
}
.ticker-track span{display:inline-flex; align-items:center; gap:64px; color:var(--ink)}
.ticker-track em{font-style:italic; color:var(--accent); font-variation-settings:"opsz" 144, "SOFT" 100}
.ticker-track .sep{width:8px; height:8px; background:var(--accent); border-radius:50%; display:inline-block}
@keyframes ticker{to{transform:translateX(-50%)}}

/* =========================================================
   SECTION FRAME
   ========================================================= */
section{position:relative; padding: 160px 0}
.section-head{display:flex; justify-content:space-between; align-items:end; gap:40px; margin-bottom:72px}
.section-head h2{max-width:16ch}
.section-head .lead{max-width:36ch}
@media (max-width:780px){.section-head{flex-direction:column; align-items:flex-start}}

/* reveal on scroll */
.reveal{opacity:0; transform:translateY(40px); transition:opacity 1s var(--ease-out), transform 1s var(--ease-out)}
.reveal.in{opacity:1; transform:none}
.reveal-delay-1{transition-delay:.08s}
.reveal-delay-2{transition-delay:.16s}
.reveal-delay-3{transition-delay:.24s}

/* =========================================================
   NACHHALTIGKEIT
   ========================================================= */
#nachhaltigkeit{
  position:relative;
  background:
    radial-gradient(60% 90% at 20% 10%, rgba(56,245,208,0.05), transparent 60%),
    radial-gradient(50% 80% at 85% 80%, rgba(198,255,60,0.05), transparent 60%),
    linear-gradient(180deg, transparent, rgba(198,255,60,0.015), transparent);
}
.nh-hero{
  display:grid; grid-template-columns: 1.05fr .95fr; gap:56px; align-items:center;
  padding: 20px 0 60px;
}
.nh-hero .nh-leaf{
  position:relative; aspect-ratio: 1 / 1; border-radius: 32px; overflow:hidden;
  background:
    radial-gradient(80% 60% at 30% 20%, rgba(198,255,60,0.35), transparent 60%),
    radial-gradient(70% 60% at 80% 90%, rgba(56,245,208,0.3), transparent 60%),
    linear-gradient(135deg, #0a1210 0%, #041011 100%);
  border: 1px solid rgba(198,255,60,0.18);
  display:flex; align-items:center; justify-content:center;
}
.nh-hero .nh-leaf svg{width:65%; height:65%; filter: drop-shadow(0 0 40px rgba(198,255,60,.35))}
.nh-hero h2 em{font-style:italic; color:var(--accent)}
.nh-hero p{max-width:46ch; margin-top:20px}
.nh-stats{
  display:grid; grid-template-columns: repeat(3, 1fr); gap:16px;
  margin-top: 60px;
}
.nh-stat{
  padding:28px; border-radius:var(--radius-lg);
  background:
    radial-gradient(120% 100% at 0% 0%, rgba(198,255,60,0.05), transparent 55%),
    linear-gradient(180deg, #0a120f, #050a08);
  border:1px solid rgba(198,255,60,0.12);
}
.nh-stat .val{
  font-family:var(--serif); font-size:clamp(44px, 5vw, 68px);
  letter-spacing:-.03em; line-height:1; color:var(--ink);
  font-variation-settings:"opsz" 144, "SOFT" 40, "WONK" 0;
}
.nh-stat .val em{font-style:italic; color:var(--accent); font-variation-settings:"opsz" 144, "SOFT" 100, "WONK" 1}
.nh-stat .lbl{
  font-family:var(--mono); font-size:11px; letter-spacing:.2em; text-transform:uppercase;
  color:var(--ink-dim); margin-top:14px; display:block;
}
.nh-stat p{margin-top:14px; font-size:14px}
.nh-pillars{
  display:grid; grid-template-columns: repeat(3, 1fr); gap:16px;
  margin-top: 20px;
}
.nh-pillar{
  padding:28px; border-radius:var(--radius-lg);
  background: linear-gradient(180deg, #080b0a, #040707);
  border:1px solid var(--line);
  position:relative; overflow:hidden;
}
.nh-pillar::before{
  content:""; position:absolute; inset:0;
  background: radial-gradient(400px 200px at 0% 0%, rgba(56,245,208,0.06), transparent 60%);
  pointer-events:none;
}
.nh-pillar .num{
  font-family:var(--mono); font-size:11px; letter-spacing:.2em; color:var(--accent);
}
.nh-pillar h3{font-size:clamp(22px, 2.2vw, 30px); margin-top:14px}
.nh-pillar p{margin-top:12px; font-size:15px}
.nh-pledge{
  margin-top: 60px;
  padding: 44px;
  border-radius: var(--radius-lg);
  border:1px solid rgba(198,255,60,0.2);
  background:
    radial-gradient(60% 90% at 100% 0%, rgba(198,255,60,0.08), transparent 60%),
    linear-gradient(180deg, rgba(198,255,60,0.025), transparent);
  display:flex; justify-content:space-between; align-items:center; gap:30px; flex-wrap:wrap;
}
.nh-pledge .big{font-family:var(--serif); font-size:clamp(22px, 2.4vw, 32px); line-height:1.25; max-width:48ch; letter-spacing:-.015em}
.nh-pledge .big em{font-style:italic; color:var(--accent); font-variation-settings:"opsz" 144, "SOFT" 100, "WONK" 1}
.nh-pledge small{font-family:var(--mono); font-size:11px; letter-spacing:.18em; color:var(--ink-dim); text-transform:uppercase}
@media (max-width:1020px){
  .nh-hero{grid-template-columns:1fr; gap:32px}
  .nh-stats, .nh-pillars{grid-template-columns:1fr 1fr}
}
@media (max-width:620px){
  .nh-stats, .nh-pillars{grid-template-columns:1fr}
  .nh-pledge{padding:28px}
}

/* =========================================================
   BENTO — PRODUCT GRID
   ========================================================= */
.bento{
  display:grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 200px;
  gap:16px;
}
.card{
  position:relative; overflow:hidden;
  border-radius:var(--radius-lg);
  background:
    radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,.035), transparent 50%),
    linear-gradient(180deg, #0b0b10, #060609);
  border:1px solid var(--line);
  padding:28px;
  display:flex; flex-direction:column; justify-content:space-between;
  transition:transform .6s var(--ease-out), border-color .5s;
  isolation:isolate;
}
.card::before{ /* subtle inner glow */
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:radial-gradient(600px 300px at var(--mx,50%) var(--my,0%), rgba(198,255,60,.08), transparent 55%);
  opacity:0; transition:opacity .5s;
}
.card:hover::before{opacity:1}
.card:hover{border-color:rgba(245,243,238,.16); transform:translateY(-4px)}
.card .tag{
  font-family:var(--mono); font-size:11px; letter-spacing:.18em; text-transform:uppercase;
  color:var(--ink-dim); display:inline-flex; gap:8px; align-items:center;
}
.card .tag .n{color:var(--accent)}
.card h3{margin-top:18px}
.card p{margin-top:10px; max-width:32ch}
.card .canvas-wrap{position:absolute; inset:0; z-index:-1; opacity:.85}

/* grid placement */
.card.k1{grid-column: span 7; grid-row: span 2}     /* postfach - hero card */
.card.k2{grid-column: span 5; grid-row: span 2}     /* buchhaltung */
.card.k3{grid-column: span 4; grid-row: span 2}     /* inventur */
.card.k4{grid-column: span 4; grid-row: span 2}     /* zeiterfassung */
.card.k5{grid-column: span 4; grid-row: span 2}     /* teamverwaltung */
.card.k6{grid-column: span 12; grid-row: span 1}    /* sekretärin coming soon */

.card.k6{flex-direction:row; align-items:center; justify-content:space-between; gap:30px}
.card.k6 .cta{display:flex; align-items:center; gap:14px}
.card.k6 .badge{
  padding:6px 12px; border-radius:99px; background:rgba(198,255,60,.12); color:var(--accent);
  font-family:var(--mono); font-size:11px; letter-spacing:.18em; text-transform:uppercase;
}

@media (max-width:1020px){
  .bento{grid-template-columns:repeat(6,1fr); grid-auto-rows:180px}
  .card.k1{grid-column:span 6}
  .card.k2{grid-column:span 6}
  .card.k3,.card.k4,.card.k5{grid-column:span 3}
  .card.k6{grid-column:span 6; flex-direction:column; align-items:flex-start}
}
@media (max-width:620px){
  .bento{grid-template-columns:1fr}
  .card{grid-column:1/-1 !important}
}

/* mini SVG viz */
.viz{position:absolute; inset:0; pointer-events:none; z-index:0}
.viz svg{width:100%; height:100%}

/* animated mail viz */
.mail-row{
  opacity:0; transform:translateX(40px); animation: slideIn 4s var(--ease-out) infinite;
}
.mail-row:nth-child(2){animation-delay:-1s}
.mail-row:nth-child(3){animation-delay:-2s}
.mail-row:nth-child(4){animation-delay:-3s}
@keyframes slideIn{
  0%{opacity:0; transform:translateX(40px)}
  20%{opacity:1; transform:translateX(0)}
  70%{opacity:1; transform:translateX(0)}
  100%{opacity:0; transform:translateX(-40px)}
}

/* =========================================================
   STICKY FEATURE SECTION
   ========================================================= */
.feature-sticky{
  display:grid; grid-template-columns: 1fr 1fr; gap:60px; align-items:flex-start;
}
.feature-sticky .text-col > .step{
  padding: 22vh 0;
  border-top:1px solid var(--line);
}
.feature-sticky .text-col > .step:first-child{border-top:0}
.feature-sticky .text-col h3{margin-bottom:18px}
.feature-sticky .text-col p{max-width:40ch; color:var(--ink)}
.feature-sticky .visual-col{
  position:sticky; top: 18vh; height: 64vh;
  border-radius:var(--radius-lg); border:1px solid var(--line);
  background: linear-gradient(180deg, #08080d, #040407);
  overflow:hidden;
}
.feature-visual{position:absolute; inset:0; display:grid; place-items:center}

.device{
  width: 84%; aspect-ratio: 4/3; border-radius:14px;
  background: linear-gradient(180deg, #0f0f14, #07070b);
  border:1px solid var(--line);
  padding:18px; position:relative; overflow:hidden;
  box-shadow: 0 60px 120px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.04);
}
.device .dots{display:flex; gap:6px; margin-bottom:16px}
.device .dots span{width:10px;height:10px;border-radius:50%;background:var(--line)}
.device-frame{position:absolute; inset:46px 18px 18px; border-radius:8px; background:#06060a; overflow:hidden; border:1px solid var(--line)}

.scene{position:absolute; inset:0; opacity:0; transition:opacity .6s var(--ease-out)}
.scene.active{opacity:1}

/* scene: inbox */
.inbox-row{display:grid; grid-template-columns:24px 120px 1fr 60px; align-items:center; gap:10px; padding:12px 14px; border-bottom:1px solid var(--line); font-size:12px}
.inbox-row.hi{background:rgba(198,255,60,.05)}
.inbox-dot{width:8px;height:8px;border-radius:50%;background:var(--accent-2)}
.inbox-dot.a{background:var(--accent)}
.inbox-dot.b{background:var(--accent-3)}
.inbox-name{color:var(--ink)}
.inbox-snippet{color:var(--ink-dim); overflow:hidden; white-space:nowrap; text-overflow:ellipsis}
.inbox-time{color:var(--ink-dim); text-align:right; font-family:var(--mono); font-size:10px}
.ai-reply{
  margin: 14px; padding:14px; border-radius:10px; background:rgba(198,255,60,.06); border:1px solid rgba(198,255,60,.25);
  font-size:12px; line-height:1.55; color:var(--ink); position:relative;
}
.ai-reply::before{content:"KI-ANTWORT"; position:absolute; top:-8px; left:12px; background:var(--bg); padding:0 6px; font-family:var(--mono); font-size:9px; letter-spacing:.2em; color:var(--accent)}
.typing{display:inline-block; width:6px; height:12px; background:var(--accent); animation:blink .9s infinite; vertical-align:middle}
@keyframes blink{50%{opacity:0}}

/* scene: ledger */
.ledger-head, .ledger-row{display:grid; grid-template-columns: 70px 1fr 90px 80px; gap:10px; padding:10px 14px; font-size:11px; align-items:center}
.ledger-head{color:var(--ink-dim); font-family:var(--mono); letter-spacing:.15em; text-transform:uppercase; border-bottom:1px solid var(--line)}
.ledger-row{border-bottom:1px solid var(--line); font-size:12px}
.ledger-row .cat{display:inline-block; padding:3px 8px; border-radius:99px; background:var(--glass); font-family:var(--mono); font-size:10px; color:var(--ink)}
.amount{font-family:var(--mono); text-align:right}
.amount.neg{color:var(--accent-3)}
.amount.pos{color:var(--accent)}
.ocr-blip{position:absolute; right:14px; top:14px; font-family:var(--mono); font-size:10px; color:var(--accent); display:flex; gap:6px; align-items:center}
.ocr-blip .pulse{width:6px;height:6px;background:var(--accent); border-radius:50%; animation: pulse 1.4s infinite}
@keyframes pulse{0%,100%{transform:scale(1); opacity:1}50%{transform:scale(1.8); opacity:0}}

/* scene: inventory */
.inv-grid{display:grid; grid-template-columns:repeat(6,1fr); gap:8px; padding:14px}
.inv-cell{
  aspect-ratio:1; border-radius:8px; border:1px solid var(--line);
  display:grid; place-items:center; font-family:var(--mono); font-size:10px; color:var(--ink-dim);
  position:relative; transition:background .4s, border-color .4s;
}
.inv-cell.lo{background:rgba(255,77,141,.12); border-color:rgba(255,77,141,.4); color:var(--accent-3)}
.inv-cell.ok{background:rgba(198,255,60,.06); border-color:rgba(198,255,60,.3); color:var(--accent)}
.inv-legend{padding: 0 14px 14px; display:flex; gap:14px; font-family:var(--mono); font-size:10px; color:var(--ink-dim)}
.inv-legend span::before{content:""; display:inline-block; width:8px;height:8px; margin-right:6px; background:var(--accent); border-radius:2px}
.inv-legend span.lo::before{background:var(--accent-3)}

/* scene: time */
.time-ring{
  position:absolute; inset:0; display:grid; place-items:center;
}
.time-svg{width:60%; aspect-ratio:1}

/* scene: team */
.team-list{padding:14px; display:grid; grid-template-columns:1fr 1fr; gap:10px}
.team-tile{padding:14px; border:1px solid var(--line); border-radius:10px; display:flex; gap:12px; align-items:center}
.avatar{width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg, var(--accent-2), var(--accent-4)); display:grid; place-items:center; font-family:var(--mono); font-size:12px; color:#000; font-weight:600}
.team-name{font-size:12px}
.team-role{font-size:10px; color:var(--ink-dim); font-family:var(--mono)}

/* step indicator dot */
.step-index{font-family:var(--mono); font-size:12px; letter-spacing:.2em; color:var(--ink-dim); margin-bottom:16px}
.step-index em{font-style:normal; color:var(--accent)}

@media (max-width:980px){
  .feature-sticky{grid-template-columns:1fr}
  .feature-sticky .visual-col{position:relative; top:0; height:440px}
  .feature-sticky .text-col > .step{padding: 60px 0}
}

/* =========================================================
   STATS
   ========================================================= */
.stats{display:grid; grid-template-columns:repeat(4,1fr); gap:24px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding: 60px 0}
.stat .num{
  font-family:var(--serif); font-size:clamp(56px, 7vw, 96px); letter-spacing:-.04em; line-height:1;
  display:flex; align-items:baseline; gap:4px;
}
.stat .num em{font-style:italic; color:var(--accent); font-variation-settings:"opsz" 144, "SOFT" 80, "WONK" 1}
.stat .label{margin-top:8px; font-family:var(--mono); font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:var(--ink-dim)}
@media (max-width:780px){.stats{grid-template-columns:repeat(2,1fr)}}

/* =========================================================
   TESTIMONIAL MARQUEE
   ========================================================= */
.quotes{display:grid; grid-template-columns:repeat(3,1fr); gap:18px}
.quote{
  padding:28px; border-radius:var(--radius-lg); border:1px solid var(--line); background:var(--glass);
  display:flex; flex-direction:column; gap:18px;
  transition:transform .5s var(--ease-out), border-color .3s;
}
.quote:hover{transform:translateY(-4px); border-color:var(--ink-faint)}
.quote blockquote{font-family:var(--serif); font-size:22px; line-height:1.3; letter-spacing:-.01em}
.quote blockquote em{font-style:italic; color:var(--accent); font-variation-settings:"opsz" 144, "SOFT" 100, "WONK" 1}
.quote footer{display:flex; align-items:center; gap:12px; margin-top:auto}
.quote footer .avatar{width:38px; height:38px}
.quote footer .name{font-size:13px}
.quote footer .role{font-size:11px; color:var(--ink-dim); font-family:var(--mono)}
@media (max-width:860px){.quotes{grid-template-columns:1fr}}

/* =========================================================
   PRICING
   ========================================================= */
.pricing-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:18px; perspective:1400px}
.price{
  padding:34px; border-radius:var(--radius-lg); border:1px solid var(--line);
  background:linear-gradient(180deg, #0a0a0e, #060609);
  display:flex; flex-direction:column; gap:22px;
  transform-style:preserve-3d;
  transition:transform .5s var(--ease-out), border-color .3s, box-shadow .5s;
}
.price.pop{
  border-color:rgba(198,255,60,.4);
  background: radial-gradient(120% 80% at 0% 0%, rgba(198,255,60,.07), transparent 50%), linear-gradient(180deg, #0c0d08, #070805);
  box-shadow: 0 30px 80px rgba(198,255,60,.07);
}
.price-tag{display:flex; align-items:baseline; gap:8px}
.price-tag .num{font-family:var(--serif); font-size:72px; letter-spacing:-.04em; line-height:1}
.price-tag .per{font-family:var(--mono); font-size:12px; color:var(--ink-dim); letter-spacing:.1em}
.price ul{list-style:none; display:flex; flex-direction:column; gap:10px; padding-top:18px; border-top:1px solid var(--line)}
.price ul li{font-size:14px; display:flex; align-items:flex-start; gap:10px; color:var(--ink)}
.price ul li::before{
  content:""; width:16px; height:16px; border-radius:50%;
  background:radial-gradient(circle, var(--accent) 0 35%, transparent 36%);
  border:1px solid rgba(198,255,60,.4); flex:0 0 16px;
  margin-top:3px;
}
.price .pop-chip{
  position:absolute; top:-12px; left:28px; padding:6px 12px; border-radius:99px;
  background:var(--accent); color:#000; font-family:var(--mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase;
}
.price{position:relative}
@media (max-width:860px){.pricing-grid{grid-template-columns:1fr}}

/* =========================================================
   FAQ
   ========================================================= */
.faq{display:flex; flex-direction:column; border-top:1px solid var(--line)}
.faq details{border-bottom:1px solid var(--line); padding: 22px 4px; transition:background .3s}
.faq details[open]{background:linear-gradient(to right, rgba(198,255,60,.02), transparent 60%)}
.faq summary{
  list-style:none; display:flex; justify-content:space-between; align-items:center; gap:24px;
  font-family:var(--serif); font-size:clamp(22px,2.2vw,30px); letter-spacing:-.015em;
  cursor:pointer;
}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{
  content:"+"; font-family:var(--mono); font-size:28px; color:var(--accent); transition:transform .3s var(--ease);
}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq .a{padding:14px 0 4px; color:var(--ink-dim); max-width:70ch}

/* =========================================================
   MASSIVE CTA
   ========================================================= */
.cta-big{
  position:relative; padding: 180px 0; overflow:hidden; isolation:isolate;
}
.cta-big::before{
  content:""; position:absolute; inset:-20%;
  background:
    radial-gradient(60% 50% at 20% 30%, rgba(122,92,255,.30), transparent 60%),
    radial-gradient(50% 60% at 80% 70%, rgba(198,255,60,.22), transparent 60%),
    radial-gradient(40% 40% at 60% 20%, rgba(255,77,141,.20), transparent 60%);
  filter:blur(50px); z-index:-1; animation: blobshift 14s ease-in-out infinite;
}
@keyframes blobshift{
  0%,100%{transform:translate(0,0) scale(1)}
  33%{transform:translate(3%,-2%) scale(1.05)}
  66%{transform:translate(-2%,3%) scale(.97)}
}
.cta-big h2{font-size:clamp(64px,12vw,180px); max-width:none}
.cta-big h2 em{font-style:italic; color:var(--accent); font-variation-settings:"opsz" 144, "SOFT" 100, "WONK" 1}
.cta-big .sub{display:flex; justify-content:space-between; align-items:end; margin-top:40px; gap:30px}
.cta-big .sub .lead{max-width:40ch}

/* =========================================================
   FOOTER
   ========================================================= */
footer{border-top:1px solid var(--line); padding: 80px 0 40px}
.foot-grid{display:grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap:40px; align-items:flex-start; padding-bottom:80px}
.foot-grid h4{font-family:var(--mono); font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:var(--ink-dim); margin-bottom:16px; font-weight:500}
.foot-grid ul{list-style:none; display:flex; flex-direction:column; gap:8px}
.foot-grid a{font-size:14px; color:var(--ink)}
.foot-grid a:hover{color:var(--accent)}
.wordmark{font-family:var(--serif); font-size:clamp(90px,22vw,360px); letter-spacing:-.05em; line-height:.85; padding-top:30px; border-top:1px solid var(--line); overflow:hidden}
.wordmark em{font-style:italic; color:var(--accent); font-variation-settings:"opsz" 144, "SOFT" 100, "WONK" 1}
.foot-meta{display:flex; justify-content:space-between; font-family:var(--mono); font-size:11px; letter-spacing:.15em; text-transform:uppercase; color:var(--ink-dim); padding-top:24px}
@media (max-width:860px){.foot-grid{grid-template-columns:repeat(2,1fr)}}

/* =========================================================
   UTIL
   ========================================================= */
.split-line{display:inline-block; overflow:hidden; vertical-align:baseline}
.split-line > span{display:inline-block}
.magnetic{display:inline-flex; transition:transform .4s var(--ease-out)}

/* =========================================================
   MODAL — lead form, mailto submit
   ========================================================= */
.modal{position:fixed; inset:0; z-index:1000; display:none; align-items:center; justify-content:center; padding:24px}
.modal.is-open{display:flex}
.modal-bg{position:absolute; inset:0; background:rgba(2,6,12,.72); backdrop-filter:blur(18px) saturate(120%); -webkit-backdrop-filter:blur(18px) saturate(120%)}
.modal-panel{position:relative; width:min(560px,100%); background:linear-gradient(180deg,rgba(18,22,28,.96),rgba(10,13,18,.98)); border:1px solid var(--line); border-radius:20px; padding:34px; box-shadow:0 40px 120px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.04); transform:translateY(18px) scale(.98); opacity:0; transition:transform .5s var(--ease-out), opacity .4s var(--ease-out)}
.modal.is-open .modal-panel{transform:none; opacity:1}
.modal-eyebrow{font-family:var(--mono); font-size:11px; letter-spacing:.2em; color:var(--ink-3); text-transform:uppercase; margin-bottom:10px}
.modal h3{font-family:var(--serif); font-weight:300; font-size:34px; line-height:1; letter-spacing:-.02em; margin:0 0 8px; color:var(--ink-0)}
.modal h3 em{color:var(--accent); font-style:italic}
.modal p.sub{margin:0 0 22px; color:var(--ink-2); font-size:15px; line-height:1.5}
.modal .row{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px}
.modal label{display:block; font-family:var(--mono); font-size:10px; letter-spacing:.18em; color:var(--ink-3); text-transform:uppercase; margin-bottom:6px}
.modal input,.modal textarea,.modal select{width:100%; background:rgba(255,255,255,.03); border:1px solid var(--line); border-radius:10px; padding:12px 14px; color:var(--ink-0); font:inherit; font-size:14px; outline:none; transition:border-color .2s, background .2s}
.modal input:focus,.modal textarea:focus,.modal select:focus{border-color:var(--accent); background:rgba(176,255,102,.04)}
.modal textarea{min-height:92px; resize:vertical; font-family:inherit}
.modal .actions{display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:18px}
.modal .actions small{color:var(--ink-3); font-size:12px}
.modal .close{position:absolute; top:14px; right:14px; width:34px; height:34px; border-radius:50%; border:1px solid var(--line); background:transparent; color:var(--ink-1); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s, color .2s}
.modal .close:hover{background:rgba(255,255,255,.06); color:var(--ink-0)}
.modal .sent{text-align:center; padding:10px 0}
.modal .sent h3{margin-bottom:10px}
.modal .sent p{margin:0 auto; max-width:40ch}
@media (max-width:540px){.modal .row{grid-template-columns:1fr}}

`;

const inlineScripts = `

/* ---------- Nav scrolled ---------- */
(() => {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
  onScroll(); addEventListener('scroll', onScroll, {passive:true});
})();

/* ---------- Reveal on scroll ---------- */
(() => {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ---------- Hero reveal ---------- */
addEventListener('load', () => {
  document.querySelector('.hero').classList.add('revealed');
});

/* ---------- Magnetic buttons ---------- */
(() => {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = 18;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top  - r.height/2;
      el.style.transform = \`translate(\${x/r.width * strength}px, \${y/r.height * strength}px)\`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
})();

/* ---------- Card tilt ---------- */
(() => {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const mx = ((e.clientX - r.left)/r.width) * 100;
      const my = ((e.clientY - r.top)/r.height) * 100;
      el.style.setProperty('--mx', mx + '%');
      el.style.setProperty('--my', my + '%');
      const rx = ((e.clientY - r.top - r.height/2) / r.height) * -4;
      const ry = ((e.clientX - r.left - r.width/2) / r.width) * 4;
      el.style.transform = \`translateY(-4px) perspective(900px) rotateX(\${rx}deg) rotateY(\${ry}deg)\`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
})();

/* ---------- Stats counter ---------- */
(() => {
  const el = document.querySelector('[data-count]');
  if (!el) return;
  const target = parseInt(el.dataset.count, 10);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const dur = 1600;
      const tick = now => {
        const p = Math.min(1, (now - start)/dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    });
  }, { threshold: 0.5 });
  io.observe(el);
})();

/* ---------- Inventory grid generator ---------- */
(() => {
  const g = document.getElementById('inv-grid');
  if (!g) return;
  const skus = ['X-101','A-22','B-09','T-77','R-3','Q-41','P-18','S-54','D-09','M-66','V-12','N-88','K-2','Z-99','H-14','J-5','L-8','F-31'];
  skus.forEach((sku,i)=>{
    const div = document.createElement('div');
    const lo = [2,7,14].includes(i);
    div.className = 'inv-cell ' + (lo ? 'lo' : 'ok');
    div.textContent = sku;
    g.appendChild(div);
  });
})();

/* ---------- Sticky scene switcher ---------- */
(() => {
  const steps = document.querySelectorAll('.step');
  const scenes = document.querySelectorAll('.scene');
  const arc = document.getElementById('time-arc');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const key = e.target.dataset.scene;
      scenes.forEach(s => s.classList.toggle('active', s.dataset.scene === key));
      if (key === 'time' && arc){
        const len = 502;
        arc.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)';
        arc.style.strokeDashoffset = (len * 0.28);
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  steps.forEach(s => io.observe(s));
})();

/* ---------- Three.js Hero — Cinematic Sonnensystem ----------
   Nebel-Skybox (3-oktaviges FBM), prozedurale Shader-Oberflächen pro
   Planet, echte Sonnen-Beleuchtung mit Tag/Nacht-Terminator und
   Fresnel-Atmosphäre, Saturn-artige Ringe auf Zeiterfassung, Corona-
   Shells, Sprite-Flare. Performance: PixelRatio 1.5, Sphere-Segmente
   moderat, Pause wenn Hero offscreen, Delta-Cap.
---------------------------------------------------------------- */
(() => {
  const canvas = document.getElementById('hero-canvas');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero || !window.THREE) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias:true, alpha:false, powerPreference:'high-performance'
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 2, 0.1, 300);
  camera.position.set(0, 1.7, 10.5);
  camera.lookAt(0, 0, 0);

  /* ------- Shared shader chunks ------- */
  const NOISE_GLSL = \`
    vec3 mod289_3(vec3 x){return x-floor(x*(1./289.))*289.;}
    vec4 mod289_4(vec4 x){return x-floor(x*(1./289.))*289.;}
    vec4 permute(vec4 x){return mod289_4(((x*34.)+1.)*x);}
    vec4 tiSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0,0.5,1.0,2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289_3(i);
      vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 xx = x_ * ns.x + ns.yyyy;
      vec4 yy = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(xx) - abs(yy);
      vec4 b0 = vec4(xx.xy, yy.xy);
      vec4 b1 = vec4(xx.zw, yy.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 P0 = vec3(a0.xy,h.x);
      vec3 P1 = vec3(a0.zw,h.y);
      vec3 P2 = vec3(a1.xy,h.z);
      vec3 P3 = vec3(a1.zw,h.w);
      vec4 norm = tiSqrt(vec4(dot(P0,P0), dot(P1,P1), dot(P2,P2), dot(P3,P3)));
      P0 *= norm.x; P1 *= norm.y; P2 *= norm.z; P3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m*m;
      return 42.0 * dot(m*m, vec4(dot(P0,x0), dot(P1,x1), dot(P2,x2), dot(P3,x3)));
    }
    float fbm(vec3 p){
      float v = 0.0; float a = 0.5;
      for(int i=0; i<4; i++){
        v += a * snoise(p);
        p = p*2.03 + vec3(11.3, 5.7, 17.2);
        a *= 0.5;
      }
      return v;
    }
    float fbm3(vec3 p){
      float v = 0.0; float a = 0.55;
      for(int i=0; i<3; i++){ v += a * snoise(p); p *= 2.07; a *= 0.5; }
      return v;
    }
    // Ridged noise — nur 3 Oktaven für Grate/Risse
    float ridged(vec3 p){
      float v = 0.0; float a = 0.55;
      for(int i=0; i<3; i++){
        float n = 1.0 - abs(snoise(p));
        v += a * n * n;
        p = p*2.11 + vec3(3.1, 7.7, 1.3);
        a *= 0.5;
      }
      return v;
    }
    // Domain warp (günstig: 3-Oktaven-Basis)
    vec3 warp(vec3 p, float s){
      vec3 q = vec3(fbm3(p), fbm3(p + vec3(5.2,1.3,7.1)), fbm3(p + vec3(9.1,3.3,2.7)));
      return p + q * s;
    }
    // Reinhard + Gamma
    vec3 tonemap(vec3 c){
      c = c / (c + vec3(1.0));
      return pow(c, vec3(1.0/2.2));
    }
  \`;

  /* ------- Skybox: sauberes tiefes Schwarz, nur Stern-Pinpricks ------- */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(120, 24, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: \`
        varying vec3 vWp;
        void main(){
          vWp = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      \`,
      fragmentShader: \`
        varying vec3 vWp;
        void main(){
          vec3 d = normalize(vWp);
          // Reines Schwarz — kein fbm, kein Nebel, kein Farbverlauf
          vec3 col = vec3(0.0);
          // Sparse Stern-Pinpricks über Hash (sehr sauber)
          float h  = fract(sin(dot(d.xy * 950.0, vec2(12.9898, 78.233))) * 43758.5453);
          col += pow(h, 260.0) * vec3(1.0, 0.96, 0.90) * 1.2;
          float h2 = fract(sin(dot(d.zy * 430.0, vec2(23.1, 98.77))) * 27864.27);
          col += pow(h2, 380.0) * vec3(0.85, 0.93, 1.0) * 0.9;
          gl_FragColor = vec4(col, 1.0);
        }
      \`
    })
  );
  scene.add(sky);

  /* ------- Vordergrund-Sterne (zusätzliche Helligkeits-Schicht) ------- */
  const FS_COUNT = reduceMotion ? 140 : 320;
  const fsPos = new Float32Array(FS_COUNT * 3);
  for (let i = 0; i < FS_COUNT; i++) {
    const r = 25 + Math.random() * 45;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    fsPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
    fsPos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    fsPos[i*3+2] = r * Math.cos(ph);
  }
  const fsGeo = new THREE.BufferGeometry();
  fsGeo.setAttribute('position', new THREE.BufferAttribute(fsPos, 3));
  const fgStars = new THREE.Points(fsGeo, new THREE.PointsMaterial({
    size: 0.11, color: 0xffffff, transparent:true, opacity: 0.85,
    sizeAttenuation:true, depthWrite:false
  }));
  scene.add(fgStars);

  /* ------- System-Gruppe (gekippt) ------- */
  const system = new THREE.Group();
  system.rotation.x = -0.58;
  system.rotation.z = 0.08;
  scene.add(system);

  /* ------- SONNE ------- */
  const sunGroup = new THREE.Group();
  system.add(sunGroup);

  const sunMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: \`
      varying vec3 vP;
      varying vec3 vN;
      void main(){
        vP = position;
        vN = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    \`,
    fragmentShader: NOISE_GLSL + \`
      varying vec3 vP;
      varying vec3 vN;
      uniform float uTime;
      void main(){
        float t = uTime * 0.3;
        vec3 p = vP * 1.7 + vec3(t);
        float n  = fbm(p);
        float n2 = fbm3(p * 2.3 - vec3(t*0.55));
        float n3 = fbm3(p * 5.0 + vec3(t*0.8));

        vec3 hot   = vec3(1.00, 0.94, 0.78);
        vec3 warm  = vec3(1.00, 0.52, 0.18);
        vec3 deep  = vec3(0.72, 0.18, 0.08);
        vec3 cool  = vec3(0.55, 0.22, 0.78);
        vec3 accent= vec3(0.80, 1.00, 0.30);

        vec3 col = mix(warm, hot, smoothstep(-0.15, 0.5, n));
        col = mix(col, deep,  smoothstep(0.45, 0.95, -n2) * 0.7);
        col = mix(col, cool,  smoothstep(0.6, 1.0, -n2) * 0.35);
        // lime plasma highlights (brand)
        col += accent * pow(max(n * 0.6 + n3, 0.0), 5.0) * 0.9;
        // granulation detail
        col += vec3(1.0) * pow(max(n3, 0.0), 6.0) * 0.5;

        // limb darkening
        float limb = pow(max(dot(normalize(vN), vec3(0.0, 0.0, 1.0)), 0.0), 0.48);
        col *= 0.38 + limb * 0.95;
        col *= 1.65;

        gl_FragColor = vec4(col, 1.0);
      }
    \`
  });
  const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.92, 96, 72), sunMat);
  sunGroup.add(sunCore);

  // Corona-Shells (additive)
  const coronaShell = (r, hex, op) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(r, 32, 32),
      new THREE.MeshBasicMaterial({
        color: hex, transparent:true, opacity:op, side:THREE.BackSide,
        blending: THREE.AdditiveBlending, depthWrite:false
      })
    );
    sunGroup.add(m);
    return m;
  };
  const coronaA = coronaShell(1.08, 0xffc266, 0.30);
  const coronaB = coronaShell(1.40, 0xc6ff3c, 0.16);
  const coronaC = coronaShell(1.90, 0x7a5cff, 0.09);
  const coronaD = coronaShell(2.60, 0xff4d8d, 0.04);

  // Lens-flare/Glow-Sprite
  const flareTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(128,128,0,128,128,128);
    grad.addColorStop(0.00, 'rgba(255,240,200,1)');
    grad.addColorStop(0.22, 'rgba(255,180,80,0.55)');
    grad.addColorStop(0.55, 'rgba(198,255,60,0.15)');
    grad.addColorStop(1.00, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0,0,256,256);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  })();
  const flare = new THREE.Sprite(new THREE.SpriteMaterial({
    map: flareTex, transparent:true, opacity:0.8,
    blending: THREE.AdditiveBlending, depthWrite:false, depthTest:false
  }));
  flare.scale.set(6.0, 6.0, 1);
  sunGroup.add(flare);

  /* ------- PLANETEN ------- */
  const planetVertShader = \`
    varying vec3 vLocalN;
    varying vec3 vLocalP;
    varying vec3 vWorldP;
    varying vec3 vWorldN;
    void main(){
      vLocalN = normal;
      vLocalP = position;
      vWorldN = normalize(mat3(modelMatrix) * normal);
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldP = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  \`;

  const planetFrag = (unique) => NOISE_GLSL + \`
    varying vec3 vLocalN;
    varying vec3 vLocalP;
    varying vec3 vWorldP;
    varying vec3 vWorldN;
    uniform float uTime;
    uniform vec3  uSunPos;
    uniform vec3  uBase;
    uniform vec3  uAlt;
    uniform vec3  uAtmo;

    vec3 surface(vec3 op){
      vec3 c = uBase;
      \${unique}
      return c;
    }

    void main(){
      vec3 op     = normalize(vLocalN);
      vec3 worldN = normalize(vWorldN);
      vec3 sunDir = normalize(uSunPos - vWorldP);
      float NdotL = dot(worldN, sunDir);
      float lit   = max(NdotL, 0.0);

      vec3 col  = surface(op);
      vec3 day  = col * (0.30 + pow(lit, 0.8) * 1.25);
      vec3 night= col * 0.03;
      vec3 base = mix(night, day, smoothstep(-0.05, 0.20, NdotL)) + col * 0.05;

      // Terminator-Glow — sehr sanft, nur am Tag/Nacht-Übergang
      float term = smoothstep(-0.10, 0.22, NdotL) * (1.0 - smoothstep(0.18, 0.55, NdotL));
      base += uAtmo * term * 0.22;

      // Fresnel — STRIKT nur auf sonnenbeschienener Seite, kein Rand-Outline
      vec3 vDir  = normalize(cameraPosition - vWorldP);
      float fres = pow(1.0 - max(dot(worldN, vDir), 0.0), 3.2);
      float fresGate = smoothstep(0.05, 0.45, NdotL);
      base += uAtmo * fres * fresGate * 0.35;

      gl_FragColor = vec4(tonemap(base), 1.0);
    }
  \`;

  const SURF = {
    // EARTH — Kontinente, Ozeane, Polkappen, einfache Wolken
    postfach: \`
      vec3 wp = warp(op * 1.5, 0.3);
      float h = fbm(wp * 1.2);
      float land = smoothstep(-0.02, 0.18, h);
      vec3 ocean = vec3(0.04, 0.14, 0.26);
      vec3 grass = vec3(0.16, 0.36, 0.10);
      vec3 desert= vec3(0.62, 0.50, 0.22);
      float arid = smoothstep(-0.2, 0.45, fbm3(op * 1.8 + 4.0));
      vec3 landCol = mix(grass, desert, arid);
      float polar = smoothstep(0.75, 0.92, abs(op.y));
      landCol = mix(landCol, vec3(0.92,0.96,0.98), polar);
      c = mix(ocean, landCol, land);
      // Wolken direkt in Surface — 1 FBM statt 2
      float cl = smoothstep(0.05, 0.5, fbm3(op * 2.0 + uTime * 0.015));
      c = mix(c, vec3(0.96), cl * 0.32);
    \`,
    // ICE — gefrorene Strömungen, Polkappen
    buchhaltung: \`
      float h = fbm(op * 1.8);
      float rd = ridged(op * 2.8);
      vec3 deep  = vec3(0.03, 0.10, 0.20);
      vec3 shal  = vec3(0.18, 0.58, 0.68);
      vec3 frost = vec3(0.86, 0.96, 1.00);
      c = mix(deep, shal, smoothstep(-0.25, 0.35, h));
      c = mix(c, frost, smoothstep(0.55, 0.82, rd) * 0.85);
      float pol = smoothstep(0.55, 0.88, abs(op.y));
      c = mix(c, frost, pol);
    \`,
    // MARS — rostig, Krater, glühende Lavaadern
    inventur: \`
      float h  = fbm(op * 1.7);
      float rd = ridged(op * 2.8);
      vec3 rust = mix(vec3(0.30,0.08,0.04), vec3(0.80,0.30,0.14), smoothstep(-0.3, 0.55, h));
      c = mix(rust, vec3(0.14,0.04,0.02), smoothstep(0.35, 0.8, rd));
      float pol = smoothstep(0.78, 0.94, abs(op.y));
      c = mix(c, vec3(0.88,0.82,0.76), pol);
      float lava = smoothstep(0.80, 0.94, ridged(op * 3.6));
      c += vec3(1.4, 0.48, 0.10) * lava;
    \`,
    // GAS GIANT — breite Bänder mit Wirbeln, Great Spot
    zeiterfassung: \`
      float y = op.y;
      vec3 wp = warp(vec3(op.x, y*2.2, op.z), 0.5);
      float turb = fbm3(wp * 2.0 + uTime * 0.03);
      float bands = sin(y * 7.0 + turb * 2.4);
      c = mix(uAlt, uBase, smoothstep(-0.55, 0.55, bands));
      vec2 sp = op.xy - vec2(0.32, -0.08);
      float spot = exp(-dot(sp, sp) * 26.0);
      c = mix(c, vec3(0.92, 0.55, 0.78), spot * 0.8);
    \`,
    // MOON — Basaltmeer, Krater
    team: \`
      float h = fbm(op * 2.2);
      float mare = smoothstep(-0.02, -0.25, h);
      vec3 high = vec3(0.72, 0.70, 0.66);
      vec3 low  = vec3(0.18, 0.17, 0.16);
      c = mix(high, low, mare);
      float rd = ridged(op * 3.8);
      c += vec3(0.18,0.16,0.14) * smoothstep(0.55, 0.88, rd);
      float bowl = smoothstep(0.72, 0.92, fbm3(op * 5.0));
      c *= 1.0 - bowl * 0.4;
    \`,
    // ENERGY — pulsierende Adern
    sekretarin: \`
      vec3 wp = warp(op * 2.0, 0.4);
      float veins = ridged(wp * 3.2);
      float glow = smoothstep(0.78, 0.92, veins);
      float pulse = 0.75 + 0.25 * sin(uTime * 1.3);
      c = vec3(0.04, 0.08, 0.02) + fbm3(op * 3.0) * 0.04 * vec3(0.3,1.0,0.2);
      c += vec3(1.3, 2.0, 0.5) * glow * pulse;
    \`
  };

  const modules = [
    { name:'Postfach',      r:2.25, size:0.30, speed:0.26, phase:0.3, tilt:0.03,
      surf: SURF.postfach,
      base:[0.60,0.88,0.20], alt:[0.11,0.22,0.04], atmo:[0.78,1.00,0.28] },
    { name:'Buchhaltung',   r:3.10, size:0.40, speed:0.19, phase:1.6, tilt:-0.05,
      surf: SURF.buchhaltung,
      base:[0.25,0.88,0.82], alt:[0.03,0.12,0.20], atmo:[0.22,0.95,0.88] },
    { name:'Inventur',      r:3.90, size:0.28, speed:0.15, phase:3.0, tilt:0.04,
      surf: SURF.inventur,
      base:[0.55,0.14,0.28], alt:[0.22,0.04,0.10], atmo:[1.00,0.35,0.55] },
    { name:'Zeiterfassung', r:4.95, size:0.55, speed:0.11, phase:4.7, tilt:-0.03,
      surf: SURF.zeiterfassung,
      base:[0.52,0.38,0.95], alt:[0.12,0.08,0.28], atmo:[0.58,0.45,1.00], rings:true },
    { name:'Team',          r:6.10, size:0.34, speed:0.09, phase:5.9, tilt:0.05,
      surf: SURF.team,
      base:[0.82,0.80,0.76], alt:[0.30,0.28,0.25], atmo:[0.92,0.88,0.85] },
    { name:'Sekretärin',    r:7.15, size:0.22, speed:0.07, phase:1.2, tilt:-0.04,
      surf: SURF.sekretarin,
      base:[0.78,1.00,0.30], alt:[0.15,0.20,0.07], atmo:[0.78,1.00,0.30], future:true },
  ];

  const planets = [];
  modules.forEach(m => {
    // Orbit-Ring
    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(m.r - 0.004, m.r + 0.004, 220),
      new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent:true,
        opacity: m.future ? 0.04 : 0.08,
        side: THREE.DoubleSide, depthWrite:false
      })
    );
    orbit.rotation.x = Math.PI / 2 + m.tilt;
    system.add(orbit);

    // Planet — hochauflösend
    const geo = new THREE.SphereGeometry(m.size, 128, 96);
    const mat = new THREE.ShaderMaterial({
      extensions: { derivatives: true },
      uniforms: {
        uTime:   { value: 0 },
        uSunPos: { value: new THREE.Vector3() },
        uBase:   { value: new THREE.Color(...m.base) },
        uAlt:    { value: new THREE.Color(...m.alt) },
        uAtmo:   { value: new THREE.Color(...m.atmo) }
      },
      vertexShader: planetVertShader,
      fragmentShader: planetFrag(m.surf)
    });
    const mesh = new THREE.Mesh(geo, mat);
    system.add(mesh);

    // Atmosphären-Glow (additive Backside) — dezent, kein harter Rand
    const atm = new THREE.Mesh(
      new THREE.SphereGeometry(m.size * 1.10, 32, 24),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(...m.atmo),
        transparent:true, opacity: m.future ? 0.04 : 0.07,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite:false
      })
    );
    mesh.add(atm);

    // Saturn-artige Ringe (nur Zeiterfassung)
    let ring = null;
    if (m.rings) {
      const rIn  = m.size * 1.55;
      const rOut = m.size * 2.70;
      ring = new THREE.Mesh(
        new THREE.RingGeometry(rIn, rOut, 192, 1),
        new THREE.ShaderMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
          uniforms: {
            uInner:  { value: rIn },
            uOuter:  { value: rOut },
            uSunPos: { value: new THREE.Vector3() },
            uColA:   { value: new THREE.Color(0.32, 0.22, 0.52) },
            uColB:   { value: new THREE.Color(0.78, 0.68, 0.98) }
          },
          vertexShader: \`
            varying vec3 vL;
            varying vec3 vW;
            void main(){
              vL = position;
              vW = (modelMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0);
            }
          \`,
          fragmentShader: NOISE_GLSL + \`
            varying vec3 vL;
            varying vec3 vW;
            uniform float uInner, uOuter;
            uniform vec3  uSunPos;
            uniform vec3  uColA, uColB;
            void main(){
              float rr = length(vL.xy);
              float rn = clamp((rr - uInner) / (uOuter - uInner), 0.0, 1.0);
              float bands = 0.5 + 0.5 * sin(rn * 170.0 + fbm(vec3(rn*28.0, 0.0, 0.0))*4.0);
              float detail = fbm(vec3(rn*75.0, atan(vL.y, vL.x)*3.0, 0.0));
              // Cassini-ähnliche Lücken
              float gap1 = smoothstep(0.32, 0.36, rn) * (1.0 - smoothstep(0.36, 0.42, rn));
              float gap2 = smoothstep(0.70, 0.73, rn) * (1.0 - smoothstep(0.73, 0.76, rn));
              vec3 col = mix(uColA, uColB, bands * 0.8 + detail * 0.25);
              float alpha = 0.82;
              alpha *= (1.0 - gap1 * 0.92);
              alpha *= (1.0 - gap2 * 0.82);
              alpha *= smoothstep(0.0, 0.06, rn) * smoothstep(1.0, 0.92, rn);
              alpha *= 0.62 + detail * 0.4;
              // Sonnen-Beleuchtung
              vec3 sDir = normalize(uSunPos - vW);
              float lit = abs(sDir.y) * 0.55 + 0.5;
              col *= lit;
              gl_FragColor = vec4(col, alpha);
            }
          \`
        })
      );
      ring.rotation.x = -Math.PI/2 + 0.18;
      ring.rotation.z = 0.12;
      system.add(ring);
    }

    planets.push({ mesh, mat, ring, def: m });
  });

  /* ------- Interaktion & Scroll ------- */
  let tmx = 0, tmy = 0, mx = 0, my = 0;
  addEventListener('pointermove', e => {
    tmx = (e.clientX / innerWidth) - 0.5;
    tmy = (e.clientY / innerHeight) - 0.5;
  }, { passive:true });

  let scrollY_v = 0;
  addEventListener('scroll', () => {
    scrollY_v = Math.min(scrollY / innerHeight, 1.2);
  }, { passive:true });

  const resize = () => {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener('resize', resize);

  /* ------- Pause wenn offscreen ------- */
  let visible = true;
  new IntersectionObserver(entries => {
    entries.forEach(e => visible = e.isIntersecting);
  }, { threshold: 0 }).observe(hero);

  /* ------- Loop ------- */
  const sunWorldPos = new THREE.Vector3();
  const start = performance.now();
  let last = start, lastRender = 0;
  const FRAME_MS = 1000 / 60; // 60 fps — Szene ist schlank genug

  const animate = () => {
    requestAnimationFrame(animate);
    if (!visible) return;
    const now = performance.now();
    if (now - lastRender < FRAME_MS) return;
    lastRender = now;
    const dt = Math.min((now - last) / 1000, 1/20);
    last = now;
    const t = (now - start) / 1000;

    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;

    system.rotation.y = t * 0.028 + mx * 0.26;
    system.rotation.x = -0.58 + my * 0.09 - scrollY_v * 0.16;
    system.position.y = -scrollY_v * 0.7;

    // Sonne
    sunMat.uniforms.uTime.value = t;
    sunCore.rotation.y = t * 0.08;
    const pulse = 1 + Math.sin(t * 0.9) * 0.018;
    sunCore.scale.setScalar(pulse);
    coronaB.material.opacity = 0.14 + Math.sin(t * 1.1) * 0.04;
    coronaC.material.opacity = 0.08 + Math.sin(t * 0.7 + 1.2) * 0.03;
    flare.material.opacity   = 0.7  + Math.sin(t * 1.2) * 0.08;

    sunGroup.getWorldPosition(sunWorldPos);

    // Planeten
    for (let i = 0; i < planets.length; i++) {
      const { mesh, mat, ring, def } = planets[i];
      const a = def.phase + t * def.speed;
      const px = Math.cos(a) * def.r;
      const py = Math.sin(a * 0.55 + def.tilt * 4.0) * 0.22;
      const pz = Math.sin(a) * def.r;
      mesh.position.set(px, py, pz);
      mesh.rotation.y += dt * 0.18;
      mat.uniforms.uTime.value = t;
      mat.uniforms.uSunPos.value.copy(sunWorldPos);
      if (ring) {
        // Ring folgt Planet, behält Welt-Tilt
        ring.position.set(px, py, pz);
        ring.material.uniforms.uSunPos.value.copy(sunWorldPos);
      }
    }

    // Skybox + Sterne leicht drehen
    sky.rotation.y = t * 0.002;
    fgStars.rotation.y = t * 0.004;

    renderer.render(scene, camera);
  };
  animate();

  // Für Orbit-Canvas freigeben
  window.NILL_PLANET = { NOISE_GLSL, planetVertShader, planetFrag, SURF, modules };
})();



(function(){
  const modal = document.getElementById('leadModal');
  const form  = document.getElementById('leadF');
  const sent  = document.getElementById('leadSent');
  const wrap  = document.getElementById('leadForm');
  const intent = document.getElementById('leadIntent');
  const title = document.getElementById('leadTitle');
  const sub   = document.getElementById('leadSub');
  const eye   = document.getElementById('leadEyebrow');

  const PRESETS = {
    'Allgemeine Anfrage':{t:'Lass uns <em>reden.</em>', s:'Kurz ein paar Infos — wir melden uns innerhalb von 24 h zurück.'},
    'Demo':{t:'Live-Demo <em>anfragen.</em>', s:'Terminvorschlag per Mail, persönlich via Videocall — gezeigt, was dir wirklich Zeit spart.'},
    'Paket':{t:'Paket <em>wählen.</em>', s:'Wir konfigurieren Module & Preis gemeinsam — passend zu Betriebsgröße und Zielsystemen.'},
    'Gespräch':{t:'Kurzes <em>Gespräch.</em>', s:'15 Minuten reichen. Wir hören zu, beraten ehrlich und ohne Sales-Druck.'},
    'Frühzugang':{t:'Frühzugang <em>sichern.</em>', s:'Sekretärin ist in Bearbeitung. Erste Plätze gehen an Bestandskunden und Frühanfragen.'},
    'Termin':{t:'Termin <em>buchen.</em>', s:'Sag uns Zeitraum und Kanal — Telefon, Videocall oder vor Ort.'},
  };
  const keyFor = s => !s?'Allgemeine Anfrage':/demo/i.test(s)?'Demo':/paket|preis/i.test(s)?'Paket':/gespräch|gespraech/i.test(s)?'Gespräch':/früh|preview|fruh/i.test(s)?'Frühzugang':/termin/i.test(s)?'Termin':'Allgemeine Anfrage';

  function open(intentText){
    const key = keyFor(intentText);
    const p = PRESETS[key];
    intent.value = intentText || key;
    eye.textContent = 'NILL · ' + (intentText || key);
    title.innerHTML = p.t;
    sub.textContent = p.s;
    wrap.style.display='block'; sent.style.display='none';
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setTimeout(()=>{const f=modal.querySelector('input[name=name]'); f&&f.focus();},220);
  }
  function close(){ modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

  // ESC + backdrop + close buttons
  modal.addEventListener('click', e=>{ if(e.target.matches('[data-close]')) close(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && modal.classList.contains('is-open')) close(); });

  // Hook: every #cta link + data-intent CTAs + mailto to hallo@nillai.de
  document.querySelectorAll('a[href="#cta"], a[href^="mailto:hallo@nillai.de"], [data-cta]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const intentText = a.getAttribute('data-intent') || a.textContent.trim();
      open(intentText);
    });
  });

  // Submit via mailto
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const d = new FormData(form);
    const name = (d.get('name')||'').toString().trim();
    const email = (d.get('email')||'').toString().trim();
    if(!name || !email){ form.reportValidity(); return; }
    const subj = encodeURIComponent(\`NILL · \${d.get('intent')||'Anfrage'} — \${name}\`);
    const body = encodeURIComponent(
      \`Anliegen: \${d.get('intent')||'—'}\\nName: \${name}\\nFirma: \${d.get('company')||'—'}\\nE-Mail: \${email}\\nTelefon: \${d.get('phone')||'—'}\\n\\n\${d.get('message')||''}\\n\\n— Gesendet von nillai.de\`
    );
    window.location.href = \`mailto:hallo@nillai.de?subject=\${subj}&body=\${body}\`;
    wrap.style.display='none'; sent.style.display='block';
  });

  // expose
  window.NILL_openLead = open;
})();

`;

export default function LandingPage() {
  useEffect(() => {
    // Inject CSS
    const styleEl = document.createElement("style");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Set page title
    document.title = "NILL — Intelligenz, die mitarbeitet.";

    // Load Three.js, then run inline scripts
    const threeScript = document.createElement("script");
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    threeScript.onload = () => {
      const scriptEl = document.createElement("script");
      scriptEl.textContent = inlineScripts;
      document.body.appendChild(scriptEl);
    };
    document.head.appendChild(threeScript);

    return () => {
      styleEl.remove();
      threeScript.remove();
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `


<!-- overlay layers -->
<div class="vignette" aria-hidden="true"></div>

<!-- =========================================================
     NAV
     ========================================================= -->
<header class="nav" id="nav">
  <div class="wrap">
    <a class="brand" href="#top">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>NILL</span>
    </a>
    <nav aria-label="Primary">
      <ul>
        <li><a href="#produkte">Produkte</a></li>
        <li><a href="#wie">Wie es arbeitet</a></li>
        <li><a href="#preise">Preise</a></li>
        <li><a href="#nachhaltigkeit">Nachhaltigkeit</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
    </nav>
    <div class="nav-auth">
      <a href="https://app.nillai.de/login" class="btn-auth" rel="noopener">Login</a>
      <a href="https://app.nillai.de/register" class="btn-auth primary" rel="noopener">Registrieren</a>
    </div>
  </div>
</header>

<!-- =========================================================
     HERO
     ========================================================= -->
<section class="hero" id="top">
  <canvas id="hero-canvas"></canvas>

  <div class="wrap hero-inner">
    <span class="eyebrow hero-eyebrow">KI-Betriebssystem für Unternehmen</span>
    <h1 aria-label="Intelligenz, die mitarbeitet.">
      <span class="word"><span>Intelligenz,</span></span><br/>
      <span class="word"><span>die </span></span><span class="word"><span><em>mit­arbeitet.</em></span></span>
    </h1>
    <p class="lead">
      NILL verbindet <strong style="color:var(--ink);font-weight:500">Postfach, Buchhaltung, Inventur, Zeiterfassung</strong> und <strong style="color:var(--ink);font-weight:500">Teamverwaltung</strong> zu einem einzigen System — gesteuert von einer KI, die Arbeit erkennt, entscheidet und erledigt. Für kleine Handwerksbetriebe bis zum Mittelstand.
    </p>
    <div class="hero-cta">
      <a href="https://app.nillai.de/register" class="btn btn-primary magnetic" data-magnetic rel="noopener">
        <span>Kostenlos registrieren</span>
        <span class="arrow">→</span>
      </a>
      <a href="https://app.nillai.de/login" class="btn btn-ghost magnetic" data-magnetic rel="noopener">
        <span>Login</span>
        <span class="arrow">→</span>
      </a>
      <a href="#cta" class="btn btn-ghost magnetic" data-magnetic>
        <span>Live-Demo</span>
        <span class="arrow">↓</span>
      </a>
    </div>
  </div>

  <div class="hero-meta">
    <span>NILL v4 · Stand 2026</span>
    <div class="scroll-ind"><span>scroll</span><span class="bar"></span></div>
    <span>DE · Made in Germany</span>
  </div>
</section>

<!-- =========================================================
     TICKER
     ========================================================= -->
<div class="ticker">
  <div class="ticker-track" aria-hidden="true">
    <span>
      Postfach <em>·</em> Buchhaltung <span class="sep"></span>
      Inventur <em>·</em> Zeiterfassung <span class="sep"></span>
      Team­verwaltung <em>·</em> Sekretärin <span class="sep"></span>
      <em>Ein Login.</em> <span class="sep"></span>
      Postfach <em>·</em> Buchhaltung <span class="sep"></span>
      Inventur <em>·</em> Zeiterfassung <span class="sep"></span>
      Team­verwaltung <em>·</em> Sekretärin <span class="sep"></span>
      <em>Ein Login.</em> <span class="sep"></span>
    </span>
  </div>
</div>

<!-- =========================================================
     PRODUKTE BENTO
     ========================================================= -->
<section id="produkte">
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow">Module — 06</span>
        <h2>Sechs Module. <br/><em style="font-style:italic;color:var(--accent);font-family:var(--serif);font-variation-settings:&quot;opsz&quot; 144,&quot;SOFT&quot; 100,&quot;WONK&quot; 1">Eine</em> Intelligenz.</h2>
      </div>
      <p class="lead">Jedes Modul steht für sich — doch gemeinsam werden sie zu einem Gehirn, das dein Unternehmen versteht. Daten fließen nahtlos zwischen ihnen. Die KI lernt mit jedem Vorgang.</p>
    </div>

    <div class="bento reveal">

      <!-- Postfach -->
      <article class="card k1" data-tilt>
        <div class="viz" aria-hidden="true">
          <svg viewBox="0 0 600 380" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#c6ff3c" stop-opacity=".25"/>
                <stop offset="1" stop-color="#c6ff3c" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <g transform="translate(260,40)" opacity=".8">
              <g class="mail-row">
                <rect width="300" height="48" rx="8" fill="url(#mg)" stroke="rgba(255,255,255,.1)"/>
                <circle cx="22" cy="24" r="6" fill="#c6ff3c"/>
                <rect x="42" y="16" width="120" height="6" rx="3" fill="rgba(255,255,255,.6)"/>
                <rect x="42" y="28" width="200" height="4" rx="2" fill="rgba(255,255,255,.2)"/>
              </g>
              <g class="mail-row" transform="translate(0,60)">
                <rect width="300" height="48" rx="8" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.08)"/>
                <circle cx="22" cy="24" r="6" fill="#7a5cff"/>
                <rect x="42" y="16" width="100" height="6" rx="3" fill="rgba(255,255,255,.6)"/>
                <rect x="42" y="28" width="180" height="4" rx="2" fill="rgba(255,255,255,.2)"/>
              </g>
              <g class="mail-row" transform="translate(0,120)">
                <rect width="300" height="48" rx="8" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.08)"/>
                <circle cx="22" cy="24" r="6" fill="#38f5d0"/>
                <rect x="42" y="16" width="140" height="6" rx="3" fill="rgba(255,255,255,.6)"/>
                <rect x="42" y="28" width="160" height="4" rx="2" fill="rgba(255,255,255,.2)"/>
              </g>
              <g class="mail-row" transform="translate(0,180)">
                <rect width="300" height="48" rx="8" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.08)"/>
                <circle cx="22" cy="24" r="6" fill="#ff4d8d"/>
                <rect x="42" y="16" width="80" height="6" rx="3" fill="rgba(255,255,255,.6)"/>
                <rect x="42" y="28" width="220" height="4" rx="2" fill="rgba(255,255,255,.2)"/>
              </g>
            </g>
          </svg>
        </div>
        <div>
          <span class="tag"><span class="n">01</span> · Postfach</span>
          <h3>E-Mails, die sich <em style="font-style:italic;color:var(--accent)">selbst beantworten.</em></h3>
          <p>Kategorisieren, priorisieren, Antworten schreiben, Termine vorschlagen — NILL liest mit und arbeitet voraus. Freigabe per Klick.</p>
        </div>
      </article>

      <!-- Buchhaltung -->
      <article class="card k2" data-tilt>
        <div>
          <span class="tag"><span class="n">02</span> · Buchhaltung</span>
          <h3>Belege buchen. <em style="font-style:italic;color:var(--accent)">Ohne dich.</em></h3>
          <p>Rechnungen per Mail, Scan oder Foto — NILL erkennt, kontiert, verbucht und bereitet für den Steuerberater auf.</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; font-family:var(--mono); font-size:11px; color:var(--ink-dim)">
          <span style="padding:6px 10px; border:1px solid var(--line); border-radius:99px">DATEV-ready</span>
          <span style="padding:6px 10px; border:1px solid var(--line); border-radius:99px">OCR</span>
          <span style="padding:6px 10px; border:1px solid var(--line); border-radius:99px">GoBD-konform</span>
        </div>
      </article>

      <!-- Inventur -->
      <article class="card k3" data-tilt>
        <div class="viz" aria-hidden="true" style="opacity:.4">
          <svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice">
            <g transform="translate(30,120)">
              <rect width="40" height="100" rx="4" fill="rgba(198,255,60,.15)" stroke="rgba(198,255,60,.4)"/>
              <rect x="52" width="40" height="60" rx="4" y="40" fill="rgba(255,77,141,.12)" stroke="rgba(255,77,141,.4)"/>
              <rect x="104" width="40" height="80" rx="4" y="20" fill="rgba(198,255,60,.1)" stroke="rgba(198,255,60,.3)"/>
              <rect x="156" width="40" height="40" rx="4" y="60" fill="rgba(255,77,141,.2)" stroke="rgba(255,77,141,.5)"/>
              <rect x="208" width="40" height="90" rx="4" y="10" fill="rgba(198,255,60,.15)" stroke="rgba(198,255,60,.4)"/>
            </g>
          </svg>
        </div>
        <div>
          <span class="tag"><span class="n">03</span> · Inventur</span>
          <h3>Bestände, die sich <em style="font-style:italic;color:var(--accent)">selbst zählen.</em></h3>
          <p>Automatische Fortschreibung, Warnsystem bei Unterbestand, Prognosen auf Basis deiner Auftragslage.</p>
        </div>
      </article>

      <!-- Zeiterfassung -->
      <article class="card k4" data-tilt>
        <div>
          <span class="tag"><span class="n">04</span> · Zeiterfassung</span>
          <h3>Zeit erfasst sich <em style="font-style:italic;color:var(--accent)">von selbst.</em></h3>
          <p>Per App, Browser, Chip oder Sprachbefehl. NILL weist Projekte zu und erkennt Überstunden bevor sie entstehen.</p>
        </div>
        <div style="font-family:var(--mono); font-size:11px; color:var(--ink-dim); display:flex; justify-content:space-between;">
          <span>EuGH-konform</span>
          <span>GPS-optional</span>
        </div>
      </article>

      <!-- Teamverwaltung -->
      <article class="card k5" data-tilt>
        <div>
          <span class="tag"><span class="n">05</span> · Team­verwaltung</span>
          <h3>Das Team im <em style="font-style:italic;color:var(--accent)">Autopilot.</em></h3>
          <p>Urlaub, Krankmeldungen, Dienstpläne, Onboarding — alles an einem Ort, vorbereitet von der KI, bestätigt von dir.</p>
        </div>
        <div style="display:flex; gap:-8px">
          <span class="avatar" style="width:28px;height:28px;font-size:10px">MK</span>
          <span class="avatar" style="width:28px;height:28px;font-size:10px; background:linear-gradient(135deg,var(--accent),var(--accent-4)); margin-left:-10px">LS</span>
          <span class="avatar" style="width:28px;height:28px;font-size:10px; background:linear-gradient(135deg,var(--accent-3),var(--accent-2)); margin-left:-10px">JH</span>
          <span class="avatar" style="width:28px;height:28px;font-size:10px; background:linear-gradient(135deg,var(--accent-4),var(--accent-3)); margin-left:-10px">+9</span>
        </div>
      </article>

      <!-- KI Sekretärin -->
      <article class="card k6" data-tilt style="background:linear-gradient(90deg, #0c0c10 0%, #12130c 100%); border-color:rgba(198,255,60,.2)">
        <div>
          <span class="tag"><span class="n">06</span> · KI Sekretärin</span>
          <h3>Nimmt Anrufe entgegen. <em style="font-style:italic;color:var(--accent)">Rund um die Uhr.</em></h3>
        </div>
        <div class="cta">
          <span class="badge">In Bearbeitung — Q3 / 2026</span>
          <a href="#cta" class="btn btn-ghost" style="padding:10px 18px"><span>Frühzugang sichern</span><span class="arrow">→</span></a>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- =========================================================
     STICKY FEATURE WALKTHROUGH
     ========================================================= -->
<section id="wie">
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow">Wie es arbeitet — 05 Schritte</span>
        <h2>Ein Tag, <br/>von der <em style="font-style:italic;color:var(--accent);font-family:var(--serif);font-variation-settings:&quot;opsz&quot; 144,&quot;SOFT&quot; 100,&quot;WONK&quot; 1">KI</em> geführt.</h2>
      </div>
      <p class="lead">Scroll dich durch einen typischen Arbeitstag mit NILL. Links steht, was passiert — rechts siehst du, wie es passiert.</p>
    </div>

    <div class="feature-sticky">
      <div class="text-col">
        <div class="step" data-scene="inbox">
          <div class="step-index"><em>01</em> / Postfach</div>
          <h3>07:48 — Die erste Mail liegt schon beantwortet bereit.</h3>
          <p>NILL hat die Nacht durchgearbeitet. 47 E-Mails gesichtet, 12 automatisch beantwortet, 3 zur Freigabe vorbereitet, 1 eskaliert. Du öffnest dein Postfach — und es ist fast leer.</p>
        </div>
        <div class="step" data-scene="ledger">
          <div class="step-index"><em>02</em> / Buchhaltung</div>
          <h3>09:15 — Der Handwerker schickt die Rechnung per Foto.</h3>
          <p>OCR, Kontierung, Zuordnung zum richtigen Projekt, Rückfrage an den Mitarbeiter, Vorbereitung für DATEV — in 4&nbsp;Sekunden. Du siehst nur: „gebucht".</p>
        </div>
        <div class="step" data-scene="inventory">
          <div class="step-index"><em>03</em> / Inventur</div>
          <h3>11:02 — Zwei Artikel rutschen unter die Meldegrenze.</h3>
          <p>NILL kennt deinen Lieferanten, deine Rabattstufen, deine historische Liefertreue. Die Nachbestellung liegt auf deinem Schreibtisch. Du musst sie nur bestätigen.</p>
        </div>
        <div class="step" data-scene="time">
          <div class="step-index"><em>04</em> / Zeiterfassung</div>
          <h3>13:30 — Mittagspause. Erfasst sich selbst.</h3>
          <p>Keine App öffnen. Keine Buttons. Die KI erkennt Muster, Projekte, Pausen und Überstunden. EuGH-konform, GoBD-dokumentiert, ohne Reibung.</p>
        </div>
        <div class="step" data-scene="team">
          <div class="step-index"><em>05</em> / Team­verwaltung</div>
          <h3>16:48 — Zwei Krankmeldungen, ein Dienstplan neu.</h3>
          <p>NILL plant den Morgen um, informiert die betroffenen Kunden, schlägt den passenden Springer vor und legt alles auf deinen Tisch — zur einfachen Freigabe.</p>
        </div>
      </div>

      <div class="visual-col">
        <div class="feature-visual">
          <div class="device">
            <div class="dots"><span></span><span></span><span></span></div>
            <div class="device-frame" id="device-frame">

              <!-- scene inbox -->
              <div class="scene active" data-scene="inbox">
                <div class="inbox-row hi">
                  <span class="inbox-dot a"></span>
                  <span class="inbox-name">Kunde Müller GmbH</span>
                  <span class="inbox-snippet">Re: Angebot Sanierung — vielen Dank für …</span>
                  <span class="inbox-time">07:48</span>
                </div>
                <div class="inbox-row">
                  <span class="inbox-dot"></span>
                  <span class="inbox-name">DATEV</span>
                  <span class="inbox-snippet">Monatsreporting bereit</span>
                  <span class="inbox-time">06:02</span>
                </div>
                <div class="inbox-row">
                  <span class="inbox-dot b"></span>
                  <span class="inbox-name">L. Schröder</span>
                  <span class="inbox-snippet">Urlaubsantrag 12.—19.08.</span>
                  <span class="inbox-time">05:55</span>
                </div>
                <div class="ai-reply">
                  Sehr geehrte Frau Müller, vielen Dank für Ihre Rückmeldung. Wir bestätigen den Termin am <strong>23.04. um 09:00 Uhr</strong> und senden Ihnen …<span class="typing"></span>
                </div>
              </div>

              <!-- scene ledger -->
              <div class="scene" data-scene="ledger">
                <div class="ledger-head">
                  <span>Datum</span><span>Beleg</span><span>Konto</span><span>Betrag</span>
                </div>
                <div class="ledger-row">
                  <span>09.15</span>
                  <span>Rechnung <span class="cat">Elektro Baum</span></span>
                  <span>3400</span>
                  <span class="amount neg">−487,20</span>
                </div>
                <div class="ledger-row">
                  <span>09.14</span>
                  <span>Abschlag <span class="cat">Müller GmbH</span></span>
                  <span>8400</span>
                  <span class="amount pos">+12.400,00</span>
                </div>
                <div class="ledger-row">
                  <span>09.12</span>
                  <span>Tankbeleg <span class="cat">Fuhrpark</span></span>
                  <span>4530</span>
                  <span class="amount neg">−89,44</span>
                </div>
                <div class="ocr-blip"><span class="pulse"></span>OCR aktiv</div>
              </div>

              <!-- scene inventory -->
              <div class="scene" data-scene="inventory">
                <div class="inv-grid" id="inv-grid"></div>
                <div class="inv-legend">
                  <span>Bestand OK</span>
                  <span class="lo">Nachbestellen</span>
                </div>
              </div>

              <!-- scene time -->
              <div class="scene" data-scene="time">
                <div class="time-ring">
                  <svg class="time-svg" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="12"/>
                    <circle id="time-arc" cx="100" cy="100" r="80" fill="none" stroke="#c6ff3c" stroke-width="12" stroke-linecap="round" stroke-dasharray="502" stroke-dashoffset="502" transform="rotate(-90 100 100)"/>
                    <text x="100" y="96" text-anchor="middle" fill="#f5f3ee" font-family="Fraunces" font-size="40" letter-spacing="-2">6:42</text>
                    <text x="100" y="118" text-anchor="middle" fill="rgba(245,243,238,.5)" font-family="JetBrains Mono" font-size="10" letter-spacing="2">HEUTE · PROJEKT A</text>
                  </svg>
                </div>
              </div>

              <!-- scene team -->
              <div class="scene" data-scene="team">
                <div class="team-list">
                  <div class="team-tile"><span class="avatar">MK</span><div><div class="team-name">M. Keller</div><div class="team-role">im Dienst</div></div></div>
                  <div class="team-tile" style="border-color:rgba(255,77,141,.3); background:rgba(255,77,141,.04)"><span class="avatar" style="background:linear-gradient(135deg,var(--accent-3),var(--accent-2))">LS</span><div><div class="team-name">L. Schröder</div><div class="team-role" style="color:var(--accent-3)">krank</div></div></div>
                  <div class="team-tile"><span class="avatar" style="background:linear-gradient(135deg,var(--accent),var(--accent-4))">JH</span><div><div class="team-name">J. Hänisch</div><div class="team-role">im Dienst</div></div></div>
                  <div class="team-tile" style="border-color:rgba(255,77,141,.3); background:rgba(255,77,141,.04)"><span class="avatar" style="background:linear-gradient(135deg,var(--accent-4),var(--accent-3))">TB</span><div><div class="team-name">T. Baumann</div><div class="team-role" style="color:var(--accent-3)">krank</div></div></div>
                  <div class="team-tile" style="grid-column:1/-1; border-color:rgba(198,255,60,.4); background:rgba(198,255,60,.05)"><span class="avatar" style="background:var(--accent)">KI</span><div><div class="team-name">Vorschlag: Springer F. Wolf für Di. 08–14 Uhr</div><div class="team-role" style="color:var(--accent)">warten auf Freigabe</div></div></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- =========================================================
     STATS
     ========================================================= -->
<section style="padding: 40px 0 120px">
  <div class="wrap">
    <div class="stats reveal">
      <div class="stat">
        <div class="num"><em>3,5</em><span>×</span></div>
        <div class="label">Schneller im Alltag</div>
      </div>
      <div class="stat">
        <div class="num"><span data-count="87">0</span><em>%</em></div>
        <div class="label">Weniger manuelle Arbeit</div>
      </div>
      <div class="stat">
        <div class="num"><em>24</em><span>/</span><em>7</em></div>
        <div class="label">KI im Einsatz</div>
      </div>
      <div class="stat">
        <div class="num"><em>06</em><span>·</span><em>01</em></div>
        <div class="label">Module · Ein Login</div>
      </div>
    </div>
  </div>
</section>

<!-- =========================================================
     TESTIMONIALS
     ========================================================= -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow">Stimmen aus der Praxis</span>
        <h2>Was Teams <br/><em style="font-style:italic;color:var(--accent);font-family:var(--serif);font-variation-settings:&quot;opsz&quot; 144,&quot;SOFT&quot; 100,&quot;WONK&quot; 1">spüren.</em></h2>
      </div>
      <p class="lead">Kein Feature-Katalog. Sondern weniger Abende am Schreibtisch, weniger Suchen in Excel, weniger Rückfragen vom Steuerberater.</p>
    </div>

    <div class="quotes reveal">
      <figure class="quote">
        <blockquote>„Seit NILL läuft meine Buchhaltung <em>nebenbei.</em> Ich fotografiere den Beleg und vergesse ihn. Mein Steuerberater hat nichts mehr zu meckern."</blockquote>
        <footer><span class="avatar">MK</span><div><div class="name">Martin K.</div><div class="role">Inhaber · Sanitär-Meisterbetrieb</div></div></footer>
      </figure>
      <figure class="quote">
        <blockquote>„Das Postfach beantwortet sich selbst — <em>nüchtern und gut formuliert.</em> Ich prüfe nur noch und klicke auf senden."</blockquote>
        <footer><span class="avatar" style="background:linear-gradient(135deg,var(--accent-3),var(--accent-2))">SR</span><div><div class="name">Sandra R.</div><div class="role">Geschäftsführung · Logistik, 42 MA</div></div></footer>
      </figure>
      <figure class="quote">
        <blockquote>„Die Dienstpläne kommen automatisch. Wenn jemand krank ist, liegt der <em>Ersatz schon bereit.</em> Das spart Stunden pro Woche."</blockquote>
        <footer><span class="avatar" style="background:linear-gradient(135deg,var(--accent),var(--accent-4))">AH</span><div><div class="name">Andreas H.</div><div class="role">Teamleitung · Pflegedienst</div></div></footer>
      </figure>
    </div>
  </div>
</section>

<!-- =========================================================
     PRICING
     ========================================================= -->
<section id="preise">
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow">Preise — einfach gehalten</span>
        <h2>Eins. Zwei. <br/><em style="font-style:italic;color:var(--accent);font-family:var(--serif);font-variation-settings:&quot;opsz&quot; 144,&quot;SOFT&quot; 100,&quot;WONK&quot; 1">Drei.</em></h2>
      </div>
      <p class="lead">Alle Pakete beinhalten alle sechs Module. Der Unterschied liegt in Nutzerzahl, KI-Volumen und Support. Kündbar monatlich.</p>
    </div>

    <div class="pricing-grid reveal">
      <article class="price" data-tilt>
        <div>
          <span class="eyebrow">Start</span>
          <h3 style="margin-top:12px">Für Solo &amp; kleine Teams</h3>
        </div>
        <div class="price-tag"><span class="num">29</span><span class="per">€ / Monat · pro Nutzer</span></div>
        <ul>
          <li>Alle 6 Module, 1 Nutzer inkl.</li>
          <li>500 KI-Aktionen / Monat</li>
          <li>DATEV-Export</li>
          <li>E-Mail-Support</li>
        </ul>
        <a href="#cta" class="btn btn-ghost">Paket wählen <span class="arrow">→</span></a>
      </article>

      <article class="price pop" data-tilt>
        <span class="pop-chip">Meistgewählt</span>
        <div>
          <span class="eyebrow" style="color:var(--accent)">Pro</span>
          <h3 style="margin-top:12px">Für wachsende Betriebe</h3>
        </div>
        <div class="price-tag"><span class="num">99</span><span class="per">€ / Monat · Team bis 10</span></div>
        <ul>
          <li>Alle Module, bis 10 Nutzer</li>
          <li>Unbegrenzte KI-Aktionen</li>
          <li>API &amp; Webhooks</li>
          <li>Priority-Support &amp; Onboarding</li>
          <li>Dedizierter Steuerberater-Zugang</li>
        </ul>
        <a href="#cta" class="btn btn-primary">Demo vereinbaren <span class="arrow">→</span></a>
      </article>

      <article class="price" data-tilt>
        <div>
          <span class="eyebrow">Enterprise</span>
          <h3 style="margin-top:12px">Für Mittelstand</h3>
        </div>
        <div class="price-tag"><span class="num" style="font-size:52px">Ab Gespräch</span></div>
        <ul>
          <li>Unbegrenzte Nutzer</li>
          <li>Private Cloud / On-Prem</li>
          <li>Custom-Integrationen</li>
          <li>SLA &amp; Account-Manager</li>
          <li>DSGVO-Audit inkl.</li>
        </ul>
        <a href="#cta" class="btn btn-ghost">Gespräch anfragen <span class="arrow">→</span></a>
      </article>
    </div>
  </div>
</section>

<!-- =========================================================
     NACHHALTIGKEIT
     ========================================================= -->
<section id="nachhaltigkeit">
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow">Verantwortung statt Fußnote</span>
        <h2>Software, die <em>nicht heizt.</em></h2>
      </div>
      <p class="lead">
        KI verbraucht Strom. Also nehmen wir es ernst: NILL läuft, wo möglich, auf erneuerbaren Energien — und was nicht direkt grün betrieben werden kann, wird <strong style="color:var(--ink);font-weight:500">transparent kompensiert</strong>.
      </p>
    </div>

    <div class="nh-hero reveal">
      <div>
        <span class="eyebrow" style="color:var(--accent)">Unser Anspruch</span>
        <h3 style="margin-top:20px; font-size:clamp(34px, 4.4vw, 64px); letter-spacing:-.02em; line-height:1.02">
          100&nbsp;% <em>erneuerbar</em> &middot;<br/>
          100&nbsp;% <em>kompensiert.</em>
        </h3>
        <p>
          Wir betreiben unsere Inferenz-, Storage- und Büroinfrastruktur bevorzugt bei Rechenzentren mit nachweislich erneuerbarer Energie (Wasser, Wind, Sonne). Jeder Baustein, der sich heute noch nicht vollständig grün betreiben lässt — etwa Drittanbieter-APIs — wird über <strong style="color:var(--ink);font-weight:500">zertifizierte Gold-Standard-Projekte</strong> ausgeglichen. Wir veröffentlichen unsere Zahlen.
        </p>
      </div>
      <div class="nh-leaf" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#c6ff3c"/>
              <stop offset="1" stop-color="#38f5d0"/>
            </linearGradient>
          </defs>
          <path d="M100 20 C 45 55, 25 115, 45 165 C 95 170, 150 140, 170 80 C 155 55, 130 35, 100 20 Z"
                fill="url(#leafG)" opacity=".9"/>
          <path d="M100 20 C 95 80, 80 130, 45 165" stroke="#0a0a10" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/>
          <path d="M82 80 L 100 95 M 70 110 L 100 120 M 60 140 L 90 145"
                stroke="#0a0a10" stroke-width="2" stroke-linecap="round" opacity=".35"/>
        </svg>
      </div>
    </div>

    <div class="nh-stats reveal">
      <div class="nh-stat">
        <div class="val"><em>100</em>&thinsp;%</div>
        <span class="lbl">Rechenzentren erneuerbar</span>
        <p>Frankfurt &amp; Paris — Stromversorgung aus Wasserkraft und Wind, nachweislich über Herkunftsnachweise.</p>
      </div>
      <div class="nh-stat">
        <div class="val"><em>&lt;2</em>&thinsp;g</div>
        <span class="lbl">CO₂ pro KI-Anfrage</span>
        <p>Effiziente Modelle, Caching, Batching — jede Operation wird gemessen, nicht geschätzt.</p>
      </div>
      <div class="nh-stat">
        <div class="val"><em>105</em>&thinsp;%</div>
        <span class="lbl">Überkompensation</span>
        <p>Wir kompensieren 5&nbsp;% mehr als unser Fußabdruck — für Übergangsquartale und Messunsicherheit.</p>
      </div>
    </div>

    <div class="nh-pillars reveal">
      <article class="nh-pillar">
        <span class="num">01 / Strom</span>
        <h3>Grün&shy;strom zuerst.</h3>
        <p>Primärinfrastruktur bei Anbietern mit 100&nbsp;% Ökostrom (Wasser/Wind/Solar). Keine fossilen Backup-Verträge.</p>
      </article>
      <article class="nh-pillar">
        <span class="num">02 / Effizienz</span>
        <h3>Jedes Watt zählt.</h3>
        <p>Modell-Routing spart Tokens. Kalte Speicher statt heiße Kopien. Idle-Hardware wird automatisch schlafen gelegt.</p>
      </article>
      <article class="nh-pillar">
        <span class="num">03 / Kompensation</span>
        <h3>Gold Standard.</h3>
        <p>Was nicht grün geht, wird über zertifizierte Waldschutz- &amp; Clean-Cooking-Projekte kompensiert — mit öffentlicher Seriennummer.</p>
      </article>
    </div>

    <div class="nh-pledge reveal">
      <div class="big">
        <em>Transparenter Nachhaltigkeitsbericht</em> — jährlich, als PDF, mit Stromquellen, Emissionen pro Kundentenant und Kompensations-Zertifikaten.
      </div>
      <a href="mailto:hallo@nillai.de?subject=NILL%20·%20Nachhaltigkeitsbericht%20anfordern" class="btn btn-ghost" data-intent="Nachhaltigkeitsbericht">
        <span>Bericht anfordern</span>
        <span class="arrow">→</span>
      </a>
    </div>
  </div>
</section>

<!-- =========================================================
     FAQ
     ========================================================= -->
<section id="faq">
  <div class="wrap-tight">
    <div class="section-head reveal" style="margin-bottom:40px">
      <div>
        <span class="eyebrow">Antworten auf das Naheliegende</span>
        <h2>FAQ.</h2>
      </div>
    </div>
    <div class="faq reveal">
      <details>
        <summary>Wo werden meine Daten gespeichert?</summary>
        <p class="a">Alle Daten liegen verschlüsselt auf Servern in Deutschland (Frankfurt). Wir sind ISO&nbsp;27001-konform, nach DSGVO geprüft und bieten auf Wunsch eine Private-Cloud-Instanz.</p>
      </details>
      <details>
        <summary>Ersetzt NILL meinen Steuerberater?</summary>
        <p class="a">Nein — NILL bereitet alles so vor, dass dein Steuerberater deutlich weniger Zeit braucht. Dein Steuerberater bekommt einen dedizierten Zugang und kann direkt prüfen.</p>
      </details>
      <details>
        <summary>Wie lange dauert das Onboarding?</summary>
        <p class="a">Die meisten Teams sind in 48 Stunden produktiv. Wir importieren deine bestehenden E-Mail-Konten, DATEV-Listen und Mitarbeiterdaten automatisch.</p>
      </details>
      <details>
        <summary>Kann ich einzelne Module abschalten?</summary>
        <p class="a">Ja. Nutze nur, was du brauchst. Module lassen sich jederzeit aktivieren oder pausieren — ohne Vertragsanpassung.</p>
      </details>
      <details>
        <summary>Was passiert, wenn die KI einen Fehler macht?</summary>
        <p class="a">Jede automatische Aktion ist standardmäßig im "Vorschlags-Modus". Du entscheidest, was direkt geht, was freigegeben werden muss, und was dokumentiert wird. Jeder Schritt ist nachvollziehbar.</p>
      </details>
      <details>
        <summary>Wie nachhaltig ist NILL wirklich?</summary>
        <p class="a">Unsere Kern-Infrastruktur läuft auf Rechenzentren mit 100&nbsp;% Ökostrom. Drittanbieter, die wir noch nicht komplett grün betreiben können, kompensieren wir zu 105&nbsp;% über Gold-Standard-Projekte. Jährlicher Nachhaltigkeitsbericht mit Seriennummern der Kompensations-Zertifikate — auf Anfrage.</p>
      </details>
    </div>
  </div>
</section>

<!-- =========================================================
     BIG CTA
     ========================================================= -->
<section id="cta" class="cta-big">
  <div class="wrap">
    <h2 class="reveal">
      Lass deine KI <br/><em>anfangen</em><br/>zu arbeiten.
    </h2>
    <div class="sub reveal reveal-delay-1">
      <p class="lead">30&nbsp;Minuten Live-Demo mit einem unserer Produktspezialisten. Wir zeigen dir direkt an deinem Use-Case, wie NILL arbeitet.</p>
      <div style="display:flex; gap:12px; flex-wrap:wrap">
        <a href="mailto:hallo@nillai.de" class="btn btn-primary magnetic" data-magnetic><span>Termin buchen</span><span class="arrow">→</span></a>
        <a href="#produkte" class="btn btn-ghost magnetic" data-magnetic><span>Module</span><span class="arrow">↑</span></a>
      </div>
    </div>
  </div>
</section>

<!-- =========================================================
     FOOTER
     ========================================================= -->
<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="brand" style="margin-bottom:18px"><span class="brand-mark"></span><span>NILL</span></div>
        <p style="max-width:32ch">Das KI-Betriebssystem für Unternehmen. Gebaut in Deutschland, gehostet in Frankfurt.</p>
      </div>
      <div>
        <h4>Produkt</h4>
        <ul>
          <li><a href="#produkte">Module</a></li>
          <li><a href="#preise">Preise</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#">Changelog</a></li>
        </ul>
      </div>
      <div>
        <h4>Unternehmen</h4>
        <ul>
          <li><a href="#">Über uns</a></li>
          <li><a href="#">Karriere</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Presse</a></li>
        </ul>
      </div>
      <div>
        <h4>Rechtliches</h4>
        <ul>
          <li><a href="#">Impressum</a></li>
          <li><a href="#">Datenschutz</a></li>
          <li><a href="#">AGB</a></li>
          <li><a href="#">Sicherheit</a></li>
        </ul>
      </div>
    </div>
    <div class="wordmark">NILL<em>.</em></div>
    <div class="foot-meta">
      <span>© 2026 NILL GmbH · nillai.de</span>
      <span>Made with intelligence · Frankfurt a.M.</span>
    </div>
  </div>
</footer>

<!-- =========================================================
     SCRIPTS
     ========================================================= -->



<!-- =========================================================
     MODAL — Lead Form
     ========================================================= -->
<div class="modal" id="leadModal" role="dialog" aria-modal="true" aria-labelledby="leadTitle" aria-hidden="true">
  <div class="modal-bg" data-close></div>
  <div class="modal-panel">
    <button class="close" type="button" data-close aria-label="Schließen">×</button>
    <div id="leadForm">
      <div class="modal-eyebrow" id="leadEyebrow">NILL · Anfrage</div>
      <h3 id="leadTitle">Lass uns <em>reden.</em></h3>
      <p class="sub" id="leadSub">Kurz ein paar Infos — wir melden uns innerhalb von 24&nbsp;h zurück.</p>
      <form id="leadF" autocomplete="on" novalidate>
        <input type="hidden" name="intent" id="leadIntent" value="Allgemeine Anfrage">
        <div class="row">
          <div><label for="ln">Name</label><input id="ln" name="name" required placeholder="Vor- und Nachname"></div>
          <div><label for="lc">Unternehmen</label><input id="lc" name="company" placeholder="Firmenname"></div>
        </div>
        <div class="row">
          <div><label for="le">E-Mail</label><input id="le" name="email" type="email" required placeholder="du@firma.de"></div>
          <div><label for="lp">Telefon <span style="opacity:.5">· optional</span></label><input id="lp" name="phone" placeholder="+49 ..."></div>
        </div>
        <div><label for="lm">Nachricht</label><textarea id="lm" name="message" placeholder="Welches Modul interessiert dich? Was wäre der erste Schritt?"></textarea></div>
        <div class="actions">
          <small>Per Klick auf „Senden" wird dein Mailprogramm geöffnet.</small>
          <button type="submit" class="btn btn-primary magnetic"><span>Senden</span><span class="arrow">→</span></button>
        </div>
      </form>
    </div>
    <div class="sent" id="leadSent" style="display:none">
      <div class="modal-eyebrow">Gesendet · ✓</div>
      <h3>Danke, <em>wir sind dran.</em></h3>
      <p>Deine Anfrage ist im Postfach. Normalerweise antworten wir innerhalb weniger Stunden. Kein automatischer Funnel — ein Mensch.</p>
      <div class="actions" style="justify-content:center; margin-top:22px">
        <button type="button" class="btn btn-ghost" data-close><span>Schließen</span></button>
      </div>
    </div>
  </div>
</div>




        `
      }}
    />
  );
}
