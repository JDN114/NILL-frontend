import { useRef, useEffect, useState, useCallback } from "react";

const __css = `
:root{
  --bg:#040407;--bg-2:#08080c;--ink:#efede7;--ink-dim:rgba(239,237,231,.5);--ink-faint:rgba(239,237,231,.14);
  --line:rgba(239,237,231,.07);--glass:rgba(255,255,255,.035);--glass-strong:rgba(255,255,255,.06);
  --accent:#c6ff3c;--accent-2:#7a5cff;--accent-3:#ff4d8d;--accent-4:#38f5d0;
  --serif:"Fraunces","Iowan Old Style",Georgia,serif;
  --sans:"Inter",system-ui,sans-serif;--mono:"JetBrains Mono",monospace;
  --radius:18px;--radius-lg:28px;--ease:cubic-bezier(.2,.7,.2,1);--ease-out:cubic-bezier(.16,1,.3,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}
html{scroll-behavior:smooth}
img,svg,canvas{display:block;max-width:100%}
a{color:inherit;text-decoration:none;cursor:pointer}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
::selection{background:var(--accent);color:#000}

.vignette{position:fixed;inset:0;pointer-events:none;z-index:99;background:radial-gradient(140% 90% at 50% 10%,transparent 60%,rgba(0,0,0,.55) 100%)}
.wrap{width:min(1320px,100% - 48px);margin-inline:auto}
.wrap-tight{width:min(1040px,100% - 48px);margin-inline:auto}

.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-dim);display:inline-flex;align-items:center;gap:10px}
.eyebrow::before{content:"";width:22px;height:1px;background:currentColor;opacity:.6}

h1,h2,h3,h4{font-family:var(--serif);font-weight:400;font-variation-settings:"opsz" 144,"SOFT" 0,"WONK" 0;letter-spacing:-.02em;line-height:.95}
h1{font-size:clamp(56px,11vw,176px)}
h2{font-size:clamp(40px,7vw,112px);letter-spacing:-.025em}
h3{font-size:clamp(28px,3.4vw,52px);letter-spacing:-.02em}
p{font-size:clamp(15px,1.1vw,18px);line-height:1.55;color:var(--ink-dim)}
.lead{font-size:clamp(17px,1.4vw,22px);line-height:1.45;color:var(--ink);max-width:56ch}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:60;padding:18px 0;transition:backdrop-filter .4s,background .4s}
.nav.scrolled{backdrop-filter:blur(14px) saturate(140%);background:rgba(8,8,10,.55);border-bottom:1px solid var(--line)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;gap:24px}
.brand{display:flex;align-items:center;gap:12px;font-family:var(--serif);font-size:22px;letter-spacing:-.02em}
.brand-mark{width:28px;height:28px;border-radius:8px;background:conic-gradient(from 210deg,var(--accent),var(--accent-4),var(--accent-2),var(--accent-3),var(--accent));position:relative;overflow:hidden}
.brand-mark::after{content:"";position:absolute;inset:4px;border-radius:5px;background:var(--bg)}
.brand-mark::before{content:"";position:absolute;inset:-50%;background:conic-gradient(from 0deg,transparent 0 340deg,rgba(255,255,255,.6) 355deg,transparent 360deg);animation:spin 6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.nav ul{display:flex;gap:8px;list-style:none}
.nav ul a{font-size:13px;color:var(--ink-dim);padding:8px 14px;border-radius:99px;transition:color .25s,background .25s}
.nav ul a:hover{color:var(--ink);background:var(--glass)}
.nav-auth{display:flex;align-items:center;gap:8px}
.btn-auth{font-size:13px;color:var(--ink);padding:9px 16px;border-radius:99px;border:1px solid var(--line);background:transparent;transition:border-color .25s,background .25s,color .25s}
.btn-auth:hover{border-color:var(--ink);background:var(--glass)}
.btn-auth.primary{background:var(--accent);color:#050505;border-color:var(--accent)}
.btn-auth.primary:hover{background:#fff;border-color:#fff;color:#050505}
@media(max-width:860px){.nav ul{display:none}.btn-auth{padding:8px 12px;font-size:12px}}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:10px;padding:13px 22px;border-radius:99px;font-size:14px;font-weight:500;position:relative;overflow:hidden;isolation:isolate;transition:transform .35s var(--ease-out),color .3s}
.btn-primary{background:var(--accent);color:#050505}
.btn-primary::after{content:"";position:absolute;inset:0;z-index:-1;background:#fff;transform:translateY(101%);transition:transform .5s var(--ease-out)}
.btn-primary:hover::after{transform:translateY(0)}
.btn-ghost{border:1px solid var(--line);color:var(--ink);background:transparent}
.btn-ghost:hover{border-color:var(--ink);background:var(--glass)}
.btn .arrow{display:inline-block;transition:transform .3s var(--ease-out)}
.btn:hover .arrow{transform:translateX(4px)}

/* HERO */
.hero{position:relative;min-height:100vh;min-height:100svh;padding:140px 0 80px;display:flex;align-items:center;overflow:hidden}
.hero::after{content:"";position:absolute;left:0;right:0;bottom:0;height:35vh;background:linear-gradient(to bottom,transparent,var(--bg) 85%);z-index:2;pointer-events:none}
.hero-inner{position:relative;z-index:3;width:100%}
.hero-eyebrow{margin-bottom:24px}
.hero h1{margin-bottom:28px;max-width:14ch}
.hero h1 .word{display:inline-block;overflow:hidden;vertical-align:baseline}
.hero h1 .word>span{display:inline-block;transform:translateY(110%);transition:transform 1.1s var(--ease-out)}
.hero.revealed h1 .word>span{transform:translateY(0)}
.hero h1 em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.hero .lead{margin-bottom:44px;opacity:0;transform:translateY(20px);transition:opacity .9s .6s,transform .9s .6s var(--ease-out)}
.hero.revealed .lead{opacity:1;transform:none}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;opacity:0;transform:translateY(20px);transition:opacity .9s .85s,transform .9s .85s var(--ease-out)}
.hero.revealed .hero-cta{opacity:1;transform:none}
.hero-meta{position:absolute;left:24px;right:24px;bottom:26px;z-index:3;display:flex;justify-content:space-between;align-items:end;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim)}
.scroll-ind{display:flex;align-items:center;gap:10px}
.scroll-bar{width:1px;height:44px;background:var(--line);position:relative;overflow:hidden}
.scroll-bar::after{content:"";position:absolute;left:0;right:0;top:-50%;height:50%;background:var(--accent);animation:scrollbar 2.2s infinite}
@keyframes scrollbar{0%{top:-50%}100%{top:100%}}

/* CHIPS */
.hero-chips{position:absolute;inset:0;z-index:1;pointer-events:none}
.chip{position:absolute;padding:8px 14px;border-radius:99px;background:var(--glass-strong);border:1px solid var(--line);backdrop-filter:blur(14px);font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--ink);display:inline-flex;align-items:center;gap:8px;animation:float 9s ease-in-out infinite}
.chip-dot{width:6px;height:6px;border-radius:50%;background:var(--accent)}
.chip.c1{top:18%;left:6%;animation-delay:-1s}
.chip.c2{top:30%;right:8%;animation-delay:-3s}
.chip.c3{bottom:24%;left:12%;animation-delay:-5s}
.chip.c4{bottom:32%;right:14%;animation-delay:-7s}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}

/* TICKER */
.ticker{border-block:1px solid var(--line);padding:22px 0;overflow:hidden;background:linear-gradient(to right,var(--bg-2),var(--bg) 50%,var(--bg-2))}
.ticker-track{display:flex;gap:64px;white-space:nowrap;animation:ticker 40s linear infinite;font-family:var(--serif);font-size:clamp(24px,3vw,40px);letter-spacing:-.02em}
.ticker-track span{display:inline-flex;align-items:center;gap:64px;color:var(--ink)}
.ticker-track em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100}
.ticker-sep{width:8px;height:8px;background:var(--accent);border-radius:50%;display:inline-block}
@keyframes ticker{to{transform:translateX(-50%)}}

section{position:relative;padding:160px 0}
.section-head{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:72px}
.section-head h2{max-width:16ch}
.section-head .lead{max-width:36ch}
@media(max-width:780px){.section-head{flex-direction:column;align-items:flex-start}}
.reveal{opacity:0;transform:translateY(40px);transition:opacity 1s var(--ease-out),transform 1s var(--ease-out)}
.reveal.in{opacity:1;transform:none}
.reveal-delay-1{transition-delay:.08s}

/* BENTO */
.bento{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:200px;gap:16px}
.card{position:relative;overflow:hidden;border-radius:var(--radius-lg);background:radial-gradient(120% 100% at 0% 0%,rgba(255,255,255,.035),transparent 50%),linear-gradient(180deg,#0b0b10,#060609);border:1px solid var(--line);padding:28px;display:flex;flex-direction:column;justify-content:space-between;transition:transform .6s var(--ease-out),border-color .5s;isolation:isolate}
.card::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(600px 300px at var(--mx,50%) var(--my,0%),rgba(198,255,60,.08),transparent 55%);opacity:0;transition:opacity .5s}
.card:hover::before{opacity:1}
.card:hover{border-color:rgba(245,243,238,.16);transform:translateY(-4px)}
.card .tag{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim);display:inline-flex;gap:8px;align-items:center}
.card .n{color:var(--accent)}
.card h3{margin-top:18px}
.card p{margin-top:10px;max-width:32ch}
.k1{grid-column:span 7;grid-row:span 2}.k2{grid-column:span 5;grid-row:span 2}
.k3{grid-column:span 4;grid-row:span 2}.k4{grid-column:span 4;grid-row:span 2}
.k5{grid-column:span 4;grid-row:span 2}.k6{grid-column:span 12;grid-row:span 1}
.k6{flex-direction:row!important;align-items:center!important;justify-content:space-between!important;gap:30px!important}
.badge{padding:6px 12px;border-radius:99px;background:rgba(198,255,60,.12);color:var(--accent);font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase}
@media(max-width:1020px){.bento{grid-template-columns:repeat(6,1fr);grid-auto-rows:180px}.k1{grid-column:span 6}.k2{grid-column:span 6}.k3,.k4,.k5{grid-column:span 3}.k6{grid-column:span 6;flex-direction:column!important;align-items:flex-start!important}}
@media(max-width:620px){.bento{grid-template-columns:1fr}.card{grid-column:1/-1!important}}
.viz{position:absolute;inset:0;pointer-events:none;z-index:0}
.mail-row{opacity:0;transform:translateX(40px);animation:slideIn 4s var(--ease-out) infinite}
.mail-row:nth-child(2){animation-delay:-1s}.mail-row:nth-child(3){animation-delay:-2s}.mail-row:nth-child(4){animation-delay:-3s}
@keyframes slideIn{0%{opacity:0;transform:translateX(40px)}20%{opacity:1;transform:translateX(0)}70%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(-40px)}}

/* FEATURE STICKY */
.feature-sticky{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:flex-start}
.step-item{padding:22vh 0;border-top:1px solid var(--line)}
.step-item:first-child{border-top:0}
.step-item h3{margin-bottom:18px}
.step-item p{max-width:40ch;color:var(--ink)}
.visual-col{position:sticky;top:18vh;height:64vh;border-radius:var(--radius-lg);border:1px solid var(--line);background:linear-gradient(180deg,#08080d,#040407);overflow:hidden}
.feature-visual{position:absolute;inset:0;display:grid;place-items:center}
.device{width:84%;aspect-ratio:4/3;border-radius:14px;background:linear-gradient(180deg,#0f0f14,#07070b);border:1px solid var(--line);padding:18px;position:relative;overflow:hidden;box-shadow:0 60px 120px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,255,255,.04)}
.device-dots{display:flex;gap:6px;margin-bottom:16px}
.device-dots span{width:10px;height:10px;border-radius:50%;background:var(--line)}
.device-frame{position:absolute;inset:46px 18px 18px;border-radius:8px;background:#06060a;overflow:hidden;border:1px solid var(--line)}
.scene{position:absolute;inset:0;opacity:0;transition:opacity .6s var(--ease-out)}
.scene.active{opacity:1}
.inbox-row{display:grid;grid-template-columns:24px 120px 1fr 60px;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line);font-size:12px}
.inbox-row.hi{background:rgba(198,255,60,.05)}
.inbox-dot{width:8px;height:8px;border-radius:50%;background:var(--accent-2)}
.inbox-name{color:var(--ink)}.inbox-snippet{color:var(--ink-dim);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.inbox-time{color:var(--ink-dim);text-align:right;font-family:var(--mono);font-size:10px}
.ai-reply{margin:14px;padding:14px;border-radius:10px;background:rgba(198,255,60,.06);border:1px solid rgba(198,255,60,.25);font-size:12px;line-height:1.55;color:var(--ink);position:relative}
.ai-reply::before{content:"KI-ANTWORT";position:absolute;top:-8px;left:12px;background:var(--bg);padding:0 6px;font-family:var(--mono);font-size:9px;letter-spacing:.2em;color:var(--accent)}
.typing{display:inline-block;width:6px;height:12px;background:var(--accent);animation:blink .9s infinite;vertical-align:middle}
@keyframes blink{50%{opacity:0}}
.ledger-head,.ledger-row{display:grid;grid-template-columns:70px 1fr 90px 80px;gap:10px;padding:10px 14px;font-size:11px;align-items:center}
.ledger-head{color:var(--ink-dim);font-family:var(--mono);letter-spacing:.15em;text-transform:uppercase;border-bottom:1px solid var(--line)}
.ledger-row{border-bottom:1px solid var(--line);font-size:12px}
.cat{display:inline-block;padding:3px 8px;border-radius:99px;background:var(--glass);font-family:var(--mono);font-size:10px;color:var(--ink)}
.amount{font-family:var(--mono);text-align:right}.amount.neg{color:var(--accent-3)}.amount.pos{color:var(--accent)}
.ocr-blip{position:absolute;right:14px;top:14px;font-family:var(--mono);font-size:10px;color:var(--accent);display:flex;gap:6px;align-items:center}
.ocr-pulse{width:6px;height:6px;background:var(--accent);border-radius:50%;animation:pulse 1.4s infinite}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.8);opacity:0}}
.inv-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:14px}
.inv-cell{aspect-ratio:1;border-radius:8px;border:1px solid var(--line);display:grid;place-items:center;font-family:var(--mono);font-size:10px;color:var(--ink-dim)}
.inv-cell.lo{background:rgba(255,77,141,.12);border-color:rgba(255,77,141,.4);color:var(--accent-3)}
.inv-cell.ok{background:rgba(198,255,60,.06);border-color:rgba(198,255,60,.3);color:var(--accent)}
.inv-legend{padding:0 14px 14px;display:flex;gap:14px;font-family:var(--mono);font-size:10px;color:var(--ink-dim)}
.inv-legend span::before{content:"";display:inline-block;width:8px;height:8px;margin-right:6px;background:var(--accent);border-radius:2px}
.inv-legend span.lo::before{background:var(--accent-3)}
.time-ring{position:absolute;inset:0;display:grid;place-items:center}
.time-svg{width:60%;aspect-ratio:1}
.team-list{padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.team-tile{padding:14px;border:1px solid var(--line);border-radius:10px;display:flex;gap:12px;align-items:center}
.avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent-2),var(--accent-4));display:grid;place-items:center;font-family:var(--mono);font-size:12px;color:#000;font-weight:600}
.team-name{font-size:12px}.team-role{font-size:10px;color:var(--ink-dim);font-family:var(--mono)}
.step-index{font-family:var(--mono);font-size:12px;letter-spacing:.2em;color:var(--ink-dim);margin-bottom:16px}
.step-index em{font-style:normal;color:var(--accent)}
@media(max-width:980px){.feature-sticky{grid-template-columns:1fr}.visual-col{position:relative;top:0;height:440px}.step-item{padding:60px 0}}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:60px 0}
.stat .num{font-family:var(--serif);font-size:clamp(56px,7vw,96px);letter-spacing:-.04em;line-height:1;display:flex;align-items:baseline;gap:4px}
.stat .num em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 80,"WONK" 1}
.stat .label{margin-top:8px;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim)}
@media(max-width:780px){.stats{grid-template-columns:repeat(2,1fr)}}

/* QUOTES */
.quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.quote{padding:28px;border-radius:var(--radius-lg);border:1px solid var(--line);background:var(--glass);display:flex;flex-direction:column;gap:18px;transition:transform .5s var(--ease-out),border-color .3s}
.quote:hover{transform:translateY(-4px);border-color:var(--ink-faint)}
.quote blockquote{font-family:var(--serif);font-size:22px;line-height:1.3;letter-spacing:-.01em}
.quote blockquote em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.quote footer{display:flex;align-items:center;gap:12px;margin-top:auto}
.quote footer .name{font-size:13px}.quote footer .role{font-size:11px;color:var(--ink-dim);font-family:var(--mono)}
@media(max-width:860px){.quotes{grid-template-columns:1fr}}

/* PRICING */
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;perspective:1400px}
.price{padding:34px;border-radius:var(--radius-lg);border:1px solid var(--line);background:linear-gradient(180deg,#0a0a0e,#060609);display:flex;flex-direction:column;gap:22px;position:relative;transition:transform .5s var(--ease-out),border-color .3s,box-shadow .5s}
.price.pop{border-color:rgba(198,255,60,.4);background:radial-gradient(120% 80% at 0% 0%,rgba(198,255,60,.07),transparent 50%),linear-gradient(180deg,#0c0d08,#070805);box-shadow:0 30px 80px rgba(198,255,60,.07)}
.price-tag{display:flex;align-items:baseline;gap:8px}
.price-tag .num{font-family:var(--serif);font-size:72px;letter-spacing:-.04em;line-height:1}
.price-tag .per{font-family:var(--mono);font-size:12px;color:var(--ink-dim);letter-spacing:.1em}
.price ul{list-style:none;display:flex;flex-direction:column;gap:10px;padding-top:18px;border-top:1px solid var(--line)}
.price ul li{font-size:14px;display:flex;align-items:flex-start;gap:10px;color:var(--ink)}
.price ul li::before{content:"";width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,var(--accent) 0 35%,transparent 36%);border:1px solid rgba(198,255,60,.4);flex:0 0 16px;margin-top:3px}
.pop-chip{position:absolute;top:-12px;left:28px;padding:6px 12px;border-radius:99px;background:var(--accent);color:#000;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase}
@media(max-width:860px){.pricing-grid{grid-template-columns:1fr}}

/* NACHHALTIGKEIT */
#nachhaltigkeit{background:radial-gradient(60% 90% at 20% 10%,rgba(56,245,208,.05),transparent 60%),radial-gradient(50% 80% at 85% 80%,rgba(198,255,60,.05),transparent 60%)}
.nh-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;padding:20px 0 60px}
.nh-leaf{position:relative;aspect-ratio:1;border-radius:32px;overflow:hidden;background:radial-gradient(80% 60% at 30% 20%,rgba(198,255,60,.35),transparent 60%),radial-gradient(70% 60% at 80% 90%,rgba(56,245,208,.3),transparent 60%),linear-gradient(135deg,#0a1210,#041011);border:1px solid rgba(198,255,60,.18);display:flex;align-items:center;justify-content:center}
.nh-leaf svg{width:65%;height:65%;filter:drop-shadow(0 0 40px rgba(198,255,60,.35))}
.nh-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:60px}
.nh-stat{padding:28px;border-radius:var(--radius-lg);background:radial-gradient(120% 100% at 0% 0%,rgba(198,255,60,.05),transparent 55%),linear-gradient(180deg,#0a120f,#050a08);border:1px solid rgba(198,255,60,.12)}
.nh-stat .val{font-family:var(--serif);font-size:clamp(44px,5vw,68px);letter-spacing:-.03em;line-height:1;color:var(--ink);font-variation-settings:"opsz" 144,"SOFT" 40,"WONK" 0}
.nh-stat .val em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.nh-stat .lbl{font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-dim);margin-top:14px;display:block}
.nh-stat p{margin-top:14px;font-size:14px}
.nh-pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}
.nh-pillar{padding:28px;border-radius:var(--radius-lg);background:linear-gradient(180deg,#080b0a,#040707);border:1px solid var(--line);position:relative;overflow:hidden}
.nh-pillar::before{content:"";position:absolute;inset:0;background:radial-gradient(400px 200px at 0% 0%,rgba(56,245,208,.06),transparent 60%)}
.nh-pillar .num{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--accent)}
.nh-pillar h3{font-size:clamp(22px,2.2vw,30px);margin-top:14px}
.nh-pillar p{margin-top:12px;font-size:15px}
.nh-pledge{margin-top:60px;padding:44px;border-radius:var(--radius-lg);border:1px solid rgba(198,255,60,.2);background:radial-gradient(60% 90% at 100% 0%,rgba(198,255,60,.08),transparent 60%),linear-gradient(180deg,rgba(198,255,60,.025),transparent);display:flex;justify-content:space-between;align-items:center;gap:30px;flex-wrap:wrap}
.nh-pledge .big{font-family:var(--serif);font-size:clamp(22px,2.4vw,32px);line-height:1.25;max-width:48ch;letter-spacing:-.015em}
.nh-pledge .big em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
@media(max-width:1020px){.nh-hero{grid-template-columns:1fr;gap:32px}.nh-stats,.nh-pillars{grid-template-columns:1fr 1fr}}
@media(max-width:620px){.nh-stats,.nh-pillars{grid-template-columns:1fr}.nh-pledge{padding:28px}}

/* FAQ */
.faq{display:flex;flex-direction:column;border-top:1px solid var(--line)}
.faq details{border-bottom:1px solid var(--line);padding:22px 4px;transition:background .3s}
.faq details[open]{background:linear-gradient(to right,rgba(198,255,60,.02),transparent 60%)}
.faq summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:24px;font-family:var(--serif);font-size:clamp(22px,2.2vw,30px);letter-spacing:-.015em;cursor:pointer}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-family:var(--mono);font-size:28px;color:var(--accent);transition:transform .3s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq .a{padding:14px 0 4px;color:var(--ink-dim);max-width:70ch}

/* BIG CTA */
.cta-big{position:relative;padding:180px 0;overflow:hidden;isolation:isolate}
.cta-big::before{content:"";position:absolute;inset:-20%;background:radial-gradient(60% 50% at 20% 30%,rgba(122,92,255,.30),transparent 60%),radial-gradient(50% 60% at 80% 70%,rgba(198,255,60,.22),transparent 60%),radial-gradient(40% 40% at 60% 20%,rgba(255,77,141,.20),transparent 60%);filter:blur(50px);z-index:-1;animation:blobshift 14s ease-in-out infinite}
@keyframes blobshift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(3%,-2%) scale(1.05)}66%{transform:translate(-2%,3%) scale(.97)}}
.cta-big h2{font-size:clamp(64px,12vw,180px)}
.cta-big h2 em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.cta-sub{display:flex;justify-content:space-between;align-items:end;margin-top:40px;gap:30px}
.cta-sub .lead{max-width:40ch}

/* FOOTER */
footer{border-top:1px solid var(--line);padding:80px 0 40px}
.foot-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;align-items:flex-start;padding-bottom:80px}
.foot-grid h4{font-family:var(--mono);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:16px;font-weight:500}
.foot-grid ul{list-style:none;display:flex;flex-direction:column;gap:8px}
.foot-grid a{font-size:14px;color:var(--ink)}.foot-grid a:hover{color:var(--accent)}
.wordmark{font-family:var(--serif);font-size:clamp(90px,22vw,360px);letter-spacing:-.05em;line-height:.85;padding-top:30px;border-top:1px solid var(--line);overflow:hidden}
.wordmark em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.foot-meta{display:flex;justify-content:space-between;font-family:var(--mono);font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-dim);padding-top:24px}
@media(max-width:860px){.foot-grid{grid-template-columns:repeat(2,1fr)}}

/* MODAL */
.modal-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .3s}
.modal-overlay.open{opacity:1;pointer-events:all}
.modal-bg{position:absolute;inset:0;background:rgba(2,6,12,.72);backdrop-filter:blur(18px)}
.modal-panel{position:relative;width:min(560px,100%);background:linear-gradient(180deg,rgba(18,22,28,.96),rgba(10,13,18,.98));border:1px solid var(--line);border-radius:20px;padding:34px;box-shadow:0 40px 120px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.04);transform:translateY(18px) scale(.98);transition:transform .5s var(--ease-out)}
.modal-overlay.open .modal-panel{transform:none}
.modal-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--ink-dim);text-transform:uppercase;margin-bottom:10px}
.modal-panel h3{font-family:var(--serif);font-weight:300;font-size:34px;line-height:1;letter-spacing:-.02em;margin:0 0 8px;color:var(--ink)}
.modal-panel h3 em{color:var(--accent);font-style:italic}
.modal-panel p.sub{margin:0 0 22px;color:var(--ink-dim);font-size:15px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.form-field{margin-bottom:12px}
label{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--ink-dim);text-transform:uppercase;margin-bottom:6px}
input,textarea{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:10px;padding:12px 14px;color:var(--ink);font:inherit;font-size:14px;outline:none;transition:border-color .2s,background .2s}
input:focus,textarea:focus{border-color:var(--accent);background:rgba(176,255,102,.04)}
textarea{min-height:92px;resize:vertical}
.modal-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px}
.modal-actions small{color:var(--ink-dim);font-size:12px}
.modal-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--ink-dim);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
.modal-close:hover{background:rgba(255,255,255,.06);color:var(--ink)}
@media(max-width:540px){.form-row{grid-template-columns:1fr}}
`;

