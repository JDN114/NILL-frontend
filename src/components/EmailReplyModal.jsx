import { useState, useEffect, useRef } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";
import EmailTemplatePicker from "./EmailTemplatePicker";
import { useMailApi } from "../context/MailContext";
import { textToHtml, buildPreviewHtml, isUncertainDelivery, MAX_BODY_LENGTH } from "../utils/mailBody";

const bareInput =
  "w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 outline-none";

const AI_BADGE = {
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "1px 7px", borderRadius: 99,
  fontSize: 10, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.12em",
  background: "rgba(122,92,255,0.12)", border: "1px solid rgba(122,92,255,0.28)",
  color: "rgba(122,92,255,0.85)", userSelect: "none",
};

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
  const [files, setFiles]             = useState([]);
  const [view, setView]               = useState("compose");
  const [previewDark, setPreviewDark] = useState(false);
  const fileRef                       = useRef();

  useEffect(() => {
    if (open) {
      setBody(""); setError(null); setWarning(null); setLoading(false);
      setAiLoading(false); setAiGenerated(false);
      setCc(""); setShowCc(false); setFiles([]); setTemplateId(null); setView("compose");
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
  const totalKb  = files.reduce((s, f) => s + f.size, 0) / 1024;

  const Tab = ({ id, label }) => (
    <button onClick={() => setView(id)}
      className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
        view === id ? "bg-[rgba(197,165,114,0.15)] text-[#C5A572] shadow-sm" : "text-slate-500 hover:text-slate-300"
      }`}>
      {label}
    </button>
  );

  return (
    <Modal open={open} onClose={onClose} title="Antworten" maxWidth="max-w-2xl">
      <div className="space-y-3">

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-xl p-1 w-fit">
            <Tab id="compose" label="✏️ Verfassen" />
            <Tab id="preview" label="👁 Vorschau" />
          </div>
          {!showCc && (
            <button onClick={() => setShowCc(true)} className="text-[11px] text-slate-500 hover:text-[#C5A572] px-2 py-1 transition-colors">+ Cc</button>
          )}
        </div>

        {error && <div className="text-red-400 text-xs bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] px-3 py-2 rounded-lg">{error}</div>}
        {warning && <div className="text-amber-300 text-xs bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.25)] px-3 py-2 rounded-lg">{warning}</div>}

        {view === "compose" ? (
          <>
            {showCc && (
              <div className="rounded-xl border border-[rgba(var(--tint),0.07)] bg-[rgba(var(--tint),0.03)] overflow-hidden">
                <div className="flex items-center gap-3 px-3.5 min-h-[44px]">
                  <span className="w-14 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Cc</span>
                  <input value={cc} onChange={e => setCc(e.target.value)} placeholder="cc@mail.de" className={`${bareInput} py-2`} />
                  <button onClick={() => { setShowCc(false); setCc(""); }} className="text-slate-600 hover:text-red-400 text-sm px-1 flex-shrink-0">×</button>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="rounded-xl border border-[rgba(var(--tint),0.07)] bg-[rgba(var(--tint),0.03)] focus-within:border-[rgba(197,165,114,0.35)] transition-colors">
              <div className="flex items-center justify-between px-3.5 pt-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Ihre Antwort</span>
                {aiGenerated && <span style={AI_BADGE}>◈ KI-Entwurf</span>}
              </div>
              <textarea value={body} onChange={e => { setBody(e.target.value); setAiGenerated(false); }} rows={8}
                placeholder="Schreibe deine Antwort hier…" disabled={loading} autoFocus
                className="w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-none" />
              <div className={`text-right text-[11px] px-3.5 pb-2 ${body.length > MAX_BODY_LENGTH * 0.85 ? "text-amber-400" : "text-slate-600"}`}>
                {body.length} / {MAX_BODY_LENGTH}
              </div>
            </div>

            <div className="space-y-3">
              <EmailTemplatePicker value={templateId} onChange={setTemplateId} body={body} templates={templates} />

              {files.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {files.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
                      📎 {f.name}<span className="text-slate-600">{(f.size / 1024).toFixed(0)} KB</span>
                      <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                        className="text-slate-600 hover:text-red-400 transition-colors leading-none ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-xl overflow-hidden border border-[rgba(var(--tint),0.07)]">
            <div className="flex items-center justify-between px-3 py-2 bg-[rgba(var(--tint),0.03)] border-b border-[rgba(var(--tint),0.07)]">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">So kommt Ihre Antwort an</span>
              <div className="flex items-center gap-1 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-full p-0.5">
                <button onClick={() => setPreviewDark(false)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${!previewDark ? "bg-white text-black" : "text-slate-500 hover:text-slate-300"}`}>☀️ Hell</button>
                <button onClick={() => setPreviewDark(true)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${previewDark ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}>🌙 Dunkel</button>
              </div>
            </div>
            <iframe
              srcDoc={buildPreviewHtml({ bodyHtml, template: selectedTpl, dark: previewDark })}
              className="w-full block"
              style={{ height: "340px", background: previewDark ? "#15151f" : "#f4f4f5" }}
              title="Antwort Vorschau"
              sandbox=""
            />
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-[rgba(var(--tint),0.07)]">
          <div className="flex items-center gap-2">
            <button onClick={handleAiReply} disabled={aiLoading || !emailId}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#7a5cff] border border-[rgba(122,92,255,0.3)] bg-[rgba(122,92,255,0.1)] hover:bg-[rgba(122,92,255,0.18)] disabled:opacity-40 transition-all flex items-center gap-2">
              {aiLoading
                ? <><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />KI denkt…</>
                : <>◈ NILL antworten lassen</>}
            </button>
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
