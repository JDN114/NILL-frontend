// src/components/EmailReplyModal.jsx
import React, { useState } from "react";
import Modal from "./ui/Modal"; // dein bestehendes Modal
import api from "../services/api";

export default function EmailReplyModal({ emailId, open, onClose }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- KI-Vorschlag laden ---
  const handleAiReply = async () => {
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
    if (!body.trim()) return;
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

  if (!open) return null;

  return (
    <Modal onClose={onClose} title="Antworten">
      <div className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Schreibe deine Antwort hier..."
          rows={6}
        />

        <div className="flex justify-between items-center">
          <Button
            onClick={handleAiReply}
            disabled={aiLoading}
            variant="secondary"
          >
            {aiLoading ? "Lädt KI..." : "NILL Antworten lassen"}
          </Button>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="secondary">
              Abbrechen
            </Button>
            <Button onClick={handleSend} disabled={loading}>
              {loading ? "Senden..." : "Senden"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
