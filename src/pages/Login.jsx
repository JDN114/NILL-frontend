// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(email, password);

      if (res.access_token) {
        login(res.access_token);        // Token speichern
        navigate("/dashboard");         // Weiterleitung zum Dashboard
      } else {
        alert(res.detail || "Login fehlgeschlagen");
      }
    } catch (err) {
      console.error(err);
      alert("Serverfehler, bitte später erneut versuchen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-gray-50 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 bg-white"
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition"
          >
            {loading ? "Lädt..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Kein Konto?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Registrieren
          </a>
        </p>
      </div>
    </div>
  );
}
