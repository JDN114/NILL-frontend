// src/components/accounting/GutschriftTab.jsx — Gutschriften §14 Abs. 2 UStG
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const STATUS_META = {
  entwurf:    { label: "Entwurf",    cls: "ac-badge-gray" },
  finalisiert:{ label: "Finalisiert",cls: "ac-badge-purple" },
  ausgezahlt: { label: "Ausgezahlt", cls: "ac-badge-green" },
};

const EMPTY_FORM = {
  empfaenger_name: "", empfaenger_strasse: "", empfaenger_plz_ort: "", empfaenger_land: "DE",
  absender_name: "", absender_strasse: "", absender_plz_ort: "",
  gutschriftdatum: new Date().toISOString().slice(0, 10),
  beschreibung: "", betrag_netto: "", ust_satz: "19",
};

function GutschriftForm({ initial, onSaved, onCancel }) {
  const [form, setForm]   = useState(() => ({ ...EMPTY_FORM, ...(initial || {}) }));
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const netto  = parseFloat(form.betrag_netto || 0);
  const ust    = parseFloat(form.ust_satz || 19);
  const brutto = netto * (1 + ust / 100);

  const save = async () => {
    if (!form.empfaenger_name.trim() || !form.betrag_netto) {
      setError("Empfänger und Betrag sind Pflichtfelder.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        netto_summe:  netto,
        ust_summe:    netto * ust / 100,
        brutto_summe: brutto,
        positionen:   [{ beschreibung: form.beschreibung, betrag_netto: netto, ust_satz: ust }],
      };
      if (initial?.id) {
        await api.patch(`/api/v1/gutschriften/${initial.id}`, payload);
      } else {
        await api.post("/api/v1/gutschriften", payload);
      }
      onSaved();
    } catch (e) {
      setError(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-card" style={{ marginBottom: 16 }}>
      <div className="ac-section-title">
        {initial?.id ? "Gutschrift bearbeiten" : "Neue Gutschrift"}{" "}
        <span style={{ fontSize: ".75rem", color: "var(--ink2)", fontFamily: "monospace" }}>§14 Abs. 2 UStG</span>
      </div>
      {error && <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="ac-form-row">
        <div className="ac-form-col" style={{ flex: 2 }}>
          <label className="ac-label">Empfänger *</label>
          <input className="ac-input" value={form.empfaenger_name}
            onChange={e => set("empfaenger_name", e.target.value)} placeholder="Firmenname / Name" />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Datum</label>
          <input className="ac-input" type="date" value={form.gutschriftdatum}
            onChange={e => set("gutschriftdatum", e.target.value)} />
        </div>
      </div>
      <div className="ac-form-row">
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
        <div className="ac-form-col" style={{ flex: 3 }}>
          <label className="ac-label">Beschreibung der Leistungskorrektur</label>
          <input className="ac-input" value={form.beschreibung}
            onChange={e => set("beschreibung", e.target.value)}
            placeholder="z.B. Rückerstattung Rechnung RE-2025-001" />
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
          display: "flex", gap: 20, padding: "10px 14px",
          background: "var(--surface2)", borderRadius: 8, marginBottom: 16,
          fontSize: ".85rem", fontFamily: "JetBrains Mono, monospace",
        }}>
          <span>Netto: {fmtEur(netto)}</span>
          <span>USt {ust}%: {fmtEur(netto * ust / 100)}</span>
          <span style={{ fontWeight: 700 }}>Brutto: {fmtEur(brutto)}</span>
        </div>
      )}

      <div className="ac-form-row">
        <div className="ac-form-col" style={{ flex: 2 }}>
          <label className="ac-label">Absender (Ihre Firma)</label>
          <input className="ac-input" autoComplete="organization" value={form.absender_name}
            onChange={e => set("absender_name", e.target.value)} placeholder="Ihr Firmenname" />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Absender Straße</label>
          <input className="ac-input" value={form.absender_strasse}
            onChange={e => set("absender_strasse", e.target.value)} />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Absender PLZ / Ort</label>
          <input className="ac-input" value={form.absender_plz_ort}
            onChange={e => set("absender_plz_ort", e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="ac-btn ac-btn-ghost" onClick={onCancel}>Abbrechen</button>
        <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Speichern…" : "Gutschrift speichern"}
        </button>
      </div>
    </div>
  );
}

export default function GutschriftTab() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [busy, setBusy]       = useState({});

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/gutschriften")
      .then(r => setList(r.data?.gutschriften || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const finalize = async (id) => {
    if (!window.confirm("Gutschrift finalisieren? Danach nicht mehr änderbar.")) return;
    setBusy(b => ({ ...b, [id]: true }));
    try {
      await api.post(`/api/v1/gutschriften/${id}/finalisieren`);
      load();
    } catch (e) {
      alert(e.response?.data?.detail || "Fehler.");
    } finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  const del = async (id) => {
    if (!window.confirm("Gutschrift löschen?")) return;
    setBusy(b => ({ ...b, [id]: true }));
    try {
      await api.delete(`/api/v1/gutschriften/${id}`);
      load();
    } catch { alert("Löschen fehlgeschlagen."); }
    finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  const downloadPdf = async (id, nr) => {
    try {
      const r = await api.get(`/api/v1/gutschriften/${id}/pdf`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([r.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Gutschrift-${nr || id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert("PDF-Download fehlgeschlagen."); }
  };

  const downloadXrechnung = async (id, nr) => {
    try {
      const r = await api.get(`/api/v1/gutschriften/${id}/xrechnung`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([r.data], { type: "application/xml" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Gutschrift-${nr || id}-XRechnung.xml`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert(e.response?.data?.detail || "XRechnung-Download fehlgeschlagen."); }
  };

  if (loading) return <div role="status" aria-live="polite" className="ac-loading"><span className="ac-spinner" aria-hidden="true" />Lade Gutschriften…</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <div style={{ color: "var(--ink2)", fontSize: ".85rem" }}>
          Gutschriften nach <strong style={{ color: "var(--ink)" }}>§14 Abs. 2 UStG</strong> —
          eigener Belegtyp, kein Storno.
        </div>
        <button className="ac-btn ac-btn-primary ac-btn-sm" style={{ marginLeft: "auto" }}
          onClick={() => { setEditItem(null); setShowForm(true); }}>
          + Neue Gutschrift
        </button>
      </div>

      {(showForm || editItem) && (
        <GutschriftForm
          initial={editItem}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => { setShowForm(false); setEditItem(null); load(); }}
        />
      )}

      {list.length === 0 && !showForm ? (
        <div className="ac-card"><div className="ac-empty">Noch keine Gutschriften.</div></div>
      ) : (
        <div className="ac-card" style={{ padding: 0, overflowX: "auto" }}>
          <table aria-label="Gutschriften" className="ac-table">
            <thead>
              <tr>
                <th scope="col">Nr.</th>
                <th scope="col">Empfänger</th>
                <th scope="col">Datum</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: "right" }}>Brutto</th>
                <th scope="col">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {list.map(g => {
                const sm = STATUS_META[g.status] || STATUS_META.entwurf;
                return (
                  <tr key={g.id}>
                    <td className="ac-mono" style={{ fontWeight: 600 }}>
                      {g.gutschriftnummer || `GS-#${g.id}`}
                    </td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {g.empfaenger_name || "—"}
                    </td>
                    <td className="ac-mono">{g.gutschriftdatum || "—"}</td>
                    <td><span className={`ac-badge ${sm.cls}`}>{sm.label}</span></td>
                    <td className="ac-mono" style={{ textAlign: "right", fontWeight: 600 }}>
                      {fmtEur(g.brutto_summe)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        {g.status === "entwurf" && (<>
                          <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={busy[g.id]}
                            onClick={() => { setEditItem(g); setShowForm(false); }}>
                            Bearb.
                          </button>
                          <button className="ac-btn ac-btn-primary ac-btn-sm" disabled={busy[g.id]}
                            onClick={() => finalize(g.id)}>
                            Finalisieren
                          </button>
                          <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={busy[g.id]}
                            style={{ color: "var(--a3)" }} onClick={() => del(g.id)}>
                            Löschen
                          </button>
                        </>)}
                        {g.status !== "entwurf" && (<>
                          <button className="ac-btn ac-btn-ghost ac-btn-sm"
                            onClick={() => downloadPdf(g.id, g.gutschriftnummer)}>
                            PDF
                          </button>
                          <button className="ac-btn ac-btn-ghost ac-btn-sm"
                            title="XRechnung 3.0 (TypeCode 381 gem. EN 16931)"
                            onClick={() => downloadXrechnung(g.id, g.gutschriftnummer)}>
                            XRechnung
                          </button>
                        </>)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
