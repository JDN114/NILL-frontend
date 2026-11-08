import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api from "../services/api";
import BrandMark from "../components/BrandMark";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (mounted) {
          setUser({
            id:       res.data.id,
            email:    res.data.email,
            role:     res.data.role,
            is_admin: res.data.is_admin,
            org_role: res.data.org_role ?? null,
          });
          setOrg(res.data.org ?? null);
        }
      } catch (err) {
        if (err?.response?.status !== 401) {
          console.error("auth/me failed:", err);
        }
        if (mounted) {
          setUser(null);
          setOrg(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadUser();
    return () => { mounted = false; };
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (_) { /* ignore */ }
    localStorage.removeItem("nill_imap_saved");
    setUser(null);
    setOrg(null);
  }, []);

  const updateOrg = useCallback((fields) =>
    setOrg(prev => ({ ...prev, ...fields })), []);

  const isSolo         = useCallback(() => org?.plan === "solo",             [org]);
  const isCompanyAdmin = useCallback(() => user?.role === "admin",           [user]);
  const isNillAdmin    = useCallback(() => user?.is_admin === true,          [user]);
  const hasModule      = useCallback((module) => org?.modules?.includes(module) ?? false, [org]);

  const isTrialActive  = useCallback(() => {
    if (org?.plan_status !== "trial") return false;
    if (!org?.trial_ends_at) return false;
    return new Date(org.trial_ends_at) > new Date();
  }, [org]);

  const trialDaysRemaining = useCallback(() => {
    if (!isTrialActive() || !org?.trial_ends_at) return 0;
    const ms = new Date(org.trial_ends_at) - new Date();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [org, isTrialActive]);

  const hasFeature = useCallback((feature) => {
    if (!user) return false;
    if (isCompanyAdmin() || isSolo()) return true;
    if (!user.org_role) return false;
    return user.org_role.permissions?.includes(feature) ?? false;
  }, [user, isCompanyAdmin, isSolo]);

  // useMemo MUST be before any early return (Rules of Hooks)
  const value = useMemo(() => ({
    user,
    org,
    loading,
    setUser,
    setOrg,
    logout,
    updateOrg,
    isSolo,
    isCompanyAdmin,
    isNillAdmin,
    hasModule,
    hasFeature,
    isTrialActive,
    trialDaysRemaining,
  }), [user, org, loading, logout, updateOrg, isSolo, isCompanyAdmin, isNillAdmin, hasModule, hasFeature, isTrialActive, trialDaysRemaining]);

  if (loading) {
    // Class-based like PageLoader: inline style={{}} literals are unreachable
    // for the light override, which made this full-screen gate flash near-black
    // on every cold start in light mode. Dark values render byte-identically.
    return (
      <div className="nill-session-loader" data-nill-loader="">
        <style>{`
          @keyframes nb-pulse{0%,100%{opacity:1}50%{opacity:.35}}
          @keyframes nb-bar{0%{transform:scaleX(0);opacity:1}80%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}
          @keyframes nb-dot{0%,80%,100%{transform:scale(.6);opacity:.3}40%{transform:scale(1);opacity:1}}

          .nill-session-loader{
            position:fixed; inset:0; background:#040407; z-index:9999;
            display:flex; flex-direction:column; align-items:center; justify-content:center;
          }
          .nill-session-loader .nsl-mark{
            margin-bottom:20px; animation:nb-pulse 2.4s ease-in-out infinite;
            color:var(--nill-mark-ink, #F2F2EE);
          }
          .nill-session-loader .nsl-word{
            font-family:Fraunces,serif; font-size:2.8rem; font-weight:700;
            color:#efede7; letter-spacing:-.02em; margin-bottom:40px;
            animation:nb-pulse 2.4s ease-in-out infinite;
          }
          .nill-session-loader .nsl-word span{ color:#c6ff3c; }
          .nill-session-loader .nsl-track{
            width:180px; height:2px; background:rgba(239,237,231,.08);
            border-radius:2px; overflow:hidden; margin-bottom:28px;
          }
          .nill-session-loader .nsl-bar{
            height:100%; background:#c6ff3c; border-radius:2px;
            transform-origin:left; animation:nb-bar 1.6s cubic-bezier(.4,0,.2,1) infinite;
          }
          .nill-session-loader .nsl-dots{ display:flex; gap:8px; margin-bottom:24px; }
          .nill-session-loader .nsl-dots i{
            width:5px; height:5px; border-radius:50%; background:#c6ff3c;
            animation:nb-dot 1.2s ease-in-out infinite;
          }
          .nill-session-loader .nsl-caption{
            color:rgba(155,152,144,.9); font-size:.72rem; letter-spacing:.08em;
            text-transform:uppercase; font-family:Inter,sans-serif;
          }

          html[data-theme="light"] .nill-session-loader{ background:#eae3d4; }
          html[data-theme="light"] .nill-session-loader .nsl-word{ color:#201d15; }
          html[data-theme="light"] .nill-session-loader .nsl-word span{ color:#556d00; }
          html[data-theme="light"] .nill-session-loader .nsl-bar,
          html[data-theme="light"] .nill-session-loader .nsl-dots i{ background:#556d00; }
          html[data-theme="light"] .nill-session-loader .nsl-track{ background:rgba(42,36,24,.10); }
          html[data-theme="light"] .nill-session-loader .nsl-caption{ color:rgba(32,29,21,.62); }
        `}</style>
        <BrandMark size={46} className="nsl-mark" />
        <div className="nsl-word">NILL<span>.</span></div>
        <div className="nsl-track"><div className="nsl-bar" /></div>
        <div className="nsl-dots">
          {[0,1,2].map(i => (
            <i key={i} style={{ animationDelay:`${i*0.2}s` }} />
          ))}
        </div>
        <div className="nsl-caption">Lade Session…</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
