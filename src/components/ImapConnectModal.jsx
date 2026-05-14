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

// ── Design tokens (matching SettingsPage) ──────────────────────────────────

const T = {
  text:     "#efede7",
  dim:      "rgba(239,237,231,.5)",
  mute:     "rgba(239,237,231,.28)",
  gold:     "#c5a572",
  border:   "rgba(239,237,231,0.07)",
  borderHi: "rgba(197,165,114,0.28)",
  surface:  "rgba(255,255,255,0.03)",
  red:      "#f87171",
  green:    "#34d399",
  amber:    "#fbbf24",
};

const inputStyle = {
  width: "100%",
  padding: "0.55rem 0.85rem",
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${T.border}`,
  borderRadius: 9,
  color: T.text,
  fontSize: "0.83rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const inputSmStyle = {
  ...inputStyle,
  padding: "0.4rem 0.65rem",
  fontSize: "0.78rem",
  borderRadius: 8,
};

const labelStyle = {
  fontSize: "0.72rem",
  fontWeight: 700,
  color: T.dim,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  display: "block",
  marginBottom: 5,
};

const subHeadStyle = {
  fontSize: "0.68rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: T.mute,
  marginBottom: 8,
};

export default function ImapConnectModal({ open, onClose, onConnected, account }) {
  const imap    = useContext(ImapContext);
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
      setShowAdvanced(true);
    } else {
      setForm(blank);
      setShowAdvanced(false);
    }
  }, [open, account]);

  const detected = useMemo(() => presetFor(form.email), [form.email]);

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
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50, padding: "1rem",
    }}>
      <div style={{
        background: "#0d0c0b",
        border: `1px solid ${T.border}`,
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
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: T.text }}>
                {isReauth ? "Verbindung erneuern" : "Postfach verbinden"}
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: T.dim }}>
                {isReauth
                  ? "Gib dein aktuelles Passwort ein."
                  : "Verbinde dein Business-Postfach (z.B. info@deine-firma.de)."}
              </p>
            </div>
            <button type="button" onClick={onClose} style={{
              background: "none", border: "none", cursor: "pointer",
              color: T.mute, padding: 4, flexShrink: 0, marginLeft: 12,
              display: "flex", alignItems: "center", lineHeight: 1,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* E-Mail */}
          <div>
            <label style={labelStyle}>E-Mail Adresse</label>
            <input
              type="email" autoComplete="username"
              value={form.email}
              onChange={e => { update("email", e.target.value); setSavedHint(false); }}
              placeholder="info@dein-business.de"
              disabled={isReauth}
              style={{ ...inputStyle, opacity: isReauth ? 0.55 : 1 }}
              required
            />
            {savedHint && !isReauth && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                <span style={{ fontSize: "0.75rem", color: T.gold }}>
                  Gespeicherte Einstellungen geladen — nur Passwort eingeben.
                </span>
              </div>
            )}
            {!savedHint && detected && !isReauth && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, flexShrink: 0 }}/>
                <span style={{ fontSize: "0.75rem", color: T.green }}>
                  {detected.name} erkannt — Servereinstellungen automatisch konfiguriert.
                </span>
              </div>
            )}
            {!savedHint && !detected && form.email.includes("@") && (form.email.split("@")[1]?.length ?? 0) > 2 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.amber, flexShrink: 0 }}/>
                <span style={{ fontSize: "0.75rem", color: T.amber }}>
                  Provider unbekannt — Servereinstellungen unten ausfüllen.
                </span>
              </div>
            )}
          </div>

          {/* Passwort */}
          <div>
            <label style={labelStyle}>Passwort</label>
            <input
              type="password" autoComplete="current-password"
              value={form.password}
              onChange={e => update("password", e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              required
            />
            {needsAppPassword && (
              <p style={{ margin: "6px 0 0", fontSize: "0.75rem", color: T.amber, lineHeight: 1.5 }}>
                <strong style={{ color: T.amber }}>Hinweis:</strong> {detected.name} erfordert bei 2FA ein{" "}
                <strong>App-Passwort</strong> — in den Sicherheitseinstellungen des Kontos erstellen.
              </p>
            )}
            <p style={{ margin: "5px 0 0", fontSize: "0.72rem", color: T.mute }}>
              Wird verschlüsselt gespeichert. Passwort wird nie lokal gespeichert.
            </p>
          </div>

          {/* Anzeigename */}
          <div>
            <label style={labelStyle}>
              Anzeigename{" "}
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: T.mute }}>
                (optional)
              </span>
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={e => update("display_name", e.target.value)}
              placeholder="z.B. Müller GmbH Service"
              style={inputStyle}
            />
          </div>

          {/* Advanced toggle */}
          <button type="button" onClick={() => setShowAdvanced(s => !s)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            fontSize: "0.78rem", color: T.mute, padding: 0,
            transition: "color 0.15s",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: showAdvanced ? "rotate(90deg)" : "none", transition: "transform .15s", flexShrink: 0 }}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            Servereinstellungen {(detected || savedHint) && !showAdvanced ? "(automatisch)" : ""}
          </button>

          {showAdvanced && (
            <div style={{
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: "1rem",
              background: "rgba(255,255,255,0.02)",
              display: "flex", flexDirection: "column", gap: "1rem",
            }}>
              {/* IMAP */}
              <div>
                <p style={subHeadStyle}>Eingang (IMAP)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ ...labelStyle, textTransform: "none", fontSize: "0.72rem", letterSpacing: 0 }}>Host</label>
                    <input type="text" value={form.imap_host}
                      onChange={e => update("imap_host", e.target.value)}
                      placeholder="imap.dein-provider.de"
                      style={inputSmStyle} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, textTransform: "none", fontSize: "0.72rem", letterSpacing: 0 }}>Port</label>
                    <input type="number" value={form.imap_port}
                      onChange={e => update("imap_port", e.target.value)}
                      style={inputSmStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                  <label style={{ fontSize: "0.78rem", color: T.dim, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                    <input type="checkbox" style={{ accentColor: T.gold }} checked={form.imap_use_ssl}
                      onChange={e => update("imap_use_ssl", e.target.checked)} />
                    SSL/TLS <span style={{ color: T.mute }}>(Port 993)</span>
                  </label>
                  <label style={{ fontSize: "0.78rem", color: T.dim, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                    <input type="checkbox" style={{ accentColor: T.gold }} checked={form.imap_starttls}
                      onChange={e => update("imap_starttls", e.target.checked)} />
                    STARTTLS <span style={{ color: T.mute }}>(Port 143)</span>
                  </label>
                </div>
              </div>

              {/* SMTP */}
              <div>
                <p style={subHeadStyle}>
                  Ausgang (SMTP){" "}
                  <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span>
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ ...labelStyle, textTransform: "none", fontSize: "0.72rem", letterSpacing: 0 }}>Host</label>
                    <input type="text" value={form.smtp_host}
                      onChange={e => update("smtp_host", e.target.value)}
                      placeholder="smtp.dein-provider.de"
                      style={inputSmStyle} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, textTransform: "none", fontSize: "0.72rem", letterSpacing: 0 }}>Port</label>
                    <input type="number" value={form.smtp_port}
                      onChange={e => update("smtp_port", e.target.value)}
                      style={inputSmStyle} />
                  </div>
                </div>
                <label style={{ fontSize: "0.78rem", color: T.dim, display: "flex", alignItems: "center", gap: 7, marginTop: 10, cursor: "pointer" }}>
                  <input type="checkbox" style={{ accentColor: T.gold }} checked={!!form.smtp_use_ssl}
                    onChange={e => update("smtp_use_ssl", e.target.checked)} />
                  SSL auf Port 465 <span style={{ color: T.mute }}>(sonst STARTTLS auf 587)</span>
                </label>
              </div>

              {/* Username override */}
              <div>
                <label style={{ ...labelStyle, textTransform: "none", fontSize: "0.72rem", letterSpacing: 0 }}>
                  Login-Benutzername{" "}
                  <span style={{ color: T.mute }}>(nur wenn abweichend von der E-Mail)</span>
                </label>
                <input type="text" value={form.username}
                  onChange={e => update("username", e.target.value)}
                  placeholder={form.email || "In 95% der Fälle leer lassen"}
                  style={inputSmStyle} />
              </div>
            </div>
          )}

          {error && (
            <div style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 10, padding: "0.75rem",
              fontSize: "0.83rem", color: T.red, lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.25rem" }}>
            <button type="button" onClick={onClose} disabled={submitting} style={{
              padding: "0.5rem 1.1rem",
              background: "transparent",
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              color: T.dim,
              fontSize: "0.83rem",
              cursor: "pointer",
              opacity: submitting ? 0.4 : 1,
            }}>
              Abbrechen
            </button>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "0.55rem 1rem",
              background: T.gold,
              border: "none", borderRadius: 8,
              color: "#000", fontWeight: 700,
              fontSize: "0.83rem", cursor: "pointer",
              opacity: submitting ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "opacity 0.15s",
            }}>
              {submitting ? (
                <>
                  <span style={{
                    width: 14, height: 14,
                    border: "2px solid rgba(0,0,0,0.3)",
                    borderTopColor: "#000",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}/>
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
