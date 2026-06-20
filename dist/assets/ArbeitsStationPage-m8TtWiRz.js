import{a as i,j as e}from"./vendor-react--hPKs4bs.js";import{a as v,L as j}from"./vendor-router-B9EJrQcr.js";import{a as y,u as S}from"./index-TQlu1-jl.js";import"./vendor-misc-xcvkua7f.js";const N={position:"fixed",inset:0,zIndex:9999,background:"rgba(4,7,15,0.88)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"},z={background:"rgba(15,18,28,0.98)",border:"1px solid rgba(var(--ink-tint),0.1)",borderRadius:20,padding:"2rem 2.25rem",width:"100%",maxWidth:400,display:"flex",flexDirection:"column",gap:"1.25rem",fontFamily:"'Inter', system-ui, sans-serif"},C={width:"100%",padding:"0.65rem 0.9rem",background:"rgba(var(--tint),0.04)",border:"1px solid rgba(var(--tint),0.12)",borderRadius:10,color:"#efede7",fontSize:"0.95rem",fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.1em",outline:"none",boxSizing:"border-box"},M={width:"100%",padding:"0.7rem",background:"#c5a572",border:"none",borderRadius:10,color:"#000",fontWeight:700,fontSize:"0.9rem",cursor:"pointer"},E={background:"none",border:"none",color:"rgba(var(--ink-tint),0.45)",fontSize:"0.8rem",cursor:"pointer",padding:"0.3rem 0",textDecoration:"underline",textUnderlineOffset:3};function A({onClose:t,hasPassword:a}){const s=v(),[r,h]=i.useState(""),[c,g]=i.useState(!1),[u,d]=i.useState(""),l=()=>{localStorage.removeItem("nill_kiosk_device"),s("/dashboard")};i.useEffect(()=>{a||l()},[]);const b=async n=>{var m,p;if(n.preventDefault(),!!r){g(!0),d("");try{await y.post("/auth/station/verify-exit-password",{password:r}),l()}catch(x){d(((p=(m=x==null?void 0:x.response)==null?void 0:m.data)==null?void 0:p.detail)??"Falsches Passwort.")}finally{g(!1)}}};return a?e.jsx("div",{style:N,onClick:n=>{n.target===n.currentTarget&&t()},children:e.jsxs("div",{style:z,children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontFamily:"'JetBrains Mono', monospace",fontSize:"0.62rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(var(--ink-tint),0.35)",marginBottom:6},children:"ArbeitsStation"}),e.jsx("div",{style:{fontFamily:"'Fraunces', Georgia, serif",fontSize:"1.4rem",fontWeight:400,color:"#efede7",letterSpacing:"-0.02em"},children:"Station verlassen?"})]}),e.jsxs("form",{onSubmit:b,style:{display:"flex",flexDirection:"column",gap:"0.85rem"},children:[e.jsx("p",{style:{margin:0,fontSize:"0.82rem",color:"rgba(var(--ink-tint),0.5)",lineHeight:1.55},children:"Bitte gib das Stations-Passwort ein, um den Kiosk-Modus zu beenden."}),e.jsx("input",{type:"password",placeholder:"Passwort",value:r,onChange:n=>h(n.target.value),style:C,autoFocus:!0,autoComplete:"off",autoCapitalize:"none",autoCorrect:"off",spellCheck:!1,name:"station-exit-password"}),u&&e.jsx("div",{style:{fontSize:"0.78rem",color:"#f87171"},children:u}),e.jsx("button",{type:"submit",disabled:c||!r,style:{...M,opacity:c||!r?.6:1},children:c?"Prüfen…":"Bestätigen"}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",alignItems:"center"},children:e.jsx("button",{type:"button",style:E,onClick:t,children:"Abbrechen"})})]})]})}):null}const F=`
  .as-root {
    --as-bg:        #040817;
    --as-hdr-bg:    rgba(4,8,23,.95);
    --as-ink:       #efede7;
    --as-ink-sub:   rgba(var(--ink-tint),.48);
    --as-ink-faint: rgba(var(--ink-tint),.18);
    --as-line:      rgba(var(--ink-tint),.07);
    --as-glass:     rgba(var(--tint),.04);
    --as-glass-hov: rgba(var(--tint),.08);
    --as-accent:    #c5a572;
    --as-logo-fg:   #03060a;
    --as-serif:     "Fraunces",Georgia,serif;
    --as-sans:      "Inter",system-ui,sans-serif;
    --as-mono:      "JetBrains Mono",monospace;

    height: 100vh; overflow: hidden;
    background: var(--as-bg);
    display: flex; flex-direction: column;
    font-family: var(--as-sans);
    color: var(--as-ink);
  }

  html[data-theme="light"] .as-root {
    --as-bg:        #eae3d4;
    --as-hdr-bg:    rgba(234,227,212,.97);
    --as-ink:       #201d15;
    --as-ink-sub:   rgba(var(--ink-tint),.58);
    --as-ink-faint: rgba(var(--ink-tint),.22);
    --as-line:      rgba(var(--ink-tint),.14);
    --as-glass:     rgba(var(--tint),.045);
    --as-glass-hov: rgba(var(--tint),.085);
    --as-accent:    #806228;
    --as-logo-fg:   #fff;
  }

  /* Header */
  .as-hdr {
    background: var(--as-hdr-bg);
    border-bottom: 1px solid var(--as-line);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    padding: 0 clamp(16px,3vw,40px);
    height: clamp(56px,7vw,72px);
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    flex-shrink: 0;
  }
  .as-hdr-brand { display:flex; align-items:center; gap:12px; }
  .as-logo-box {
    width: clamp(30px,3.5vw,40px); height: clamp(30px,3.5vw,40px);
    background: var(--as-accent); border-radius: 8px;
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:clamp(0.8rem,1.2vw,1rem);
    color: var(--as-logo-fg); letter-spacing:-0.02em; flex-shrink:0;
  }
  .as-logo-name {
    font-family: var(--as-serif); font-size:clamp(0.9rem,1.4vw,1.15rem);
    font-weight:400; color:var(--as-ink); letter-spacing:-0.02em; line-height:1;
  }
  .as-logo-tag {
    font-family: var(--as-mono); font-size:clamp(0.55rem,0.75vw,0.65rem);
    color:var(--as-ink-sub); letter-spacing:0.15em; text-transform:uppercase; margin-top:2px;
  }

  /* Clock */
  .as-clock { text-align:right; }
  .as-clock-time {
    font-family: var(--as-mono); font-size:clamp(1.1rem,2vw,1.6rem);
    font-weight:700; color:var(--as-ink); letter-spacing:0.04em; line-height:1;
  }
  .as-clock-date {
    font-family: var(--as-sans); font-size:clamp(0.6rem,0.9vw,0.75rem);
    color:var(--as-ink-sub); margin-top:3px; letter-spacing:0.03em;
  }

  /* Exit button */
  .as-exit-btn {
    padding: 0.35rem 0.9rem;
    background: var(--as-glass); border: 1px solid var(--as-line); border-radius:7px;
    color: var(--as-ink-sub);
    font-family: var(--as-mono); font-size:clamp(0.58rem,0.8vw,0.68rem);
    letter-spacing:0.1em; text-transform:uppercase; white-space:nowrap; cursor:pointer;
    transition: background .2s, border-color .2s, color .2s;
  }
  .as-exit-btn:hover {
    background: var(--as-glass-hov); border-color:var(--as-ink-faint); color:var(--as-ink);
  }

  /* Main */
  .as-main {
    flex:1; overflow:hidden;
    padding: clamp(12px,2vw,28px) clamp(16px,3vw,40px);
    display:flex; flex-direction:column; gap:clamp(10px,1.5vw,20px);
    max-width:1400px; width:100%; margin:0 auto; box-sizing:border-box;
  }

  /* Greeting */
  .as-eyebrow {
    font-family: var(--as-mono); font-size:clamp(0.55rem,0.75vw,0.65rem);
    letter-spacing:0.2em; text-transform:uppercase; color:var(--as-ink-sub);
    margin-bottom:4px; display:flex; align-items:center; gap:8px;
  }
  .as-eyebrow-line { width:12px; height:1px; background:currentColor; opacity:.5; display:inline-block; }
  .as-h1 {
    font-family: var(--as-serif); font-size:clamp(1.2rem,2.5vw,2rem);
    font-weight:400; color:var(--as-ink); letter-spacing:-0.025em; line-height:1; margin:0;
  }
  .as-h1 em { font-style:italic; color:var(--as-accent); }

  /* Empty state */
  .as-empty {
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:12px; background:var(--as-glass); border:1px solid var(--as-line);
    border-radius:16px; text-align:center;
  }
  .as-empty-icon { font-size:2rem; opacity:.35; color:var(--as-ink-sub); }
  .as-empty-label {
    font-family:var(--as-serif); font-size:1.1rem; font-weight:400; color:var(--as-ink-sub);
  }
  .as-setup-link {
    margin-top:4px; padding:0.45rem 1.1rem;
    background:var(--as-accent); border-radius:7px;
    text-decoration:none; font-weight:700; font-size:0.78rem;
    color:var(--as-logo-fg); transition:opacity .2s;
  }
  .as-setup-link:hover { opacity:.85; }

  /* Module grid */
  .as-grid { flex:1; overflow:hidden; display:grid; gap:clamp(6px,1vw,12px); }

  /* Module card */
  .as-card {
    background: var(--as-glass); border:1px solid var(--as-line); border-radius:14px;
    padding:12px 16px; display:flex; flex-direction:row; align-items:center; gap:12px;
    cursor:pointer; transition:background .2s, border-color .2s, transform .15s;
    text-align:left; width:100%; height:100%; position:relative; overflow:hidden;
    box-sizing:border-box;
  }
  .as-card:hover { background:var(--as-glass-hov); }
  .as-card:active { transform:scale(0.97); }
  .as-card-body { flex:1; min-width:0; }
  .as-card-label {
    font-family:var(--as-serif); font-size:clamp(0.85rem,1.4vw,1.05rem);
    font-weight:400; color:var(--as-ink); letter-spacing:-0.02em; line-height:1.15;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .as-card-desc {
    font-family:var(--as-sans); font-size:clamp(0.62rem,0.9vw,0.72rem);
    color:var(--as-ink-sub); line-height:1.3; margin-top:2px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .as-card-arrow { font-family:var(--as-mono); font-size:0.65rem; opacity:.65; flex-shrink:0; }

  /* Footer */
  .as-footer {
    border-top:1px solid var(--as-line);
    padding:clamp(8px,1vw,12px) clamp(16px,3vw,40px);
    display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
  }
  .as-footer-text {
    font-family:var(--as-mono); font-size:0.62rem;
    letter-spacing:0.1em; color:var(--as-ink-faint); text-transform:uppercase;
  }
`,k={calendar:{label:"Kalender",icon:"▦",color:"#38f5d0",route:"/station/calendar",desc:"Termine & Planung"},workflow:{label:"Aufgaben",icon:"⌘",color:"#c6ff3c",route:"/station/tasks",desc:"Tasks & Prozesse"},time:{label:"Zeiterfassung",icon:"⏱",color:"#ff4d8d",route:"/station/time",desc:"Arbeitszeiten"},hr_docs:{label:"HR & Listen",icon:"📄",color:"#fbbf24",route:"/station/hr-documents",desc:"Dokumente, Listen & Lieferscheine"},shift_plan:{label:"Schichtplan",icon:"⬡",color:"#38f5d0",route:"/station/schichtplan",desc:"Wochenschichten & Team"},delivery:{label:"Lieferscheine",icon:"📦",color:"#fb923c",route:"/station/lieferscheine",desc:"Lieferungen & Bestätigung"},inventory:{label:"Inventur",icon:"◫",color:"#a78bfa",route:"/station/inventur",desc:"Bestand & Lager"}};function L(){const[t,a]=i.useState(new Date);return i.useEffect(()=>{const s=setInterval(()=>a(new Date),1e3);return()=>clearInterval(s)},[]),e.jsxs("div",{className:"as-clock",children:[e.jsx("div",{className:"as-clock-time",children:t.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}),e.jsx("div",{className:"as-clock-date",children:t.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long",year:"numeric"})})]})}function D({moduleKey:t,onClick:a}){const s=k[t];return s?e.jsxs("button",{className:"as-card",onClick:()=>a(s.route),onMouseEnter:r=>{r.currentTarget.style.borderColor=`${s.color}55`},onMouseLeave:r=>{r.currentTarget.style.borderColor=""},children:[e.jsx("div",{style:{position:"absolute",top:-30,right:-30,width:80,height:80,borderRadius:"50%",background:`radial-gradient(circle, ${s.color}18, transparent 70%)`,pointerEvents:"none"}}),e.jsx("div",{style:{width:36,height:36,borderRadius:10,background:`${s.color}18`,border:`1px solid ${s.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.05rem",flexShrink:0},children:s.icon}),e.jsxs("div",{className:"as-card-body",children:[e.jsx("div",{className:"as-card-label",children:s.label}),e.jsx("div",{className:"as-card-desc",children:s.desc})]}),e.jsx("div",{className:"as-card-arrow",style:{color:s.color},children:"→"})]}):null}function P(){const{user:t,org:a,isCompanyAdmin:s}=S(),r=s(),h=v(),[c,g]=i.useState(null),[u,d]=i.useState(!1),l=(a==null?void 0:a.station_modules)??[];i.useEffect(()=>{y.get("/me/profile").then(o=>g(o.data.name||null)).catch(()=>{})},[]);const b=o=>{sessionStorage.setItem("nill_from_station","1"),h(o)},n=new Date().getHours(),m=n<12?"Guten Morgen":n<18?"Guten Tag":"Guten Abend",p=(a==null?void 0:a.name)??c??null,f=l.filter(o=>k[o]).length,w=f<=2?f:f<=4?2:f<=6||f<=9?3:4;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:F}),e.jsxs("div",{className:"as-root",children:[e.jsxs("header",{className:"as-hdr",children:[e.jsxs("div",{className:"as-hdr-brand",children:[e.jsx("div",{className:"as-logo-box",children:"N"}),e.jsxs("div",{children:[e.jsx("div",{className:"as-logo-name",children:(a==null?void 0:a.name)??"Nill"}),e.jsx("div",{className:"as-logo-tag",children:"ArbeitsStation"})]})]}),e.jsx(L,{}),e.jsx("button",{className:"as-exit-btn",onClick:()=>d(!0),children:"✕ Beenden"})]}),e.jsxs("main",{className:"as-main",children:[e.jsxs("div",{style:{flexShrink:0},children:[e.jsxs("div",{className:"as-eyebrow",children:[e.jsx("span",{className:"as-eyebrow-line"}),"Arbeitsstation"]}),e.jsx("h1",{className:"as-h1",children:p?e.jsxs(e.Fragment,{children:[m,", ",e.jsxs("em",{children:[p,"."]})]}):e.jsxs(e.Fragment,{children:[m,e.jsx("em",{children:"."})]})})]}),l.length===0?e.jsxs("div",{className:"as-empty",children:[e.jsx("div",{className:"as-empty-icon",children:"◎"}),e.jsx("div",{className:"as-empty-label",children:"Keine Module konfiguriert"}),r&&e.jsx(j,{to:"/dashboard/settings?tab=station_guide",className:"as-setup-link",children:"Module einrichten"})]}):e.jsx("div",{className:"as-grid",style:{gridTemplateColumns:`repeat(${w}, 1fr)`,gridAutoRows:"1fr"},children:l.map(o=>e.jsx(D,{moduleKey:o,onClick:b},o))})]}),e.jsxs("footer",{className:"as-footer",children:[e.jsx("span",{className:"as-footer-text",children:"Nill ArbeitsStation"}),e.jsx("span",{className:"as-footer-text",children:t==null?void 0:t.email})]})]}),u&&e.jsx(A,{hasPassword:(a==null?void 0:a.station_exit_password_set)??!1,onClose:()=>d(!1)})]})}export{P as default};
