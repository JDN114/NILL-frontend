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

    // Station-Modus: Nicht-Admins werden automatisch zur ArbeitsStation geleitet
    if (
      org.station_mode_enabled &&
      !isCompanyAdmin() &&
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
