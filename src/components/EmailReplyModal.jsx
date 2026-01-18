import React, { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";

export default function EmailReplyModal({ emailId, open, onClose }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (open) setBody(""); // Reset beim Öffnen
  }, [open]);

  const fetchAiReply = async () => {
    if (!emailId) return;
    setAiLoading(true);
    try {
      const res = await api.post(`/emails/${emailId}/ai-reply`);
      setBody(res.reply || "");
    } catch (e) {
      console.error("AI Reply failed", e);
    } finally {
      setAiLoading(false);
    }
  };

  const sendReply = async () => {
    if (!emailId || !body.trim()) return;
    setLoading(true);
    try {
      await api.post(`/emails/${emailId}/reply`, { body });
      onClose();
    } catch (e) {
      console.error("Send Reply failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Antworten">
      <div className="space-y-2">
        <textarea
          className="w-full h-40 p-2 bg-gray-900 text-white rounded"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ihre Antwort hier…"
        />

        <div className="flex justify-between items-center mt-2">
          <button
            onClick={fetchAiReply}
            disabled={aiLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          >
            {aiLoading ? "KI antwortet…" : "NILL Antwort vorschlagen"}
          </button>

          <button
            onClick={sendReply}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            {loading ? "Senden…" : "Senden"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
