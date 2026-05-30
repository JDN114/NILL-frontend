// src/components/accounting/KassenbonTab.jsx — Kassenbons (POS receipts)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import ArtikelstammTab from "./ArtikelstammTab";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const today = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toTimeString().slice(0, 5);

const firstOfMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

const ZAHLUNGSART_META = {
  bar:         { label: "Bar",         cls: "ac-badge-green" },
  ec:          { label: "EC",          cls: "ac-badge-purple" },
  kreditkarte: { label: "Kreditkarte", cls: "ac-badge-purple" },
  gutschein:   { label: "Gutschein",   cls: "ac-badge-gray" },
};

const STATUS_META = {
  offen:     { label: "Offen",     cls: "ac-badge-gray" },
  storniert: { label: "Storniert", cls: "ac-badge-pink" },
};

const EMPTY_POS = { bezeichnung: "", menge: 1, einheit: "Stück", einzelpreis_brutto: "", ust_satz: 19 };

function calcUst(positionen) {
  let u19 = 0, u7 = 0, u0 = 0;
  (positionen || []).forEach((p) => {
    const gp = (parseFloat(p.menge) || 0) * (parseFloat(p.einzelpreis_brutto) || 0);
    if (p.ust_satz == 19) u19 += gp;
    else if (p.ust_satz == 7) u7 += gp;
    else u0 += gp;
  });
  const ust19 = u19 - u19 / 1.19;
  const ust7  = u7  - u7  / 1.07;
  return {
    umsatz_19: u19, netto_19: u19 / 1.19, ust_19: ust19,
    umsatz_7:  u7,  netto_7:  u7  / 1.07, ust_7:  ust7,
    umsatz_0:  u0,
    gesamt: u19 + u7 + u0,
  };
}

