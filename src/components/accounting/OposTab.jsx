// src/components/accounting/OposTab.jsx — Offene Posten (OPOS Light)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

function ageBadge(days) {
  if (days < 14)  return { cls: "ac-badge-green",  label: `${days}d` };
  if (days < 30)  return { cls: "ac-badge-purple", label: `${days}d` };
  if (days < 60)  return { cls: "ac-badge-gray",   label: `${days}d` };
  return             { cls: "ac-badge-pink",   label: `${days}d` };
}

function stufeLabel(s) {
  if (!s || s === 0) return null;
  const labels = { 1: "Erinner.", 2: "1. Mahnung", 3: "Letzte" };
  return labels[s] || `Stufe ${s}`;
}

export default function OposTab({ onNavigate }) {
  const [rows,    setRows]    = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("alle");
  const [busy,    setBusy]    = useState({});

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/v1/opos"),
      api.get("/api/v1/opos/summary"),
    ])
      .then(([r, s]) => {
        setRows(r.data || []);
        setSummary(s.data || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const markBezahlt = async (id) => {
    setBusy(b => ({ ...b, [id]: true }));
    try {
      await api.patch(`/api/v1/rechnungen/${id}/`, { status: "bezahlt", bezahlt_am: new Date().toISOString().slice(0, 10) });
      load();
    } catch { alert("Fehler beim Markieren."); }
    finally { setBusy(b => ({ ...b, [id]: false })); }
  };

  const shown = filter === "alle"
    ? rows
    : filter === "30"  ? rows.filter(r => r.tage_offen >= 30)
    : filter === "60"  ? rows.filter(r => r.tage_offen >= 60)
    : rows.filter(r => r.mahnstufe && r.mahnstufe > 0);

  if (loading) return <div className="ac-loading"><span className="ac-spinner" />Lade offene Posten…</div>;

  return (
    <div>
      {summary && (
        <div className="ac-kpi-grid" style={{ marginBottom: 20 }}>
          <div className="ac-kpi">
            <div className="ac-kpi-label">Offene Posten</div>
            <div className="ac-kpi-value">{summary.total_offen ?? 0}</div>
          </div>
          <div className="ac-kpi">
            <div className="ac-kpi-label">Summe offen</div>
            <div className="ac-kpi-value pink">{fmtEur(summary.summe_offen)}</div>
          </div>
          <div className="ac-kpi">
            <div className="ac-kpi-label">Überfällig</div>
            <div className="ac-kpi-value pink">{summary.davon_ueberfaellig_anzahl ?? 0}</div>
          </div>
          <div className="ac-kpi">
            <div className="ac-kpi-label">Summe überfällig</div>
            <div className="ac-kpi-value pink">{fmtEur(summary.davon_ueberfaellig_summe)}</div>
          </div>
          {summary.aelteste_rechnung_tage > 0 && (
            <div className="ac-kpi">
              <div className="ac-kpi-label">Älteste Rechnung</div>
              <div className="ac-kpi-value pink">{summary.aelteste_rechnung_tage}d</div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        {[
          ["alle", "Alle"],
          ["30",   "≥ 30 Tage"],
          ["60",   "≥ 60 Tage"],
          ["mahnung", "Mit Mahnung"],
        ].map(([k, l]) => (
          <button key={k}
            className={`ac-btn ac-btn-sm ${filter === k ? "ac-btn-primary" : "ac-btn-ghost"}`}
            onClick={() => setFilter(k)}>
            {l}
          </button>
        ))}
        <button className="ac-btn ac-btn-ghost ac-btn-sm" style={{ marginLeft: "auto" }} onClick={load}>
          ↺ Aktualisieren
        </button>
        {onNavigate && (
          <button className="ac-btn ac-btn-primary ac-btn-sm"
            onClick={() => onNavigate("mahnwesen")}>
            Mahnwesen →
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="ac-card">
          <div className="ac-empty">
            {rows.length === 0
              ? "Alle Rechnungen sind bezahlt. Keine offenen Posten."
              : "Keine Posten für den gewählten Filter."}
          </div>
        </div>
      ) : (
        <div className="ac-card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="ac-table">
            <thead>
              <tr>
                <th>Rechnungsnr.</th>
                <th>Empfänger</th>
                <th>Fällig</th>
                <th>Überfällig</th>
                <th>Mahnstufe</th>
                <th style={{ textAlign: "right" }}>Betrag</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(r => {
                const age  = ageBadge(r.tage_offen || 0);
                const stuf = stufeLabel(r.mahnstufe);
                return (
                  <tr key={r.id}>
                    <td className="ac-mono" style={{ fontWeight: 600 }}>
                      {r.rechnungsnummer || `#${r.id}`}
                    </td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.empfaenger_name || "—"}
                    </td>
                    <td className="ac-mono">{r.faelligkeitsdatum || "—"}</td>
                    <td>
                      <span className={`ac-badge ${age.cls}`}>{age.label}</span>
                    </td>
                    <td>
                      {stuf
                        ? <span className="ac-badge ac-badge-pink" style={{ fontSize: ".7rem" }}>{stuf}</span>
                        : <span style={{ color: "var(--ink2)", fontSize: ".8rem" }}>—</span>}
                    </td>
                    <td className="ac-mono" style={{ textAlign: "right", fontWeight: 600 }}>
                      {fmtEur(r.brutto_summe)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={busy[r.id]}
                          onClick={() => markBezahlt(r.id)}>
                          ✓ Bezahlt
                        </button>
                        {onNavigate && (
                          <button className="ac-btn ac-btn-ghost ac-btn-sm"
                            onClick={() => onNavigate("mahnwesen")}>
                            Mahnen
                          </button>
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
    </div>
  );
}
