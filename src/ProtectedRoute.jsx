// src/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, org, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // 1. nicht eingeloggt
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // 2. kein aktiver Plan
    if (!org?.plan || org?.plan_status === "inactive" || org?.plan_status === "canceled") {
      navigate("/pricing", { replace: true });
      return;
    }

    // 3. kein Unternehmensname → Onboarding
    if (!org?.name) {
      navigate("/onboarding", { replace: true });
      return;
    }
  }, [loading, user, org, navigate]);

  if (loading) return null;
  if (!user) return null;
  if (!org?.plan || org?.plan_status === "inactive" || org?.plan_status === "canceled") return null;
  if (!org?.name) return null;

  return <>{children}</>;
}
