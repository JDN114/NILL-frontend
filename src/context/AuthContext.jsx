import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

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
        console.log("auth/me response:", JSON.stringify(res.data, null, 2));
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
        console.error("auth/me failed:", err);
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

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (_) {}
    localStorage.removeItem("access_token");
    setUser(null);
    setOrg(null);
  };

  const updateOrg = (fields) =>
    setOrg(prev => ({ ...prev, ...fields }));

  const isSolo         = () => org?.plan === "solo";
  const isCompanyAdmin = () => user?.role === "admin";
  const isNillAdmin    = () => user?.is_admin === true;
  const hasModule      = (module) => org?.modules?.includes(module) ?? false;

  const hasFeature = (feature) => {
    if (!user) return false;
    if (isCompanyAdmin() || isSolo()) return true;
    if (!user.org_role) return false;
    return user.org_role.permissions?.includes(feature) ?? false;
  };

  if (loading) {
    return (
      <div style={{
        position:"fixed", inset:0, background:"#040407",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        zIndex:9999,
      }}>
        <style>{`
          @keyframes nb-pulse{0%,100%{opacity:1}50%{opacity:.35}}
          @keyframes nb-bar{0%{transform:scaleX(0);opacity:1}80%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}
          @keyframes nb-dot{0%,80%,100%{transform:scale(.6);opacity:.3}40%{transform:scale(1);opacity:1}}
        `}</style>
        <div style={{
          fontFamily:"Fraunces,serif", fontSize:"2.8rem", fontWeight:700,
          color:"#efede7", letterSpacing:"-.02em", marginBottom:40,
          animation:"nb-pulse 2.4s ease-in-out infinite",
        }}>
          NILL<span style={{color:"#c6ff3c"}}>.</span>
        </div>
        <div style={{
          width:180, height:2, background:"rgba(239,237,231,.08)",
          borderRadius:2, overflow:"hidden", marginBottom:28,
        }}>
          <div style={{
            height:"100%", background:"#c6ff3c", borderRadius:2,
            transformOrigin:"left",
            animation:"nb-bar 1.6s cubic-bezier(.4,0,.2,1) infinite",
          }}/>
        </div>
        <div style={{display:"flex", gap:8, marginBottom:24}}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:5, height:5, borderRadius:"50%", background:"#c6ff3c",
              animation:`nb-dot 1.2s ease-in-out ${i*0.2}s infinite`,
            }}/>
          ))}
        </div>
        <div style={{
          color:"rgba(155,152,144,.6)", fontSize:".72rem",
          letterSpacing:".08em", textTransform:"uppercase",
          fontFamily:"Inter,sans-serif",
        }}>
          Lade Session…
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
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
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
