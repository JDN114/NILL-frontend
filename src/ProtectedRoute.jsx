// src/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, org, loading, isCompanyAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!org?.plan || org?.plan_status === "inactive" || org?.plan_status === "canceled") {
      navigate("/pricing", { replace: true });
      return;
    }

    if (!org?.name) {
      navigate("/onboarding", { replace: true });
      return;
    }

    // Kiosk-Gerät: dieses spezifische Gerät wurde als Station fixiert (localStorage-Flag)
    if (
      localStorage.getItem("nill_kiosk_device") === "1" &&
      !location.pathname.startsWith("/station")
    ) {
      navigate("/station", { replace: true });
      return;
    }
  }, [loading, user, org, navigate, location.pathname]);

  if (loading) return null;
  if (!user) return null;
  if (!org?.plan || org?.plan_status === "inactive" || org?.plan_status === "canceled") return null;
  if (!org?.name) return null;

  return <>{children}</>;
}
