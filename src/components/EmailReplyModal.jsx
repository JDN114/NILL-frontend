import { useState, useEffect, useRef } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";
import EmailTemplatePicker from "./EmailTemplatePicker";
import { useMailApi } from "../context/MailContext";
import { textToHtml, buildPreviewHtml, isUncertainDelivery, MAX_BODY_LENGTH } from "../utils/mailBody";

const line  = "flex items-center gap-2 border-b border-[rgba(var(--tint),0.09)] px-1";
const field = "w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none py-2.5";
const recipLabel = "text-[13px] text-slate-500 flex-shrink-0 w-9";

function IconBtn({ title, onClick, active, disabled, children }) {
  return (
    <button type="button" title={title} onClick={onClick} disabled={disabled}
      className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors disabled:opacity-40 ${
        active ? "text-[#C5A572] bg-[rgba(197,165,114,0.12)]" : "text-slate-400 hover:bg-[rgba(var(--tint),0.08)] hover:text-slate-200"
      }`}>
      {children}
    </button>
  );
}

export default function EmailReplyModal({ emailId, open, onClose, onSent }) {
  const mail = useMailApi();

  const [body, setBody]               = useState("");
  const [loading, setLoading]         = useState(false);
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [error, setError]             = useState(null);
  const [warning, setWarning]         = useState(null);
  const [cc, setCc]                   = useState("");
  const [showCc, setShowCc]           = useState(false);
  const [templateId, setTemplateId]   = useState(null);
  const [templates, setTemplates]     = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [files, setFiles]             = useState([]);
  const [preview, setPreview]         = useState(false);
  const [previewDark, setPreviewDark] = useState(false);
  const fileRef                       = useRef();

  useEffect(() => {
    if (open) {
      setBody(""); setError(null); setWarning(null); setLoading(false);
      setAiLoading(false); setAiGenerated(false);
      setCc(""); setShowCc(false); setFiles([]); setTemplateId(null);
      setShowTemplates(false); setPreview(false);
    }
  }, [open, emailId]);

  useEffect(() => {
    if (!open) return;
    api.get("/gmail/templates")
      .then(r => setTemplates(r.data?.templates || []))
      .catch(() => setTemplates([]));
  }, [open]);

  if (!open) return null;

  const selectedTpl = templates.find(t => t.id === templateId) || null;
  const bodyHtml    = textToHtml(body);
  const canSend     = body.trim().length > 0 && !loading;

  const handleAiReply = async () => {
    if (!emailId || aiLoading) return;
    try {
      setAiLoading(true); setError(null);
      const reply = await mail.aiReply(emailId);
      setBody((reply || "").slice(0, MAX_BODY_LENGTH));
      setAiGenerated(true);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError((typeof detail === "object" ? detail?.message : detail) ?? "KI-Antwort konnte nicht geladen werden.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSend = async () => {
    if (!canSend || !emailId) return;
    try {
      setLoading(true); setError(null); setWarning(null);
      await mail.reply(emailId, {
        body: bodyHtml,
        cc: showCc && cc.trim() ? cc.trim() : undefined,
        files,
        use_template: !!templateId,
        template_id: templateId || undefined,
      });
      onSent?.(body);
      onClose();
    } catch (err) {
      if (isUncertainDelivery(err)) {
        setWarning("Der Versand dauert länger als erwartet. Die Antwort wurde vermutlich trotzdem zugestellt – bitte prüfen Sie „Gesendet“, bevor Sie erneut senden.");
      } else {
        setError(err?.response?.data?.detail || err?.response?.data?.message || "Antwort konnte nicht gesendet werden.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addFiles = (f) => setFiles(prev => [...prev, ...Array.from(f)]);

  return (
    <Modal open={open} onClose={onClose} title="Antworten" maxWidth="max-w-xl">
      <div className="flex flex-col -mx-1">

        {error && <div className="mx-1 mb-2 text-red-400 text-xs bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] px-3 py-2 rounded-lg">{error}</div>}
        {warning && <div className="mx-1 mb-2 text-amber-300 text-xs bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.25)] px-3 py-2 rounded-lg">{warning}</div>}

        {/* Cc line (toggled) */}
        <div className={line}>
          <span className={recipLabel}>An</span>
          <span className="flex-1 py-2.5 text-[13px] text-slate-400">Absender der Nachricht</span>
          {!showCc && <button onClick={() => setShowCc(true)} className="text-[13px] text-slate-500 hover:text-slate-200 transition-colors flex-shrink-0">Cc</button>}
        </div>
        {showCc && (
          <div className={line}>
            <span className={recipLabel}>Cc</span>
            <input value={cc} onChange={e => setCc(e.target.value)} placeholder="Cc" className={field} />
            <button onClick={() => { setShowCc(false); setCc(""); }} className="text-slate-600 hover:text-red-400 text-base px-1 flex-shrink-0">×</button>
          </div>
        )}

        {/* Body / Preview */}
        {preview ? (
          <div className="mx-1 my-3 rounded-lg overflow-hidden border border-[rgba(var(--tint),0.09)]">
            <div className="flex items-center justify-between px-3 py-2 bg-[rgba(var(--tint),0.03)] border-b border-[rgba(var(--tint),0.07)]">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">So kommt Ihre Antwort an</span>
              <div className="flex items-center gap-1 bg-[rgba(var(--tint),0.04)] rounded-full p-0.5">
                <button onClick={() => setPreviewDark(false)} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${!previewDark ? "bg-white text-black" : "text-slate-500"}`}>☀️</button>
                <button onClick={() => setPreviewDark(true)}  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${previewDark ? "bg-slate-700 text-white" : "text-slate-500"}`}>🌙</button>
              </div>
            </div>
            <iframe srcDoc={buildPreviewHtml({ bodyHtml, template: selectedTpl, dark: previewDark })}
              className="w-full block" style={{ height: "300px", background: previewDark ? "#15151f" : "#f4f4f5" }}
              title="Antwort Vorschau" sandbox="" />
          </div>
        ) : (
          <div className="mx-1 mt-3">
            {aiGenerated && (
              <div className="mb-1.5">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 7px", borderRadius: 99, fontSize: 10, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.12em", background: "rgba(122,92,255,0.12)", border: "1px solid rgba(122,92,255,0.28)", color: "rgba(122,92,255,0.85)" }}>◈ KI-Entwurf</span>
              </div>
            )}
            <textarea value={body} onChange={e => { setBody(e.target.value); setAiGenerated(false); }} rows={9}
              placeholder="Antwort schreiben…" disabled={loading} autoFocus
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none resize-none leading-relaxed" />
          </div>
        )}

        {showTemplates && (
          <div className="mx-1 mt-2 pt-2 border-t border-[rgba(var(--tint),0.07)]">
            <EmailTemplatePicker value={templateId} onChange={setTemplateId} body={body} templates={templates} />
          </div>
        )}

        {files.length > 0 && (
          <div className="mx-1 mt-2 flex flex-wrap gap-1.5">
            {files.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
                📎 {f.name}<span className="text-slate-600">{(f.size / 1024).toFixed(0)} KB</span>
                <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                  className="text-slate-600 hover:text-red-400 transition-colors leading-none ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Gmail-style bottom toolbar */}
        <div className="flex items-center gap-1 mt-3 pt-3 mx-1 border-t border-[rgba(var(--tint),0.07)]">
          <button onClick={handleSend} disabled={!canSend}
            className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1b66c9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
            {loading ? <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />Senden…</> : "Senden"}
          </button>

          <button onClick={handleAiReply} disabled={aiLoading || !emailId}
            className="ml-1 px-3 py-2 rounded-full text-[13px] font-semibold text-[#7a5cff] hover:bg-[rgba(122,92,255,0.12)] disabled:opacity-40 transition-colors flex items-center gap-1.5">
            {aiLoading ? <><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />KI…</> : <>◈ KI-Antwort</>}
          </button>

          <div className="flex items-center gap-0.5 ml-1">
            <IconBtn title="Anhang hinzufügen" onClick={() => fileRef.current?.click()} disabled={loading}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
            </IconBtn>
            <IconBtn title="Vorlage" onClick={() => setShowTemplates(v => !v)} active={showTemplates}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
            </IconBtn>
            <IconBtn title="Vorschau" onClick={() => setPreview(v => !v)} active={preview}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
            </IconBtn>
          </div>

          <div className="ml-auto">
            <IconBtn title="Verwerfen" onClick={onClose} disabled={loading}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </IconBtn>
          </div>

          <input ref={fileRef} type="file" multiple className="hidden"
            onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
        </div>
      </div>
    </Modal>
  );
}
