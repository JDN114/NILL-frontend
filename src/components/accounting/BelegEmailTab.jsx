// src/components/accounting/BelegEmailTab.jsx — Belege per E-Mail einreichen (F19)
import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function BelegEmailTab() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    api.get("/api/v1/beleg-email")
      .then(r => setSettings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleAuto = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const r = await api.patch("/api/v1/beleg-email", { auto_process: !settings.auto_process });
      setSettings(r.data);
    } finally { setSaving(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(settings.inbox_alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="ac-loading"><span className="ac-spinner" />Lade E-Mail-Einstellungen…</div>;

  return (
    <div>
      <div style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>
        Belege per E-Mail einreichen
      </div>
      <div style={{ fontSize: ".85rem", color: "var(--ink2)", marginBottom: 20 }}>
        Sende Belege direkt als E-Mail-Anhang — automatische KI-Erkennung und Archivierung.
      </div>

      {settings && (
        <>
          {/* Inbox-Adresse */}
          <div className="ac-card" style={{ marginBottom: 16 }}>
            <div className="ac-section-title" style={{ marginBottom: 12 }}>Ihre persönliche Beleg-Inbox</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{
                flex: 1, background: "var(--surface2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "10px 14px",
                fontFamily: "JetBrains Mono, monospace", fontSize: ".95rem",
                color: "var(--accent)", letterSpacing: ".02em",
              }}>
                {settings.inbox_alias}
              </div>
              <button className="ac-btn ac-btn-primary" onClick={copy} style={{ flexShrink: 0 }}>
                {copied ? "✓ Kopiert!" : "Kopieren"}
              </button>
            </div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {(settings.anleitung || []).map((line, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: ".83rem", color: "var(--ink2)", lineHeight: 1.5 }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>›</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Einstellungen */}
          <div className="ac-card" style={{ marginBottom: 16 }}>
            <div className="ac-section-title" style={{ marginBottom: 12 }}>Einstellungen</div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: ".9rem" }}>
              <input type="checkbox" checked={settings.auto_process ?? true}
                onChange={toggleAuto} disabled={saving}
                style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
              <div>
                <div style={{ fontWeight: 500 }}>Automatische Verarbeitung</div>
                <div style={{ fontSize: ".78rem", color: "var(--ink2)" }}>
                  Anhänge werden sofort KI-gestützt vorverarbeitet und im Belegarchiv gespeichert.
                </div>
              </div>
            </label>
          </div>

          {/* Unterstützte Formate */}
          <div className="ac-card">
            <div className="ac-section-title" style={{ marginBottom: 12 }}>Unterstützte Formate & Limits</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {(settings.unterstuetzte_formate || ["PDF", "JPG", "PNG", "HEIC"]).map(f => (
                <span key={f} className="ac-badge ac-badge-green">{f}</span>
              ))}
            </div>
            <div style={{ fontSize: ".83rem", color: "var(--ink2)", lineHeight: 1.6 }}>
              Max. 10 MB pro E-Mail · Max. 5 Anhänge · Betreff wird als Beschreibung verwendet.
              <br />
              Status:{" "}
              <span style={{ color: settings.status === "aktiv" ? "var(--accent)" : "var(--a3)", fontWeight: 600 }}>
                {settings.status === "aktiv" ? "Aktiv" : "Inaktiv"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
