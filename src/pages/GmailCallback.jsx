// src/pages/GmailCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GmailCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "error"
  const [message, setMessage] = useState("Verarbeite Google Login…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const returnedState = params.get("state");
    const savedState = sessionStorage.getItem("oauth_state");

    // -------------------------------
    // 1️⃣ Validierung
    // -------------------------------
    if (!code) {
      setStatus("error");
      setMessage("Kein Auth-Code erhalten.");
      setTimeout(() => navigate("/dashboard?error=no_code"), 2000);
      return;
    }

    if (!returnedState || returnedState !== savedState) {
      setStatus("error");
      setMessage("Ungültiger OAuth-State. Bitte erneut versuchen.");
      setTimeout(() => navigate("/dashboard?error=invalid_state"), 2000);
      return;
    }

    // -------------------------------
    // 2️⃣ Backend Callback
    // -------------------------------
    const callbackUrl = `${import.meta.env.VITE_API_URL}/gmail/callback?code=${encodeURIComponent(
      code
    )}&state=${encodeURIComponent(returnedState)}`;

    try {
      window.location.href = callbackUrl;
    } catch (err) {
      console.error("Fehler beim Redirect zum Backend:", err);
      setStatus("error");
      setMessage("Fehler beim Google Login.");
      setTimeout(() => navigate("/dashboard?error=callback_failed"), 2000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-300 px-4">
      {status === "loading" && (
        <>
          <p className="mb-2">{message}</p>
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin" />
        </>
      )}

      {status === "error" && <p className="text-red-500">{message}</p>}
    </div>
  );
}
