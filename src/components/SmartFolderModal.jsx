import { useState, useEffect } from "react";
import Modal from "./ui/Modal";

const ICONS = ["📁","📬","💼","🔥","⭐","📌","👤","🏢","📝","💰","🔔","✅","📊","🎯","🤝"];
const RULE_TYPES = [
  { value: "sender",      label: "Absender enthält" },
  { value: "keyword",     label: "Betreff/Text enthält" },
  { value: "category",    label: "KI-Kategorie enthält" },
  { value: "ai_category", label: "KI-Gruppe enthält" },
];

const BLANK = { name: "", icon: "📁", color: "#C5A572", rules: [] };

const inputCls = "w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-lg text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[rgba(197,165,114,0.4)] transition-all";

export default function SmartFolderModal({ open, folder, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(folder ? { ...folder } : BLANK);
  }, [open, folder]);

  if (!open) return null;

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function addRule() {
    setForm(f => ({ ...f, rules: [...f.rules, { type: "keyword", value: "" }] }));
  }

  function updateRule(i, key, val) {
    setForm(f => {
      const rules = [...f.rules];
      rules[i] = { ...rules[i], [key]: val };
      return { ...f, rules };
    });
  }

  function removeRule(i) {
    setForm(f => ({ ...f, rules: f.rules.filter((_, j) => j !== i) }));
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try { await onSave(form); }
    finally { setSaving(false); }
  }

  return (
    <Modal open={open} onClose={onClose} title={folder ? "Ordner bearbeiten" : "Neuer Ordner"}>
      <div className="space-y-4">

        {/* Name + Icon */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Name</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="z.B. Projekt XY, Chef, Bewerbungen..." className={inputCls}/>
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Farbe</label>
            <input type="color" value={form.color} onChange={e => set("color", e.target.value)}
              className="w-full h-9 rounded-lg cursor-pointer border-0 bg-transparent"/>
          </div>
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(ic => (
              <button key={ic} onClick={() => set("icon", ic)}
                className={`w-8 h-8 rounded-lg text-base transition-all ${form.icon === ic ? "bg-[rgba(197,165,114,0.2)] border border-[rgba(197,165,114,0.4)]" : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.08)]"}`}>
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Regeln */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Filter-Regeln
            </label>
            <button onClick={addRule}
              className="text-xs text-[#C5A572] hover:opacity-80">+ Regel hinzufügen</button>
          </div>
          <p className="text-[11px] text-slate-600 mb-3">
            Emails die mindestens einer Regel entsprechen landen in diesem Ordner.
          </p>

          {form.rules.length === 0 && (
            <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-[rgba(255,255,255,0.07)] rounded-lg">
              Noch keine Regeln – alle Emails werden angezeigt
            </div>
          )}

          <div className="space-y-2">
            {form.rules.map((rule, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select value={rule.type} onChange={e => updateRule(i, "type", e.target.value)}
                  className="px-2 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-lg text-slate-300 text-xs focus:outline-none focus:border-[rgba(197,165,114,0.4)] flex-shrink-0">
                  {RULE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input value={rule.value} onChange={e => updateRule(i, "value", e.target.value)}
                  placeholder="Wert eingeben..."
                  className="flex-1 px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-lg text-slate-200 text-xs placeholder:text-slate-600 focus:outline-none focus:border-[rgba(197,165,114,0.4)]"/>
                <button onClick={() => removeRule(i)}
                  className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0 text-lg leading-none">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-2 border-t border-[rgba(255,255,255,0.07)]">
          <div>
            {folder && (
              <button onClick={() => onDelete(folder.id)}
                className="px-3 py-2 text-xs text-red-400 hover:text-red-300 border border-[rgba(248,113,113,0.2)] rounded-lg hover:bg-[rgba(248,113,113,0.08)] transition-all">
                Löschen
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5">
              Abbrechen
            </button>
            <button onClick={handleSave} disabled={saving || !form.name.trim()}
              className="px-4 py-2 text-sm font-semibold bg-[#C5A572] hover:opacity-90 disabled:opacity-50 text-black rounded-lg">
              {saving ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
