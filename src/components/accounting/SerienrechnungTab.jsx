// src/components/accounting/SerienrechnungTab.jsx — Serienrechnungen
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const INTERVALL_LABELS = {
  monatlich:    "Monatlich",
  zweimonatlich:"Zweimonatlich",
  quartalsweise:"Quartalsweise",
  halbjaehrlich:"Halbjährlich",
  jaehrlich:    "Jährlich",
  woechentlich: "Wöchentlich",
};

const EMPTY_FORM = {
  name: "",
  intervall: "monatlich",
  start_datum: new Date().toISOString().slice(0, 10),
  ende_datum: "",
  maximale_anzahl: "",
  empfaenger_name: "",
  empfaenger_strasse: "",
  empfaenger_plz_ort: "",
  absender_name: "",
  beschreibung: "",
  betrag_netto: "",
  ust_satz: "19",
};

function SerienForm({ initial, onSaved, onCancel }) {
  const [form, setForm]   = useState(() => ({ ...EMPTY_FORM, ...(initial?.vorlage_data || {}), name: initial?.name || "", intervall: initial?.intervall || "monatlich", start_datum: initial?.naechste_ausfuehrung || new Date().toISOString().slice(0, 10), ende_datum: initial?.ende_datum || "", maximale_anzahl: initial?.maximale_anzahl || "" }));
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const netto  = parseFloat(form.betrag_netto || 0);
  const ust    = parseFloat(form.ust_satz || 19);
  const brutto = netto * (1 + ust / 100);

  const save = async () => {
    if (!form.name.trim() || !form.empfaenger_name.trim() || !form.betrag_netto) {
      setError("Name, Empfänger und Betrag sind Pflichtfelder.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name:             form.name,
        intervall:        form.intervall,
        start_datum:      form.start_datum,
        ende_datum:       form.ende_datum || null,
        maximale_anzahl:  form.maximale_anzahl ? parseInt(form.maximale_anzahl) : null,
        vorlage_data: {
          empfaenger_name:    form.empfaenger_name,
          empfaenger_strasse: form.empfaenger_strasse,
          empfaenger_plz_ort: form.empfaenger_plz_ort,
          absender_name:      form.absender_name,
          positionen: [{
            beschreibung:   form.beschreibung || form.name,
            menge:          1,
            einheit:        "Monat",
            einzelpreis:    netto,
            rabatt_prozent: 0,
            ust_satz:       ust,
          }],
          zahlungsziel_tage: 14,
        },
      };
      if (initial?.id) {
        await api.patch(`/api/v1/serienrechnungen/${initial.id}`, payload);
      } else {
        await api.post("/api/v1/serienrechnungen", payload);
      }
      onSaved();
    } catch (e) {
      setError(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-card" style={{ marginBottom: 16 }}>
      <div className="ac-section-title">{initial?.id ? "Serienrechnung bearbeiten" : "Neue Serienrechnung"}</div>
      {error && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="ac-form-row">
        <div className="ac-form-col" style={{ flex: 2 }}>
          <label className="ac-label">Name der Serienrechnung *</label>
          <input className="ac-input" value={form.name}
            onChange={e => set("name", e.target.value)} placeholder="z.B. Retainer Max Mustermann" />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Intervall</label>
          <select className="ac-select" value={form.intervall} onChange={e => set("intervall", e.target.value)}>
            {Object.entries(INTERVALL_LABELS).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ac-form-row">
        <div className="ac-form-col">
          <label className="ac-label">Erste Ausführung</label>
          <input className="ac-input" type="date" value={form.start_datum}
            onChange={e => set("start_datum", e.target.value)} />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Ende (optional)</label>
          <input className="ac-input" type="date" value={form.ende_datum}
            onChange={e => set("ende_datum", e.target.value)} />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Max. Ausführungen (optional)</label>
          <input className="ac-input ac-mono" type="number" value={form.maximale_anzahl}
            onChange={e => set("maximale_anzahl", e.target.value)} placeholder="unbegrenzt" />
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 12, marginBottom: 8 }}>
        <div style={{ fontSize: ".8rem", color: "var(--ink2)", marginBottom: 10 }}>Rechnungsdaten (Vorlage)</div>
      </div>

      <div className="ac-form-row">
        <div className="ac-form-col" style={{ flex: 2 }}>
          <label className="ac-label">Empfänger *</label>
          <input className="ac-input" value={form.empfaenger_name}
            onChange={e => set("empfaenger_name", e.target.value)} placeholder="Firmenname / Kunde" />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Straße</label>
          <input className="ac-input" value={form.empfaenger_strasse}
            onChange={e => set("empfaenger_strasse", e.target.value)} />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">PLZ / Ort</label>
          <input className="ac-input" value={form.empfaenger_plz_ort}
            onChange={e => set("empfaenger_plz_ort", e.target.value)} />
        </div>
      </div>

      <div className="ac-form-row">
        <div className="ac-form-col" style={{ flex: 2 }}>
          <label className="ac-label">Leistungsbeschreibung</label>
          <input className="ac-input" value={form.beschreibung}
            onChange={e => set("beschreibung", e.target.value)} placeholder="z.B. Monatlicher Retainer" />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Betrag netto (€) *</label>
          <input className="ac-input ac-mono" type="number" step="0.01" value={form.betrag_netto}
            onChange={e => set("betrag_netto", e.target.value)} placeholder="0,00" />
        </div>
        <div className="ac-form-col" style={{ maxWidth: 110 }}>
          <label className="ac-label">USt-Satz</label>
          <select className="ac-select" value={form.ust_satz} onChange={e => set("ust_satz", e.target.value)}>
            <option value="19">19 %</option>
            <option value="7">7 %</option>
            <option value="0">0 %</option>
          </select>
        </div>
      </div>

      {netto > 0 && (
        <div style={{
          display: "flex", gap: 20, padding: "8px 12px",
          background: "var(--surface2)", borderRadius: 8, marginBottom: 14,
          fontSize: ".85rem", fontFamily: "JetBrains Mono, monospace",
        }}>
          <span>Netto: {fmtEur(netto)}</span>
          <span>USt {ust}%: {fmtEur(netto * ust / 100)}</span>
          <span style={{ fontWeight: 700 }}>Brutto: {fmtEur(brutto)}</span>
          <span style={{ color: "var(--ink2)" }}>
            / {INTERVALL_LABELS[form.intervall] || form.intervall}
          </span>
        </div>
      )}

      <div className="ac-form-col" style={{ marginBottom: 14 }}>
        <label className="ac-label">Absender (Ihre Firma)</label>
        <input className="ac-input" value={form.absender_name}
          onChange={e => set("absender_name", e.target.value)} placeholder="Ihr Firmenname" />
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="ac-btn ac-btn-ghost" onClick={onCancel}>Abbrechen</button>
        <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Speichern…" : "Serienrechnung speichern"}
        </button>
      </div>
    </div>
  );
}

export default function SerienrechnungTab() {
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [busy, setBusy]         = useState({});
  const [msg, setMsg]           = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/serienrechnungen")
      .then(r => setList(r.data?.serienrechnungen || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (id, aktiv) => {
    setBusy(b => ({ ...b, [id]: true }));
    try {
      await api.patch(`/api/v1/serienrechnungen/${id}`, { aktiv: !aktiv });
      load();
    } catch { alert("Fehler."); }
    finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  const ausfuehren = async (id) => {
    setBusy(b => ({ ...b, [id]: true }));
    setMsg(null);
    try {
      const r = await api.post(`/api/v1/serienrechnungen/${id}/ausfuehren`);
      setMsg({ type: "ok", text: `Rechnung ${r.data?.rechnungsnummer || ""} erstellt.` });
      load();
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Fehler." });
    } finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  const del = async (id) => {
    if (!window.confirm("Serienrechnung löschen?")) return;
    setBusy(b => ({ ...b, [id]: true }));
    try {
      await api.delete(`/api/v1/serienrechnungen/${id}`);
      load();
    } catch { alert("Löschen fehlgeschlagen."); }
    finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  if (loading) return <div className="ac-loading"><span className="ac-spinner" />Lade Serienrechnungen…</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <div style={{ color: "var(--ink2)", fontSize: ".85rem" }}>
          Automatisch wiederkehrende Rechnungen — Scheduler läuft täglich.
        </div>
        <button className="ac-btn ac-btn-primary ac-btn-sm" style={{ marginLeft: "auto" }}
          onClick={() => { setEditItem(null); setShowForm(true); }}>
          + Neue Serienrechnung
        </button>
      </div>

      {msg && (
        <div className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
          style={{ marginBottom: 14, cursor: "pointer" }} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      {(showForm || editItem) && (
        <SerienForm
          initial={editItem}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => { setShowForm(false); setEditItem(null); load(); }}
        />
      )}

      {list.length === 0 && !showForm && !editItem ? (
        <div className="ac-card"><div className="ac-empty">Noch keine Serienrechnungen konfiguriert.</div></div>
      ) : list.length > 0 && (
        <div className="ac-card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="ac-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Intervall</th>
                <th>Nächste Ausführung</th>
                <th>Erstellt</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {list.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{INTERVALL_LABELS[s.intervall] || s.intervall}</td>
                  <td className="ac-mono">{s.naechste_ausfuehrung || "—"}</td>
                  <td className="ac-mono" style={{ color: "var(--ink2)" }}>
                    {s.erstellte_anzahl ?? 0}×
                    {s.maximale_anzahl ? ` / ${s.maximale_anzahl}` : ""}
                  </td>
                  <td>
                    <span className={`ac-badge ${s.aktiv ? "ac-badge-green" : "ac-badge-gray"}`}>
                      {s.aktiv ? "Aktiv" : "Pausiert"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={busy[s.id]}
                        onClick={() => ausfuehren(s.id)}>
                        ▶ Jetzt
                      </button>
                      <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={busy[s.id]}
                        onClick={() => { setEditItem(s); setShowForm(false); }}>
                        Bearb.
                      </button>
                      <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={busy[s.id]}
                        onClick={() => toggle(s.id, s.aktiv)}>
                        {s.aktiv ? "Pause" : "Aktivieren"}
                      </button>
                      <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={busy[s.id]}
                        style={{ color: "var(--a3)" }} onClick={() => del(s.id)}>
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
