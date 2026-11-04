// src/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, org, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Hand the blocked route to the login screen so a deep link survives the
      // detour (tapping an e-mail push lands on /dashboard/emails, not on the
      // dashboard). A query param — not router state — because the session can
      // also die across a full page load, which discards state.
      const target = location.pathname + location.search + location.hash;
      const next = target && target !== "/dashboard"
        ? `/login?next=${encodeURIComponent(target)}`
        : "/login";
      navigate(next, { replace: true });
      return;
    }

    const trialExpired =
      org?.plan_status === "trial" &&
      org?.trial_ends_at &&
      new Date(org.trial_ends_at) <= new Date();
    const planOk =
      org?.plan_status === "active" ||
      (org?.plan_status === "trial" && !trialExpired);
    if (!planOk || org?.plan_status === "canceled") {
      navigate(trialExpired ? "/pricing?trial_expired=1" : "/pricing", { replace: true });
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
  }, [loading, user, org, navigate, location.pathname, location.search, location.hash]);

  if (loading) return null;
  if (!user) return null;
  const _trialExpired =
    org?.plan_status === "trial" &&
    org?.trial_ends_at &&
    new Date(org.trial_ends_at) <= new Date();
  const _planOk = org?.plan_status === "active" || (org?.plan_status === "trial" && !_trialExpired);
  if (!_planOk || org?.plan_status === "canceled") return null;
  if (!org?.name) return null;

  return <>{children}</>;
}
