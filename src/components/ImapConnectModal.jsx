// src/components/ImapConnectModal.jsx
//
// Connect-/Reauth-Form für Custom-Domain-Postfächer.
//
// Features:
//   - Auto-Detection der Server-Settings basierend auf Email-Domain
//     (Mailbox.org, Posteo, IONOS, Strato, GMX, Web.de, T-Online, Fastmail, …).
//   - Manuelle Override-Eingaben (host/port/SSL/STARTTLS) wenn Provider unbekannt.
//   - Test-Button: probt die Verbindung end-to-end via /imap/connect
//     (Backend testet vor dem Speichern).
//   - Reauth-Modus: wenn `account` prop gesetzt ist, sind alle Felder vorbefüllt
//     und das Modal heißt „Verbindung erneuern".
//
// Props:
//   open       : bool
//   onClose    : () => void
//   onConnected: (account) => void  — nach erfolgreichem Connect
//   account    : optional, Reauth-Modus
//
// Erfordert: ImapContext (für connectImap / reauthAccount)

import React, { useContext, useEffect, useMemo, useState } from "react";
import { ImapContext } from "../context/ImapContext";

// ── Provider-Presets (Top-DACH-Provider + ein paar internationale) ──────
const PRESETS = {
  "mailbox.org":   { imap: "imap.mailbox.org",       imapPort: 993, ssl: true,  smtp: "smtp.mailbox.org",       smtpPort: 465, smtpSsl: true  },
  "posteo.de":     { imap: "posteo.de",              imapPort: 993, ssl: true,  smtp: "posteo.de",              smtpPort: 465, smtpSsl: true  },
  "posteo.net":    { imap: "posteo.de",              imapPort: 993, ssl: true,  smtp: "posteo.de",              smtpPort: 465, smtpSsl: true  },
  "ionos.de":      { imap: "imap.ionos.de",          imapPort: 993, ssl: true,  smtp: "smtp.ionos.de",          smtpPort: 465, smtpSsl: true  },
  "1und1.de":      { imap: "imap.1und1.de",          imapPort: 993, ssl: true,  smtp: "smtp.1und1.de",          smtpPort: 465, smtpSsl: true  },
  "strato.de":     { imap: "imap.strato.de",         imapPort: 993, ssl: true,  smtp: "smtp.strato.de",         smtpPort: 465, smtpSsl: true  },
  "gmx.de":        { imap: "imap.gmx.net",           imapPort: 993, ssl: true,  smtp: "mail.gmx.net",           smtpPort: 465, smtpSsl: true  },
  "gmx.net":       { imap: "imap.gmx.net",           imapPort: 993, ssl: true,  smtp: "mail.gmx.net",           smtpPort: 465, smtpSsl: true  },
  "web.de":        { imap: "imap.web.de",            imapPort: 993, ssl: true,  smtp: "smtp.web.de",            smtpPort: 587, smtpSsl: false },
  "t-online.de":   { imap: "secureimap.t-online.de", imapPort: 993, ssl: true,  smtp: "securesmtp.t-online.de", smtpPort: 465, smtpSsl: true  },
  "fastmail.com":  { imap: "imap.fastmail.com",      imapPort: 993, ssl: true,  smtp: "smtp.fastmail.com",      smtpPort: 465, smtpSsl: true  },
  "yandex.com":    { imap: "imap.yandex.com",        imapPort: 993, ssl: true,  smtp: "smtp.yandex.com",        smtpPort: 465, smtpSsl: true  },
};

function presetFor(email) {
  if (!email) return null;
  const dom = email.split("@")[1]?.toLowerCase();
  if (!dom) return null;
  if (PRESETS[dom]) return { domain: dom, ...PRESETS[dom] };
  // Heuristik für „eigene Domain mit Standard-Setup": imap.<domain>:993 SSL
  return null;
}

const initialFromAccount = (account) => account ? ({
  email:        account.email ?? "",
  display_name: account.display_name ?? "",
  imap_host:    account.imap_host ?? "",
  imap_port:    account.imap_port ?? 993,
  imap_use_ssl: account.imap_use_ssl ?? true,
  imap_starttls: account.imap_starttls ?? false,
  smtp_host:    account.smtp_host ?? "",
  smtp_port:    account.smtp_port ?? 465,
  smtp_use_ssl: account.smtp_use_ssl ?? true,
  username:     account.username ?? account.email ?? "",
  password:     "",
}) : ({
  email: "", display_name: "",
  imap_host: "", imap_port: 993, imap_use_ssl: true, imap_starttls: false,
  smtp_host: "", smtp_port: 465, smtp_use_ssl: true,
  username: "", password: "",
});

