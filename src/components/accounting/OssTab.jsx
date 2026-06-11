// src/components/accounting/OssTab.jsx — One-Stop-Shop Quartalsmeldung (§18j UStG)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) => `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

export default function OssTab() {
  const now = new Date();
  const defaultQ = Math.max(1, Math.ceil(now.getMonth() / 3));   // letztes abgeschlossenes Quartal (grob)
  const [jahr, setJahr] = useState(now.getFullYear());
  const [quartal, setQuartal] = useState(defaultQ);
  const [bericht, setBericht] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = useCallback(() => {
    setLoading(true); setErr(null);
    api.get("/tax/oss/report", { params: { jahr, quartal } })
      .then(r => setBericht(r.data))
      .catch(e => setErr(e?.response?.data?.detail || "OSS-Bericht konnte nicht geladen werden."))
      .finally(() => setLoading(false));
  }, [jahr, quartal]);

  useEffect(() => { load(); }, [load]);

  const csvUrl = `${import.meta.env.VITE_API_URL}/tax/oss/report.csv?jahr=${jahr}&quartal=${quartal}`;
  const jahre = Array.from({ length: 4 }, (_, i) => now.getFullYear() - i);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>
          OSS — One-Stop-Shop (§18j UStG)
        </span>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => window.open(csvUrl, "_blank")}
          disabled={!bericht || bericht.positionen?.length === 0}>
          CSV für BZSt-Portal
        </button>
      </div>
      <p style={{ margin: "0 0 16px", fontSize: ".78rem", color: "var(--ink2)", maxWidth: 760 }}>
        Quartalsmeldung für B2C-Umsätze an EU-Privatkunden: NILL aggregiert automatisch je Verbrauchsland
        und Steuersatz — fertig für die Abgabe im BZSt-Online-Portal.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="ac-form-col" style={{ maxWidth: 120 }}>
          <label className="ac-label" htmlFor="oss-jahr">Jahr</label>
          <select id="oss-jahr" className="ac-select" value={jahr} onChange={e => setJahr(Number(e.target.value))}>
            {jahre.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
        <div className="ac-form-col" style={{ maxWidth: 120 }}>
          <label className="ac-label" htmlFor="oss-q">Quartal</label>
          <select id="oss-q" className="ac-select" value={quartal} onChange={e => setQuartal(Number(e.target.value))}>
            {[1, 2, 3, 4].map(q => <option key={q} value={q}>Q{q}</option>)}
          </select>
        </div>
      </div>

      {err && <div role="alert" className="ac-alert ac-alert-warn" style={{ marginBottom: 12 }}>{err}</div>}

      {loading ? (
        <div style={{ padding: 20, color: "var(--ink2)" }}>Wird geladen…</div>
      ) : bericht && (
        <>
          <div className="ac-card" style={{ marginBottom: 16, borderColor: "rgba(198,255,60,.2)" }}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: ".85rem" }}>
              <div><span style={{ color: "var(--ink2)" }}>Zeitraum: </span>
                <strong>{bericht.zeitraum_von} – {bericht.zeitraum_bis}</strong></div>
              <div><span style={{ color: "var(--ink2)" }}>Abgabefrist: </span>
                <strong style={{ color: "var(--accent)" }}>{new Date(bericht.abgabefrist).toLocaleDateString("de-DE")}</strong></div>
              <div><span style={{ color: "var(--ink2)" }}>Bemessungsgrundlage: </span>
                <strong>{fmtEur(bericht.summe_bemessungsgrundlage)}</strong></div>
              <div><span style={{ color: "var(--ink2)" }}>Steuerbetrag: </span>
                <strong>{fmtEur(bericht.summe_steuerbetrag)}</strong></div>
            </div>
          </div>

          {bericht.warnungen?.length > 0 && (
            <div className="ac-alert ac-alert-warn" style={{ marginBottom: 12 }}>
              {bericht.warnungen.map((w, i) => <div key={i}>{w}</div>)}
            </div>
          )}

          <div className="ac-card" style={{ padding: 0 }}>
            {bericht.positionen.length === 0 ? (
              <div style={{ padding: 20, color: "var(--ink2)", fontSize: ".85rem" }}>
                Keine OSS-pflichtigen B2C-Umsätze im Zeitraum. Hinweis: Bei aktiver OSS-Registrierung
                ist trotzdem eine Nullmeldung im BZSt-Portal abzugeben.
              </div>
            ) : (
              <table className="ac-table" aria-label="OSS-Positionen">
                <thead>
                  <tr><th>Land</th><th>Steuersatztyp</th><th>Steuersatz</th><th>Bemessungsgrundlage</th><th>Steuerbetrag</th></tr>
                </thead>
                <tbody>
                  {bericht.positionen.map((p, i) => (
                    <tr key={i}>
                      <td>{p.land}</td>
                      <td>{p.steuersatztyp}</td>
                      <td>{p.steuersatz.toLocaleString("de-DE")} %</td>
                      <td>{fmtEur(p.bemessungsgrundlage)}</td>
                      <td>{fmtEur(p.steuerbetrag)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <p style={{ marginTop: 12, fontSize: ".74rem", color: "var(--ink2)" }}>{bericht.hinweis}</p>
        </>
      )}
    </div>
  );
}
