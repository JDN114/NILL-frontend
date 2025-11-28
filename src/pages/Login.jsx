import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  // Update input fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login-Form abgeschickt:", form); // Debug: Formdaten prüfen

    // Einfache Validierung
    if (form.email && form.password) {
      console.log("Navigieren zum Dashboard"); // Debug: Navigation wird aufgerufen
      // Hier würdest du später die Authentifizierung einbauen
      navigate("/dashboard"); // Weiterleitung zum Dashboard
    } else {
      alert("Bitte Email und Passwort eingeben");
    }
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
          {/* E-Mail */}
          <div>
            <label className="block text-gray-200 mb-1 text-sm">E-Mail Adresse</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-[var(--accent)] outline-none"
            />
          </div>

          {/* Passwort */}
          <div>
            <label className="block text-gray-200 mb-1 text-sm">Passwort</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-[var(--accent)] outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition"
          >
            Einloggen
          </button>
        </form>
      </motion.div>
    </section>
  );
}
