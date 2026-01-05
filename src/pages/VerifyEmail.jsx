// frontend/src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Ungültiger oder fehlender Verifizierungslink.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.detail || "Verifizierung fehlgeschlagen.");
          return;
        }

        setStatus("success");
        setMessage("Deine E-Mail-Adresse wurde erfolgreich bestätigt 🎉");
      } catch (err) {
        setStatus("error");
        setMessage("Server nicht erreichbar.");
      }
    };

    verify();
  }, [token]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#071023] to-[#03060a] opacity-90" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass relative z-10 w-full max-w-md p-10 rounded-2xl shadow-xl text-center"
      >
        {/* LOADING */}
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">
              E-Mail wird bestätigt…
            </h1>
            <p className="text-gray-300">
              Bitte einen Moment Geduld.
            </p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <h1 className="text-3xl font-bold text-white mb-4">
              ✔ Erfolgreich verifiziert
            </h1>
            <p className="text-gray-300 mb-6">{message}</p>

            <Link
              to="/login"
              className="inline-block bg-[var(--accent)] px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition"
            >
              Jetzt einloggen
            </Link>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              ✖ Verifizierung fehlgeschlagen
            </h1>
            <p className="text-gray-300 mb-6">{message}</p>

            <Link
              to="/register"
              className="inline-block border border-[var(--accent)] text-[var(--accent)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent)] hover:text-white transition"
            >
              Zur Registrierung
            </Link>
          </>
        )}
      </motion.div>
    </section>
  );
}
