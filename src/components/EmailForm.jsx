import React, { useState } from "react";
import { createEmail } from "../services/api";

export default function EmailForm({ onEmailCreated }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmail = await createEmail({ subject, body });
    onEmailCreated(newEmail);
    setSubject("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        placeholder="Betreff"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <textarea
        placeholder="Inhalt"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        E-Mail hinzufügen
      </button>
    </form>
  );
}
