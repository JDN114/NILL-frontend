// src/components/accounting/SteuerkalenderTab.jsx — Steuer-Kalender (F31)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const MONATE_DE = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];

const TYP_CONFIG = {
  ustva:   { label: "UStVA",          color: "var(--accent)",   bg: "rgba(198,255,60,.12)" },
  gewst:   { label: "GewSt",          color: "var(--a2)",       bg: "rgba(122,92,255,.12)" },
  koerperschaftsteuer: { label: "KöSt", color: "var(--a3)",   bg: "rgba(255,77,141,.12)" },
  einkommensteuer: { label: "EkSt",   color: "#ffb347",        bg: "rgba(255,179,71,.12)" },
  eur:     { label: "EÜR / Abschluss", color: "#7dd3fc",       bg: "rgba(125,211,252,.10)" },
  zm:      { label: "ZM",             color: "#d8b4fe",        bg: "rgba(216,180,254,.10)" },
};

function statusOf(termin) {
  const today = new Date();
  const d = new Date(termin.faellig);
  if (d < today) return "overdue";
  const diff = (d - today) / 864e5;
  if (diff <= 14) return "soon";
  return "ok";
}

const STATUS_COLORS = {
  overdue: "var(--a3)",
  soon:    "#ffb347",
  ok:      "var(--ink2)",
};

export default function SteuerkalenderTab() {
  const now = new Date();
  const [jahr, setJahr] = useState(now.getFullYear());
  const [termine, setTermine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    setLoading(true);
    api.get(`/api/v1/util/steuerkalender/${jahr}`)
      .then(r => setTermine(r.data?.termine || []))
      .catch(() => setTermine([]))
      .finally(() => setLoading(false));
  }, [jahr]);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === "all" ? termine : termine.filter(t => t.typ === filter);

  // Group by month
  const byMonth = {};
  for (const t of filtered) {
    const mo = t.faellig?.slice(5, 7);
    if (!mo) continue;
    if (!byMonth[mo]) byMonth[mo] = [];
    byMonth[mo].push(t);
  }

  const overdueCount = termine.filter(t => statusOf(t) === "overdue").length;
  const soonCount    = termine.filter(t => statusOf(t) === "soon").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Steuer-Kalender {jahr}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select className="ac-select" value={jahr} onChange={e => setJahr(+e.target.value)}>
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y =>
              <option key={y} value={y}>{y}</option>
            )}
          </select>
        </div>
      </div>

      {/* KPI row */}
      <div className="ac-kpi-grid" style={{ marginBottom: 20 }}>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Gesamt Termine</div>
          <div className="ac-kpi-value">{termine.length}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Überfällig</div>
          <div className="ac-kpi-value pink">{overdueCount}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">In 14 Tagen</div>
          <div className="ac-kpi-value" style={{ color: "#ffb347" }}>{soonCount}</div>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "4px 12px", borderRadius: 20, border: "1px solid var(--border)",
            background: filter === "all" ? "var(--accent)" : "transparent",
            color: filter === "all" ? "#000" : "var(--ink2)",
            fontSize: ".78rem", cursor: "pointer", transition: "all .15s",
          }}>Alle</button>
        {Object.entries(TYP_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key === filter ? "all" : key)}
            style={{
              padding: "4px 12px", borderRadius: 20, border: `1px solid ${cfg.color}`,
              background: filter === key ? cfg.bg : "transparent",
              color: cfg.color,
              fontSize: ".78rem", cursor: "pointer", transition: "all .15s",
            }}>{cfg.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="ac-loading"><span className="ac-spinner" />Lade Kalender…</div>
      ) : filtered.length === 0 ? (
        <div className="ac-empty">Keine Termine für diesen Filter.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.keys(byMonth).sort().map(mo => {
            const moName = MONATE_DE[parseInt(mo) - 1];
            const moTermine = byMonth[mo];
            return (
              <div key={mo} className="ac-card" style={{ padding: "16px 20px" }}>
                <div style={{
                  fontFamily: "Fraunces,serif", fontWeight: 600, fontSize: ".9rem",
                  marginBottom: 12, color: "var(--ink2)",
                  textTransform: "uppercase", letterSpacing: ".06em",
                }}>{moName} {jahr}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {moTermine.map((t, i) => {
                    const st = statusOf(t);
                    const cfg = TYP_CONFIG[t.typ] || { label: t.typ, color: "var(--ink2)", bg: "transparent" };
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px", borderRadius: 8,
                        background: cfg.bg,
                        border: `1px solid ${cfg.color}22`,
                      }}>
                        <div style={{
                          minWidth: 8, height: 8, borderRadius: "50%",
                          background: STATUS_COLORS[st], flexShrink: 0,
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: ".88rem", color: "var(--ink)" }}>{t.bezeichnung}</div>
                          {t.hinweis && (
                            <div style={{ fontSize: ".76rem", color: "var(--ink2)", marginTop: 2 }}>{t.hinweis}</div>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                          <span style={{ padding: "2px 8px", borderRadius: 12, background: cfg.bg, color: cfg.color, fontSize: ".72rem", fontWeight: 600 }}>
                            {cfg.label}
                          </span>
                          <span style={{
                            fontFamily: "JetBrains Mono,monospace", fontSize: ".82rem",
                            color: STATUS_COLORS[st], fontWeight: st !== "ok" ? 700 : 400,
                          }}>{t.faellig}</span>
                          {st === "overdue" && (
                            <span style={{ fontSize: ".72rem", color: "var(--a3)", fontWeight: 700 }}>ÜBERFÄLLIG</span>
                          )}
                          {st === "soon" && (
                            <span style={{ fontSize: ".72rem", color: "#ffb347", fontWeight: 700 }}>BALD</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="ac-card" style={{ marginTop: 20, borderColor: "rgba(198,255,60,.1)" }}>
        <div style={{ fontSize: ".8rem", color: "var(--ink2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink)" }}>Hinweis:</strong>{" "}
          Fälligkeitsdaten nach Standardterminen (§ 18 UStG, §§ 5/6 GewStG). Dauerfristverlängerungen, Wochenend-Verschiebungen
          und Sonderfälle bitte mit Steuerberater abstimmen. Der Kalender dient als Erinnerungshilfe, nicht als Rechtsauskunft.
        </div>
      </div>
    </div>
  );
}
