// src/components/ImapConnectModal.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ImapContext } from "../context/ImapContext";

// ── Saved-config helpers (localStorage, no password ever stored) ────────────

const LS_KEY = "nill_imap_saved";

export function getImapSavedConfigs() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}

export function getImapSavedByEmail(email) {
  return getImapSavedConfigs().find(s => s.email === email) ?? null;
}

function saveImapConfig(form) {
  const list = getImapSavedConfigs().filter(s => s.email !== form.email);
  list.unshift({
    email:         form.email,
    display_name:  form.display_name || "",
    imap_host:     form.imap_host,
    imap_port:     Number(form.imap_port) || 993,
    imap_use_ssl:  !!form.imap_use_ssl,
    imap_starttls: !!form.imap_starttls,
    smtp_host:     form.smtp_host || null,
    smtp_port:     form.smtp_port ? Number(form.smtp_port) : null,
    smtp_use_ssl:  !!form.smtp_use_ssl,
    username:      form.username || form.email,
    savedAt:       new Date().toISOString(),
  });
  try { localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 20))); } catch {}
}

// ── Provider presets ────────────────────────────────────────────────────────

const PRESETS = {
  "mailbox.org":  { name: "Mailbox.org",  imap: "imap.mailbox.org",       imapPort: 993, ssl: true,  smtp: "smtp.mailbox.org",       smtpPort: 465, smtpSsl: true  },
  "posteo.de":    { name: "Posteo",        imap: "posteo.de",              imapPort: 993, ssl: true,  smtp: "posteo.de",              smtpPort: 465, smtpSsl: true  },
  "posteo.net":   { name: "Posteo",        imap: "posteo.de",              imapPort: 993, ssl: true,  smtp: "posteo.de",              smtpPort: 465, smtpSsl: true  },
  "ionos.de":     { name: "IONOS",         imap: "imap.ionos.de",          imapPort: 993, ssl: true,  smtp: "smtp.ionos.de",          smtpPort: 465, smtpSsl: true  },
  "1und1.de":     { name: "1&1",           imap: "imap.1und1.de",          imapPort: 993, ssl: true,  smtp: "smtp.1und1.de",          smtpPort: 465, smtpSsl: true  },
  "strato.de":    { name: "Strato",        imap: "imap.strato.de",         imapPort: 993, ssl: true,  smtp: "smtp.strato.de",         smtpPort: 465, smtpSsl: true  },
  "gmx.de":       { name: "GMX",           imap: "imap.gmx.net",           imapPort: 993, ssl: true,  smtp: "mail.gmx.net",           smtpPort: 465, smtpSsl: true  },
  "gmx.net":      { name: "GMX",           imap: "imap.gmx.net",           imapPort: 993, ssl: true,  smtp: "mail.gmx.net",           smtpPort: 465, smtpSsl: true  },
  "web.de":       { name: "Web.de",        imap: "imap.web.de",            imapPort: 993, ssl: true,  smtp: "smtp.web.de",            smtpPort: 587, smtpSsl: false },
  "t-online.de":  { name: "T-Online",      imap: "secureimap.t-online.de", imapPort: 993, ssl: true,  smtp: "securesmtp.t-online.de", smtpPort: 465, smtpSsl: true  },
  "fastmail.com": { name: "Fastmail",      imap: "imap.fastmail.com",      imapPort: 993, ssl: true,  smtp: "smtp.fastmail.com",      smtpPort: 465, smtpSsl: true  },
  "yandex.com":   { name: "Yandex Mail",   imap: "imap.yandex.com",        imapPort: 993, ssl: true,  smtp: "smtp.yandex.com",        smtpPort: 465, smtpSsl: true  },
};

function presetFor(email) {
  const dom = email?.split("@")[1]?.toLowerCase();
  return dom && PRESETS[dom] ? { domain: dom, ...PRESETS[dom] } : null;
}

function friendlyError(err) {
  const raw   = err?.response?.data?.detail;
  const msg   = (typeof raw === "object" ? raw?.error : raw) || "";
  const low   = msg.toLowerCase();
  if (low.includes("auth") || low.includes("password") || low.includes("credential") || low.includes("login"))
    return "Benutzername oder Passwort falsch. Bei 2FA bitte ein App-Passwort aus den Sicherheitseinstellungen deines Providers verwenden.";
  if (low.includes("timeout") || low.includes("timed out"))
    return "Verbindung abgebrochen. Bitte versuche es erneut.";
  if (low.includes("connect") || low.includes("host") || low.includes("resolve") || low.includes("network"))
    return "Server nicht erreichbar — IMAP-Host und Port prüfen.";
  if (low.includes("ssl") || low.includes("tls") || low.includes("certificate"))
    return "SSL-Fehler — versuche SSL zu deaktivieren oder STARTTLS zu aktivieren.";
  return msg || "Verbindung fehlgeschlagen — E-Mail, Passwort und Servereinstellungen prüfen.";
}

const blank = {
  email: "", display_name: "",
  imap_host: "", imap_port: 993, imap_use_ssl: true, imap_starttls: false,
  smtp_host: "", smtp_port: 465, smtp_use_ssl: true,
  username: "", password: "",
};

