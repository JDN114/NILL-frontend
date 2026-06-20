// src/components/ImapConnectModal.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ImapContext } from "../context/ImapContext";

// ── Saved-config helpers ────────────────────────────────────────────────────

const LS_KEY = "nill_imap_saved";

export function getImapSavedConfigs() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}

// Returns a 16-char hex prefix of SHA-256(email) — stable but non-reversible lookup key.
async function _emailKey(email) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email.toLowerCase()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

export async function getImapSavedByEmail(email) {
  const key = await _emailKey(email);
  return getImapSavedConfigs().find(s => s._key === key) ?? null;
}

async function saveImapConfig(form) {
  const key = await _emailKey(form.email);
  const list = getImapSavedConfigs().filter(s => s._key !== key);
  list.unshift({
    _key: key,
    imap_host: form.imap_host, imap_port: Number(form.imap_port) || 993,
    imap_use_ssl: !!form.imap_use_ssl, imap_starttls: !!form.imap_starttls,
    smtp_host: form.smtp_host || null, smtp_port: form.smtp_port ? Number(form.smtp_port) : null,
    smtp_use_ssl: !!form.smtp_use_ssl,
    savedAt: new Date().toISOString(),
  });
  try { localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 20))); } catch { /* ignore */ }
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
  const raw = err?.response?.data?.detail;
  const msg = (typeof raw === "object" ? raw?.error : raw) || "";
  const low = msg.toLowerCase();
  if (low.includes("auth") || low.includes("password") || low.includes("credential") || low.includes("login"))
    return "Benutzername oder Passwort falsch. Bei 2FA bitte ein App-Passwort aus den Sicherheitseinstellungen verwenden.";
  if (low.includes("timeout") || low.includes("timed out"))
    return "Verbindung abgebrochen. Bitte erneut versuchen.";
  if (low.includes("connect") || low.includes("host") || low.includes("resolve") || low.includes("network"))
    return "Server nicht erreichbar — IMAP-Host und Port prüfen.";
  if (low.includes("ssl") || low.includes("tls") || low.includes("certificate"))
    return "SSL-Fehler — SSL deaktivieren oder STARTTLS aktivieren.";
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
    email:         a.email         ?? "",
    display_name:  a.display_name  ?? "",
    imap_host:     a.imap_host     ?? "",
    imap_port:     a.imap_port     ?? 993,
    imap_use_ssl:  a.imap_use_ssl  ?? true,
    imap_starttls: a.imap_starttls ?? false,
    smtp_host:     a.smtp_host     ?? "",
    smtp_port:     a.smtp_port     ?? 465,
    smtp_use_ssl:  a.smtp_use_ssl  ?? true,
    username:      a.username      ?? a.email ?? "",
    password:      "",
  };
}

// ── CSS injected once for focus/hover states ────────────────────────────────

const CSS = `
  .nim-input {
    width: 100%; box-sizing: border-box; outline: none;
    padding: 0.55rem 0.85rem;
    background: rgba(var(--tint),0.04);
    border: 1px solid rgba(var(--ink-tint),0.07);
    border-radius: 9px;
    color: #efede7; font-size: 0.83rem;
    transition: border-color 0.15s;
  }
  .nim-input:focus { border-color: rgba(197,165,114,0.5); }
  .nim-input:disabled { opacity: 0.5; cursor: not-allowed; }
  .nim-input-sm {
    width: 100%; box-sizing: border-box; outline: none;
    padding: 0.42rem 0.65rem;
    background: rgba(var(--tint),0.04);
    border: 1px solid rgba(var(--ink-tint),0.07);
    border-radius: 8px;
    color: #efede7; font-size: 0.8rem;
    transition: border-color 0.15s;
  }
  .nim-input-sm:focus { border-color: rgba(197,165,114,0.5); }
  .nim-btn-ghost {
    padding: 0.5rem 1.1rem;
    background: transparent;
    border: 1px solid rgba(var(--ink-tint),0.07);
    border-radius: 8px; color: rgba(var(--ink-tint),.5);
    font-size: 0.83rem; cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .nim-btn-ghost:hover:not(:disabled) { border-color: rgba(var(--ink-tint),0.18); color: #efede7; }
  .nim-btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
  .nim-btn-primary {
    flex: 1; padding: 0.55rem 1rem;
    background: #c5a572; border: none;
    border-radius: 8px; color: #000;
    font-weight: 700; font-size: 0.83rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.15s;
  }
  .nim-btn-primary:hover:not(:disabled) { opacity: 0.88; }
  .nim-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .nim-toggle {
    background: none; border: none; cursor: pointer; padding: 0;
    display: flex; align-items: center; gap: 6px;
    font-size: 0.75rem; color: rgba(var(--ink-tint),.28);
    transition: color 0.15s;
  }
  .nim-toggle:hover { color: rgba(var(--ink-tint),.5); }
  .nim-close {
    background: none; border: none; cursor: pointer; padding: 4px;
    color: rgba(var(--ink-tint),.28); line-height: 1; flex-shrink: 0;
    transition: color 0.15s;
  }
  .nim-close:hover { color: #efede7; }
  .nim-tooltip {
    position: relative; display: inline-flex; align-items: center;
  }
  .nim-tooltip-box {
    visibility: hidden; opacity: 0;
    position: absolute; bottom: calc(100% + 6px); left: 50%;
    transform: translateX(-50%);
    background: #1a1916; border: 1px solid rgba(var(--ink-tint),0.1);
    border-radius: 6px; padding: 5px 9px;
    font-size: 0.71rem; color: rgba(var(--ink-tint),.7);
    white-space: nowrap; pointer-events: none; z-index: 10;
    transition: opacity 0.15s;
  }
  .nim-tooltip:hover .nim-tooltip-box { visibility: visible; opacity: 1; }
  @keyframes nim-spin { to { transform: rotate(360deg); } }
  .nim-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.25);
    border-top-color: #000;
    border-radius: 50%;
    animation: nim-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
`;

