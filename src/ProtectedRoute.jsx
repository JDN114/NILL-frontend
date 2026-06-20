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

    const planOk =
      org?.plan_status === "active" ||
      (org?.plan_status === "trial" && org?.trial_ends_at && new Date(org.trial_ends_at) > new Date());
    if (!planOk || org?.plan_status === "canceled") {
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
  const _planOk =
    org?.plan_status === "active" ||
    (org?.plan_status === "trial" && org?.trial_ends_at && new Date(org.trial_ends_at) > new Date());
  if (!_planOk || org?.plan_status === "canceled") return null;
  if (!org?.name) return null;

  return <>{children}</>;
}
