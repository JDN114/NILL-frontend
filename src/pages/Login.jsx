import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // hier später API Login
    localStorage.setItem("auth", "true");

    navigate("/dashboard");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#071023] to-[#03060a] opacity-90"></div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass relative z-10 w-full max-w-md p-10 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
        <p className="text-gray-300 mb-8">
          Willkommen zurück — melde dich bei deinem NILL-Konto an.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-gray-200 mb-1 text-sm">
              E-Mail Adresse
            </label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-[var(--accent)] outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-gray-200 mb-1 text-sm">
              Passwort
            </label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-[var(--accent)] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[var(--accent)] py-3 rounded-lg font-semibold text-white hover:opacity-90 transition"
          >
            Einloggen
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Noch kein Konto?{" "}
          <Link to="/register" className="text-[var(--accent)] hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
