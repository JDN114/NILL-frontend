import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Form abgeschickt …", form);

    // --- FAKE LOGIN ---
    // später ersetzt du das durch deinen Backend-Call
    localStorage.setItem("token", "TEST_TOKEN");

    alert("Login erfolgreich!");

    // --- NAVIGATION ---
    navigate("/dashboard", { replace: true });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#071023] to-[#03060a] opacity-90" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass relative z-10 w-full max-w-md p-10 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-200 mb-1 text-sm">E-Mail</label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white
                         focus:border-[var(--accent)] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1 text-sm">Passwort</label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white
                         focus:border-[var(--accent)] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-lg mt-4"
          >
            Einloggen
          </button>
        </form>
      </motion.div>
    </section>
  );
}
