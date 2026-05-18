import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setOrg } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2FA state
  const [step, setStep]           = useState("credentials"); // "credentials" | "2fa"
  const [tempToken, setTempToken] = useState("");
  const [totpCode, setTotpCode]   = useState("");
  const [tfaMethod, setTfaMethod] = useState("totp"); // "totp" | "email" | "webauthn"
  const [emailSent, setEmailSent] = useState(false);

  // Forgot-password state
  const [forgotEmail, setForgotEmail]     = useState("");
  const [forgotSent, setForgotSent]       = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError]     = useState(null);

  const [searchParams] = useSearchParams();
  const inactivityLogout = searchParams.get("reason") === "inactivity";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!emailRegex.test(email)) {
      setError("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data?.["2fa_required"]) {
        setTempToken(res.data.temp_token);
        setStep("2fa");
        setLoading(false);
        return;
      }
      const me = await api.get("/auth/me", { withCredentials: true });
      setUser({ id: me.data.id, email: me.data.email, role: me.data.role, is_admin: me.data.is_admin, org_role: me.data.org_role ?? null });
      setOrg(me.data.org ?? null);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login Fehler:", err);
      setError("E-Mail oder Passwort ungültig.");
    } finally {
      setLoading(false);
    }
  }

  async function handle2faSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = tfaMethod === "email"
        ? "/auth/2fa/verify-email-otp"
        : "/auth/2fa/verify-login";
      await api.post(endpoint, { temp_token: tempToken, code: totpCode.trim() });
      const me = await api.get("/auth/me", { withCredentials: true });
      setUser({ id: me.data.id, email: me.data.email, role: me.data.role, is_admin: me.data.is_admin, org_role: me.data.org_role ?? null });
      setOrg(me.data.org ?? null);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("2FA Fehler:", err);
      setError(err?.response?.data?.detail || "Ungültiger Code. Bitte erneut versuchen.");
      setTotpCode("");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmailOtp() {
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/2fa/send-email-otp", { temp_token: tempToken });
      setEmailSent(true);
    } catch (err) {
      setError(err?.response?.data?.detail || "E-Mail konnte nicht gesendet werden.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      await api.post("/auth/request-reset", { email: forgotEmail });
      setForgotSent(true);
    } catch (err) {
      setForgotError(err?.response?.data?.detail || "Fehler. Bitte versuche es erneut.");
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleWebAuthn() {
    setError(null);
    setLoading(true);
    try {
      const optRes = await api.post("/auth/2fa/webauthn/auth-options", { temp_token: tempToken });
      const options = optRes.data;

      // Convert base64url to ArrayBuffer
      const b64toArr = s => {
        const b = atob(s.replace(/-/g,"+").replace(/_/g,"/"));
        return Uint8Array.from(b, c => c.charCodeAt(0)).buffer;
      };
      const arrToB64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: b64toArr(options.challenge),
          rpId: options.rpId,
          timeout: options.timeout,
          userVerification: options.userVerification,
          allowCredentials: (options.allowCredentials || []).map(c => ({
            type: c.type,
            id: b64toArr(c.id),
          })),
        },
      });

      const credPayload = {
        id: credential.id,
        rawId: arrToB64(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON: arrToB64(credential.response.clientDataJSON),
          authenticatorData: arrToB64(credential.response.authenticatorData),
          signature: arrToB64(credential.response.signature),
          userHandle: credential.response.userHandle ? arrToB64(credential.response.userHandle) : null,
        },
      };

      await api.post("/auth/2fa/webauthn/auth-verify", { temp_token: tempToken, credential: credPayload });
      const me = await api.get("/auth/me", { withCredentials: true });
      setUser({ id: me.data.id, email: me.data.email, role: me.data.role, is_admin: me.data.is_admin, org_role: me.data.org_role ?? null });
      setOrg(me.data.org ?? null);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err?.name === "NotAllowedError") {
        setError("Biometrische Authentifizierung abgebrochen.");
      } else {
        setError(err?.response?.data?.detail || "Biometrische Authentifizierung fehlgeschlagen.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
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
      `}</style>

      <div className="nill-auth-root">
        <div className="nill-auth-card">

          <div className="nill-auth-brand" onClick={() => navigate("/")}>
            <span className="nill-auth-brand-mark" />
            <span className="nill-auth-brand-name">NILL</span>
          </div>

          {inactivityLogout && (
            <div className="nill-inactivity-banner">
              <span className="nill-inactivity-icon">⏱</span>
              <div>
                <div className="nill-inactivity-title">Sitzung abgelaufen</div>
                <div className="nill-inactivity-body">
                  Du wurdest nach 60 Minuten Inaktivität automatisch abgemeldet. Bitte melde dich erneut an.
                </div>
              </div>
            </div>
          )}

          {step === "credentials" ? (
            <>
              <h1 className="nill-auth-heading">Willkommen <em>zurück.</em></h1>
              <p className="nill-auth-sub">Meld dich an und lass die KI weiterarbeiten.</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="nill-field">
                  <label className="nill-label" htmlFor="login-email">E-Mail</label>
                  <input
                    id="login-email"
                    className="nill-input"
                    type="email"
                    placeholder="du@firma.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    aria-required="true"
                  />
                </div>

                <div className="nill-field">
                  <label className="nill-label" htmlFor="login-password">Passwort</label>
                  <input
                    id="login-password"
                    className="nill-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    aria-required="true"
                  />
                </div>

                {error && <div className="nill-error">{error}</div>}

                <button className="nill-btn-primary" type="submit" disabled={loading}>
                  {loading ? "Anmelden…" : "Anmelden →"}
                </button>
              </form>

              <div className="nill-divider" />

              <p className="nill-auth-footer">
                <span className="link" onClick={() => { setStep("forgot"); setError(null); }}>
                  Passwort vergessen?
                </span>
              </p>
              <p className="nill-auth-footer" style={{ marginTop: 10 }}>
                Noch kein Konto?{" "}
                <span className="link" onClick={() => navigate("/register")}>
                  Registrieren
                </span>
              </p>
            </>
          ) : step === "forgot" ? (
            <>
              <h1 className="nill-auth-heading">Passwort <em>vergessen?</em></h1>
              <p className="nill-auth-sub">Wir schicken dir einen Reset-Link an deine E-Mail.</p>

              {forgotSent ? (
                <div style={{
                  padding: "16px 18px",
                  background: "rgba(198,255,60,.07)",
                  border: "1px solid rgba(198,255,60,.25)",
                  borderRadius: 12,
                  fontSize: 13,
                  color: "rgba(239,237,231,.8)",
                  lineHeight: 1.6,
                }}>
                  Falls ein Konto mit dieser E-Mail existiert, wurde ein Link gesendet.
                  Bitte prüfe deinen Posteingang.
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} noValidate>
                  <div className="nill-field">
                    <label className="nill-label" htmlFor="forgot-email">E-Mail</label>
                    <input
                      id="forgot-email"
                      className="nill-input"
                      type="email"
                      placeholder="du@firma.de"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      autoComplete="email"
                      required
                      autoFocus
                    />
                  </div>

                  {forgotError && <div className="nill-error">{forgotError}</div>}

                  <button className="nill-btn-primary" type="submit" disabled={forgotLoading || !forgotEmail}>
                    {forgotLoading ? "Sende…" : "Reset-Link senden →"}
                  </button>
                </form>
              )}

              <div className="nill-divider" />
              <p className="nill-auth-footer">
                <span className="link" onClick={() => { setStep("credentials"); setForgotSent(false); setForgotEmail(""); setForgotError(null); }}>
                  ← Zurück zur Anmeldung
                </span>
              </p>
            </>
          ) : (
            <>
              <h1 className="nill-auth-heading">Zwei-Faktor-<em>Verify.</em></h1>
              <p className="nill-auth-sub">Wähle eine Methode zur Verifizierung.</p>

              {/* Method selector */}
              <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.25rem", flexWrap:"wrap" }}>
                {[
                  { key:"totp",     label:"🔐 Authenticator", desc:"TOTP-App Code" },
                  { key:"email",    label:"📧 E-Mail Code",    desc:"Code per E-Mail" },
                  { key:"webauthn", label:"🪪 Biometrie",      desc:"Touch / Face ID" },
                ].map(m => (
                  <button key={m.key} type="button"
                    onClick={() => { setTfaMethod(m.key); setError(null); setTotpCode(""); setEmailSent(false); }}
                    style={{
                      flex: 1, padding:"0.6rem 0.5rem",
                      borderRadius: 10,
                      border: tfaMethod===m.key ? "1.5px solid rgba(197,165,114,0.7)" : "1.5px solid rgba(255,255,255,0.1)",
                      background: tfaMethod===m.key ? "rgba(197,165,114,0.12)" : "rgba(255,255,255,0.04)",
                      color: tfaMethod===m.key ? "#C5A572" : "rgba(255,255,255,0.5)",
                      fontSize:"0.72rem", fontWeight:600, cursor:"pointer",
                      transition:"all 0.15s",
                    }}>
                    <div>{m.label}</div>
                    <div style={{ fontWeight:400, opacity:0.7, marginTop:2 }}>{m.desc}</div>
                  </button>
                ))}
              </div>

              {/* TOTP */}
              {tfaMethod === "totp" && (
                <form onSubmit={handle2faSubmit} noValidate>
                  <div className="nill-field">
                    <label className="nill-label">Code aus Authenticator-App</label>
                    <input className="nill-input" type="text" inputMode="numeric" pattern="[0-9]*"
                      placeholder="000000" value={totpCode}
                      onChange={e => setTotpCode(e.target.value.replace(/\D/g,"").slice(0,6))}
                      autoComplete="one-time-code" autoFocus required/>
                  </div>
                  {error && <div className="nill-error">{error}</div>}
                  <button className="nill-btn-primary" type="submit" disabled={loading || totpCode.length < 6}>
                    {loading ? "Prüfen…" : "Bestätigen →"}
                  </button>
                </form>
              )}

              {/* Email OTP */}
              {tfaMethod === "email" && (
                <div>
                  {!emailSent ? (
                    <>
                      <p style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.5)", marginBottom:"1rem" }}>
                        Wir senden dir einen 6-stelligen Code an deine E-Mail-Adresse.
                      </p>
                      {error && <div className="nill-error">{error}</div>}
                      <button className="nill-btn-primary" type="button" onClick={handleSendEmailOtp} disabled={loading}>
                        {loading ? "Sende…" : "Code per E-Mail senden"}
                      </button>
                    </>
                  ) : (
                    <form onSubmit={handle2faSubmit} noValidate>
                      <p style={{ fontSize:"0.82rem", color:"rgba(197,165,114,0.9)", marginBottom:"1rem" }}>
                        Code gesendet. Bitte prüfe deine E-Mails.
                      </p>
                      <div className="nill-field">
                        <label className="nill-label">E-Mail Code</label>
                        <input className="nill-input" type="text" inputMode="numeric" pattern="[0-9]*"
                          placeholder="000000" value={totpCode}
                          onChange={e => setTotpCode(e.target.value.replace(/\D/g,"").slice(0,6))}
                          autoComplete="one-time-code" autoFocus required/>
                      </div>
                      {error && <div className="nill-error">{error}</div>}
                      <button className="nill-btn-primary" type="submit" disabled={loading || totpCode.length < 6}>
                        {loading ? "Prüfen…" : "Bestätigen →"}
                      </button>
                      <button type="button" onClick={handleSendEmailOtp} disabled={loading}
                        style={{ width:"100%", marginTop:"0.5rem", background:"none", border:"none",
                          color:"rgba(255,255,255,0.4)", fontSize:"0.78rem", cursor:"pointer" }}>
                        Code erneut senden
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* WebAuthn */}
              {tfaMethod === "webauthn" && (
                <div>
                  <p style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.5)", marginBottom:"1rem" }}>
                    Verwende den Fingerabdruckscanner, Face ID oder einen Sicherheitsschlüssel deines Geräts.
                  </p>
                  {error && <div className="nill-error">{error}</div>}
                  <button className="nill-btn-primary" type="button" onClick={handleWebAuthn} disabled={loading}>
                    {loading ? "Warte auf Biometrie…" : "🪪 Biometrisch bestätigen"}
                  </button>
                </div>
              )}

              <div className="nill-divider" />
              <p className="nill-auth-footer">
                <span className="link" onClick={() => { setStep("credentials"); setError(null); setTotpCode(""); setEmailSent(false); }}>
                  ← Zurück zur Anmeldung
                </span>
              </p>
            </>
          )}

        </div>
      </div>
    </>
  );
}
