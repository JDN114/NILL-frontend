import React, { useState } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";

export default function EmailReplyModal({ emailId, open, onClose }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null; // nur auf open prüfen

  // --- KI-Vorschlag laden ---
  const handleAiReply = async () => {
    if (!emailId) return;
    try {
      setAiLoading(true);
      setError(null);
      const res = await api.post(`/gmail/emails/${emailId}/ai-reply`);
      setBody(res.data.reply || "");
    } catch (err) {
      console.error(err);
      setError("KI-Antwort konnte nicht geladen werden.");
    } finally {
      setAiLoading(false);
    }
  };

  // --- Email senden ---
  const handleSend = async () => {
    if (!emailId || !body.trim()) return;
    try {
      setLoading(true);
      setError(null);
      await api.post(`/gmail/emails/${emailId}/reply`, { body });
      setBody("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Antwort konnte nicht gesendet werden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Antworten">
      <div className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Schreibe deine Antwort hier..."
          rows={6}
          className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white"
        />

        <div className="flex justify-between items-center">
          <button
            onClick={handleAiReply}
            disabled={aiLoading}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            {aiLoading ? "Lädt KI..." : "NILL Antworten lassen"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {loading ? "Senden..." : "Senden"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
