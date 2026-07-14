import{a as n,j as t}from"./vendor-react--hPKs4bs.js";import{P as c}from"./PageLayout-DEoaAes4.js";import{C as m}from"./Card-CEhZDFBV.js";import{a as x}from"./index-CaNHXG2s.js";import"./vendor-router-B9EJrQcr.js";import"./vendor-misc-xcvkua7f.js";const p=`
  .tx-cards { display: none; }
  @media (max-width: 768px) {
    /* Compact native header: serif title like the dashboard cards */
    .tx-title {
      font-family: 'Fraunces', Georgia, serif !important;
      font-weight: 400 !important;
      font-size: 1.55rem !important;
      letter-spacing: -0.02em;
      margin-bottom: 0.9rem !important;
    }
    /* The desktop table becomes a tappable card list */
    .tx-table { display: none; }
    .tx-card {
      background: transparent !important;
      box-shadow: none !important;
      padding: 0 !important;
      border-radius: 0 !important;
    }
    .tx-cards {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      list-style: none;
      content-visibility: auto;
    }
    .tx-row {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 64px;
      padding: 12px 4px;
      border-bottom: 1px solid rgba(var(--ink-tint), 0.09);
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      transition: background 0.12s;
    }
    .tx-row:last-child { border-bottom: none; }
    .tx-row:active { background: rgba(var(--tint), 0.06); }
    .tx-row-main { flex: 1; min-width: 0; }
    .tx-row-desc {
      font-size: 0.92rem;
      font-weight: 500;
      color: var(--text-main);
      margin: 0 0 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tx-row-meta {
      font-size: 0.74rem;
      color: rgba(var(--ink-tint), 0.55);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tx-row-amount {
      flex-shrink: 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.92rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .tx-empty {
      padding: 40px 16px;
      text-align: center;
      font-size: 0.85rem;
      color: rgba(var(--ink-tint), 0.55);
    }
  }
`;function j(){const[a,s]=n.useState([]),[i,o]=n.useState(!0),l=async()=>{try{const e=await x.get("/transactions"),d=new Intl.DateTimeFormat(void 0,{dateStyle:"short"});s((e.data||[]).map(r=>({...r,dateFormatted:r.date?d.format(new Date(r.date)):"—"})))}catch(e){console.error(e)}o(!1)};return n.useEffect(()=>{l()},[]),t.jsxs(c,{children:[t.jsx("style",{children:p}),t.jsx("h1",{className:"tx-title text-2xl font-bold mb-6 text-white",children:"Transaktionen"}),t.jsx(m,{className:"tx-card p-4",children:i?t.jsx("p",{className:"text-gray-400",children:"Lade Transaktionen..."}):t.jsxs(t.Fragment,{children:[t.jsxs("ul",{className:"tx-cards",children:[a.length===0&&t.jsx("li",{className:"tx-empty",children:"Keine Transaktionen vorhanden."}),a.map(e=>t.jsxs("li",{className:"tx-row",children:[t.jsxs("div",{className:"tx-row-main",children:[t.jsx("p",{className:"tx-row-desc",children:e.description}),t.jsxs("p",{className:"tx-row-meta",children:[e.dateFormatted," · ",e.category||"Unkategorisiert"]})]}),t.jsxs("span",{className:`tx-row-amount ${e.amount<0?"text-red-400":"text-green-400"}`,children:[e.amount," €"]})]},e.id))]}),t.jsxs("table",{className:"tx-table w-full text-left",children:[t.jsx("thead",{children:t.jsxs("tr",{className:"text-gray-400",children:[t.jsx("th",{children:"Datum"}),t.jsx("th",{children:"Beschreibung"}),t.jsx("th",{children:"Betrag"}),t.jsx("th",{children:"Kategorie"})]})}),t.jsx("tbody",{children:a.map(e=>t.jsxs("tr",{className:"border-t border-white/10",children:[t.jsx("td",{children:e.dateFormatted}),t.jsx("td",{children:e.description}),t.jsxs("td",{className:e.amount<0?"text-red-400":"text-green-400",children:[e.amount," €"]}),t.jsx("td",{children:e.category||"Unkategorisiert"})]},e.id))})]})]})})]})}export{j as default};