// Inject CSS and Three.js once at module load
let __initialized = false;
let __threeLoaded = false;
function ensureInit() {
  if (__initialized) return;
  __initialized = true;
  const style = document.createElement("style");
  style.textContent = __css;
  document.head.appendChild(style);
  document.title = "NILL — Intelligenz, die mitarbeitet.";
  if (!window.THREE && !__threeLoaded) {
    __threeLoaded = true;
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    document.head.appendChild(s);
  }
}


/* ─── HOOKS ─────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

function useTilt(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const mv = e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
      el.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
      const rx = ((e.clientY-r.top-r.height/2)/r.height)*-4;
      const ry = ((e.clientX-r.left-r.width/2)/r.width)*4;
      el.style.transform = `translateY(-4px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const ml = () => el.style.transform = '';
    el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', ml);
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', ml); };
  }, []);
}

function useMagnetic(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const mv = e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX-r.left-r.width/2)/r.width*18}px,${(e.clientY-r.top-r.height/2)/r.height*18}px)`;
    };
    const ml = () => el.style.transform = '';
    el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', ml);
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', ml); };
  }, []);
}

/* ─── MAGNETIC BUTTON ────────────────────────────────────── */
function MagBtn({ className, children, onClick, href }) {
  const ref = useRef(null);
  useMagnetic(ref);
  if (href) return <a ref={ref} href={href} className={className} onClick={onClick}>{children}</a>;
  return <button ref={ref} className={className} onClick={onClick}>{children}</button>;
}

