import { useState, useEffect } from "react";
import api from "../services/api";

export default function EmailTemplatePicker({ value, onChange, body = "", templates: templatesProp }) {
  const [templatesState, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(!templatesProp);
  const [darkMode, setDarkMode]   = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // When the parent already fetched the templates, reuse that list instead of
  // issuing a second /gmail/templates request.
  const templates = templatesProp ?? templatesState;

  useEffect(() => {
    if (templatesProp) { setLoading(false); return; }
    api.get("/gmail/templates")
      .then(r => setTemplates(r.data?.templates || []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, [templatesProp]);

  const selected = templates.find(t => t.id === value);

  useEffect(() => {
    // Vorschau automatisch zeigen wenn Vorlage ausgewählt
    if (value) setShowPreview(true);
    else setShowPreview(false);
  }, [value]);

  const pageBg = darkMode ? "#15151f" : "#f4f4f5";

  // Match the markup the backend (services/gmail_helper.py:apply_template) wraps
  // the body in — 680px + colored border-left — so this preview is what the
  // recipient actually receives.
  const previewHtml = selected ? `<!doctype html><html><body style="margin:0;padding:20px;background:${pageBg};">
    <div style="max-width:680px;margin:0 auto;font-family:sans-serif;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
      ${selected.header_html || ""}
      <div style="padding:24px;color:#333333;border-left:4px solid ${selected.brand_color || "#000000"};line-height:1.5;">
        ${body
          ? body.replace(/\n/g, "<br/>")
          : `<p style="margin:0 0 12px;">Sehr geehrte Damen und Herren,</p>
             <p style="margin:0;">hier erscheint der Inhalt Ihrer E-Mail.</p>`
        }
      </div>
      ${selected.footer_html || ""}
    </div>
    </body></html>` : "";

  if (loading) return <p className="text-xs text-slate-600">Vorlagen laden...</p>;
  if (templates.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Picker */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Vorlage
        </label>
        {!value && (
          <span className="text-[10px] text-slate-600">Wird ohne Vorlage versendet</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Explicit "no template" choice so it's unmistakable that the mail goes
            out plain when nothing is selected. */}
        <button onClick={() => onChange(null)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            !value
              ? "bg-[rgba(197,165,114,0.15)] border-[rgba(197,165,114,0.4)] text-[#C5A572]"
              : "bg-[rgba(var(--tint),0.03)] border-[rgba(var(--tint),0.07)] text-slate-500 hover:text-slate-300"
          }`}>
          Keine Vorlage
        </button>
        {templates.map(t => (
          <button key={t.id} onClick={() => onChange(value === t.id ? null : t.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
              value === t.id
                ? "bg-[rgba(197,165,114,0.15)] border-[rgba(197,165,114,0.4)] text-[#C5A572]"
                : "bg-[rgba(var(--tint),0.03)] border-[rgba(var(--tint),0.07)] text-slate-500 hover:text-slate-300"
            }`}>
            <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
              style={{background: t.brand_color}}/>
            {t.name}
            {t.is_default && value !== t.id && <span className="text-[9px] text-[#C5A572] ml-0.5">★</span>}
          </button>
        ))}
      </div>

      {/* Vorschau */}
      {value && selected && (
        <div className="mt-2 rounded-xl overflow-hidden border border-[rgba(var(--tint),0.07)]">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-[rgba(var(--tint),0.03)] border-b border-[rgba(var(--tint),0.07)]">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Vorschau · {selected.name}
            </span>
            <div className="flex items-center gap-1 bg-[rgba(var(--tint),0.04)] border border-[rgba(var(--tint),0.07)] rounded-full p-0.5">
              <button onClick={() => setDarkMode(false)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${!darkMode ? "bg-white text-black" : "text-slate-500 hover:text-slate-300"}`}>
                ☀️ Hell
              </button>
              <button onClick={() => setDarkMode(true)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${darkMode ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                🌙 Dunkel
              </button>
            </div>
          </div>
          {/* iFrame */}
          <iframe
            srcDoc={previewHtml}
            className="w-full block"
            style={{height: "300px", background: pageBg}}
            title="E-Mail Vorschau"
            sandbox=""
          />
        </div>
      )}
    </div>
  );
}
