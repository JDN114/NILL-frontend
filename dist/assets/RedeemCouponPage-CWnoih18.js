import{a as s,j as e}from"./vendor-react--hPKs4bs.js";import{a as g}from"./index-BkSEJdvi.js";import{a as f}from"./vendor-router-B9EJrQcr.js";import{m as l}from"./vendor-motion-DyRgipUS.js";import"./vendor-misc-xcvkua7f.js";const h=`
  @media (max-width: 768px) {
    .rc-wrap {
      padding-left: 16px !important;
      padding-right: 16px !important;
      align-items: flex-start !important;
      padding-top: 12vh;
      min-height: 100dvh !important;
    }
    .rc-card {
      padding: 26px 20px !important;
      border-radius: 18px !important;
    }
    .rc-title {
      font-family: 'Fraunces', Georgia, serif !important;
      font-weight: 400 !important;
      font-size: 1.7rem !important;
      letter-spacing: -0.02em;
      margin-bottom: 0.6rem !important;
    }
    .rc-sub { margin-bottom: 1.4rem !important; }
    .rc-input {
      font-size: 16px !important;
      min-height: 52px;
      border-radius: 12px !important;
    }
    .rc-btn {
      min-height: 52px;
      font-size: 16px !important;
      border-radius: 12px !important;
      margin-top: 1.1rem !important;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      transition: transform 0.12s, opacity 0.15s;
    }
    .rc-btn:active { transform: scale(0.98); }
  }
`;function j(){const d=f(),[n,u]=s.useState(""),[o,p]=s.useState(!1),[i,r]=s.useState({text:"",type:""}),x=async()=>{var c,m;const a=n.trim();if(!a){r({text:"❌ Bitte einen Coupon-Code eingeben",type:"error"});return}p(!0),r({text:"",type:""});try{const t=await g.post("/subscription/redeem-coupon",{code:a});((c=t==null?void 0:t.data)==null?void 0:c.status)==="success"?(r({text:"🎉 Coupon erfolgreich eingelöst! Features freigeschaltet!",type:"success"}),setTimeout(()=>d("/dashboard",{replace:!0}),1500)):r({text:((m=t==null?void 0:t.data)==null?void 0:m.message)||"❌ Ungültiger oder abgelaufener Coupon",type:"error"})}catch(t){console.error("Coupon redeem error:",t),r({text:"❌ Fehler beim Einlösen des Coupons. Bitte versuche es später erneut.",type:"error"})}finally{p(!1)}};return e.jsxs("section",{className:"rc-wrap min-h-screen flex items-center justify-center bg-gradient-to-br from-[#03060a] to-[#071023] text-white px-6",children:[e.jsx("style",{children:h}),e.jsxs(l.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.5},className:"rc-card glass max-w-md w-full p-10 rounded-2xl shadow-xl",children:[e.jsx("h1",{className:"rc-title text-3xl font-bold mb-4 text-white",children:"Coupon einlösen"}),e.jsx("p",{className:"rc-sub text-gray-300 mb-8 text-sm",children:"Erhalte vollen Zugriff auf alle NILL-Features. Einfach Coupon-Code eingeben."}),e.jsx("input",{type:"text",placeholder:"Coupon Code eingeben...",value:n,onChange:a=>u(a.target.value),className:"rc-input w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white outline-none focus:border-[var(--accent)] transition",autoComplete:"off"}),e.jsx("button",{onClick:x,disabled:o||!n.trim(),className:`rc-btn w-full mt-6 py-3 rounded-lg font-semibold transition
            ${o||!n.trim()?"bg-gray-700 cursor-not-allowed":"bg-[var(--accent)] hover:opacity-90"}`,children:o?"Überprüfung...":"Einlösen"}),i.text&&e.jsx(l.p,{initial:{opacity:0,y:-5},animate:{opacity:1,y:0},transition:{duration:.4},className:`text-center mt-4 font-medium ${i.type==="success"?"text-green-400":"text-red-400"}`,children:i.text})]})]})}export{j as default};