/* ─── TILT CARD ──────────────────────────────────────────── */
function TiltCard({ className, style, children }) {
  const ref = useRef(null);
  useTilt(ref);
  return <article ref={ref} className={`card ${className||''}`} style={style}>{children}</article>;
}

/* ─── THREE.JS HERO CANVAS ───────────────────────────────── */

const NOISE_LIB = `
  vec3 _m3(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 _m4(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 _perm(vec4 x){return _m4(((x*34.)+1.)*x);}
  vec4 _ts(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=_m3(i);
    vec4 p=_perm(_perm(_perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    vec3 ns=D.wyz/7.-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
    vec4 xx=x_*ns.x+ns.yyyy;vec4 yy=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(xx)-abs(yy);
    vec4 b0=vec4(xx.xy,yy.xy);vec4 b1=vec4(xx.zw,yy.zw);
    vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 P0=vec3(a0.xy,h.x);vec3 P1=vec3(a0.zw,h.y);vec3 P2=vec3(a1.xy,h.z);vec3 P3=vec3(a1.zw,h.w);
    vec4 norm=_ts(vec4(dot(P0,P0),dot(P1,P1),dot(P2,P2),dot(P3,P3)));
    P0*=norm.x;P1*=norm.y;P2*=norm.z;P3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
    return 42.*dot(m*m,vec4(dot(P0,x0),dot(P1,x1),dot(P2,x2),dot(P3,x3)));
  }
  float fbm3(vec3 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*snoise(p);p*=2.07;a*=.5;}return v;}
  float fbm2(vec3 p){return snoise(p)*.5+snoise(p*2.05+vec3(11.3,5.7,4.1))*.25;}
  float ridged(vec3 p){float v=0.,a=.55;for(int i=0;i<3;i++){float n=1.-abs(snoise(p));v+=a*n*n;p=p*2.1+vec3(3.1,7.7,1.3);a*=.5;}return v;}
  vec3 tonemap(vec3 c){c=c/(c+1.);return pow(clamp(c,0.,1.),vec3(1./2.2));}
`;

const PLANET_VERT = `
  varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
  void main(){
    vLP=position;
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`;

const ATMO_VERT = `
  varying vec3 vWP;varying vec3 vWN;
  void main(){
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`;

const ATMO_FRAG = `
  uniform vec3 uSunPos;uniform vec3 uColor;uniform float uIntensity;
  varying vec3 vWP;varying vec3 vWN;
  void main(){
    vec3 wN=normalize(vWN);
    vec3 vD=normalize(cameraPosition-vWP);
    vec3 sD=normalize(uSunPos-vWP);
    float rim=pow(1.-max(dot(wN,vD),0.),2.2);
    float sunF=pow(max(dot(wN,sD)*.55+.45,0.),1.);
    float alpha=rim*uIntensity*sunF;
    gl_FragColor=vec4(uColor*alpha,alpha);
  }
`;

function mkPlanetFrag(surfCode) {
  return NOISE_LIB + `
    varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
    uniform float uTime;uniform vec3 uSunPos;uniform vec3 uAtmo;
    ${surfCode}
    void main(){
      vec3 op=normalize(vLP);
      vec3 worldN=normalize(vWN);
      vec3 sunDir=normalize(uSunPos-vWP);
      vec3 viewDir=normalize(cameraPosition-vWP);
      vec3 col=getSurf(op);
      float spec=getSpec(op);
      vec3 emit=getEmit(op);
      float NdotL_geo=dot(worldN,sunDir);
      float NdotL=max(NdotL_geo,0.);
      vec3 diff=col*NdotL;
      vec3 hv=normalize(sunDir+viewDir);
      float NdotH=max(dot(worldN,hv),0.);
      float specV=pow(NdotH,20.+spec*200.)*spec*NdotL;
      vec3 specCol=mix(vec3(.9,.96,1.),vec3(1.),spec*.5)*specV;
      float dayBlend=smoothstep(-.06,.20,NdotL_geo);
      vec3 final=mix(col*.010+emit,diff+specCol+col*.028,dayBlend);
      float termFac=smoothstep(-.15,0.,NdotL_geo)*(1.-smoothstep(0.,.4,NdotL_geo));
      final+=uAtmo*termFac*.20;
      final+=uAtmo*pow(1.-max(dot(worldN,viewDir),0.),3.)*smoothstep(0.,.3,NdotL_geo)*.25;
      gl_FragColor=vec4(tonemap(final),1.);
    }
  `;
}

