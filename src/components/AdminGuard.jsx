// src/components/AdminGuard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminGuard({ children }) {
  const { isCompanyAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isCompanyAdmin()) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, isCompanyAdmin, navigate]);

  if (loading) return null;
  if (!isCompanyAdmin()) return null;

  return <>{children}</>;
}
