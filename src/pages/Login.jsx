import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setOrg } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      await api.post("/auth/login", { email, password });
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
      `}</style>

      <div className="nill-auth-root">
        <div className="nill-auth-card">

          <div className="nill-auth-brand" onClick={() => navigate("/")}>
            <span className="nill-auth-brand-mark" />
            <span className="nill-auth-brand-name">NILL</span>
          </div>

          <h1 className="nill-auth-heading">Willkommen <em>zurück.</em></h1>
          <p className="nill-auth-sub">Meld dich an und lass die KI weiterarbeiten.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="nill-field">
              <label className="nill-label">E-Mail</label>
              <input
                className="nill-input"
                type="email"
                placeholder="du@firma.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="nill-field">
              <label className="nill-label">Passwort</label>
              <input
                className="nill-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="nill-error">{error}</div>}

            <button className="nill-btn-primary" type="submit" disabled={loading}>
              {loading ? "Anmelden…" : "Anmelden →"}
            </button>
          </form>

          <div className="nill-divider" />

          <p className="nill-auth-footer">
            Noch kein Konto?{" "}
            <span className="link" onClick={() => navigate("/register")}>
              Registrieren
            </span>
          </p>

        </div>
      </div>
    </>
  );
}
