// src/components/accounting/TagesabschlussTab.jsx
// Tagesabschluss (Z-Bon) für B2C-Betriebe — manuell + CSV-Import
import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../../services/api";

const EUR = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const today = () => new Date().toISOString().slice(0, 10);
const f = (v) => Number(v || 0).toFixed(2);

const STATUS_LABEL = { entwurf: "Entwurf", gebucht: "Gebucht", storniert: "Storniert" };
const STATUS_CLASS = { entwurf: "ac-badge-gray", gebucht: "ac-badge-green", storniert: "ac-badge-pink" };

// ── Berechnung (Client-seitig, spiegelt Service-Logik) ────────────────────────
function berechne(form) {
  const b19  = parseFloat(form.umsatz_brutto_19  || 0);
  const b7   = parseFloat(form.umsatz_brutto_7   || 0);
  const b0   = parseFloat(form.umsatz_brutto_0   || 0);
  const netto19 = b19 / 1.19;
  const ust19   = b19 - netto19;
  const netto7  = b7  / 1.07;
  const ust7    = b7  - netto7;
  const gesamt  = ["bar_betrag","ec_betrag","kreditkarte_betrag","gutschein_betrag","sonstige_betrag"]
    .reduce((s, k) => s + parseFloat(form[k] || 0), 0);
  const ustSum  = b19 + b7 + b0;
  const diff    = Math.abs(gesamt - ustSum) > 0.02 ? gesamt - ustSum : null;
  const kDiff   = form.kassenbestand_ist !== "" && form.kassenbestand_soll !== ""
    ? parseFloat(form.kassenbestand_ist || 0) - parseFloat(form.kassenbestand_soll || 0)
    : null;
  return { netto19, ust19, netto7, ust7, gesamt, ustSum, diff, kDiff };
}

const EMPTY_FORM = {
  datum: today(),
  bar_betrag: "", ec_betrag: "", kreditkarte_betrag: "",
  gutschein_betrag: "", sonstige_betrag: "",
  umsatz_brutto_19: "", umsatz_brutto_7: "", umsatz_brutto_0: "",
  kassenbestand_soll: "", kassenbestand_ist: "",
  notiz: "",
};

