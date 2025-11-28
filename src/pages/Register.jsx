import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Register:", form);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hintergrund */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#071023] to-[#03060a] opacity-90"></div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass relative z-10 w-full max-w-md p-10 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-6">
          Account erstellen
        </h1>
        <p className="text-gray-300 mb-8">
          Starte kostenlos mit NILL — keine Kreditkarte nötig.
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

          {/* SUBMIT */}
          <button
            type="submit"
            className="btn-primary w-full py-3 rounded-lg font-semibold shadow-lg flex justify-center"
          >
            Kostenlos registrieren
          </button>

          <p className="text-center text-gray-400 text-sm">
            Schon einen Account?{" "}
            <a
              href="/login"
              className="text-[var(--accent)] font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </section>
  );
}
