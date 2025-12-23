import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Login fehlgeschlagen. Bitte überprüfe deine Daten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-xl p-8 shadow-xl border border-gray-800">
        
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-center mb-2">
          NILL
        </h1>
        <p className="text-center text-[var(--text-muted)] mb-8">
          Willkommen zurück
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-muted)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-transparent border border-gray-700 px-4 py-2 focus:outline-none focus:border-[var(--nill-primary)]"
              placeholder="you@nill.ai"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--text-muted)]">
              Passwort
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-transparent border border-gray-700 px-4 py-2 focus:outline-none focus:border-[var(--nill-primary)]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--nill-primary)] hover:opacity-90 transition px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Anmelden…" : "Login"}
          </button>
        </form>

        <p className="text-xs text-center text-[var(--text-muted)] mt-6">
          © {new Date().getFullYear()} NILL
        </p>
      </div>
    </div>
  );
}
