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
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Lade Session…
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
