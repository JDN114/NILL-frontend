import { useState, useEffect, useMemo } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";

export default function EmailComposeModal({ open, onClose }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setTo("");
      setSubject("");
      setBody("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  // ✅ STABIL & RENDER-SAFE
  const toTrim = useMemo(() => (to || "").trim(), [to]);
  const subjectTrim = useMemo(() => (subject || "").trim(), [subject]);
  const bodyTrim = useMemo(() => (body || "").trim(), [body]);

  const handleSend = async () => {
    if (!toTrim || !bodyTrim || loading) return;

    try {
      setLoading(true);
      setError(null);

      await api.post("/gmail/send", {
        to: toTrim,
        subject: subjectTrim,
        body: bodyTrim,
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "E-Mail konnte nicht gesendet werden."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Neue E-Mail">
      <div className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">
            {error}
          </div>
        )}

        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="An"
          className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
        />

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Betreff"
          className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Nachricht schreiben…"
          rows={8}
          className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white resize-none"
          disabled={loading}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded"
          >
            Abbrechen
          </button>

          <button
            onClick={handleSend}
            disabled={loading || !toTrim || !bodyTrim}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded"
          >
            {loading ? "Senden…" : "Senden"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
