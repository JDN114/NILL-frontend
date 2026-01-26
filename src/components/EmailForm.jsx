import React, { useState } from "react";
import { createEmail } from "../services/api";

export default function EmailForm({ onEmailCreated }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectTrim = subject.trim();
    const bodyTrim = body.trim();

    if (!subjectTrim || !bodyTrim) return;

    try {
      setLoading(true);
      setError(null);

      const newEmail = await createEmail({
        subject: subjectTrim,
        body: bodyTrim,
      });

      onEmailCreated(newEmail);
      setSubject("");
      setBody("");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Fehler beim Hinzufügen der E-Mail."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && (
        <p className="text-red-500 mb-2 text-sm bg-red-500/10 p-2 rounded">
          {error}
        </p>
      )}
      <input
        type="text"
        placeholder="Betreff"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
        disabled={loading}
      />
      <textarea
        placeholder="Inhalt"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Hinzufügen…" : "E-Mail hinzufügen"}
      </button>
    </form>
  );
}
