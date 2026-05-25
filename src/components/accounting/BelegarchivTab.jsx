// src/components/accounting/BelegarchivTab.jsx — GoBD §147 Belegarchiv mit Volltextsuche
import React, { useState, useCallback, useRef } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const TYP_LABELS = {
  invoice:           "Eingangsbeleg",
  ausgangsrechnung:  "Ausgangsrechnung",
};

export default function BelegarchivTab() {
  const [q,       setQ]       = useState("");
  const [typ,     setTyp]     = useState("");
  const [von,     setVon]     = useState("");
  const [bis,     setBis]     = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const timer = useRef(null);

  const search = useCallback(async (query, typVal, vonVal, bisVal) => {
    if (!query.trim() && !typVal && !vonVal && !bisVal) {
      setResults(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const r = await api.get("/api/v1/accounting/belegarchiv/suche", {
        params: {
          q:   query || undefined,
          typ: typVal || undefined,
          von: vonVal || undefined,
          bis: bisVal || undefined,
          limit: 50,
        },
      });
      setResults(r.data?.results || []);
    } catch (e) {
      setError(e.response?.data?.detail || "Suche fehlgeschlagen.");
      setResults([]);
    } finally { setLoading(false); }
  }, []);

  const onQueryChange = (val) => {
    setQ(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(val, typ, von, bis), 400);
  };

  const onFilterChange = (key, val) => {
    const next = { q, typ, von, bis, [key]: val };
    if (key === "typ") setTyp(val);
    if (key === "von") setVon(val);
    if (key === "bis") setBis(val);
    search(next.q, next.typ, next.von, next.bis);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "var(--ink2)", fontSize: ".85rem", marginBottom: 14 }}>
          Volltext-Suche über alle Belege — Eingangsrechnungen und Ausgangsrechnungen.
          GoBD §147 konforme Archivierung.
        </div>
        <div className="ac-form-row" style={{ gap: 10 }}>
          <div className="ac-form-col" style={{ flex: 3 }}>
            <label className="ac-label">Suchbegriff</label>
            <input
              className="ac-input"
              value={q}
              onChange={e => onQueryChange(e.target.value)}
              placeholder="Firmenname, Betrag, Rechnungsnummer, Beschreibung…"
              autoFocus
            />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Typ</label>
            <select className="ac-select" value={typ}
              onChange={e => onFilterChange("typ", e.target.value)}>
              <option value="">Alle</option>
              <option value="invoice">Eingangsbelege</option>
              <option value="ausgangsrechnung">Ausgangsrechnungen</option>
            </select>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Von</label>
            <input className="ac-input" type="date" value={von}
              onChange={e => onFilterChange("von", e.target.value)} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Bis</label>
            <input className="ac-input" type="date" value={bis}
              onChange={e => onFilterChange("bis", e.target.value)} />
          </div>
        </div>
      </div>

      {error && (
        <div className="ac-alert ac-alert-err" style={{ marginBottom: 14 }}>{error}</div>
      )}

      {loading && (
        <div className="ac-loading"><span className="ac-spinner" />Suche läuft…</div>
      )}

      {!loading && results === null && (
        <div className="ac-card">
          <div className="ac-empty" style={{ padding: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div>Suchbegriff eingeben, um Belege zu finden.</div>
            <div style={{ marginTop: 8, fontSize: ".8rem", color: "var(--ink2)" }}>
              Unterstützt Volltext, Firmennamen, Rechnungsnummern und Beträge.
            </div>
          </div>
        </div>
      )}

      {!loading && results !== null && results.length === 0 && (
        <div className="ac-card">
          <div className="ac-empty">Keine Ergebnisse für diese Suche.</div>
        </div>
      )}

      {!loading && results?.length > 0 && (
        <>
          <div style={{ fontSize: ".8rem", color: "var(--ink2)", marginBottom: 10 }}>
            {results.length} Ergebnis{results.length !== 1 ? "se" : ""}
          </div>
          <div className="ac-card" style={{ padding: 0, overflowX: "auto" }}>
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Typ</th>
                  <th>Nummer / ID</th>
                  <th>Aussteller / Empfänger</th>
                  <th>Datum</th>
                  <th style={{ textAlign: "right" }}>Betrag</th>
                  <th>Treffer</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={`${r.typ}-${r.id}-${i}`}>
                    <td>
                      <span className={`ac-badge ${r.typ === "ausgangsrechnung" ? "ac-badge-purple" : "ac-badge-gray"}`}
                        style={{ fontSize: ".7rem" }}>
                        {TYP_LABELS[r.typ] || r.typ}
                      </span>
                    </td>
                    <td className="ac-mono" style={{ fontWeight: 600, fontSize: ".82rem" }}>
                      {r.nummer || `#${r.id}`}
                    </td>
                    <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.name || "—"}
                    </td>
                    <td className="ac-mono">{r.datum || "—"}</td>
                    <td className="ac-mono" style={{ textAlign: "right" }}>
                      {r.betrag != null ? fmtEur(r.betrag) : "—"}
                    </td>
                    <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      fontSize: ".8rem", color: "var(--ink2)" }}>
                      {r.snippet || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div style={{
        marginTop: 20, padding: "12px 16px",
        background: "rgba(198,255,60,.05)", border: "1px solid rgba(198,255,60,.12)",
        borderRadius: 10, fontSize: ".8rem", color: "var(--ink2)", lineHeight: 1.6,
      }}>
        <strong style={{ color: "var(--ink)" }}>GoBD §147</strong>: Alle Belege werden
        10 Jahre unveränderlich archiviert. Volltext-Index wird automatisch aktualisiert.
      </div>
    </div>
  );
}
