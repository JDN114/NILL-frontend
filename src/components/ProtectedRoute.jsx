// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchMe } from "../services/auth";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");
  // loading | allowed | denied | error

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        await fetchMe();
        if (mounted) setStatus("allowed");
      } catch (err) {
        const code = err?.response?.status;

        // 🔐 Nur echte Auth-Fehler blockieren
        if (code === 401 || code === 403) {
          if (mounted) setStatus("denied");
        } else {
          console.error("Auth check failed:", err);
          if (mounted) setStatus("error");
        }
      }
    };

    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03060a]">
        <p className="text-gray-400 text-sm">
          Authentifizierung wird geprüft…
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03060a]">
        <p className="text-red-400 text-sm">
          Authentifizierungsdienst nicht erreichbar. Bitte später erneut versuchen.
        </p>
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
