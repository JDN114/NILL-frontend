import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Frontend Validierung
  // -----------------------------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_PASSWORD_LENGTH = 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔒 Validierung
    if (!email || !password || !repeatPassword) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`);
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Sicheres Backend-API-Call
      await api.post("/auth/register", { email, password });
      setSuccess(true);
    } catch (err) {
      console.error("Registration error:", err);
      // Einheitliche Meldung, kein Hinweis auf User-Enumeration
      setError(err.response?.data?.message || "Registrierung fehlgeschlagen. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Success UI
  // -----------------------------
  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-gray-800 p-8 rounded-2xl shadow-lg space-y-4">
          <h1 className="text-2xl font-bold text-green-500">
            Registrierung erfolgreich 🎉
          </h1>
          <p className="text-gray-300 text-sm">
            Wir haben dir eine E-Mail zur Bestätigung gesendet.
            <br />
            Bitte bestätige deine Adresse, bevor du dich einloggst.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="inline-block mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Zum Login
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Registration Form
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-white">Registrieren</h1>

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="new-password"
          required
        />

        <input
          type="password"
          placeholder="Passwort wiederholen"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="new-password"
          required
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-teal-500 hover:to-green-500 transition-colors disabled:opacity-50`}
        >
          {loading ? "Registriere..." : "Registrieren"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Bereits registriert?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
