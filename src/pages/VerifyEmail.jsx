import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3); // Sekunden bis Redirect

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Ungültiger oder fehlender Verifizierungslink.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const url = new URL(`${import.meta.env.VITE_API_URL}/auth/verify-email`);
        url.searchParams.set("token", token);

        const res = await fetch(url.toString(), { method: "GET" });
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.detail || "Verifizierung fehlgeschlagen.");
          return;
        }

        setStatus("success");
        setMessage("Deine E-Mail-Adresse wurde erfolgreich bestätigt 🎉");

        // Countdown für Auto-Redirect
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate("/login");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } catch (err) {
        setStatus("error");
        setMessage("Server nicht erreichbar.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">E-Mail wird bestätigt…</h1>
            <p className="text-gray-300">Bitte einen Moment Geduld.</p>
          </>
        );

      case "success":
        return (
          <>
            <h1 className="text-3xl font-bold text-green-400 mb-4">✔ Erfolgreich verifiziert</h1>
            <p className="text-gray-300 mb-2">{message}</p>
            <p className="text-gray-400 text-sm">Weiterleitung in {countdown}…</p>
            <Link
              to="/login"
              className="inline-block mt-6 bg-[var(--accent)] px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Jetzt einloggen
            </Link>
          </>
        );

      case "error":
        return (
          <>
            <h1 className="text-3xl font-bold text-red-400 mb-4">✖ Verifizierung fehlgeschlagen</h1>
            <p className="text-gray-300 mb-6">{message}</p>
            <Link
              to="/register"
              className="inline-block border border-[var(--accent)] text-[var(--accent)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent)] hover:text-white transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Zur Registrierung
            </Link>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#071023] to-[#03060a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-10 rounded-2xl shadow-xl text-center bg-black/40 backdrop-blur"
      >
        {renderContent()}
      </motion.div>
    </section>
  );
}