const SURF_EARTH = `
  vec3 getSurf(vec3 op){
    float h=fbm3(op*1.5);float lat=abs(op.y);
    float land=smoothstep(-.02,.15,h);
    vec3 ocean=mix(vec3(.02,.08,.22),vec3(.04,.22,.38),smoothstep(-.4,-.02,h));
    float arid=smoothstep(-.25,.5,fbm2(op*1.9+4.));
    vec3 land3d=mix(vec3(.11,.30,.07),vec3(.62,.48,.20),arid*.85);
    land3d=mix(land3d,vec3(.05,.18,.04),smoothstep(.5,.9,fbm2(op*2.8+1.2))*.6);
    land3d=mix(land3d,vec3(.34,.30,.26),smoothstep(.38,.72,h));
    land3d=mix(land3d,vec3(.93,.96,1.),smoothstep(.60,.82,h));
    land3d=mix(land3d,vec3(.93,.96,1.),smoothstep(.68,.90,lat));
    vec3 c=mix(ocean,land3d,land);
    c=mix(c,vec3(.95,.97,1.),smoothstep(.06,.5,fbm2(op*2.1+vec3(uTime*.009,0.,uTime*.006)))*.5);
    return c;
  }
  float getSpec(vec3 op){
    float h=fbm3(op*1.5);
    return (1.-smoothstep(-.02,.15,h))*(1.-smoothstep(.06,.5,fbm2(op*2.1+vec3(uTime*.009,0.,uTime*.006)))*.5)*.85;
  }
  vec3 getEmit(vec3 op){
    float h=fbm3(op*1.5);float land=smoothstep(-.02,.15,h);
    return vec3(1.,.78,.42)*smoothstep(.3,.6,fbm2(op*4.+2.))*land*.12;
  }
`;

const SURF_ICE = `
  vec3 getSurf(vec3 op){
    float h=fbm3(op*2.);float rd=ridged(op*2.8);float lat=abs(op.y);
    vec3 c=mix(vec3(.02,.08,.20),vec3(.12,.48,.62),smoothstep(-.25,.35,h));
    c=mix(c,vec3(.84,.95,1.),smoothstep(.52,.80,rd));
    c=mix(c,vec3(.01,.06,.18),smoothstep(.65,.88,ridged(op*4.8+1.7))*.6);
    c=mix(c,vec3(.84,.95,1.),smoothstep(.50,.82,lat));
    c+=vec3(.08,.35,.55)*smoothstep(.70,.90,rd)*.22;
    return c;
  }
  float getSpec(vec3 op){return .55+smoothstep(.4,.85,ridged(op*2.8))*.38;}
  vec3 getEmit(vec3 op){return vec3(0.);}
`;

const SURF_MARS = `
  vec3 getSurf(vec3 op){
    float h=fbm3(op*1.7+.3);float rd=ridged(op*2.8);
    vec3 c=mix(vec3(.22,.05,.02),vec3(.68,.22,.08),smoothstep(-.35,.6,h));
    c=mix(c,vec3(.80,.48,.28),smoothstep(0.,.6,fbm2(op*4.+1.3))*.5);
    c=mix(c,vec3(.22,.05,.02),smoothstep(.45,.82,rd)*.8);
    c=mix(c,vec3(.90,.86,.80),smoothstep(.80,.94,abs(op.y)));
    float lava=smoothstep(.82,.96,ridged(op*3.8));
    c+=vec3(1.4,.38,.07)*lava*(.75+.25*sin(uTime*1.8));
    return c;
  }
  float getSpec(vec3 op){return .07;}
  vec3 getEmit(vec3 op){return vec3(.9,.22,.04)*smoothstep(.82,.96,ridged(op*3.8))*.18;}
`;

const SURF_GAS = `
  vec3 getSurf(vec3 op){
    float y=op.y;
    float turb=fbm2(vec3(op.x,y*2.2,op.z)*2.+uTime*.02);
    float fine=snoise(op*7.+uTime*.03)*.5+.5;
    float bands=sin(y*7.5+turb*2.8)*(.5+fine*.2);
    vec3 c=mix(vec3(.56,.32,.12),vec3(.92,.84,.68),smoothstep(-.6,.6,bands));
    c=mix(c,vec3(.74,.52,.28),smoothstep(.3,.8,abs(y)*.4+turb*.3));
    c=mix(c,vec3(.40,.22,.08),smoothstep(.4,.85,-bands+.1));
    c=mix(c,vec3(.96,.91,.78),smoothstep(.65,.85,sin(y*18.+turb*5.))*.3);
    vec2 sp=(op.xy-vec2(.32,-.09))*vec2(1.2,2.);
    float spot=exp(-dot(sp,sp)*22.);
    c=mix(c,vec3(.90,.45,.70),spot*.75);
    vec2 eye=(op.xy-vec2(.32,-.09))*vec2(2.,3.2);
    c=mix(c,vec3(.98,.82,.62),exp(-dot(eye,eye)*80.)*.9);
    return c;
  }
  float getSpec(vec3 op){return .03;}
  vec3 getEmit(vec3 op){return vec3(0.);}
`;

const SURF_MOON = `
  vec3 getSurf(vec3 op){
    float h=fbm3(op*2.2);float rd=ridged(op*3.2);
    vec3 c=mix(vec3(.72,.70,.66),vec3(.18,.17,.16),smoothstep(.02,-.2,h));
    c+=vec3(.20,.19,.18)*smoothstep(.60,.88,rd)*.9;
    c-=vec3(.08,.07,.07)*smoothstep(.70,.90,ridged(op*6.5+3.))*.8;
    c=mix(c,vec3(.90,.88,.84),smoothstep(.85,.96,snoise(op*18.)*.5+.5)*smoothstep(0.,.3,h)*.6);
    return c;
  }
  float getSpec(vec3 op){return .04;}
  vec3 getEmit(vec3 op){return vec3(0.);}
`;

const SURF_ENERGY = `
  vec3 getSurf(vec3 op){
    float pulse=.8+.2*sin(uTime*1.3);
    float glow=smoothstep(.72,.92,ridged(op*3.2))*pulse;
    vec3 c=vec3(.03,.06,.02)+fbm2(op*3.)*.03*vec3(.3,1.,.2);
    c+=vec3(1.3,2.,.42)*glow;
    c+=vec3(.8,1.35,.20)*smoothstep(.78,.96,ridged(op*5.5+1.5))*pulse*.55;
    return c;
  }
  float getSpec(vec3 op){return .10;}
  vec3 getEmit(vec3 op){return vec3(.76,1.18,.19)*smoothstep(.72,.92,ridged(op*3.2))*(.8+.2*sin(uTime*1.3))*.28;}
`;

const RING_FRAG = NOISE_LIB + `
  varying vec3 vLP;varying vec3 vWP;
  uniform float uInner,uOuter;uniform vec3 uSunPos;
  void main(){
    float rr=length(vLP.xy);
    float rn=clamp((rr-uInner)/(uOuter-uInner),0.,1.);
    float bands=.5+.5*sin(rn*140.+fbm2(vec3(rn*25.,0.,0.))*4.);
    float detail=fbm2(vec3(rn*70.,atan(vLP.y,vLP.x)*3.,0.));
    float gap1=smoothstep(.30,.34,rn)*(1.-smoothstep(.34,.40,rn));
    float gap2=smoothstep(.68,.71,rn)*(1.-smoothstep(.71,.74,rn));
    vec3 col=mix(vec3(.30,.20,.50),vec3(.80,.70,1.),bands*.8+detail*.25);
    float alpha=.85*(1.-gap1*.94)*(1.-gap2*.80);
    alpha*=smoothstep(0.,.06,rn)*smoothstep(1.,.93,rn)*(.62+detail*.4);
    col*=abs(normalize(uSunPos-vWP).y)*.5+.5;
    gl_FragColor=vec4(col,alpha);
  }
`;

