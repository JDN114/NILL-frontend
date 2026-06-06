// src/components/accounting/WechselkurseTab.jsx — Fremdwährungen (F27)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtRate = (n) => Number(n).toFixed(4);
const fmtEur  = (n) => `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const fmtFx   = (n, sym) => `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${sym}`;

const POPULAR = ["USD", "GBP", "CHF", "JPY", "DKK", "SEK", "NOK", "PLN", "CZK", "HUF"];

export default function WechselkurseTab() {
  const [rates, setRates]       = useState({});
  const [base, setBase]         = useState("EUR");
  const [updated, setUpdated]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [err, setErr]           = useState(null);

  // Converter
  const [betrag, setBetrag]     = useState("100");
  const [von, setVon]           = useState("EUR");
  const [nach, setNach]         = useState("USD");
  const [ergebnis, setErgebnis] = useState(null);
  const [converting, setConverting] = useState(false);

  const load = useCallback(() => {
    setLoading(true); setErr(null);
    api.get("/api/v1/util/wechselkurse")
      .then(r => {
        setRates(r.data?.rates || {});
        setBase(r.data?.base || "EUR");
        setUpdated(r.data?.updated_at);
      })
      .catch(() => setErr("Kurse konnten nicht geladen werden. Fallback-Kurse werden verwendet."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const umrechnen = async () => {
    const b = parseFloat(betrag);
    if (!b || b <= 0) return;
    setConverting(true);
    try {
      const r = await api.post("/api/v1/util/betrag-umrechnen", {
        betrag: b, von_waehrung: von, nach_waehrung: nach,
      });
      setErgebnis(r.data);
    } catch {
      // Fallback: local calc
      const rateVon  = von  === base ? 1 : (rates[von]  || 1);
      const rateNach = nach === base ? 1 : (rates[nach] || 1);
      const inBase   = b / rateVon;
      const result   = inBase * rateNach;
      setErgebnis({ ergebnis: result, kurs: rateNach / rateVon, von_waehrung: von, nach_waehrung: nach });
    } finally { setConverting(false); }
  };

  const allCurrencies = Object.keys(rates).length > 0 ? ["EUR", ...Object.keys(rates)] : ["EUR"];
  const displayRates  = POPULAR.filter(c => rates[c]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Fremdwährungen & Wechselkurse</span>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={load} disabled={loading}>
          {loading ? "…" : "↻ Aktualisieren"}
        </button>
      </div>

      {err && <div role="status" aria-live="polite" className="ac-alert ac-alert-warn" style={{ marginBottom: 16 }}>{err}</div>}

      {/* Currency Converter */}
      <div className="ac-card" style={{ marginBottom: 20, borderColor: "rgba(198,255,60,.2)" }}>
        <div className="ac-section-title">Währungsrechner</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="ac-form-col" style={{ maxWidth: 140 }}>
            <label className="ac-label">Betrag</label>
            <input className="ac-input" type="number" min="0" step="0.01" value={betrag}
              onChange={e => { setBetrag(e.target.value); setErgebnis(null); }} />
          </div>
          <div className="ac-form-col" style={{ maxWidth: 120 }}>
            <label className="ac-label" htmlFor="wk-von">Von</label>
            <select id="wk-von" className="ac-select" value={von} onChange={e => { setVon(e.target.value); setErgebnis(null); }}>
              {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ paddingBottom: 8, fontSize: "1.2rem", color: "var(--ink2)" }}>→</div>
          <div className="ac-form-col" style={{ maxWidth: 120 }}>
            <label className="ac-label" htmlFor="wk-nach">Nach</label>
            <select id="wk-nach" className="ac-select" value={nach} onChange={e => { setNach(e.target.value); setErgebnis(null); }}>
              {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button className="ac-btn ac-btn-primary" onClick={umrechnen} disabled={converting}>
            {converting ? "…" : "Umrechnen"}
          </button>
        </div>

        {ergebnis && (
          <div style={{
            marginTop: 16, padding: "14px 18px", borderRadius: 10,
            background: "rgba(198,255,60,.07)", border: "1px solid rgba(198,255,60,.2)",
          }}>
            <div style={{ fontSize: ".78rem", color: "var(--ink2)", marginBottom: 6 }}>Ergebnis</div>
            <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "1.6rem", fontWeight: 700, color: "var(--accent)" }}>
              {fmtFx(ergebnis.ergebnis, ergebnis.nach_waehrung)}
            </div>
            <div style={{ fontSize: ".8rem", color: "var(--ink2)", marginTop: 6 }}>
              Kurs: 1 {ergebnis.von_waehrung} = {fmtRate(ergebnis.kurs)} {ergebnis.nach_waehrung}
            </div>
          </div>
        )}
      </div>

      {/* Rate Table */}
      {loading ? (
        <div role="status" aria-live="polite" className="ac-loading"><span className="ac-spinner" aria-hidden="true" />Lade Kurse…</div>
      ) : displayRates.length > 0 ? (
        <div className="ac-card" style={{ padding: 0 }}>
          <div style={{ padding: "16px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="ac-section-title" style={{ marginBottom: 0 }}>Kurse gegenüber {base}</div>
            {updated && (
              <span style={{ fontSize: ".75rem", color: "var(--ink2)" }}>
                Stand: {new Date(updated).toLocaleString("de-DE", { timeStyle: "short", dateStyle: "short" })}
              </span>
            )}
          </div>
          <table aria-label="Wechselkurse" className="ac-table">
            <thead>
              <tr>
                <th scope="col">Währung</th>
                <th scope="col" style={{ textAlign: "right" }}>Kurs (1 {base} = X)</th>
                <th scope="col" style={{ textAlign: "right" }}>100 {base} in Fremdwährung</th>
                <th scope="col" style={{ textAlign: "right" }}>1 FW → {base}</th>
              </tr>
            </thead>
            <tbody>
              {displayRates.map(c => (
                <tr key={c}>
                  <td>
                    <strong>{c}</strong>
                  </td>
                  <td className="ac-mono" style={{ textAlign: "right" }}>{fmtRate(rates[c])}</td>
                  <td className="ac-mono" style={{ textAlign: "right" }}>{fmtFx(100 * rates[c], c)}</td>
                  <td className="ac-mono" style={{ textAlign: "right" }}>
                    {fmtEur(1 / rates[c])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "10px 20px", fontSize: ".76rem", color: "var(--ink2)", borderTop: "1px solid var(--border)" }}>
            Quelle: European Central Bank / open.er-api.com. Alle Kurse indikativ, kein Handelsangebot.
            Für steuerliche Zwecke den offiziellen EZB-Referenzkurs am Buchungstag verwenden.
          </div>
        </div>
      ) : null}
    </div>
  );
}
