// src/components/accounting/GutscheinTab.jsx — Gutscheine / Voucher management
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const today = () => new Date().toISOString().slice(0, 10);

const STATUS_META = {
  aktiv:          { label: "Aktiv",          cls: "ac-badge-green" },
  teileingeloest: { label: "Teileingelöst",  cls: "ac-badge-purple" },
  eingeloest:     { label: "Eingelöst",      cls: "ac-badge-gray" },
  verfallen:      { label: "Verfallen",      cls: "ac-badge-pink" },
  storniert:      { label: "Storniert",      cls: "ac-badge-pink" },
};

const ZAHLUNGSARTEN = ["bar", "ec", "kreditkarte", "überweisung"];
const UST_SAETZE    = ["19", "7", "0"];

const EMPTY_AUSSTELLEN = {
  code: "", bezeichnung: "", nennwert: "", zahlungsart_ausgabe: "bar",
  gueltig_bis: "", ust_satz_einloesung: "19", notiz: "", ausgabe_datum: today(),
};

// ── AusstellenModal ────────────────────────────────────────────────────────────
function AusstellenModal({ onClose, onSaved }) {
  const [form, setForm]   = useState({ ...EMPTY_AUSSTELLEN });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.nennwert || parseFloat(form.nennwert) <= 0) {
      setError("Nennwert ist ein Pflichtfeld und muss > 0 sein.");
      return;
    }
    setSaving(true); setError("");
    try {
      const payload = {
        ausgabe_datum: form.ausgabe_datum,
        nennwert: parseFloat(form.nennwert),
        zahlungsart_ausgabe: form.zahlungsart_ausgabe,
        ust_satz_einloesung: parseFloat(form.ust_satz_einloesung),
        ...(form.code.trim()        && { code:        form.code.trim() }),
        ...(form.bezeichnung.trim() && { bezeichnung: form.bezeichnung.trim() }),
        ...(form.gueltig_bis        && { gueltig_bis:  form.gueltig_bis }),
        ...(form.notiz.trim()       && { notiz:        form.notiz.trim() }),
      };
      await api.post("/api/v1/gutscheine", payload);
      onSaved();
    } catch (e) {
      setError(e.response?.data?.detail || "Fehler beim Ausstellen.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={onClose}>
      <div className="ac-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div className="ac-modal-title">Gutschein ausstellen</div>
        {error && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{error}</div>}

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Code (optional)</label>
            <input className="ac-input ac-mono" value={form.code}
              onChange={e => set("code", e.target.value)} placeholder="Leer lassen für automatischen Code" />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Ausgabedatum</label>
            <input className="ac-input" type="date" value={form.ausgabe_datum}
              onChange={e => set("ausgabe_datum", e.target.value)} />
          </div>
        </div>

        <div className="ac-form-row">
          <div className="ac-form-col" style={{ flex: 2 }}>
            <label className="ac-label">Bezeichnung (optional)</label>
            <input className="ac-input" value={form.bezeichnung}
              onChange={e => set("bezeichnung", e.target.value)} placeholder="z.B. Geburtstagsgutschein" />
          </div>
        </div>

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Nennwert *</label>
            <input className="ac-input" type="number" min="0.01" step="0.01"
              value={form.nennwert} onChange={e => set("nennwert", e.target.value)}
              placeholder="0,00 €" style={{ fontSize: "1.25rem", fontWeight: 700 }} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Zahlungsart</label>
            <select className="ac-select" value={form.zahlungsart_ausgabe}
              onChange={e => set("zahlungsart_ausgabe", e.target.value)}>
              {ZAHLUNGSARTEN.map(z => <option key={z} value={z}>{z.charAt(0).toUpperCase() + z.slice(1)}</option>)}
            </select>
            <div style={{ fontSize: ".7rem", color: "var(--ink2)", marginTop: 3 }}>Wie hat der Kunde bezahlt?</div>
          </div>
        </div>

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Gültig bis (optional)</label>
            <input className="ac-input" type="date" value={form.gueltig_bis}
              onChange={e => set("gueltig_bis", e.target.value)} />
            <div style={{ fontSize: ".7rem", color: "var(--ink2)", marginTop: 3 }}>Leer = unbegrenzt gültig</div>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">USt-Satz bei Einlösung</label>
            <select className="ac-select" value={form.ust_satz_einloesung}
              onChange={e => set("ust_satz_einloesung", e.target.value)}>
              {UST_SAETZE.map(s => <option key={s} value={s}>{s} %</option>)}
            </select>
          </div>
        </div>

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Notiz (optional)</label>
            <textarea className="ac-input" rows={3} value={form.notiz}
              onChange={e => set("notiz", e.target.value)}
              style={{ resize: "vertical" }} />
          </div>
        </div>

        <div className="ac-alert ac-alert-warn" style={{ fontSize: ".8rem", marginBottom: 16 }}>
          💡 Beim Ausstellen wird Konto 3711 (Gutscheinverbindlichkeiten) als Haben gebucht.
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Wird ausgestellt…" : "Ausstellen"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── EinloesungModal ────────────────────────────────────────────────────────────
function EinloesungModal({ gutschein, onClose, onSaved }) {
  const [datum, setDatum]   = useState(today());
  const [betrag, setBetrag] = useState("");
  const [notiz, setNotiz]   = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const max       = parseFloat(gutschein?.verbleibend || 0);
  const betragNum = parseFloat(betrag || 0);
  const verbleibendNach = max - betragNum;

  const save = async () => {
    if (!betrag || betragNum <= 0) { setError("Betrag ist ein Pflichtfeld."); return; }
    if (betragNum > max)           { setError(`Betrag darf maximal ${fmtEur(max)} betragen.`); return; }
    setSaving(true); setError("");
    try {
      await api.post(`/api/v1/gutscheine/${gutschein.id}/einloesen`, {
        datum, betrag: betragNum,
        ...(notiz.trim() && { notiz: notiz.trim() }),
      });
      onSaved();
    } catch (e) {
      setError(e.response?.data?.detail || "Fehler bei der Einlösung.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={onClose}>
      <div className="ac-modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <div className="ac-modal-title">Gutschein einlösen</div>

        <div className="ac-card" style={{ marginBottom: 16, padding: "10px 14px" }}>
          <span className="ac-mono" style={{ fontWeight: 700, color: "var(--accent)" }}>{gutschein?.code}</span>
          <span style={{ color: "var(--ink2)", margin: "0 8px" }}>·</span>
          <span style={{ color: "var(--ink)" }}>Verfügbar: <strong>{fmtEur(max)}</strong></span>
          <span style={{ color: "var(--ink2)", margin: "0 8px" }}>·</span>
          <span className={STATUS_META[gutschein?.status]?.cls || "ac-badge-gray"}>
            {STATUS_META[gutschein?.status]?.label || gutschein?.status}
          </span>
        </div>

        {error && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{error}</div>}

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Einlösungs-Datum</label>
            <input className="ac-input" type="date" value={datum} onChange={e => setDatum(e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Betrag (max. {fmtEur(max)})</label>
            <input className="ac-input" type="number" min="0.01" max={max} step="0.01"
              value={betrag} onChange={e => setBetrag(e.target.value)} placeholder="0,00 €" />
            {betragNum > 0 && betragNum <= max && (
              <div style={{ fontSize: ".75rem", color: "var(--ink2)", marginTop: 3 }}>
                Verbleibend nach: <strong style={{ color: verbleibendNach < 0 ? "var(--a3)" : "var(--ink)" }}>
                  {fmtEur(verbleibendNach)}
                </strong>
              </div>
            )}
          </div>
        </div>

        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Notiz (optional)</label>
            <textarea className="ac-input" rows={2} value={notiz}
              onChange={e => setNotiz(e.target.value)} style={{ resize: "vertical" }} />
          </div>
        </div>

        <div className="ac-alert ac-alert-warn" style={{ fontSize: ".8rem", marginBottom: 16 }}>
          💡 Bei Einlösung wird Konto 3711 belastet und Umsatz auf Konto 8000/8300/8120 realisiert.
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Wird eingelöst…" : "Einlösen"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DetailModal ────────────────────────────────────────────────────────────────
function DetailModal({ gutschein, onClose }) {
  if (!gutschein) return null;
  const pct = gutschein.nennwert > 0
    ? Math.round((gutschein.verbleibend / gutschein.nennwert) * 100)
    : 0;
  return (
    <div className="ac-modal-backdrop" onClick={onClose}>
      <div className="ac-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="ac-modal-title">
          Gutschein <span className="ac-mono" style={{ color: "var(--accent)" }}>{gutschein.code}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 16 }}>
          {[
            ["Bezeichnung", gutschein.bezeichnung || "—"],
            ["Status", <span className={STATUS_META[gutschein.status]?.cls}>{STATUS_META[gutschein.status]?.label}</span>],
            ["Nennwert", fmtEur(gutschein.nennwert)],
            ["Verbleibend", fmtEur(gutschein.verbleibend)],
            ["Ausgestellt", gutschein.ausgabe_datum || "—"],
            ["Gültig bis", gutschein.gueltig_bis || "unbegrenzt"],
            ["Zahlungsart", gutschein.zahlungsart_ausgabe || "—"],
            ["USt-Satz", `${gutschein.ust_satz_einloesung ?? 19} %`],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: ".7rem", color: "var(--ink2)", marginBottom: 2 }}>{k}</div>
              <div style={{ color: "var(--ink)", fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>

        {gutschein.notiz && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: ".7rem", color: "var(--ink2)", marginBottom: 2 }}>Notiz</div>
            <div style={{ color: "var(--ink)" }}>{gutschein.notiz}</div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: ".7rem", color: "var(--ink2)", marginBottom: 4 }}>Eingelöst ({100 - pct} %)</div>
          <div style={{ height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 3 }} />
          </div>
        </div>

        {gutschein.einloesungen?.length > 0 && (
          <>
            <div className="ac-section-title" style={{ marginBottom: 8 }}>Einlösungshistorie</div>
            <div className="ac-table-wrap">
              <table className="ac-table">
                <thead><tr><th>Datum</th><th>Betrag</th><th>Notiz</th></tr></thead>
                <tbody>
                  {gutschein.einloesungen.map((e, i) => (
                    <tr key={i}>
                      <td>{e.datum}</td>
                      <td>{fmtEur(e.betrag)}</td>
                      <td style={{ color: "var(--ink2)" }}>{e.notiz || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function GutscheinTab() {
  const [gutscheine, setGutscheine]     = useState([]);
  const [statistik, setStatistik]       = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  // Quick-Check
  const [checkCode, setCheckCode]       = useState("");
  const [checkResult, setCheckResult]   = useState(null); // null | {ok, data}
  const [checking, setChecking]         = useState(false);

  // Modals
  const [showAusstellen, setShowAusstellen] = useState(false);
  const [einloesungTarget, setEinloesungTarget] = useState(null);
  const [detailTarget, setDetailTarget]         = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [listRes, statRes] = await Promise.all([
        api.get("/api/v1/gutscheine", { params: statusFilter ? { status: statusFilter } : {} }),
        api.get("/api/v1/gutscheine/statistik"),
      ]);
      setGutscheine(listRes.data || []);
      setStatistik(statRes.data);
    } catch (e) {
      setError("Fehler beim Laden der Gutscheine.");
    } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleCheck = async () => {
    if (!checkCode.trim()) return;
    setChecking(true); setCheckResult(null);
    try {
      const res = await api.get(`/api/v1/gutscheine/check/${checkCode.trim()}`);
      setCheckResult({ ok: true, data: res.data });
    } catch {
      setCheckResult({ ok: false, data: null });
    } finally { setChecking(false); }
  };

  const openEinloesenFromCheck = () => {
    if (checkResult?.data) setEinloesungTarget(checkResult.data);
  };

  const handleVerfall = async (g) => {
    if (!window.confirm(`Gutschein ${g.code} als verfallen markieren?`)) return;
    try {
      await api.post(`/api/v1/gutscheine/${g.id}/verfall`);
      loadAll();
    } catch (e) {
      alert(e.response?.data?.detail || "Fehler beim Verfall.");
    }
  };

  const handleStorno = async (g) => {
    if (!window.confirm(`Gutschein ${g.code} wirklich stornieren?`)) return;
    try {
      await api.post(`/api/v1/gutscheine/${g.id}/stornieren`);
      loadAll();
    } catch (e) {
      alert(e.response?.data?.detail || "Fehler beim Stornieren.");
    }
  };

  const openDetail = async (g) => {
    try {
      const res = await api.get(`/api/v1/gutscheine/${g.id}`);
      setDetailTarget(res.data);
    } catch { setDetailTarget(g); }
  };

  const canRedeem = (s) => s === "aktiv" || s === "teileingeloest";
  const stat = statistik || {};

  return (
    <div>
      {/* Quick-Check bar */}
      <div className="ac-card" style={{ marginBottom: 20, padding: "12px 16px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input className="ac-input ac-mono" style={{ flex: "1 1 220px", maxWidth: 280 }}
            value={checkCode} onChange={e => setCheckCode(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCheck()}
            placeholder="Code eingeben" />
          <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={handleCheck} disabled={checking}>
            {checking ? "Prüfe…" : "Einlösen prüfen"}
          </button>
          {checkResult && checkResult.ok && (
            <div className="ac-alert ac-alert-ok" style={{ flex: "1 1 auto", display: "flex", alignItems: "center", gap: 12 }}>
              <span>
                <span className="ac-mono" style={{ fontWeight: 700 }}>{checkResult.data.code}</span>:
                {" "}{fmtEur(checkResult.data.verbleibend)} verfügbar
                <span style={{ color: "var(--ink2)", marginLeft: 8 }}>(Status: {STATUS_META[checkResult.data.status]?.label})</span>
              </span>
              {canRedeem(checkResult.data.status) && (
                <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={openEinloesenFromCheck}>Einlösen</button>
              )}
            </div>
          )}
          {checkResult && !checkResult.ok && (
            <div className="ac-alert ac-alert-err" style={{ flex: "1 1 auto" }}>Gutschein nicht gefunden</div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="ac-kpi-grid" style={{ marginBottom: 20 }}>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Offen (verbleibend gesamt)</div>
          <div className="ac-kpi-value green">{fmtEur(stat.offen_verbleibend)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Ausgegebene Gutscheine</div>
          <div className="ac-kpi-value purple">{(stat.anzahl_aktiv || 0) + (stat.anzahl_teileingeloest || 0)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Eingelöst</div>
          <div className="ac-kpi-value">{stat.anzahl_eingeloest || 0}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Verfallen</div>
          <div className="ac-kpi-value pink">{stat.anzahl_verfallen || 0}</div>
        </div>
      </div>

      {/* Filter + action row */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <select className="ac-select" style={{ minWidth: 180 }}
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Alle Status</option>
          {Object.entries(STATUS_META).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <div style={{ flex: 1 }} />
        <button className="ac-btn ac-btn-primary" onClick={() => setShowAusstellen(true)}>
          + Gutschein ausstellen
        </button>
      </div>

      {error && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{error}</div>}

      {/* Table */}
      {loading ? (
        <div className="ac-loading"><div className="ac-spinner" /></div>
      ) : gutscheine.length === 0 ? (
        <div className="ac-empty">Keine Gutscheine gefunden.</div>
      ) : (
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Bezeichnung</th>
                <th>Ausgestellt</th>
                <th>Gültig bis</th>
                <th>Nennwert</th>
                <th>Verbleibend</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {gutscheine.map(g => {
                const pct = g.nennwert > 0 ? Math.round((g.verbleibend / g.nennwert) * 100) : 0;
                const meta = STATUS_META[g.status] || { label: g.status, cls: "ac-badge-gray" };
                return (
                  <tr key={g.id}>
                    <td><span className="ac-mono" style={{ fontWeight: 700, color: "var(--accent)" }}>{g.code}</span></td>
                    <td style={{ color: "var(--ink2)" }}>{g.bezeichnung || "—"}</td>
                    <td>{g.ausgabe_datum || "—"}</td>
                    <td>{g.gueltig_bis || <span style={{ color: "var(--ink2)" }}>unbegrenzt</span>}</td>
                    <td>{fmtEur(g.nennwert)}</td>
                    <td>
                      <div>{fmtEur(g.verbleibend)}</div>
                      <div style={{ height: 4, borderRadius: 2, background: "var(--border)", marginTop: 4, width: 80, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${pct}%`, borderRadius: 2,
                          background: pct > 50 ? "var(--accent)" : pct > 20 ? "var(--a2)" : "var(--a3)",
                        }} />
                      </div>
                    </td>
                    <td><span className={meta.cls}>{meta.label}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {canRedeem(g.status) && (
                          <button className="ac-btn ac-btn-ghost ac-btn-sm"
                            onClick={() => setEinloesungTarget(g)}>Einlösen</button>
                        )}
                        <button className="ac-btn ac-btn-ghost ac-btn-sm"
                          onClick={() => openDetail(g)}>Details</button>
                        {canRedeem(g.status) && (
                          <button className="ac-btn ac-btn-danger ac-btn-sm"
                            onClick={() => handleVerfall(g)}>Verfall</button>
                        )}
                        {g.status === "aktiv" && (
                          <button className="ac-btn ac-btn-danger ac-btn-sm"
                            onClick={() => handleStorno(g)}>Storno</button>
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

      {showAusstellen && (
        <AusstellenModal
          onClose={() => setShowAusstellen(false)}
          onSaved={() => { setShowAusstellen(false); loadAll(); }}
        />
      )}
      {einloesungTarget && (
        <EinloesungModal
          gutschein={einloesungTarget}
          onClose={() => setEinloesungTarget(null)}
          onSaved={() => { setEinloesungTarget(null); setCheckResult(null); loadAll(); }}
        />
      )}
      {detailTarget && (
        <DetailModal gutschein={detailTarget} onClose={() => setDetailTarget(null)} />
      )}
    </div>
  );
}
