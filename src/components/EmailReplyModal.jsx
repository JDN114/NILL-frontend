import { useState } from "react";
import { FiX } from "react-icons/fi";
import * as api from "../services/api";

export default function EmailReplyModal({ email, onClose, onSent }) {
  const [body, setBody] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [sending, setSending] = useState(false);

  const handleAIReply = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.post(`/gmail/emails/${email.id}/ai-reply`);
      setBody(res.data.reply);
    } catch (e) {
      console.error("AI reply failed", e);
      alert("KI konnte keine Antwort generieren");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSend = async () => {
    if (!body.trim()) return;
    setSending(true);
    try {
      await axios.post(`/gmail/emails/${email.id}/reply`, { body });
      alert("Antwort gesendet!");
      onSent();
      onClose();
    } catch (e) {
      console.error("Send failed", e);
      alert("Senden fehlgeschlagen");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl p-6 relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FiX size={20} />
        </button>

        <h3 className="text-xl font-bold mb-4">Antworten an {email.from}</h3>

        <textarea
          className="w-full h-48 p-3 bg-gray-800 text-white rounded resize-none focus:outline-none focus:ring focus:ring-blue-500"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={handleAIReply}
            disabled={loadingAI}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
          >
            {loadingAI ? "KI generiert…" : "NILL Antworten lassen"}
          </button>

          <button
            onClick={handleSend}
            disabled={sending || !body.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
          >
            {sending ? "Senden…" : "Senden"}
          </button>
        </div>
      </div>
    </div>
  );
}
