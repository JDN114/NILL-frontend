import { useState, useEffect } from "react";
import api from "../services/api";
import Card from "./ui/Card";

const BLANK = {
  name: "",
  brand_color: "#C5A572",
  header_html: "",
  footer_html: "",
  is_default: false,
};

const PLACEHOLDERS = {
  header_html: `<!-- Beispiel Header -->
<div style="background:#C5A572;padding:16px;text-align:center;">
  <img src="https://dein-cdn.com/logo.png" height="40" alt="Logo"/>
  <h2 style="color:#fff;margin:8px 0 0;">Firmenname GmbH</h2>
</div>`,
  footer_html: `<!-- Beispiel Footer -->
<div style="background:#f5f5f5;padding:12px;font-size:12px;color:#999;text-align:center;">
  Mit freundlichen Grüßen<br/>
  Ihr Firmenname Team<br/><br/>
  Firmenname GmbH · Musterstraße 1 · 12345 Stadt<br/>
  <a href="https://example.com/impressum">Impressum</a> ·
  <a href="https://example.com/datenschutz">Datenschutz</a> ·
  <a href="https://example.com/agb">AGB</a>
</div>`,
};

export default function EmailVorlagenTab() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(null); // null | "new" | {id,...}
  const [form, setForm]           = useState(BLANK);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(null);
  const [error, setError]         = useState(null);
  const [preview, setPreview]     = useState(false);

  useEffect(() => { fetchTemplates(); }, []);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const res = await api.get("/gmail/templates");
      setTemplates(res.data?.templates || []);
    } catch { setTemplates([]); }
    finally { setLoading(false); }
  }

  function openNew() {
    setForm(BLANK);
    setEditing("new");
    setError(null);
    setPreview(false);
  }

  function openEdit(t) {
    setForm({ ...t });
    setEditing(t);
    setError(null);
    setPreview(false);
  }

  async function save() {
    if (!form.name.trim()) { setError("Name ist Pflichtfeld."); return; }
    setSaving(true); setError(null);
    try {
      if (editing === "new") {
        await api.post("/gmail/templates", form);
      } else {
        await api.patch(`/gmail/templates/${editing.id}`, form);
      }
      await fetchTemplates();
      setEditing(null);
    } catch { setError("Speichern fehlgeschlagen."); }
    finally { setSaving(false); }
  }

  async function deleteTemplate(id) {
    if (!window.confirm("Vorlage wirklich löschen?")) return;
    setDeleting(id);
    try {
      await api.delete(`/gmail/templates/${id}`);
      await fetchTemplates();
    } catch { }
    finally { setDeleting(null); }
  }

  async function setDefault(id) {
    try {
      await api.patch(`/gmail/templates/${id}`, { is_default: true });
      await fetchTemplates();
    } catch { }
  }

  const previewHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #eee;">
      ${form.header_html || ""}
      <div style="padding:24px;color:#333;border-left:4px solid ${form.brand_color};">
        <p>Sehr geehrte Damen und Herren,</p>
        <p>dies ist eine Vorschau Ihrer E-Mail-Vorlage. Der eigentliche Inhalt erscheint hier.</p>
      </div>
      ${form.footer_html || ""}
    </div>
  `;

  if (editing) return (
    <Card title={editing === "new" ? "Neue Vorlage erstellen" : `Vorlage bearbeiten: ${editing.name}`} className="rounded-2xl shadow-md">
      <div className="space-y-4">
        {error && <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</div>}

        {/* Name + Farbe */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              placeholder="z.B. Standard Branding"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#C5A572]/50"/>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Unternehmensfarbe</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.brand_color} onChange={e => setForm(f => ({...f, brand_color: e.target.value}))}
                className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent"/>
              <input value={form.brand_color} onChange={e => setForm(f => ({...f, brand_color: e.target.value}))}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[#C5A572]/50"/>
            </div>
          </div>
        </div>

        {/* Als Standard */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_default" checked={form.is_default}
            onChange={e => setForm(f => ({...f, is_default: e.target.checked}))}
            className="accent-[#C5A572]"/>
          <label htmlFor="is_default" className="text-sm text-gray-400 cursor-pointer">Als Standard-Vorlage verwenden</label>
        </div>

        {/* Header HTML */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Header HTML</label>
            <button onClick={() => setForm(f => ({...f, header_html: PLACEHOLDERS.header_html}))}
              className="text-xs text-[#C5A572] hover:opacity-80">Beispiel laden</button>
          </div>
          <textarea value={form.header_html} onChange={e => setForm(f => ({...f, header_html: e.target.value}))}
            rows={5} placeholder="HTML für den E-Mail-Header (Logo, Firmenname...)"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono resize-y focus:outline-none focus:border-[#C5A572]/50"/>
        </div>

        {/* Footer HTML */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Footer HTML</label>
            <button onClick={() => setForm(f => ({...f, footer_html: PLACEHOLDERS.footer_html}))}
              className="text-xs text-[#C5A572] hover:opacity-80">Beispiel laden</button>
          </div>
          <textarea value={form.footer_html} onChange={e => setForm(f => ({...f, footer_html: e.target.value}))}
            rows={6} placeholder="HTML für den E-Mail-Footer (Signatur, AGB, Impressum...)"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono resize-y focus:outline-none focus:border-[#C5A572]/50"/>
        </div>

        {/* Vorschau */}
        <div>
          <button onClick={() => setPreview(v => !v)}
            className="text-sm text-[#C5A572] hover:opacity-80 underline underline-offset-2">
            {preview ? "Vorschau ausblenden" : "Vorschau anzeigen"}
          </button>
          {preview && (
            <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
              <iframe srcDoc={previewHtml} className="w-full h-64 bg-white" title="Vorschau"/>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-2">
          <button onClick={() => setEditing(null)}
            className="px-4 py-2 text-sm text-gray-400 border border-white/10 rounded-lg hover:bg-white/5">
            Abbrechen
          </button>
          <button onClick={save} disabled={saving}
            className="px-4 py-2 text-sm font-semibold bg-[#C5A572] hover:opacity-90 disabled:opacity-50 text-black rounded-lg">
            {saving ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </div>
    </Card>
  );

  return (
    <Card title="E-Mail Vorlagen" className="rounded-2xl shadow-md">
      <p className="text-sm text-gray-400 mb-4">
        Erstelle Vorlagen mit deinem Unternehmensbranding – Logo, Farben, Signatur, AGB und Impressum.
        Diese Vorlagen können beim Verfassen und Antworten auf E-Mails ausgewählt werden.
      </p>

      <button onClick={openNew}
        className="mb-5 px-4 py-2 text-sm font-semibold bg-[#C5A572] hover:opacity-90 text-black rounded-lg">
        + Neue Vorlage
      </button>

      {loading ? (
        <p className="text-gray-500 text-sm">Lädt...</p>
      ) : templates.length === 0 ? (
        <div className="text-center py-8 text-gray-600 text-sm">
          Noch keine Vorlagen. Erstelle deine erste Vorlage!
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map(t => (
            <div key={t.id} className="flex items-center justify-between p-3 bg-white/3 border border-white/7 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{background: t.brand_color}}/>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  {t.is_default && <span className="text-[10px] text-[#C5A572] font-semibold uppercase tracking-wider">Standard</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!t.is_default && (
                  <button onClick={() => setDefault(t.id)}
                    className="text-xs text-gray-500 hover:text-[#C5A572] transition-colors px-2 py-1">
                    Als Standard
                  </button>
                )}
                <button onClick={() => openEdit(t)}
                  className="text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg px-3 py-1 transition-all hover:bg-white/5">
                  Bearbeiten
                </button>
                <button onClick={() => deleteTemplate(t.id)} disabled={deleting === t.id}
                  className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg px-3 py-1 transition-all hover:bg-red-500/10 disabled:opacity-40">
                  {deleting === t.id ? "..." : "Löschen"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
