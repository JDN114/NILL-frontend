// src/components/accounting/KostenstellenTab.jsx
// Kostenstellenrechnung — CRUD + Auswertung
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

const today = () => new Date().toISOString().slice(0, 10);
const firstOfYear = () => `${new Date().getFullYear()}-01-01`;

// ── Formular ──────────────────────────────────────────────────────────────────
function KstForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(
    initial || { nummer: "", bezeichnung: "", beschreibung: "", aktiv: true }
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.nummer.trim() || !form.bezeichnung.trim()) {
      setErr("Nummer und Bezeichnung sind Pflichtfelder."); return;
    }
    setBusy(true); setErr("");
    try {
      if (initial?.id)
        await api.put(`/api/v1/kostenstellen/${initial.id}`, form);
      else
        await api.post("/api/v1/kostenstellen", form);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setBusy(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="ac-modal" style={{ maxWidth: 480 }}>
        <div className="ac-modal-title">{initial?.id ? "Kostenstelle bearbeiten" : "Kostenstelle anlegen"}</div>
        {err && <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}
        <div className="ac-form-row">
          <div className="ac-form-col" style={{ flex: "0 0 120px" }}>
            <label className="ac-label">Nummer *</label>
            <input aria-required="true" className="ac-input" value={form.nummer} onChange={e => set("nummer", e.target.value)}
              placeholder="z.B. KST-100" disabled={!!initial?.id} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Bezeichnung *</label>
            <input aria-required="true" className="ac-input" value={form.bezeichnung} onChange={e => set("bezeichnung", e.target.value)}
              placeholder="z.B. Marketing" />
          </div>
        </div>
        <label className="ac-label">Beschreibung</label>
        <textarea className="ac-input" rows={2} value={form.beschreibung || ""}
          onChange={e => set("beschreibung", e.target.value)}
          placeholder="Optionale Beschreibung…" style={{ resize: "vertical", marginBottom: 12 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".88rem", marginBottom: 16 }}>
          <input type="checkbox" checked={form.aktiv} onChange={e => set("aktiv", e.target.checked)} />
          Aktiv
        </label>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onCancel}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={busy}>
            {busy ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Auswertungs-Panel ─────────────────────────────────────────────────────────
function KstAuswertung({ kst, onClose }) {
  const [von, setVon]           = useState(firstOfYear());
  const [bis, setBis]           = useState(today());
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get(`/api/v1/kostenstellen/${kst.id}/auswertung`,
        { params: { von, bis } });
      setData(r.data);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [kst.id, von, bis]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 800, overflowY: "auto", maxHeight: "90vh" }}>
        <div className="ac-modal-title">Kostenstellenauswertung — {kst.nummer} {kst.bezeichnung}</div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div><label className="ac-label">Von</label>
            <input className="ac-input" type="date" value={von} onChange={e => setVon(e.target.value)} /></div>
          <div><label className="ac-label">Bis</label>
            <input className="ac-input" type="date" value={bis} onChange={e => setBis(e.target.value)} /></div>
        </div>

        {loading ? (
          <div role="status" aria-live="polite" className="ac-loading"><span className="ac-spinner" aria-hidden="true" /> Lade…</div>
        ) : data ? (
          <>
            {/* KPIs */}
            <div className="ac-kpi-grid" style={{ marginBottom: 20 }}>
              <div className="ac-kpi"><div className="ac-kpi-label">Soll (Aufwand)</div>
                <div className="ac-kpi-value">{fmtEur(data.soll_summe)}</div></div>
              <div className="ac-kpi"><div className="ac-kpi-label">Haben (Erlös)</div>
                <div className="ac-kpi-value green">{fmtEur(data.haben_summe)}</div></div>
              <div className="ac-kpi"><div className="ac-kpi-label">Saldo</div>
                <div className={`ac-kpi-value ${data.saldo < 0 ? "green" : ""}`}>
                  {fmtEur(data.saldo)}</div></div>
              <div className="ac-kpi"><div className="ac-kpi-label">Deckungsbeitrag</div>
                <div className={`ac-kpi-value ${data.deckungsbeitrag >= 0 ? "green" : "red"}`}>
                  {fmtEur(data.deckungsbeitrag)}</div></div>
            </div>

            {/* Zeilen */}
            {data.zeilen.length > 0 ? (
              <div className="ac-table-wrap">
                <table aria-label="Kostenstellen" className="ac-table">
                  <thead><tr>
                    <th scope="col">Datum</th><th scope="col">Text</th><th scope="col">Beleg</th><th scope="col">Konto</th>
                    <th scope="col" style={{ textAlign: "right" }}>Soll</th>
                    <th scope="col" style={{ textAlign: "right" }}>Haben</th>
                  </tr></thead>
                  <tbody>
                    {data.zeilen.map((z, i) => (
                      <tr key={i}>
                        <td className="ac-mono">{z.buchungsdatum}</td>
                        <td>{z.buchungstext}</td>
                        <td className="ac-mono" style={{ fontSize: ".8rem" }}>{z.beleg_nummer || "—"}</td>
                        <td style={{ fontSize: ".82rem" }}>{z.kontonummer} {z.konto_bezeichnung}</td>
                        <td className="ac-mono" style={{ textAlign: "right" }}>
                          {z.soll > 0 ? fmtEur(z.soll) : "—"}</td>
                        <td className="ac-mono" style={{ textAlign: "right" }}>
                          {z.haben > 0 ? fmtEur(z.haben) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="ac-empty">Keine Buchungen im gewählten Zeitraum.</div>
            )}
          </>
        ) : null}

        <div className="ac-modal-footer" style={{ marginTop: 16 }}>
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  );
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export default function KostenstellenTab() {
  const [list, setList]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [auswertung, setAuswertung] = useState(null);
  const [err, setErr]             = useState("");
  const [gesamt, setGesamt]       = useState(null);
  const [gesamtVon, setGesamtVon] = useState(firstOfYear());
  const [gesamtBis, setGesamtBis] = useState(today());

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const [r, g] = await Promise.all([
        api.get("/api/v1/kostenstellen", { params: { nur_aktive: false } }),
        api.get("/api/v1/kostenstellen/auswertung/gesamt",
          { params: { von: gesamtVon, bis: gesamtBis } }).catch(() => ({ data: [] })),
      ]);
      setList(r.data || []);
      setGesamt(g.data || []);
    } catch { setErr("Laden fehlgeschlagen."); }
    finally { setLoading(false); }
  }, [gesamtVon, gesamtBis]);

  useEffect(() => { load(); }, [load]);

  const deactivate = async (id) => {
    if (!window.confirm("Kostenstelle deaktivieren?")) return;
    await api.delete(`/api/v1/kostenstellen/${id}`).catch(() => {});
    load();
  };

  if (loading) return <div role="status" aria-live="polite" className="ac-loading"><span className="ac-spinner" aria-hidden="true" /> Laden…</div>;

  return (
    <div>
      {err && <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom: 14 }}>{err}</div>}

      {/* Gesamtübersicht */}
      {gesamt && gesamt.length > 0 && (
        <div className="ac-card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
            borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
            <span className="ac-section-title">Gesamtauswertung</span>
            <div style={{ display: "flex", gap: 8, marginLeft: "auto", alignItems: "center" }}>
              <input className="ac-input" type="date" value={gesamtVon}
                onChange={e => setGesamtVon(e.target.value)} style={{ width: 130 }} />
              <span style={{ color: "var(--ink2)", fontSize: ".82rem" }}>bis</span>
              <input className="ac-input" type="date" value={gesamtBis}
                onChange={e => setGesamtBis(e.target.value)} style={{ width: 130 }} />
            </div>
          </div>
          <div className="ac-table-wrap">
            <table aria-label="Kostenstellen" className="ac-table">
              <thead><tr>
                <th scope="col">Nr.</th><th scope="col">Bezeichnung</th>
                <th scope="col" style={{ textAlign: "right" }}>Soll</th>
                <th scope="col" style={{ textAlign: "right" }}>Haben</th>
                <th scope="col" style={{ textAlign: "right" }}>Saldo</th>
              </tr></thead>
              <tbody>
                {gesamt.map(k => (
                  <tr key={k.id}>
                    <td className="ac-mono">{k.nummer}</td>
                    <td>{k.bezeichnung}</td>
                    <td className="ac-mono" style={{ textAlign: "right" }}>{fmtEur(k.soll)}</td>
                    <td className="ac-mono" style={{ textAlign: "right" }}>{fmtEur(k.haben)}</td>
                    <td className="ac-mono" style={{ textAlign: "right",
                      color: k.saldo < 0 ? "var(--accent)" : "var(--a3)" }}>
                      {fmtEur(k.saldo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: ".9rem", color: "var(--ink2)" }}>
          {list.length} Kostenstelle{list.length !== 1 ? "n" : ""}
        </span>
        <button className="ac-btn ac-btn-primary" style={{ marginLeft: "auto" }}
          onClick={() => { setEditing(null); setShowForm(true); }}>
          + Kostenstelle
        </button>
      </div>

      {/* Tabelle */}
      {list.length === 0 ? (
        <div className="ac-empty">
          Noch keine Kostenstellen angelegt.
          Kostenstellen ermöglichen die interne Leistungsverrechnung und Budgetkontrolle.
        </div>
      ) : (
        <div className="ac-table-wrap">
          <table aria-label="Kostenstellen" className="ac-table">
            <thead><tr>
              <th scope="col">Nummer</th><th scope="col">Bezeichnung</th><th scope="col">Beschreibung</th>
              <th scope="col">Status</th><th scope="col">Aktionen</th>
            </tr></thead>
            <tbody>
              {list.map(k => (
                <tr key={k.id} style={{ opacity: k.aktiv ? 1 : 0.5 }}>
                  <td className="ac-mono" style={{ fontWeight: 600 }}>{k.nummer}</td>
                  <td>{k.bezeichnung}</td>
                  <td style={{ color: "var(--ink2)", fontSize: ".85rem", maxWidth: 220,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {k.beschreibung || "—"}
                  </td>
                  <td>
                    <span className={`ac-badge ${k.aktiv ? "ac-badge-green" : "ac-badge-gray"}`}
                      style={{ fontSize: ".72rem" }}>
                      {k.aktiv ? "Aktiv" : "Inaktiv"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="ac-btn ac-btn-ghost ac-btn-sm"
                        onClick={() => setAuswertung(k)}>Auswertung</button>
                      <button className="ac-btn ac-btn-ghost ac-btn-sm"
                        onClick={() => { setEditing(k); setShowForm(true); }}>Bearbeiten</button>
                      {k.aktiv && (
                        <button className="ac-btn ac-btn-ghost ac-btn-sm"
                          style={{ color: "var(--a3)" }}
                          onClick={() => deactivate(k.id)}>Deaktiv.</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <KstForm
          initial={editing}
          onSaved={() => { setShowForm(false); setEditing(null); load(); }}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {auswertung && (
        <KstAuswertung kst={auswertung} onClose={() => setAuswertung(null)} />
      )}
    </div>
  );
}
