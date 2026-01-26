// src/pages/ConnectEmail.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

export default function ConnectEmail() {
  const [form, setForm] = useState({
    email_address: "",
    imap_host: "",
    imap_port: 993,
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ----------------------------
  // VALIDIERUNG
  // ----------------------------
  const validateForm = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email_address.trim())) {
      setError("Bitte eine gültige E-Mail-Adresse eingeben.");
      return false;
    }
    if (!form.imap_host.trim()) {
      setError("IMAP-Host darf nicht leer sein.");
      return false;
    }
    const port = parseInt(form.imap_port, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      setError("Bitte einen gültigen IMAP-Port (1–65535) eingeben.");
      return false;
    }
    if (!form.password.trim()) {
      setError("Bitte Passwort/App-Passwort eingeben.");
      return false;
    }
    return true;
  };

  // ----------------------------
  // IMAP CONNECT
  // ----------------------------
  const connectImap = async () => {
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("/email-accounts/connect", {
        email_address: form.email_address.trim(),
        imap_host: form.imap_host.trim(),
        imap_port: parseInt(form.imap_port, 10),
        password: form.password
      });

      setSuccess("Postfach erfolgreich verbunden!");
      setForm((f) => ({ ...f, password: "" })); // Passwort sofort löschen
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Verbindung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // OAUTH LOGIN (Gmail / Outlook)
  // ----------------------------
  const startOAuth = async (provider) => {
    setError(null);
    setSuccess(null);

    try {
      // Anti-CSRF state token
      const state = crypto.randomUUID();
      sessionStorage.setItem("oauth_state", state);

      const res = await api.get("/email-accounts/oauth-url", {
        params: { provider, state }
      });

      if (!res.data?.url) throw new Error("OAuth URL fehlt");

      window.location.assign(res.data.url);
    } catch (err) {
      console.error(err);
      setError("OAuth Login fehlgeschlagen.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-3xl mx-auto text-white"
    >
      <h1 className="text-3xl font-bold mb-6">📨 Postfach verbinden</h1>

      {/* FEHLER / ERFOLG */}
      {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
      {success && <div className="mb-4 text-green-400 text-sm">{success}</div>}

      {/* OAuth */}
      <button
        onClick={() => startOAuth("gmail")}
        disabled={loading}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg mb-4 w-full disabled:opacity-50"
        aria-busy={loading}
      >
        Mit Gmail verbinden
      </button>

      <button
        onClick={() => startOAuth("outlook")}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg mb-4 w-full disabled:opacity-50"
        aria-busy={loading}
      >
        Mit Outlook verbinden
      </button>

      <div className="text-gray-400 text-center my-4">
        oder IMAP (nur wenn kein OAuth möglich)
      </div>

      {/* IMAP */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
        <label htmlFor="email_address" className="block mb-2 text-sm">E-Mail-Adresse</label>
        <input
          id="email_address"
          maxLength={320}
          className="bg-gray-800 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          placeholder="E-Mail-Adresse"
          value={form.email_address}
          onChange={(e) =>
            setForm({ ...form, email_address: e.target.value })
          }
        />

        <label htmlFor="imap_host" className="block mb-2 text-sm">IMAP Host</label>
        <input
          id="imap_host"
          maxLength={255}
          className="bg-gray-800 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          placeholder="IMAP Host"
          value={form.imap_host}
          onChange={(e) => setForm({ ...form, imap_host: e.target.value })}
        />

        <label htmlFor="imap_port" className="block mb-2 text-sm">IMAP Port</label>
        <input
          id="imap_port"
          type="number"
          min={1}
          max={65535}
          className="bg-gray-800 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          value={form.imap_port}
          onChange={(e) => setForm({ ...form, imap_port: parseInt(e.target.value, 10) })}
        />

        <label htmlFor="password" className="block mb-2 text-sm">App-Passwort</label>
        <input
          id="password"
          type="password"
          maxLength={128}
          className="bg-gray-800 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          placeholder="App-Passwort"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={connectImap}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg disabled:opacity-50"
          aria-busy={loading}
        >
          {loading ? "Verbinden…" : "Verbinden"}
        </button>
      </div>
    </motion.div>
  );
}
