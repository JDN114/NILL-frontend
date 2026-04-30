// src/components/ImapReplyModal.jsx
//
// Reply-Modal für IMAP-Mails. Unterstützt:
//   - manuelle Antwort (Body, CC, Anhänge)
//   - "KI-Antwort generieren" Button — füllt Body via /imap/.../ai-reply

import React, { useEffect, useState } from "react";
import { aiReply, replyToEmail } from "../services/mailApi";

export default function ImapReplyModal({ open, onClose, emailId, onSent }) {
  const [body, setBody]         = useState("");
  const [cc, setCc]             = useState("");
  const [files, setFiles]       = useState([]);
  const [busy, setBusy]         = useState(false);
  const [aiBusy, setAiBusy]     = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (open) {
      setBody(""); setCc(""); setFiles([]); setError(null);
    }
  }, [open, emailId]);

  if (!open || !emailId) return null;

  const handleAiReply = async () => {
    setAiBusy(true);
    setError(null);
    try {
      const text = await aiReply({ provider: "imap", emailId });
      setBody(text);
    } catch (err) {
      console.error("[ImapReply] ai-reply failed", err);
      setError("KI-Antwort fehlgeschlagen.");
    } finally {
      setAiBusy(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!body.trim()) { setError("Antwort darf nicht leer sein."); return; }
    setBusy(true); setError(null);
    try {
      await replyToEmail({
        provider: "imap",
        emailId,
        body,
        cc: cc.trim() || undefined,
        files,
      });
      onSent?.();
      onClose?.();
    } catch (err) {
      console.error("[ImapReply] send failed", err);
      setError(err?.response?.data?.detail ?? "Senden fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Antworten</h2>
            <button
              type="button" onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-gray-400 text-xs">Nachricht (HTML erlaubt)</label>
              <button
                type="button" onClick={handleAiReply} disabled={aiBusy}
                className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition disabled:opacity-50"
              >
                {aiBusy ? "KI denkt …" : "✨ KI-Antwort generieren"}
              </button>
            </div>
            <textarea
              value={body} onChange={e => setBody(e.target.value)}
              rows={12}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500 font-mono"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">CC <span className="text-gray-600">(optional)</span></label>
            <input
              type="text" value={cc} onChange={e => setCc(e.target.value)}
              placeholder="komma-getrennt"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Anhänge</label>
            <input
              type="file" multiple
              onChange={e => setFiles(Array.from(e.target.files ?? []))}
              className="text-xs text-gray-300"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
              {String(error)}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition text-sm"
            >
              Abbrechen
            </button>
            <button
              type="submit" disabled={busy}
              className="px-5 py-2.5 rounded-xl bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition text-sm disabled:opacity-50"
            >
              {busy ? "Sende …" : "Antwort senden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