function buildScene(canvas) {
  const T = THREE;
  const renderer = new T.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.0));
  renderer.setClearColor(0x000000, 1);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(42, 2, 0.1, 300);
  camera.position.set(0, 1.8, 11.0);
  camera.lookAt(0, 0, 0);

  /* STARS — Points only, clean black BG */
  const N = 350;
  const sp = new Float32Array(N * 3);
  const ss = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 30 + Math.random() * 70, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    sp[i*3]   = r * Math.sin(ph) * Math.cos(th);
    sp[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    sp[i*3+2] = r * Math.cos(ph);
    ss[i] = 0.4 + Math.random() * 1.4;
  }
  const sGeo = new T.BufferGeometry();
  sGeo.setAttribute('position', new T.BufferAttribute(sp, 3));
  sGeo.setAttribute('size', new T.BufferAttribute(ss, 1));
  const starMat = new T.ShaderMaterial({
    uniforms: {},
    vertexShader: `attribute float size;void main(){gl_PointSize=size*(700./-(modelViewMatrix*vec4(position,1.)).z);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.3,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(1.,.97,.92,a*.8);}`,
    transparent: true, depthWrite: false, blending: T.AdditiveBlending
  });
  const stars = new T.Points(sGeo, starMat);
  scene.add(stars);

  /* SYSTEM */
  const system = new T.Group();
  system.rotation.x = -0.55;
  system.rotation.z = 0.07;
  scene.add(system);

  /* SUN */
  const sunGroup = new T.Group();
  system.add(sunGroup);

  const sunMat = new T.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: NOISE_LIB + `
      varying vec3 vP;varying vec3 vN;uniform float uTime;
      void main(){
        float t=uTime*.22;
        float n1=fbm3(vP*1.8+t);
        float n2=fbm2(vP*3.-t*.7);
        float gran=snoise(vP*12.+t)*.5+.5;
        vec3 col=mix(vec3(.08,.03,.01),vec3(.98,.40,.07),smoothstep(-.4,.5,n1));
        col=mix(col,vec3(1.,.88,.68),smoothstep(.3,.8,n1+n2*.2));
        col+=vec3(.80,1.,.28)*pow(max(gran-.5,0.),4.)*1.1;
        col=mix(col,vec3(.08,.03,.01),smoothstep(.4,.9,-n2)*.5);
        float limb=pow(max(dot(normalize(vN),vec3(0,0,1)),0.),.42);
        col*=.3+limb*.95; col*=1.7;
        gl_FragColor=vec4(col,1.);
      }
    `
  });
  const sunCore = new T.Mesh(new T.SphereGeometry(.92, 64, 48), sunMat);
  sunGroup.add(sunCore);

  /* Sun glow — sprites only (no BackSide sphere rings) */
  const mkGlowCanvas = (stops) => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(([t, col]) => gr.addColorStop(t, col));
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const tex = new T.CanvasTexture(c); tex.minFilter = T.LinearFilter; return tex;
  };
  const mkSprite = (size, tex, op) => {
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, depthTest: false }));
    s.scale.set(size, size, 1);
    sunGroup.add(s); return s;
  };
  const flareTex   = mkGlowCanvas([[0,'rgba(255,240,190,1)'],[.2,'rgba(255,150,50,.5)'],[.55,'rgba(198,255,60,.12)'],[1,'rgba(0,0,0,0)']]);
  const coronaTex1 = mkGlowCanvas([[0,'rgba(0,0,0,0)'],[.55,'rgba(255,130,40,.08)'],[.75,'rgba(120,80,220,.12)'],[1,'rgba(0,0,0,0)']]);
  const coronaTex2 = mkGlowCanvas([[0,'rgba(0,0,0,0)'],[.6,'rgba(80,60,180,.06)'],[.85,'rgba(198,255,60,.05)'],[1,'rgba(0,0,0,0)']]);
  const flareSprite  = mkSprite(5.5,  flareTex,   .82);
  const corona1      = mkSprite(10.0, coronaTex1, .48);
  const corona2      = mkSprite(17.0, coronaTex2, .24);

  /* PLANET MODULES */
  const modules = [
    { r:2.20,sz:.30,spd:.26,phase:.3,  tilt:.03,  surf:SURF_EARTH,  atmo:[.55,.90,.22],atmoI:.55 },
    { r:3.05,sz:.40,spd:.19,phase:1.6, tilt:-.05, surf:SURF_ICE,    atmo:[.18,.88,.90],atmoI:.48 },
    { r:3.88,sz:.28,spd:.15,phase:3.0, tilt:.04,  surf:SURF_MARS,   atmo:[.92,.28,.20],atmoI:.38 },
    { r:4.92,sz:.55,spd:.11,phase:4.7, tilt:-.03, surf:SURF_GAS,    atmo:[.88,.68,.35],atmoI:.42,rings:true },
    { r:6.08,sz:.34,spd:.09,phase:5.9, tilt:.05,  surf:SURF_MOON,   atmo:[.72,.70,.66],atmoI:.22 },
    { r:7.12,sz:.22,spd:.07,phase:1.2, tilt:-.04, surf:SURF_ENERGY, atmo:[.78,1.,.28], atmoI:.50,future:true },
  ];

  const sunWorldPos = new T.Vector3();
  const planets = [];

  modules.forEach(m => {
    // Orbit ring
    const orb = new T.Mesh(
      new T.RingGeometry(m.r-.005, m.r+.005, 160),
      new T.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:m.future?.04:.07, side:T.DoubleSide, depthWrite:false })
    );
    orb.rotation.x = Math.PI/2 + m.tilt;
    system.add(orb);

    // Planet — 60×40 segments for solid 60fps
    const segs = m.rings ? 64 : 56;
    const pMat = new T.ShaderMaterial({
      uniforms: { uTime:{value:0}, uSunPos:{value:new T.Vector3()}, uAtmo:{value:new T.Color(...m.atmo)} },
      vertexShader: PLANET_VERT,
      fragmentShader: mkPlanetFrag(m.surf)
    });
    const mesh = new T.Mesh(new T.SphereGeometry(m.sz, segs, Math.round(segs*.65)), pMat);
    system.add(mesh);

    // Atmosphere
    const atmoMat = new T.ShaderMaterial({
      side:T.FrontSide, transparent:true, depthWrite:false, blending:T.AdditiveBlending,
      uniforms:{ uSunPos:{value:new T.Vector3()}, uColor:{value:new T.Color(...m.atmo)}, uIntensity:{value:m.future?.28:m.atmoI} },
      vertexShader:ATMO_VERT, fragmentShader:ATMO_FRAG
    });
    const atmo = new T.Mesh(new T.SphereGeometry(m.sz*1.12, 32, 22), atmoMat);
    system.add(atmo);

    // Saturn rings
    let ring = null;
    if (m.rings) {
      const rIn=m.sz*1.55, rOut=m.sz*2.72;
      ring = new T.Mesh(
        new T.RingGeometry(rIn,rOut,140,1),
        new T.ShaderMaterial({
          side:T.DoubleSide, transparent:true, depthWrite:false,
          uniforms:{ uInner:{value:rIn},uOuter:{value:rOut},uSunPos:{value:new T.Vector3()} },
          vertexShader:`varying vec3 vLP;varying vec3 vWP;void main(){vLP=position;vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}`,
          fragmentShader:RING_FRAG
        })
      );
      ring.rotation.x=-Math.PI/2+.20; ring.rotation.z=.10;
      system.add(ring);
    }
    planets.push({mesh,pMat,atmo,atmoMat,ring,def:m});
  });

  /* INTERACTION */
  let tmx=0,tmy=0,mx=0,my=0,scrollYv=0;
  const onPointer = e => { tmx=(e.clientX/innerWidth)-.5; tmy=(e.clientY/innerHeight)-.5; };
  const onScroll  = () => { scrollYv=Math.min(window.scrollY/innerHeight,1.2); };
  addEventListener('pointermove', onPointer, {passive:true});
  addEventListener('scroll',      onScroll,  {passive:true});

  const onResize = () => {
    const el = canvas.parentElement;
    if (!el) return;
    const w=el.clientWidth, h=el.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  };
  onResize();
  addEventListener('resize', onResize);

  /* LOOP */
  const start=performance.now(); let last=start, rafId;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min((now-last)/1000, 1/20);
    last = now;
    const t = (now-start)/1000;
    mx+=(tmx-mx)*.05; my+=(tmy-my)*.05;
    system.rotation.y = t*.028+mx*.26;
    system.rotation.x = -.55+my*.09-scrollYv*.16;
    system.position.y = -scrollYv*.7;
    sunMat.uniforms.uTime.value = t;
    sunCore.rotation.y = t*.07;
    sunCore.scale.setScalar(1+Math.sin(t*.9)*.018);
    corona1.material.opacity = .46+Math.sin(t*1.1)*.04;
    corona2.material.opacity = .22+Math.sin(t*.7+1.2)*.04;
    flareSprite.material.opacity = .80+Math.sin(t*1.2)*.07;
    sunGroup.getWorldPosition(sunWorldPos);
    stars.rotation.y = t*.003;
    for (const {mesh,pMat,atmo,atmoMat,ring,def} of planets) {
      const a=def.phase+t*def.spd;
      const px=Math.cos(a)*def.r, py=Math.sin(a*.55+def.tilt*4.)*.22, pz=Math.sin(a)*def.r;
      mesh.position.set(px,py,pz); mesh.rotation.y+=dt*.18;
      pMat.uniforms.uTime.value=t; pMat.uniforms.uSunPos.value.copy(sunWorldPos);
      atmo.position.set(px,py,pz); atmoMat.uniforms.uSunPos.value.copy(sunWorldPos);
      if(ring){ring.position.set(px,py,pz);ring.material.uniforms.uSunPos.value.copy(sunWorldPos);}
    }
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    removeEventListener('pointermove',onPointer);
    removeEventListener('scroll',onScroll);
    removeEventListener('resize',onResize);
    renderer.dispose();
  };
}

function HeroCanvas() {
  const ref = useRef(null);
  const [threeReady, setThreeReady] = useState(!!window.THREE);
  useEffect(() => {
    if (window.THREE) { setThreeReady(true); return; }
    // Poll until Three.js script has loaded
    const id = setInterval(() => {
      if (window.THREE) { clearInterval(id); setThreeReady(true); }
    }, 50);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!ref.current || !window.THREE) return;
    return buildScene(ref.current);
  }, [threeReady]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,zIndex:0,display:'block',width:'100%',height:'100%'}}/>;
}

/* ─── NAV ────────────────────────────────────────────────── */
function Nav({ onDemo }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn(); addEventListener('scroll', fn, {passive:true});
    return () => removeEventListener('scroll', fn);
  }, []);
  return (
    <header className={`nav${scrolled?' scrolled':''}`} id="nav">
      <div className="wrap">
        <a className="brand" href="#top"><span className="brand-mark" aria-hidden="true"/><span>NILL</span></a>
        <nav aria-label="Primary">
          <ul>
            <li><a href="#produkte">Produkte</a></li>
            <li><a href="#wie">Wie es arbeitet</a></li>
            <li><a href="#preise">Preise</a></li>
            <li><a href="#nachhaltigkeit">Nachhaltigkeit</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </nav>
        <div className="nav-auth">
          <a href="https://app.nillai.de/login" className="btn-auth">Login</a>
          <a href="https://app.nillai.de/register" className="btn-auth primary">Registrieren</a>
        </div>
      </div>
    </header>
  );
}

/* ─── HERO ───────────────────────────────────────────────── */
function Hero({ onCTA }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRevealed(true), 80); return () => clearTimeout(t); }, []);
  return (
    <section className={`hero${revealed?' revealed':''}`} id="top">
      <HeroCanvas />
      <div className="hero-chips" aria-hidden="true">
        <span className="chip c1"><span className="chip-dot"/><span>KI aktiv</span></span>
        <span className="chip c2"><span className="chip-dot" style={{background:'var(--accent-4)'}}/><span>47 Mails sortiert</span></span>
        <span className="chip c3"><span className="chip-dot" style={{background:'var(--accent-2)'}}/><span>Rechnung gebucht</span></span>
        <span className="chip c4"><span className="chip-dot" style={{background:'var(--accent-3)'}}/><span>Dienstplan aktualisiert</span></span>
      </div>
      <div className="wrap hero-inner">
        <span className="eyebrow hero-eyebrow">KI-Betriebssystem für Unternehmen</span>
        <h1 aria-label="Intelligenz, die mitarbeitet.">
          <span className="word"><span>Intelligenz,</span></span><br/>
          <span className="word"><span>die </span></span>
          <span className="word"><span><em>mit­arbeitet.</em></span></span>
        </h1>
        <p className="lead">
          NILL verbindet <strong style={{color:'var(--ink)',fontWeight:500}}>Postfach, Buchhaltung, Inventur, Zeiterfassung</strong> und <strong style={{color:'var(--ink)',fontWeight:500}}>Teamverwaltung</strong> zu einem einzigen System — gesteuert von einer KI, die Arbeit erkennt, entscheidet und erledigt.
        </p>
        <div className="hero-cta">
          <MagBtn className="btn btn-primary" href="https://app.nillai.de/register"><span>Kostenlos registrieren</span><span className="arrow">→</span></MagBtn>
          <MagBtn className="btn btn-ghost" href="https://app.nillai.de/login"><span>Login</span><span className="arrow">→</span></MagBtn>
          <MagBtn className="btn btn-ghost" onClick={e=>{e.preventDefault();onCTA('Demo')}} href="#"><span>Live-Demo</span><span className="arrow">↓</span></MagBtn>
        </div>
      </div>
      <div className="hero-meta">
        <span>NILL v4 · Stand 2026</span>
        <div className="scroll-ind"><span>scroll</span><div className="scroll-bar"/></div>
        <span>DE · Made in Germany</span>
      </div>
    </section>
  );
}

