import{a as i,j as e}from"./vendor-react--hPKs4bs.js";import{u as j,c as y}from"./vendor-router-rhPWNlHF.js";import{a as k}from"./index-COXk16WZ.js";import"./vendor-misc-1rS7ujT8.js";function F(){const s=j(),[m]=y(),o=m.get("token")||"",[n,g]=i.useState(""),[t,f]=i.useState(""),[d,c]=i.useState(!1),[p,r]=i.useState(null),[x,b]=i.useState(!1);async function w(a){var u,h;if(a.preventDefault(),r(null),n.length<8){r("Passwort muss mindestens 8 Zeichen lang sein.");return}if(n!==t){r("Die Passwörter stimmen nicht überein.");return}c(!0);try{await k.post("/auth/reset-password",{token:o,password:n}),b(!0)}catch(l){r(((h=(u=l==null?void 0:l.response)==null?void 0:u.data)==null?void 0:h.detail)||"Ungültiger oder abgelaufener Link.")}finally{c(!1)}}return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .nill-auth-root {
          min-height: 100vh;
          background: #040407;
          color: #efede7;
          font-family: "Inter", system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .nill-auth-root::before {
          content: "";
          position: fixed;
          inset: 0;
          background:
            radial-gradient(60% 50% at 20% 20%, rgba(122,92,255,.10), transparent 60%),
            radial-gradient(50% 40% at 80% 80%, rgba(198,255,60,.07), transparent 60%);
          pointer-events: none;
        }
        .nill-auth-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(239,237,231,.07);
          border-radius: 24px;
          padding: 48px 40px;
        }
        .nill-auth-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
          text-decoration: none;
          cursor: pointer;
        }
        .nill-auth-brand-mark {
          width: 26px;
          height: 26px;
          border-radius: 7px;
          background: conic-gradient(from 210deg, #c6ff3c, #38f5d0, #7a5cff, #ff4d8d, #c6ff3c);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .nill-auth-brand-mark::after {
          content: "";
          position: absolute;
          inset: 4px;
          border-radius: 4px;
          background: #040407;
        }
        .nill-auth-brand-name {
          font-family: "Fraunces", Georgia, serif;
          font-size: 20px;
          letter-spacing: -.02em;
          color: #efede7;
          font-weight: 400;
        }
        .nill-auth-heading {
          font-family: "Fraunces", Georgia, serif;
          font-weight: 400;
          font-size: 36px;
          letter-spacing: -.025em;
          line-height: .95;
          color: #efede7;
          margin-bottom: 8px;
        }
        .nill-auth-heading em {
          font-style: italic;
          color: #c6ff3c;
        }
        .nill-auth-sub {
          font-size: 14px;
          color: rgba(239,237,231,.5);
          margin-bottom: 36px;
          line-height: 1.5;
        }
        .nill-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }
        .nill-label {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(239,237,231,.45);
        }
        .nill-input {
          width: 100%;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(239,237,231,.08);
          border-radius: 10px;
          padding: 12px 14px;
          color: #efede7;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .nill-input::placeholder { color: rgba(239,237,231,.25); }
        .nill-input:focus { border-color: rgba(198,255,60,.4); }
        .nill-error {
          font-size: 12px;
          color: #ff4d8d;
          font-family: "JetBrains Mono", monospace;
          letter-spacing: .02em;
          padding: 10px 14px;
          background: rgba(255,77,141,.07);
          border: 1px solid rgba(255,77,141,.2);
          border-radius: 8px;
          margin-bottom: 14px;
        }
        .nill-btn-primary {
          width: 100%;
          margin-top: 8px;
          padding: 13px;
          background: #c6ff3c;
          color: #050505;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 99px;
          cursor: pointer;
          transition: background .25s, opacity .2s;
        }
        .nill-btn-primary:hover:not(:disabled) { background: #fff; }
        .nill-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
        .nill-auth-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 13px;
          color: rgba(239,237,231,.4);
        }
        .nill-auth-footer span.link {
          color: #c6ff3c;
          cursor: pointer;
          transition: opacity .2s;
        }
        .nill-auth-footer span.link:hover { opacity: .7; }
        .nill-divider {
          height: 1px;
          background: rgba(239,237,231,.07);
          margin: 28px 0;
        }
      `}),e.jsx("div",{className:"nill-auth-root",children:e.jsxs("div",{className:"nill-auth-card",children:[e.jsxs("div",{className:"nill-auth-brand",onClick:()=>s("/"),children:[e.jsx("span",{className:"nill-auth-brand-mark"}),e.jsx("span",{className:"nill-auth-brand-name",children:"NILL"})]}),o?x?e.jsxs(e.Fragment,{children:[e.jsxs("h1",{className:"nill-auth-heading",children:["Passwort ",e.jsx("em",{children:"gesetzt."})]}),e.jsx("p",{className:"nill-auth-sub",children:"Dein Passwort wurde erfolgreich geändert. Du kannst dich jetzt anmelden."}),e.jsx("button",{className:"nill-btn-primary",onClick:()=>s("/login"),children:"Zum Login →"})]}):e.jsxs(e.Fragment,{children:[e.jsxs("h1",{className:"nill-auth-heading",children:["Neues ",e.jsx("em",{children:"Passwort."})]}),e.jsx("p",{className:"nill-auth-sub",children:"Wähle ein neues Passwort für dein Konto."}),e.jsxs("form",{onSubmit:w,noValidate:!0,children:[e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",htmlFor:"rp-password",children:"Neues Passwort"}),e.jsx("input",{id:"rp-password",className:"nill-input",type:"password",placeholder:"Mindestens 8 Zeichen",value:n,onChange:a=>g(a.target.value),autoComplete:"new-password",required:!0,autoFocus:!0})]}),e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",htmlFor:"rp-password2",children:"Passwort bestätigen"}),e.jsx("input",{id:"rp-password2",className:"nill-input",type:"password",placeholder:"Passwort wiederholen",value:t,onChange:a=>f(a.target.value),autoComplete:"new-password",required:!0})]}),p&&e.jsx("div",{className:"nill-error",children:p}),e.jsx("button",{className:"nill-btn-primary",type:"submit",disabled:d||!n||!t,children:d?"Speichern…":"Passwort speichern →"})]}),e.jsx("div",{className:"nill-divider"}),e.jsx("p",{className:"nill-auth-footer",children:e.jsx("span",{className:"link",onClick:()=>s("/login"),children:"← Zurück zum Login"})})]}):e.jsxs(e.Fragment,{children:[e.jsxs("h1",{className:"nill-auth-heading",children:["Ungültiger ",e.jsx("em",{children:"Link."})]}),e.jsx("p",{className:"nill-auth-sub",children:"Dieser Reset-Link ist nicht gültig. Bitte fordere einen neuen an."}),e.jsx("div",{className:"nill-divider"}),e.jsx("p",{className:"nill-auth-footer",children:e.jsx("span",{className:"link",onClick:()=>s("/login"),children:"← Zum Login"})})]})]})})]})}export{F as default};
