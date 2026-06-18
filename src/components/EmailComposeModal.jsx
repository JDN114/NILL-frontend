import { useState, useEffect, useRef, useContext } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";
import EmailTemplatePicker from "./EmailTemplatePicker";
import { useMailApi } from "../context/MailContext";
import { GmailContext } from "../context/GmailContext";

const MAX_LENGTH = 5000;

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Turn the plain-text body the user typed into the HTML that actually gets sent.
// The body is delivered inside an HTML MIME part, so raw newlines would collapse
// into a single wall of text at the recipient. Escape first (no injection), then
// preserve the user's line breaks. The compose preview uses the exact same output,
// so what the user previews is what the recipient receives.
function textToHtml(text) {
  return escapeHtml((text ?? "").slice(0, MAX_LENGTH)).replace(/\r\n|\r|\n/g, "<br/>");
}

const inputCls = [
  "w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none transition-all",
  "bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)]",
  "placeholder:text-slate-600",
  "focus:bg-[rgba(var(--tint),0.06)] focus:border-[rgba(197,165,114,0.4)]",
].join(" ");

function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={onChange}>
      <div className={`relative w-8 h-5 rounded-full border transition-all flex-shrink-0 ${checked ? "bg-[rgba(197,165,114,0.2)] border-[rgba(197,165,114,0.4)]" : "bg-[rgba(var(--tint),0.05)] border-[rgba(var(--tint),0.1)]"}`}>
        <span className={`absolute top-0.5 w-3 h-3 rounded-full transition-transform ${checked ? "translate-x-3.5 bg-[#C5A572]" : "translate-x-0.5 bg-slate-500"}`} />
      </div>
      <span className="text-xs text-slate-500 select-none">{label}</span>
    </div>
  );
}