export default function ImapConnectModal({ open, onClose, onConnected, account }) {
  const imap = useContext(ImapContext);

  const [form, setForm] = useState(() => initialFromAccount(account));
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(!!account);

  const isReauth = !!account;

  // Reset wenn das Modal frisch geöffnet wird oder Account wechselt
  useEffect(() => {
    if (open) {
      setForm(initialFromAccount(account));
      setError(null);
      setShowAdvanced(!!account);
    }
  }, [open, account]);

  // Auto-Detection bei Email-Eingabe
  const detected = useMemo(() => presetFor(form.email), [form.email]);
  useEffect(() => {
    if (!detected || isReauth) return;
    setForm(prev => ({
      ...prev,
      imap_host:    prev.imap_host    || detected.imap,
      imap_port:    prev.imap_port    || detected.imapPort,
      imap_use_ssl: detected.ssl,
      smtp_host:    prev.smtp_host    || detected.smtp,
      smtp_port:    prev.smtp_port    || detected.smtpPort,
      smtp_use_ssl: detected.smtpSsl,
      username:     prev.username     || prev.email,
    }));
  }, [detected, isReauth]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError(null);

    if (!form.email || !form.password || !form.imap_host) {
      setError("E-Mail, Passwort und IMAP-Host sind Pflicht.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        email:         form.email,
        display_name:  form.display_name || null,
        imap_host:     form.imap_host,
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
      onConnected?.(result);
      onClose?.();
    } catch (err) {
      console.error("[ImapConnectModal] connect error", err);
      const detail = err?.response?.data?.detail;
      if (typeof detail === "object" && detail?.error) {
        setError(detail.error);
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Verbindung fehlgeschlagen. Server, Port und Passwort prüfen.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isReauth ? "Verbindung erneuern" : "Custom Domain verbinden"}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {isReauth
                ? "Passwort eingeben um die Verbindung wiederherzustellen."
                : "Verbinde dein eigenes Postfach (z.B. info@dein-business.de) per IMAP."}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm mb-1 block">E-Mail Adresse</label>
            <input
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={e => update("email", e.target.value)}
              placeholder="info@dein-business.de"
              disabled={isReauth}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 text-sm disabled:opacity-60"
              required
            />
            {detected && !isReauth && (
              <p className="text-xs text-emerald-400 mt-1">
                Erkannt: {detected.domain} — Server-Settings automatisch befüllt.
              </p>
            )}
          </div>

          {/* Anzeigename */}
          <div>
            <label className="text-gray-300 text-sm mb-1 block">
              Anzeigename <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={e => update("display_name", e.target.value)}
              placeholder="z.B. Müller GmbH Service"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 text-sm"
            />
          </div>

          {/* Passwort */}
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Passwort</label>
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={e => update("password", e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Wird verschlüsselt gespeichert (Fernet/AES-128).
            </p>
          </div>

          {/* Erweiterte Einstellungen */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(s => !s)}
              className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              {showAdvanced ? "▾" : "▸"} Server-Einstellungen {detected && !showAdvanced && "(Auto)"}
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-4 border border-gray-800 rounded-xl p-4">
              {/* IMAP */}
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Eingang (IMAP)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Host</label>
                    <input
                      type="text"
                      value={form.imap_host}
                      onChange={e => update("imap_host", e.target.value)}
                      placeholder="imap.dein-provider.de"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Port</label>
                    <input
                      type="number"
                      value={form.imap_port}
                      onChange={e => update("imap_port", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <label className="text-xs text-gray-300 flex items-center gap-2">
                    <input type="checkbox" checked={form.imap_use_ssl}
                      onChange={e => update("imap_use_ssl", e.target.checked)} />
                    SSL/TLS
                  </label>
                  <label className="text-xs text-gray-300 flex items-center gap-2">
                    <input type="checkbox" checked={form.imap_starttls}
                      onChange={e => update("imap_starttls", e.target.checked)} />
                    STARTTLS
                  </label>
                </div>
              </div>

              {/* SMTP */}
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                  Ausgang (SMTP) <span className="text-gray-600 normal-case">— optional, für Senden</span>
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Host</label>
                    <input
                      type="text"
                      value={form.smtp_host}
                      onChange={e => update("smtp_host", e.target.value)}
                      placeholder="smtp.dein-provider.de"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Port</label>
                    <input
                      type="number"
                      value={form.smtp_port}
                      onChange={e => update("smtp_port", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="text-xs text-gray-300 flex items-center gap-2">
                    <input type="checkbox" checked={!!form.smtp_use_ssl}
                      onChange={e => update("smtp_use_ssl", e.target.checked)} />
                    SSL (Port 465). Sonst STARTTLS auf Port 587.
                  </label>
                </div>
              </div>

              {/* Username Override */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">
                  Login-Username <span className="text-gray-600">(falls abweichend von Email)</span>
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => update("username", e.target.value)}
                  placeholder={form.email}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 text-white transition text-sm"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl font-medium bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition disabled:opacity-50 text-sm"
            >
              {submitting
                ? "Verbinde …"
                : isReauth ? "Erneut verbinden" : "Verbinden & testen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
