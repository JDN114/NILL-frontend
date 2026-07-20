import{j as t,a as u}from"./vendor-react--hPKs4bs.js";import{P as U}from"./PageLayout-DEoaAes4.js";import{a as _}from"./index-BkSEJdvi.js";import{A as Z,m as Y}from"./vendor-motion-DyRgipUS.js";import"./vendor-router-B9EJrQcr.js";import"./vendor-misc-xcvkua7f.js";const e={bg1:"#111114",bg2:"#18181c",bg3:"#222228",border:"#2e2e36",borderHi:"#44444f",textPri:"#f0f0f2",textSec:"#8a8a96",textTer:"#55555f",accent:"#00d97e",accentDim:"#00d97e22",warn:"#f5a623",warnDim:"#f5a62320",danger:"#ff4d4d",dangerDim:"#ff4d4d18",info:"#4d9fff",infoDim:"#4d9fff18",purple:"#a78bfa",purpleDim:"#a78bfa18"},V="'Syne', sans-serif",M="'DM Mono', monospace",L="'Syne', sans-serif",s=M,T=L,R=V,q=`
.nill-root * { box-sizing: border-box; }
.nill-root input, .nill-root textarea, .nill-root select {
  background: ${e.bg2}; color: ${e.textPri};
  border: 1px solid ${e.border}; border-radius: 6px;
  padding: 10px 14px; font-family: ${L}; font-size: 13px;
  width: 100%; outline: none; transition: border-color 0.15s;
}
.nill-root input::placeholder, .nill-root textarea::placeholder { color: ${e.textSec}; opacity: 1; }
.nill-root input:focus, .nill-root textarea:focus { border-color: ${e.borderHi}; }
.nill-root label {
  display: block; font-family: ${M}; font-size: 11px; color: ${e.textSec};
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
}
.nill-scrollbar::-webkit-scrollbar { width: 4px; }
.nill-scrollbar::-webkit-scrollbar-track { background: transparent; }
.nill-scrollbar::-webkit-scrollbar-thumb { background: ${e.bg3}; border-radius: 4px; }
.nill-card-hover { transition: border-color 0.15s, background 0.15s; }
.nill-card-hover:hover { border-color: ${e.borderHi} !important; background: ${e.bg2} !important; }
@keyframes nill-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.85); }
}
.nill-live-dot { animation: nill-pulse 1.6s ease-in-out infinite; }
`;function J(){return u.useEffect(()=>{if(document.getElementById("nill-global-styles"))return;const r=document.createElement("style");r.id="nill-global-styles",r.textContent=q,document.head.appendChild(r)},[]),null}const Q=`
@media (max-width: 768px) {
  /* Full-bleed shell: drop the desktop panel frame, single document scroll */
  .cm-shell {
    padding: 18px 14px 32px !important;
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
    min-height: 0 !important;
  }

  /* Compact header: title stacked, range switcher becomes a chip row */
  .cm-sectitle {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 14px;
    margin-bottom: 18px !important;
  }
  .cm-sectitle h2 { font-size: 26px !important; }
  .cm-ranges {
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .cm-ranges::-webkit-scrollbar { display: none; }
  .cm-ranges button {
    flex-shrink: 0;
    min-height: 42px;
    padding: 9px 18px !important;
    border-radius: 99px !important;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }
  .cm-ranges button:active { background: ${e.bg3} !important; }

  /* Stats: five auto-fit tiles → calm 2-up grid */
  .cm-stats {
    grid-template-columns: 1fr 1fr !important;
    margin-bottom: 16px !important;
  }
  .cm-stat { border-right: none !important; padding: 14px 16px !important; }
  .cm-stat > p:last-child { font-size: 22px !important; }

  /* Insights: single column */
  .cm-insights {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
    margin-bottom: 16px !important;
  }

  /* Filter tabs → horizontal scrollable chip row (like .em-chip) */
  .cm-tabs {
    overflow-x: auto !important;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    gap: 6px !important;
    margin-bottom: 12px !important;
  }
  .cm-tabs::-webkit-scrollbar { display: none; }
  .cm-tab {
    flex: 0 0 auto !important;
    min-height: 44px;
    padding: 9px 16px !important;
    border-radius: 99px !important;
    border: 1px solid ${e.border} !important;
    background: ${e.bg1} !important;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }
  .cm-tab:active { background: ${e.bg2} !important; }
  .cm-tab--active {
    background: ${e.bg3} !important;
    border-color: ${e.borderHi} !important;
  }

  /* Call rows: roomy tappable cards with :active feedback (no hover on touch) */
  .cm-rows { gap: 6px !important; }
  .cm-row {
    border-radius: 10px !important;
    padding: 13px 14px !important;
    min-height: 64px;
    gap: 12px !important;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }
  .cm-row:active { background: ${e.bg2} !important; border-color: ${e.borderHi} !important; }

  /* Detail drawer → bottom sheet */
  .cm-drawer-wrap {
    align-items: flex-end !important;
    padding: 0 !important;
  }
  .cm-drawer {
    max-width: 100% !important;
    max-height: 85dvh !important;
    border-radius: 16px 16px 0 0 !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: none !important;
    padding: 10px 18px calc(24px + env(safe-area-inset-bottom, 0)) !important;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
  .cm-drawer::before {
    content: "";
    display: block;
    width: 35px;
    height: 4px;
    border-radius: 99px;
    background: ${e.borderHi};
    margin: 2px auto 16px;
  }
  .cm-drawer-actions button { min-height: 44px; }
  .cm-info3 { grid-template-columns: 1fr !important; gap: 8px !important; }
}
`,F={in_progress:{label:"AKTIV",color:e.info,dim:e.infoDim},completed:{label:"BEENDET",color:e.accent,dim:e.accentDim},failed:{label:"FEHLER",color:e.danger,dim:e.dangerDim},no_input:{label:"KEIN INPUT",color:e.textTer,dim:e.bg3},busy:{label:"BESETZT",color:e.textTer,dim:e.bg3},canceled:{label:"ABGEBROCHEN",color:e.textTer,dim:e.bg3},"no-answer":{label:"KEINE ANTW.",color:e.textTer,dim:e.bg3}},w={appointment:{label:"Termin",short:"TERMIN",color:e.accent,dim:e.accentDim},question:{label:"Frage",short:"FRAGE",color:e.info,dim:e.infoDim},message:{label:"Nachricht",short:"NACHRICHT",color:e.purple,dim:e.purpleDim},escalate:{label:"Eskalation",short:"ESKALAT.",color:e.warn,dim:e.warnDim},other:{label:"Sonstiges",short:"SONSTIGE",color:e.textTer,dim:e.bg3}},$={low:{label:"NIEDRIG",color:e.accent,dim:e.accentDim},normal:{label:"NORMAL",color:e.warn,dim:e.warnDim},high:{label:"DRINGEND",color:e.danger,dim:e.dangerDim}};function H(r){if(r==null)return"—";const i=Math.floor(r/60),n=r%60;return`${i}:${String(n).padStart(2,"0")}`}function A(r){return r||"Unbekannt"}function X(r){if(!r)return"—";const i=new Date(r),n=(Date.now()-i.getTime())/1e3;return n<60?"gerade eben":n<3600?`vor ${Math.floor(n/60)} Min.`:n<86400?`vor ${Math.floor(n/3600)} Std.`:n<86400*2?"gestern":n<86400*7?`vor ${Math.floor(n/86400)} Tagen`:i.toLocaleDateString("de-DE")}function ee(r){return r?new Date(r).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"}):"—"}function te(r){const i=new Date,n=new Date(i);return r==="today"?n.setHours(0,0,0,0):r==="week"?(n.setDate(i.getDate()-6),n.setHours(0,0,0,0)):r==="month"?(n.setDate(i.getDate()-29),n.setHours(0,0,0,0)):n.setFullYear(2e3),n.getTime()}function z(r,i){return(r.started_at?new Date(r.started_at).getTime():0)>=te(i)}function re(r,i){const n=r.filter(a=>z(a,i)),o=n.length,l=r.filter(a=>a.status==="in_progress").length,p=n.filter(a=>a.escalated).length,d=n.filter(a=>a.status==="completed"&&!a.escalated).length,f=n.map(a=>a.duration_seconds).filter(a=>a!=null&&a>0),j=f.length?Math.round(f.reduce((a,g)=>a+g,0)/f.length):null,x={};n.forEach(a=>{const g=a.intent||"other";x[g]=(x[g]||0)+1});const b=Object.entries(x).sort((a,g)=>g[1]-a[1]).map(([a,g])=>({key:a,count:g,pct:o?g/o:0})),y=14,v=Array.from({length:y},(a,g)=>{const h=new Date;return h.setHours(0,0,0,0),h.setDate(h.getDate()-(y-1-g)),{date:h,count:0,escalated:0}});return r.forEach(a=>{if(!a.started_at)return;const g=new Date(a.started_at);g.setHours(0,0,0,0);const h=v.findIndex(E=>E.date.getTime()===g.getTime());h>=0&&(v[h].count++,a.escalated&&v[h].escalated++)}),{total:o,active:l,escalated:p,completedClean:d,avgDuration:j,intents:b,buckets:v}}function k({children:r,color:i=e.textSec,dim:n=e.bg3}){return t.jsx("span",{style:{display:"inline-block",background:n,color:i,border:`1px solid ${i}40`,borderRadius:3,padding:"2px 8px",fontFamily:s,fontSize:10,fontWeight:500,letterSpacing:"0.1em"},children:r})}function S({children:r,color:i=e.textTer}){return t.jsx("p",{style:{margin:"0 0 6px",fontFamily:s,fontSize:10,fontWeight:500,color:i,letterSpacing:"0.12em",textTransform:"uppercase"},children:r})}function ne({title:r,subtitle:i,action:n}){return t.jsxs("div",{className:"cm-sectitle",style:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28},children:[t.jsxs("div",{children:[t.jsx("h2",{style:{margin:0,fontFamily:R,fontSize:22,fontWeight:700,color:e.textPri,letterSpacing:"-0.02em"},children:r}),i&&t.jsx("p",{style:{margin:"5px 0 0",fontFamily:s,fontSize:11,color:e.textSec},children:i})]}),n]})}function C({onClick:r,children:i,active:n}){return t.jsx("button",{onClick:r,style:{background:n?e.bg3:"none",color:n?e.textPri:e.textSec,border:`1px solid ${n?e.borderHi:e.border}`,borderRadius:6,padding:"7px 16px",fontFamily:s,fontSize:11,letterSpacing:"0.06em",cursor:"pointer",transition:"color 0.15s, border-color 0.15s, background 0.15s"},children:i})}function ie({onClick:r,disabled:i,children:n,color:o=e.accent}){return t.jsx("button",{onClick:r,disabled:i,style:{background:o+"18",color:o,border:`1px solid ${o}60`,borderRadius:6,padding:"9px 20px",fontFamily:s,fontSize:11,fontWeight:500,letterSpacing:"0.06em",cursor:i?"not-allowed":"pointer",transition:"background 0.15s, border-color 0.15s",opacity:i?.5:1,whiteSpace:"nowrap"},children:n})}function P({title:r,body:i}){return t.jsxs("div",{style:{textAlign:"center",padding:"52px 24px",border:`1px dashed ${e.border}`,borderRadius:8},children:[t.jsx("div",{style:{width:1,height:40,background:e.border,margin:"0 auto 20px"}}),t.jsx("p",{style:{margin:"0 0 8px",fontFamily:R,fontSize:15,fontWeight:600,color:e.textSec},children:r}),i&&t.jsx("p",{style:{margin:0,fontFamily:s,fontSize:11,color:e.textTer},children:i})]})}function oe({message:r}){return t.jsx("div",{style:{background:e.dangerDim,border:`1px solid ${e.danger}40`,borderRadius:6,padding:"10px 14px",marginBottom:14},children:t.jsx("p",{style:{margin:0,fontFamily:s,fontSize:11,color:e.danger},children:r})})}function ae({onClose:r,title:i,subtitle:n,maxWidth:o=680,children:l}){return t.jsx("div",{className:"cm-drawer-wrap",style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24},onClick:p=>{p.target===p.currentTarget&&r()},children:t.jsxs(Y.div,{initial:{opacity:0,scale:.97,y:12},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.97,y:12},transition:{duration:.18},className:"nill-scrollbar cm-drawer",style:{background:e.bg1,border:`1px solid ${e.border}`,borderRadius:10,width:"100%",maxWidth:o,maxHeight:"88vh",overflowY:"auto",padding:"28px 32px"},children:[t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24},children:[t.jsxs("div",{children:[t.jsx("h2",{style:{margin:0,fontFamily:R,fontSize:18,fontWeight:700,color:e.textPri,letterSpacing:"-0.02em"},children:i}),n&&t.jsx("p",{style:{margin:"4px 0 0",fontFamily:s,fontSize:11,color:e.textSec},children:n})]}),t.jsx("button",{onClick:r,style:{background:"none",border:"none",color:e.textTer,fontSize:18,cursor:"pointer",lineHeight:1,padding:4,marginLeft:16},children:"✕"})]}),l]})})}function D({label:r,children:i,color:n=e.textSec,accent:o}){return t.jsxs("div",{style:{background:e.bg2,border:`1px solid ${e.border}`,borderLeft:o?`2px solid ${o}`:void 0,borderRadius:o?"0 6px 6px 0":6,padding:"12px 16px",marginBottom:12},children:[t.jsx(S,{children:r}),t.jsx("div",{style:{fontFamily:T,fontSize:13,color:n,lineHeight:1.65},children:i})]})}function le({stats:r,range:i}){const n=[{label:i==="today"?"ANRUFE HEUTE":i==="week"?"ANRUFE / WOCHE":"ANRUFE / MONAT",value:r.total},{label:"ESKALIERT",value:r.escalated,hint:r.escalated>0?e.warn:null},{label:"Ø DAUER",value:r.avgDuration!=null?H(r.avgDuration):"—"},{label:"AKTIV",value:r.active,live:r.active>0},{label:"AUTOM. GELÖST",value:r.completedClean,hint:e.accent}];return t.jsx("div",{className:"cm-stats",style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:1,border:`1px solid ${e.border}`,borderRadius:8,overflow:"hidden",marginBottom:28},children:n.map((o,l)=>t.jsxs("div",{className:"cm-stat",style:{background:e.bg2,padding:"18px 20px",borderRight:l<n.length-1?`1px solid ${e.border}`:"none"},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8},children:[t.jsx("p",{style:{margin:0,fontFamily:s,fontSize:9,color:e.textTer,letterSpacing:"0.12em"},children:o.label}),o.live&&t.jsx("span",{className:"nill-live-dot",style:{width:6,height:6,borderRadius:"50%",background:e.info}})]}),t.jsx("p",{style:{margin:0,fontFamily:s,fontSize:28,fontWeight:500,color:o.hint||e.textPri,lineHeight:1},children:o.value})]},l))})}function se({intents:r}){if(!r.length)return t.jsx("p",{style:{margin:0,fontFamily:s,fontSize:11,color:e.textTer},children:"Keine Daten."});const i=r[0].count;return t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:10},children:r.map(n=>{const o=w[n.key]||w.other,l=i>0?n.count/i*100:0;return t.jsxs("div",{children:[t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4},children:[t.jsx("span",{style:{fontFamily:s,fontSize:10,color:e.textSec,letterSpacing:"0.08em"},children:o.short}),t.jsxs("span",{style:{fontFamily:s,fontSize:11,color:e.textPri},children:[n.count," ",t.jsxs("span",{style:{color:e.textTer},children:["· ",Math.round(n.pct*100),"%"]})]})]}),t.jsx("div",{style:{height:4,background:e.bg2,borderRadius:2,overflow:"hidden"},children:t.jsx("div",{style:{height:"100%",width:`${l}%`,background:o.color,transition:"width 0.4s"}})})]},n.key)})})}function de({buckets:r}){var n;const i=Math.max(1,...r.map(o=>o.count));return t.jsxs("div",{children:[t.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${r.length}, 1fr)`,alignItems:"end",gap:3,height:80},children:r.map((o,l)=>{const p=o.count/i*100,d=o.escalated?o.escalated/i*100:0;return t.jsx("div",{title:`${o.date.toLocaleDateString("de-DE")} · ${o.count} Anrufe${o.escalated?` · ${o.escalated} eskaliert`:""}`,style:{position:"relative",height:"100%",display:"flex",alignItems:"flex-end"},children:t.jsx("div",{style:{width:"100%",height:`${Math.max(p,o.count>0?4:0)}%`,background:e.borderHi,borderRadius:"2px 2px 0 0",transition:"height 0.3s"},children:d>0&&t.jsx("div",{style:{width:"100%",height:`${o.escalated/Math.max(o.count,1)*100}%`,background:e.warn,borderRadius:"2px 2px 0 0"}})})},l)})}),t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:8},children:[t.jsx("span",{style:{fontFamily:s,fontSize:9,color:e.textTer},children:(n=r[0])==null?void 0:n.date.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})}),t.jsx("span",{style:{fontFamily:s,fontSize:9,color:e.textTer},children:"HEUTE"})]})]})}function ce({stats:r}){return t.jsxs("div",{className:"cm-insights",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:28},children:[t.jsxs("div",{style:{background:e.bg1,border:`1px solid ${e.border}`,borderRadius:8,padding:"18px 22px"},children:[t.jsx(S,{children:"Anliegen-Verteilung"}),t.jsx("div",{style:{marginTop:14},children:t.jsx(se,{intents:r.intents})})]}),t.jsxs("div",{style:{background:e.bg1,border:`1px solid ${e.border}`,borderRadius:8,padding:"18px 22px"},children:[t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14},children:[t.jsx(S,{children:"Aktivität · 14 Tage"}),t.jsxs("div",{style:{display:"flex",gap:12,fontFamily:s,fontSize:9,color:e.textTer,letterSpacing:"0.08em"},children:[t.jsxs("span",{style:{display:"flex",alignItems:"center",gap:4},children:[t.jsx("span",{style:{width:8,height:8,background:e.borderHi,borderRadius:1}}),"ANRUFE"]}),t.jsxs("span",{style:{display:"flex",alignItems:"center",gap:4},children:[t.jsx("span",{style:{width:8,height:8,background:e.warn,borderRadius:1}}),"ESKALIERT"]})]})]}),t.jsx(de,{buckets:r.buckets})]})]})}function pe({value:r,onChange:i,counts:n}){const o=[{key:"all",label:"ALLE",count:n.all},{key:"active",label:"AKTIV",count:n.active},{key:"escalated",label:"ESKALIERT",count:n.escalated},{key:"unresolved",label:"OFFEN",count:n.unresolved},{key:"completed",label:"BEENDET",count:n.completed}];return t.jsx("div",{className:"cm-tabs",style:{display:"flex",gap:2,marginBottom:14,background:e.bg2,borderRadius:6,padding:3,border:`1px solid ${e.border}`},children:o.map(l=>{const p=r===l.key;return t.jsxs("button",{className:`cm-tab${p?" cm-tab--active":""}`,onClick:()=>i(l.key),style:{flex:1,padding:"8px 4px",background:p?e.bg3:"none",border:p?`1px solid ${e.border}`:"1px solid transparent",borderRadius:4,fontFamily:s,fontSize:10,letterSpacing:"0.08em",color:p?e.textPri:e.textTer,cursor:"pointer",transition:"all 0.12s",display:"flex",alignItems:"center",justifyContent:"center",gap:6},children:[t.jsx("span",{children:l.label}),l.count>0&&t.jsx("span",{style:{background:p?e.borderHi:e.bg3,color:p?e.textPri:e.textTer,borderRadius:99,padding:"1px 7px",fontSize:9},children:l.count})]},l.key)})})}function me({call:r,onClick:i,isFirst:n,isLast:o}){const l=F[r.status]||F.completed,p=w[r.intent]||w.other,d=r.escalated?$[r.escalation_urgency]||$.normal:null,f=r.escalated&&r.extra&&r.extra.resolved;return t.jsxs("div",{className:"nill-card-hover cm-row",onClick:i,style:{background:e.bg1,border:`1px solid ${e.border}`,borderRadius:n&&o?8:n?"8px 8px 2px 2px":o?"2px 2px 8px 8px":2,padding:"14px 20px",cursor:"pointer",display:"flex",gap:16,alignItems:"center"},children:[t.jsx("div",{style:{width:38,height:38,borderRadius:"50%",background:l.dim,border:`1px solid ${l.color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:r.status==="in_progress"?t.jsx("span",{className:"nill-live-dot",style:{width:8,height:8,borderRadius:"50%",background:e.info}}):t.jsx("span",{style:{fontFamily:s,fontSize:11,color:l.color},children:r.escalated?"!":"✓"})}),t.jsxs("div",{style:{flex:1,minWidth:0},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:4},children:[t.jsx("span",{style:{fontFamily:R,fontSize:14,fontWeight:600,color:e.textPri},children:r.caller_name||A(r.from_number)}),t.jsx(k,{color:p.color,dim:p.dim,children:p.short}),d&&t.jsx(k,{color:d.color,dim:d.dim,children:d.label}),f&&t.jsx(k,{color:e.accent,dim:e.accentDim,children:"GELÖST"})]}),t.jsx("p",{style:{margin:0,fontFamily:T,fontSize:12,color:e.textSec,lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:r.summary?r.summary:r.escalation_reason?`Eskaliert: ${r.escalation_reason}`:r.caller_name&&r.callback_number?`${r.callback_number}`:t.jsx("span",{style:{color:e.textTer,fontStyle:"italic"},children:r.status==="in_progress"?"Läuft gerade …":"Keine Zusammenfassung"})})]}),t.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0},children:[t.jsx(k,{color:l.color,dim:l.dim,children:l.label}),t.jsxs("span",{style:{fontFamily:s,fontSize:9,color:e.textTer},children:[H(r.duration_seconds)," · ",X(r.started_at)]})]})]})}function xe({calls:r,onSelect:i}){return r.length?t.jsx("div",{className:"cm-rows",style:{display:"flex",flexDirection:"column",gap:1},children:r.map((n,o)=>t.jsx(me,{call:n,onClick:()=>i(n.id),isFirst:o===0,isLast:o===r.length-1},n.id))}):t.jsx(P,{title:"Keine Anrufe in diesem Filter",body:"Wähle einen anderen Zeitraum oder Filter"})}function ge({turn:r}){var o;const i=r.role==="user";return r.role==="tool"?t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,margin:"8px 0",fontFamily:s,fontSize:10,color:e.textTer,letterSpacing:"0.06em"},children:[t.jsx("div",{style:{flex:1,height:1,background:e.border}}),t.jsxs("span",{style:{background:e.bg2,border:`1px solid ${e.border}`,borderRadius:99,padding:"3px 10px",color:e.textSec},children:["⚙ ",(o=r.tool_name)==null?void 0:o.toUpperCase().replace(/_/g," "),r.tool_result&&r.tool_result.ok===!1&&t.jsx("span",{style:{color:e.danger,marginLeft:6},children:"FEHLER"})]}),t.jsx("div",{style:{flex:1,height:1,background:e.border}})]}):t.jsx("div",{style:{display:"flex",justifyContent:i?"flex-end":"flex-start",marginBottom:10},children:t.jsxs("div",{style:{maxWidth:"78%",background:i?e.bg3:e.bg2,border:`1px solid ${e.border}`,borderRadius:i?"10px 10px 2px 10px":"10px 10px 10px 2px",padding:"10px 14px"},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:4},children:[t.jsx("span",{style:{fontFamily:s,fontSize:9,letterSpacing:"0.1em",color:i?e.info:e.accent},children:i?"ANRUFER":"NILL"}),t.jsx("span",{style:{fontFamily:s,fontSize:9,color:e.textTer},children:r.created_at&&new Date(r.created_at).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})})]}),t.jsx("p",{style:{margin:0,fontFamily:T,fontSize:13,color:e.textPri,lineHeight:1.55,whiteSpace:"pre-wrap"},children:r.content||t.jsx("span",{style:{color:e.textTer,fontStyle:"italic"},children:"(leer)"})})]})})}function ue({turns:r}){const i=(r||[]).filter(n=>!(n.role==="assistant"&&!n.content||n.role==="system"));return i.length?t.jsx("div",{style:{background:e.bg1,border:`1px solid ${e.border}`,borderRadius:8,padding:"16px 18px",maxHeight:420,overflowY:"auto"},className:"nill-scrollbar",children:i.map(n=>t.jsx(ge,{turn:n},n.id))}):t.jsx("p",{style:{margin:0,fontFamily:s,fontSize:11,color:e.textTer},children:"KEIN GESPRÄCH AUFGEZEICHNET"})}function fe({call:r,onClose:i,onResolve:n,resolving:o}){if(!r)return null;const l=F[r.status]||F.completed,p=w[r.intent]||w.other,d=r.escalated?$[r.escalation_urgency]||$.normal:null,f=r.escalated&&r.extra&&r.extra.resolved,j=(r.turns||[]).filter(x=>x.role==="tool");return t.jsxs(ae,{onClose:i,title:r.caller_name||A(r.from_number),subtitle:`${ee(r.started_at)} · ${H(r.duration_seconds)} · ${p.label}`,maxWidth:720,children:[t.jsxs("div",{className:"cm-drawer-actions",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,gap:10,flexWrap:"wrap"},children:[t.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:[t.jsx(k,{color:l.color,dim:l.dim,children:l.label}),t.jsx(k,{color:p.color,dim:p.dim,children:p.short}),d&&t.jsx(k,{color:d.color,dim:d.dim,children:d.label}),f&&t.jsx(k,{color:e.accent,dim:e.accentDim,children:"GELÖST"})]}),r.escalated&&!f&&t.jsx(ie,{onClick:()=>n(r.id),disabled:o,color:e.accent,children:o?"MARKIERE …":"Als gelöst markieren"})]}),t.jsxs("div",{className:"cm-info3",style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16},children:[t.jsxs("div",{style:{background:e.bg2,border:`1px solid ${e.border}`,borderRadius:6,padding:"10px 14px"},children:[t.jsx(S,{children:"Anrufer"}),t.jsx("p",{style:{margin:0,fontFamily:T,fontSize:13,color:e.textPri},children:r.caller_name||t.jsx("span",{style:{color:e.textTer},children:"Nicht erfasst"})})]}),t.jsxs("div",{style:{background:e.bg2,border:`1px solid ${e.border}`,borderRadius:6,padding:"10px 14px"},children:[t.jsx(S,{children:"Rückrufnummer"}),t.jsx("p",{style:{margin:0,fontFamily:s,fontSize:13,color:e.textPri},children:r.callback_number||r.from_number||t.jsx("span",{style:{color:e.textTer,fontFamily:T},children:"—"})})]}),t.jsxs("div",{style:{background:e.bg2,border:`1px solid ${e.border}`,borderRadius:6,padding:"10px 14px"},children:[t.jsx(S,{children:"Eingang"}),t.jsx("p",{style:{margin:0,fontFamily:s,fontSize:13,color:e.textPri},children:A(r.to_number)})]})]}),r.escalated&&t.jsxs(D,{label:"Eskalation",accent:(d==null?void 0:d.color)||e.warn,color:e.textPri,children:[t.jsx("p",{style:{margin:0},children:r.escalation_reason||"Kein Grund angegeben."}),d&&t.jsxs("p",{style:{margin:"6px 0 0",fontFamily:s,fontSize:10,color:d.color,letterSpacing:"0.1em"},children:["DRINGLICHKEIT: ",d.label]})]}),r.summary?t.jsx(D,{label:"Zusammenfassung",accent:e.accent,color:e.textPri,children:r.summary}):r.status==="in_progress"?t.jsx(D,{label:"Zusammenfassung",color:e.textTer,children:"Wird nach Gesprächsende erstellt …"}):t.jsx(D,{label:"Zusammenfassung",color:e.textTer,children:"Noch nicht verfügbar."}),j.length>0&&t.jsxs("div",{style:{marginBottom:16},children:[t.jsx(S,{children:"NILL-Aktionen"}),t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:6,marginTop:8},children:j.map(x=>{var y;const b=!x.tool_result||x.tool_result.ok!==!1;return t.jsxs("div",{style:{background:e.bg2,border:`1px solid ${e.border}`,borderRadius:6,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,minWidth:0},children:[t.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:b?e.accent:e.danger,flexShrink:0}}),t.jsx("span",{style:{fontFamily:s,fontSize:11,color:e.textPri,letterSpacing:"0.04em"},children:(y=x.tool_name)==null?void 0:y.replace(/_/g," ")}),x.tool_args&&Object.keys(x.tool_args).length>0&&t.jsx("span",{style:{fontFamily:s,fontSize:10,color:e.textTer,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:Object.entries(x.tool_args).slice(0,3).map(([v,a])=>`${v}=${typeof a=="string"?a.slice(0,30):JSON.stringify(a).slice(0,30)}`).join(" · ")})]}),t.jsx("span",{style:{fontFamily:s,fontSize:9,color:e.textTer,flexShrink:0},children:x.created_at&&new Date(x.created_at).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})})]},x.id)})})]}),t.jsxs("div",{style:{marginTop:4},children:[t.jsx(S,{children:"Gesprächsverlauf"}),t.jsx("div",{style:{marginTop:8},children:t.jsx(ue,{turns:r.turns})})]})]})}function he(){const[r,i]=u.useState([]),[n,o]=u.useState(!0),[l,p]=u.useState(null),[d,f]=u.useState("today"),[j,x]=u.useState("all"),[b,y]=u.useState(null),[v,a]=u.useState(!1),[g,h]=u.useState(!1);u.useEffect(()=>{E()},[]),u.useEffect(()=>{const m=setInterval(E,2e4);return()=>clearInterval(m)},[]);async function E(){try{const m=await _.get("/calls?limit=200");i(Array.isArray(m.data)?m.data:[]),p(null)}catch{p("Anrufdaten konnten nicht geladen werden.")}finally{o(!1)}}async function O(m){a(!0);try{const c=await _.get(`/calls/${m}`);y(c.data)}catch{p("Anrufdetails konnten nicht geladen werden.")}finally{a(!1)}}async function W(m){h(!0);try{const c=await _.post(`/calls/${m}/resolve`);i(I=>I.map(N=>N.id===m?{...N,...c.data}:N)),(b==null?void 0:b.id)===m&&y(I=>({...I,...c.data}))}catch{p("Konnte nicht als gelöst markiert werden.")}finally{h(!1)}}const B=u.useMemo(()=>re(r,d),[r,d]),G=u.useMemo(()=>{const m=r.filter(c=>z(c,d));switch(j){case"active":return m.filter(c=>c.status==="in_progress");case"escalated":return m.filter(c=>c.escalated);case"unresolved":return m.filter(c=>c.escalated&&!(c.extra&&c.extra.resolved));case"completed":return m.filter(c=>c.status==="completed");default:return m}},[r,j,d]),K=u.useMemo(()=>{const m=r.filter(c=>z(c,d));return{all:m.length,active:m.filter(c=>c.status==="in_progress").length,escalated:m.filter(c=>c.escalated).length,unresolved:m.filter(c=>c.escalated&&!(c.extra&&c.extra.resolved)).length,completed:m.filter(c=>c.status==="completed").length}},[r,d]);return t.jsxs("div",{children:[t.jsx(ne,{title:"Anrufe",subtitle:"NILL nimmt Anrufe entgegen, beantwortet Fragen und meldet sich, wenn ein Mensch ran muss.",action:t.jsxs("div",{className:"cm-ranges",style:{display:"flex",gap:6},children:[t.jsx(C,{active:d==="today",onClick:()=>f("today"),children:"HEUTE"}),t.jsx(C,{active:d==="week",onClick:()=>f("week"),children:"WOCHE"}),t.jsx(C,{active:d==="month",onClick:()=>f("month"),children:"MONAT"})]})}),l&&t.jsx(oe,{message:l}),t.jsx(le,{stats:B,range:d}),t.jsx(ce,{stats:B}),t.jsx(pe,{value:j,onChange:x,counts:K}),n?t.jsx("p",{style:{textAlign:"center",padding:40,fontFamily:s,fontSize:11,color:e.textTer},children:"LADE …"}):r.length===0?t.jsx(P,{title:"Noch keine Anrufe",body:"Sobald NILL den ersten Anruf entgegennimmt, erscheint er hier."}):t.jsx(xe,{calls:G,onSelect:O}),t.jsxs(Z,{children:[b&&t.jsx(fe,{call:b,onClose:()=>y(null),onResolve:W,resolving:g}),v&&!b&&t.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center"},children:t.jsx("p",{style:{fontFamily:s,fontSize:12,color:e.textPri,letterSpacing:"0.08em"},children:"LADE …"})})]})]})}function we(){return t.jsxs(U,{children:[t.jsx(J,{}),t.jsx("style",{children:Q}),t.jsx("div",{className:"nill-root cm-shell",style:{maxWidth:1180,margin:"0 auto",background:e.bg1,border:`1px solid ${e.border}`,borderRadius:10,padding:"32px 36px",fontFamily:L,minHeight:"80vh"},children:t.jsx(he,{})})]})}export{he as CallsBoard,we as default};
