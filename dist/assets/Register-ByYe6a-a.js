import{a as n,j as e}from"./vendor-react--hPKs4bs.js";import{a as F}from"./index-DywO1ifZ.js";import{u as P}from"./vendor-router-rhPWNlHF.js";import"./vendor-misc-1rS7ujT8.js";function A(){const l=P(),[s,y]=n.useState(""),[a,v]=n.useState(""),[o,k]=n.useState(""),[c,d]=n.useState(!1),[w,j]=n.useState(!1),[p,i]=n.useState(""),[u,N]=n.useState(!1),z=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,g=8,B=r=>{var b,x,m;const t=(x=(b=r.response)==null?void 0:b.data)==null?void 0:x.detail,f=(m=r.response)==null?void 0:m.status;if(f===429)return"Zu viele Versuche. Bitte warte eine Stunde und versuche es erneut.";if(f===500)return"Serverfehler. Bitte versuche es später erneut.";if(typeof t=="string"){if(t.includes("Missing email or password"))return"Bitte E-Mail und Passwort angeben.";if(t.includes("Invalid JSON"))return"Ungültige Anfrage. Bitte lade die Seite neu.";if(t.includes("Failed to send verification email"))return"Bestätigungs-Mail konnte nicht gesendet werden. Bitte versuche es später erneut."}return"Registrierung fehlgeschlagen. Bitte versuche es später erneut."},S=async r=>{if(r.preventDefault(),i(""),!s||!a||!o){i("Bitte alle Felder ausfüllen.");return}if(!z.test(s)){i("Bitte eine gültige E-Mail-Adresse eingeben.");return}if(a.length<g){i(`Passwort muss mindestens ${g} Zeichen lang sein.`);return}if(a!==o){i("Passwörter stimmen nicht überein.");return}if(!u){i("Bitte akzeptiere die Datenschutzerklärung.");return}d(!0);try{await F.post("/auth/register",{email:s,password:a}),j(!0)}catch(t){console.error("Registration error:",t),i(B(t))}finally{d(!1)}},h=`
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
    .nill-auth-heading em { font-style: italic; color: #c6ff3c; }
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
    .nill-error a {
      color: #c6ff3c;
      cursor: pointer;
      text-decoration: underline;
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
    .nill-btn-ghost {
      width: 100%;
      margin-top: 8px;
      padding: 13px;
      background: transparent;
      color: #efede7;
      font-family: "Inter", sans-serif;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid rgba(239,237,231,.12);
      border-radius: 99px;
      cursor: pointer;
      transition: border-color .25s, background .25s;
    }
    .nill-btn-ghost:hover { border-color: rgba(239,237,231,.4); background: rgba(255,255,255,.035); }
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
    .nill-divider { height: 1px; background: rgba(239,237,231,.07); margin: 28px 0; }
    .nill-success-icon {
      width: 48px; height: 48px;
      background: rgba(198,255,60,.1);
      border: 1px solid rgba(198,255,60,.3);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
      font-size: 20px;
    }
    .nill-privacy-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 14px;
      padding: 12px 14px;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(239,237,231,.07);
      border-radius: 10px;
      cursor: pointer;
    }
    .nill-privacy-box:has(input:checked) {
      border-color: rgba(198,255,60,.3);
      background: rgba(198,255,60,.04);
    }
    .nill-privacy-checkbox {
      appearance: none;
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      min-width: 16px;
      border: 1.5px solid rgba(239,237,231,.25);
      border-radius: 4px;
      background: transparent;
      cursor: pointer;
      margin-top: 1px;
      position: relative;
      transition: border-color .2s, background .2s;
    }
    .nill-privacy-checkbox:checked {
      background: #c6ff3c;
      border-color: #c6ff3c;
    }
    .nill-privacy-checkbox:checked::after {
      content: "";
      position: absolute;
      left: 4px;
      top: 1px;
      width: 5px;
      height: 9px;
      border: 2px solid #050505;
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
    }
    .nill-privacy-label {
      font-size: 13px;
      color: rgba(239,237,231,.55);
      line-height: 1.5;
      user-select: none;
    }
    .nill-privacy-label a {
      color: #c6ff3c;
      text-decoration: underline;
      text-underline-offset: 2px;
      transition: opacity .2s;
    }
    .nill-privacy-label a:hover { opacity: .7; }
  `,C=p;return w?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:h}),e.jsx("div",{className:"nill-auth-root",children:e.jsxs("div",{className:"nill-auth-card",style:{textAlign:"center"},children:[e.jsx("div",{className:"nill-success-icon",style:{margin:"0 auto 24px"},children:"✓"}),e.jsxs("h1",{className:"nill-auth-heading",style:{marginBottom:12},children:["Fast ",e.jsx("em",{children:"geschafft."})]}),e.jsxs("p",{className:"nill-auth-sub",style:{marginBottom:32},children:["Wir haben dir eine Bestätigungs-Mail gesendet.",e.jsx("br",{}),"Bitte bestätige deine Adresse, bevor du dich einloggst."]}),e.jsx("button",{className:"nill-btn-primary",onClick:()=>l("/login"),children:"Zum Login →"})]})})]}):e.jsxs(e.Fragment,{children:[e.jsx("style",{children:h}),e.jsx("div",{className:"nill-auth-root",children:e.jsxs("div",{className:"nill-auth-card",children:[e.jsxs("div",{className:"nill-auth-brand",onClick:()=>l("/"),children:[e.jsx("span",{className:"nill-auth-brand-mark"}),e.jsx("span",{className:"nill-auth-brand-name",children:"NILL"})]}),e.jsxs("h1",{className:"nill-auth-heading",children:["Konto ",e.jsx("em",{children:"erstellen."})]}),e.jsx("p",{className:"nill-auth-sub",children:"Kostenlos starten — keine Kreditkarte nötig."}),e.jsxs("form",{onSubmit:S,noValidate:!0,children:[e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",htmlFor:"reg-email",children:"E-Mail"}),e.jsx("input",{id:"reg-email",className:"nill-input",type:"email",placeholder:"du@firma.de",value:s,onChange:r=>y(r.target.value),autoComplete:"email",required:!0,"aria-required":"true"})]}),e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",htmlFor:"reg-password",children:"Passwort"}),e.jsx("input",{id:"reg-password",className:"nill-input",type:"password",placeholder:"••••••••",value:a,onChange:r=>v(r.target.value),autoComplete:"new-password",required:!0,"aria-required":"true"})]}),e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",htmlFor:"reg-password-repeat",children:"Passwort wiederholen"}),e.jsx("input",{id:"reg-password-repeat",className:"nill-input",type:"password",placeholder:"••••••••",value:o,onChange:r=>k(r.target.value),autoComplete:"new-password",required:!0})]}),e.jsxs("label",{className:"nill-privacy-box",children:[e.jsx("input",{className:"nill-privacy-checkbox",type:"checkbox",checked:u,onChange:r=>N(r.target.checked)}),e.jsxs("span",{className:"nill-privacy-label",children:["Ich habe die"," ",e.jsx("a",{href:"https://nillai.de/Datenschutz",target:"_blank",rel:"noopener noreferrer",onClick:r=>r.stopPropagation(),children:"Datenschutzerklärung"})," ","gelesen und akzeptiere sie."]})]}),p&&e.jsx("div",{className:"nill-error",children:C}),e.jsx("button",{className:"nill-btn-primary",type:"submit",disabled:c,children:c?"Registriere…":"Registrieren →"})]}),e.jsx("div",{className:"nill-divider"}),e.jsxs("p",{className:"nill-auth-footer",children:["Bereits registriert?"," ",e.jsx("span",{className:"link",onClick:()=>l("/login"),children:"Login"})]})]})})]})}export{A as default};