function fromAccount(a) {
  return {
    email:         a.email ?? "",
    display_name:  a.display_name ?? "",
    imap_host:     a.imap_host ?? "",
    imap_port:     a.imap_port ?? 993,
    imap_use_ssl:  a.imap_use_ssl ?? true,
    imap_starttls: a.imap_starttls ?? false,
    smtp_host:     a.smtp_host ?? "",
    smtp_port:     a.smtp_port ?? 465,
    smtp_use_ssl:  a.smtp_use_ssl ?? true,
    username:      a.username ?? a.email ?? "",
    password:      "",
  };
}

const inp = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 text-sm";

export default function ImapConnectModal({ open, onClose, onConnected, account }) {
  const imap    = useContext(ImapContext);
  const isReauth = !!account;

  const [form,         setForm]         = useState(blank);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedHint,    setSavedHint]    = useState(false); // true when pre-filled from localStorage

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSubmitting(false);
    setSavedHint(false);
    if (account) {
      setForm(fromAccount(account));
      setShowAdvanced(true);
    } else {
      setForm(blank);
      setShowAdvanced(false);
    }
  }, [open, account]);

  const detected = useMemo(() => presetFor(form.email), [form.email]);

  // When email changes: try saved config first, fall back to provider preset
  useEffect(() => {
    if (isReauth || !form.email.includes("@")) return;
    const saved = getImapSavedByEmail(form.email);
    if (saved) {
      setForm(prev => ({
        ...prev,
        display_name:  saved.display_name  || prev.display_name,
        imap_host:     saved.imap_host     || prev.imap_host,
        imap_port:     saved.imap_port     || prev.imap_port,
        imap_use_ssl:  saved.imap_use_ssl  ?? prev.imap_use_ssl,
        imap_starttls: saved.imap_starttls ?? prev.imap_starttls,
        smtp_host:     saved.smtp_host     || prev.smtp_host,
        smtp_port:     saved.smtp_port     || prev.smtp_port,
        smtp_use_ssl:  saved.smtp_use_ssl  ?? prev.smtp_use_ssl,
        username:      saved.username      || prev.username || prev.email,
      }));
      setSavedHint(true);
      setShowAdvanced(false);
      return;
    }
    if (detected) {
      setForm(prev => ({
        ...prev,
        imap_host:    detected.imap,
        imap_port:    detected.imapPort,
        imap_use_ssl: detected.ssl,
        smtp_host:    detected.smtp,
        smtp_port:    detected.smtpPort,
        smtp_use_ssl: detected.smtpSsl,
        username:     prev.username || prev.email,
      }));
      setSavedHint(false);
      setShowAdvanced(false);
      return;
    }
    // Unknown provider — open advanced automatically
    const dom = form.email.split("@")[1];
    if (dom && dom.length > 2) {
      setSavedHint(false);
      setShowAdvanced(true);
    }
  }, [form.email, isReauth]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError(null);
    if (!form.email || !form.password) { setError("E-Mail und Passwort sind Pflicht."); return; }
    if (showAdvanced && !form.imap_host) { setError("IMAP-Host ist Pflicht."); return; }
    setSubmitting(true);
    try {
      const payload = {
        email:         form.email,
        display_name:  form.display_name || null,
        imap_host:     form.imap_host || detected?.imap || "",
        imap_port:     Number(form.imap_port) || 993,
        imap_use_ssl:  !!form.imap_use_ssl,
        imap_starttls: !!form.imap_starttls,
        smtp_host:     form.smtp_host || null,
        smtp_port:     form.smtp_port ? Number(form.smtp_port) : null,
        smtp_use_ssl:  form.smtp_host ? !!form.smtp_use_ssl : null,
        username:      form.username || form.email,
        password:      form.password,
      };
      const result = isReauth
        ? await imap.reauthAccount(account.id, payload)
        : await imap.connectImap(payload);

      // Save config to localStorage (no password) for future reconnects
      saveImapConfig({ ...form, imap_host: payload.imap_host });
      onConnected?.(result);
      onClose?.();
    } catch (err) {
      console.error("[ImapConnectModal]", err);
      setError(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const needsAppPassword = detected?.name && ["Mailbox.org","Posteo","Fastmail","Yandex Mail"].includes(detected.name);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                {isReauth ? "Verbindung erneuern" : "Postfach verbinden"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isReauth
                  ? "Gib dein aktuelles Passwort ein."
                  : "Verbinde dein Business-Postfach (z.B. info@deine-firma.de)."}
              </p>
            </div>
            <button type="button" onClick={onClose}
              className="text-gray-500 hover:text-white transition mt-0.5 flex-shrink-0 ml-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* E-Mail */}
          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
              E-Mail Adresse
            </label>
            <input
              type="email" autoComplete="username"
              value={form.email}
              onChange={e => { update("email", e.target.value); setSavedHint(false); }}
              placeholder="info@dein-business.de"
              disabled={isReauth}
              className={`${inp} ${isReauth ? "opacity-60" : ""}`}
              required
            />
            {/* Status pill beneath the email field */}
            {savedHint && !isReauth && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#C5A572] flex-shrink-0">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>
                <span className="text-xs text-[#C5A572]">
                  Gespeicherte Einstellungen geladen — nur Passwort eingeben.
                </span>
              </div>
            )}
            {!savedHint && detected && !isReauth && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"/>
                <span className="text-xs text-emerald-400">
                  {detected.name} erkannt — Servereinstellungen automatisch konfiguriert.
                </span>
              </div>
            )}
            {!savedHint && !detected && form.email.includes("@") && (form.email.split("@")[1]?.length ?? 0) > 2 && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"/>
                <span className="text-xs text-amber-400">
                  Provider unbekannt — Servereinstellungen unten ausfüllen.
                </span>
              </div>
            )}
          </div>

          {/* Passwort */}
          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
              Passwort
            </label>
            <input
              type="password" autoComplete="current-password"
              value={form.password}
              onChange={e => update("password", e.target.value)}
              placeholder="••••••••"
              className={inp}
              required
            />
            {needsAppPassword && (
              <p className="text-xs text-amber-400/80 mt-1.5 leading-relaxed">
                <strong className="text-amber-300">Hinweis:</strong> {detected.name} erfordert bei 2FA ein{" "}
                <strong>App-Passwort</strong> — in den Sicherheitseinstellungen des Kontos erstellen.
              </p>
            )}
            <p className="text-[11px] text-gray-600 mt-1">Wird verschlüsselt gespeichert. Passwort wird nie lokal gespeichert.</p>
          </div>

          {/* Anzeigename */}
          <div>
            <label className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
              Anzeigename <span className="text-gray-600 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={e => update("display_name", e.target.value)}
              placeholder="z.B. Müller GmbH Service"
              className={inp}
            />
          </div>

          {/* Advanced toggle */}
          <button type="button" onClick={() => setShowAdvanced(s => !s)}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
              style={{ transform: showAdvanced ? "rotate(90deg)" : "none", transition: "transform .15s" }}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            Servereinstellungen {(detected || savedHint) && !showAdvanced ? "(automatisch)" : ""}
          </button>

          {showAdvanced && (
            <div className="space-y-4 border border-gray-800 rounded-xl p-4 bg-black/20">

              {/* IMAP */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Eingang (IMAP)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-gray-500 text-[11px] mb-1 block">Host</label>
                    <input type="text" value={form.imap_host}
                      onChange={e => update("imap_host", e.target.value)}
                      placeholder="imap.dein-provider.de"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gray-500" />
                  </div>
                  <div>
                    <label className="text-gray-500 text-[11px] mb-1 block">Port</label>
                    <input type="number" value={form.imap_port}
                      onChange={e => update("imap_port", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gray-500" />
                  </div>
                </div>
                <div className="flex gap-5 mt-2.5">
                  <label className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-amber-500" checked={form.imap_use_ssl}
                      onChange={e => update("imap_use_ssl", e.target.checked)} />
                    SSL/TLS <span className="text-gray-600">(Port 993)</span>
                  </label>
                  <label className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-amber-500" checked={form.imap_starttls}
                      onChange={e => update("imap_starttls", e.target.checked)} />
                    STARTTLS <span className="text-gray-600">(Port 143)</span>
                  </label>
                </div>
              </div>

              {/* SMTP */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Ausgang (SMTP) <span className="font-normal normal-case text-gray-600">— optional</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-gray-500 text-[11px] mb-1 block">Host</label>
                    <input type="text" value={form.smtp_host}
                      onChange={e => update("smtp_host", e.target.value)}
                      placeholder="smtp.dein-provider.de"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gray-500" />
                  </div>
                  <div>
                    <label className="text-gray-500 text-[11px] mb-1 block">Port</label>
                    <input type="number" value={form.smtp_port}
                      onChange={e => update("smtp_port", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gray-500" />
                  </div>
                </div>
                <label className="text-xs text-gray-400 flex items-center gap-2 mt-2.5 cursor-pointer">
                  <input type="checkbox" className="accent-amber-500" checked={!!form.smtp_use_ssl}
                    onChange={e => update("smtp_use_ssl", e.target.checked)} />
                  SSL auf Port 465 <span className="text-gray-600">(sonst STARTTLS auf 587)</span>
                </label>
              </div>

              {/* Username override */}
              <div>
                <label className="text-gray-500 text-[11px] mb-1 block">
                  Login-Benutzername <span className="text-gray-600">(nur wenn abweichend von der E-Mail)</span>
                </label>
                <input type="text" value={form.username}
                  onChange={e => update("username", e.target.value)}
                  placeholder={form.email || "In 95% der Fälle leer lassen"}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-gray-500" />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300 leading-relaxed">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-sm text-gray-400 border border-gray-700 hover:bg-white/5 transition disabled:opacity-40">
              Abbrechen
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Verbinde…
                </>
              ) : isReauth ? "Erneut verbinden" : "Postfach verbinden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
