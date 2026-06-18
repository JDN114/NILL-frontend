import { useState, useEffect, useRef, useContext } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";
import EmailTemplatePicker from "./EmailTemplatePicker";
import { useMailApi } from "../context/MailContext";
import { GmailContext } from "../context/GmailContext";
import { textToHtml, buildPreviewHtml, isValidEmail, isUncertainDelivery, MAX_BODY_LENGTH } from "../utils/mailBody";

const PROVIDER_LABEL = { gmail: "Gmail", outlook: "Outlook", imap: "IMAP" };

// Borderless input that sits inside a recipient row (Gmail/Outlook style).
const bareInput =
  "w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 outline-none";

function Row({ label, children, action, last }) {
  return (
    <div className={`flex items-center gap-3 px-3.5 min-h-[44px] ${last ? "" : "border-b border-[rgba(var(--tint),0.07)]"}`}>
      <span className="w-14 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
      {action}
    </div>
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
  const [files, setFiles]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [warning, setWarning]         = useState(null);
  const [view, setView]               = useState("compose"); // "compose" | "preview"
  const [previewDark, setPreviewDark] = useState(false);
  const fileRef                       = useRef();

  useEffect(() => {
    if (open) {
      setTo(""); setSubject(""); setBody(""); setCc(""); setBcc("");
      setShowCc(false); setShowBcc(false); setFiles([]); setTemplateId(null);
      setError(null); setWarning(null); setLoading(false); setView("compose");
    }
  }, [open]);

  // Fetch templates once for both the picker and the recipient preview.
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
      // Attachment-capable endpoint accepts zero files and carries the 60s timeout.
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
  const totalKb  = files.reduce((s, f) => s + f.size, 0) / 1024;

  const Tab = ({ id, label }) => (
    <button onClick={() => setView(id)}
      className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
        view === id
          ? "bg-[rgba(197,165,114,0.15)] text-[#C5A572] shadow-sm"
          : "text-slate-500 hover:text-slate-300"
      }`}>
      {label}
    </button>
  );

  return (
    <Modal open={open} onClose={onClose} title="Neue E-Mail" maxWidth="max-w-2xl">
      <div className="space-y-3">

        {/* Segmented tabs */}
        <div className="flex items-center gap-1 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-xl p-1 w-fit">
          <Tab id="compose" label="✏️ Verfassen" />
          <Tab id="preview" label="👁 Vorschau" />
        </div>

        {error && <div className="text-red-400 text-xs bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] px-3 py-2 rounded-lg">{error}</div>}
        {warning && <div className="text-amber-300 text-xs bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.25)] px-3 py-2 rounded-lg">{warning}</div>}

        {view === "compose" ? (
          <>
            {/* Recipient block — clean Gmail/Outlook-style lined rows */}
            <div className="rounded-xl border border-[rgba(var(--tint),0.07)] bg-[rgba(var(--tint),0.03)] overflow-hidden">
              <Row label="Von">
                <div className="flex items-center gap-2 py-2">
                  <span className="text-sm text-slate-300 truncate">{fromLabel}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A572] bg-[rgba(197,165,114,0.12)] px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {PROVIDER_LABEL[provider] || "E-Mail"}
                  </span>
                </div>
              </Row>

              <Row label="An" action={
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!showCc && <button onClick={() => setShowCc(true)} className="text-[11px] text-slate-500 hover:text-[#C5A572] px-1.5 py-1 transition-colors">Cc</button>}
                  {!showBcc && <button onClick={() => setShowBcc(true)} className="text-[11px] text-slate-500 hover:text-[#C5A572] px-1.5 py-1 transition-colors">Bcc</button>}
                </div>
              }>
                <input value={to} onChange={e => setTo(e.target.value)} placeholder="empfaenger@beispiel.de"
                  className={`${bareInput} py-2`} />
              </Row>

              {showCc && (
                <Row label="Cc" action={
                  <button onClick={() => { setShowCc(false); setCc(""); }} className="text-slate-600 hover:text-red-400 text-sm px-1 flex-shrink-0">×</button>
                }>
                  <input value={cc} onChange={e => setCc(e.target.value)} placeholder="cc@mail.de" className={`${bareInput} py-2`} />
                </Row>
              )}

              {showBcc && (
                <Row label="Bcc" action={
                  <button onClick={() => { setShowBcc(false); setBcc(""); }} className="text-slate-600 hover:text-red-400 text-sm px-1 flex-shrink-0">×</button>
                }>
                  <input value={bcc} onChange={e => setBcc(e.target.value)} placeholder="bcc@mail.de" className={`${bareInput} py-2`} />
                </Row>
              )}

              <Row label="Betreff" last>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Betreff eingeben…"
                  className={`${bareInput} py-2 font-medium`} />
              </Row>
            </div>

            {to.trim() && !toValid && <div className="text-[11px] text-red-400/80 -mt-1">Bitte eine gültige E-Mail-Adresse eingeben.</div>}

            {/* Body */}
            <div className="rounded-xl border border-[rgba(var(--tint),0.07)] bg-[rgba(var(--tint),0.03)] focus-within:border-[rgba(197,165,114,0.35)] transition-colors">
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={8}
                placeholder="Nachricht schreiben…" disabled={loading}
                className="w-full bg-transparent px-3.5 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none" />
              <div className={`text-right text-[11px] px-3.5 pb-2 ${body.length > MAX_BODY_LENGTH * 0.85 ? "text-amber-400" : "text-slate-600"}`}>
                {body.length} / {MAX_BODY_LENGTH}
              </div>
            </div>

            {/* Options: template + attachments */}
            <div className="space-y-3">
              <EmailTemplatePicker value={templateId} onChange={setTemplateId} body={body} templates={templates} />

              {files.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {files.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
                      📎 {f.name}
                      <span className="text-slate-600">{(f.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                        className="text-slate-600 hover:text-red-400 transition-colors leading-none ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* ── Vorschau: so kommt die E-Mail beim Empfänger an ── */
          <div className="rounded-xl overflow-hidden border border-[rgba(var(--tint),0.07)]">
            <div className="flex items-center justify-between px-3 py-2 bg-[rgba(var(--tint),0.03)] border-b border-[rgba(var(--tint),0.07)]">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                So sieht der Empfänger Ihre E-Mail
              </span>
              <div className="flex items-center gap-1 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-full p-0.5">
                <button onClick={() => setPreviewDark(false)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${!previewDark ? "bg-white text-black" : "text-slate-500 hover:text-slate-300"}`}>☀️ Hell</button>
                <button onClick={() => setPreviewDark(true)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${previewDark ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}>🌙 Dunkel</button>
              </div>
            </div>

            <div className="px-4 py-2 bg-[rgba(var(--tint),0.02)]">
              <HdrField label="Von"     value={fromEmail} />
              <HdrField label="An"      value={to.trim()} />
              {showCc  && cc.trim()  && <HdrField label="Cc"  value={cc.trim()} />}
              {showBcc && bcc.trim() && <HdrField label="Bcc" value={bcc.trim()} />}
              <div className="flex text-[13px] py-1.5">
                <span className="w-16 flex-shrink-0 text-slate-500 font-semibold uppercase tracking-wider text-[10px] pt-0.5">Betreff</span>
                <span className="text-slate-100 font-semibold break-words">{subject.trim() || <span className="text-slate-600 font-normal">(kein Betreff)</span>}</span>
              </div>
            </div>

            <iframe
              srcDoc={buildPreviewHtml({ bodyHtml, template: selectedTpl, dark: previewDark })}
              className="w-full block"
              style={{ height: "340px", background: previewDark ? "#15151f" : "#f4f4f5" }}
              title="E-Mail Vorschau"
              sandbox=""
            />

            {files.length > 0 && (
              <div className="px-4 py-2.5 bg-[rgba(var(--tint),0.02)] border-t border-[rgba(var(--tint),0.07)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {files.length} {files.length === 1 ? "Anhang" : "Anhänge"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {files.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
                      📎 {f.name}<span className="text-slate-600">{(f.size / 1024).toFixed(0)} KB</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[rgba(var(--tint),0.07)]">
          <div className="flex items-center gap-2">
            <button onClick={() => fileRef.current?.click()} disabled={loading}
              title="Anhang hinzufügen"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 border border-[rgba(var(--tint),0.07)] bg-[rgba(var(--tint),0.03)] hover:text-[#C5A572] hover:border-[rgba(197,165,114,0.35)] transition-all">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
            </button>
            {files.length > 0 && <span className="text-[11px] text-slate-500">{files.length} · {totalKb.toFixed(0)} KB</span>}
            <input ref={fileRef} type="file" multiple className="hidden"
              onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} disabled={loading}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 border border-[rgba(var(--tint),0.07)] bg-[rgba(var(--tint),0.03)] hover:bg-[rgba(var(--tint),0.06)] disabled:opacity-40 transition-all">
              Abbrechen
            </button>
            <button onClick={handleSend} disabled={!canSend}
              className="px-5 py-2 rounded-lg text-sm font-bold text-black bg-[#C5A572] hover:bg-[#d4b683] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2">
              {loading
                ? <><span className="w-3 h-3 border-2 border-black/40 border-t-black rounded-full animate-spin inline-block" />Senden…</>
                : <>Senden<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
