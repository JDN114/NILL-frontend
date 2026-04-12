// src/pages/InviteAcceptPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function InviteAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser, setOrg } = useAuth();

  const [invite, setInvite]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/team/invites/accept/${token}`);
        setInvite(res.data);
      } catch (err) {
        const detail = err.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Dieser Einladungslink ist ungültig oder abgelaufen.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleSubmit = async () => {
    if (!password) { setError("Bitte gib ein Passwort ein."); return; }
    if (password.length < 8) { setError("Passwort muss mindestens 8 Zeichen haben."); return; }
    if (password !== confirm) { setError("Passwörter stimmen nicht überein."); return; }

    setError("");
    setSubmitting(true);
    try {
      await api.post(`/team/invites/accept/${token}`, { password });
      await api.post("/auth/login", { email: invite.email, password });
      const me = await api.get("/auth/me", { withCredentials: true });
      setUser({ id: me.data.id, email: me.data.email, role: me.data.role, is_admin: me.data.is_admin, org_role: me.data.org_role ?? null });
      setOrg(me.data.org ?? null);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Fehler beim Erstellen des Accounts.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400">Lade Einladung…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">

        {success ? (
          /* Success State */
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" className="text-green-400">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 className="text-white text-xl font-semibold">
              Account erstellt!
            </h1>
            <p className="text-gray-400 text-sm">
              Du bist jetzt Teil von <span className="text-white font-medium">{invite?.org_name}</span>.
              Logge dich ein um loszulegen.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition"
            >
              Zum Login
            </button>
          </div>
        ) : error && !invite ? (
          /* Error State — ungültiger Link */
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" className="text-red-400">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1 className="text-white text-xl font-semibold">
              Link ungültig
            </h1>
            <p className="text-gray-400 text-sm">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition"
            >
              Zur Startseite
            </button>
          </div>
        ) : (
          /* Form State */
          <>
            <div>
              <h1 className="text-white text-2xl font-semibold mb-1">
                Einladung annehmen
              </h1>
              <p className="text-gray-400 text-sm">
                Du wurdest zu{" "}
                <span className="text-white font-medium">{invite?.org_name}</span>
                {invite?.role_name && (
                  <> als <span className="text-white font-medium">{invite.role_name}</span></>
                )} eingeladen.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 mb-0.5">E-Mail</p>
              <p className="text-white text-sm">{invite?.email}</p>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1 block">
                Passwort wählen
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1 block">
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Passwort wiederholen"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition disabled:opacity-50"
            >
              {submitting ? "Erstelle Account…" : "Account erstellen"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
