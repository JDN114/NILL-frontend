// src/components/accounting/AngeboteTab.jsx — Angebote / Kostenvoranschläge
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const STATUS_META = {
  entwurf:     { label: "Entwurf",     cls: "ac-badge-gray" },
  gesendet:    { label: "Gesendet",    cls: "ac-badge-purple" },
  angenommen:  { label: "Angenommen",  cls: "ac-badge-green" },
  abgelehnt:   { label: "Abgelehnt",   cls: "ac-badge-pink" },
  konvertiert: { label: "Konvertiert", cls: "ac-badge-purple" },
};

const EMPTY_POS = { beschreibung: "", menge: 1, einheit: "Std.", einzelpreis: "", rabatt_prozent: 0, ust_satz: 19 };

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY_FORM = {
  empfaenger_name: "", empfaenger_zusatz: "", empfaenger_strasse: "",
  empfaenger_plz: "", empfaenger_ort: "", empfaenger_land: "DE", empfaenger_email: "",
  absender_name: "", absender_strasse: "", absender_plz: "", absender_ort: "",
  absender_email: "", absender_ust_id: "", absender_steuernummer: "",
  angebotsdatum: today(), gueltig_bis: "", leistungsdatum: "",
  betreff: "", einleitung: "", schlusstext: "Wir freuen uns auf Ihren Auftrag.",
  kleinunternehmer: false,
  positionen: [{ ...EMPTY_POS }],
};

function calcPos(positionen) {
  let netto = 0, ust = 0;
  for (const p of positionen) {
    const m  = parseFloat(p.menge || 1);
    const ep = parseFloat(p.einzelpreis || 0);
    const rb = parseFloat(p.rabatt_prozent || 0) / 100;
    const sz = parseFloat(p.ust_satz || 19) / 100;
    const pn = m * ep * (1 - rb);
    netto += pn;
    ust   += pn * sz;
  }
  return { netto, ust, brutto: netto + ust };
}

function PositionenEditor({ positionen, onChange }) {
  const set = (idx, field, val) => {
    const next = positionen.map((p, i) => i === idx ? { ...p, [field]: val } : p);
    onChange(next);
  };
  const add = () => onChange([...positionen, { ...EMPTY_POS }]);
  const remove = (idx) => onChange(positionen.filter((_, i) => i !== idx));

  const { netto, ust, brutto } = calcPos(positionen);

  return (
    <div>
      <div className="ac-label" style={{ marginBottom: 8 }}>Positionen</div>
      {positionen.map((p, idx) => (
        <div key={idx} style={{
          background: "var(--surface2)", borderRadius: 8, padding: "12px 14px",
          marginBottom: 8, display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 3, minWidth: 160, display: "flex", flexDirection: "column", gap: 4 }}>
              <label className="ac-label">Beschreibung</label>
              <input className="ac-input" value={p.beschreibung}
                onChange={e => set(idx, "beschreibung", e.target.value)}
                placeholder="Leistungsbeschreibung" />
            </div>
            <div style={{ flex: 1, minWidth: 70, display: "flex", flexDirection: "column", gap: 4 }}>
              <label className="ac-label">Menge</label>
              <input className="ac-input" type="number" min="0" step="0.01" value={p.menge}
                onChange={e => set(idx, "menge", e.target.value)} />
            </div>
            <div style={{ flex: 1, minWidth: 70, display: "flex", flexDirection: "column", gap: 4 }}>
              <label className="ac-label">Einheit</label>
              <input className="ac-input" value={p.einheit}
                onChange={e => set(idx, "einheit", e.target.value)} placeholder="Std." />
            </div>
            <div style={{ flex: 1, minWidth: 90, display: "flex", flexDirection: "column", gap: 4 }}>
              <label className="ac-label">Einzelpreis €</label>
              <input className="ac-input" type="number" min="0" step="0.01" value={p.einzelpreis}
                onChange={e => set(idx, "einzelpreis", e.target.value)} />
            </div>
            <div style={{ flex: 1, minWidth: 70, display: "flex", flexDirection: "column", gap: 4 }}>
              <label className="ac-label">Rabatt %</label>
              <input className="ac-input" type="number" min="0" max="100" step="0.1" value={p.rabatt_prozent}
                onChange={e => set(idx, "rabatt_prozent", e.target.value)} />
            </div>
            <div style={{ flex: 1, minWidth: 70, display: "flex", flexDirection: "column", gap: 4 }}>
              <label className="ac-label">USt %</label>
              <select className="ac-select" value={p.ust_satz}
                onChange={e => set(idx, "ust_satz", e.target.value)}>
                <option value="0">0%</option>
                <option value="7">7%</option>
                <option value="19">19%</option>
              </select>
            </div>
            <button onClick={() => remove(idx)} className="ac-btn ac-btn-danger ac-btn-sm"
              aria-label="Position entfernen" style={{ flexShrink: 0, alignSelf: "flex-end" }} title="Position entfernen">✕</button>
          </div>
        </div>
      ))}
      <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={add} style={{ marginBottom: 12 }}>
        + Position hinzufügen
      </button>
      <div style={{
        display: "flex", justifyContent: "flex-end", gap: 24,
        fontSize: ".85rem", fontFamily: "JetBrains Mono, monospace",
        borderTop: "1px solid var(--border)", paddingTop: 10,
      }}>
        <span style={{ color: "var(--ink2)" }}>Netto: <strong style={{ color: "var(--ink)" }}>{fmtEur(netto)}</strong></span>
        <span style={{ color: "var(--ink2)" }}>USt: <strong style={{ color: "var(--ink)" }}>{fmtEur(ust)}</strong></span>
        <span style={{ color: "var(--accent)" }}>Brutto: <strong>{fmtEur(brutto)}</strong></span>
      </div>
    </div>
  );
}

