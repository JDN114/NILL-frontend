import { useState, useEffect } from "react";
import api from "../services/api";

export default function EmailTemplatePicker({ value, onChange }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get("/gmail/templates")
      .then(r => setTemplates(r.data?.templates || []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-xs text-slate-600">Vorlagen laden...</p>;
  if (templates.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Vorlage
        </label>
        {value && (
          <button onClick={() => onChange(null)}
            className="text-[10px] text-slate-600 hover:text-slate-400">
            ✕ entfernen
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {templates.map(t => (
          <button key={t.id} onClick={() => onChange(value === t.id ? null : t.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
              value === t.id
                ? "bg-[rgba(197,165,114,0.15)] border-[rgba(197,165,114,0.4)] text-[#C5A572]"
                : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-slate-500 hover:text-slate-300"
            }`}>
            <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
              style={{background: t.brand_color}}/>
            {t.name}
            {t.is_default && value !== t.id && <span className="text-[9px] text-[#C5A572]">★</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
