import{j as e,a as i}from"./vendor-react--hPKs4bs.js";import{P as W}from"./PageLayout-CvuS38_o.js";import{u as A,a as k}from"./index-Cr5-N4ZA.js";import"./vendor-router-B9EJrQcr.js";import"./vendor-misc-xcvkua7f.js";const B=["Lohnsteuerbescheinigung","Gehaltsabrechnung","Arbeitsvertrag","Zeugnis","Krankmeldung","Urlaubsantrag","AV-Vertrag","NDA / Geheimhaltungsvereinbarung","Lieferantenvertrag","Kundenvertrag","Gesellschaftsvertrag","Datenschutzerklärung","Versicherungspolice","Sonstiges"];function _(){return e.jsx("span",{style:{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"var(--nill-gold)",marginLeft:6,verticalAlign:"middle",flexShrink:0}})}function U({type:n}){return e.jsx("span",{style:{fontSize:"0.68rem",fontWeight:700,padding:"2px 8px",borderRadius:99,background:"rgba(197,165,114,0.12)",border:"1px solid rgba(197,165,114,0.25)",color:"var(--nill-gold)",letterSpacing:"0.03em",whiteSpace:"nowrap"},children:n})}function M({users:n,onUploaded:s,className:a}){const[c,m]=i.useState(""),[g,y]=i.useState(B[0]),[u,f]=i.useState(""),[p,w]=i.useState(new Date().getFullYear()),[d,b]=i.useState(""),[h,v]=i.useState(null),[x,z]=i.useState(!1),[R,S]=i.useState(""),j=i.useRef();async function C(r){var l,D;if(r.preventDefault(),!h){S("Bitte eine Datei auswählen.");return}z(!0),S("");try{const o=new FormData;o.append("file",h),o.append("title",c||h.name),o.append("document_type",g),u&&o.append("description",u),p&&o.append("year",p),d&&o.append("assigned_to",d),await k.post("/hr/documents",o,{headers:{"Content-Type":"multipart/form-data"}}),m(""),f(""),v(null),b(""),j.current&&(j.current.value=""),s()}catch(o){S(((D=(l=o==null?void 0:o.response)==null?void 0:l.data)==null?void 0:D.detail)||"Upload fehlgeschlagen.")}finally{z(!1)}}const t={width:"100%",padding:"0.55rem 0.8rem",background:"var(--nill-surface)",border:"1px solid var(--nill-border)",borderRadius:8,color:"var(--nill-text)",fontSize:"0.82rem",outline:"none",boxSizing:"border-box"};return e.jsxs("form",{onSubmit:C,className:a,style:{padding:"1.4rem",background:"rgba(var(--tint),0.025)",border:"1px solid var(--nill-border)",borderRadius:14,display:"flex",flexDirection:"column",gap:"0.85rem",marginBottom:"1.5rem"},children:[e.jsx("div",{className:"hr-sheet-handle","aria-hidden":"true"}),e.jsx("span",{style:{fontSize:"0.78rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--nill-text-dim)"},children:"Dokument hochladen"}),e.jsxs("div",{className:"hr-upload-grid",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("label",{style:{fontSize:"0.72rem",color:"var(--nill-text-dim)"},children:"Titel"}),e.jsx("input",{style:t,placeholder:"Automatisch aus Dateiname",value:c,onChange:r=>m(r.target.value)})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("label",{style:{fontSize:"0.72rem",color:"var(--nill-text-dim)"},children:"Typ"}),e.jsx("select",{style:t,value:g,onChange:r=>y(r.target.value),children:B.map(r=>e.jsx("option",{children:r},r))})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("label",{style:{fontSize:"0.72rem",color:"var(--nill-text-dim)"},children:"Mitarbeiter (optional)"}),e.jsxs("select",{style:t,value:d,onChange:r=>b(r.target.value),children:[e.jsx("option",{value:"",children:"-- Firmenweit (kein Mitarbeiter) --"}),n.map(r=>e.jsx("option",{value:r.id,children:r.full_name||r.email},r.id))]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("label",{style:{fontSize:"0.72rem",color:"var(--nill-text-dim)"},children:"Jahr"}),e.jsx("input",{style:t,type:"number",value:p,min:2e3,max:2100,onChange:r=>w(r.target.value)})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("label",{style:{fontSize:"0.72rem",color:"var(--nill-text-dim)"},children:"Beschreibung (optional)"}),e.jsx("input",{style:t,placeholder:"z.B. Lohnsteuerbescheinigung 2024",value:u,onChange:r=>f(r.target.value)})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("label",{style:{fontSize:"0.72rem",color:"var(--nill-text-dim)"},children:"Datei (PDF, max. 20 MB)"}),e.jsx("input",{ref:j,style:{...t,padding:"0.45rem 0.8rem"},type:"file",accept:".pdf,.doc,.docx,.png,.jpg,.jpeg",onChange:r=>v(r.target.files[0]),required:!0})]}),R&&e.jsx("span",{style:{fontSize:"0.78rem",color:"#f87171"},children:R}),e.jsx("button",{type:"submit",disabled:x,style:{alignSelf:"flex-start",padding:"0.55rem 1.4rem",background:x?"var(--nill-border)":"var(--nill-gold)",color:x?"var(--nill-text-mute)":"#000",border:"none",borderRadius:8,fontWeight:700,fontSize:"0.82rem",cursor:x?"not-allowed":"pointer"},children:x?"Wird hochgeladen…":"Hochladen"})]})}function N({doc:n,isAdmin:s,users:a,onDelete:c,onRead:m}){const[g,y]=i.useState(!1),u=s&&a.find(d=>d.id===n.assigned_to);async function f(){if(window.confirm("Dokument wirklich löschen?")){y(!0);try{await k.delete(`/hr/documents/${n.id}`),c(n.id)}catch{y(!1)}}}async function p(){try{const d=await k.get(`/hr/documents/${n.id}/download`,{responseType:"blob"}),b=URL.createObjectURL(d.data),h=document.createElement("a");h.href=b,h.download=n.file_name||"dokument",h.click(),URL.revokeObjectURL(b)}catch{alert("Download fehlgeschlagen.")}}async function w(){try{await k.post(`/hr/documents/${n.id}/read`),m(n.id)}catch{}}return e.jsxs("div",{className:"hr-row",style:{display:"flex",alignItems:"center",gap:"1rem",padding:"0.9rem 1.1rem",background:n.is_read===!1?"rgba(197,165,114,0.04)":"transparent",border:"1px solid var(--nill-border)",borderRadius:10,transition:"background 0.15s"},children:[e.jsx("div",{style:{width:36,height:36,flexShrink:0,borderRadius:8,background:"var(--nill-gold-dim)",border:"1px solid rgba(197,165,114,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--nill-gold)"},children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"})]})}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"},children:[e.jsx("span",{style:{fontWeight:600,fontSize:"0.85rem",color:"var(--nill-text)"},children:n.title}),n.is_read===!1&&e.jsx(_,{}),e.jsx(U,{type:n.document_type}),n.year&&e.jsx("span",{style:{fontSize:"0.72rem",color:"var(--nill-text-dim)"},children:n.year})]}),e.jsxs("div",{style:{fontSize:"0.72rem",color:"var(--nill-text-mute)",marginTop:2},children:[s&&(u?e.jsxs("span",{style:{marginRight:8},children:["→ ",u.full_name||u.email]}):e.jsx("span",{style:{marginRight:8,padding:"1px 6px",borderRadius:99,background:"rgba(148,163,184,0.12)",border:"1px solid rgba(148,163,184,0.25)",color:"#94a3b8",fontSize:"0.68rem",fontWeight:700},children:"Firmenweit"})),n.description&&e.jsx("span",{children:n.description})]})]}),e.jsxs("div",{style:{display:"flex",gap:"0.5rem",flexShrink:0},children:[e.jsx("button",{className:"hr-act",onClick:p,title:"Herunterladen",style:L("var(--nill-border)"),children:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7 10 12 15 17 10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]})}),!s&&n.is_read===!1&&e.jsx("button",{className:"hr-act",onClick:w,title:"Als gelesen markieren",style:L("rgba(197,165,114,0.25)"),children:e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"var(--nill-gold)",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})}),s&&e.jsx("button",{className:"hr-act",onClick:f,disabled:g,title:"Löschen",style:L("rgba(248,113,113,0.15)","#f87171"),children:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"3 6 5 6 21 6"}),e.jsx("path",{d:"M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"}),e.jsx("path",{d:"M10 11v6"}),e.jsx("path",{d:"M14 11v6"}),e.jsx("path",{d:"M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"})]})})]})]})}function L(n,s="var(--nill-text-dim)"){return{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:n,border:"1px solid var(--nill-border)",borderRadius:7,cursor:"pointer",color:s,transition:"background 0.12s"}}function F({defaultFilterType:n=""}){const{isCompanyAdmin:s}=A(),a=!!s,[c,m]=i.useState([]),[g,y]=i.useState([]),[u,f]=i.useState(!0),[p,w]=i.useState(n),[d,b]=i.useState(""),[h,v]=i.useState(!1);async function x(){var t;try{const r={};p&&(r.document_type=p),d&&(r.assigned_to=d);const l=a?"/hr/documents":"/hr/documents/my",D=await k.get(l,{params:r}),o=((t=D.data)==null?void 0:t.items)??D.data??[];m(Array.isArray(o)?o:[])}catch{m([])}finally{f(!1)}}async function z(){var t;if(a)try{const r=await k.get("/hr/users"),l=((t=r.data)==null?void 0:t.items)??r.data??[];y(Array.isArray(l)?l:[])}catch{}}i.useEffect(()=>{z()},[a]),i.useEffect(()=>{f(!0),x()},[p,d,a]);const R=t=>m(r=>r.filter(l=>l.id!==t)),S=t=>m(r=>r.map(l=>l.id===t?{...l,is_read:!0}:l)),j=c.filter(t=>!t.is_read).length,C=!!n;return e.jsxs("div",{children:[e.jsx("style",{children:`
        /* Mobile-only bottom-sheet/FAB chrome — invisible on desktop. */
        .hr-sheet-handle { display: none; }
        .hr-sheet-backdrop { display: none; }
        .hr-fab { display: none; }

        @media (max-width: 768px) {
          /* Upload form → bottom sheet, opened via floating action button. */
          .hr-upload {
            display: none !important;
          }
          .hr-upload--open {
            display: flex !important;
            position: fixed;
            left: 0; right: 0; bottom: 0;
            z-index: 320;
            margin-bottom: 0 !important;
            border-radius: 16px 16px 0 0 !important;
            border-left: none !important; border-right: none !important; border-bottom: none !important;
            background: var(--bg-panel, var(--nill-bg-grad)) !important;
            max-height: 85dvh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
            padding: 0.6rem 1.1rem calc(1.1rem + env(safe-area-inset-bottom, 0)) !important;
          }
          .hr-sheet-handle {
            display: block;
            width: 35px; height: 4px;
            border-radius: 99px;
            background: rgba(var(--ink-tint), 0.25);
            margin: 0.25rem auto 0.35rem;
            flex-shrink: 0;
          }
          .hr-sheet-backdrop {
            display: block;
            position: fixed; inset: 0; z-index: 310;
            background: rgba(0,0,0,0.5);
          }
          .hr-upload-grid { grid-template-columns: 1fr !important; }
          .hr-upload input, .hr-upload select {
            font-size: 16px !important;
            min-height: 44px;
          }
          .hr-upload button[type="submit"] {
            align-self: stretch !important;
            min-height: 48px;
            font-size: 0.9rem !important;
            border-radius: 12px !important;
          }
          .hr-fab {
            display: flex;
            align-items: center; justify-content: center;
            position: fixed;
            right: 18px;
            bottom: calc(62px + env(safe-area-inset-bottom, 0) + 14px);
            z-index: 60;
            width: 56px; height: 56px;
            border-radius: 50%;
            border: none;
            background: var(--nill-gold);
            color: #1a1206;
            box-shadow: 0 6px 20px rgba(197,165,114,0.4), 0 2px 8px rgba(0,0,0,0.35);
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            transition: transform 0.12s;
          }
          .hr-fab:active { transform: scale(0.93); }

          /* Filters → horizontal chip row. */
          .hr-filters {
            flex-wrap: nowrap !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 0.2rem;
          }
          .hr-filters::-webkit-scrollbar { display: none; }
          .hr-filters select {
            flex-shrink: 0;
            font-size: 16px !important;
            min-height: 44px;
            border-radius: 22px !important;
            padding: 0.45rem 1rem !important;
          }
          .hr-filters > span { flex-shrink: 0; white-space: nowrap; }

          /* Document rows: roomy tappable cards with visible ≥44px actions. */
          .hr-row {
            padding: 1rem !important;
            min-height: 64px;
            border-radius: 14px !important;
            -webkit-tap-highlight-color: transparent;
          }
          .hr-row:active { background: rgba(var(--tint),0.05) !important; }
          .hr-act {
            width: 44px !important;
            height: 44px !important;
            border-radius: 12px !important;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          .hr-act:active { background: var(--nill-panel-hov) !important; }
        }
      `}),a&&h&&e.jsx("div",{className:"hr-sheet-backdrop",onClick:()=>v(!1)}),a&&e.jsx(M,{users:g,onUploaded:()=>{x(),v(!1)},className:`hr-upload${h?" hr-upload--open":""}`}),a&&e.jsx("button",{type:"button",className:"hr-fab","aria-label":"Dokument hochladen",onClick:()=>v(t=>!t),children:e.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]})}),e.jsxs("div",{className:"hr-filters",style:{display:"flex",gap:"0.75rem",marginBottom:"1rem",flexWrap:"wrap",alignItems:"center"},children:[!C&&e.jsxs("select",{value:p,onChange:t=>w(t.target.value),style:T,children:[e.jsx("option",{value:"",children:"Alle Typen"}),B.map(t=>e.jsx("option",{children:t},t))]}),a&&e.jsxs("select",{value:d,onChange:t=>b(t.target.value),style:T,children:[e.jsx("option",{value:"",children:"Alle Mitarbeiter"}),g.map(t=>e.jsx("option",{value:t.id,children:t.full_name||t.email},t.id))]}),e.jsxs("span",{style:{fontSize:"0.78rem",color:"var(--nill-text-dim)",marginLeft:"auto"},children:[!a&&j>0&&e.jsxs("span",{style:{marginRight:10,padding:"2px 8px",borderRadius:99,background:"rgba(197,165,114,0.15)",border:"1px solid rgba(197,165,114,0.3)",color:"var(--nill-gold)",fontWeight:700},children:[j," neu"]}),c.length," Dokument",c.length!==1?"e":""]})]}),u?e.jsx("div",{style:{color:"var(--nill-text-mute)",fontSize:"0.85rem",padding:"2rem 0"},children:"Lädt…"}):c.length===0?e.jsx("div",{style:{padding:"3rem 0",textAlign:"center",color:"var(--nill-text-mute)",fontSize:"0.85rem"},children:a?"Noch keine Dokumente hochgeladen.":"Du hast noch keine Dokumente erhalten."}):e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:c.map(t=>e.jsx(N,{doc:t,isAdmin:a,users:g,onDelete:R,onRead:S},t.id))})]})}const T={padding:"0.45rem 0.75rem",background:"var(--nill-surface)",border:"1px solid var(--nill-border)",borderRadius:8,color:"var(--nill-text)",fontSize:"0.8rem",cursor:"pointer"};function P(){const{isCompanyAdmin:n}=A(),s=!!n;return e.jsxs(W,{children:[e.jsx("style",{children:`
        @media (max-width: 768px) {
          .hr-head { margin-bottom: 1.1rem !important; }
          .hr-head h1 { font-size: 1.45rem !important; }
          .hr-head p { font-size: 0.78rem !important; }
        }
      `}),e.jsxs("div",{className:"hr-head",style:{marginBottom:"1.75rem"},children:[e.jsx("span",{style:{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--nill-text-dim)"},children:"Dashboard / Betrieb / HR Dokumente"}),e.jsx("h1",{style:{fontSize:"1.85rem",fontWeight:800,margin:"0.25rem 0 0.3rem",color:"var(--nill-text)",letterSpacing:"-0.01em",lineHeight:1.15},children:"HR Dokumente"}),e.jsx("p",{style:{margin:0,fontSize:"0.82rem",color:"var(--nill-text-mute)"},children:s?"Mitarbeiterdokumente hochladen & verwalten":"Deine Dokumente & Bescheinigungen"})]}),e.jsx(F,{})]})}export{F as HrDocsContent,P as default};
