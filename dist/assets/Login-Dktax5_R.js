import{a as r,j as e}from"./vendor-react--hPKs4bs.js";import{u as X,c as Y}from"./vendor-router-DHr2oj4b.js";import{u as ee,a as u}from"./index-CX5TbzS1.js";import"./vendor-misc-DR5OIT6T.js";function le(){const f=X(),{setUser:N,setOrg:w}=ee(),[S,D]=r.useState(""),[j,L]=r.useState(""),[s,d]=r.useState(!1),[o,n]=r.useState(null),[E,v]=r.useState("credentials"),[k,W]=r.useState(""),[b,x]=r.useState(""),[m,q]=r.useState("totp"),[R,C]=r.useState(!1),[F,M]=r.useState(""),[V,B]=r.useState(!1),[A,_]=r.useState(!1),[I,z]=r.useState(null),[O]=Y(),J=O.get("reason")==="inactivity",K=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;async function H(a){var l;if(a.preventDefault(),n(null),!K.test(S)){n("Bitte eine gültige E-Mail-Adresse eingeben.");return}if(!j||j.length<6){n("Passwort muss mindestens 6 Zeichen lang sein.");return}d(!0);try{const i=await u.post("/auth/login",{email:S,password:j});if((l=i.data)!=null&&l.requires_2fa){W(i.data.temp_token),v("2fa"),d(!1);return}const t=await u.get("/auth/me",{withCredentials:!0});N({id:t.data.id,email:t.data.email,role:t.data.role,is_admin:t.data.is_admin,org_role:t.data.org_role??null}),w(t.data.org??null),f("/dashboard",{replace:!0})}catch(i){console.error("Login Fehler:",i),n("E-Mail oder Passwort ungültig.")}finally{d(!1)}}async function P(a){var l,i;a.preventDefault(),n(null),d(!0);try{const t=m==="email"?"/auth/2fa/verify-email-otp":"/auth/2fa/verify-login";await u.post(t,{temp_token:k,code:b.trim()});const c=await u.get("/auth/me",{withCredentials:!0});N({id:c.data.id,email:c.data.email,role:c.data.role,is_admin:c.data.is_admin,org_role:c.data.org_role??null}),w(c.data.org??null),f("/dashboard",{replace:!0})}catch(t){console.error("2FA Fehler:",t),n(((i=(l=t==null?void 0:t.response)==null?void 0:l.data)==null?void 0:i.detail)||"Ungültiger Code. Bitte erneut versuchen."),x("")}finally{d(!1)}}async function T(){var a,l;n(null),d(!0);try{await u.post("/auth/2fa/send-email-otp",{temp_token:k}),C(!0)}catch(i){n(((l=(a=i==null?void 0:i.response)==null?void 0:a.data)==null?void 0:l.detail)||"E-Mail konnte nicht gesendet werden.")}finally{d(!1)}}async function U(a){var l,i;a.preventDefault(),z(null),_(!0);try{await u.post("/auth/request-reset",{email:F}),B(!0)}catch(t){z(((i=(l=t==null?void 0:t.response)==null?void 0:l.data)==null?void 0:i.detail)||"Fehler. Bitte versuche es erneut.")}finally{_(!1)}}async function Z(){var a,l;n(null),d(!0);try{const t=(await u.post("/auth/2fa/webauthn/auth-options",{temp_token:k})).data,c=g=>{const $=atob(g.replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from($,Q=>Q.charCodeAt(0)).buffer},y=g=>btoa(String.fromCharCode(...new Uint8Array(g))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,""),p=await navigator.credentials.get({publicKey:{challenge:c(t.challenge),rpId:t.rpId,timeout:t.timeout,userVerification:t.userVerification,allowCredentials:(t.allowCredentials||[]).map(g=>({type:g.type,id:c(g.id)}))}}),G={id:p.id,rawId:y(p.rawId),type:p.type,response:{clientDataJSON:y(p.response.clientDataJSON),authenticatorData:y(p.response.authenticatorData),signature:y(p.response.signature),userHandle:p.response.userHandle?y(p.response.userHandle):null}};await u.post("/auth/2fa/webauthn/auth-verify",{temp_token:k,credential:G});const h=await u.get("/auth/me",{withCredentials:!0});N({id:h.data.id,email:h.data.email,role:h.data.role,is_admin:h.data.is_admin,org_role:h.data.org_role??null}),w(h.data.org??null),f("/dashboard",{replace:!0})}catch(i){(i==null?void 0:i.name)==="NotAllowedError"?n("Biometrische Authentifizierung abgebrochen."):n(((l=(a=i==null?void 0:i.response)==null?void 0:a.data)==null?void 0:l.detail)||"Biometrische Authentifizierung fehlgeschlagen.")}finally{d(!1)}}return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
          position: relative;
          overflow: hidden;
        }
        .nill-btn-primary:hover:not(:disabled) { background: #fff; }
        .nill-btn-primary:disabled { opacity: .5; cursor: not-allowed; }

        .nill-auth-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 13px;
          color: rgba(239,237,231,.4);
        }
        .nill-auth-footer a, .nill-auth-footer span.link {
          color: #c6ff3c;
          text-decoration: none;
          cursor: pointer;
          transition: opacity .2s;
        }
        .nill-auth-footer span.link:hover { opacity: .7; }

        .nill-divider {
          height: 1px;
          background: rgba(239,237,231,.07);
          margin: 28px 0;
        }

        .nill-inactivity-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 16px;
          margin-bottom: 28px;
          background: rgba(197,165,114,0.08);
          border: 1px solid rgba(197,165,114,0.28);
          border-radius: 12px;
        }
        .nill-inactivity-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .nill-inactivity-title {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(197,165,114,0.9);
          margin-bottom: 3px;
        }
        .nill-inactivity-body {
          font-size: 12.5px;
          color: rgba(239,237,231,0.5);
          line-height: 1.5;
        }
      `}),e.jsx("div",{className:"nill-auth-root",children:e.jsxs("div",{className:"nill-auth-card",children:[e.jsxs("div",{className:"nill-auth-brand",onClick:()=>f("/"),children:[e.jsx("span",{className:"nill-auth-brand-mark"}),e.jsx("span",{className:"nill-auth-brand-name",children:"NILL"})]}),J&&e.jsxs("div",{className:"nill-inactivity-banner",children:[e.jsx("span",{className:"nill-inactivity-icon",children:"⏱"}),e.jsxs("div",{children:[e.jsx("div",{className:"nill-inactivity-title",children:"Sitzung abgelaufen"}),e.jsx("div",{className:"nill-inactivity-body",children:"Du wurdest nach 60 Minuten Inaktivität automatisch abgemeldet. Bitte melde dich erneut an."})]})]}),E==="credentials"?e.jsxs(e.Fragment,{children:[e.jsxs("h1",{className:"nill-auth-heading",children:["Willkommen ",e.jsx("em",{children:"zurück."})]}),e.jsx("p",{className:"nill-auth-sub",children:"Meld dich an und lass die KI weiterarbeiten."}),e.jsxs("form",{onSubmit:H,noValidate:!0,children:[e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",htmlFor:"login-email",children:"E-Mail"}),e.jsx("input",{id:"login-email",className:"nill-input",type:"email",placeholder:"du@firma.de",value:S,onChange:a=>D(a.target.value),autoComplete:"email",required:!0,"aria-required":"true"})]}),e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",htmlFor:"login-password",children:"Passwort"}),e.jsx("input",{id:"login-password",className:"nill-input",type:"password",placeholder:"••••••••",value:j,onChange:a=>L(a.target.value),autoComplete:"current-password",required:!0,"aria-required":"true"})]}),o&&e.jsx("div",{className:"nill-error",children:o}),e.jsx("button",{className:"nill-btn-primary",type:"submit",disabled:s,children:s?"Anmelden…":"Anmelden →"})]}),e.jsx("div",{className:"nill-divider"}),e.jsx("p",{className:"nill-auth-footer",children:e.jsx("span",{className:"link",onClick:()=>{v("forgot"),n(null)},children:"Passwort vergessen?"})}),e.jsxs("p",{className:"nill-auth-footer",style:{marginTop:10},children:["Noch kein Konto?"," ",e.jsx("span",{className:"link",onClick:()=>f("/register"),children:"Registrieren"})]})]}):E==="forgot"?e.jsxs(e.Fragment,{children:[e.jsxs("h1",{className:"nill-auth-heading",children:["Passwort ",e.jsx("em",{children:"vergessen?"})]}),e.jsx("p",{className:"nill-auth-sub",children:"Wir schicken dir einen Reset-Link an deine E-Mail."}),V?e.jsx("div",{style:{padding:"16px 18px",background:"rgba(198,255,60,.07)",border:"1px solid rgba(198,255,60,.25)",borderRadius:12,fontSize:13,color:"rgba(239,237,231,.8)",lineHeight:1.6},children:"Falls ein Konto mit dieser E-Mail existiert, wurde ein Link gesendet. Bitte prüfe deinen Posteingang."}):e.jsxs("form",{onSubmit:U,noValidate:!0,children:[e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",htmlFor:"forgot-email",children:"E-Mail"}),e.jsx("input",{id:"forgot-email",className:"nill-input",type:"email",placeholder:"du@firma.de",value:F,onChange:a=>M(a.target.value),autoComplete:"email",required:!0,autoFocus:!0})]}),I&&e.jsx("div",{className:"nill-error",children:I}),e.jsx("button",{className:"nill-btn-primary",type:"submit",disabled:A||!F,children:A?"Sende…":"Reset-Link senden →"})]}),e.jsx("div",{className:"nill-divider"}),e.jsx("p",{className:"nill-auth-footer",children:e.jsx("span",{className:"link",onClick:()=>{v("credentials"),B(!1),M(""),z(null)},children:"← Zurück zur Anmeldung"})})]}):e.jsxs(e.Fragment,{children:[e.jsxs("h1",{className:"nill-auth-heading",children:["Zwei-Faktor-",e.jsx("em",{children:"Verify."})]}),e.jsx("p",{className:"nill-auth-sub",children:"Wähle eine Methode zur Verifizierung."}),e.jsx("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"1.25rem",flexWrap:"wrap"},children:[{key:"totp",label:"🔐 Authenticator",desc:"TOTP-App Code"},{key:"email",label:"📧 E-Mail Code",desc:"Code per E-Mail"},{key:"webauthn",label:"🪪 Biometrie",desc:"Touch / Face ID"}].map(a=>e.jsxs("button",{type:"button",onClick:()=>{q(a.key),n(null),x(""),C(!1)},style:{flex:1,padding:"0.6rem 0.5rem",borderRadius:10,border:m===a.key?"1.5px solid rgba(197,165,114,0.7)":"1.5px solid rgba(255,255,255,0.1)",background:m===a.key?"rgba(197,165,114,0.12)":"rgba(255,255,255,0.04)",color:m===a.key?"#C5A572":"rgba(255,255,255,0.5)",fontSize:"0.72rem",fontWeight:600,cursor:"pointer",transition:"all 0.15s"},children:[e.jsx("div",{children:a.label}),e.jsx("div",{style:{fontWeight:400,opacity:.7,marginTop:2},children:a.desc})]},a.key))}),m==="totp"&&e.jsxs("form",{onSubmit:P,noValidate:!0,children:[e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",children:"Code aus Authenticator-App"}),e.jsx("input",{className:"nill-input",type:"text",inputMode:"numeric",pattern:"[0-9]*",placeholder:"000000",value:b,onChange:a=>x(a.target.value.replace(/\D/g,"").slice(0,6)),autoComplete:"one-time-code",autoFocus:!0,required:!0})]}),o&&e.jsx("div",{className:"nill-error",children:o}),e.jsx("button",{className:"nill-btn-primary",type:"submit",disabled:s||b.length<6,children:s?"Prüfen…":"Bestätigen →"})]}),m==="email"&&e.jsx("div",{children:R?e.jsxs("form",{onSubmit:P,noValidate:!0,children:[e.jsx("p",{style:{fontSize:"0.82rem",color:"rgba(197,165,114,0.9)",marginBottom:"1rem"},children:"Code gesendet. Bitte prüfe deine E-Mails."}),e.jsxs("div",{className:"nill-field",children:[e.jsx("label",{className:"nill-label",children:"E-Mail Code"}),e.jsx("input",{className:"nill-input",type:"text",inputMode:"numeric",pattern:"[0-9]*",placeholder:"000000",value:b,onChange:a=>x(a.target.value.replace(/\D/g,"").slice(0,6)),autoComplete:"one-time-code",autoFocus:!0,required:!0})]}),o&&e.jsx("div",{className:"nill-error",children:o}),e.jsx("button",{className:"nill-btn-primary",type:"submit",disabled:s||b.length<6,children:s?"Prüfen…":"Bestätigen →"}),e.jsx("button",{type:"button",onClick:T,disabled:s,style:{width:"100%",marginTop:"0.5rem",background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",cursor:"pointer"},children:"Code erneut senden"})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",marginBottom:"1rem"},children:"Wir senden dir einen 6-stelligen Code an deine E-Mail-Adresse."}),o&&e.jsx("div",{className:"nill-error",children:o}),e.jsx("button",{className:"nill-btn-primary",type:"button",onClick:T,disabled:s,children:s?"Sende…":"Code per E-Mail senden"})]})}),m==="webauthn"&&e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",marginBottom:"1rem"},children:"Verwende den Fingerabdruckscanner, Face ID oder einen Sicherheitsschlüssel deines Geräts."}),o&&e.jsx("div",{className:"nill-error",children:o}),e.jsx("button",{className:"nill-btn-primary",type:"button",onClick:Z,disabled:s,children:s?"Warte auf Biometrie…":"🪪 Biometrisch bestätigen"})]}),e.jsx("div",{className:"nill-divider"}),e.jsx("p",{className:"nill-auth-footer",children:e.jsx("span",{className:"link",onClick:()=>{v("credentials"),n(null),x(""),C(!1)},children:"← Zurück zur Anmeldung"})})]})]})})]})}export{le as default};
