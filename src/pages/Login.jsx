import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5"
      >
        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="E-Mail"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Passwort"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Anmelden..." : "Login"}
        </button>
      </form>
    </div>
  );
}
