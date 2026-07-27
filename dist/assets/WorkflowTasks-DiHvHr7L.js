import{a as n,j as e}from"./vendor-react--hPKs4bs.js";import{P as te}from"./PageLayout-CvuS38_o.js";import{u as re,a as h}from"./index-Cr5-N4ZA.js";import"./vendor-router-B9EJrQcr.js";import"./vendor-misc-xcvkua7f.js";const K={background:"rgba(var(--tint),0.025)",border:"1px solid var(--nill-border)",borderRadius:14,backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",overflow:"hidden"},R={width:"100%",padding:"0.6rem 0.9rem",background:"rgba(var(--tint),0.04)",border:"1px solid var(--nill-border)",borderRadius:9,color:"var(--nill-text)",fontSize:"0.82rem",outline:"none",transition:"border-color 0.15s",boxSizing:"border-box"},w={...R,appearance:"none",cursor:"pointer"};function Z(){return e.jsx("div",{style:{width:16,height:16,border:"2px solid rgba(var(--tint),0.08)",borderTopColor:"var(--nill-gold)",borderRadius:"50%",animation:"em-spin 0.75s linear infinite",flexShrink:0}})}function ae({status:r}){const d={completed:{label:"Erledigt",bg:"rgba(134,239,172,0.08)",border:"rgba(134,239,172,0.2)",color:"#86efac"},escalated:{label:"Eskaliert",bg:"rgba(248,113,113,0.08)",border:"rgba(248,113,113,0.22)",color:"#f87171"},in_progress:{label:"In Bearbeit",bg:"rgba(251,191,36,0.08)",border:"rgba(251,191,36,0.2)",color:"#fbbf24"},open:{label:"Offen",bg:"rgba(148,163,184,0.08)",border:"rgba(148,163,184,0.2)",color:"#94a3b8"}}[r]??{label:r,bg:"rgba(148,163,184,0.08)",border:"rgba(148,163,184,0.2)",color:"#94a3b8"};return e.jsx("span",{style:{fontSize:"0.68rem",fontWeight:600,padding:"0.2rem 0.65rem",borderRadius:20,background:d.bg,border:`1px solid ${d.border}`,color:d.color,whiteSpace:"nowrap"},children:d.label})}function ie({priority:r}){const a={high:"#f87171",medium:"#fbbf24",low:"#86efac"}[r]??"#94a3b8";return e.jsx("span",{style:{width:7,height:7,borderRadius:"50%",background:a,display:"inline-block",flexShrink:0}})}function le({recurrence:r}){if(!r)return null;const a={daily:"Täglich",weekly:"Wöchentlich",monthly:"Monatlich",yearly:"Jährlich"};return e.jsxs("span",{style:{fontSize:"0.65rem",fontWeight:600,padding:"0.15rem 0.55rem",borderRadius:20,background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.25)",color:"#a78bfa",whiteSpace:"nowrap"},children:["↻ ",a[r]??r]})}function ne({due_at:r}){if(!r)return null;const a=new Date(r),d=new Date,c=a<d,s=a.toDateString()===d.toDateString(),k=s?"Heute fällig":a.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});return e.jsxs("span",{style:{fontSize:"0.65rem",fontWeight:600,padding:"0.15rem 0.55rem",borderRadius:20,background:c?"rgba(248,113,113,0.1)":s?"rgba(251,191,36,0.1)":"rgba(148,163,184,0.07)",border:`1px solid ${c?"rgba(248,113,113,0.3)":s?"rgba(251,191,36,0.3)":"rgba(148,163,184,0.2)"}`,color:c?"#f87171":s?"#fbbf24":"#94a3b8",whiteSpace:"nowrap"},children:["📅 ",k]})}function ge(){const{user:r,org:a,updateOrg:d}=re(),c=(r==null?void 0:r.role)==="admin",[s,k]=n.useState([]),[A,N]=n.useState([]),[_,B]=n.useState([]),[u,S]=n.useState(!0),[j,z]=n.useState(!1),[f,p]=n.useState(!1),[x,y]=n.useState(!1),[g,l]=n.useState(!1),[C,$]=n.useState(""),[W,F]=n.useState(((a==null?void 0:a.task_auto_delete_days)??0)>0),[D,O]=n.useState((a==null?void 0:a.task_auto_delete_days)||30),[T,H]=n.useState(!1),[E,I]=n.useState(""),[o,L]=n.useState({title:"",description:"",priority:"medium",assignee_id:"",assigned_role:"",due_at:"",recurrence:"",recurrence_end_at:""}),v=n.useCallback(async()=>{var t;S(!0);try{const i={};g&&(i.my_tasks=!0),C&&(i.status=C);const b=await h.get("/workflow/tasks",{params:i});k(((t=b.data)==null?void 0:t.items)||[]),z(!1)}catch{k([]),z(!0)}finally{S(!1)}},[g,C]);n.useEffect(()=>{v()},[v]),n.useEffect(()=>{c&&(h.get("/hr/users").then(t=>{var i;return N(((i=t.data)==null?void 0:i.users)||[])}).catch(()=>{}),h.get("/team/roles").then(t=>{var i;return B(Array.isArray(t.data)?t.data:((i=t.data)==null?void 0:i.roles)||[])}).catch(()=>{}))},[c]),n.useEffect(()=>{(a==null?void 0:a.task_auto_delete_days)!=null&&(F((a.task_auto_delete_days??0)>0),a.task_auto_delete_days>0&&O(a.task_auto_delete_days))},[a==null?void 0:a.task_auto_delete_days]);async function P(t,i){var b,U;H(!0),I("");try{const G=t?Math.max(1,Math.min(3650,Number(i)||30)):0,J=await h.post("/workflow/tasks/retention-settings",{enabled:t,task_auto_delete_days:G});d==null||d({task_auto_delete_days:((b=J.data)==null?void 0:b.task_auto_delete_days)??G});const M=((U=J.data)==null?void 0:U.purged)||0;I(t?`✓ Gespeichert${M?` · ${M} alte erledigte Aufgabe(n) gelöscht`:""}`:"✓ Auto-Löschen deaktiviert"),M&&v()}catch{I("Fehler beim Speichern")}finally{H(!1)}}function m(t,i){L(b=>({...b,[t]:i}))}async function q(){if(o.title.trim()){p(!0);try{const t={title:o.title,description:o.description||void 0,priority:o.priority,assignee_id:o.assignee_id||void 0,assigned_role:o.assigned_role||void 0,due_at:o.due_at||void 0,recurrence:o.recurrence||void 0,recurrence_end_at:o.recurrence_end_at||void 0};await h.post("/workflow/tasks",t),L({title:"",description:"",priority:"medium",assignee_id:"",assigned_role:"",due_at:"",recurrence:"",recurrence_end_at:""}),y(!1),v()}catch(t){console.error(t)}finally{p(!1)}}}async function Q(t){p(!0);try{await h.post(`/workflow/tasks/${t}/complete`,{result_data:{}}),v()}catch(i){console.error(i)}finally{p(!1)}}async function V(t){const i=prompt("Grund für Eskalation?");if(i){p(!0);try{await h.post(`/workflow/tasks/${t}/escalate`,{reason:i}),v()}catch(b){console.error(b)}finally{p(!1)}}}const X=s.filter(t=>t.status!=="completed"&&t.status!=="escalated"),Y=s.filter(t=>t.status==="completed"),ee=s.filter(t=>t.status==="escalated");return e.jsxs(te,{children:[e.jsx("style",{children:`
        @media (max-width: 640px) {
          .wt-form-grid-2 { grid-template-columns: 1fr !important; }
          .wt-form-grid-3 { grid-template-columns: 1fr !important; }
          .wt-task-row    { flex-direction: column; align-items: flex-start !important; gap: 0.5rem !important; }
          .wt-task-actions { margin-left: 0 !important; }
          .wt-h1 { font-size: 1.4rem !important; }
        }

        /* Mobile-only chrome (chips, FAB, sheet) — hidden on desktop. */
        .wta-chips { display: none; }
        .wta-fab { display: none; }
        .wta-sheet-backdrop { display: none; }
        .wta-sheet-handle { display: none; }

        @media (max-width: 768px) {
          .wta-head { margin-bottom: 0.9rem !important; }
          .wt-h1 { font-size: 1.45rem !important; }

          /* Desktop toolbar (toggle + select + button) is replaced by
             the chip row + floating action button on mobile. */
          .wta-controls { display: none !important; }

          .wta-chips {
            display: flex;
            gap: 0.4rem;
            margin-bottom: 1.1rem;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .wta-chips::-webkit-scrollbar { display: none; }
          .wta-chip {
            flex-shrink: 0;
            padding: 0.55rem 1rem;
            min-height: 40px;
            font-size: 0.8rem; font-weight: 500;
            color: var(--nill-text-sub);
            background: var(--nill-panel);
            border: 1px solid var(--nill-border);
            border-radius: 20px;
            cursor: pointer;
            white-space: nowrap;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
            transition: background 0.12s, color 0.12s, border-color 0.12s;
          }
          .wta-chip:active { background: var(--nill-panel-hov); }
          .wta-chip--active {
            background: var(--nill-gold-dim);
            border-color: rgba(197,165,114,0.4);
            color: var(--nill-gold);
            font-weight: 600;
          }
          .wta-chip--mine.wta-chip--active {
            background: var(--nill-blue-dim);
            border-color: var(--nill-blue-glow);
            color: #93c5fd;
          }

          /* Floating "Neue Aufgabe" action above the bottom tab bar. */
          .wta-fab {
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
          .wta-fab:active { transform: scale(0.93); }

          /* Create form → bottom sheet. */
          .wta-sheet-backdrop {
            display: block;
            position: fixed; inset: 0; z-index: 310;
            background: rgba(0,0,0,0.5);
          }
          .wta-create {
            position: fixed;
            left: 0; right: 0; bottom: 0;
            z-index: 320;
            margin-bottom: 0 !important;
            border-radius: 16px 16px 0 0 !important;
            border-left: none !important; border-right: none !important; border-bottom: none !important;
            background: var(--bg-panel, var(--nill-bg-grad)) !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            max-height: 85dvh;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
            padding-bottom: env(safe-area-inset-bottom, 0);
          }
          .wta-sheet-handle {
            display: block;
            width: 35px; height: 4px;
            border-radius: 99px;
            background: rgba(var(--ink-tint), 0.25);
            margin: 0.55rem auto 0.1rem;
          }
          .wta-create input, .wta-create select, .wta-create textarea {
            font-size: 16px !important;
            min-height: 44px;
          }
          .wta-form-row { flex-direction: column; }
          .wta-create-actions button {
            flex: 1;
            min-height: 48px;
            font-size: 0.9rem !important;
            border-radius: 12px !important;
          }

          /* Admin retention strip: compact, hint line hidden. */
          .wta-autodel { padding: 0.75rem 0.9rem !important; font-size: 0.78rem !important; }
          .wta-autodel-hint { display: none !important; }
          .wta-autodel input[type="number"] { font-size: 16px !important; min-height: 40px; }

          /* Task cards: touch feedback + ≥44px full-width actions. */
          .wta-task { border-radius: 14px !important; }
          .wta-task .wt-task-actions {
            width: 100%;
            display: flex !important;
            gap: 0.5rem !important;
          }
          .wta-abtn {
            flex: 1 !important;
            min-height: 44px;
            font-size: 0.82rem !important;
            border-radius: 12px !important;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
          }
          .wta-abtn:active { filter: brightness(1.25); }
          .wta-assign { padding: 0.85rem 1rem !important; }
          .wta-assign select { font-size: 16px !important; min-height: 44px; }
          .wta-assign button { min-height: 44px; border-radius: 12px !important; }
        }
      `}),e.jsxs("div",{className:"wta-head",style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--nill-text-dim)"},children:"Betrieb / Aufgaben"}),e.jsx("h1",{className:"wt-h1",style:{fontSize:"1.85rem",fontWeight:800,margin:"0.25rem 0 0",color:"var(--nill-text)",letterSpacing:"-0.01em",lineHeight:1.15},children:"Aufgaben"})]}),e.jsxs("div",{className:"wta-controls",style:{display:"flex",gap:"0.6rem",flexWrap:"wrap",alignItems:"center"},children:[e.jsx("button",{onClick:()=>l(t=>!t),style:{padding:"0.5rem 1rem",background:g?"rgba(147,197,253,0.12)":"transparent",border:`1px solid ${g?"rgba(147,197,253,0.35)":"var(--nill-border)"}`,borderRadius:22,cursor:"pointer",color:g?"#93c5fd":"var(--nill-text-sub)",fontSize:"0.78rem",fontWeight:600,transition:"all 0.15s"},children:"Meine Aufgaben"}),e.jsxs("select",{value:C,onChange:t=>$(t.target.value),style:{...w,width:"auto",padding:"0.5rem 0.85rem"},children:[e.jsx("option",{value:"",children:"Alle Status"}),e.jsx("option",{value:"open",children:"Offen"}),e.jsx("option",{value:"in_progress",children:"In Bearbeitung"}),e.jsx("option",{value:"completed",children:"Erledigt"}),e.jsx("option",{value:"escalated",children:"Eskaliert"})]}),c&&e.jsxs("button",{onClick:()=>y(t=>!t),style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.6rem 1.2rem",background:x?"var(--nill-gold-glow)":"var(--nill-gold-dim)",border:`1px solid ${x?"rgba(197,165,114,0.5)":"rgba(197,165,114,0.28)"}`,borderRadius:22,cursor:"pointer",color:"var(--nill-gold)",fontSize:"0.82rem",fontWeight:700,transition:"all 0.15s"},children:[e.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Neue Aufgabe"]})]})]}),e.jsxs("div",{className:"wta-chips",children:[e.jsx("button",{type:"button",className:`wta-chip wta-chip--mine${g?" wta-chip--active":""}`,onClick:()=>l(t=>!t),children:"Meine"}),[{value:"",label:"Alle"},{value:"open",label:"Offen"},{value:"in_progress",label:"In Bearbeitung"},{value:"completed",label:"Erledigt"},{value:"escalated",label:"Eskaliert"}].map(t=>e.jsx("button",{type:"button",className:`wta-chip${C===t.value?" wta-chip--active":""}`,onClick:()=>$(t.value),children:t.label},t.value))]}),c&&e.jsx("button",{type:"button",className:"wta-fab","aria-label":"Neue Aufgabe",onClick:()=>y(t=>!t),children:e.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]})}),c&&e.jsxs("div",{className:"wta-autodel",style:{display:"flex",alignItems:"center",gap:"0.75rem",flexWrap:"wrap",padding:"0.7rem 1rem",marginBottom:"1.25rem",borderRadius:12,background:"rgba(var(--tint),0.02)",border:"1px solid var(--nill-border)",fontSize:"0.82rem",color:"var(--nill-text-sub)"},children:[e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",cursor:"pointer"},children:[e.jsx("input",{type:"checkbox",checked:W,onChange:t=>{const i=t.target.checked;F(i),P(i,D)},style:{accentColor:"var(--nill-gold)",width:16,height:16,cursor:"pointer"}}),"Erledigte Aufgaben automatisch löschen nach"]}),e.jsx("input",{type:"number",min:1,max:3650,value:D,disabled:!W,onChange:t=>O(t.target.value),style:{width:64,padding:"0.3rem 0.5rem",textAlign:"center",background:"rgba(var(--tint),0.04)",border:"1px solid var(--nill-border)",borderRadius:7,color:"var(--nill-text)",fontSize:"0.82rem",opacity:W?1:.4}}),e.jsx("span",{style:{opacity:W?1:.4},children:"Tagen"}),W&&e.jsx("button",{onClick:()=>P(!0,D),disabled:T,style:{padding:"0.35rem 0.85rem",borderRadius:8,cursor:"pointer",background:"var(--nill-gold-dim)",border:"1px solid rgba(197,165,114,0.28)",color:"var(--nill-gold)",fontSize:"0.75rem",fontWeight:600,opacity:T?.5:1},children:T?"Speichern…":"Übernehmen"}),E&&e.jsx("span",{style:{fontSize:"0.75rem",color:E.startsWith("Fehler")?"#f87171":"#86efac"},children:E}),e.jsx("span",{className:"wta-autodel-hint",style:{marginLeft:"auto",fontSize:"0.7rem",color:"var(--nill-text-dim)"},children:"Nur erledigte Aufgaben · offene bleiben erhalten"})]}),x&&c&&e.jsx("div",{className:"wta-sheet-backdrop",onClick:()=>y(!1)}),x&&c&&e.jsxs("div",{className:"wta-create",style:{...K,marginBottom:"1.5rem"},children:[e.jsx("div",{className:"wta-sheet-handle","aria-hidden":"true"}),e.jsx("div",{style:{padding:"0.75rem 1.25rem",borderBottom:"1px solid var(--nill-border)",fontSize:"0.68rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.09em",color:"var(--nill-text-mute)"},children:"Neue Aufgabe"}),e.jsxs("div",{style:{padding:"1.1rem 1.25rem",display:"flex",flexDirection:"column",gap:"0.75rem"},children:[e.jsxs("div",{className:"wta-form-row",style:{display:"flex",gap:"0.65rem"},children:[e.jsx("input",{style:{...R,flex:2},placeholder:"Titel *",value:o.title,onChange:t=>m("title",t.target.value),onFocus:t=>t.target.style.borderColor="rgba(197,165,114,0.4)",onBlur:t=>t.target.style.borderColor="var(--nill-border)"}),e.jsxs("select",{style:{...w,flex:1},value:o.priority,onChange:t=>m("priority",t.target.value),children:[e.jsx("option",{value:"low",children:"Niedrig"}),e.jsx("option",{value:"medium",children:"Mittel"}),e.jsx("option",{value:"high",children:"Hoch"})]})]}),e.jsx("textarea",{style:{...R,resize:"vertical",minHeight:68,lineHeight:1.5},placeholder:"Beschreibung (optional)",value:o.description,onChange:t=>m("description",t.target.value),onFocus:t=>t.target.style.borderColor="rgba(197,165,114,0.4)",onBlur:t=>t.target.style.borderColor="var(--nill-border)"}),e.jsxs("div",{className:"wt-form-grid-2",style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"},children:[e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.7rem",color:"var(--nill-text-mute)",marginBottom:4,display:"block"},children:"Mitarbeiter zuweisen"}),e.jsxs("select",{style:w,value:o.assignee_id,onChange:t=>{m("assignee_id",t.target.value),t.target.value&&m("assigned_role","")},children:[e.jsx("option",{value:"",children:"— kein Mitarbeiter —"}),A.map(t=>e.jsx("option",{value:t.id,children:t.name||t.email},t.id))]})]}),e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.7rem",color:"var(--nill-text-mute)",marginBottom:4,display:"block"},children:"Rolle zuweisen"}),e.jsxs("select",{style:w,value:o.assigned_role,onChange:t=>{m("assigned_role",t.target.value),t.target.value&&m("assignee_id","")},children:[e.jsx("option",{value:"",children:"— keine Rolle —"}),_.map(t=>e.jsx("option",{value:t.name,children:t.name},t.id))]})]})]}),e.jsxs("div",{className:"wt-form-grid-3",style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.65rem"},children:[e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.7rem",color:"var(--nill-text-mute)",marginBottom:4,display:"block"},children:"Deadline"}),e.jsx("input",{type:"datetime-local",style:R,value:o.due_at,onChange:t=>m("due_at",t.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.7rem",color:"var(--nill-text-mute)",marginBottom:4,display:"block"},children:"Wiederholung"}),e.jsxs("select",{style:w,value:o.recurrence,onChange:t=>m("recurrence",t.target.value),children:[e.jsx("option",{value:"",children:"Einmalig"}),e.jsx("option",{value:"daily",children:"Täglich"}),e.jsx("option",{value:"weekly",children:"Wöchentlich"}),e.jsx("option",{value:"monthly",children:"Monatlich"}),e.jsx("option",{value:"yearly",children:"Jährlich"})]})]}),o.recurrence&&e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.7rem",color:"var(--nill-text-mute)",marginBottom:4,display:"block"},children:"Wiederholung endet"}),e.jsx("input",{type:"datetime-local",style:R,value:o.recurrence_end_at,onChange:t=>m("recurrence_end_at",t.target.value)})]})]}),e.jsxs("div",{className:"wta-create-actions",style:{display:"flex",gap:"0.6rem",marginTop:"0.25rem"},children:[e.jsxs("button",{onClick:q,disabled:!o.title.trim()||f,style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.55rem 1.2rem",background:"var(--nill-gold-dim)",border:"1px solid rgba(197,165,114,0.28)",borderRadius:9,cursor:"pointer",color:"var(--nill-gold)",fontSize:"0.8rem",fontWeight:600,opacity:!o.title.trim()||f?.4:1,transition:"all 0.15s"},children:[f?e.jsx(Z,{}):null," Erstellen"]}),e.jsx("button",{onClick:()=>{y(!1)},style:{padding:"0.55rem 1rem",background:"transparent",border:"1px solid var(--nill-border)",borderRadius:9,cursor:"pointer",color:"var(--nill-text-sub)",fontSize:"0.8rem"},children:"Abbrechen"})]})]})]}),u&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",padding:"2rem 0",color:"var(--nill-text-mute)",fontSize:"0.82rem"},children:[e.jsx(Z,{})," Lade Aufgaben…"]}),!u&&j&&e.jsx("div",{style:{padding:"0.85rem 1.25rem",marginBottom:"1rem",background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:12,color:"#f87171",fontSize:"0.82rem"},children:"Fehler beim Laden der Aufgaben."}),!u&&!j&&s.length===0&&e.jsx("p",{style:{fontSize:"0.82rem",color:"var(--nill-text-dim)",padding:"1rem 0"},children:"Keine Aufgaben vorhanden."}),!u&&!j&&s.length>0&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1.5rem"},children:[{label:"Offen",items:X,accent:!1},{label:"Eskaliert",items:ee,accent:"red"},{label:"Erledigt",items:Y,accent:"green"}].map(t=>t.items.length>0&&e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.65rem"},children:[e.jsx("span",{style:{fontSize:"0.68rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.09em",color:"var(--nill-text-mute)"},children:t.label}),e.jsx("span",{style:{fontSize:"0.68rem",fontWeight:700,padding:"1px 7px",borderRadius:10,lineHeight:1.6,background:"var(--nill-blue-dim)",border:"1px solid var(--nill-blue-glow)",color:"#93c5fd"},children:t.items.length})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:t.items.map(i=>e.jsx(oe,{task:i,isAdmin:c,orgUsers:A,orgRoles:_,actionLoading:f,onComplete:()=>Q(i.id),onEscalate:()=>V(i.id),onRefresh:v,setActionLoading:p},i.id))})]},t.label))})]})}function oe({task:r,isAdmin:a,orgUsers:d,orgRoles:c,actionLoading:s,onComplete:k,onEscalate:A,onRefresh:N,setActionLoading:_}){var g;const[B,u]=n.useState(!1),[S,j]=n.useState(r.assignee_id||""),[z,f]=n.useState(r.assigned_role||""),p=r.assignee_name||((g=d.find(l=>l.id===r.assignee_id))==null?void 0:g.name),x=r.completed_at?new Date(r.completed_at).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):null;async function y(){_(!0);try{await h.post(`/workflow/tasks/${r.id}/assign`,{assignee_id:S||void 0,assigned_role:z||void 0}),u(!1),N()}catch(l){console.error(l)}finally{_(!1)}}return e.jsxs("div",{className:"wta-task",style:{...K},children:[e.jsxs("div",{className:"wt-task-row",style:{padding:"0.9rem 1.25rem",display:"flex",alignItems:"flex-start",gap:"0.85rem",flexWrap:"wrap"},children:[e.jsx("div",{style:{paddingTop:4},children:e.jsx(ie,{priority:r.priority})}),e.jsxs("div",{style:{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:5},children:[e.jsx("span",{style:{fontSize:"0.85rem",fontWeight:700,color:"var(--nill-text)"},children:r.title}),r.description&&e.jsx("span",{style:{fontSize:"0.75rem",color:"var(--nill-text-mute)"},children:r.description}),e.jsxs("div",{style:{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginTop:2},children:[e.jsx(ae,{status:r.status}),e.jsx(le,{recurrence:r.recurrence}),e.jsx(ne,{due_at:r.due_at}),(p||r.assigned_role)&&e.jsxs("span",{style:{fontSize:"0.65rem",fontWeight:600,padding:"0.15rem 0.55rem",borderRadius:20,background:"rgba(197,165,114,0.08)",border:"1px solid rgba(197,165,114,0.2)",color:"var(--nill-gold)"},children:["👤 ",p??`Rolle: ${r.assigned_role}`]}),r.status==="completed"&&x&&e.jsxs("span",{style:{fontSize:"0.65rem",fontWeight:600,padding:"0.15rem 0.55rem",borderRadius:20,background:"rgba(134,239,172,0.08)",border:"1px solid rgba(134,239,172,0.2)",color:"#86efac"},children:["✓ ",r.completed_by_name?`${r.completed_by_name} · `:"",x]})]})]}),r.status!=="completed"&&e.jsxs("div",{className:"wt-task-actions",style:{display:"flex",gap:"0.4rem",flexShrink:0,flexWrap:"wrap"},children:[e.jsx("button",{className:"wta-abtn",onClick:k,disabled:s,style:{padding:"0.35rem 0.85rem",background:"rgba(134,239,172,0.08)",border:"1px solid rgba(134,239,172,0.2)",borderRadius:8,cursor:"pointer",color:"#86efac",fontSize:"0.75rem",fontWeight:600,opacity:s?.4:1},children:"Erledigen"}),r.status!=="escalated"&&e.jsx("button",{className:"wta-abtn",onClick:A,disabled:s,style:{padding:"0.35rem 0.85rem",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:8,cursor:"pointer",color:"#f87171",fontSize:"0.75rem",fontWeight:600,opacity:s?.4:1},children:"Eskalieren"}),a&&e.jsx("button",{className:"wta-abtn",onClick:()=>u(l=>!l),disabled:s,style:{padding:"0.35rem 0.85rem",background:"var(--nill-blue-dim)",border:"1px solid var(--nill-blue-glow)",borderRadius:8,cursor:"pointer",color:"#93c5fd",fontSize:"0.75rem",fontWeight:600,opacity:s?.4:1},children:"Zuweisen"})]})]}),B&&a&&e.jsxs("div",{className:"wta-assign",style:{borderTop:"1px solid var(--nill-border)",padding:"0.85rem 1.25rem",background:"rgba(var(--tint),0.015)",display:"flex",gap:"0.65rem",flexWrap:"wrap",alignItems:"flex-end"},children:[e.jsxs("div",{style:{flex:1,minWidth:160},children:[e.jsx("label",{style:{fontSize:"0.68rem",color:"var(--nill-text-mute)",marginBottom:4,display:"block"},children:"Mitarbeiter"}),e.jsxs("select",{style:w,value:S,onChange:l=>{j(l.target.value),l.target.value&&f("")},children:[e.jsx("option",{value:"",children:"— keine Zuweisung —"}),d.map(l=>e.jsx("option",{value:l.id,children:l.name||l.email},l.id))]})]}),e.jsxs("div",{style:{flex:1,minWidth:160},children:[e.jsx("label",{style:{fontSize:"0.68rem",color:"var(--nill-text-mute)",marginBottom:4,display:"block"},children:"Rolle"}),e.jsxs("select",{style:w,value:z,onChange:l=>{f(l.target.value),l.target.value&&j("")},children:[e.jsx("option",{value:"",children:"— keine Rolle —"}),c.map(l=>e.jsx("option",{value:l.name,children:l.name},l.id))]})]}),e.jsx("button",{onClick:y,disabled:s,style:{padding:"0.55rem 1.1rem",background:"var(--nill-gold-dim)",border:"1px solid rgba(197,165,114,0.28)",borderRadius:9,cursor:"pointer",color:"var(--nill-gold)",fontSize:"0.78rem",fontWeight:600,opacity:s?.4:1},children:"Speichern"}),e.jsx("button",{onClick:()=>u(!1),style:{padding:"0.55rem 1rem",background:"transparent",border:"1px solid var(--nill-border)",borderRadius:9,cursor:"pointer",color:"var(--nill-text-sub)",fontSize:"0.78rem"},children:"Abbrechen"})]})]})}export{ge as default};
