import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  // ⏳ Während Auth-Status noch geladen wird → nichts rendern
  if (loading) {
    return null; // oder <Spinner />
  }

  // ❌ Nicht eingeloggt → Redirect läuft bereits
  if (!user) {
    return null;
  }

  // ✅ Eingeloggt → Zugriff erlaubt
  return <>{children}</>;
}
