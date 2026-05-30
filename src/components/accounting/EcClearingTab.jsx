// src/components/accounting/EcClearingTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const EUR = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY_FORM = {
  valuta_datum: today(),
  abgedeckte_tage_von: "",
  abgedeckte_tage_bis: "",
  bank_betrag: "",
  referenz: "",
  notiz: "",
};

// ── Clearing-Modal ────────────────────────────────────────────────────────────
function ClearingModal({ onSaved, onClose }) {
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [vorschau, setVorschau]   = useState(null);
  const [vorschauErr, setVorschauErr] = useState("");
  const [loadingVorschau, setLoadingVorschau] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [err, setErr]             = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const bankBetrag   = parseFloat(form.bank_betrag || 0);
  const erwartet     = vorschau ? parseFloat(vorschau.erwarteter_betrag || 0) : null;
  const differenz    = erwartet !== null ? bankBetrag - erwartet : null;

  const fetchVorschau = async () => {
    if (!form.abgedeckte_tage_von || !form.abgedeckte_tage_bis) {
      setVorschauErr("Bitte Von- und Bis-Datum eingeben.");
      return;
    }
    setLoadingVorschau(true);
    setVorschauErr("");
    setVorschau(null);
    try {
      const res = await api.get(
        `/api/v1/ec-clearing/vorschau?von=${form.abgedeckte_tage_von}&bis=${form.abgedeckte_tage_bis}`
      );
      setVorschau(res.data);
    } catch (e) {
      setVorschauErr(e?.response?.data?.detail || "Vorschau konnte nicht geladen werden.");
    } finally {
      setLoadingVorschau(false);
    }
  };

  const save = async () => {
    if (!form.valuta_datum || !form.abgedeckte_tage_von || !form.abgedeckte_tage_bis || !form.bank_betrag) {
      setErr("Pflichtfelder: Valuta-Datum, Zeitraum und Bank-Betrag.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const payload = {
        valuta_datum: form.valuta_datum,
        abgedeckte_tage_von: form.abgedeckte_tage_von,
        abgedeckte_tage_bis: form.abgedeckte_tage_bis,
        bank_betrag: parseFloat(form.bank_betrag),
        referenz: form.referenz || null,
        notiz: form.notiz || null,
      };
      await api.post("/api/v1/ec-clearing", payload);
      onSaved();
    } catch (e) {
      setErr(e?.response?.data?.detail || "Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ac-modal-backdrop" onClick={onClose}>
      <div className="ac-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="ac-modal-title">EC-Clearing erfassen</div>

        {/* Valuta-Datum */}
        <div className="ac-form-row" style={{ marginTop: 20 }}>
          <div className="ac-form-col">
            <label className="ac-label">Valuta-Datum <span style={{ color: "var(--a3)" }}>*</span></label>
            <input
              type="date"
              className="ac-input"
              value={form.valuta_datum}
              onChange={(e) => set("valuta_datum", e.target.value)}
            />
            <div style={{ fontSize: ".75rem", color: "var(--ink2)", marginTop: 4 }}>
              Datum der Bank-Gutschrift
            </div>
          </div>
        </div>

        {/* Zeitraum */}
        <div style={{ marginTop: 16 }}>
          <label className="ac-label">
            Zeitraum der Tagesabschlüsse <span style={{ color: "var(--a3)" }}>*</span>
          </label>
          <div style={{ fontSize: ".75rem", color: "var(--ink2)", marginBottom: 8 }}>
            Welche Tagesabschlüsse deckt diese Abrechnung ab?
          </div>
          <div className="ac-form-row">
            <div className="ac-form-col">
              <label className="ac-label" style={{ fontSize: ".72rem" }}>Von</label>
              <input
                type="date"
                className="ac-input"
                value={form.abgedeckte_tage_von}
                onChange={(e) => { set("abgedeckte_tage_von", e.target.value); setVorschau(null); }}
              />
            </div>
            <div className="ac-form-col">
              <label className="ac-label" style={{ fontSize: ".72rem" }}>Bis</label>
              <input
                type="date"
                className="ac-input"
                value={form.abgedeckte_tage_bis}
                onChange={(e) => { set("abgedeckte_tage_bis", e.target.value); setVorschau(null); }}
              />
            </div>
          </div>
        </div>

        {/* Vorschau */}
        <div style={{ marginTop: 12 }}>
          <button
            className="ac-btn ac-btn-ghost ac-btn-sm"
            onClick={fetchVorschau}
            disabled={loadingVorschau}
          >
            {loadingVorschau ? "Lade…" : "Vorschau berechnen"}
          </button>
          {vorschau && (
            <div className="ac-alert ac-alert-ok" style={{ marginTop: 10 }}>
              Erwarteter EC-Betrag: <strong>{EUR(vorschau.erwarteter_betrag)}</strong>
              {" "}({vorschau.tage_count} {vorschau.tage_count === 1 ? "Tag" : "Tage"})
            </div>
          )}
          {vorschauErr && (
            <div className="ac-alert ac-alert-err" style={{ marginTop: 10 }}>{vorschauErr}</div>
          )}
        </div>

        {/* Bank-Betrag */}
        <div className="ac-form-row" style={{ marginTop: 16 }}>
          <div className="ac-form-col">
            <label className="ac-label">Bank-Betrag (€) <span style={{ color: "var(--a3)" }}>*</span></label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="ac-input"
              placeholder="0,00"
              value={form.bank_betrag}
              onChange={(e) => set("bank_betrag", e.target.value)}
            />
            <div style={{ fontSize: ".75rem", color: "var(--ink2)", marginTop: 4 }}>
              Auf dem Kontoauszug gebuchter Betrag
            </div>
          </div>
        </div>

        {/* Differenz live */}
        {differenz !== null && form.bank_betrag !== "" && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: "var(--surface2)",
              border: `1px solid ${differenz < 0 ? "rgba(255,77,141,.25)" : "rgba(198,255,60,.2)"}`,
              fontSize: ".85rem",
            }}
          >
            <span style={{ color: "var(--ink2)" }}>Differenz: </span>
            <strong style={{ color: differenz < 0 ? "var(--a3)" : "var(--accent)" }}>
              {EUR(differenz)}
            </strong>
            {differenz < 0 && (
              <div style={{ fontSize: ".75rem", color: "var(--a3)", marginTop: 4 }}>
                ⚠ Bank hat weniger überwiesen (z.B. Gebühren abgezogen)
              </div>
            )}
          </div>
        )}

        {/* Referenz */}
        <div className="ac-form-row" style={{ marginTop: 16 }}>
          <div className="ac-form-col">
            <label className="ac-label">Referenz (optional)</label>
            <input
              type="text"
              className="ac-input"
              placeholder="Verwendungszweck aus Kontoauszug"
              value={form.referenz}
              onChange={(e) => set("referenz", e.target.value)}
            />
          </div>
        </div>

        {/* Notiz */}
        <div className="ac-form-row" style={{ marginTop: 16 }}>
          <div className="ac-form-col">
            <label className="ac-label">Notiz (optional)</label>
            <textarea
              className="ac-input"
              rows={3}
              style={{ resize: "vertical" }}
              value={form.notiz}
              onChange={(e) => set("notiz", e.target.value)}
            />
          </div>
        </div>

        {err && (
          <div className="ac-alert ac-alert-err" style={{ marginTop: 12 }}>{err}</div>
        )}

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose} disabled={saving}>
            Abbrechen
          </button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export default function EcClearingTab() {
  const [batches, setBatches]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [err, setErr]             = useState("");
  const [showModal, setShowModal] = useState(false);
  const [actionErr, setActionErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/v1/ec-clearing");
      setBatches(Array.isArray(res.data) ? res.data : (res.data?.items ?? []));
    } catch (e) {
      setErr(e?.response?.data?.detail || "Daten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const ungebucht     = batches.filter((b) => b.status === "offen");
  const gebucht       = batches.filter((b) => b.status === "gebucht");
  const konto1460Open = ungebucht.reduce((s, b) => s + Number(b.erwarteter_betrag || 0), 0);
  const gesamtGebucht = gebucht.reduce((s, b) => s + Number(b.bank_betrag || 0), 0);
  const differenzen   = gebucht.reduce((s, b) => s + Math.abs(Number(b.differenz || 0)), 0);
  const letztesDatum  = gebucht.length
    ? gebucht.sort((a, b) => b.valuta_datum.localeCompare(a.valuta_datum))[0].valuta_datum
    : null;

  // ── Aktionen ──────────────────────────────────────────────────────────────
  const buchen = async (id) => {
    setActionErr("");
    try {
      await api.post(`/api/v1/ec-clearing/${id}/buchen`);
      await load();
    } catch (e) {
      setActionErr(e?.response?.data?.detail || "Buchung fehlgeschlagen.");
    }
  };

  const stornieren = async (id) => {
    if (!window.confirm("Diesen Clearing-Eintrag stornieren?")) return;
    setActionErr("");
    try {
      await api.post(`/api/v1/ec-clearing/${id}/stornieren`);
      await load();
    } catch (e) {
      setActionErr(e?.response?.data?.detail || "Storno fehlgeschlagen.");
    }
  };

  // ── Differenz-Zelle ───────────────────────────────────────────────────────
  const DiffCell = ({ val }) => {
    const n = Number(val || 0);
    if (Math.abs(n) < 0.005) {
      return <span style={{ color: "var(--accent)" }}>✓</span>;
    }
    return (
      <span className="ac-mono" style={{ color: n > 0 ? "var(--accent)" : "var(--a3)" }}>
        {EUR(n)}
      </span>
    );
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString("de-DE") : "—");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Erklärungsbanner */}
      <div
        style={{
          background: "var(--surface2)",
          borderLeft: "3px solid var(--a2)",
          borderRadius: 8,
          padding: "14px 18px",
          fontSize: ".82rem",
          color: "var(--ink2)",
          lineHeight: 1.65,
        }}
      >
        <div style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6, fontSize: ".88rem" }}>
          💳 EC-Clearing: Bank-Sammelabrechnung gegen Konto 1460
        </div>
        Ihre EC-Zahlungen aus dem Tagesabschluss stehen auf Konto 1460 (EC-Durchlaufkonto).
        Wenn die Bank die Sammelbuchung überweist, buchen Sie hier die Gegenbuchung:{" "}
        <strong style={{ color: "var(--ink)" }}>
          Soll 1200 (Girokonto) / Haben 1460 (EC-Durchlaufkonto).
        </strong>
      </div>

      {/* KPI-Zeile */}
      <div className="ac-kpi-grid">
        <div className="ac-kpi">
          <div className="ac-kpi-label">Konto 1460 Offen</div>
          <div className={`ac-kpi-value ${konto1460Open > 0 ? "pink" : ""}`}>
            {EUR(konto1460Open)}
          </div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Letztes Clearing</div>
          <div className="ac-kpi-value">{letztesDatum ? fmt(letztesDatum) : "—"}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Gesamt gebucht</div>
          <div className="ac-kpi-value green">{EUR(gesamtGebucht)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Differenzen</div>
          <div className={`ac-kpi-value ${differenzen > 0.01 ? "pink" : ""}`}>
            {EUR(differenzen)}
          </div>
        </div>
      </div>

      {/* Tabellen-Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="ac-section-title">Clearing-Buchungen</div>
        <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={() => setShowModal(true)}>
          + Clearing erfassen
        </button>
      </div>

      {actionErr && (
        <div className="ac-alert ac-alert-err">{actionErr}</div>
      )}

      {/* Tabelle */}
      <div className="ac-card">
        {loading ? (
          <div className="ac-loading">
            <div className="ac-spinner" />
          </div>
        ) : err ? (
          <div className="ac-alert ac-alert-err">{err}</div>
        ) : batches.length === 0 ? (
          <div className="ac-empty">Noch keine EC-Clearing-Einträge vorhanden.</div>
        ) : (
          <div className="ac-table-wrap">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Valuta</th>
                  <th>Zeitraum</th>
                  <th>Bank-Betrag</th>
                  <th>Erwartet</th>
                  <th>Differenz</th>
                  <th>Referenz</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.id}>
                    <td className="ac-mono">{fmt(b.valuta_datum)}</td>
                    <td className="ac-mono" style={{ fontSize: ".8rem" }}>
                      {fmt(b.abgedeckte_tage_von)} – {fmt(b.abgedeckte_tage_bis)}
                    </td>
                    <td className="ac-mono">{EUR(b.bank_betrag)}</td>
                    <td className="ac-mono">{EUR(b.erwarteter_betrag)}</td>
                    <td><DiffCell val={b.differenz} /></td>
                    <td style={{ color: "var(--ink2)", fontSize: ".82rem" }}>
                      {b.referenz || "—"}
                    </td>
                    <td>
                      {b.status === "offen" && <span className="ac-badge ac-badge-gray">Offen</span>}
                      {b.status === "gebucht" && <span className="ac-badge ac-badge-green">Gebucht</span>}
                      {b.status === "storniert" && <span className="ac-badge ac-badge-pink">Storniert</span>}
                    </td>
                    <td style={{ display: "flex", gap: 6 }}>
                      {b.status === "offen" && (
                        <button
                          className="ac-btn ac-btn-primary ac-btn-sm"
                          onClick={() => buchen(b.id)}
                        >
                          Buchen
                        </button>
                      )}
                      {b.status === "gebucht" && (
                        <button
                          className="ac-btn ac-btn-danger ac-btn-sm"
                          onClick={() => stornieren(b.id)}
                        >
                          Storno
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ClearingModal
          onSaved={() => { setShowModal(false); load(); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
