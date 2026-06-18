import { useState, useEffect, useRef, useContext } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";
import EmailTemplatePicker from "./EmailTemplatePicker";
import { useMailApi } from "../context/MailContext";
import { GmailContext } from "../context/GmailContext";
import { textToHtml, buildPreviewHtml, isValidEmail, isUncertainDelivery, MAX_BODY_LENGTH } from "../utils/mailBody";

const PROVIDER_LABEL = { gmail: "Gmail", outlook: "Outlook", imap: "IMAP" };

// Gmail-style: no field boxes, just thin separator lines and borderless inputs.
const line  = "flex items-center gap-2 border-b border-[rgba(var(--tint),0.09)] px-1";
const field = "w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none py-2.5";
const recipLabel = "text-[13px] text-slate-500 flex-shrink-0 w-9";

// Gmail toolbar icon button.
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

function HdrField({ label, value }) {
  return (
    <div className="flex text-[12px] py-1.5 border-b border-[rgba(var(--tint),0.06)] last:border-0">
      <span className="w-16 flex-shrink-0 text-slate-500 font-semibold uppercase tracking-wider text-[10px] pt-0.5">{label}</span>
      <span className="text-slate-300 break-all">{value || <span className="text-slate-600">—</span>}</span>
    </div>
  );
}

