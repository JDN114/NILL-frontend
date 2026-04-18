import { useState, useEffect, useRef } from "react";
import Modal from "./ui/Modal";
import api from "../services/api";

const MAX_LENGTH = 5000;
const TEMPLATES = ["Standard", "Newsletter", "Angebot", "Support"];

function sanitize(text) {
  if (!text || typeof text !== "string") return "";
  return text.replace(/<\/?[^>]+(>|$)/g, "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, MAX_LENGTH);
}

function parseEmails(str) {
  return str.split(",").map(s => s.trim()).filter(Boolean);
}

export default function EmailComposeModal({ open, onClose }) {
  const [to, setTo]               = useState("");
  const [subject, setSubject]     = useState("");
  const [body, setBody]           = useState("");
  const [cc, setCc]               = useState("");
  const [bcc, setBcc]             = useState("");
  const [showCc, setShowCc]       = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [templateId, setTemplateId]   = useState("Standard");
  const [files, setFiles]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    if (open) {
      setTo(""); setSubject(""); setBody(""); setCc(""); setBcc("");
      setShowCc(false); setUseTemplate(false); setFiles([]);
      setError(null); setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const toValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim());
  const canSend = toValid && body.trim().length > 0 && !loading;

  const handleSend = async () => {
    if (!canSend) return;
    try {
      setLoading(true); setError(null);

      if (files.length > 0) {
        // multipart/form-data für Anhänge
        const fd = new FormData();
        fd.append("to", to.trim());
        fd.append("subject", subject.trim());
        fd.append("body", sanitize(body));
        if (showCc && cc) fd.append("cc", cc);
        fd.append("use_template", useTemplate);
        files.forEach(f => fd.append("files", f));
        await api.post("/gmail/send-with-attachments", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/gmail/send", {
          to: to.trim(),
          subject: subject.trim(),
          body: sanitize(body),
          cc: showCc && cc ? parseEmails(cc) : undefined,
          bcc: showCc && bcc ? parseEmails(bcc) : undefined,
          use_template: useTemplate,
          template_id: useTemplate ? templateId : undefined,
        });
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "E-Mail konnte nicht gesendet werden.");
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = (e) => {
    setFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  return (
    <Modal open={open} onClose={onClose} title="Neue E-Mail">
      <div className="space-y-3">

        {error && <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-2 rounded-lg">{error}</div>}

        {/* An */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">An</label>
          <input value={to} onChange={e => setTo(e.target.value)}
            placeholder="empfaenger@beispiel.de"
            className="w-full p-2 border border-white/7 rounded-lg bg-white/4 text-slate-200 text-sm focus:outline-none focus:border-[#C5A572]/40 focus:bg-white/6 transition-all"
          />
        </div>

        {/* CC Toggle */}
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCc(v => !v)}
            className={`w-8 h-5 rounded-full border transition-all relative ${showCc ? "bg-[rgba(197,165,114,0.2)] border-[rgba(197,165,114,0.4)]" : "bg-white/8 border-white/10"}`}>
            <span className={`absolute top-0.5 w-3 h-3 rounded-full transition-transform ${showCc ? "translate-x-3.5 bg-[#C5A572]" : "translate-x-0.5 bg-slate-500"}`}/>
          </button>
          <span className="text-xs text-slate-500 cursor-pointer" onClick={() => setShowCc(v => !v)}>CC / BCC hinzufügen</span>
        </div>

        {showCc && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">CC</label>
              <input value={cc} onChange={e => setCc(e.target.value)} placeholder="cc@mail.de"
                className="w-full p-2 border border-white/7 rounded-lg bg-white/4 text-slate-200 text-sm focus:outline-none focus:border-[#C5A572]/40 transition-all"/>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">BCC</label>
              <input value={bcc} onChange={e => setBcc(e.target.value)} placeholder="bcc@mail.de"
                className="w-full p-2 border border-white/7 rounded-lg bg-white/4 text-slate-200 text-sm focus:outline-none focus:border-[#C5A572]/40 transition-all"/>
            </div>
          </div>
        )}

        {/* Betreff */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Betreff</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Betreff eingeben…"
            className="w-full p-2 border border-white/7 rounded-lg bg-white/4 text-slate-200 text-sm focus:outline-none focus:border-[#C5A572]/40 transition-all"/>
        </div>

        {/* Body */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Nachricht</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={7}
            placeholder="Nachricht schreiben…" disabled={loading}
            className="w-full p-2 border border-white/7 rounded-lg bg-white/4 text-slate-200 text-sm resize-none focus:outline-none focus:border-[#C5A572]/40 transition-all"/>
          <div className={`text-right text-[11px] mt-0.5 ${body.length > MAX_LENGTH * 0.85 ? "text-amber-400" : "text-slate-600"}`}>
            {body.length} / {MAX_LENGTH}
          </div>
        </div>

        <div className="border-t border-white/7 pt-3 space-y-3">

          {/* Template */}
          <div className="flex items-center gap-2">
            <button onClick={() => setUseTemplate(v => !v)}
              className={`w-8 h-5 rounded-full border transition-all relative ${useTemplate ? "bg-[rgba(197,165,114,0.2)] border-[rgba(197,165,114,0.4)]" : "bg-white/8 border-white/10"}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full transition-transform ${useTemplate ? "translate-x-3.5 bg-[#C5A572]" : "translate-x-0.5 bg-slate-500"}`}/>
            </button>
            <span className="text-xs text-slate-500 cursor-pointer" onClick={() => setUseTemplate(v => !v)}>Vorlage / Branding verwenden</span>
          </div>
          {useTemplate && (
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map(t => (
                <button key={t} onClick={() => setTemplateId(t)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${templateId === t ? "bg-[rgba(197,165,114,0.15)] border-[rgba(197,165,114,0.4)] text-[#C5A572]" : "bg-white/3 border-white/7 text-slate-500 hover:text-slate-300"}`}>
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Anhänge */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Anhänge</div>
            {files.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {files.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-white/3 border border-white/7 rounded-full px-2.5 py-0.5 text-[11px] text-slate-400">
                    {f.name}
                    <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                      className="text-slate-600 hover:text-red-400 transition-colors leading-none">×</button>
                  </span>
                ))}
              </div>
            )}
            <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()} onDrop={handleDrop}
              className="border border-dashed border-white/10 rounded-lg p-3 text-center cursor-pointer hover:border-[rgba(197,165,114,0.35)] hover:bg-[rgba(197,165,114,0.06)] transition-all">
              <div className="text-[12px] text-slate-500">Klicken oder Dateien hierher ziehen</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Max. 25 MB pro Datei</div>
            </div>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles}/>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} disabled={loading}
            className="bg-white/5 hover:bg-white/8 disabled:opacity-40 border border-white/7 text-slate-400 px-4 py-2 rounded-lg text-sm transition-all">
            Abbrechen
          </button>
          <button onClick={handleSend} disabled={!canSend}
            className="bg-blue-500/18 hover:bg-blue-500/28 disabled:opacity-40 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all">
            {loading ? <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block"/>Senden…</> : "Senden"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
