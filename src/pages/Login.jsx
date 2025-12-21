import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API Call an Backend
      const res = await loginUser(form.email, form.password);
      console.log("Login erfolgreich:", res);

      // Token wird von loginUser bereits unter 'access_token' gespeichert
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token wurde nicht gespeichert.");

      navigate("/dashboard"); // Weiterleitung nach Login
    } catch (error) {
      console.error("Login Error:", error);
      alert(
        error.response?.data?.detail ||
          "Login fehlgeschlagen. Bitte prüfe deine Eingaben."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#071023] to-[#03060a] opacity-90"></div>
      <div className="glass relative z-10 w-full max-w-md p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-lg disabled:opacity-50"
          >
            {loading ? "Lade..." : "Einloggen"}
          </button>
        </form>
        <p className="text-gray-300 mt-4 text-center text-sm">
          Noch kein Konto?{" "}
          <Link to="/register" className="text-[var(--accent)] underline">
            Registrieren
          </Link>
        </p>
      </div>
    </section>
  );
}
