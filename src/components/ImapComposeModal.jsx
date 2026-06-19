// src/components/ImapComposeModal.jsx
//
// Compose-Modal für IMAP-Provider (mit Account-Auswahl).
// Wird in EmailsPage gerendert wenn provider==='imap'.
//
// Stilistisch nahe an deinem bestehenden EmailComposeModal — Tailwind dark.
// Greift auf mailApi.sendEmailWithAttachments zurück, sodass das gleiche
// Backend-Pattern wie bei Gmail/Outlook verwendet wird.

import React, { useContext, useEffect, useState } from "react";
import { ImapContext } from "../context/ImapContext";
import { sendEmail, sendEmailWithAttachments } from "../services/mailApi";
import RecipientSuggestInput from "./RecipientSuggestInput";

const imapInput = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500";

export default function ImapComposeModal({ open, onClose, onSent }) {
  const imap = useContext(ImapContext);

  const [accountId, setAccountId] = useState(imap?.activeAccountId ?? null);
  const [to, setTo]               = useState("");
  const [subject, setSubject]     = useState("");
  const [body, setBody]           = useState("");
  const [cc, setCc]               = useState("");
  const [bcc, setBcc]             = useState("");
  const [files, setFiles]         = useState([]);
  const [busy, setBusy]           = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (open) {
      setAccountId(imap?.activeAccountId ?? null);
      setTo(""); setSubject(""); setBody(""); setCc(""); setBcc("");
      setFiles([]); setError(null);
    }
  }, [open, imap?.activeAccountId]);

  if (!open) return null;

  const accounts = imap?.accounts ?? [];

  const handleSend = async (e) => {
    e?.preventDefault?.();
    setError(null);
    if (!accountId) { setError("Kein Postfach ausgewählt."); return; }
    if (!to.trim()) { setError("Empfänger fehlt."); return; }

    setBusy(true);
    try {
      const payload = {
        to, subject, body,
        cc:  cc.trim()  ? cc.split(",").map(s => s.trim()).filter(Boolean) : null,
        bcc: bcc.trim() ? bcc.split(",").map(s => s.trim()).filter(Boolean) : null,
      };
      if (files.length > 0) {
        await sendEmailWithAttachments({
          provider: "imap", accountId, payload, files,
        });
      } else {
        await sendEmail({ provider: "imap", accountId, payload });
      }
      onSent?.();
      onClose?.();
    } catch (err) {
      console.error("[ImapCompose] send failed", err);
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
            <h2 className="text-lg font-bold text-white">E-Mail verfassen</h2>
            <button
              type="button" onClick={onClose}
              className="text-gray-400 hover:text-white transition"
              aria-label="Schließen"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {accounts.length > 1 && (
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Von</label>
              <select
                value={accountId ?? ""}
                onChange={e => setAccountId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.email}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-gray-400 text-xs mb-1 block">An</label>
            <RecipientSuggestInput
              value={to} onChange={setTo}
              placeholder="empfaenger@example.com"
              inputClassName={imapInput}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">CC</label>
              <RecipientSuggestInput
                value={cc} onChange={setCc}
                placeholder="komma-getrennt"
                inputClassName={imapInput}
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">BCC</label>
              <RecipientSuggestInput
                value={bcc} onChange={setBcc}
                placeholder="komma-getrennt"
                inputClassName={imapInput}
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Betreff</label>
            <input
              type="text" value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Nachricht (HTML erlaubt)</label>
            <textarea
              value={body} onChange={e => setBody(e.target.value)}
              rows={10}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500 font-mono"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Anhänge</label>
            <input
              type="file" multiple
              onChange={e => setFiles(Array.from(e.target.files ?? []))}
              className="text-xs text-gray-300"
            />
            {files.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{files.length} Datei(en) angehängt</p>
            )}
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
              {busy ? "Sende …" : "Senden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