// Renders the message exactly the way the recipient's mail client will, wrapping
// the body in the same template markup the backend (apply_template) applies.
function buildPreviewHtml({ bodyHtml, template, dark }) {
  const pageBg = dark ? "#15151f" : "#f4f4f5";
  const inner = bodyHtml || `<span style="color:#9ca3af;">Hier erscheint Ihre Nachricht …</span>`;

  const card = template
    ? `<div style="font-family:sans-serif;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
         ${template.header_html || ""}
         <div style="padding:24px;color:#333333;border-left:4px solid ${template.brand_color || "#000000"};">
           ${inner}
         </div>
         ${template.footer_html || ""}
       </div>`
    : `<div style="font-family:sans-serif;background:#ffffff;border-radius:8px;padding:24px;color:#333333;box-shadow:0 1px 4px rgba(0,0,0,0.08);line-height:1.5;">
         ${inner}
       </div>`;

  return `<!doctype html><html><body style="margin:0;padding:20px;background:${pageBg};">
    <div style="max-width:680px;margin:0 auto;">${card}</div>
  </body></html>`;
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
      setShowCc(false); setFiles([]); setTemplateId(null);
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

  const fromEmail   = (mail.provider === "gmail" && gmail?.connected?.email) || null;
  const selectedTpl = templates.find(t => t.id === templateId) || null;
  const bodyHtml    = textToHtml(body);

  const toValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim());
  const canSend = toValid && body.trim().length > 0 && !loading;

  const handleSend = async () => {
    if (!canSend) return;
    try {
      setLoading(true); setError(null); setWarning(null);
      const payload = {
        to: to.trim(),
        subject: subject.trim(),
        body: bodyHtml,
        cc:  showCc && cc.trim()  ? cc.trim()  : null,
        bcc: showCc && bcc.trim() ? bcc.trim() : null,
        use_template: !!templateId,
        template_id: templateId || undefined,
      };
      // Always go through the attachment-capable endpoint (it accepts zero files):
      // it takes cc/bcc as plain strings and carries the 60s timeout — see mailApi.
      await mail.sendWithAttachments(payload, files);
      onSent?.();
      onClose();
    } catch (err) {
      // A timeout does NOT mean the send failed — the provider very often
      // delivers the mail anyway. This covers both the client-side axios abort
      // (ECONNABORTED) and the backend's deliberate 504 "DELIVERY_UNCERTAIN"
      // (raised when Gmail/Graph itself times out mid-send). Don't scare the
      // user with a red error in either case.
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      const isTimeout =
        err?.code === "ECONNABORTED" ||
        /timeout/i.test(err?.message || "") ||
        status === 504 ||
        detail === "DELIVERY_UNCERTAIN";
      if (isTimeout) {
        setWarning("Der Versand dauert länger als erwartet. Die E-Mail wurde vermutlich trotzdem zugestellt – bitte prüfen Sie Ihren Ordner „Gesendet“, bevor Sie erneut senden.");
      } else {
        setError(err?.response?.data?.detail || err?.response?.data?.message || "E-Mail konnte nicht gesendet werden.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addFiles = (f) => setFiles(prev => [...prev, ...Array.from(f)]);

  const TabButton = ({ id, label }) => (
    <button onClick={() => setView(id)}
      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
        view === id
          ? "bg-[rgba(197,165,114,0.15)] text-[#C5A572] border border-[rgba(197,165,114,0.4)]"
          : "text-slate-500 border border-transparent hover:text-slate-300"
      }`}>
      {label}
    </button>
  );

  const Field = ({ label, value }) => (
    <div className="flex text-[12px] py-1.5 border-b border-[rgba(var(--tint),0.06)]">
      <span className="w-20 flex-shrink-0 text-slate-500 font-semibold uppercase tracking-wider text-[10px] pt-0.5">{label}</span>
      <span className="text-slate-300 break-all">{value || <span className="text-slate-600">—</span>}</span>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="Neue E-Mail" maxWidth="max-w-2xl">
      <div className="space-y-3">

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[rgba(var(--tint),0.03)] border border-[rgba(var(--tint),0.07)] rounded-xl p-1 w-fit">
          <TabButton id="compose" label="✏️ Verfassen" />
          <TabButton id="preview" label="👁 Vorschau" />
        </div>

        {error && <div className="text-red-400 text-xs bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] px-3 py-2 rounded-lg">{error}</div>}
        {warning && <div className="text-amber-300 text-xs bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.25)] px-3 py-2 rounded-lg">{warning}</div>}

        {view === "compose" ? (
          <>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">An</label>
              <input value={to} onChange={e => setTo(e.target.value)} placeholder="empfaenger@beispiel.de"
                className={`${inputCls} ${to.trim() && !toValid ? "border-[rgba(248,113,113,0.4)]" : ""}`} />
              {to.trim() && !toValid && <div className="text-[11px] text-red-400/80 mt-1">Bitte eine gültige E-Mail-Adresse eingeben.</div>}
            </div>

            <Toggle checked={showCc} onChange={() => setShowCc(v => !v)} label="CC / BCC hinzufügen" />

            {showCc && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">CC</label>
                  <input value={cc} onChange={e => setCc(e.target.value)} placeholder="cc@mail.de" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">BCC</label>
                  <input value={bcc} onChange={e => setBcc(e.target.value)} placeholder="bcc@mail.de" className={inputCls} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Betreff</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Betreff eingeben…" className={inputCls} />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Nachricht</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={7}
                placeholder="Nachricht schreiben…" disabled={loading} className={`${inputCls} resize-none`} />
              <div className={`text-right text-[11px] mt-0.5 ${body.length > MAX_LENGTH * 0.85 ? "text-amber-400" : "text-slate-600"}`}>
                {body.length} / {MAX_LENGTH}
              </div>
            </div>

            <div className="border-t border-[rgba(var(--tint),0.07)] pt-3 space-y-3">

              <EmailTemplatePicker value={templateId} onChange={setTemplateId} body={body} templates={templates} />

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Anhänge</div>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {files.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-[rgba(var(--tint),0.03)] border border-[rgba(var(--tint),0.07)] rounded-full px-2.5 py-0.5 text-[11px] text-slate-400">
                        {f.name}
                        <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                          className="text-slate-600 hover:text-red-400 transition-colors leading-none">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                  className="border border-dashed border-[rgba(var(--tint),0.1)] rounded-lg p-3 text-center cursor-pointer hover:border-[rgba(197,165,114,0.35)] hover:bg-[rgba(197,165,114,0.05)] transition-all">
                  <div className="text-[12px] text-slate-500">Klicken oder Dateien hierher ziehen</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Max. 25 MB pro Datei</div>
                </div>
                <input ref={fileRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
              </div>
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
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${!previewDark ? "bg-white text-black" : "text-slate-500 hover:text-slate-300"}`}>
                  ☀️ Hell
                </button>
                <button onClick={() => setPreviewDark(true)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${previewDark ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                  🌙 Dunkel
                </button>
              </div>
            </div>

            {/* Kopfzeilen wie im Posteingang */}
            <div className="px-4 py-2 bg-[rgba(var(--tint),0.02)]">
              <Field label="Von"     value={fromEmail} />
              <Field label="An"      value={to.trim()} />
              {showCc && cc.trim()  && <Field label="CC"  value={cc.trim()} />}
              {showCc && bcc.trim() && <Field label="BCC" value={bcc.trim()} />}
              <div className="flex text-[13px] py-1.5">
                <span className="w-20 flex-shrink-0 text-slate-500 font-semibold uppercase tracking-wider text-[10px] pt-0.5">Betreff</span>
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
                  {files.length} Anhang{files.length > 1 ? " änge" : ""}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {files.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
                      📎 {f.name}
                      <span className="text-slate-600">{(f.size / 1024).toFixed(0)} KB</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-600">
            {view === "compose" ? "Tipp: In der Vorschau sehen Sie das Ergebnis beim Empfänger." : ""}
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} disabled={loading}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 border border-[rgba(var(--tint),0.07)] bg-[rgba(var(--tint),0.03)] hover:bg-[rgba(var(--tint),0.06)] disabled:opacity-40 transition-all">
              Abbrechen
            </button>
            <button onClick={handleSend} disabled={!canSend}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-300 border border-[rgba(59,130,246,0.4)] bg-[rgba(59,130,246,0.12)] hover:bg-[rgba(59,130,246,0.22)] disabled:opacity-40 transition-all flex items-center gap-2">
              {loading ? <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />Senden…</> : "Senden"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
