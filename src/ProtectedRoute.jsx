import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Nicht eingeloggt → zurück zum Login
    return <Navigate to="/login" replace />;
  }

  // Eingeloggt → Zugriff erlaubt
  return children;
}
