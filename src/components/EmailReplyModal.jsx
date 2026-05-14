import React, { useState, useEffect, useRef } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";
import EmailTemplatePicker from "./EmailTemplatePicker";

const MAX_LENGTH = 5000;
const TEMPLATES = ["Standard", "Newsletter", "Angebot", "Support"];

function sanitizeReply(text) {
  if (!text || typeof text !== "string") return "";
  return text.replace(/<\/?[^>]+(>|$)/g, "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, MAX_LENGTH);
}

const inputCls = [
  "w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none transition-all",
  "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]",
  "placeholder:text-slate-600",
  "focus:bg-[rgba(255,255,255,0.06)] focus:border-[rgba(197,165,114,0.4)]",
].join(" ");

function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={onChange}>
      <div className={`relative w-8 h-5 rounded-full border transition-all flex-shrink-0 ${checked ? "bg-[rgba(197,165,114,0.2)] border-[rgba(197,165,114,0.4)]" : "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]"}`}>
        <span className={`absolute top-0.5 w-3 h-3 rounded-full transition-transform ${checked ? "translate-x-3.5 bg-[#C5A572]" : "translate-x-0.5 bg-slate-500"}`} />
      </div>
      <span className="text-xs text-slate-500 select-none">{label}</span>
    </div>
  );
}

const AI_BADGE = {
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "1px 7px", borderRadius: 99,
  fontSize: 10, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.12em",
  background: "rgba(122,92,255,0.12)", border: "1px solid rgba(122,92,255,0.28)",
  color: "rgba(122,92,255,0.85)", userSelect: "none",
};

export default function EmailReplyModal({ emailId, open, onClose, onSent }) {
  const [body, setBody]               = useState("");
  const [loading, setLoading]         = useState(false);
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [error, setError]             = useState(null);
  const [cc, setCc]                   = useState("");
  const [showCc, setShowCc]           = useState(false);
  const [templateId, setTemplateId]   = useState(null);
  const [files, setFiles]             = useState([]);
  const fileRef                       = useRef();

  useEffect(() => {
    if (open) {
      setBody(""); setError(null); setLoading(false);
      setAiLoading(false); setAiGenerated(false);
      setCc(""); setShowCc(false); setFiles([]);
    }
  }, [open, emailId]);

  if (!open) return null;

  const handleAiReply = async () => {
    if (!emailId || aiLoading) return;
    try {
      setAiLoading(true); setError(null);
      const res = await api.post(`/gmail/emails/${emailId}/ai-reply`, null);
      setBody(sanitizeReply(res.data?.reply || ""));
      setAiGenerated(true);
    } catch {
      setError("KI-Antwort konnte nicht geladen werden.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSend = async () => {
    if (!emailId || loading) return;
    const safeBody = sanitizeReply(body);
    if (!safeBody) { setError("Antwort darf nicht leer sein."); return; }
    try {
      setLoading(true); setError(null);
      const fd = new FormData();
      fd.append("body", safeBody);
      if (showCc && cc) fd.append("cc", cc);
      fd.append("use_template", !!templateId);
      if (templateId) fd.append("template_id", templateId);
      files.forEach(f => fd.append("files", f));
      await api.post(`/gmail/emails/${emailId}/reply`, fd, {
        headers: { "Content-Type": files.length ? "multipart/form-data" : "application/json" },
      });
      onSent?.(safeBody); setBody(""); onClose();
    } catch {
      setError("Antwort konnte nicht gesendet werden.");
    } finally {
      setLoading(false);
    }
  };

  const addFiles = (f) => setFiles(prev => [...prev, ...Array.from(f)]);

  return (
    <Modal open={open} onClose={onClose} title="Antworten" maxWidth="max-w-2xl">
      <div className="space-y-3">

        {error && <div className="text-red-400 text-xs bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] px-3 py-2 rounded-lg">{error}</div>}

        <Toggle checked={showCc} onChange={() => setShowCc(v => !v)} label="CC hinzufügen" />
        {showCc && (
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">CC</label>
            <input value={cc} onChange={e => setCc(e.target.value)} placeholder="cc@mail.de" className={inputCls} />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500">Antwort</label>
            {aiGenerated && <span style={AI_BADGE}>◈ KI-Entwurf</span>}
          </div>
          <textarea value={body} onChange={e => { setBody(e.target.value); setAiGenerated(false); }} rows={6}
            placeholder="Schreibe deine Antwort hier…" disabled={loading} autoFocus
            className={`${inputCls} resize-none`} />
          <div className={`text-right text-[11px] mt-0.5 ${body.length > MAX_LENGTH * 0.85 ? "text-amber-400" : "text-slate-600"}`}>
            {body.length} / {MAX_LENGTH}
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.07)] pt-3 space-y-3">

          <EmailTemplatePicker value={templateId} onChange={setTemplateId} body={body} />

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Anhänge</div>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {files.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-full px-2.5 py-0.5 text-[11px] text-slate-400">
                    {f.name}
                    <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                      className="text-slate-600 hover:text-red-400 transition-colors leading-none">×</button>
                  </span>
                ))}
              </div>
            )}
            <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
              className="border border-dashed border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-center cursor-pointer hover:border-[rgba(197,165,114,0.35)] hover:bg-[rgba(197,165,114,0.05)] transition-all">
              <div className="text-[12px] text-slate-500">Anhang hinzufügen oder hierher ziehen</div>
            </div>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-2 pt-1">
          <button onClick={handleAiReply} disabled={aiLoading || !emailId}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-[#C5A572] border border-[rgba(197,165,114,0.3)] bg-[rgba(197,165,114,0.1)] hover:bg-[rgba(197,165,114,0.18)] disabled:opacity-40 transition-all flex items-center gap-2">
            {aiLoading
              ? <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />KI denkt…</>
              : "NILL antworten lassen"}
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} disabled={loading}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-40 transition-all">
              Abbrechen
            </button>
            <button onClick={handleSend} disabled={loading || !body.trim()}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-300 border border-[rgba(59,130,246,0.4)] bg-[rgba(59,130,246,0.12)] hover:bg-[rgba(59,130,246,0.22)] disabled:opacity-40 transition-all flex items-center gap-2">
              {loading ? <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />Senden…</> : "Senden"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