let cssInjected = false;
function ensureCSS() {
  if (cssInjected) return;
  const el = document.createElement("style");
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

// ── Tooltip helper ──────────────────────────────────────────────────────────

function Tip({ text, children }) {
  return (
    <span className="nim-tooltip">
      {children}
      <span className="nim-tooltip-box">{text}</span>
    </span>
  );
}

// ── Label ───────────────────────────────────────────────────────────────────

function Label({ children, hint }) {
  return (
    <label style={{
      fontSize: "0.72rem", fontWeight: 700,
      color: "rgba(var(--ink-tint),.5)",
      textTransform: "uppercase", letterSpacing: "0.07em",
      display: "flex", alignItems: "center", gap: 5,
      marginBottom: 5,
    }}>
      {children}
      {hint && (
        <Tip text={hint}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="rgba(var(--ink-tint),.3)" strokeWidth="2.2" style={{ cursor: "default" }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </Tip>
      )}
    </label>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function ImapConnectModal({ open, onClose, onConnected, account }) {
  ensureCSS();

  const imap     = useContext(ImapContext);
  const isReauth = !!account;

  const [form,         setForm]         = useState(blank);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedHint,    setSavedHint]    = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSubmitting(false);
    setSavedHint(false);
    if (account) {
      setForm(fromAccount(account));
      setShowAdvanced(false);
    } else {
      setForm(blank);
      setShowAdvanced(false);
    }
  }, [open, account]);

  const detected = useMemo(() => presetFor(form.email), [form.email]);

  // Known provider: email domain is in PRESETS
  const isKnown = !!(savedHint || detected);
  // Unknown custom domain: has a domain typed but not in PRESETS
  const hasUnknownDomain = !detected && !savedHint
    && form.email.includes("@")
    && (form.email.split("@")[1]?.length ?? 0) > 2;

  useEffect(() => {
    if (isReauth || !form.email.includes("@")) return;
    let cancelled = false;
    getImapSavedByEmail(form.email).then(saved => {
      if (cancelled) return;
      if (saved) {
        setForm(prev => ({
          ...prev,
          imap_host:     saved.imap_host     || prev.imap_host,
          imap_port:     saved.imap_port     || prev.imap_port,
          imap_use_ssl:  saved.imap_use_ssl  ?? prev.imap_use_ssl,
          imap_starttls: saved.imap_starttls ?? prev.imap_starttls,
          smtp_host:     saved.smtp_host     || prev.smtp_host,
          smtp_port:     saved.smtp_port     || prev.smtp_port,
          smtp_use_ssl:  saved.smtp_use_ssl  ?? prev.smtp_use_ssl,
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
      // Unknown provider — open server settings automatically
      const dom = form.email.split("@")[1];
      if (dom && dom.length > 2) {
        setSavedHint(false);
        setShowAdvanced(true);
      }
    });
    return () => { cancelled = true; };
  }, [form.email, isReauth]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError(null);
    if (!form.email || !form.password) { setError("E-Mail und Passwort sind Pflicht."); return; }
    if ((showAdvanced || hasUnknownDomain) && !form.imap_host) {
      setError("IMAP-Host ist Pflicht."); return;
    }
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

      await saveImapConfig({ ...form, imap_host: payload.imap_host });
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

  const needsAppPassword = detected?.name &&
    ["Mailbox.org", "Posteo", "Fastmail", "Yandex Mail"].includes(detected.name);

  // Server settings panel is shown when:
  // - unknown provider (always, auto-opened)
  // - user manually expanded it for a known provider
  const showServerPanel = hasUnknownDomain || showAdvanced;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50, padding: "1rem",
    }}>
      <div style={{
        background: "#0d0c0b",
        border: "1px solid rgba(var(--ink-tint),0.07)",
        borderRadius: 14,
        width: "100%", maxWidth: 480,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
      }}>
        <form onSubmit={handleSubmit} style={{
          padding: "1.5rem",
          display: "flex", flexDirection: "column", gap: "1.25rem",
        }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#efede7" }}>
                {isReauth ? "Verbindung erneuern" : "Postfach verbinden"}
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "rgba(var(--ink-tint),.5)" }}>
                {isReauth
                  ? "Gib dein aktuelles Passwort ein."
                  : "Verbinde dein Business-Postfach (z.B. info@deine-firma.de)."}
              </p>
            </div>
            <button type="button" onClick={onClose} className="nim-close" style={{ marginLeft: 12 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* E-Mail */}
          <div>
            <Label hint="Deine Business-E-Mail-Adresse, z.B. info@deine-firma.de">
              E-Mail Adresse
            </Label>
            <input
              type="email" autoComplete="username"
              value={form.email}
              onChange={e => { update("email", e.target.value); setSavedHint(false); }}
              placeholder="info@dein-business.de"
              disabled={isReauth}
              className="nim-input"
              required
            />
            {savedHint && !isReauth && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c5a572" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                <span style={{ fontSize: "0.75rem", color: "#c5a572" }}>
                  Einstellungen gespeichert — nur Passwort eingeben.
                </span>
              </div>
            )}
            {!savedHint && detected && !isReauth && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", flexShrink: 0 }}/>
                <span style={{ fontSize: "0.75rem", color: "#34d399" }}>
                  {detected.name} erkannt — automatisch konfiguriert.
                </span>
              </div>
            )}
            {hasUnknownDomain && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", flexShrink: 0 }}/>
                <span style={{ fontSize: "0.75rem", color: "#fbbf24" }}>
                  Unbekannter Provider — IMAP-Daten deines Hosters eingeben.
                </span>
              </div>
            )}
          </div>

          {/* Passwort */}
          <div>
            <Label hint="Bei aktivierter 2-Faktor-Authentifizierung ein App-Passwort verwenden">
              Passwort
            </Label>
            <input
              type="password" autoComplete="current-password"
              value={form.password}
              onChange={e => update("password", e.target.value)}
              placeholder="••••••••"
              className="nim-input"
              required
            />
            {needsAppPassword && (
              <p style={{ margin: "6px 0 0", fontSize: "0.75rem", color: "#fbbf24", lineHeight: 1.5 }}>
                {detected.name} erfordert bei 2FA ein <strong>App-Passwort</strong> — in den Sicherheitseinstellungen des Kontos erstellen.
              </p>
            )}
            <p style={{ margin: "5px 0 0", fontSize: "0.71rem", color: "rgba(var(--ink-tint),.22)" }}>
              Verschlüsselt gespeichert. Wird nie lokal oder im Browser abgelegt.
            </p>
          </div>

          {/* Anzeigename */}
          <div>
            <Label hint="Wird als Absendername in ausgehenden E-Mails angezeigt">
              Anzeigename{" "}
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "rgba(var(--ink-tint),.22)" }}>
                (optional)
              </span>
            </Label>
            <input
              type="text"
              value={form.display_name}
              onChange={e => update("display_name", e.target.value)}
              placeholder="z.B. Müller GmbH Service"
              className="nim-input"
            />
          </div>

          {/* Server settings — only shown for unknown providers or if manually expanded */}
          {showServerPanel && (
            <div style={{
              border: "1px solid rgba(var(--ink-tint),0.07)",
              borderRadius: 10, padding: "1rem",
              background: "rgba(var(--tint),0.02)",
              display: "flex", flexDirection: "column", gap: "1rem",
            }}>

              {/* IMAP */}
              <div>
                <p style={{
                  margin: "0 0 10px", fontSize: "0.68rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "rgba(var(--ink-tint),.28)",
                }}>
                  Eingang (IMAP)
                </p>
                {/* Host + Port side by side */}
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <Label hint="IMAP-Serveradresse deines Providers, z.B. imap.mailbox.org">Host</Label>
                    <input type="text" value={form.imap_host}
                      onChange={e => update("imap_host", e.target.value)}
                      placeholder="imap.dein-provider.de"
                      className="nim-input-sm" />
                  </div>
                  <div style={{ width: 72, flexShrink: 0 }}>
                    <Label hint="993 für SSL/TLS, 143 für STARTTLS">Port</Label>
                    <input type="number" value={form.imap_port}
                      onChange={e => update("imap_port", e.target.value)}
                      className="nim-input-sm" />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                  <Tip text="Empfohlen. Verschlüsselt von Beginn an (Port 993).">
                    <label style={{ fontSize: "0.78rem", color: "rgba(var(--ink-tint),.5)", display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                      <input type="checkbox" style={{ accentColor: "#c5a572" }} checked={form.imap_use_ssl}
                        onChange={e => update("imap_use_ssl", e.target.checked)} />
                      SSL/TLS
                    </label>
                  </Tip>
                  <Tip text="Startet unverschlüsselt, wechselt dann auf TLS (Port 143). Nur wenn SSL nicht funktioniert.">
                    <label style={{ fontSize: "0.78rem", color: "rgba(var(--ink-tint),.5)", display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                      <input type="checkbox" style={{ accentColor: "#c5a572" }} checked={form.imap_starttls}
                        onChange={e => update("imap_starttls", e.target.checked)} />
                      STARTTLS
                    </label>
                  </Tip>
                </div>
              </div>

              {/* SMTP */}
              <div>
                <p style={{
                  margin: "0 0 10px", fontSize: "0.68rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "rgba(var(--ink-tint),.28)",
                }}>
                  Ausgang (SMTP){" "}
                  <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span>
                </p>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <Label hint="SMTP-Serveradresse für ausgehende E-Mails, z.B. smtp.mailbox.org">Host</Label>
                    <input type="text" value={form.smtp_host}
                      onChange={e => update("smtp_host", e.target.value)}
                      placeholder="smtp.dein-provider.de"
                      className="nim-input-sm" />
                  </div>
                  <div style={{ width: 72, flexShrink: 0 }}>
                    <Label hint="465 für SSL, 587 für STARTTLS">Port</Label>
                    <input type="number" value={form.smtp_port}
                      onChange={e => update("smtp_port", e.target.value)}
                      className="nim-input-sm" />
                  </div>
                </div>
                <Tip text="Port 465 mit direkter SSL-Verschlüsselung. Alternativ: Port 587 mit STARTTLS.">
                  <label style={{ fontSize: "0.78rem", color: "rgba(var(--ink-tint),.5)", display: "flex", alignItems: "center", gap: 7, marginTop: 10, cursor: "pointer" }}>
                    <input type="checkbox" style={{ accentColor: "#c5a572" }} checked={!!form.smtp_use_ssl}
                      onChange={e => update("smtp_use_ssl", e.target.checked)} />
                    SSL auf Port 465
                  </label>
                </Tip>
              </div>

              {/* Login-Benutzername */}
              <div>
                <Label hint="Nur ausfüllen wenn der Login-Name von der E-Mail-Adresse abweicht — bei den meisten Providern leer lassen.">
                  Login-Name{" "}
                  <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "rgba(var(--ink-tint),.22)" }}>
                    (meist leer lassen)
                  </span>
                </Label>
                <input type="text" value={form.username}
                  onChange={e => update("username", e.target.value)}
                  placeholder={form.email || "Identisch mit E-Mail-Adresse"}
                  className="nim-input-sm" />
              </div>
            </div>
          )}

          {/* For known providers: subtle link to manually open server settings */}
          {isKnown && !showAdvanced && (
            <button type="button" className="nim-toggle" onClick={() => setShowAdvanced(true)}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              Servereinstellungen manuell anpassen
            </button>
          )}
          {isKnown && showAdvanced && (
            <button type="button" className="nim-toggle" onClick={() => setShowAdvanced(false)}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: "rotate(90deg)" }}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              Servereinstellungen ausblenden
            </button>
          )}

          {error && (
            <div style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 10, padding: "0.75rem",
              fontSize: "0.83rem", color: "#f87171", lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          {/* BetrVG §87(1) Nr. 6 notice for company accounts */}
          <div style={{
            background: "rgba(96,165,250,0.07)",
            border: "1px solid rgba(96,165,250,0.2)",
            borderRadius: 10, padding: "0.75rem",
            fontSize: "0.75rem", color: "rgba(147,197,253,0.85)", lineHeight: 1.55,
          }}>
            <span style={{ fontWeight: 700 }}>ℹ Hinweis für Unternehmenskonten:</span>{" "}
            Wenn Sie ein Firmen-E-Mail-Konto verbinden und Mitarbeiter-E-Mails verarbeiten,
            beachten Sie, dass die KI-gestützte Analyse ggf. der Mitbestimmung des Betriebsrats
            gemäß §87 Abs.&nbsp;1 Nr.&nbsp;6 BetrVG bedarf.
          </div>

          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.25rem" }}>
            <button type="button" onClick={onClose} disabled={submitting} className="nim-btn-ghost">
              Abbrechen
            </button>
            <button type="submit" disabled={submitting} className="nim-btn-primary">
              {submitting ? (
                <><span className="nim-spinner" />Verbinde…</>
              ) : isReauth ? "Erneut verbinden" : "Postfach verbinden"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