function AngebotModal({ initial, onSaved, onClose }) {
  const [form, setForm] = useState(() => {
    if (!initial) return { ...EMPTY_FORM };
    return {
      empfaenger_name:      initial.empfaenger_name || "",
      empfaenger_zusatz:    initial.empfaenger_zusatz || "",
      empfaenger_strasse:   initial.empfaenger_strasse || "",
      empfaenger_plz:       initial.empfaenger_plz || "",
      empfaenger_ort:       initial.empfaenger_ort || "",
      empfaenger_land:      initial.empfaenger_land || "DE",
      empfaenger_email:     initial.empfaenger_email || "",
      absender_name:        initial.absender_name || "",
      absender_strasse:     initial.absender_strasse || "",
      absender_plz:         initial.absender_plz || "",
      absender_ort:         initial.absender_ort || "",
      absender_email:       initial.absender_email || "",
      absender_ust_id:      initial.absender_ust_id || "",
      absender_steuernummer:initial.absender_steuernummer || "",
      angebotsdatum:        initial.angebotsdatum?.slice(0, 10) || today(),
      gueltig_bis:          initial.gueltig_bis?.slice(0, 10) || "",
      leistungsdatum:       initial.leistungsdatum?.slice(0, 10) || "",
      betreff:              initial.betreff || "",
      einleitung:           initial.einleitung || "",
      schlusstext:          initial.schlusstext || "Wir freuen uns auf Ihren Auftrag.",
      kleinunternehmer:     initial.kleinunternehmer || false,
      positionen:           (initial.positionen || []).length > 0
        ? initial.positionen.map(p => ({
            beschreibung:    p.beschreibung || "",
            menge:           parseFloat(p.menge || 1),
            einheit:         p.einheit || "Std.",
            einzelpreis:     parseFloat(p.einzelpreis || 0),
            rabatt_prozent:  parseFloat(p.rabatt_prozent || 0),
            ust_satz:        parseFloat(p.ust_satz || 19),
          }))
        : [{ ...EMPTY_POS }],
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.empfaenger_name.trim()) {
      setError("Empfängername ist Pflichtfeld.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        gueltig_bis:    form.gueltig_bis || null,
        leistungsdatum: form.leistungsdatum || null,
      };
      if (initial?.id) {
        await api.put(`/api/v1/angebote/${initial.id}`, payload);
      } else {
        await api.post("/api/v1/angebote", payload);
      }
      onSaved();
    } catch (e) {
      setError(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 780 }}>
        <div className="ac-modal-title">
          {initial?.id ? `Angebot ${initial.angebotsnummer} bearbeiten` : "Neues Angebot"}
        </div>
        {error && <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Absender */}
          <div style={{ fontSize: ".75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>
            Absender
          </div>
          <div className="ac-form-row">
            <div className="ac-form-col" style={{ flex: 2 }}>
              <label className="ac-label">Firmenname / Name</label>
              <input className="ac-input" autoComplete="organization" value={form.absender_name} onChange={e => set("absender_name", e.target.value)} />
            </div>
            <div className="ac-form-col">
              <label className="ac-label">E-Mail</label>
              <input className="ac-input" type="email" autoComplete="email" value={form.absender_email} onChange={e => set("absender_email", e.target.value)} />
            </div>
          </div>
          <div className="ac-form-row">
            <div className="ac-form-col">
              <label className="ac-label">Straße</label>
              <input className="ac-input" value={form.absender_strasse} onChange={e => set("absender_strasse", e.target.value)} />
            </div>
            <div className="ac-form-col" style={{ maxWidth: 90 }}>
              <label className="ac-label">PLZ</label>
              <input className="ac-input" value={form.absender_plz} onChange={e => set("absender_plz", e.target.value)} />
            </div>
            <div className="ac-form-col">
              <label className="ac-label">Ort</label>
              <input className="ac-input" value={form.absender_ort} onChange={e => set("absender_ort", e.target.value)} />
            </div>
          </div>
          <div className="ac-form-row">
            <div className="ac-form-col">
              <label className="ac-label">USt-IdNr.</label>
              <input className="ac-input" value={form.absender_ust_id} onChange={e => set("absender_ust_id", e.target.value)} placeholder="DE123456789" />
            </div>
            <div className="ac-form-col">
              <label className="ac-label">Steuernummer</label>
              <input className="ac-input" value={form.absender_steuernummer} onChange={e => set("absender_steuernummer", e.target.value)} />
            </div>
          </div>

          {/* Empfänger */}
          <div style={{ fontSize: ".75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, marginTop: 4 }}>
            Empfänger
          </div>
          <div className="ac-form-row">
            <div className="ac-form-col" style={{ flex: 2 }}>
              <label className="ac-label">Firmenname / Name *</label>
              <input className="ac-input" value={form.empfaenger_name} onChange={e => set("empfaenger_name", e.target.value)} />
            </div>
            <div className="ac-form-col">
              <label className="ac-label">Zusatz</label>
              <input className="ac-input" value={form.empfaenger_zusatz} onChange={e => set("empfaenger_zusatz", e.target.value)} />
            </div>
          </div>
          <div className="ac-form-row">
            <div className="ac-form-col">
              <label className="ac-label">Straße</label>
              <input className="ac-input" value={form.empfaenger_strasse} onChange={e => set("empfaenger_strasse", e.target.value)} />
            </div>
            <div className="ac-form-col" style={{ maxWidth: 90 }}>
              <label className="ac-label">PLZ</label>
              <input className="ac-input" value={form.empfaenger_plz} onChange={e => set("empfaenger_plz", e.target.value)} />
            </div>
            <div className="ac-form-col">
              <label className="ac-label">Ort</label>
              <input className="ac-input" value={form.empfaenger_ort} onChange={e => set("empfaenger_ort", e.target.value)} />
            </div>
            <div className="ac-form-col" style={{ maxWidth: 80 }}>
              <label className="ac-label">Land</label>
              <input className="ac-input" value={form.empfaenger_land} onChange={e => set("empfaenger_land", e.target.value)} maxLength={2} />
            </div>
          </div>
          <div className="ac-form-row">
            <div className="ac-form-col">
              <label className="ac-label">E-Mail (Empfänger)</label>
              <input className="ac-input" type="email" value={form.empfaenger_email} onChange={e => set("empfaenger_email", e.target.value)} />
            </div>
          </div>

          {/* Angebotsdaten */}
          <div style={{ fontSize: ".75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, marginTop: 4 }}>
            Angebotsdaten
          </div>
          <div className="ac-form-row">
            <div className="ac-form-col">
              <label className="ac-label">Angebotsdatum *</label>
              <input className="ac-input" type="date" value={form.angebotsdatum} onChange={e => set("angebotsdatum", e.target.value)} />
            </div>
            <div className="ac-form-col">
              <label className="ac-label">Gültig bis</label>
              <input className="ac-input" type="date" value={form.gueltig_bis} onChange={e => set("gueltig_bis", e.target.value)} />
            </div>
            <div className="ac-form-col">
              <label className="ac-label">Leistungsdatum</label>
              <input className="ac-input" type="date" value={form.leistungsdatum} onChange={e => set("leistungsdatum", e.target.value)} />
            </div>
          </div>
          <div className="ac-form-row">
            <div className="ac-form-col" style={{ flex: 2 }}>
              <label className="ac-label">Betreff</label>
              <input className="ac-input" value={form.betreff} onChange={e => set("betreff", e.target.value)} placeholder="Angebot für…" />
            </div>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Einleitungstext</label>
            <textarea className="ac-input" rows={2} value={form.einleitung}
              onChange={e => set("einleitung", e.target.value)}
              style={{ resize: "vertical", minHeight: 60 }} />
          </div>

          {/* Positionen */}
          <PositionenEditor
            positionen={form.positionen}
            onChange={p => set("positionen", p)}
          />

          <div className="ac-form-col">
            <label className="ac-label">Schlusstext</label>
            <textarea className="ac-input" rows={2} value={form.schlusstext}
              onChange={e => set("schlusstext", e.target.value)}
              style={{ resize: "vertical", minHeight: 60 }} />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".85rem", cursor: "pointer" }}>
            <input type="checkbox" checked={form.kleinunternehmer}
              onChange={e => set("kleinunternehmer", e.target.checked)}
              style={{ accentColor: "var(--accent)" }} />
            Kleinunternehmer (§19 UStG) — kein USt-Ausweis
          </label>
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "…" : initial?.id ? "Speichern" : "Angebot erstellen"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || { label: status, cls: "ac-badge-gray" };
  return <span className={`ac-badge ${m.cls}`}>{m.label}</span>;
}

export default function AngeboteTab() {
  const [angebote, setAngebote]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null); // null | "new" | angebot-object
  const [converting, setConverting] = useState(null);
  const [msg, setMsg]               = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/angebote")
      .then(r => setAngebote(r.data?.angebote || []))
      .catch(() => setAngebote([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const onSaved = () => {
    setModal(null);
    load();
    setMsg({ type: "ok", text: "Angebot gespeichert." });
  };

  const patchStatus = async (id, newStatus) => {
    const labels = { entwurf:"Entwurf", gesendet:"Gesendet", angenommen:"Angenommen", abgelehnt:"Abgelehnt" };
    if (!window.confirm(`Status auf „${labels[newStatus] || newStatus}" ändern?`)) return;
    try {
      await api.patch(`/api/v1/angebote/${id}/status`, { status: newStatus });
      load();
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Fehler beim Status-Update." });
    }
  };

  const konvertieren = async (id) => {
    setConverting(id);
    try {
      const r = await api.post(`/api/v1/angebote/${id}/konvertieren`);
      load();
      setMsg({ type: "ok", text: `Angebot konvertiert → Rechnung ${r.data.rechnungsnummer}` });
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Konvertierung fehlgeschlagen." });
    } finally { setConverting(null); }
  };

  const del = async (id) => {
    if (!confirm("Angebot wirklich löschen?")) return;
    try {
      await api.delete(`/api/v1/angebote/${id}`);
      load();
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Löschen fehlgeschlagen." });
    }
  };

  return (
    <div>
      {msg && (
        <div role={msg.type === "ok" ? "status" : "alert"} aria-live="polite" className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
          style={{ cursor: "pointer", marginBottom: 16 }} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>
            Angebote & Kostenvoranschläge
          </span>
          <span style={{ fontSize: ".75rem", color: "var(--ink2)", marginLeft: 10 }}>
            {angebote.length} Angebot{angebote.length !== 1 ? "e" : ""}
          </span>
        </div>
        <button className="ac-btn ac-btn-primary" onClick={() => setModal("new")}>
          + Neues Angebot
        </button>
      </div>

      {loading ? (
        <div role="status" aria-live="polite" className="ac-loading"><span className="ac-spinner" aria-hidden="true" />Lade Angebote…</div>
      ) : angebote.length === 0 ? (
        <div className="ac-empty">
          <div style={{ fontSize: "2rem", marginBottom: 12 }}></div>
          <div>Noch keine Angebote angelegt.</div>
          <div style={{ fontSize: ".82rem", marginTop: 6 }}>
            Erstelle dein erstes Angebot und konvertiere es mit einem Klick zur Rechnung.
          </div>
        </div>
      ) : (
        <div className="ac-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="ac-table-wrap">
            <table aria-label="Angebote" className="ac-table">
              <thead>
                <tr>
                  <th scope="col">Nummer</th>
                  <th scope="col">Empfänger</th>
                  <th scope="col">Datum</th>
                  <th scope="col">Gültig bis</th>
                  <th scope="col" style={{ textAlign: "right" }}>Netto</th>
                  <th scope="col" style={{ textAlign: "right" }}>Brutto</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ textAlign: "right" }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {angebote.map(a => (
                  <tr key={a.id}>
                    <td className="ac-mono" style={{ fontSize: ".82rem", color: "var(--ink2)" }}>
                      {a.angebotsnummer || "—"}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{a.empfaenger_name}</div>
                      {a.empfaenger_ort && (
                        <div style={{ fontSize: ".75rem", color: "var(--ink2)" }}>{a.empfaenger_ort}</div>
                      )}
                    </td>
                    <td className="ac-mono" style={{ fontSize: ".82rem" }}>
                      {a.angebotsdatum?.slice(0, 10) || "—"}
                    </td>
                    <td className="ac-mono" style={{ fontSize: ".82rem", color: "var(--ink2)" }}>
                      {a.gueltig_bis?.slice(0, 10) || "—"}
                    </td>
                    <td className="ac-mono" style={{ textAlign: "right" }}>{fmtEur(a.netto_summe)}</td>
                    <td className="ac-mono" style={{ textAlign: "right", color: "var(--accent)", fontWeight: 600 }}>
                      {fmtEur(a.brutto_summe)}
                    </td>
                    <td>
                      {a.status !== "konvertiert" ? (
                        <select
                          className="ac-select"
                          style={{ fontSize: ".78rem", padding: "3px 8px" }}
                          value={a.status}
                          onChange={e => patchStatus(a.id, e.target.value)}
                        >
                          {["entwurf", "gesendet", "angenommen", "abgelehnt"].map(s => (
                            <option key={s} value={s}>{STATUS_META[s]?.label || s}</option>
                          ))}
                        </select>
                      ) : (
                        <StatusBadge status={a.status} />
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                        {a.status !== "konvertiert" && (
                          <>
                            <button className="ac-btn ac-btn-ghost ac-btn-sm"
                              onClick={() => setModal(a)} title="Bearbeiten">Bearbeiten</button>
                            <button
                              className="ac-btn ac-btn-primary ac-btn-sm"
                              onClick={() => konvertieren(a.id)}
                              disabled={converting === a.id}
                              title="Als Rechnung konvertieren"
                              style={{ background: "var(--a2)", color: "#fff" }}
                            >
                              {converting === a.id ? "…" : "→ Rechnung"}
                            </button>
                            <button className="ac-btn ac-btn-danger ac-btn-sm"
                              aria-label="Angebot löschen" onClick={() => del(a.id)} title="Löschen">🗑</button>
                          </>
                        )}
                        {a.status === "konvertiert" && a.konvertiert_zu_rechnung_id && (
                          <span style={{ fontSize: ".75rem", color: "var(--ink2)" }}>
                            RE #{a.konvertiert_zu_rechnung_id}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <AngebotModal
          initial={modal === "new" ? null : modal}
          onSaved={onSaved}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
