import{j as a,a as t}from"./vendor-react--hPKs4bs.js";import{L as o}from"./vendor-router-B9EJrQcr.js";import{u as c}from"./index-BFwWK9cJ.js";const d=`
  .asl-root {
    --asl-bg:        #040817;
    --asl-hdr-bg:    rgba(4,8,23,.96);
    --asl-ink:       #efede7;
    --asl-ink-sub:   rgba(var(--ink-tint),.38);
    --asl-ink-faint: rgba(var(--ink-tint),.18);
    --asl-line:      rgba(var(--ink-tint),.07);
    --asl-glass:     rgba(var(--tint),.04);
    --asl-glass-hov: rgba(var(--tint),.08);
    --asl-serif:     "Fraunces",Georgia,serif;
    --asl-sans:      "Inter",system-ui,sans-serif;
    --asl-mono:      "JetBrains Mono",monospace;

    height: 100vh; overflow: hidden;
    background: var(--asl-bg);
    display: flex; flex-direction: column;
    font-family: var(--asl-sans);
    color: var(--asl-ink);
  }

  html[data-theme="light"] .asl-root {
    --asl-bg:        #eae3d4;
    --asl-hdr-bg:    rgba(234,227,212,.97);
    --asl-ink:       #201d15;
    --asl-ink-sub:   rgba(var(--ink-tint),.55);
    --asl-ink-faint: rgba(var(--ink-tint),.22);
    --asl-line:      rgba(var(--ink-tint),.14);
    --asl-glass:     rgba(var(--tint),.045);
    --asl-glass-hov: rgba(var(--tint),.085);
  }

  /* Header */
  .asl-hdr {
    background: var(--asl-hdr-bg);
    border-bottom: 1px solid var(--asl-line);
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    padding: 0 clamp(20px,4vw,48px);
    height: clamp(60px,8vw,76px);
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    flex-shrink: 0; position: sticky; top: 0; z-index: 10;
  }

  .asl-hdr-left { display:flex; align-items:center; gap:14px; }

  .asl-back {
    width:34px; height:34px; border-radius:9px;
    background:var(--asl-glass); border:1px solid var(--asl-line);
    display:flex; align-items:center; justify-content:center;
    color:var(--asl-ink-sub); text-decoration:none; font-size:0.95rem; flex-shrink:0;
    transition: background .2s, border-color .2s, color .2s;
  }
  .asl-back:hover {
    background:var(--asl-glass-hov); border-color:var(--asl-ink-faint); color:var(--asl-ink);
  }

  .asl-breadcrumb {
    font-family: var(--asl-mono); font-size:0.6rem;
    color:var(--asl-ink-sub); letter-spacing:0.18em;
    text-transform:uppercase; margin-bottom:2px;
  }
  .asl-title {
    font-family: var(--asl-serif); font-size:clamp(1rem,2vw,1.25rem);
    font-weight:400; color:var(--asl-ink); letter-spacing:-0.02em; line-height:1;
    display:flex; align-items:center; gap:7px;
  }

  /* Clock */
  .asl-clock { text-align:center; }
  .asl-clock-time {
    font-family: var(--asl-mono); font-size:clamp(1.1rem,2.2vw,1.6rem);
    font-weight:700; color:var(--asl-ink); letter-spacing:0.06em; line-height:1;
  }
  .asl-clock-date {
    font-family: var(--asl-sans); font-size:0.65rem;
    color:var(--asl-ink-sub); letter-spacing:0.04em; margin-top:3px;
  }

  .asl-org {
    font-family: var(--asl-mono); font-size:0.65rem;
    color:var(--asl-ink-sub); letter-spacing:0.12em;
    text-transform:uppercase; text-align:right;
  }

  /* Scrollable content area */
  .asl-main {
    flex:1; overflow:auto;
    padding: clamp(20px,3vw,40px) clamp(20px,4vw,48px);
    width:100%; margin:0 auto; box-sizing:border-box;
  }
`;function m(){const[s,l]=t.useState(new Date);return t.useEffect(()=>{const e=setInterval(()=>l(new Date),1e3);return()=>clearInterval(e)},[]),a.jsxs("div",{className:"asl-clock",children:[a.jsx("div",{className:"asl-clock-time",children:s.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}),a.jsx("div",{className:"asl-clock-date",children:s.toLocaleDateString("de-DE",{weekday:"short",day:"numeric",month:"short"})})]})}function b({children:s,title:l,icon:e,accent:i="#c5a572",maxWidth:n=900}){const{org:r}=c();return a.jsxs(a.Fragment,{children:[a.jsx("style",{children:d}),a.jsxs("div",{className:"asl-root",children:[a.jsxs("header",{className:"asl-hdr",children:[a.jsxs("div",{className:"asl-hdr-left",children:[a.jsx(o,{to:"/station",className:"asl-back",children:"←"}),a.jsxs("div",{children:[a.jsx("div",{className:"asl-breadcrumb",children:"ArbeitsStation"}),a.jsxs("div",{className:"asl-title",children:[e&&a.jsx("span",{style:{color:i,fontSize:"0.9em"},children:e}),l]})]})]}),a.jsx(m,{}),a.jsx("div",{className:"asl-org",children:(r==null?void 0:r.name)??"Nill"})]}),a.jsx("main",{className:"asl-main",style:{maxWidth:n},children:s})]})]})}export{b as A};