// ── Formular-Modal ────────────────────────────────────────────────────────────
function AbschlussModal({ initial, onSaved, onClose }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...EMPTY_FORM, ...Object.fromEntries(
          Object.entries(initial).map(([k, v]) => [k, v === null ? "" : v])
        )}
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const calc = berechne(form);

  const save = async () => {
    setSaving(true); setErr("");
    const payload = {};
    Object.entries(form).forEach(([k, v]) => {
      if (["datum","notiz"].includes(k)) payload[k] = v || null;
      else payload[k] = v === "" ? 0 : parseFloat(v);
    });
    try {
      if (initial?.id)
        await api.put(`/api/v1/tagesabschluss/${initial.id}`, payload);
      else
        await api.post("/api/v1/tagesabschluss", payload);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  const numField = (label, key, opts = {}) => (
    <div className="ac-form-col">
      <label className="ac-label">{label}</label>
      <input className="ac-input" type="number" step="0.01" min="0"
        value={form[key]} onChange={e => set(key, e.target.value)}
        placeholder="0,00" {...opts} />
    </div>
  );

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 620 }}>
        <div className="ac-modal-title">{initial?.id ? "Tagesabschluss bearbeiten" : "Neuer Tagesabschluss (Z-Bon)"}</div>
        {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Datum *</label>
            <input className="ac-input" type="date" value={form.datum}
              onChange={e => set("datum", e.target.value)} />
          </div>
        </div>

        {/* Zahlungsarten */}
        <div style={{ fontWeight: 600, fontSize: ".8rem", color: "var(--ink2)", marginBottom: 8,
          textTransform: "uppercase", letterSpacing: ".05em" }}>
          Einnahmen nach Zahlungsart (Brutto)
        </div>
        <div className="ac-form-row">
          {numField("Bargeld", "bar_betrag")}
          {numField("EC-Karte / Girocard", "ec_betrag")}
          {numField("Kreditkarte", "kreditkarte_betrag")}
        </div>
        <div className="ac-form-row">
          {numField("Gutschein / Voucher", "gutschein_betrag")}
          {numField("Sonstige", "sonstige_betrag")}
          <div className="ac-form-col" style={{ justifyContent: "flex-end" }}>
            <div style={{ background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "9px 12px", fontFamily: "JetBrains Mono,monospace",
              fontSize: ".85rem" }}>
              Gesamt: <strong style={{ color: calc.diff ? "var(--a3)" : "var(--accent)" }}>
                {EUR(calc.gesamt)}
              </strong>
            </div>
          </div>
        </div>

        {/* USt-Split */}
        <div style={{ fontWeight: 600, fontSize: ".8rem", color: "var(--ink2)", margin: "12px 0 8px",
          textTransform: "uppercase", letterSpacing: ".05em" }}>
          Umsatzsteuer-Aufschlüsselung (Brutto-Anteile)
        </div>
        <div className="ac-form-row">
          {numField("Anteil 19 % MwSt", "umsatz_brutto_19")}
          {numField("Anteil 7 % MwSt", "umsatz_brutto_7")}
          {numField("Steuerfrei / 0 %", "umsatz_brutto_0")}
        </div>

        {/* Vorschau */}
        {(parseFloat(form.umsatz_brutto_19||0) > 0 || parseFloat(form.umsatz_brutto_7||0) > 0) && (
          <div style={{ background: "var(--surface2)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "12px 16px", marginBottom: 12, fontSize: ".82rem" }}>
            <div style={{ color: "var(--ink2)", marginBottom: 6, fontSize: ".75rem",
              textTransform: "uppercase", letterSpacing: ".04em" }}>Buchungsvorschau</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
              {parseFloat(form.umsatz_brutto_19||0) > 0 && <>
                <span style={{ color: "var(--ink2)" }}>Netto 19 %:</span>
                <span className="ac-mono">{EUR(calc.netto19)}</span>
                <span style={{ color: "var(--ink2)" }}>USt 19 %:</span>
                <span className="ac-mono" style={{ color: "var(--a2)" }}>{EUR(calc.ust19)}</span>
              </>}
              {parseFloat(form.umsatz_brutto_7||0) > 0 && <>
                <span style={{ color: "var(--ink2)" }}>Netto 7 %:</span>
                <span className="ac-mono">{EUR(calc.netto7)}</span>
                <span style={{ color: "var(--ink2)" }}>USt 7 %:</span>
                <span className="ac-mono" style={{ color: "var(--a2)" }}>{EUR(calc.ust7)}</span>
              </>}
            </div>
          </div>
        )}

        {calc.diff !== null && (
          <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>
            Differenz zwischen Zahlungsarten ({EUR(calc.gesamt)}) und
            USt-Brutto-Summe ({EUR(calc.ustSum)}): <strong>{EUR(Math.abs(calc.diff))}</strong>.
            Bitte prüfen — beide Summen müssen übereinstimmen.
          </div>
        )}

        {/* Kassensturz */}
        <div style={{ fontWeight: 600, fontSize: ".8rem", color: "var(--ink2)", margin: "12px 0 8px",
          textTransform: "uppercase", letterSpacing: ".05em" }}>
          Kassensturz (optional)
        </div>
        <div className="ac-form-row">
          {numField("Soll-Bestand (laut System)", "kassenbestand_soll")}
          {numField("Ist-Bestand (gezählt)", "kassenbestand_ist")}
          <div className="ac-form-col" style={{ justifyContent: "flex-end" }}>
            {calc.kDiff !== null && (
              <div style={{ background: "var(--surface2)", border: `1px solid ${Math.abs(calc.kDiff) > 0.01 ? "rgba(255,77,141,.3)" : "var(--border)"}`,
                borderRadius: 8, padding: "9px 12px", fontFamily: "JetBrains Mono,monospace", fontSize: ".85rem" }}>
                Differenz: <strong style={{ color: Math.abs(calc.kDiff) < 0.01 ? "var(--accent)" : "var(--a3)" }}>
                  {calc.kDiff >= 0 ? "+" : ""}{EUR(calc.kDiff)}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Notiz */}
        <div className="ac-form-col" style={{ marginBottom: 4 }}>
          <label className="ac-label">Notiz</label>
          <input className="ac-input" value={form.notiz} onChange={e => set("notiz", e.target.value)}
            placeholder="z.B. Feiertag, besonderes Ereignis…" />
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving || calc.diff !== null}>
            {saving ? "…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CSV-Import-Modal ──────────────────────────────────────────────────────────
function ImportModal({ onDone, onClose }) {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState([]);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const inputRef              = useRef();

  const handleFile = (f) => {
    setFile(f); setResult(null); setErr("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.split("\n").filter(Boolean);
      setPreview(lines.slice(0, 8));
    };
    reader.readAsText(f, "utf-8");
  };

  const downloadTemplate = async () => {
    const r = await api.get("/api/v1/tagesabschluss/csv-template", { responseType: "blob" });
    const url = URL.createObjectURL(r.data);
    const a = document.createElement("a"); a.href = url;
    a.download = "Tagesabschluss_Import_Vorlage.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async () => {
    if (!file) return;
    setLoading(true); setErr("");
    const fd = new FormData(); fd.append("file", file);
    try {
      const r = await api.post("/api/v1/tagesabschluss/import/csv", fd,
        { headers: { "Content-Type": "multipart/form-data" } });
      setResult(r.data);
      if (r.data.imported > 0) onDone();
    } catch (e) {
      setErr(e.response?.data?.detail || "Import fehlgeschlagen.");
    } finally { setLoading(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 640 }}>
        <div className="ac-modal-title">CSV-Import — Tagesabschlüsse</div>

        <div className="ac-alert ac-alert-warn" style={{ marginBottom: 16, fontSize: ".82rem" }}>
          <strong>Unterstützte Formate:</strong> NILL-Standard (Semikolon) oder SumUp-Export (Komma).
          <br />Pro Tag und User darf nur ein Eintrag existieren — bestehende Daten werden nicht überschrieben.
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={downloadTemplate}>
            Vorlage herunterladen
          </button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => inputRef.current?.click()}>
            CSV-Datei wählen
          </button>
          <input ref={inputRef} type="file" accept=".csv,text/csv" style={{ display: "none" }}
            onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
        </div>

        {file && (
          <div style={{ marginBottom: 12, fontSize: ".82rem", color: "var(--ink2)" }}>
            Gewählt: <strong style={{ color: "var(--ink)" }}>{file.name}</strong>
          </div>
        )}

        {preview.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: ".75rem", color: "var(--ink2)", marginBottom: 6,
              textTransform: "uppercase", letterSpacing: ".04em" }}>Vorschau (erste 8 Zeilen)</div>
            <div style={{ background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: 8, padding: 12, fontFamily: "JetBrains Mono,monospace",
              fontSize: ".72rem", overflowX: "auto", maxHeight: 160, overflowY: "auto" }}>
              {preview.map((l, i) => <div key={i} style={{ whiteSpace: "nowrap" }}>{l}</div>)}
            </div>
          </div>
        )}

        {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}

        {result && (
          <div className={`ac-alert ${result.imported > 0 ? "ac-alert-ok" : "ac-alert-warn"}`}
            style={{ marginBottom: 12 }}>
            <strong>Ergebnis:</strong> {result.imported} importiert, {result.skipped} übersprungen.
            {result.errors?.length > 0 && (
              <ul style={{ marginTop: 8, paddingLeft: 16, fontSize: ".8rem" }}>
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
        )}

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Schließen</button>
          {file && !result && (
            <button className="ac-btn ac-btn-primary" onClick={doImport} disabled={loading}>
              {loading ? "Importiere…" : "Jetzt importieren"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Detailansicht-Modal ───────────────────────────────────────────────────────
function DetailModal({ ta, onClose }) {
  const rows = [
    ["Datum", ta.datum],
    ["Status", STATUS_LABEL[ta.status] || ta.status],
    ["Bargeld", EUR(ta.bar_betrag)],
    ["EC-Karte", EUR(ta.ec_betrag)],
    ["Kreditkarte", EUR(ta.kreditkarte_betrag)],
    ["Gutschein", EUR(ta.gutschein_betrag)],
    ["Sonstige", EUR(ta.sonstige_betrag)],
    ["Gesamtumsatz (brutto)", EUR(ta.gesamtumsatz_brutto)],
    ["— Netto 19 %", EUR(ta.netto_19)],
    ["— USt 19 %", EUR(ta.ust_19_betrag)],
    ["— Netto 7 %", EUR(ta.netto_7)],
    ["— USt 7 %", EUR(ta.ust_7_betrag)],
    ["— Steuerfrei", EUR(ta.umsatz_brutto_0)],
    ta.kassenbestand_soll != null && ["Kassenbestand Soll", EUR(ta.kassenbestand_soll)],
    ta.kassenbestand_ist  != null && ["Kassenbestand Ist",  EUR(ta.kassenbestand_ist)],
    ta.kassendifferenz    != null && ["Kassendifferenz",    EUR(ta.kassendifferenz)],
    ta.buchungssatz_id    != null && ["Buchungssatz-ID",    ta.buchungssatz_id],
    ta.notiz              && ["Notiz", ta.notiz],
    ["Quelle", ta.quelle === "csv_import" ? `CSV (${ta.csv_dateiname || ""})` : "Manuell"],
  ].filter(Boolean);

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 480 }}>
        <div className="ac-modal-title">Tagesabschluss {ta.datum}</div>
        <div className="ac-card" style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
          <table className="ac-table">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k}>
                  <td style={{ color: "var(--ink2)", width: "50%" }}>{k}</td>
                  <td className="ac-mono" style={{ fontWeight: 600 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  );
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export default function TagesabschlussTab() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);  // null | "new" | "import" | {ta} | {ta, mode:"edit"|"detail"}
  const [msg, setMsg]         = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/tagesabschluss")
      .then(r => setRows(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (text, type = "ok") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  const buchen = async (ta) => {
    try {
      await api.post(`/api/v1/tagesabschluss/${ta.id}/buchen`);
      flash(`Tagesabschluss ${ta.datum} gebucht.`);
      load();
    } catch (e) {
      flash(e.response?.data?.detail || "Fehler beim Buchen.", "err");
    }
  };

  const stornieren = async (ta) => {
    if (!confirm(`Tagesabschluss ${ta.datum} wirklich stornieren?`)) return;
    try {
      await api.post(`/api/v1/tagesabschluss/${ta.id}/stornieren`);
      flash(`Tagesabschluss ${ta.datum} storniert.`);
      load();
    } catch (e) {
      flash(e.response?.data?.detail || "Fehler.", "err");
    }
  };

  const loeschen = async (ta) => {
    if (!confirm(`Entwurf vom ${ta.datum} löschen?`)) return;
    try {
      await api.delete(`/api/v1/tagesabschluss/${ta.id}`);
      flash("Gelöscht.");
      load();
    } catch (e) {
      flash(e.response?.data?.detail || "Fehler.", "err");
    }
  };

  const exportCsv = async () => {
    const r = await api.get("/api/v1/tagesabschluss/export/csv", { responseType: "blob" });
    const url = URL.createObjectURL(r.data);
    const a = document.createElement("a"); a.href = url;
    a.download = "Tagesabschluesse.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // KPI
  const gebucht = rows.filter(r => r.status === "gebucht");
  const monat   = new Date().toISOString().slice(0, 7);
  const dieserMonat = gebucht.filter(r => r.datum.startsWith(monat));
  const umsatzMonat = dieserMonat.reduce((s, r) => s + (r.gesamtumsatz_brutto || 0), 0);
  const barMonat    = dieserMonat.reduce((s, r) => s + (r.bar_betrag || 0), 0);
  const ecMonat     = dieserMonat.reduce((s, r) => s + (r.ec_betrag || 0) + (r.kreditkarte_betrag || 0), 0);
  const entwuerfe   = rows.filter(r => r.status === "entwurf").length;

  return (
    <div>
      {msg && (
        <div className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
          style={{ cursor: "pointer", marginBottom: 16 }} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>
            Tagesabschluss
          </span>
          <span style={{ fontSize: ".75rem", color: "var(--ink2)", marginLeft: 10 }}>
            Z-Bon-Erfassung · Einzelhandel · Gastronomie · Tankstelle
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={exportCsv}>Export CSV</button>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setModal("import")}>
            CSV-Import
          </button>
          <button className="ac-btn ac-btn-primary" onClick={() => setModal("new")}>
            + Tagesabschluss
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="ac-kpi-grid" style={{ marginBottom: 16 }}>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Umsatz diesen Monat</div>
          <div className="ac-kpi-value green">{EUR(umsatzMonat)}</div>
          <div className="ac-kpi-delta">{dieserMonat.length} Abschlüsse</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Bargeld diesen Monat</div>
          <div className="ac-kpi-value">{EUR(barMonat)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">EC / Karte diesen Monat</div>
          <div className="ac-kpi-value purple">{EUR(ecMonat)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Offene Entwürfe</div>
          <div className={`ac-kpi-value ${entwuerfe > 0 ? "pink" : ""}`}>{entwuerfe}</div>
          {entwuerfe > 0 && <div className="ac-kpi-delta">noch nicht gebucht</div>}
        </div>
      </div>

      {entwuerfe > 0 && (
        <div className="ac-alert ac-alert-warn" style={{ marginBottom: 12 }}>
          {entwuerfe} Entwurf{entwuerfe > 1 ? "e" : ""} noch nicht gebucht —
          bitte „Buchen" klicken, um den Buchungssatz zu erzeugen.
        </div>
      )}

      {/* Tabelle */}
      {loading ? (
        <div className="ac-loading"><span className="ac-spinner" />Lade Tagesabschlüsse…</div>
      ) : rows.length === 0 ? (
        <div className="ac-empty">
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>🏪</div>
          <div style={{ marginBottom: 8 }}>Noch keine Tagesabschlüsse erfasst.</div>
          <div style={{ fontSize: ".82rem", color: "var(--ink2)" }}>
            Erstelle den ersten Abschluss oder importiere eine CSV-Datei aus deinem Kassensystem.
          </div>
        </div>
      ) : (
        <div className="ac-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Gesamt</th>
                  <th style={{ textAlign: "right" }}>Bargeld</th>
                  <th style={{ textAlign: "right" }}>EC/Karte</th>
                  <th style={{ textAlign: "right" }}>USt 19 %</th>
                  <th style={{ textAlign: "right" }}>USt 7 %</th>
                  <th style={{ textAlign: "right" }}>Kassendiff.</th>
                  <th>Quelle</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map(ta => {
                  const ec = (ta.ec_betrag || 0) + (ta.kreditkarte_betrag || 0);
                  const diff = ta.kassendifferenz;
                  return (
                    <tr key={ta.id}>
                      <td className="ac-mono" style={{ fontSize: ".82rem", fontWeight: 600 }}>
                        {ta.datum}
                      </td>
                      <td>
                        <span className={`ac-badge ${STATUS_CLASS[ta.status] || "ac-badge-gray"}`}>
                          {STATUS_LABEL[ta.status] || ta.status}
                        </span>
                      </td>
                      <td className="ac-mono" style={{ textAlign: "right", fontWeight: 700,
                        color: "var(--accent)" }}>
                        {EUR(ta.gesamtumsatz_brutto)}
                      </td>
                      <td className="ac-mono" style={{ textAlign: "right" }}>{EUR(ta.bar_betrag)}</td>
                      <td className="ac-mono" style={{ textAlign: "right", color: "var(--a2)" }}>
                        {EUR(ec)}
                      </td>
                      <td className="ac-mono" style={{ textAlign: "right", fontSize: ".8rem",
                        color: "var(--ink2)" }}>
                        {EUR(ta.ust_19_betrag)}
                      </td>
                      <td className="ac-mono" style={{ textAlign: "right", fontSize: ".8rem",
                        color: "var(--ink2)" }}>
                        {ta.ust_7_betrag > 0 ? EUR(ta.ust_7_betrag) : "—"}
                      </td>
                      <td className="ac-mono" style={{ textAlign: "right", fontSize: ".8rem",
                        color: diff == null ? "var(--ink2)"
                          : Math.abs(diff) < 0.01 ? "var(--accent)" : "var(--a3)" }}>
                        {diff != null ? (diff >= 0 ? "+" : "") + EUR(diff) : "—"}
                      </td>
                      <td style={{ fontSize: ".78rem", color: "var(--ink2)" }}>
                        {ta.quelle === "csv_import" ? "CSV" : "Manuell"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button className="ac-btn ac-btn-ghost ac-btn-sm"
                            onClick={() => setModal({ ta, mode: "detail" })}>Details</button>
                          {ta.status === "entwurf" && <>
                            <button className="ac-btn ac-btn-ghost ac-btn-sm"
                              onClick={() => setModal({ ta, mode: "edit" })}>Bearb.</button>
                            <button className="ac-btn ac-btn-primary ac-btn-sm"
                              onClick={() => buchen(ta)}>Buchen</button>
                            <button className="ac-btn ac-btn-danger ac-btn-sm"
                              onClick={() => loeschen(ta)}>Löschen</button>
                          </>}
                          {ta.status === "gebucht" && (
                            <button className="ac-btn ac-btn-danger ac-btn-sm"
                              onClick={() => stornieren(ta)}>Storno</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hinweis EC-Abgleich */}
      {gebucht.some(r => (r.ec_betrag || 0) + (r.kreditkarte_betrag || 0) > 0) && (
        <div className="ac-alert ac-alert-warn" style={{ marginTop: 16, fontSize: ".8rem" }}>
          EC-/Kartenumsätze werden auf Konto 1460 gebucht (Durchlaufkonto).
          Sie erscheinen als offene Forderung, bis der Bankeingang im Bank-Abgleich
          mit dem Konto 1460 verrechnet wird.
        </div>
      )}

      {/* Modals */}
      {modal === "new" && (
        <AbschlussModal onSaved={() => { setModal(null); load(); flash("Tagesabschluss gespeichert."); }}
          onClose={() => setModal(null)} />
      )}
      {modal === "import" && (
        <ImportModal onDone={() => load()} onClose={() => setModal(null)} />
      )}
      {modal?.mode === "edit" && (
        <AbschlussModal initial={modal.ta}
          onSaved={() => { setModal(null); load(); flash("Gespeichert."); }}
          onClose={() => setModal(null)} />
      )}
      {modal?.mode === "detail" && (
        <DetailModal ta={modal.ta} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
