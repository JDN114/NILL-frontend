// src/components/ContactForm.jsx
import React, { useState } from "react";
import api from "../services/api";

/**
 * 🔒 Security Limits
 */
const MAX_MESSAGE_LENGTH = 3000;
const MAX_EMAIL_LENGTH = 254;

/**
 * 🔒 Email Validation (RFC-light, frontend-only)
 */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * 🔒 Input Sanitizer
 * Entfernt HTML, Control-Chars, trimmt & begrenzt Länge
 */
function sanitizeInput(text, maxLength) {
  if (!text || typeof text !== "string") return "";

  const withoutHtml = text.replace(/<\/?[^>]+(>|$)/g, "");
  const withoutControlChars = withoutHtml.replace(
    /[\u0000-\u001F\u007F]/g,
    ""
  );

  return withoutControlChars.trim().slice(0, maxLength);
}

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(null); // null | success | error
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);

    // 🔒 Sanitize Inputs
    const safeEmail = sanitizeInput(email, MAX_EMAIL_LENGTH);
    const safeMessage = sanitizeInput(msg, MAX_MESSAGE_LENGTH);

    // 🔒 Validation
    if (!isValidEmail(safeEmail)) {
      setStatus("error");
      return;
    }

    if (!safeMessage) {
      setStatus("error");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/api/contact",
        {
          email: safeEmail,
          message: safeMessage,
        },
        {
          timeout: 10000, // 🔒 verhindert Hängenbleiben
        }
      );

      setStatus("success");
      setEmail("");
      setMsg("");
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto space-y-3">
      <input
        type="email"
        required
        maxLength={MAX_EMAIL_LENGTH}
        placeholder="Ihre E-Mail"
        className="w-full p-3 rounded-lg bg-[#0b1220] border border-white/5 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <textarea
        rows={5}
        required
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder="Nachricht"
        className="w-full p-3 rounded-lg bg-[#0b1220] border border-white/5 text-white resize-none"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />

      <div className="text-xs text-gray-400 text-right">
        {msg.length}/{MAX_MESSAGE_LENGTH}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded bg-[var(--brand)] text-white disabled:opacity-50"
      >
        {loading ? "Senden…" : "Senden"}
      </button>

      {status === "success" && (
        <p className="mt-3 text-green-400">
          Danke — wir melden uns zeitnah.
        </p>
      )}

      {status === "error" && (
        <p className="mt-3 text-red-400">
          Fehler beim Senden. Bitte prüfen Sie Ihre Eingaben.
        </p>
      )}
    </form>
  );
}
