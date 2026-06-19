// src/components/RecipientSuggestInput.jsx
//
// Eingabefeld für E-Mail-Adressaten mit Autovervollständigung.
// Zeigt beim Fokus / Tippen die zuletzt und am häufigsten verwendeten
// Adressen (Quelle: GET /gmail/recipient-suggestions, providerunabhängig
// aus der `emails`-Tabelle des Nutzers).
//
// Unterstützt mehrere, komma-getrennte Empfänger: Vorschläge ersetzen
// jeweils nur das aktuell getippte Token (Text nach dem letzten Komma).

import { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";

// Modul-weiter Cache, damit nicht jede Modal-Öffnung neu lädt.
let _cache = null;
let _cachePromise = null;

async function loadSuggestions() {
  if (_cache) return _cache;
  if (!_cachePromise) {
    _cachePromise = api
      .get("/gmail/recipient-suggestions", { params: { limit: 8 } })
      .then((r) => {
        _cache = r.data || { frequent: [], recent: [] };
        return _cache;
      })
      .catch(() => ({ frequent: [], recent: [] }))
      .finally(() => { _cachePromise = null; });
  }
  return _cachePromise;
}

// Cache invalidieren (z. B. nach erfolgreichem Versand könnten neue
// Adressaten relevant werden). Exportiert für optionale Nutzung.
export function invalidateRecipientCache() {
  _cache = null;
}

const lastToken = (val) => {
  const idx = val.lastIndexOf(",");
  return idx === -1 ? val : val.slice(idx + 1);
};

export default function RecipientSuggestInput({
  value,
  onChange,
  placeholder,
  inputClassName = "",
  wrapperClassName = "",
  autoFocus = false,
  multiple = true,
}) {
  const [data, setData]       = useState({ frequent: [], recent: [] });
  const [open, setOpen]       = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let alive = true;
    loadSuggestions().then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
  }, []);

  // Schließen bei Klick außerhalb.
  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const token = (multiple ? lastToken(value) : value).trim().toLowerCase();

  // Vorschlagsliste bauen: zuletzt zuerst, danach häufige ohne Dubletten.
  const buildList = useCallback(() => {
    const match = (it) =>
      !token ||
      it.email.toLowerCase().includes(token) ||
      (it.name || "").toLowerCase().includes(token);

    const recent = data.recent.filter(match);
    const seen = new Set(recent.map((it) => it.email.toLowerCase()));
    const frequent = data.frequent.filter(
      (it) => match(it) && !seen.has(it.email.toLowerCase())
    );
    return { recent, frequent };
  }, [data, token]);

  const { recent, frequent } = buildList();
  const flat = [...recent, ...frequent];
  const hasAny = flat.length > 0;

  const applyChoice = (email) => {
    let next;
    if (multiple) {
      const idx = value.lastIndexOf(",");
      const prefix = idx === -1 ? "" : value.slice(0, idx + 1) + " ";
      next = `${prefix}${email}, `;
    } else {
      next = email;
    }
    onChange(next);
    setOpen(false);
    setHighlight(-1);
    // Fokus zurück ins Feld, damit weiter getippt werden kann.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onKeyDown = (e) => {
    if (!open || !hasAny) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      applyChoice(flat[highlight].email);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const Row = ({ item, idx }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); applyChoice(item.email); }}
      onMouseEnter={() => setHighlight(idx)}
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
        highlight === idx ? "bg-[rgba(var(--tint),0.10)]" : "hover:bg-[rgba(var(--tint),0.06)]"
      }`}
    >
      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold bg-[rgba(197,165,114,0.15)] text-[#C5A572] flex-shrink-0 uppercase">
        {(item.name || item.email).trim().charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        {item.name && <span className="block text-[13px] text-slate-200 truncate">{item.name}</span>}
        <span className={`block truncate ${item.name ? "text-[11px] text-slate-500" : "text-[13px] text-slate-300"}`}>{item.email}</span>
      </span>
    </button>
  );

  return (
    <div ref={wrapRef} className={`relative ${wrapperClassName}`}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlight(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={inputClassName}
        autoFocus={autoFocus}
        autoComplete="off"
      />
      {open && hasAny && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-72 overflow-y-auto rounded-xl border border-[rgba(var(--tint),0.12)] bg-[#15151f] shadow-2xl py-1">
          {recent.length > 0 && (
            <>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Zuletzt verwendet</div>
              {recent.map((it, i) => <Row key={`r-${it.email}`} item={it} idx={i} />)}
            </>
          )}
          {frequent.length > 0 && (
            <>
              <div className="px-3 py-1 mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Häufig verwendet</div>
              {frequent.map((it, i) => <Row key={`f-${it.email}`} item={it} idx={recent.length + i} />)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
