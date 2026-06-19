import{a as m,j as e}from"./vendor-react--hPKs4bs.js";import{u as p,L as o}from"./vendor-router-BxWC8dWZ.js";function s({compact:n=!1}){return e.jsx("span",{style:{marginLeft:n?"0.25rem":"0.4rem",fontSize:n?"0.55rem":"0.6rem",fontWeight:700,letterSpacing:"0.04em",padding:n?"0 0.2rem":"0.05rem 0.3rem",borderRadius:4,verticalAlign:"middle",color:"var(--nill-gold, #c5a572)",background:"var(--nill-gold-dim, rgba(197,165,114,0.15))",border:"1px solid rgba(197,165,114,0.35)"},children:"WIP"})}const d=[{label:"Dashboard",path:"/dashboard",exact:!0},{label:"Emails",path:"/dashboard/emails"},{label:"Kalender",path:"/dashboard/calendar"},{label:"Einstellungen",path:"/dashboard/settings"}],h=[{label:"Start",path:"/dashboard",exact:!0,icon:"◧"},{label:"E-Mails",path:"/dashboard/emails",icon:"✉"},{label:"Workflow",path:"/dashboard/workflow",icon:"⬡"},{label:"Mehr",path:"/dashboard/settings",icon:"◉"}];function g(){const{pathname:n}=p(),[i,r]=m.useState(!1),t=a=>a.exact?n===a.path:n.startsWith(a.path);return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
          .nill-hamburger   { display: none; }
          .nill-navbar-inner { padding: 0 1rem; }
        }

        /* ── Bottom tab bar ─────────────────────────────────────── */
        .nill-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 200;
          background: rgba(7,16,35,0.97);
          border-top: 1px solid var(--nill-border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        .nill-bottom-nav-inner {
          display: flex;
          align-items: stretch;
        }
        .nill-bnav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 0.25rem 0.45rem;
          min-height: 54px;
          text-decoration: none;
          color: rgba(148,163,184,0.7);
          transition: color 0.15s;
          position: relative;
          -webkit-tap-highlight-color: transparent;
        }
        .nill-bnav-item.active { color: var(--nill-gold); }
        .nill-bnav-item.active .nill-bnav-icon-wrap::after {
          content: "";
          position: absolute;
          bottom: -6px; left: 50%; transform: translateX(-50%);
          width: 18px; height: 2px;
          background: var(--nill-gold);
          border-radius: 2px;
        }
        .nill-bnav-icon-wrap {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px;
          border-radius: 10px;
          transition: background 0.15s;
          margin-bottom: 2px;
        }
        .nill-bnav-item.active .nill-bnav-icon-wrap {
          background: rgba(197,165,114,0.12);
        }
        .nill-bnav-icon {
          font-size: 1rem;
          line-height: 1;
          display: flex; align-items: center; justify-content: center;
        }
        .nill-bnav-label {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          white-space: nowrap;
          margin-top: 1px;
        }

        @media (max-width: 768px) {
          .nill-bottom-nav { display: block; }
        }
      `}),e.jsx("header",{className:"nill-navbar",children:e.jsxs("div",{className:"nill-navbar-inner",children:[e.jsxs(o,{to:"/dashboard",className:"nill-navbar-logo",children:[e.jsx("div",{className:"nill-navbar-logo-mark",children:"N"}),e.jsx("span",{className:"nill-navbar-logo-text",children:"NILL"})]}),e.jsx("nav",{className:"nill-navbar-nav",children:d.map(a=>{const l=!a.disabled&&t(a);return a.gold?a.disabled?e.jsxs("span",{title:"Kommt bald",style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.35rem 0.85rem",borderRadius:22,fontSize:"0.82rem",fontWeight:700,letterSpacing:"0.02em",background:"var(--nill-gold-dim)",border:"1px solid rgba(197,165,114,0.12)",color:"rgba(197,165,114,0.35)",cursor:"not-allowed",userSelect:"none",position:"relative"},children:[e.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"rgba(197,165,114,0.3)",flexShrink:0}}),a.label,e.jsx("span",{style:{fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",background:"rgba(197,165,114,0.12)",border:"1px solid rgba(197,165,114,0.2)",borderRadius:99,padding:"1px 6px",color:"rgba(197,165,114,0.5)"},children:"WIP"})]},"nill-disabled"):e.jsxs(o,{to:a.path,style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.35rem 0.85rem",borderRadius:22,fontSize:"0.82rem",fontWeight:700,textDecoration:"none",letterSpacing:"0.02em",transition:"background 0.15s, border-color 0.15s, box-shadow 0.15s",background:l?"var(--nill-gold-glow)":"var(--nill-gold-dim)",border:`1px solid ${l?"rgba(197,165,114,0.5)":"rgba(197,165,114,0.22)"}`,color:"var(--nill-gold)",boxShadow:l?"0 0 12px rgba(197,165,114,0.15)":"none"},children:[e.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"var(--nill-gold)",boxShadow:"0 0 6px rgba(197,165,114,0.7)",flexShrink:0}}),a.label]},a.path):e.jsxs(o,{to:a.path,style:{padding:"0.4rem 0.75rem",borderRadius:8,fontSize:"0.82rem",fontWeight:l?600:500,textDecoration:"none",transition:"background 0.12s, color 0.12s",background:l?"rgba(var(--tint),0.05)":"transparent",color:l?"var(--nill-text)":"var(--nill-text-sub)",borderBottom:l?"1px solid rgba(197,165,114,0.35)":"1px solid transparent"},children:[a.label,a.wip&&e.jsx(s,{})]},a.path)})}),e.jsxs("button",{className:`nill-hamburger${i?" open":""}`,onClick:()=>r(a=>!a),"aria-label":"Menü öffnen",children:[e.jsx("span",{className:"nill-hamburger-bar"}),e.jsx("span",{className:"nill-hamburger-bar"}),e.jsx("span",{className:"nill-hamburger-bar"})]})]})}),e.jsx("div",{className:`nill-mobile-menu${i?" open":""}`,children:d.map(a=>{if(a.disabled)return e.jsxs("span",{className:`nill-mobile-nav-link${a.gold?" gold":""}`,style:{opacity:.35,cursor:"not-allowed"},children:[a.label,e.jsx("span",{style:{marginLeft:"0.4rem",fontSize:"0.65rem",opacity:.7},children:"— WIP"})]},"nill-mobile-disabled");const l=t(a);return e.jsxs(o,{to:a.path,className:`nill-mobile-nav-link${a.gold?" gold":""}${l?" active":""}`,onClick:()=>r(!1),children:[a.label,a.wip&&e.jsx(s,{})]},a.path)})}),e.jsx("nav",{className:"nill-bottom-nav","aria-label":"Hauptnavigation",children:e.jsx("div",{className:"nill-bottom-nav-inner",children:h.map(a=>{const l=a.exact?n===a.path:n.startsWith(a.path);return e.jsxs(o,{to:a.path,className:`nill-bnav-item${l?" active":""}`,"aria-label":a.label,children:[e.jsx("div",{className:"nill-bnav-icon-wrap",children:e.jsx("span",{className:"nill-bnav-icon",children:a.icon})}),e.jsxs("span",{className:"nill-bnav-label",children:[a.label,a.wip&&e.jsx(s,{compact:!0})]})]},a.path)})})})]})}const x=["/dashboard/emails"];function f({children:n,noScroll:i,noScrollMobileOnly:r,footer:t}){const{pathname:a}=p(),l=x.some(c=>a.startsWith(c)),b=l||i;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @media (max-width: 768px) {
          .nill-page-main { padding-bottom: calc(62px + env(safe-area-inset-bottom, 0)) !important; }
          .nill-page-fixed { height: calc(100dvh - 64px) !important; }
        }
        /* Mobile-only fixed shell: lock to the viewport and let the inner pane
           scroll on phones; on desktop these are no-ops so the page scrolls
           normally with the document. Breakpoint matches SettingsPage (700px). */
        @media (max-width: 700px) {
          .nill-shell-mobilefixed { height: 100dvh !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; }
          .nill-main-mobilefixed { flex: 1 !important; min-height: 0 !important; overflow: hidden !important; }
        }
        /* Dashboard (noScroll) shell: on phones, stop fighting the viewport.
           Instead of clipping content with a fixed 100dvh / overflow:hidden
           shell — which cuts off the lower module tiles and hides the footer
           behind the bottom tab bar — let the page scroll naturally with the
           document. Sticky navbar + fixed bottom nav stay as chrome; content is
           padded to clear the tab bar. One scroll container = native feel. */
        @media (max-width: 768px) {
          .nill-shell-noscroll {
            height: auto !important;
            min-height: 100dvh !important;
            overflow: visible !important;
            padding-bottom: calc(62px + env(safe-area-inset-bottom, 0)) !important;
          }
          .nill-shell-noscroll .nill-page-main {
            overflow: visible !important;
            min-height: 0 !important;
            flex: 0 0 auto !important;
            padding-bottom: 0 !important;
          }
        }
      `}),e.jsxs("div",{className:`min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] ${r?"nill-shell-mobilefixed":""} ${i&&!l?"nill-shell-noscroll":""}`,style:b?{display:"flex",flexDirection:"column",height:"100dvh",overflow:"hidden"}:{},children:[e.jsx(g,{}),l?e.jsx("div",{className:"nill-page-fixed",style:{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"},children:n}):i?e.jsxs(e.Fragment,{children:[e.jsx("main",{className:"nill-page-main p-4 sm:p-6 max-w-7xl mx-auto w-full",style:{flex:1,overflow:"hidden",minHeight:0,boxSizing:"border-box"},children:n}),t]}):r?e.jsxs(e.Fragment,{children:[e.jsx("main",{className:"nill-page-main nill-main-mobilefixed p-4 sm:p-6 max-w-7xl mx-auto w-full",style:{boxSizing:"border-box"},children:n}),t]}):e.jsx("main",{className:"nill-page-main p-4 sm:p-6 max-w-7xl mx-auto w-full",children:n})]})]})}export{f as P};
