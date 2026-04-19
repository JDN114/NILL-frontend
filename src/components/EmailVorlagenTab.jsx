import { useState, useEffect } from "react";
import api from "../services/api";
import Card from "./ui/Card";

const BLANK = {
  name: "Neue Vorlage",
  brand_color: "#C5A572",
  is_default: false,
  is_shared: false,
  // Visuelle Felder
  logo_url: "",
  company_name: "",
  greeting: "Mit freundlichen Grüßen",
  sig_name: "",
  sig_position: "",
  sig_phone: "",
  sig_email: "",
  link_impressum: "",
  link_datenschutz: "",
  link_agb: "",
};

const GREETINGS = [
  "Mit freundlichen Grüßen",
  "Mit freundlichem Gruß",
  "Beste Grüße",
  "Herzliche Grüße",
  "Viele Grüße",
  "Ihr Team",
];

function buildHtml(f) {
  const header = `
<div style="background:${f.brand_color};padding:20px 24px;display:flex;align-items:center;gap:16px;">
  ${f.logo_url ? `<img src="${f.logo_url}" height="44" style="border-radius:6px;" alt="Logo"/>` : ""}
  ${f.company_name ? `<span style="color:#fff;font-size:20px;font-weight:700;font-family:sans-serif;">${f.company_name}</span>` : ""}
</div>`.trim();

  const links = [
    f.link_impressum  ? `<a href="${f.link_impressum}"  style="color:#888;text-decoration:none;">Impressum</a>`  : "",
    f.link_datenschutz? `<a href="${f.link_datenschutz}" style="color:#888;text-decoration:none;">Datenschutz</a>` : "",
    f.link_agb        ? `<a href="${f.link_agb}"         style="color:#888;text-decoration:none;">AGB</a>`         : "",
  ].filter(Boolean).join(" &nbsp;·&nbsp; ");

  const footer = `
<div style="background:#f7f7f7;padding:16px 24px;font-family:sans-serif;font-size:12px;color:#666;border-top:3px solid ${f.brand_color};">
  ${f.greeting ? `<p style="margin:0 0 6px;">${f.greeting},<br/><strong style="color:#333;">${f.sig_name || f.company_name || ""}</strong></p>` : ""}
  ${f.sig_position ? `<p style="margin:0 0 2px;">${f.sig_position}</p>` : ""}
  ${f.sig_phone    ? `<p style="margin:0 0 2px;">📞 ${f.sig_phone}</p>` : ""}
  ${f.sig_email    ? `<p style="margin:0 0 8px;">✉️ ${f.sig_email}</p>` : ""}
  ${links ? `<p style="margin:0;">${links}</p>` : ""}
</div>`.trim();

  return { header_html: header, footer_html: footer };
}

function parseHtmlToFields(header_html, footer_html, brand_color) {
  // Einfaches Parsing – wir lesen aus dem gespeicherten HTML zurück
  const fields = { ...BLANK, brand_color: brand_color || "#C5A572" };
  if (!header_html) return fields;

  const logoMatch  = header_html.match(/src="([^"]+)"/);
  const nameMatch  = header_html.match(/<span[^>]*>([^<]+)<\/span>/);
  if (logoMatch)  fields.logo_url     = logoMatch[1];
  if (nameMatch)  fields.company_name = nameMatch[1];

  if (footer_html) {
    const greetMatch = footer_html.match(/^([^,<]+),/m);
    const sigMatch   = footer_html.match(/<strong[^>]*>([^<]+)<\/strong>/);
    const posMatch   = footer_html.match(/<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/);
    const phoneMatch = footer_html.match(/📞 ([^<]+)/);
    const emailMatch = footer_html.match(/✉️ ([^<]+)/);
    const impMatch   = footer_html.match(/href="([^"]+)"[^>]*>Impressum/);
    const datMatch   = footer_html.match(/href="([^"]+)"[^>]*>Datenschutz/);
    const agbMatch   = footer_html.match(/href="([^"]+)"[^>]*>AGB/);

    if (greetMatch)  fields.greeting        = greetMatch[1].trim();
    if (sigMatch)    fields.sig_name        = sigMatch[1];
    if (posMatch)    fields.sig_position    = posMatch[1];
    if (phoneMatch)  fields.sig_phone       = phoneMatch[1].trim();
    if (emailMatch)  fields.sig_email       = emailMatch[1].trim();
    if (impMatch)    fields.link_impressum  = impMatch[1];
    if (datMatch)    fields.link_datenschutz= datMatch[1];
    if (agbMatch)    fields.link_agb        = agbMatch[1];
  }
  return fields;
}

