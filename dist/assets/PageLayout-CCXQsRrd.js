import{a as b,j as l}from"./vendor-react--hPKs4bs.js";import{a as d,L as t}from"./vendor-router-DHr2oj4b.js";const s=[{label:"Dashboard",path:"/dashboard",exact:!0},{label:"Emails",path:"/dashboard/emails"},{label:"Kalender",path:"/dashboard/calendar"},{label:"Buchhaltung",path:"/dashboard/accounting"},{label:"NILL",disabled:!0,gold:!0},{label:"Einstellungen",path:"/dashboard/settings"}];function c(){const{pathname:r}=d(),[n,i]=b.useState(!1),o=a=>a.exact?r===a.path:r.startsWith(a.path);return l.jsxs(l.Fragment,{children:[l.jsx("style",{children:`
        .nill-navbar {
          background: rgba(7,16,35,0.85);
          border-bottom: 1px solid var(--nill-border);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .nill-navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .nill-navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nill-navbar-logo-mark {
          width: 30px; height: 30px;
          background: var(--nill-gold);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 900;
          color: #03060a;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .nill-navbar-logo-text {
          font-size: 1rem;
          font-weight: 800;
          color: var(--nill-gold);
          letter-spacing: 0.07em;
        }
        .nill-navbar-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-wrap: wrap;
        }
        .nill-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px; height: 40px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid var(--nill-border);
          cursor: pointer;
          color: var(--nill-text-sub);
          transition: background 0.15s, border-color 0.15s;
          flex-shrink: 0;
        }
        .nill-hamburger:hover {
          background: var(--nill-panel-hov);
          border-color: var(--nill-border-lg);
        }
        .nill-hamburger-bar {
          width: 18px; height: 1.5px;
          background: currentColor;
          border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
        }
        .nill-hamburger.open .nill-hamburger-bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nill-hamburger.open .nill-hamburger-bar:nth-child(2) { opacity: 0; }
        .nill-hamburger.open .nill-hamburger-bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile dropdown */
        .nill-mobile-menu {
          display: none;
          flex-direction: column;
          background: rgba(7,16,35,0.97);
          border-bottom: 1px solid var(--nill-border);
          padding: 0.75rem 1rem;
          gap: 0.25rem;
        }
        .nill-mobile-menu.open { display: flex; }
        .nill-mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          color: var(--nill-text-sub);
          transition: background 0.12s, color 0.12s;
        }
        .nill-mobile-nav-link:hover,
        .nill-mobile-nav-link.active {
          background: var(--nill-panel-hov);
          color: var(--nill-text);
        }
        .nill-mobile-nav-link.gold {
          color: var(--nill-gold);
          background: var(--nill-gold-dim);
          border: 1px solid rgba(197,165,114,0.22);
        }
        .nill-mobile-nav-link.gold.active {
          background: var(--nill-gold-glow);
          border-color: rgba(197,165,114,0.5);
        }

        @media (max-width: 768px) {
          .nill-navbar-nav  { display: none; }
          .nill-hamburger   { display: flex; }
          .nill-navbar-inner { padding: 0 1rem; }
        }
      `}),l.jsx("header",{className:"nill-navbar",children:l.jsxs("div",{className:"nill-navbar-inner",children:[l.jsxs(t,{to:"/dashboard",className:"nill-navbar-logo",children:[l.jsx("div",{className:"nill-navbar-logo-mark",children:"N"}),l.jsx("span",{className:"nill-navbar-logo-text",children:"NILL"})]}),l.jsx("nav",{className:"nill-navbar-nav",children:s.map(a=>{const e=!a.disabled&&o(a);return a.gold?a.disabled?l.jsxs("span",{title:"Kommt bald",style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.35rem 0.85rem",borderRadius:22,fontSize:"0.82rem",fontWeight:700,letterSpacing:"0.02em",background:"var(--nill-gold-dim)",border:"1px solid rgba(197,165,114,0.12)",color:"rgba(197,165,114,0.35)",cursor:"not-allowed",userSelect:"none",position:"relative"},children:[l.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"rgba(197,165,114,0.3)",flexShrink:0}}),a.label,l.jsx("span",{style:{fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",background:"rgba(197,165,114,0.12)",border:"1px solid rgba(197,165,114,0.2)",borderRadius:99,padding:"1px 6px",color:"rgba(197,165,114,0.5)"},children:"bald"})]},"nill-disabled"):l.jsxs(t,{to:a.path,style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.35rem 0.85rem",borderRadius:22,fontSize:"0.82rem",fontWeight:700,textDecoration:"none",letterSpacing:"0.02em",transition:"background 0.15s, border-color 0.15s, box-shadow 0.15s",background:e?"var(--nill-gold-glow)":"var(--nill-gold-dim)",border:`1px solid ${e?"rgba(197,165,114,0.5)":"rgba(197,165,114,0.22)"}`,color:"var(--nill-gold)",boxShadow:e?"0 0 12px rgba(197,165,114,0.15)":"none"},children:[l.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"var(--nill-gold)",boxShadow:"0 0 6px rgba(197,165,114,0.7)",flexShrink:0}}),a.label]},a.path):l.jsx(t,{to:a.path,style:{padding:"0.4rem 0.75rem",borderRadius:8,fontSize:"0.82rem",fontWeight:e?600:500,textDecoration:"none",transition:"background 0.12s, color 0.12s",background:e?"rgba(255,255,255,0.05)":"transparent",color:e?"var(--nill-text)":"var(--nill-text-sub)",borderBottom:e?"1px solid rgba(197,165,114,0.35)":"1px solid transparent"},children:a.label},a.path)})}),l.jsxs("button",{className:`nill-hamburger${n?" open":""}`,onClick:()=>i(a=>!a),"aria-label":"Menü öffnen",children:[l.jsx("span",{className:"nill-hamburger-bar"}),l.jsx("span",{className:"nill-hamburger-bar"}),l.jsx("span",{className:"nill-hamburger-bar"})]})]})}),l.jsx("div",{className:`nill-mobile-menu${n?" open":""}`,children:s.map(a=>{if(a.disabled)return l.jsxs("span",{className:`nill-mobile-nav-link${a.gold?" gold":""}`,style:{opacity:.35,cursor:"not-allowed"},children:[a.label,l.jsx("span",{style:{marginLeft:"0.4rem",fontSize:"0.65rem",opacity:.7},children:"— bald"})]},"nill-mobile-disabled");const e=o(a);return l.jsx(t,{to:a.path,className:`nill-mobile-nav-link${a.gold?" gold":""}${e?" active":""}`,onClick:()=>i(!1),children:a.label},a.path)})})]})}const g=["/dashboard/emails"];function m({children:r,noScroll:n}){const{pathname:i}=d(),o=g.some(e=>i.startsWith(e)),a=o||n;return l.jsxs("div",{className:"min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]",style:a?{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"}:{},children:[l.jsx(c,{}),o?l.jsx("div",{style:{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"},children:r}):n?l.jsx("main",{className:"p-4 sm:p-6 max-w-7xl mx-auto w-full",style:{flex:1,overflow:"auto",boxSizing:"border-box"},children:r}):l.jsx("main",{className:"p-4 sm:p-6 max-w-7xl mx-auto w-full",children:r})]})}export{m as P};