/* ─── TICKER ─────────────────────────────────────────────── */
function Ticker() {
  const row = <>
    Postfach <em>·</em> Buchhaltung <span className="ticker-sep"/> Inventur <em>·</em> Zeiterfassung <span className="ticker-sep"/> Team­verwaltung <em>·</em> Sekretärin <span className="ticker-sep"/> <em>Ein Login.</em> <span className="ticker-sep"/>
    Postfach <em>·</em> Buchhaltung <span className="ticker-sep"/> Inventur <em>·</em> Zeiterfassung <span className="ticker-sep"/> Team­verwaltung <em>·</em> Sekretärin <span className="ticker-sep"/> <em>Ein Login.</em> <span className="ticker-sep"/>
  </>;
  return <div className="ticker"><div className="ticker-track" aria-hidden="true"><span>{row}</span></div></div>;
}

/* ─── PRODUCTS ───────────────────────────────────────────── */
function Products({ onCTA }) {
  const [ref, vis] = useReveal();
  return (
    <section id="produkte">
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Module — 06</span><h2>Sechs Module. <br/><em style={{fontStyle:'italic',color:'var(--accent)',fontFamily:'var(--serif)',fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'}}>Eine</em> Intelligenz.</h2></div>
          <p className="lead">Jedes Modul steht für sich — doch gemeinsam werden sie zu einem Gehirn, das dein Unternehmen versteht.</p>
        </div>
        <div className="bento reveal in">
          <TiltCard className="k1">
            <div className="viz" aria-hidden="true">
              <svg viewBox="0 0 600 380" preserveAspectRatio="none">
                <defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c6ff3c" stopOpacity=".25"/><stop offset="1" stopColor="#c6ff3c" stopOpacity="0"/></linearGradient></defs>
                <g transform="translate(260,40)" opacity=".8">
                  {[0,60,120,180].map((y,i)=><g key={y} className="mail-row" transform={`translate(0,${y})`}><rect width="300" height="48" rx="8" fill={i===0?"url(#mg)":"rgba(255,255,255,.03)"} stroke="rgba(255,255,255,.08)"/><circle cx="22" cy="24" r="6" fill={['#c6ff3c','#7a5cff','#38f5d0','#ff4d8d'][i]}/><rect x="42" y="16" width={[120,100,140,80][i]} height="6" rx="3" fill="rgba(255,255,255,.6)"/><rect x="42" y="28" width={[200,180,160,220][i]} height="4" rx="2" fill="rgba(255,255,255,.2)"/></g>)}
                </g>
              </svg>
            </div>
            <div><span className="tag"><span className="n">01</span> · Postfach</span><h3>E-Mails, die sich <em style={{fontStyle:'italic',color:'var(--accent)'}}>selbst beantworten.</em></h3><p>Kategorisieren, priorisieren, Antworten schreiben — NILL liest mit und arbeitet voraus.</p></div>
          </TiltCard>
          <TiltCard className="k2">
            <div><span className="tag"><span className="n">02</span> · Buchhaltung</span><h3>Belege buchen. <em style={{fontStyle:'italic',color:'var(--accent)'}}>Ohne dich.</em></h3><p>Rechnungen per Mail, Scan oder Foto — NILL erkennt, kontiert, verbucht und bereitet auf.</p></div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-dim)'}}>
              {['DATEV-ready','OCR','GoBD-konform'].map(t=><span key={t} style={{padding:'6px 10px',border:'1px solid var(--line)',borderRadius:99}}>{t}</span>)}
            </div>
          </TiltCard>
          <TiltCard className="k3">
            <div><span className="tag"><span className="n">03</span> · Inventur</span><h3>Bestände, die sich <em style={{fontStyle:'italic',color:'var(--accent)'}}>selbst zählen.</em></h3><p>Automatische Fortschreibung, Warnsystem bei Unterbestand, Prognosen.</p></div>
          </TiltCard>
          <TiltCard className="k4">
            <div><span className="tag"><span className="n">04</span> · Zeiterfassung</span><h3>Zeit erfasst sich <em style={{fontStyle:'italic',color:'var(--accent)'}}>von selbst.</em></h3><p>Per App, Browser, Chip oder Sprachbefehl. NILL weist Projekte zu.</p></div>
            <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-dim)',display:'flex',justifyContent:'space-between'}}><span>EuGH-konform</span><span>GPS-optional</span></div>
          </TiltCard>
          <TiltCard className="k5">
            <div><span className="tag"><span className="n">05</span> · Team­verwaltung</span><h3>Das Team im <em style={{fontStyle:'italic',color:'var(--accent)'}}>Autopilot.</em></h3><p>Urlaub, Krankmeldungen, Dienstpläne, Onboarding — vorbereitet von der KI.</p></div>
            <div style={{display:'flex'}}>
              {['MK','LS','JH','+9'].map((l,i)=><span key={l} className="avatar" style={{width:28,height:28,fontSize:10,marginLeft:i?-10:0,background:i?['linear-gradient(135deg,var(--accent),var(--accent-4))','linear-gradient(135deg,var(--accent-3),var(--accent-2))','linear-gradient(135deg,var(--accent-4),var(--accent-3))'][i-1]:undefined}}>{l}</span>)}
            </div>
          </TiltCard>
          <TiltCard className="k6" style={{background:'linear-gradient(90deg,#0c0c10,#12130c)',borderColor:'rgba(198,255,60,.2)'}}>
            <div><span className="tag"><span className="n">06</span> · KI Sekretärin</span><h3>Nimmt Anrufe entgegen. <em style={{fontStyle:'italic',color:'var(--accent)'}}>Rund um die Uhr.</em></h3></div>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <span className="badge">In Bearbeitung — Q3 / 2026</span>
              <MagBtn className="btn btn-ghost" style={{padding:'10px 18px'}} onClick={e=>{e.preventDefault();onCTA('Frühzugang')}} href="#"><span>Frühzugang sichern</span><span className="arrow">→</span></MagBtn>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURE WALKTHROUGH ────────────────────────────────── */
function FeatureWalkthrough() {
  const [activeScene, setActiveScene] = useState('inbox');
  const [arcDash, setArcDash] = useState(314);
  const [ref, vis] = useReveal();

  useEffect(() => {
    const steps = document.querySelectorAll('.step-item');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const key = e.target.dataset.scene;
        setActiveScene(key);
        if (key === 'time') setArcDash(314 * 0.28);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  const SKUS = ['X-101','A-22','B-09','T-77','R-3','Q-41','P-18','S-54','D-09','M-66','V-12','N-88','K-2','Z-99','H-14','J-5','L-8','F-31'];

  return (
    <section id="wie">
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Wie es arbeitet — 05 Schritte</span><h2>Ein Tag, <br/>von der <em style={{fontStyle:'italic',color:'var(--accent)',fontFamily:'var(--serif)',fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'}}>KI</em> geführt.</h2></div>
          <p className="lead">Scroll dich durch einen typischen Arbeitstag mit NILL.</p>
        </div>
        <div className="feature-sticky">
          <div className="text-col">
            {[
              {scene:'inbox',  idx:'01',title:'07:48 — Die erste Mail liegt schon beantwortet bereit.',text:'NILL hat die Nacht durchgearbeitet. 47 E-Mails gesichtet, 12 automatisch beantwortet, 3 zur Freigabe vorbereitet.'},
              {scene:'ledger', idx:'02',title:'09:15 — Der Handwerker schickt die Rechnung per Foto.',text:'OCR, Kontierung, Zuordnung zum richtigen Projekt, Vorbereitung für DATEV — in 4 Sekunden.'},
              {scene:'inventory',idx:'03',title:'11:02 — Zwei Artikel rutschen unter die Meldegrenze.',text:'NILL kennt deinen Lieferanten, deine Rabattstufen, deine historische Liefertreue. Die Nachbestellung liegt auf deinem Schreibtisch.'},
              {scene:'time',   idx:'04',title:'13:30 — Mittagspause. Erfasst sich selbst.',text:'Keine App öffnen. Keine Buttons. Die KI erkennt Muster, Projekte, Pausen und Überstunden. EuGH-konform.'},
              {scene:'team',   idx:'05',title:'16:48 — Zwei Krankmeldungen, ein Dienstplan neu.',text:'NILL plant den Morgen um, informiert die betroffenen Kunden, schlägt den passenden Springer vor.'},
            ].map(({scene,idx,title,text})=>(
              <div key={scene} className="step-item" data-scene={scene}>
                <div className="step-index"><em>{idx}</em> / {['Postfach','Buchhaltung','Inventur','Zeiterfassung','Team­verwaltung'][parseInt(idx)-1]}</div>
                <h3>{title}</h3><p>{text}</p>
              </div>
            ))}
          </div>
          <div className="visual-col">
            <div className="feature-visual">
              <div className="device">
                <div className="device-dots"><span/><span/><span/></div>
                <div className="device-frame">
                  <div className={`scene${activeScene==='inbox'?' active':''}`}>
                    <div className="inbox-row hi"><span className="inbox-dot" style={{background:'var(--accent)'}}/><span className="inbox-name">Kunde Müller GmbH</span><span className="inbox-snippet">Re: Angebot Sanierung — vielen Dank …</span><span className="inbox-time">07:48</span></div>
                    <div className="inbox-row"><span className="inbox-dot"/><span className="inbox-name">DATEV</span><span className="inbox-snippet">Monatsreporting bereit</span><span className="inbox-time">06:02</span></div>
                    <div className="inbox-row"><span className="inbox-dot" style={{background:'var(--accent-3)'}}/><span className="inbox-name">L. Schröder</span><span className="inbox-snippet">Urlaubsantrag 12.—19.08.</span><span className="inbox-time">05:55</span></div>
                    <div className="ai-reply">Sehr geehrte Frau Müller, vielen Dank für Ihre Rückmeldung. Wir bestätigen den Termin am <strong>23.04. um 09:00 Uhr</strong> …<span className="typing"/></div>
                  </div>
                  <div className={`scene${activeScene==='ledger'?' active':''}`}>
                    <div className="ocr-blip"><span className="ocr-pulse"/>OCR läuft</div>
                    <div className="ledger-head"><span>Datum</span><span>Beleg</span><span>Konto</span><span>Betrag</span></div>
                    <div className="ledger-row"><span>09.15</span><span>Rechnung <span className="cat">Elektro Baum</span></span><span>3400</span><span className="amount neg">−487,20</span></div>
                    <div className="ledger-row"><span>09.14</span><span>Abschlag <span className="cat">Müller GmbH</span></span><span>8400</span><span className="amount pos">+3.200,00</span></div>
                    <div className="ledger-row"><span>08.55</span><span>Kraftstoff <span className="cat">Tank AG</span></span><span>4600</span><span className="amount neg">−128,40</span></div>
                  </div>
                  <div className={`scene${activeScene==='inventory'?' active':''}`}>
                    <div className="inv-grid">{SKUS.map((sku,i)=><div key={sku} className={`inv-cell${[2,7,14].includes(i)?' lo':' ok'}`}>{sku}</div>)}</div>
                    <div className="inv-legend"><span>OK</span><span className="lo">Unterbestand</span></div>
                  </div>
                  <div className={`scene${activeScene==='time'?' active':''}`}>
                    <div className="time-ring">
                      <svg className="time-svg" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray="314" strokeDashoffset={arcDash} style={{transform:'rotate(-90deg)',transformOrigin:'60px 60px',transition:'stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)'}}/>
                        <text x="60" y="56" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="14" fill="#efede7">06:22</text>
                        <text x="60" y="72" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="rgba(239,237,231,.4)" letterSpacing="2">PROJEKT A</text>
                      </svg>
                    </div>
                  </div>
                  <div className={`scene${activeScene==='team'?' active':''}`}>
                    <div className="team-list">
                      <div className="team-tile"><span className="avatar">MK</span><div><div className="team-name">M. Keller</div><div className="team-role">im Dienst</div></div></div>
                      <div className="team-tile" style={{borderColor:'rgba(255,77,141,.3)',background:'rgba(255,77,141,.04)'}}><span className="avatar" style={{background:'linear-gradient(135deg,var(--accent-3),var(--accent-2))'}}>LS</span><div><div className="team-name">L. Schröder</div><div className="team-role" style={{color:'var(--accent-3)'}}>krank</div></div></div>
                      <div className="team-tile"><span className="avatar" style={{background:'linear-gradient(135deg,var(--accent),var(--accent-4))'}}>JH</span><div><div className="team-name">J. Hänisch</div><div className="team-role">im Dienst</div></div></div>
                      <div className="team-tile" style={{borderColor:'rgba(255,77,141,.3)',background:'rgba(255,77,141,.04)'}}><span className="avatar" style={{background:'linear-gradient(135deg,var(--accent-4),var(--accent-3))'}}>TB</span><div><div className="team-name">T. Baumann</div><div className="team-role" style={{color:'var(--accent-3)'}}>krank</div></div></div>
                      <div className="team-tile" style={{gridColumn:'1/-1',borderColor:'rgba(198,255,60,.4)',background:'rgba(198,255,60,.05)'}}><span className="avatar" style={{background:'var(--accent)'}}>KI</span><div><div className="team-name">Vorschlag: Springer F. Wolf für Di. 08–14 Uhr</div><div className="team-role" style={{color:'var(--accent)'}}>warten auf Freigabe</div></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ──────────────────────────────────────────────── */
function Stats() {
  const [ref, vis] = useReveal();
  const countRef = useRef(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!vis || !countRef.current) return;
    const start = performance.now();
    const tick = now => {
      const p = Math.min(1,(now-start)/1600);
      setCount(Math.round((1-Math.pow(1-p,3))*87));
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [vis]);
  return (
    <section style={{padding:'40px 0 120px'}}>
      <div className="wrap">
        <div className={`stats reveal${vis?' in':''}`} ref={ref}>
          <div className="stat"><div className="num"><em>3,5</em><span>×</span></div><div className="label">Schneller im Alltag</div></div>
          <div className="stat"><div className="num"><span ref={countRef}>{count}</span><em>%</em></div><div className="label">Weniger manuelle Arbeit</div></div>
          <div className="stat"><div className="num"><em>24</em><span>/</span><em>7</em></div><div className="label">KI im Einsatz</div></div>
          <div className="stat"><div className="num"><em>06</em><span>·</span><em>01</em></div><div className="label">Module · Ein Login</div></div>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────── */
function Testimonials() {
  const [ref, vis] = useReveal();
  const quotes = [
    {q:'„Seit NILL läuft meine Buchhaltung <em>nebenbei.</em> Ich fotografiere den Beleg und vergesse ihn. Mein Steuerberater hat nichts mehr zu meckern."', name:'Martin K.', role:'Inhaber · Sanitär-Meisterbetrieb', av:'MK', avStyle:{}},
    {q:'„Das Postfach beantwortet sich selbst — <em>nüchtern und gut formuliert.</em> Ich prüfe nur noch und klicke auf senden."', name:'Sandra R.', role:'Geschäftsführung · Logistik, 42 MA', av:'SR', avStyle:{background:'linear-gradient(135deg,var(--accent-3),var(--accent-2))'}},
    {q:'„Die Dienstpläne kommen automatisch. Wenn jemand krank ist, liegt der <em>Ersatz schon bereit.</em> Das spart Stunden pro Woche."', name:'Andreas H.', role:'Teamleitung · Pflegedienst', av:'AH', avStyle:{background:'linear-gradient(135deg,var(--accent),var(--accent-4))'}},
  ];
  return (
    <section>
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Stimmen aus der Praxis</span><h2>Was Teams <br/><em style={{fontStyle:'italic',color:'var(--accent)',fontFamily:'var(--serif)',fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'}}>spüren.</em></h2></div>
          <p className="lead">Kein Feature-Katalog. Sondern weniger Abende am Schreibtisch.</p>
        </div>
        <div className="quotes reveal in">
          {quotes.map(({q,name,role,av,avStyle})=>(
            <figure key={name} className="quote">
              <blockquote dangerouslySetInnerHTML={{__html:q}}/>
              <footer><span className="avatar" style={{width:38,height:38,...avStyle}}>{av}</span><div><div className="name">{name}</div><div className="role">{role}</div></div></footer>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ────────────────────────────────────────────── */
function Pricing({ onCTA }) {
  const [ref, vis] = useReveal();
  return (
    <section id="preise">
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Preise — einfach gehalten</span><h2>Eins. Zwei. <br/><em style={{fontStyle:'italic',color:'var(--accent)',fontFamily:'var(--serif)',fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'}}>Drei.</em></h2></div>
          <p className="lead">Alle Pakete beinhalten alle sechs Module. Kündbar monatlich.</p>
        </div>
        <div className="pricing-grid reveal in">
          {[
            {tier:'Start',sub:'Für Solo & kleine Teams',price:'29',per:'€ / Monat · pro Nutzer',items:['Alle 6 Module, 1 Nutzer inkl.','500 KI-Aktionen / Monat','DATEV-Export','E-Mail-Support'],cta:'Paket wählen',intent:'Paket'},
            {tier:'Pro',sub:'Für wachsende Betriebe',price:'99',per:'€ / Monat · Team bis 10',items:['Alle Module, bis 10 Nutzer','Unbegrenzte KI-Aktionen','API & Webhooks','Priority-Support & Onboarding','Dedizierter Steuerberater-Zugang'],cta:'Demo vereinbaren',intent:'Demo',pop:true},
            {tier:'Enterprise',sub:'Für Mittelstand',price:'Ab Gespräch',per:'',items:['Unbegrenzte Nutzer','Private Cloud / On-Prem','Custom-Integrationen','SLA & Account-Manager','DSGVO-Audit inkl.'],cta:'Gespräch anfragen',intent:'Gespräch'},
          ].map(({tier,sub,price,per,items,cta,intent,pop})=>{
            const ref2 = useRef(null); useTilt(ref2);
            return (
              <article key={tier} ref={ref2} className={`price${pop?' pop':''}`}>
                {pop && <span className="pop-chip">Meistgewählt</span>}
                <div><span className="eyebrow" style={pop?{color:'var(--accent)'}:{}}>{tier}</span><h3 style={{marginTop:12}}>{sub}</h3></div>
                <div className="price-tag"><span className="num" style={price.length>3?{fontSize:52}:{}}>{price}</span>{per&&<span className="per">{per}</span>}</div>
                <ul>{items.map(i=><li key={i}>{i}</li>)}</ul>
                <MagBtn className={`btn ${pop?'btn-primary':'btn-ghost'}`} onClick={e=>{e.preventDefault();onCTA(intent)}} href="#"><span>{cta}</span><span className="arrow">→</span></MagBtn>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── SUSTAINABILITY ─────────────────────────────────────── */
function Sustainability({ onCTA }) {
  const [ref, vis] = useReveal();
  return (
    <section id="nachhaltigkeit">
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Verantwortung statt Fußnote</span><h2>Software, die <em>nicht heizt.</em></h2></div>
          <p className="lead">KI verbraucht Strom. Also nehmen wir es ernst: NILL läuft auf erneuerbaren Energien — und was nicht grün geht, wird <strong style={{color:'var(--ink)',fontWeight:500}}>transparent kompensiert</strong>.</p>
        </div>
        <div className="nh-hero reveal in">
          <div>
            <span className="eyebrow" style={{color:'var(--accent)'}}>Unser Anspruch</span>
            <h3 style={{marginTop:20,fontSize:'clamp(34px,4.4vw,64px)',letterSpacing:'-.02em',lineHeight:1.02}}>100&nbsp;% <em>erneuerbar</em> ·<br/>100&nbsp;% <em>kompensiert.</em></h3>
            <p>Wir betreiben unsere Infrastruktur bei Rechenzentren mit nachweislich erneuerbarer Energie. Jeder Baustein, der sich noch nicht vollständig grün betreiben lässt, wird über <strong style={{color:'var(--ink)',fontWeight:500}}>zertifizierte Gold-Standard-Projekte</strong> ausgeglichen.</p>
          </div>
          <div className="nh-leaf" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none">
              <defs><linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c6ff3c"/><stop offset="1" stopColor="#38f5d0"/></linearGradient></defs>
              <path d="M100 20 C 45 55, 25 115, 45 165 C 95 170, 150 140, 170 80 C 155 55, 130 35, 100 20 Z" fill="url(#leafG)" opacity=".9"/>
              <path d="M100 20 C 95 80, 80 130, 45 165" stroke="#0a0a10" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".55"/>
            </svg>
          </div>
        </div>
        <div className="nh-stats reveal in">
          {[['100 %','Rechenzentren erneuerbar','Frankfurt & Paris — Stromversorgung aus Wasserkraft und Wind.'],['<2 g','CO₂ pro KI-Anfrage','Effiziente Modelle, Caching, Batching — jede Operation wird gemessen.'],['105 %','Überkompensation','Wir kompensieren 5 % mehr als unser Fußabdruck.']].map(([val,lbl,txt])=>(
            <div key={lbl} className="nh-stat">
              <div className="val"><em>{val}</em></div>
              <span className="lbl">{lbl}</span><p>{txt}</p>
            </div>
          ))}
        </div>
        <div className="nh-pillars reveal in">
          {[['01 / Strom','Grünstrom zuerst.','Primärinfrastruktur bei Anbietern mit 100 % Ökostrom.'],['02 / Effizienz','Jedes Watt zählt.','Modell-Routing spart Tokens. Idle-Hardware schläft automatisch.'],['03 / Kompensation','Gold Standard.','Zertifizierte Waldschutz- & Clean-Cooking-Projekte — mit öffentlicher Seriennummer.']].map(([num,h,p])=>(
            <article key={num} className="nh-pillar"><span className="num">{num}</span><h3>{h}</h3><p>{p}</p></article>
          ))}
        </div>
        <div className="nh-pledge reveal in">
          <div className="big"><em>Transparenter Nachhaltigkeitsbericht</em> — jährlich, als PDF, mit Stromquellen, Emissionen und Kompensations-Zertifikaten.</div>
          <MagBtn className="btn btn-ghost" onClick={e=>{e.preventDefault();onCTA('Nachhaltigkeitsbericht')}} href="#"><span>Bericht anfordern</span><span className="arrow">→</span></MagBtn>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────── */
function FAQ() {
  const [ref, vis] = useReveal();
  const items = [
    ['Wo werden meine Daten gespeichert?','Alle Daten liegen verschlüsselt auf Servern in Deutschland (Frankfurt). Wir sind ISO 27001-konform, nach DSGVO geprüft und bieten auf Wunsch eine Private-Cloud-Instanz.'],
    ['Ersetzt NILL meinen Steuerberater?','Nein — NILL bereitet alles so vor, dass dein Steuerberater deutlich weniger Zeit braucht. Dein Steuerberater bekommt einen dedizierten Zugang.'],
    ['Wie lange dauert das Onboarding?','Die meisten Teams sind in 48 Stunden produktiv. Wir importieren deine bestehenden E-Mail-Konten, DATEV-Listen und Mitarbeiterdaten automatisch.'],
    ['Kann ich einzelne Module abschalten?','Ja. Nutze nur, was du brauchst. Module lassen sich jederzeit aktivieren oder pausieren — ohne Vertragsanpassung.'],
    ['Was passiert, wenn die KI einen Fehler macht?','Jede automatische Aktion ist standardmäßig im "Vorschlags-Modus". Du entscheidest, was direkt geht, was freigegeben werden muss, und was dokumentiert wird.'],
    ['Wie nachhaltig ist NILL wirklich?','Unsere Kern-Infrastruktur läuft auf 100 % Ökostrom. Drittanbieter kompensieren wir zu 105 % über Gold-Standard-Projekte. Jährlicher Nachhaltigkeitsbericht auf Anfrage.'],
  ];
  return (
    <section id="faq">
      <div className="wrap-tight">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref} style={{marginBottom:40}}><div><span className="eyebrow">Antworten auf das Naheliegende</span><h2>FAQ.</h2></div></div>
        <div className="faq reveal in">
          {items.map(([q,a])=><details key={q}><summary>{q}</summary><p className="a">{a}</p></details>)}
        </div>
      </div>
    </section>
  );
}

/* ─── BIG CTA ────────────────────────────────────────────── */
function BigCTA({ onCTA }) {
  const [ref, vis] = useReveal();
  return (
    <section id="cta" className="cta-big">
      <div className="wrap">
        <h2 className={`reveal${vis?' in':''}`} ref={ref}>Lass deine KI <br/><em>anfangen</em><br/>zu arbeiten.</h2>
        <div className={`cta-sub reveal reveal-delay-1${vis?' in':''}`}>
          <p className="lead">30 Minuten Live-Demo mit einem unserer Produktspezialisten. Wir zeigen dir direkt an deinem Use-Case, wie NILL arbeitet.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <MagBtn className="btn btn-primary" onClick={e=>{e.preventDefault();onCTA('Termin')}} href="#"><span>Termin buchen</span><span className="arrow">→</span></MagBtn>
            <MagBtn className="btn btn-ghost" href="#produkte"><span>Module</span><span className="arrow">↑</span></MagBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div><div className="brand" style={{marginBottom:18}}><span className="brand-mark"/><span>NILL</span></div><p style={{maxWidth:'32ch'}}>Das KI-Betriebssystem für Unternehmen. Gebaut in Deutschland, gehostet in Frankfurt.</p></div>
          <div><h4>Produkt</h4><ul>{['Module','Preise','FAQ','Changelog'].map(l=><li key={l}><a href={l==='Module'?'#produkte':l==='Preise'?'#preise':l==='FAQ'?'#faq':'#'}>{l}</a></li>)}</ul></div>
          <div><h4>Unternehmen</h4><ul>{['Über uns','Karriere','Blog','Presse'].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
          <div><h4>Rechtliches</h4><ul>{['Impressum','Datenschutz','AGB','Sicherheit'].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
        </div>
        <div className="wordmark">NILL<em>.</em></div>
        <div className="foot-meta"><span>© 2026 NILL GmbH · nillai.de</span><span>Made with intelligence · Frankfurt a.M.</span></div>
      </div>
    </footer>
  );
}

/* ─── MODAL ──────────────────────────────────────────────── */
const PRESETS = {
  'Demo':         {t:'Live-Demo <em>anfragen.</em>',        s:'Terminvorschlag per Mail, persönlich via Videocall.'},
  'Paket':        {t:'Paket <em>wählen.</em>',              s:'Wir konfigurieren Module & Preis gemeinsam.'},
  'Gespräch':     {t:'Kurzes <em>Gespräch.</em>',           s:'15 Minuten reichen. Ehrliche Beratung, kein Sales-Druck.'},
  'Frühzugang':   {t:'Frühzugang <em>sichern.</em>',        s:'Erste Plätze gehen an Frühanfragen.'},
  'Termin':       {t:'Termin <em>buchen.</em>',             s:'Sag uns Zeitraum und Kanal — Telefon, Videocall oder vor Ort.'},
  'default':      {t:'Lass uns <em>reden.</em>',            s:'Kurz ein paar Infos — wir melden uns innerhalb von 24 h zurück.'},
};

function Modal({ intent, onClose }) {
  const [sent, setSent] = useState(false);
  const preset = PRESETS[intent] || PRESETS.default;
  useEffect(() => { setSent(false); }, [intent]);
  useEffect(() => {
    const fn = e => { if(e.key==='Escape') onClose(); };
    addEventListener('keydown', fn);
    return () => removeEventListener('keydown', fn);
  }, [onClose]);
  useEffect(() => {
    document.body.style.overflow = intent ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [intent]);

  const submit = e => {
    e.preventDefault();
    const d = new FormData(e.target);
    const name = (d.get('name')||'').trim();
    const email = (d.get('email')||'').trim();
    if (!name || !email) { e.target.reportValidity(); return; }
    const subj = encodeURIComponent(`NILL · ${intent||'Anfrage'} — ${name}`);
    const body = encodeURIComponent(`Anliegen: ${intent||'—'}\nName: ${name}\nFirma: ${d.get('company')||'—'}\nE-Mail: ${email}\n\n${d.get('message')||''}`);
    window.location.href = `mailto:hallo@nillai.de?subject=${subj}&body=${body}`;
    setSent(true);
  };

  return (
    <div className={`modal-overlay${intent?' open':''}`} onClick={e=>{if(e.target===e.currentTarget||e.target.classList.contains('modal-bg'))onClose()}}>
      <div className="modal-bg"/>
      <div className="modal-panel">
        <button className="modal-close" onClick={onClose} type="button" aria-label="Schließen">×</button>
        {!sent ? (
          <>
            <div className="modal-eyebrow">NILL · {intent||'Anfrage'}</div>
            <h3 dangerouslySetInnerHTML={{__html:preset.t}}/>
            <p className="sub">{preset.s}</p>
            <form onSubmit={submit} autoComplete="on" noValidate>
              <div className="form-row">
                <div><label htmlFor="mn">Name</label><input id="mn" name="name" required placeholder="Vor- und Nachname"/></div>
                <div><label htmlFor="mc">Unternehmen</label><input id="mc" name="company" placeholder="Firmenname"/></div>
              </div>
              <div className="form-row">
                <div><label htmlFor="me">E-Mail</label><input id="me" name="email" type="email" required placeholder="du@firma.de"/></div>
                <div><label htmlFor="mp">Telefon <span style={{opacity:.5}}>· optional</span></label><input id="mp" name="phone" placeholder="+49 ..."/></div>
              </div>
              <div className="form-field"><label htmlFor="mm">Nachricht</label><textarea id="mm" name="message" placeholder="Welches Modul interessiert dich?"/></div>
              <div className="modal-actions">
                <small>Per Klick auf „Senden" wird dein Mailprogramm geöffnet.</small>
                <MagBtn className="btn btn-primary"><span>Senden</span><span className="arrow">→</span></MagBtn>
              </div>
            </form>
          </>
        ) : (
          <div style={{textAlign:'center',padding:'10px 0'}}>
            <div className="modal-eyebrow">Gesendet · ✓</div>
            <h3>Danke, <em>wir sind dran.</em></h3>
            <p style={{margin:'0 auto',maxWidth:'40ch'}}>Deine Anfrage ist im Postfach. Ein Mensch antwortet innerhalb weniger Stunden.</p>
            <div style={{display:'flex',justifyContent:'center',marginTop:22}}>
              <MagBtn className="btn btn-ghost" onClick={onClose}><span>Schließen</span></MagBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────── */
export default function LandingPage() {
  ensureInit();
  const [modalIntent, setModalIntent] = useState(null);
  const openModal = useCallback((intent) => setModalIntent(intent || 'default'), []);
  const closeModal = useCallback(() => setModalIntent(null), []);

  return (
    <>
      <div className="vignette" aria-hidden="true"/>
      <Nav onDemo={openModal}/>
      <Hero onCTA={openModal}/>
      <Ticker/>
      <Products onCTA={openModal}/>
      <FeatureWalkthrough/>
      <Stats/>
      <Testimonials/>
      <Pricing onCTA={openModal}/>
      <Sustainability onCTA={openModal}/>
      <FAQ/>
      <BigCTA onCTA={openModal}/>
      <Footer/>
      <Modal intent={modalIntent} onClose={closeModal}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
