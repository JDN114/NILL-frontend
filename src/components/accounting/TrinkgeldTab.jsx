// src/components/accounting/TrinkgeldTab.jsx
// Trinkgeld-Dokumentation nach §3 Nr. 51 EStG
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const EUR = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const today = () => new Date().toISOString().slice(0, 10);

const STATUS_BADGE = {
  offen:        "ac-badge ac-badge-gray",
  verteilt:     "ac-badge ac-badge-purple",
  abgeschlossen:"ac-badge ac-badge-green",
  storniert:    "ac-badge ac-badge-pink",
};
const STATUS_LABEL = {
  offen: "Offen", verteilt: "Verteilt",
  abgeschlossen: "Abgeschlossen", storniert: "Storniert",
};

const MODUS_BADGE = {
  direkt: "ac-badge ac-badge-green",
  pool:   "ac-badge ac-badge-purple",
};
const MODUS_LABEL = {
  direkt: "§3 Nr. 51 EStG",
  pool:   "Lohnsteuerpflichtig",
};

// ── ProtokolModal ─────────────────────────────────────────────────────────────
function ProtokolModal({ initial, onSaved, onClose }) {
  const [form, setForm] = useState(() => ({
    datum: today(),
    schicht_name: "",
    modus: "direkt",
    bar_trinkgeld: "",
    ec_trinkgeld: "",
    app_trinkgeld: "",
    notiz: "",
    ...(initial || {}),
  }));
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const gesamt =
    (parseFloat(form.bar_trinkgeld) || 0) +
    (parseFloat(form.ec_trinkgeld) || 0) +
    (parseFloat(form.app_trinkgeld) || 0);

  const save = async () => {
    if (!form.datum) { setErr("Datum ist Pflicht."); return; }
    if (gesamt <= 0)  { setErr("Mindestens ein Trinkgeldbetrag muss > 0 sein."); return; }
    setSaving(true); setErr("");
    try {
      const payload = {
        datum:          form.datum,
        schicht_name:   form.schicht_name || null,
        modus:          form.modus,
        bar_trinkgeld:  parseFloat(form.bar_trinkgeld) || 0,
        ec_trinkgeld:   parseFloat(form.ec_trinkgeld)  || 0,
        app_trinkgeld:  parseFloat(form.app_trinkgeld) || 0,
        notiz:          form.notiz || null,
      };
      if (initial?.id) await api.put(`/api/v1/trinkgeld/${initial.id}`, payload);
      else             await api.post("/api/v1/trinkgeld", payload);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 560 }}>
        <div className="ac-modal-title">
          {initial?.id ? "Trinkgeld bearbeiten" : "Trinkgeld erfassen"}
          <span style={{ fontSize: ".75rem", color: "var(--ink2)", marginLeft: 10 }}>§3 Nr. 51 EStG</span>
        </div>

        {err && <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Datum *</label>
            <input className="ac-input" type="date" value={form.datum}
              onChange={e => set("datum", e.target.value)} />
          </div>
          <div className="ac-form-col" style={{ flex: 2 }}>
            <label className="ac-label">Schicht <span style={{ color: "var(--ink2)" }}>(optional)</span></label>
            <input className="ac-input" value={form.schicht_name}
              onChange={e => set("schicht_name", e.target.value)}
              placeholder="z.B. Frühschicht" />
          </div>
        </div>

        {/* Modus selector */}
        <div style={{ marginBottom: 16 }}>
          <div className="ac-label" style={{ marginBottom: 8 }}>Modus *</div>
          <div style={{ display: "flex", gap: 10 }}>
            {["direkt", "pool"].map(m => (
              <button
                key={m}
                onClick={() => set("modus", m)}
                style={{
                  flex: 1, padding: "12px 10px", borderRadius: 10, border: "2px solid",
                  borderColor: form.modus === m
                    ? (m === "direkt" ? "var(--accent)" : "var(--a2)")
                    : "var(--border)",
                  background: form.modus === m
                    ? (m === "direkt" ? "rgba(198,255,60,.08)" : "rgba(122,92,255,.08)")
                    : "var(--surface2)",
                  color: form.modus === m
                    ? (m === "direkt" ? "var(--accent)" : "var(--a2)")
                    : "var(--ink2)",
                  cursor: "pointer", transition: "all .15s", fontFamily: "Inter,sans-serif",
                  fontSize: ".82rem", fontWeight: form.modus === m ? 600 : 400,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1rem", marginBottom: 4 }}>{m === "direkt" ? "⚡" : "🏦"}</div>
                <div>{m === "direkt" ? "Direkt" : "Pool"}</div>
                <div style={{ fontSize: ".7rem", opacity: .8, marginTop: 2 }}>
                  {m === "direkt" ? "§3 Nr. 51 EStG" : "Lohnsteuerpflichtig"}
                </div>
              </button>
            ))}
          </div>
          {form.modus === "pool" && (
            <div role="status" aria-live="polite" className="ac-alert ac-alert-warn" style={{ marginTop: 10, fontSize: ".8rem" }}>
              Achtung: Pool-Trinkgelder müssen über die Lohnbuchhaltung abgerechnet werden
              und sind sozialversicherungs- und lohnsteuerpflichtig.
            </div>
          )}
        </div>

        {/* Trinkgeld-Eingaben */}
        <div style={{
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: 10, padding: 16, marginBottom: 16,
        }}>
          <div className="ac-label" style={{ marginBottom: 12 }}>Trinkgeldbeträge</div>
          <div className="ac-form-row">
            <div className="ac-form-col">
              <label className="ac-label">Bar-Trinkgeld (€)</label>
              <input className="ac-input" type="number" step="0.01" min="0"
                value={form.bar_trinkgeld}
                onChange={e => set("bar_trinkgeld", e.target.value)}
                placeholder="0,00" />
            </div>
            <div className="ac-form-col">
              <label className="ac-label">EC/Terminal (€)</label>
              <input className="ac-input" type="number" step="0.01" min="0"
                value={form.ec_trinkgeld}
                onChange={e => set("ec_trinkgeld", e.target.value)}
                placeholder="0,00" />
              <div style={{ fontSize: ".7rem", color: "var(--ink2)", marginTop: 4 }}>
                Kommt über den Bankauszug
              </div>
            </div>
            <div className="ac-form-col">
              <label className="ac-label">App (€)</label>
              <input className="ac-input" type="number" step="0.01" min="0"
                value={form.app_trinkgeld}
                onChange={e => set("app_trinkgeld", e.target.value)}
                placeholder="0,00" />
              <div style={{ fontSize: ".7rem", color: "var(--ink2)", marginTop: 4 }}>
                SumUp, Stripe etc.
              </div>
            </div>
          </div>
          <div style={{
            display: "flex", justifyContent: "flex-end", marginTop: 10,
            paddingTop: 10, borderTop: "1px solid var(--border)",
            alignItems: "center", gap: 10,
          }}>
            <span style={{ color: "var(--ink2)", fontSize: ".82rem" }}>Gesamt:</span>
            <span style={{
              fontFamily: "JetBrains Mono,monospace", fontSize: "1.15rem",
              fontWeight: 700, color: "var(--accent)",
            }}>{EUR(gesamt)}</span>
          </div>
        </div>

        <div className="ac-form-col" style={{ marginBottom: 16 }}>
          <label className="ac-label">Notiz <span style={{ color: "var(--ink2)" }}>(optional)</span></label>
          <textarea className="ac-input" rows={2}
            value={form.notiz} onChange={e => set("notiz", e.target.value)}
            placeholder="Besondere Vorkommnisse, Anmerkungen…"
            style={{ resize: "vertical" }} />
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── VerteilungModal ───────────────────────────────────────────────────────────
function VerteilungModal({ protokol, onSaved, onClose }) {
  const gesamt = protokol.gesamt_trinkgeld || 0;
  const [splitMode, setSplitMode] = useState("stunden");
  const [rows, setRows] = useState(
    protokol.verteilungen?.length
      ? protokol.verteilungen.map(v => ({
          kuerzel:      v.mitarbeiter_kuerzel || "",
          stunden:      v.stunden != null ? String(v.stunden) : "",
          anteil:       v.anteil_prozent != null ? String(v.anteil_prozent) : "",
          quittiert:    v.quittiert || false,
        }))
      : [{ kuerzel: "", stunden: "", anteil: "", quittiert: false }]
  );
  const [saving, setSaving]     = useState(false);
  const [quitting, setQuitting] = useState(null);
  const [err, setErr]           = useState("");
  const [msg, setMsg]           = useState("");

  const addRow = () =>
    setRows(r => [...r, { kuerzel: "", stunden: "", anteil: "", quittiert: false }]);

  const removeRow = (i) =>
    setRows(r => r.filter((_, idx) => idx !== i));

  const setRow = (i, k, v) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [k]: v } : row));

  // Live calc
  const totalStunden = rows.reduce((s, r) => s + (parseFloat(r.stunden) || 0), 0);
  const totalProzent = rows.reduce((s, r) => s + (parseFloat(r.anteil) || 0), 0);

  const calcBetrag = (row) => {
    if (splitMode === "stunden") {
      const st = parseFloat(row.stunden) || 0;
      return totalStunden > 0 ? gesamt * (st / totalStunden) : 0;
    } else {
      const pct = parseFloat(row.anteil) || 0;
      return gesamt * (pct / 100);
    }
  };

  const validate = () => {
    if (rows.some(r => !r.kuerzel.trim())) return "Alle Kürzel müssen ausgefüllt sein.";
    const kuerzels = rows.map(r => r.kuerzel.trim().toUpperCase());
    if (new Set(kuerzels).size !== kuerzels.length) return "Kürzel müssen eindeutig sein.";
    if (splitMode === "stunden" && totalStunden <= 0) return "Gesamtstunden müssen > 0 sein.";
    if (splitMode === "prozent" && Math.abs(totalProzent - 100) > 0.01)
      return `Prozentsumme muss 100% ergeben (aktuell ${totalProzent.toFixed(1)}%).`;
    return null;
  };

  const save = async () => {
    const valErr = validate();
    if (valErr) { setErr(valErr); return; }
    setSaving(true); setErr("");
    try {
      const verteilungen = rows.map(r => ({
        mitarbeiter_kuerzel: r.kuerzel.trim().toUpperCase(),
        stunden:      splitMode === "stunden" ? (parseFloat(r.stunden) || null) : null,
        anteil_prozent: splitMode === "prozent" ? (parseFloat(r.anteil) || null) : null,
      }));
      await api.post(`/api/v1/trinkgeld/${protokol.id}/verteilung`, { verteilungen });
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  const quittieren = async (kuerzel) => {
    setQuitting(kuerzel); setMsg(""); setErr("");
    try {
      await api.post(`/api/v1/trinkgeld/${protokol.id}/quittierung/${kuerzel}`);
      setMsg(`${kuerzel} hat quittiert.`);
      setRows(r => r.map(row =>
        row.kuerzel.toUpperCase() === kuerzel.toUpperCase()
          ? { ...row, quittiert: true }
          : row
      ));
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler bei Quittierung.");
    } finally { setQuitting(null); }
  };

  const totalBetrag = rows.reduce((s, r) => s + calcBetrag(r), 0);

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 640 }}>
        <div className="ac-modal-title">Trinkgeld verteilen</div>

        {/* Summary */}
        <div style={{
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "12px 16px", marginBottom: 16,
          display: "flex", gap: 24, flexWrap: "wrap",
        }}>
          <div>
            <div className="ac-kpi-label">Datum</div>
            <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".9rem" }}>
              {protokol.datum}
            </div>
          </div>
          <div>
            <div className="ac-kpi-label">Gesamt</div>
            <div style={{
              fontFamily: "JetBrains Mono,monospace", fontSize: "1rem",
              fontWeight: 700, color: "var(--accent)",
            }}>{EUR(gesamt)}</div>
          </div>
          <div>
            <div className="ac-kpi-label">Modus</div>
            <span className={MODUS_BADGE[protokol.modus]}>
              {MODUS_LABEL[protokol.modus]}
            </span>
          </div>
        </div>

        {/* DSGVO hint */}
        <div role="status" aria-live="polite" className="ac-alert ac-alert-warn" style={{ fontSize: ".78rem", marginBottom: 14 }}>
          Datenschutz: Bitte nur Kürzel verwenden — keine vollständigen Namen erfassen.
        </div>

        {err && <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}
        {msg && <div role="status" aria-live="polite" className="ac-alert ac-alert-ok" style={{ marginBottom: 12 }}>{msg}</div>}

        {/* Split mode toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["stunden", "prozent"].map(m => (
            <button
              key={m}
              onClick={() => setSplitMode(m)}
              className={splitMode === m ? "ac-btn ac-btn-primary ac-btn-sm" : "ac-btn ac-btn-ghost ac-btn-sm"}
            >
              {m === "stunden" ? "Nach Stunden" : "Nach Prozent"}
            </button>
          ))}
        </div>

        {/* Employee rows */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "90px 1fr 1fr auto",
            gap: 8, marginBottom: 8,
          }}>
            <div className="ac-label">Kürzel *</div>
            <div className="ac-label">{splitMode === "stunden" ? "Stunden" : "Prozent (%)"}</div>
            <div className="ac-label">Betrag</div>
            <div />
          </div>

          {rows.map((row, i) => {
            const betrag = calcBetrag(row);
            return (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "90px 1fr 1fr auto",
                gap: 8, marginBottom: 8, alignItems: "center",
              }}>
                <input
                  className="ac-input"
                  maxLength={4}
                  value={row.kuerzel}
                  onChange={e => setRow(i, "kuerzel", e.target.value.toUpperCase())}
                  placeholder="JR"
                  style={{ fontFamily: "JetBrains Mono,monospace", textTransform: "uppercase" }}
                />
                <input
                  className="ac-input"
                  type="number" step="0.5" min="0"
                  value={splitMode === "stunden" ? row.stunden : row.anteil}
                  onChange={e => setRow(i, splitMode === "stunden" ? "stunden" : "anteil", e.target.value)}
                  placeholder="0"
                />
                <div style={{
                  fontFamily: "JetBrains Mono,monospace", fontSize: ".85rem",
                  color: betrag > 0 ? "var(--accent)" : "var(--ink2)",
                  padding: "9px 12px",
                }}>
                  {EUR(betrag)}
                </div>
                <button
                  className="ac-btn ac-btn-danger ac-btn-sm"
                  aria-label="Zeile entfernen"
                  onClick={() => removeRow(i)}
                  disabled={rows.length <= 1}
                  style={{ padding: "6px 10px" }}
                >✕</button>
              </div>
            );
          })}
        </div>

        {/* Running total */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 12px", background: "var(--surface2)",
          borderRadius: 8, marginBottom: 12, fontSize: ".85rem",
        }}>
          <span style={{ color: "var(--ink2)" }}>
            {splitMode === "stunden"
              ? `Summe Stunden: ${totalStunden.toFixed(1)} h`
              : `Summe Prozent: ${totalProzent.toFixed(1)}%`}
          </span>
          <span style={{ color: "var(--ink2)" }}>
            Verteilt:{" "}
            <span style={{
              fontFamily: "JetBrains Mono,monospace",
              color: Math.abs(totalBetrag - gesamt) < 0.01 ? "var(--accent)" : "var(--a3)",
              fontWeight: 600,
            }}>
              {EUR(totalBetrag)}
            </span>
            {" "}/ {EUR(gesamt)}
          </span>
        </div>

        <button
          className="ac-btn ac-btn-ghost ac-btn-sm"
          onClick={addRow}
          style={{ marginBottom: 20 }}
        >
          + Mitarbeiter hinzufügen
        </button>

        {/* Quittierung section */}
        {rows.some(r => r.kuerzel) && protokol.verteilungen?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="ac-section-title" style={{ fontSize: ".9rem", marginBottom: 10 }}>
              Quittierungen
            </div>
            <div className="ac-table-wrap">
              <table aria-label="Trinkgeld" className="ac-table">
                <thead>
                  <tr>
                    <th scope="col">Kürzel</th>
                    <th scope="col">Betrag</th>
                    <th scope="col">Quittiert</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.filter(r => r.kuerzel).map((row, i) => (
                    <tr key={i}>
                      <td className="ac-mono">{row.kuerzel}</td>
                      <td className="ac-mono">{EUR(calcBetrag(row))}</td>
                      <td>
                        {row.quittiert
                          ? <span className="ac-badge ac-badge-green">✓ Quittiert</span>
                          : <span className="ac-badge ac-badge-gray">Ausstehend</span>}
                      </td>
                      <td>
                        {!row.quittiert && (
                          <button
                            className="ac-btn ac-btn-ghost ac-btn-sm"
                            disabled={quitting === row.kuerzel}
                            onClick={() => quittieren(row.kuerzel)}
                          >
                            {quitting === row.kuerzel ? "…" : "Quittieren"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "…" : "Verteilung speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DayBarChart — pure CSS ────────────────────────────────────────────────────
function DayBarChart({ protokolle }) {
  if (!protokolle.length) return null;
  const maxBetrag = Math.max(...protokolle.map(p => p.gesamt_trinkgeld || 0), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 64, padding: "0 4px" }}>
      {protokolle.map((p, i) => {
        const h = Math.max(4, ((p.gesamt_trinkgeld || 0) / maxBetrag) * 56);
        const color =
          p.status === "abgeschlossen" ? "var(--accent)" :
          p.status === "verteilt"      ? "var(--a2)" :
          p.status === "storniert"     ? "rgba(155,152,144,.3)" :
          "#ffb347";
        return (
          <div
            key={i}
            title={`${p.datum}: ${EUR(p.gesamt_trinkgeld)}`}
            style={{
              flex: 1, height: h, background: color,
              borderRadius: "3px 3px 0 0", cursor: "default",
              transition: "opacity .15s", minWidth: 6, maxWidth: 24,
              opacity: p.status === "storniert" ? 0.4 : 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.75"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = p.status === "storniert" ? "0.4" : "1"; }}
          />
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TrinkgeldTab() {
  const now = new Date();
  const [monat, setMonat]   = useState(now.getMonth() + 1);
  const [jahr, setJahr]     = useState(now.getFullYear());
  const [protokolle, setProtokolle] = useState([]);
  const [statistik, setStatistik]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const [modalCreate, setModalCreate]       = useState(false);
  const [modalEdit, setModalEdit]           = useState(null);
  const [modalVerteilen, setModalVerteilen] = useState(null);
  const [loadingDetail, setLoadingDetail]   = useState(false);
  const [msg, setMsg] = useState(null);

  // Always fetch the full protocol (with verteilungen) before opening VerteilungModal
  const openVerteilen = useCallback(async (proto) => {
    setLoadingDetail(true);
    try {
      const r = await api.get(`/api/v1/trinkgeld/${proto.id}`);
      setModalVerteilen(r.data);
    } catch {
      setModalVerteilen(proto); // fallback to list data
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const datumVon = `${jahr}-${String(monat).padStart(2, "0")}-01`;
    const datumBis = new Date(jahr, monat, 0).toISOString().slice(0, 10);
    try {
      const [pRes, sRes] = await Promise.all([
        api.get("/api/v1/trinkgeld", { params: { datum_von: datumVon, datum_bis: datumBis } }),
        api.get("/api/v1/trinkgeld/statistik/monat", { params: { jahr, monat } }),
      ]);
      setProtokolle(Array.isArray(pRes.data) ? pRes.data : pRes.data.items || []);
      setStatistik(sRes.data);
    } catch {
      setProtokolle([]);
      setStatistik(null);
    } finally { setLoading(false); }
  }, [monat, jahr]);

  useEffect(() => { load(); }, [load]);

  const stornieren = async (id) => {
    if (!confirm("Protokoll stornieren?")) return;
    try {
      await api.post(`/api/v1/trinkgeld/${id}/stornieren`);
      showMsg("ok", "Protokoll storniert.");
      load();
    } catch (e) {
      showMsg("err", e.response?.data?.detail || "Fehler bei Stornierung.");
    }
  };

  // KPIs
  const todayStr = today();
  const heuteGesamt = protokolle
    .filter(p => p.datum === todayStr && p.status !== "storniert")
    .reduce((s, p) => s + (p.gesamt_trinkgeld || 0), 0);
  const monatGesamt = statistik?.gesamt || 0;
  const ecAppOffen  = protokolle
    .filter(p => p.status === "offen" && ((p.ec_trinkgeld || 0) + (p.app_trinkgeld || 0) > 0))
    .reduce((s, p) => s + (p.ec_trinkgeld || 0) + (p.app_trinkgeld || 0), 0);
  const offenCount  = protokolle.filter(p => p.status === "offen").length;
  const maCount     = statistik?.per_mitarbeiter?.length || 0;

  const MONAT_NAMEN = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

  return (
    <div>
      {/* Legal banner */}
      {!bannerDismissed && (
        <div role="status" aria-live="polite" className="ac-alert ac-alert-warn" style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          gap: 12, marginBottom: 20, lineHeight: 1.6,
        }}>
          <div>
            <strong>⚖️ Trinkgeld-Dokumentation nach §3 Nr. 51 EStG</strong><br />
            <span style={{ fontSize: ".8rem" }}>
              <strong>Modus „Direkt&quot;:</strong> Trinkgelder sind steuerfrei wenn direkt vom Kunden an Mitarbeiter.
              Dieses Protokoll dokumentiert die Weitergabe und schützt vor steuerrechtlichen Risiken.{" "}
              <strong>Modus „Pool&quot;:</strong> Arbeitgeberverwaltete Trinkgelder → lohnsteuerpflichtig.
            </span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="Hinweis schließen"
            style={{
              background: "none", border: "none", color: "#ffb347",
              cursor: "pointer", fontSize: "1rem", flexShrink: 0, padding: 0,
            }}
          >✕</button>
        </div>
      )}

      {/* Messages */}
      {msg && (
        <div role={msg.type === "err" ? "alert" : "status"} aria-live="polite" className={`ac-alert ${msg.type === "err" ? "ac-alert-err" : "ac-alert-ok"}`}
          style={{ marginBottom: 16 }}>
          {msg.text}
        </div>
      )}

      {/* KPI row */}
      <div className="ac-kpi-grid" style={{ marginBottom: 20 }}>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Trinkgeld heute</div>
          <div className={`ac-kpi-value green`}>{EUR(heuteGesamt)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Dieser Monat</div>
          <div className="ac-kpi-value green">{EUR(monatGesamt)}</div>
          {statistik?.durchschnitt_pro_tag > 0 && (
            <div className="ac-kpi-delta">
              Ø {EUR(statistik.durchschnitt_pro_tag)}/Tag
            </div>
          )}
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">EC/App noch offen</div>
          <div className={`ac-kpi-value ${ecAppOffen > 0 ? "purple" : "green"}`}>
            {EUR(ecAppOffen)}
          </div>
          {ecAppOffen > 0 && (
            <div className="ac-kpi-delta" style={{ color: "var(--a2)" }}>
              Bitte dokumentieren
            </div>
          )}
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Noch offen</div>
          <div className={`ac-kpi-value ${offenCount > 0 ? "pink" : "green"}`}>
            {offenCount}
          </div>
          <div className="ac-kpi-delta">
            {maCount > 0 ? `${maCount} Mitarbeiter diesen Monat` : "Protokolle"}
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 16, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            className="ac-select"
            value={monat}
            onChange={e => setMonat(Number(e.target.value))}
          >
            {MONAT_NAMEN.map((n, i) => (
              <option key={i + 1} value={i + 1}>{n}</option>
            ))}
          </select>
          <input
            className="ac-input"
            type="number" min="2000" max="2099"
            value={jahr}
            onChange={e => setJahr(Number(e.target.value))}
            style={{ width: 90 }}
          />
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button
            className="ac-btn ac-btn-primary"
            onClick={() => setModalCreate(true)}
          >
            + Trinkgeld erfassen
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ac-card" style={{ marginBottom: 20 }}>
        <div className="ac-section-title">Protokolle</div>
        {loading ? (
          <div role="status" aria-live="polite" className="ac-loading"><div className="ac-spinner" aria-hidden="true" /> Wird geladen…</div>
        ) : protokolle.length === 0 ? (
          <div className="ac-empty">Keine Protokolle für diesen Zeitraum.</div>
        ) : (
          <>
            {/* EC tip warning */}
            {protokolle.some(p => (p.ec_trinkgeld || 0) > 0 && p.status === "offen") && (
              <div role="status" aria-live="polite" className="ac-alert ac-alert-warn" style={{ fontSize: ".8rem", marginBottom: 12 }}>
                EC-Trinkgeld noch nicht verteilt — bitte dokumentieren.
              </div>
            )}
            <div className="ac-table-wrap">
              <table aria-label="Trinkgeld" className="ac-table">
                <thead>
                  <tr>
                    <th scope="col">Datum</th>
                    <th scope="col">Schicht</th>
                    <th scope="col">Bar</th>
                    <th scope="col">EC/App</th>
                    <th scope="col">Gesamt</th>
                    <th scope="col">Modus</th>
                    <th scope="col">Status</th>
                    <th scope="col">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {protokolle.map(p => (
                    <tr key={p.id}>
                      <td className="ac-mono" style={{ whiteSpace: "nowrap" }}>{p.datum}</td>
                      <td style={{ color: "var(--ink2)", fontSize: ".82rem" }}>
                        {p.schicht_name || "—"}
                      </td>
                      <td className="ac-mono">{EUR(p.bar_trinkgeld)}</td>
                      <td className="ac-mono">
                        {EUR((p.ec_trinkgeld || 0) + (p.app_trinkgeld || 0))}
                        {(p.ec_trinkgeld || 0) > 0 && p.status === "offen" && (
                          <span style={{
                            display: "inline-block", marginLeft: 6,
                            width: 6, height: 6, borderRadius: "50%",
                            background: "var(--a2)", verticalAlign: "middle",
                          }} title="EC-Trinkgeld offen" />
                        )}
                      </td>
                      <td>
                        <span className="ac-mono" style={{
                          fontWeight: 700,
                          color: p.status === "storniert" ? "var(--ink2)" : "var(--accent)",
                        }}>
                          {EUR(p.gesamt_trinkgeld)}
                        </span>
                      </td>
                      <td>
                        <span className={MODUS_BADGE[p.modus]}>
                          {MODUS_LABEL[p.modus]}
                        </span>
                      </td>
                      <td>
                        <span className={STATUS_BADGE[p.status] || "ac-badge ac-badge-gray"}>
                          {STATUS_LABEL[p.status] || p.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                          {(p.status === "offen" || p.status === "verteilt") && (
                            <button
                              className="ac-btn ac-btn-ghost ac-btn-sm"
                              disabled={loadingDetail}
                              onClick={() => openVerteilen(p)}
                            >
                              {loadingDetail ? "…" : "Verteilen"}
                            </button>
                          )}
                          <button
                            className="ac-btn ac-btn-ghost ac-btn-sm"
                            disabled={loadingDetail}
                            onClick={() =>
                              p.status === "offen"
                                ? setModalEdit(p)
                                : openVerteilen(p)
                            }
                          >
                            Details
                          </button>
                          {p.status !== "abgeschlossen" && p.status !== "storniert" && (
                            <button
                              className="ac-btn ac-btn-danger ac-btn-sm"
                              onClick={() => stornieren(p.id)}
                            >
                              Storno
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Statistics panel */}
      {statistik && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Bar chart */}
          <div className="ac-card">
            <div className="ac-section-title" style={{ marginBottom: 12 }}>
              Tagesverlauf {MONAT_NAMEN[monat - 1]} {jahr}
            </div>
            {protokolle.filter(p => p.status !== "storniert").length > 0 ? (
              <>
                <DayBarChart protokolle={protokolle} />
                <div style={{
                  display: "flex", gap: 16, marginTop: 10, fontSize: ".72rem", color: "var(--ink2)",
                }}>
                  <span>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--accent)", marginRight: 4 }} />
                    Abgeschlossen
                  </span>
                  <span>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--a2)", marginRight: 4 }} />
                    Verteilt
                  </span>
                  <span>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#ffb347", marginRight: 4 }} />
                    Offen
                  </span>
                </div>
                <div style={{ marginTop: 10, fontSize: ".78rem", color: "var(--ink2)" }}>
                  {statistik.tage_count} Tage · Ø {EUR(statistik.durchschnitt_pro_tag)}/Tag
                </div>
              </>
            ) : (
              <div className="ac-empty" style={{ padding: 24 }}>Keine Daten</div>
            )}
          </div>

          {/* Per-Mitarbeiter */}
          <div className="ac-card">
            <div className="ac-section-title" style={{ marginBottom: 12 }}>
              Mitarbeiter-Übersicht
            </div>
            {statistik.per_mitarbeiter?.length > 0 ? (
              <div className="ac-table-wrap">
                <table aria-label="Trinkgeld" className="ac-table">
                  <thead>
                    <tr>
                      <th scope="col">Kürzel</th>
                      <th scope="col">Gesamt (€)</th>
                      <th scope="col">Tage</th>
                      <th scope="col">Ø/Tag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...statistik.per_mitarbeiter]
                      .sort((a, b) => (b.betrag || 0) - (a.betrag || 0))
                      .map((ma, i) => (
                        <tr key={i}>
                          <td>
                            <span className="ac-mono" style={{
                              background: "var(--surface2)", padding: "2px 8px",
                              borderRadius: 6, fontSize: ".82rem",
                            }}>{ma.kuerzel}</span>
                          </td>
                          <td className="ac-mono" style={{ color: "var(--accent)", fontWeight: 600 }}>
                            {EUR(ma.betrag)}
                          </td>
                          <td style={{ color: "var(--ink2)" }}>{ma.tage}</td>
                          <td className="ac-mono" style={{ color: "var(--ink2)" }}>
                            {ma.tage > 0 ? EUR((ma.betrag || 0) / ma.tage) : "—"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="ac-empty" style={{ padding: 24 }}>
                Noch keine Verteilungen erfasst
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {modalCreate && (
        <ProtokolModal
          onSaved={() => { setModalCreate(false); load(); showMsg("ok", "Protokoll gespeichert."); }}
          onClose={() => setModalCreate(false)}
        />
      )}
      {modalEdit && (
        <ProtokolModal
          initial={modalEdit}
          onSaved={() => { setModalEdit(null); load(); showMsg("ok", "Protokoll aktualisiert."); }}
          onClose={() => setModalEdit(null)}
        />
      )}
      {modalVerteilen && (
        <VerteilungModal
          protokol={modalVerteilen}
          onSaved={() => { setModalVerteilen(null); load(); showMsg("ok", "Verteilung gespeichert."); }}
          onClose={() => setModalVerteilen(null)}
        />
      )}
    </div>
  );
}
