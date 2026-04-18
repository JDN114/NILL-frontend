// src/components/EmailReplyModal.jsx
import React, { useState, useEffect, useRef } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";

/**
 * 🔒 Security-Konstanten
 */
const MAX_REPLY_LENGTH = 5000;

/**
 * 🔒 Sanitizer: entfernt HTML, Control-Chars, begrenzt Länge
 * Defense-in-Depth: schützt Mail, Logs, Backend & spätere Darstellung
 */
function sanitizeReply(text) {
  if (!text || typeof text !== "string") return "";

  // Entfernt HTML-Tags komplett
  const withoutHtml = text.replace(/<\/?[^>]+(>|$)/g, "");

  // Entfernt Control Characters (ASCII 0–31 & 127)
  const normalized = withoutHtml.replace(/[\u0000-\u001F\u007F]/g, "");

  return normalized.trim().slice(0, MAX_REPLY_LENGTH);
}

export default function EmailReplyModal({ emailId, open, onClose, onSent }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cc, setCc]               = useState("");
  const [showCc, setShowCc]       = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [templateId, setTemplateId]   = useState("Standard");
  const [files, setFiles]         = useState([]);
  const fileRef                   = useRef();

  /**
   * Reset beim Öffnen / Wechsel der E-Mail
   */
  useEffect(() => {
    if (open) {
      setBody("");
      setError(null);
      setLoading(false);
      setAiLoading(false);
    }
  }, [open, emailId]);

  if (!open) return null;

  /**
   * 🤖 KI-Antwort laden (AI = untrusted input!)
   */
  const handleAiReply = async () => {
    if (!emailId || aiLoading) return;

    try {
      setAiLoading(true);
      setError(null);

      const res = await api.post(
        `/gmail/emails/${emailId}/ai-reply`,
        null,
        {
          headers: {
            "X-CSRF-Token": localStorage.getItem("csrf_token") || "",
          },
        }
      );

      const safeReply = sanitizeReply(res.data?.reply || "");
      setBody(safeReply);
    } catch (err) {
      console.error("AI reply error:", err);
      setError("KI-Antwort konnte nicht geladen werden.");
    } finally {
      setAiLoading(false);
    }
  };

  /**
   * ✉️ Antwort senden
   */
  const handleSend = async () => {
    if (!emailId || loading) return;
    const safeBody = sanitizeReply(body);
    if (!safeBody) { setError("Antwort darf nicht leer sein."); return; }
    try {
      setLoading(true); setError(null);
      const fd = new FormData();
      fd.append("body", safeBody);
      if (showCc && cc) fd.append("cc", cc);
      fd.append("use_template", useTemplate);
      if (useTemplate) fd.append("template_id", templateId);
      files.forEach(f => fd.append("files", f));
      await api.post(`/gmail/emails/${emailId}/reply`, fd, {
        headers: {
          "Content-Type": files.length ? "multipart/form-data" : "application/json",
          "X-CSRF-Token": localStorage.getItem("csrf_token") || "",
        },
      });
      onSent?.(safeBody); setBody(""); onClose();
    } catch (err) {
      setError("Antwort konnte nicht gesendet werden.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal open={open} onClose={onClose} title="Antworten">
      <div className="space-y-4">
        {/* Fehleranzeige */}
        {error && (
          <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">
            {error}
          </div>
        )}

        {/* Textarea */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Schreibe deine Antwort hier..."
          rows={6}
          className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white resize-none"
          disabled={loading}
          autoFocus
        />

        {/* Zeichenlimit */}
        <div className="text-xs text-gray-400 text-right">
          {body.length}/{MAX_REPLY_LENGTH}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <button
            onClick={handleAiReply}
            disabled={aiLoading || !emailId}
            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded"
          >
            {aiLoading ? "KI denkt…" : "NILL antworten lassen"}
          </button>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onClose}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded"
            >
              Abbrechen
            </button>

            <button
              onClick={handleSend}
              disabled={loading || !body.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded"
            >
              {loading ? "Senden…" : "Senden"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