export default function EmailComposeModal({ open, onClose, onSent }) {
  const mail  = useMailApi();
  const gmail = useContext(GmailContext);

  const [to, setTo]                   = useState("");
  const [subject, setSubject]         = useState("");
  const [body, setBody]               = useState("");
  const [cc, setCc]                   = useState("");
  const [bcc, setBcc]                 = useState("");
  const [showCc, setShowCc]           = useState(false);
  const [showBcc, setShowBcc]         = useState(false);
  const [templateId, setTemplateId]   = useState(null);
  const [templates, setTemplates]     = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [files, setFiles]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [warning, setWarning]         = useState(null);
  const [preview, setPreview]         = useState(false);
  const [previewDark, setPreviewDark] = useState(false);
  const fileRef                       = useRef();

  useEffect(() => {
    if (open) {
      setTo(""); setSubject(""); setBody(""); setCc(""); setBcc("");
      setShowCc(false); setShowBcc(false); setFiles([]); setTemplateId(null);
      setShowTemplates(false); setError(null); setWarning(null);
      setLoading(false); setPreview(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    api.get("/gmail/templates")
      .then(r => setTemplates(r.data?.templates || []))
      .catch(() => setTemplates([]));
  }, [open]);

  if (!open) return null;

  const provider    = mail.provider;
  const fromEmail   = (provider === "gmail" && gmail?.connected?.email) || null;
  const fromLabel   = fromEmail || `Ihr ${PROVIDER_LABEL[provider] || "E-Mail"}-Postfach`;
  const selectedTpl = templates.find(t => t.id === templateId) || null;
  const bodyHtml    = textToHtml(body);

  const toValid = isValidEmail(to);
  const canSend = toValid && body.trim().length > 0 && !loading;

  const handleSend = async () => {
    if (!canSend) return;
    try {
      setLoading(true); setError(null); setWarning(null);
      const payload = {
        to: to.trim(),
        subject: subject.trim(),
        body: bodyHtml,
        cc:  showCc  && cc.trim()  ? cc.trim()  : null,
        bcc: showBcc && bcc.trim() ? bcc.trim() : null,
        use_template: !!templateId,
        template_id: templateId || undefined,
      };
      await mail.sendWithAttachments(payload, files);
      onSent?.();
      onClose();
    } catch (err) {
      if (isUncertainDelivery(err)) {
        setWarning("Der Versand dauert länger als erwartet. Die E-Mail wurde vermutlich trotzdem zugestellt – bitte prüfen Sie Ihren Ordner „Gesendet“, bevor Sie erneut senden.");
      } else {
        setError(err?.response?.data?.detail || err?.response?.data?.message || "E-Mail konnte nicht gesendet werden.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addFiles = (f) => setFiles(prev => [...prev, ...Array.from(f)]);

  return (
    <Modal open={open} onClose={onClose} title="Neue Nachricht" maxWidth="max-w-xl">
      <div className="flex flex-col -mx-1">

        {error && <div className="mx-1 mb-2 text-red-400 text-xs bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] px-3 py-2 rounded-lg">{error}</div>}
        {warning && <div className="mx-1 mb-2 text-amber-300 text-xs bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.25)] px-3 py-2 rounded-lg">{warning}</div>}

        {/* From */}
        <div className={line}>
          <span className={recipLabel}>Von</span>
          <span className="flex-1 py-2.5 text-[13px] text-slate-400 truncate">{fromLabel}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A572] bg-[rgba(197,165,114,0.12)] px-1.5 py-0.5 rounded-full flex-shrink-0">
            {PROVIDER_LABEL[provider] || "E-Mail"}
          </span>
        </div>

        {/* To + Cc/Bcc links */}
        <div className={line}>
          <span className={recipLabel}>An</span>
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="Empfänger" className={field} autoFocus />
          <div className="flex items-center gap-2 flex-shrink-0 text-[13px]">
            {!showCc  && <button onClick={() => setShowCc(true)}  className="text-slate-500 hover:text-slate-200 transition-colors">Cc</button>}
            {!showBcc && <button onClick={() => setShowBcc(true)} className="text-slate-500 hover:text-slate-200 transition-colors">Bcc</button>}
          </div>
        </div>

        {showCc && (
          <div className={line}>
            <span className={recipLabel}>Cc</span>
            <input value={cc} onChange={e => setCc(e.target.value)} placeholder="Cc" className={field} />
            <button onClick={() => { setShowCc(false); setCc(""); }} className="text-slate-600 hover:text-red-400 text-base px-1 flex-shrink-0">×</button>
          </div>
        )}
        {showBcc && (
          <div className={line}>
            <span className={recipLabel}>Bcc</span>
            <input value={bcc} onChange={e => setBcc(e.target.value)} placeholder="Bcc" className={field} />
            <button onClick={() => { setShowBcc(false); setBcc(""); }} className="text-slate-600 hover:text-red-400 text-base px-1 flex-shrink-0">×</button>
          </div>
        )}

        {/* Subject */}
        <div className={line}>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Betreff"
            className={`${field} font-medium px-1`} />
        </div>

        {to.trim() && !toValid && <div className="mx-1 mt-1.5 text-[11px] text-red-400/80">Bitte eine gültige E-Mail-Adresse eingeben.</div>}

        {/* Body / Preview */}
        {preview ? (
          <div className="mx-1 my-3 rounded-lg overflow-hidden border border-[rgba(var(--tint),0.09)]">
            <div className="flex items-center justify-between px-3 py-2 bg-[rgba(var(--tint),0.03)] border-b border-[rgba(var(--tint),0.07)]">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">So sieht der Empfänger Ihre E-Mail</span>
              <div className="flex items-center gap-1 bg-[rgba(var(--tint),0.04)] rounded-full p-0.5">
                <button onClick={() => setPreviewDark(false)} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${!previewDark ? "bg-white text-black" : "text-slate-500"}`}>☀️</button>
                <button onClick={() => setPreviewDark(true)}  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${previewDark ? "bg-slate-700 text-white" : "text-slate-500"}`}>🌙</button>
              </div>
            </div>
            <div className="px-3 py-2 bg-[rgba(var(--tint),0.02)]">
              <HdrField label="An"  value={to.trim()} />
              {showCc  && cc.trim()  && <HdrField label="Cc"  value={cc.trim()} />}
              {showBcc && bcc.trim() && <HdrField label="Bcc" value={bcc.trim()} />}
              <div className="flex text-[13px] py-1.5">
                <span className="w-16 flex-shrink-0 text-slate-500 font-semibold uppercase tracking-wider text-[10px] pt-0.5">Betreff</span>
                <span className="text-slate-100 font-semibold break-words">{subject.trim() || <span className="text-slate-600 font-normal">(kein Betreff)</span>}</span>
              </div>
            </div>
            <iframe srcDoc={buildPreviewHtml({ bodyHtml, template: selectedTpl, dark: previewDark })}
              className="w-full block" style={{ height: "300px", background: previewDark ? "#15151f" : "#f4f4f5" }}
              title="E-Mail Vorschau" sandbox="" />
          </div>
        ) : (
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={9}
            placeholder="E-Mail schreiben…" disabled={loading}
            className="mx-1 mt-3 w-[calc(100%-0.5rem)] bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none resize-none leading-relaxed" />
        )}

        {/* Template picker (toggled from toolbar) */}
        {showTemplates && (
          <div className="mx-1 mt-2 pt-2 border-t border-[rgba(var(--tint),0.07)]">
            <EmailTemplatePicker value={templateId} onChange={setTemplateId} body={body} templates={templates} />
          </div>
        )}

        {/* Attachment chips */}
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

          <div className="ml-auto flex items-center gap-2">
            {body.length > MAX_BODY_LENGTH * 0.7 && (
              <span className={`text-[11px] ${body.length > MAX_BODY_LENGTH * 0.85 ? "text-amber-400" : "text-slate-600"}`}>{body.length}/{MAX_BODY_LENGTH}</span>
            )}
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
