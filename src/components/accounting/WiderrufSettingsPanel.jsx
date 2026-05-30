// src/components/accounting/WiderrufSettingsPanel.jsx
// Merchant-Einstellungen für Widerrufsbelehrung + AGB
// §§ 312g, 355 BGB
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AUSNAHME_OPTIONEN = [
  { value: "keine",           label: "Kein Ausnahmetatbestand (Standard-Widerrufsrecht gilt)" },
  { value: "digital",        label: "Digitale Inhalte (§ 356 Abs. 5 BGB) — Zustimmung zu Sofortdownload" },
  { value: "individuell",    label: "Nach Kundenspezifikation angefertigte Ware (§ 312g Abs. 2 Nr. 1 BGB)" },
  { value: "sofort_vollzogen", label: "Dienstleistung bei vollständiger Erbringung (§ 356 Abs. 4 BGB)" },
  { value: "b2b",            label: "Nur B2B-Kunden — kein Widerrufsrecht (§§ 312 ff. BGB gelten nur B2C)" },
];

const STANDARD_WIDERRUF = `Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.

Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.

Folgen des Widerrufs: Wenn Sie diesen Vertrag widerrufen, haben wir alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.`;

export default function WiderrufSettingsPanel() {
  const [cfg, setCfg]       = useState(null);
  const [form, setForm]     = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [err, setErr]         = useState("");

  const [antraege, setAntraege] = useState([]);
  const [antragTab, setAntragTab] = useState(false);

  useEffect(() => {
    api.get("/api/v1/widerruf/konfiguration")
      .then(r => { setCfg(r.data); setForm(r.data); })
      .catch(() => setErr("Konfiguration konnte nicht geladen werden."))
      .finally(() => setLoading(false));
  }, []);

  const loadAntraege = () => {
    api.get("/api/v1/widerruf/antraege")
      .then(r => setAntraege(r.data || []))
      .catch(() => {});
  };

  useEffect(() => { if (antragTab) loadAntraege(); }, [antragTab]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setSaved(false); setErr("");
    try {
      const r = await api.put("/api/v1/widerruf/konfiguration", form);
      setCfg(r.data); setForm(r.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  const updateAntrag = async (wid, status) => {
    try {
      await api.put(`/api/v1/widerruf/antraege/${wid}`, { status });
      loadAntraege();
    } catch { /* silent */ }
  };

  if (loading) return <div className="ac-loading"><span className="ac-spinner" /> Lade…</div>;

  return (
    <div>
      {/* Tab-Wechsel */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          className={`ac-btn ac-btn-sm ${!antragTab ? "ac-btn-primary" : "ac-btn-ghost"}`}
          onClick={() => setAntragTab(false)}>
          Konfiguration
        </button>
        <button
          className={`ac-btn ac-btn-sm ${antragTab ? "ac-btn-primary" : "ac-btn-ghost"}`}
          onClick={() => setAntragTab(true)}>
          Widerruf-Anträge {antraege.filter(a => a.status === "eingegangen").length > 0 && (
            <span className="ac-badge ac-badge-pink" style={{ marginLeft: 6, fontSize: ".68rem" }}>
              {antraege.filter(a => a.status === "eingegangen").length}
            </span>
          )}
        </button>
      </div>

      {!antragTab && (
        <div>
          {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 14 }}>{err}</div>}
          {saved && <div className="ac-alert ac-alert-ok" style={{ marginBottom: 14 }}>Gespeichert.</div>}

          {/* Hinweis */}
          <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: ".82rem", color: "#78350f", lineHeight: 1.5 }}>
            <strong>§§ 312g, 355 BGB — Widerrufsrecht im Online-Handel:</strong> Wenn du Zahlungslinks an Endkunden (B2C) sendest, muss die Checkout-Seite AGB und Widerrufsbelehrung anzeigen. Der Kunde muss aktiv zustimmen. Die Zustimmung wird mit Zeitstempel + IP protokolliert (§ 312f BGB).
          </div>

          {/* Ausnahme-Typ */}
          <div className="ac-card" style={{ marginBottom: 16 }}>
            <div className="ac-section-title" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
              Widerrufsrecht-Ausnahme
            </div>
            <div style={{ padding: "14px 16px" }}>
              <label className="ac-label">Ausnahmetatbestand (§ 312g Abs. 2 BGB)</label>
              <select className="ac-select" value={form.ausnahme_typ || "keine"}
                onChange={e => set("ausnahme_typ", e.target.value)}
                style={{ marginBottom: 10 }}>
                {AUSNAHME_OPTIONEN.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <label className="ac-label" style={{ marginTop: 8 }}>Ausnahme-Text (optional, wird dem Kunden angezeigt)</label>
              <textarea className="ac-input" rows={3}
                value={form.ausnahme_text || ""}
                onChange={e => set("ausnahme_text", e.target.value)}
                placeholder="z.B. 'Das Widerrufsrecht erlischt bei digitalen Inhalten nach Lieferung mit Ihrer Zustimmung.'"
                style={{ resize: "vertical" }} />
            </div>
          </div>

          {/* AGB */}
          <div className="ac-card" style={{ marginBottom: 16 }}>
            <div className="ac-section-title" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
              Allgemeine Geschäftsbedingungen (AGB)
            </div>
            <div style={{ padding: "14px 16px" }}>
              <label className="ac-label">AGB-Text (wird auf der Zahlungsseite angezeigt)</label>
              <textarea className="ac-input" rows={8}
                value={form.agb_text || ""}
                onChange={e => set("agb_text", e.target.value)}
                placeholder="Ihre AGB hier eingeben… Alternativ Link zu Ihren AGB einfügen."
                style={{ resize: "vertical", fontFamily: "monospace", fontSize: ".8rem" }} />
              <div style={{ fontSize: ".75rem", color: "var(--ink2)", marginTop: 6 }}>
                Professionelle AGB sind gesetzlich vorgeschrieben (§§ 305 ff. BGB). Bitte durch einen Rechtsanwalt oder einen AGB-Generator (z. B. IT-Recht Kanzlei, Trusted Shops) erstellen lassen.
              </div>
            </div>
          </div>

          {/* Widerrufsbelehrung */}
          <div className="ac-card" style={{ marginBottom: 16 }}>
            <div className="ac-section-title" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
              Widerrufsbelehrung (§ 355 BGB)
            </div>
            <div style={{ padding: "14px 16px" }}>
              <label className="ac-label">Text der Widerrufsbelehrung</label>
              <textarea className="ac-input" rows={10}
                value={form.widerrufsbelehrung_text || STANDARD_WIDERRUF}
                onChange={e => set("widerrufsbelehrung_text", e.target.value)}
                style={{ resize: "vertical", fontFamily: "monospace", fontSize: ".8rem" }} />
              <button className="ac-btn ac-btn-ghost ac-btn-sm" style={{ marginTop: 8 }}
                onClick={() => set("widerrufsbelehrung_text", STANDARD_WIDERRUF)}>
                Standard-Text wiederherstellen
              </button>
            </div>
          </div>

          {/* Kontakt für Widerruf */}
          <div className="ac-card" style={{ marginBottom: 20 }}>
            <div className="ac-section-title" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
              Widerruf-Kontakt (§ 355 BGB)
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div className="ac-form-row">
                <div className="ac-form-col">
                  <label className="ac-label">Widerruf-E-Mail</label>
                  <input className="ac-input" value={form.widerruf_email || ""}
                    onChange={e => set("widerruf_email", e.target.value)}
                    placeholder="widerruf@meinshop.de" type="email" />
                </div>
                <div className="ac-form-col">
                  <label className="ac-label">Widerruf-Postadresse</label>
                  <input className="ac-input" value={form.widerruf_adresse || ""}
                    onChange={e => set("widerruf_adresse", e.target.value)}
                    placeholder="Muster GmbH, Musterstraße 1, 12345 Berlin" />
                </div>
              </div>
            </div>
          </div>

          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Speichern…" : "Einstellungen speichern"}
          </button>
        </div>
      )}

      {antragTab && (
        <div>
          {antraege.length === 0 ? (
            <div className="ac-empty">Noch keine Widerruf-Anträge eingegangen.</div>
          ) : (
            <div className="ac-table-wrap">
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Rechnung-ID</th>
                    <th>Kunde</th>
                    <th>E-Mail</th>
                    <th>Status</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {antraege.map(a => (
                    <tr key={a.id}>
                      <td className="ac-mono">{String(a.zeitstempel).slice(0, 10)}</td>
                      <td className="ac-mono">#{a.rechnung_id}</td>
                      <td>{a.kunde_name}</td>
                      <td style={{ fontSize: ".83rem" }}>{a.kunde_email}</td>
                      <td>
                        <span className={`ac-badge ${
                          a.status === "eingegangen"   ? "ac-badge-purple" :
                          a.status === "stattgegeben"  ? "ac-badge-green"  :
                          a.status === "abgelehnt"     ? "ac-badge-pink"   :
                          "ac-badge-gray"
                        }`} style={{ fontSize: ".72rem" }}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {a.status === "eingegangen" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="ac-btn ac-btn-ghost ac-btn-sm"
                              onClick={() => updateAntrag(a.id, "stattgegeben")}>
                              Stattgeben
                            </button>
                            <button className="ac-btn ac-btn-ghost ac-btn-sm"
                              style={{ color: "var(--a3)" }}
                              onClick={() => updateAntrag(a.id, "abgelehnt")}>
                              Ablehnen
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