// ── BonModal ────────────────────────────────────────────────────────────────
function BonModal({ onSaved, onClose }) {
  const [form, setForm] = useState({
    datum: today(), uhrzeit: nowTime(), zahlungsart: "bar", beschreibung: "",
    positionen: [{ ...EMPTY_POS }],
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [showKatalog, setShowKatalog] = useState(false);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const setPos = (i, k, v) =>
    setForm((f) => {
      const pos = f.positionen.map((p, idx) => (idx === i ? { ...p, [k]: v } : p));
      return { ...f, positionen: pos };
    });

  const addPos = () => setForm((f) => ({ ...f, positionen: [...f.positionen, { ...EMPTY_POS }] }));

  const removePos = (i) =>
    setForm((f) => ({ ...f, positionen: f.positionen.filter((_, idx) => idx !== i) }));

  const ust = calcUst(form.positionen);

  const validate = () => {
    if (!form.positionen.length) return "Mindestens eine Position erforderlich.";
    for (const p of form.positionen) {
      if (!p.bezeichnung.trim()) return "Alle Bezeichnungen müssen ausgefüllt sein.";
      if (!(parseFloat(p.einzelpreis_brutto) > 0)) return "Alle Einzelpreise müssen > 0 sein.";
    }
    return null;
  };

  const save = async () => {
    const e = validate();
    if (e) { setErr(e); return; }
    setSaving(true); setErr("");
    try {
      const payload = {
        datum: form.datum,
        uhrzeit: form.uhrzeit || undefined,
        zahlungsart: form.zahlungsart,
        beschreibung: form.beschreibung || undefined,
        positionen: form.positionen.map((p) => ({
          bezeichnung: p.bezeichnung,
          menge: parseFloat(p.menge),
          einheit: p.einheit,
          einzelpreis_brutto: parseFloat(p.einzelpreis_brutto),
          ust_satz: parseInt(p.ust_satz, 10),
          ...(p.artikel_id ? { artikel_id: p.artikel_id } : {}),
        })),
      };
      await api.post("/api/v1/kassenbon", payload);
      onSaved();
    } catch (ex) {
      setErr(ex.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 760, overflowY: "auto", maxHeight: "90vh" }}>
        <div className="ac-modal-title">Kassenbon erfassen</div>
        {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}

        {/* Section 1: Bon-Details */}
        <div className="ac-section-title" style={{ marginBottom: 8 }}>Bon-Details</div>
        <div className="ac-form-row" style={{ marginBottom: 12 }}>
          <div className="ac-form-col">
            <label className="ac-label">Datum *</label>
            <input className="ac-input" type="date" value={form.datum} onChange={(e) => setF("datum", e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Uhrzeit</label>
            <input className="ac-input" type="time" value={form.uhrzeit} onChange={(e) => setF("uhrzeit", e.target.value)} />
          </div>
        </div>
        <div className="ac-form-row" style={{ marginBottom: 12 }}>
          <div className="ac-form-col">
            <label className="ac-label">Zahlungsart *</label>
            <select className="ac-select" value={form.zahlungsart} onChange={(e) => setF("zahlungsart", e.target.value)}>
              <option value="bar">Bar</option>
              <option value="ec">EC</option>
              <option value="kreditkarte">Kreditkarte</option>
              <option value="gutschein">Gutschein</option>
            </select>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Beschreibung</label>
            <input className="ac-input" value={form.beschreibung} onChange={(e) => setF("beschreibung", e.target.value)} placeholder="Optional…" />
          </div>
        </div>

        {/* Section 2: Positionen */}
        <div className="ac-section-title" style={{ margin: "16px 0 8px" }}>Positionen</div>
        {form.positionen.map((p, i) => {
          const gp = (parseFloat(p.menge) || 0) * (parseFloat(p.einzelpreis_brutto) || 0);
          return (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-end", marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 3, minWidth: 140 }}>
                {i === 0 && <label className="ac-label">Bezeichnung *</label>}
                <input className="ac-input" value={p.bezeichnung} onChange={(e) => setPos(i, "bezeichnung", e.target.value)} placeholder="Bezeichnung" />
              </div>
              <div style={{ flex: 1, minWidth: 70 }}>
                {i === 0 && <label className="ac-label">Menge</label>}
                <input className="ac-input" type="number" step="0.001" min="0" value={p.menge} onChange={(e) => setPos(i, "menge", e.target.value)} />
              </div>
              <div style={{ width: 80 }}>
                {i === 0 && <label className="ac-label">Einheit</label>}
                <input className="ac-input" value={p.einheit} onChange={(e) => setPos(i, "einheit", e.target.value)} placeholder="Stück" />
              </div>
              <div style={{ flex: 1, minWidth: 80 }}>
                {i === 0 && <label className="ac-label">EP Brutto €</label>}
                <input className="ac-input" type="number" step="0.01" min="0" value={p.einzelpreis_brutto} onChange={(e) => setPos(i, "einzelpreis_brutto", e.target.value)} placeholder="0.00" />
              </div>
              <div style={{ width: 70 }}>
                {i === 0 && <label className="ac-label">USt %</label>}
                <select className="ac-select" value={p.ust_satz} onChange={(e) => setPos(i, "ust_satz", e.target.value)}>
                  <option value={19}>19 %</option>
                  <option value={7}>7 %</option>
                  <option value={0}>0 %</option>
                </select>
              </div>
              <div style={{ width: 90, textAlign: "right" }}>
                {i === 0 && <label className="ac-label">GP</label>}
                <div className="ac-input ac-mono" style={{ background: "var(--surface)", color: "var(--ink2)", cursor: "default" }}>
                  {fmtEur(gp)}
                </div>
              </div>
              <button className="ac-btn ac-btn-ghost ac-btn-sm" style={{ marginBottom: 0 }} onClick={() => removePos(i)} title="Entfernen">×</button>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={addPos}>
            + Position hinzufügen
          </button>
          <button
            className="ac-btn ac-btn-ghost ac-btn-sm"
            onClick={() => setShowKatalog((v) => !v)}
            style={{
              borderColor: showKatalog ? "var(--accent)" : undefined,
              color: showKatalog ? "var(--accent)" : undefined,
            }}
          >
            {showKatalog ? "▲ Katalog schließen" : "📦 Aus Katalog wählen"}
          </button>
        </div>
        {showKatalog && (
          <div style={{
            border: "1px solid var(--border)", borderRadius: 10,
            marginBottom: 16, overflow: "hidden",
            maxHeight: 380, display: "flex",
          }}>
            <ArtikelstammTab
              mode="auswahl"
              onArtikelSelect={(a) => {
                setForm((f) => ({
                  ...f,
                  positionen: [
                    ...f.positionen.filter(
                      (p) => p.bezeichnung.trim() !== "" || parseFloat(p.einzelpreis_brutto) > 0
                    ),
                    {
                      bezeichnung: a.bezeichnung,
                      menge: 1,
                      einheit: a.einheit || "Stk.",
                      einzelpreis_brutto: String(a.preis_brutto),
                      ust_satz: a.ust_satz ?? 19,
                      artikel_id: a.id,
                    },
                  ],
                }));
              }}
            />
          </div>
        )}

        {/* USt-Summary */}
        <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", fontFamily: "monospace", fontSize: ".82rem", color: "var(--ink)", marginBottom: 16 }}>
          <div>19% Umsatz: {fmtEur(ust.umsatz_19)} → Netto: {fmtEur(ust.netto_19)} + USt: {fmtEur(ust.ust_19)}</div>
          <div> 7% Umsatz: {fmtEur(ust.umsatz_7)}  → Netto: {fmtEur(ust.netto_7)}  + USt: {fmtEur(ust.ust_7)}</div>
          <div> 0% Umsatz: {fmtEur(ust.umsatz_0)}</div>
          <div style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 6, color: "var(--accent)", fontWeight: 700 }}>
            Gesamt: {fmtEur(ust.gesamt)}
          </div>
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Speichern…" : "Kassenbon speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DetailModal ──────────────────────────────────────────────────────────────
function DetailModal({ bon, firmenname, firmenadresse, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const ust = calcUst(bon.positionen || []);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/api/v1/kassenbon/${bon.id}/pdf`, {
        params: { firmenname, firmenadresse },
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank");
    } catch { /* silent */ } finally { setDownloading(false); }
  };

  const zm = STATUS_META[bon.status] || STATUS_META.offen;

  return (
    <div className="ac-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 680, overflowY: "auto", maxHeight: "90vh" }}>
        <div className="ac-modal-title">
          Kassenbon {bon.bon_nummer}
          <span className={`ac-badge ${zm.cls}`} style={{ marginLeft: 10, fontSize: ".75rem" }}>{zm.label}</span>
        </div>

        <div className="ac-form-row" style={{ marginBottom: 8 }}>
          <div><span className="ac-label">Datum</span><div>{bon.datum}</div></div>
          <div><span className="ac-label">Uhrzeit</span><div>{bon.uhrzeit || "—"}</div></div>
          <div><span className="ac-label">Zahlungsart</span>
            <div><span className={`ac-badge ${(ZAHLUNGSART_META[bon.zahlungsart] || {}).cls || "ac-badge-gray"}`}>
              {(ZAHLUNGSART_META[bon.zahlungsart] || { label: bon.zahlungsart }).label}
            </span></div>
          </div>
        </div>
        {bon.beschreibung && <div style={{ marginBottom: 8, color: "var(--ink2)", fontSize: ".88rem" }}>{bon.beschreibung}</div>}
        {bon.storno_von && <div className="ac-alert ac-alert-warn" style={{ marginBottom: 8 }}>Storniert Bon-Nr. {bon.storno_von}</div>}

        <div className="ac-section-title" style={{ margin: "12px 0 6px" }}>Positionen</div>
        <div className="ac-table-wrap" style={{ marginBottom: 12 }}>
          <table className="ac-table">
            <thead><tr>
              <th>Bezeichnung</th><th style={{ textAlign: "right" }}>Menge</th>
              <th>Einheit</th><th style={{ textAlign: "right" }}>EP Brutto</th>
              <th style={{ textAlign: "right" }}>USt</th><th style={{ textAlign: "right" }}>GP</th>
            </tr></thead>
            <tbody>
              {(bon.positionen || []).map((p, i) => (
                <tr key={i}>
                  <td>{p.bezeichnung}</td>
                  <td style={{ textAlign: "right" }} className="ac-mono">{Number(p.menge).toLocaleString("de-DE")}</td>
                  <td>{p.einheit}</td>
                  <td style={{ textAlign: "right" }} className="ac-mono">{fmtEur(p.einzelpreis_brutto)}</td>
                  <td style={{ textAlign: "right" }} className="ac-mono">{p.ust_satz} %</td>
                  <td style={{ textAlign: "right" }} className="ac-mono">{fmtEur(p.menge * p.einzelpreis_brutto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* USt breakdown */}
        <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: ".82rem", color: "var(--ink)", marginBottom: 16 }}>
          <div>19% Umsatz: {fmtEur(bon.umsatz_brutto_19 ?? ust.umsatz_19)} → Netto: {fmtEur(bon.netto_19 ?? ust.netto_19)} + USt: {fmtEur(bon.ust_19_betrag ?? ust.ust_19)}</div>
          <div> 7% Umsatz: {fmtEur(bon.umsatz_brutto_7  ?? ust.umsatz_7)}  → Netto: {fmtEur(bon.netto_7  ?? ust.netto_7)}  + USt: {fmtEur(bon.ust_7_betrag  ?? ust.ust_7)}</div>
          <div> 0% Umsatz: {fmtEur(bon.umsatz_brutto_0  ?? ust.umsatz_0)}</div>
          <div style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 6, color: "var(--accent)", fontWeight: 700 }}>
            Gesamt: {fmtEur(bon.betrag_brutto ?? ust.gesamt)}
          </div>
        </div>

        {/* TSE-Daten */}
        {bon.tse_status === "signiert" && (
          <details style={{ marginBottom: 12, fontSize: ".78rem" }}>
            <summary style={{ cursor: "pointer", color: "var(--ink2)", userSelect: "none" }}>
              TSE-Daten (§146a AO)
            </summary>
            <div style={{ marginTop: 6, fontFamily: "monospace", background: "var(--surface2)", borderRadius: 6, padding: "8px 12px", color: "var(--ink2)", wordBreak: "break-all", lineHeight: 1.6 }}>
              <div><b>Sig.-Nr.:</b> {bon.tse_signaturnummer}</div>
              <div><b>TSE-SN:</b> {bon.tse_seriennummer}</div>
              <div><b>Signatur:</b> {bon.tse_signatur}</div>
              <div><b>Hash:</b> {bon.tse_hashwert}</div>
              <div><b>Start:</b> {bon.tse_start} &nbsp;<b>Ende:</b> {bon.tse_ende}</div>
            </div>
          </details>
        )}

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Schließen</button>
          <button className="ac-btn ac-btn-primary" onClick={downloadPdf} disabled={downloading}>
            {downloading ? "Lade…" : "PDF herunterladen"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TSE-Status-Panel ─────────────────────────────────────────────────────────
function TseStatusPanel({ filter }) {
  const [tse, setTse] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [nachsignieren, setNachsignieren] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/api/v1/kasse/tse/status").then((r) => setTse(r.data)).catch(() => {});
  }, []);

  const exportDsfinvk = async () => {
    setExporting(true); setMsg("");
    try {
      const res = await api.get("/api/v1/kasse/dsfinvk/export", {
        params: { datum_von: filter.von, datum_bis: filter.bis },
        responseType: "blob",
      });
      const von = filter.von?.replace(/-/g, "") || "gesamt";
      const bis = filter.bis?.replace(/-/g, "") || "gesamt";
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url; a.download = `DSFinV-K_${von}_${bis}.zip`; a.click();
      setMsg("DSFinV-K Export erfolgreich heruntergeladen.");
    } catch {
      setMsg("Fehler beim DSFinV-K Export.");
    } finally { setExporting(false); }
  };

  const doNachsignieren = async () => {
    setNachsignieren(true); setMsg("");
    try {
      const r = await api.post("/api/v1/kasse/tse/nachsignieren");
      setMsg(`${r.data.signiert} Bons nachsigniert.`);
      api.get("/api/v1/kasse/tse/status").then((r) => setTse(r.data)).catch(() => {});
    } catch {
      setMsg("Nachsignierung fehlgeschlagen.");
    } finally { setNachsignieren(false); }
  };

  if (!tse) return null;

  const bsiOk = tse.bsi_zertifiziert;

  return (
    <div style={{
      border: `1px solid ${bsiOk ? "var(--border)" : "#f59e0b"}`,
      borderRadius: 10, padding: "14px 18px",
      background: bsiOk ? "var(--surface)" : "#fffbeb",
      marginBottom: 22,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--ink)" }}>
          {bsiOk ? "✔" : "⚠"} KassenSichV / TSE — §146a AO
        </div>
        <span className={`ac-badge ${bsiOk ? "ac-badge-green" : "ac-badge-gray"}`} style={{ fontSize: ".72rem" }}>
          {tse.tse_art === "software" ? "Software-TSE (Simulation)" : tse.tse_art}
        </span>
        <span className="ac-badge ac-badge-purple" style={{ fontSize: ".72rem" }}>
          {tse.bons_signiert} signiert
        </span>
        {tse.bons_ausstehend > 0 && (
          <span className="ac-badge ac-badge-pink" style={{ fontSize: ".72rem" }}>
            {tse.bons_ausstehend} ausstehend
          </span>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tse.bons_ausstehend > 0 && (
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={doNachsignieren} disabled={nachsignieren}>
              {nachsignieren ? "…" : "Nachsignieren"}
            </button>
          )}
          <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={exportDsfinvk} disabled={exporting}>
            {exporting ? "Export…" : "DSFinV-K Export (.zip)"}
          </button>
        </div>
      </div>

      {!bsiOk && (
        <div style={{ marginTop: 8, fontSize: ".78rem", color: "#92400e", lineHeight: 1.4 }}>
          Für den gesetzeskonformen Betrieb als elektronisches Kassensystem ist eine
          BSI-zertifizierte TSE (BSI TR-03153) erforderlich.
          Empfohlene Anbieter: <strong>Swissbit Cloud TSE</strong>, <strong>Deutsche Fiskal</strong>.
          Der DSFinV-K-Export steht bereits zur Verfügung (DFKA-Taxonomie v2.3).
        </div>
      )}

      <div style={{ marginTop: 6, fontSize: ".75rem", color: "var(--ink2)" }}>
        Kassen-ID: <span style={{ fontFamily: "monospace" }}>{tse.kasse_id}</span>
        {tse.tse_seriennummer && (
          <> &nbsp;·&nbsp; TSE-SN: <span style={{ fontFamily: "monospace" }}>{tse.tse_seriennummer}</span></>
        )}
      </div>

      {msg && (
        <div className="ac-alert" style={{ marginTop: 8, padding: "6px 10px", fontSize: ".8rem" }}>{msg}</div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function KassenbonTab() {
  const [bons, setBons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState({ von: firstOfMonth(), bis: today(), status: "alle" });
  const [showCreate, setShowCreate] = useState(false);
  const [detail, setDetail] = useState(null);
  const [stornoId, setStornoId] = useState(null);
  const [stornoLoading, setStornoLoading] = useState(false);

  // PDF company info — could come from a settings context; kept simple here
  const firmenname = "";
  const firmenadresse = "";

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const params = { datum_von: filter.von, datum_bis: filter.bis };
      if (filter.status !== "alle") params.status = filter.status;
      const res = await api.get("/api/v1/kassenbon", { params });
      setBons(res.data || []);
    } catch (ex) {
      setErr(ex.response?.data?.detail || "Fehler beim Laden.");
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  // KPIs
  const todayStr = today();
  const monthStr = todayStr.slice(0, 7);
  const bonsHeute   = bons.filter((b) => b.datum === todayStr && b.status !== "storniert");
  const bonsMonat   = bons.filter((b) => b.datum?.startsWith(monthStr) && b.status !== "storniert");
  const umsatzHeute = bonsHeute.reduce((s, b) => s + (b.betrag_brutto || 0), 0);
  const umsatzMonat = bonsMonat.reduce((s, b) => s + (b.betrag_brutto || 0), 0);

  const stornieren = async (id) => {
    setStornoLoading(true);
    try {
      await api.post(`/api/v1/kassenbon/${id}/stornieren`);
      setStornoId(null);
      load();
    } catch (ex) {
      setErr(ex.response?.data?.detail || "Storno fehlgeschlagen.");
      setStornoId(null);
    } finally { setStornoLoading(false); }
  };

  const downloadPdf = async (id) => {
    try {
      const res = await api.get(`/api/v1/kassenbon/${id}/pdf`, {
        params: { firmenname, firmenadresse },
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank");
    } catch { /* silent */ }
  };

  const openDetail = async (id) => {
    try {
      const res = await api.get(`/api/v1/kassenbon/${id}`);
      setDetail(res.data);
    } catch { /* silent */ }
  };

  return (
    <div>
      {/* TSE-Status + DSFinV-K */}
      <TseStatusPanel filter={filter} />

      {/* KPI row */}
      <div className="ac-kpi-grid" style={{ marginBottom: 24 }}>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Bons heute</div>
          <div className="ac-kpi-value">{bonsHeute.length}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Umsatz heute</div>
          <div className="ac-kpi-value green">{fmtEur(umsatzHeute)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Bons diesen Monat</div>
          <div className="ac-kpi-value purple">{bonsMonat.length}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Umsatz diesen Monat</div>
          <div className="ac-kpi-value green">{fmtEur(umsatzMonat)}</div>
        </div>
      </div>

      {/* Filter row */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 20 }}>
        <div>
          <label className="ac-label">Von</label>
          <input className="ac-input" type="date" value={filter.von}
            onChange={(e) => setFilter((f) => ({ ...f, von: e.target.value }))} />
        </div>
        <div>
          <label className="ac-label">Bis</label>
          <input className="ac-input" type="date" value={filter.bis}
            onChange={(e) => setFilter((f) => ({ ...f, bis: e.target.value }))} />
        </div>
        <div>
          <label className="ac-label">Status</label>
          <select className="ac-select" value={filter.status}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}>
            <option value="alle">Alle</option>
            <option value="offen">Offen</option>
            <option value="storniert">Storniert</option>
          </select>
        </div>
        <button className="ac-btn ac-btn-primary" style={{ marginLeft: "auto" }} onClick={() => setShowCreate(true)}>
          + Kassenbon
        </button>
      </div>

      {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}

      {loading ? (
        <div className="ac-loading"><span className="ac-spinner" /> Laden…</div>
      ) : bons.length === 0 ? (
        <div className="ac-empty">Keine Kassenbons gefunden.</div>
      ) : (
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead><tr>
              <th>Bon-Nr.</th><th>Datum</th><th>Zeit</th><th>Zahlungsart</th>
              <th style={{ textAlign: "right" }}>Betrag</th><th>Status</th><th>TSE</th><th>Aktionen</th>
            </tr></thead>
            <tbody>
              {bons.map((b) => {
                const zm = (ZAHLUNGSART_META[b.zahlungsart] || { label: b.zahlungsart, cls: "ac-badge-gray" });
                const sm = STATUS_META[b.status] || STATUS_META.offen;
                return (
                  <tr key={b.id}>
                    <td className="ac-mono">{b.bon_nummer || `#${b.id}`}</td>
                    <td>{b.datum}</td>
                    <td>{b.uhrzeit || "—"}</td>
                    <td><span className={`ac-badge ${zm.cls}`}>{zm.label}</span></td>
                    <td style={{ textAlign: "right" }} className="ac-mono">{fmtEur(b.betrag_brutto)}</td>
                    <td><span className={`ac-badge ${sm.cls}`}>{sm.label}</span></td>
                    <td>
                      {b.tse_status === "signiert"
                        ? <span className="ac-badge ac-badge-green" style={{ fontSize: ".68rem" }}>✔ TSE</span>
                        : <span className="ac-badge ac-badge-gray"  style={{ fontSize: ".68rem" }}>–</span>
                      }
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => openDetail(b.id)}>Details</button>
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => downloadPdf(b.id)}>PDF</button>
                        {b.status === "offen" && (
                          <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => setStornoId(b.id)}>Storno</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <BonModal
          onSaved={() => { setShowCreate(false); load(); }}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Detail modal */}
      {detail && (
        <DetailModal
          bon={detail}
          firmenname={firmenname}
          firmenadresse={firmenadresse}
          onClose={() => setDetail(null)}
        />
      )}

      {/* Storno confirm */}
      {stornoId && (
        <div className="ac-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setStornoId(null)}>
          <div className="ac-modal" style={{ maxWidth: 400 }}>
            <div className="ac-modal-title">Kassenbon stornieren?</div>
            <p style={{ color: "var(--ink2)", marginBottom: 20 }}>
              Der Kassenbon wird storniert und ein Stornobon erstellt. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-ghost" onClick={() => setStornoId(null)}>Abbrechen</button>
              <button className="ac-btn ac-btn-danger" onClick={() => stornieren(stornoId)} disabled={stornoLoading}>
                {stornoLoading ? "Storniere…" : "Stornieren"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
