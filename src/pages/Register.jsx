import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-green-500">
            Registrierung erfolgreich 🎉
          </h1>
          <p className="mt-4 text-gray-300">
            Wir haben dir eine E-Mail zur Bestätigung gesendet.
            <br />
            Bitte bestätige deine Adresse, bevor du dich einloggst.
          </p>
          <Link
            to="/login"
            className="inline-block mt-6 text-blue-400 hover:underline"
          >
            Zum Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5"
      >
        <h1 className="text-3xl font-bold text-center">
          Registrieren
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

        <input
          type="password"
          placeholder="Passwort wiederholen"
          required
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registriere..." : "Registrieren"}
        </button>

        <p className="text-center text-sm">
          Bereits registriert?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
