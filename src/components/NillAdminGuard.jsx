// src/components/NillAdminGuard.jsx
// Guard for NILL superadmin-only routes (e.g. /admin).
// Distinct from AdminGuard (company admin) — this checks the platform-level
// is_admin flag via isNillAdmin().
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function NillAdminGuard({ children }) {
  const { isNillAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isNillAdmin()) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, isNillAdmin, navigate]);

  if (loading) return null;
  if (!isNillAdmin()) return null;

  return <>{children}</>;
}