const inputCls = "w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-lg text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[rgba(197,165,114,0.4)] transition-all";
const labelCls = "block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1";

function Section({ title, children }) {
  return (
    <div className="border border-[rgba(255,255,255,0.07)] rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-[#C5A572]">{title}</p>
      {children}
    </div>
  );
}

export default function EmailVorlagenTab() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(null);
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
    setForm(BLANK); setEditing("new"); setError(null); setPreview(false);
  }

  function openEdit(t) {
    const fields = parseHtmlToFields(t.header_html, t.footer_html, t.brand_color);
    setForm({ ...fields, name: t.name, is_default: t.is_default });
    setEditing(t); setError(null); setPreview(false);
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function save() {
    if (!form.name.trim()) { setError("Name ist Pflichtfeld."); return; }
    setSaving(true); setError(null);
    try {
      const { header_html, footer_html } = buildHtml(form);
      const payload = {
        name: form.name, brand_color: form.brand_color,
        is_default: form.is_default, header_html, footer_html,
      };
      if (editing === "new") {
        await api.post("/gmail/templates", payload);
      } else {
        await api.patch(`/gmail/templates/${editing.id}`, payload);
      }
      await fetchTemplates(); setEditing(null);
    } catch { setError("Speichern fehlgeschlagen."); }
    finally { setSaving(false); }
  }

  async function deleteTemplate(id) {
    if (!window.confirm("Vorlage wirklich löschen?")) return;
    setDeleting(id);
    try { await api.delete(`/gmail/templates/${id}`); await fetchTemplates(); }
    catch { } finally { setDeleting(null); }
  }

  async function setDefault(id) {
    try { await api.patch(`/gmail/templates/${id}`, { is_default: true }); await fetchTemplates(); }
    catch { }
  }

  const { header_html: prevHeader, footer_html: prevFooter } = buildHtml(form);
  const previewHtml = `<div style="font-family:sans-serif;max-width:580px;margin:0 auto;">${prevHeader}<div style="padding:24px;color:#333;"><p>Sehr geehrte Damen und Herren,</p><p>dies ist eine Vorschau Ihrer E-Mail-Vorlage.</p></div>${prevFooter}</div>`;

  if (editing) return (
    <Card title={editing === "new" ? "Neue Vorlage erstellen" : `Vorlage bearbeiten`} className="rounded-2xl shadow-md">
      <div className="space-y-4">
        {error && <div className="text-red-400 text-xs bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] px-3 py-2 rounded-lg">{error}</div>}

        {/* Name + Standard */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Vorlagenname *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="z.B. Standard, Angebot..." className={inputCls}/>
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_default} onChange={e => set("is_default", e.target.checked)} className="accent-[#C5A572]"/>
              <span className="text-sm text-slate-400">Als Standard verwenden</span>
            </label>
          </div>
        </div>

        {/* Branding */}
        <Section title="Branding">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Unternehmensfarbe</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.brand_color} onChange={e => set("brand_color", e.target.value)}
                  className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"/>
                <input value={form.brand_color} onChange={e => set("brand_color", e.target.value)}
                  className={`${inputCls} font-mono`} placeholder="#C5A572"/>
              </div>
            </div>
            <div>
              <label className={labelCls}>Firmenname</label>
              <input value={form.company_name} onChange={e => set("company_name", e.target.value)}
                placeholder="Muster GmbH" className={inputCls}/>
            </div>
          </div>
          <div>
            <label className={labelCls}>Logo URL</label>
            <input value={form.logo_url} onChange={e => set("logo_url", e.target.value)}
              placeholder="https://example.com/logo.png" className={inputCls}/>
            <p className="text-[11px] text-slate-600 mt-1">Öffentlich erreichbare URL zu deinem Logo (PNG, SVG empfohlen)</p>
          </div>
        </Section>

        {/* Signatur */}
        <Section title="Signatur & Grußformel">
          <div>
            <label className={labelCls}>Grußformel</label>
            <select value={form.greeting} onChange={e => set("greeting", e.target.value)} className={inputCls}>
              {GREETINGS.map(g => <option key={g} value={g}>{g}</option>)}
              <option value="custom">Eigene...</option>
            </select>
            {form.greeting === "custom" && (
              <input value={form.greeting} onChange={e => set("greeting", e.target.value)}
                placeholder="Ihre eigene Grußformel" className={`${inputCls} mt-2`}/>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Name</label>
              <input value={form.sig_name} onChange={e => set("sig_name", e.target.value)}
                placeholder="Max Mustermann" className={inputCls}/>
            </div>
            <div>
              <label className={labelCls}>Position</label>
              <input value={form.sig_position} onChange={e => set("sig_position", e.target.value)}
                placeholder="Geschäftsführer" className={inputCls}/>
            </div>
            <div>
              <label className={labelCls}>Telefon</label>
              <input value={form.sig_phone} onChange={e => set("sig_phone", e.target.value)}
                placeholder="+49 123 456789" className={inputCls}/>
            </div>
            <div>
              <label className={labelCls}>E-Mail</label>
              <input value={form.sig_email} onChange={e => set("sig_email", e.target.value)}
                placeholder="info@firma.de" className={inputCls}/>
            </div>
          </div>
        </Section>

        {/* Footer Links */}
        <Section title="Footer Links">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Impressum URL</label>
              <input value={form.link_impressum} onChange={e => set("link_impressum", e.target.value)}
                placeholder="https://..." className={inputCls}/>
            </div>
            <div>
              <label className={labelCls}>Datenschutz URL</label>
              <input value={form.link_datenschutz} onChange={e => set("link_datenschutz", e.target.value)}
                placeholder="https://..." className={inputCls}/>
            </div>
            <div>
              <label className={labelCls}>AGB URL</label>
              <input value={form.link_agb} onChange={e => set("link_agb", e.target.value)}
                placeholder="https://..." className={inputCls}/>
            </div>
          </div>
        </Section>

        {/* Vorschau */}
        <div>
          <button onClick={() => setPreview(v => !v)}
            className="text-sm text-[#C5A572] hover:opacity-80 underline underline-offset-2">
            {preview ? "Vorschau ausblenden" : "Vorschau anzeigen"}
          </button>
          {preview && (
            <div className="mt-3 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.07)]">
              <iframe srcDoc={previewHtml} className="w-full h-64 bg-white" title="Vorschau" sandbox="allow-same-origin"/>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-2 border-t border-[rgba(255,255,255,0.07)]">
          <button onClick={() => setEditing(null)}
            className="px-4 py-2 text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5">
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
      <p className="text-sm text-gray-400 mb-5">
        Erstelle Vorlagen mit deinem Unternehmensbranding – Logo, Farben, Signatur und rechtliche Links.
        Diese Vorlagen kannst du beim Verfassen und Antworten auf E-Mails auswählen.
      </p>

      <button onClick={openNew}
        className="mb-5 px-4 py-2 text-sm font-semibold bg-[#C5A572] hover:opacity-90 text-black rounded-lg flex items-center gap-2">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Neue Vorlage
      </button>

      {loading ? (
        <p className="text-slate-500 text-sm">Lädt...</p>
      ) : templates.length === 0 ? (
        <div className="text-center py-10 text-slate-600 text-sm border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
          Noch keine Vorlagen. Erstelle deine erste Vorlage!
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map(t => (
            <div key={t.id} className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex-shrink-0 border border-white/10" style={{background: t.brand_color}}/>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <div className="flex items-center gap-2">
                    {t.is_default && <span className="text-[10px] text-[#C5A572] font-bold uppercase tracking-wider">✓ Standard</span>}
                    {t.is_shared  && <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">⟳ Geteilt</span>}
                    {!t.is_own    && <span className="text-[10px] text-slate-500 uppercase tracking-wider">Team</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!t.is_default && (
                  <button onClick={() => setDefault(t.id)}
                    className="text-xs text-slate-500 hover:text-[#C5A572] transition-colors px-2 py-1">
                    Als Standard
                  </button>
                )}
                <button onClick={() => openEdit(t)}
                  className="text-xs text-slate-400 hover:text-white border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-1.5 transition-all hover:bg-[rgba(255,255,255,0.05)]">
                  Bearbeiten
                </button>}
                {t.is_own !== false && <button onClick={() => deleteTemplate(t.id)} disabled={deleting === t.id}
                  className="text-xs text-red-400 hover:text-red-300 border border-[rgba(248,113,113,0.2)] rounded-lg px-3 py-1.5 transition-all hover:bg-[rgba(248,113,113,0.08)] disabled:opacity-40">
                  {deleting === t.id ? "..." : "Löschen"}
                </button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
