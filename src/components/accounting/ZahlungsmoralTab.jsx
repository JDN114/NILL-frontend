// src/components/accounting/ZahlungsmoralTab.jsx — Zahlungsmoral / Kundenbewertung (F34)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

function ScoreBadge({ score }) {
  let color, label;
  if (score >= 80)      { color = "var(--accent)"; label = "Sehr gut"; }
  else if (score >= 60) { color = "#7dd3fc";        label = "Gut"; }
  else if (score >= 40) { color = "#ffb347";        label = "Mittel"; }
  else                  { color = "var(--a3)";      label = "Kritisch"; }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: `3px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "JetBrains Mono,monospace", fontWeight: 700, fontSize: "1rem",
        color, flexShrink: 0,
      }}>{score}</div>
      <div>
        <div style={{ fontWeight: 600, color }}>{label}</div>
        <div style={{ fontSize: ".75rem", color: "var(--ink2)" }}>Zahlungsmoral-Score (0–100)</div>
      </div>
    </div>
  );
}

function ScoreBar({ score }) {
  const color = score >= 80 ? "var(--accent)" : score >= 60 ? "#7dd3fc" : score >= 40 ? "#ffb347" : "var(--a3)";
  return (
    <div style={{ background: "var(--surface2)", borderRadius: 4, height: 6, overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 4, transition: "width .4s" }} />
    </div>
  );
}

export default function ZahlungsmoralTab() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort]     = useState("score_asc");

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/util/zahlungsmoral")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const kunden = data?.kunden || [];
  const sorted = [...kunden].sort((a, b) => {
    if (sort === "score_asc")  return a.score - b.score;
    if (sort === "score_desc") return b.score - a.score;
    if (sort === "umsatz")     return b.gesamt_umsatz - a.gesamt_umsatz;
    if (sort === "name")       return a.name.localeCompare(b.name);
    return 0;
  });

  const avg = kunden.length > 0
    ? Math.round(kunden.reduce((s, k) => s + k.score, 0) / kunden.length)
    : 0;
  const kritisch  = kunden.filter(k => k.score < 40).length;
  const bestKunde = kunden.length > 0 ? kunden.reduce((a, b) => a.score > b.score ? a : b, kunden[0]) : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Zahlungsmoral & Kundenbewertung</span>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={load} disabled={loading}>↻ Aktualisieren</button>
      </div>

      <p style={{ fontSize: ".82rem", color: "var(--ink2)", marginBottom: 20 }}>
        Score basierend auf Zahlungsverzug, Mahnhäufigkeit und Zahlungshistorie. Score 0–100: 80+ sehr gut, 40–79 mittel, unter 40 kritisch.
      </p>

      {loading ? (
        <div className="ac-loading"><span className="ac-spinner" />Analysiere Zahlungshistorie…</div>
      ) : kunden.length === 0 ? (
        <div className="ac-empty">Noch keine Rechnungsdaten für Bewertung vorhanden.</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="ac-kpi-grid" style={{ marginBottom: 20 }}>
            <div className="ac-kpi">
              <div className="ac-kpi-label">Ø Score</div>
              <div className="ac-kpi-value" style={{ color: avg >= 60 ? "var(--accent)" : avg >= 40 ? "#ffb347" : "var(--a3)" }}>{avg}</div>
            </div>
            <div className="ac-kpi">
              <div className="ac-kpi-label">Kunden gesamt</div>
              <div className="ac-kpi-value">{kunden.length}</div>
            </div>
            <div className="ac-kpi">
              <div className="ac-kpi-label">Kritische Zahler</div>
              <div className="ac-kpi-value pink">{kritisch}</div>
            </div>
            {bestKunde && (
              <div className="ac-kpi">
                <div className="ac-kpi-label">Bester Zahler</div>
                <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: ".9rem", marginTop: 4 }}>{bestKunde.name}</div>
                <div style={{ fontSize: ".75rem", color: "var(--ink2)" }}>Score {bestKunde.score}</div>
              </div>
            )}
            {data?.gesamt_umsatz !== undefined && (
              <div className="ac-kpi">
                <div className="ac-kpi-label">Gesamt-Umsatz bewertet</div>
                <div className="ac-kpi-value green">{fmtEur(data.gesamt_umsatz)}</div>
              </div>
            )}
          </div>

          {/* Sort */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, alignItems: "center" }}>
            <span style={{ fontSize: ".78rem", color: "var(--ink2)" }}>Sortieren:</span>
            {[
              ["score_asc",  "Score ↑"],
              ["score_desc", "Score ↓"],
              ["umsatz",     "Umsatz"],
              ["name",       "Name"],
            ].map(([val, lbl]) => (
              <button key={val} onClick={() => setSort(val)} style={{
                padding: "3px 10px", borderRadius: 12, border: "1px solid var(--border)",
                background: sort === val ? "var(--accent)" : "transparent",
                color: sort === val ? "#000" : "var(--ink2)",
                fontSize: ".75rem", cursor: "pointer", transition: "all .15s",
              }}>{lbl}</button>
            ))}
          </div>

          {/* Customer cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sorted.map(k => (
              <div key={k.name} className="ac-card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <ScoreBadge score={k.score} />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>{k.name}</div>
                    <ScoreBar score={k.score} />
                    <div style={{ display: "flex", gap: 20, marginTop: 10, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: ".72rem", color: "var(--ink2)" }}>Rechnungen</div>
                        <div style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 600 }}>{k.anzahl_rechnungen}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: ".72rem", color: "var(--ink2)" }}>Gesamtumsatz</div>
                        <div style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 600, color: "var(--accent)" }}>{fmtEur(k.gesamt_umsatz)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: ".72rem", color: "var(--ink2)" }}>Offene Posten</div>
                        <div style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 600, color: k.offene_posten > 0 ? "var(--a3)" : "var(--ink2)" }}>
                          {fmtEur(k.offene_posten)}
                        </div>
                      </div>
                      {k.avg_zahlungsverzug_tage !== undefined && (
                        <div>
                          <div style={{ fontSize: ".72rem", color: "var(--ink2)" }}>Ø Verzug</div>
                          <div style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 600, color: k.avg_zahlungsverzug_tage > 14 ? "#ffb347" : "var(--ink2)" }}>
                            {Math.round(k.avg_zahlungsverzug_tage)} Tage
                          </div>
                        </div>
                      )}
                      {k.mahnungen > 0 && (
                        <div>
                          <div style={{ fontSize: ".72rem", color: "var(--ink2)" }}>Mahnungen</div>
                          <div style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 600, color: "var(--a3)" }}>
                            {k.mahnungen}×
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
