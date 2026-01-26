// src/components/AccountCard.jsx

import { useState } from "react";
import axios from "../utils/axios";
import { motion } from "framer-motion";

export default function AccountCard() {
  const [form, setForm] = useState({
    email_address: "",
    imap_host: "",
    imap_port: 993,
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* -----------------------------
   * Helpers
   * ----------------------------- */
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidHost = (host) =>
    /^[a-zA-Z0-9.-]+$/.test(host);

  /* -----------------------------
   * IMAP Connect
   * ----------------------------- */
  const connect = async () => {
    setError(null);

    if (!isValidEmail(form.email_address)) {
      return setError("Ungültige Email-Adresse");
    }

    if (!isValidHost(form.imap_host)) {
      return setError("Ungültiger IMAP Host");
    }

    if (form.imap_port < 1 || form.imap_port > 65535) {
      return setError("Ungültiger IMAP Port");
    }

    if (!form.password) {
      return setError("Passwort fehlt");
    }

    setLoading(true);

    try {
      await axios.post("/email-accounts/connect", {
        ...form,
        provider: "imap"
      });

      alert("Postfach erfolgreich verbunden");

      // Passwort direkt aus dem State entfernen
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error(err);
      setError("Fehler beim Verbinden des Postfachs");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
   * OAuth (Backend sollte state erzeugen!)
   * ----------------------------- */
  const gmailLogin = () => {
    window.location.href =
      `${process.env.REACT_APP_BACKEND_URL}/email-accounts/gmail/auth`;
  };

  const outlookLogin = () => {
    window.location.href =
      `${process.env.REACT_APP_BACKEND_URL}/email-accounts/outlook/auth`;
  };

  /* -----------------------------
   * UI
   * ----------------------------- */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-3xl mx-auto text-white"
    >
      <h1 className="text-3xl font-bold mb-6">📨 Postfach verbinden</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-600 rounded">
          {error}
        </div>
      )}

      {/* Gmail */}
      <button
        onClick={gmailLogin}
        className="bg-red-600 px-4 py-2 rounded-lg mb-4 w-full"
      >
        Mit Gmail verbinden
      </button>

      {/* Outlook */}
      <button
        onClick={outlookLogin}
        className="bg-blue-600 px-4 py-2 rounded-lg mb-6 w-full"
      >
        Mit Outlook verbinden
      </button>

      {/* Separator */}
      <div className="text-gray-400 text-center my-4">
        oder ein IMAP Postfach hinzufügen
      </div>

      {/* Custom IMAP */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
        <input
          className="bg-gray-800 p-2 rounded w-full mb-3"
          placeholder="Email-Adresse"
          value={form.email_address}
          onChange={(e) =>
            setForm({ ...form, email_address: e.target.value.trim() })
          }
        />

        <input
          className="bg-gray-800 p-2 rounded w-full mb-3"
          placeholder="IMAP Host (z.B. imap.ionos.de)"
          value={form.imap_host}
          onChange={(e) =>
            setForm({ ...form, imap_host: e.target.value.trim() })
          }
        />

        <input
          className="bg-gray-800 p-2 rounded w-full mb-3"
          placeholder="IMAP Port (Standard: 993)"
          type="number"
          value={form.imap_port}
          onChange={(e) =>
            setForm({ ...form, imap_port: Number(e.target.value) })
          }
        />

        <input
          className="bg-gray-800 p-2 rounded w-full mb-4"
          placeholder="Passwort / App Passwort"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          className="w-full bg-green-600 py-2 rounded-lg disabled:opacity-50"
          onClick={connect}
          disabled={loading}
        >
          {loading ? "Verbinde…" : "Verbinden"}
        </button>
      </div>
    </motion.div>
  );
}
