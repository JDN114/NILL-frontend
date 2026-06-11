// src/components/accounting/FahrtenbuchTab.jsx — Elektronisches Fahrtenbuch (§8 Abs. 2 EStG)
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtKm = (n) => `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
const KATEGORIEN = [
  { id: "betrieblich",       label: "Betrieblich" },
  { id: "privat",            label: "Privat" },
  { id: "arbeitsweg",        label: "Wohnung–Betrieb" },
  { id: "familienheimfahrt", label: "Familienheimfahrt" },
];
const KAT_LABEL = Object.fromEntries(KATEGORIEN.map(k => [k.id, k.label]));

const EMPTY_FAHRT = {
  datum: new Date().toISOString().slice(0, 10),
  km_start: "", km_ende: "", kategorie: "betrieblich",
  start_ort: "", ziel_ort: "", zweck: "", geschaeftspartner: "", route_hinweis: "",
};

export default function FahrtenbuchTab() {
  const [fahrzeuge, setFahrzeuge] = useState([]);
  const [fahrzeugId, setFahrzeugId] = useState(null);
  const [fahrten, setFahrten] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const [neuFahrzeug, setNeuFahrzeug] = useState({ kennzeichen: "", bezeichnung: "", km_stand_initial: "" });
  const [fahrt, setFahrt] = useState(EMPTY_FAHRT);
  const [saving, setSaving] = useState(false);

  const jahr = new Date().getFullYear();

  const loadFahrzeuge = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/fahrtenbuch/fahrzeuge")
      .then(r => {
        const fz = r.data?.fahrzeuge || [];
        setFahrzeuge(fz);
        if (fz.length && !fahrzeugId) setFahrzeugId(fz[0].id);
      })
      .catch(() => setErr("Fahrzeuge konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, [fahrzeugId]);

  const loadFahrten = useCallback(() => {
    if (!fahrzeugId) { setFahrten([]); setSummary(null); return; }
    api.get("/api/v1/fahrtenbuch/fahrten", { params: { fahrzeug_id: fahrzeugId } })
      .then(r => setFahrten(r.data?.fahrten || []))
      .catch(() => setErr("Fahrten konnten nicht geladen werden."));
    api.get("/api/v1/fahrtenbuch/zusammenfassung", { params: { fahrzeug_id: fahrzeugId, jahr } })
      .then(r => setSummary(r.data))
      .catch(() => {});
  }, [fahrzeugId, jahr]);

  useEffect(() => { loadFahrzeuge(); }, [loadFahrzeuge]);
  useEffect(() => { loadFahrten(); }, [loadFahrten]);

  const flash = (msg) => { setOk(msg); setErr(null); setTimeout(() => setOk(null), 4000); };
  const fail = (e, fallback) => setErr(e?.response?.data?.detail || fallback);

  const fahrzeugAnlegen = async () => {
    if (!neuFahrzeug.kennzeichen) return;
    setSaving(true);
    try {
      const r = await api.post("/api/v1/fahrtenbuch/fahrzeuge", {
        kennzeichen: neuFahrzeug.kennzeichen,
        bezeichnung: neuFahrzeug.bezeichnung || null,
        km_stand_initial: parseFloat(neuFahrzeug.km_stand_initial) || 0,
      });
      setNeuFahrzeug({ kennzeichen: "", bezeichnung: "", km_stand_initial: "" });
      flash("Fahrzeug angelegt.");
      setFahrzeugId(r.data.id);
      loadFahrzeuge();
    } catch (e) { fail(e, "Fahrzeug konnte nicht angelegt werden."); }
    finally { setSaving(false); }
  };

  const fahrtSpeichern = async () => {
    setSaving(true);
    try {
      await api.post("/api/v1/fahrtenbuch/fahrten", {
        fahrzeug_id: fahrzeugId,
        datum: fahrt.datum,
        km_start: parseFloat(fahrt.km_start),
        km_ende: parseFloat(fahrt.km_ende),
        kategorie: fahrt.kategorie,
        start_ort: fahrt.start_ort || null,
        ziel_ort: fahrt.ziel_ort || null,
        zweck: fahrt.zweck || null,
        geschaeftspartner: fahrt.geschaeftspartner || null,
        route_hinweis: fahrt.route_hinweis || null,
      });
      const kmEnde = fahrt.km_ende;
      setFahrt({ ...EMPTY_FAHRT, datum: fahrt.datum, km_start: kmEnde });
      flash("Fahrt erfasst — nach GoBD unveränderlich gespeichert.");
      loadFahrten(); loadFahrzeuge();
    } catch (e) { fail(e, "Fahrt konnte nicht gespeichert werden."); }
    finally { setSaving(false); }
  };

  const stornieren = async (id) => {
    const grund = window.prompt("Stornogrund (Pflicht — wird dokumentiert):");
    if (!grund) return;
    try {
      await api.post(`/api/v1/fahrtenbuch/fahrten/${id}/storno`, { grund });
      flash("Fahrt storniert (dokumentiert).");
      loadFahrten();
    } catch (e) { fail(e, "Storno fehlgeschlagen."); }
  };

  const exportUrl = (typ) =>
    `${import.meta.env.VITE_API_URL}/api/v1/fahrtenbuch/export/${typ}?fahrzeug_id=${fahrzeugId}&von=${jahr}-01-01&bis=${jahr}-12-31`;

  const aktivesFahrzeug = fahrzeuge.find(f => f.id === fahrzeugId);
  const istBetrieblich = fahrt.kategorie === "betrieblich";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Elektronisches Fahrtenbuch</span>
        {fahrzeugId && (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => window.open(exportUrl("csv"), "_blank")}>CSV {jahr}</button>
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => window.open(exportUrl("pdf"), "_blank")}>PDF fürs Finanzamt</button>
          </div>
        )}
      </div>
      <p style={{ margin: "0 0 16px", fontSize: ".78rem", color: "var(--ink2)" }}>
        Finanzamtskonform nach §8 Abs. 2 EStG: lückenlose km-Stände, Fahrten nach Erfassung unveränderlich
        (Korrektur nur per dokumentiertem Storno), SHA-256-Hash-Kette gegen Manipulation.
      </p>

      {err && <div role="alert" className="ac-alert ac-alert-warn" style={{ marginBottom: 12 }}>{err}</div>}
      {ok && <div role="status" className="ac-alert" style={{ marginBottom: 12, borderColor: "rgba(198,255,60,.3)", color: "var(--accent)" }}>{ok}</div>}

      {/* Fahrzeuge */}
      <div className="ac-card" style={{ marginBottom: 16 }}>
        <div className="ac-section-title">Fahrzeug</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          {fahrzeuge.length > 0 && (
            <div className="ac-form-col" style={{ maxWidth: 260 }}>
              <label className="ac-label" htmlFor="fb-fz">Aktives Fahrzeug</label>
              <select id="fb-fz" className="ac-select" value={fahrzeugId || ""} onChange={e => setFahrzeugId(Number(e.target.value))}>
                {fahrzeuge.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.kennzeichen}{f.bezeichnung ? ` — ${f.bezeichnung}` : ""} ({fmtKm(f.km_aktuell)})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="ac-form-col" style={{ maxWidth: 150 }}>
            <label className="ac-label">Kennzeichen</label>
            <input className="ac-input" placeholder="B-XX 1234" value={neuFahrzeug.kennzeichen}
              onChange={e => setNeuFahrzeug({ ...neuFahrzeug, kennzeichen: e.target.value })}/>
          </div>
          <div className="ac-form-col" style={{ maxWidth: 180 }}>
            <label className="ac-label">Bezeichnung</label>
            <input className="ac-input" placeholder="z. B. VW Caddy" value={neuFahrzeug.bezeichnung}
              onChange={e => setNeuFahrzeug({ ...neuFahrzeug, bezeichnung: e.target.value })}/>
          </div>
          <div className="ac-form-col" style={{ maxWidth: 140 }}>
            <label className="ac-label">km-Stand aktuell</label>
            <input className="ac-input" type="number" min="0" step="0.1" value={neuFahrzeug.km_stand_initial}
              onChange={e => setNeuFahrzeug({ ...neuFahrzeug, km_stand_initial: e.target.value })}/>
          </div>
          <button className="ac-btn ac-btn-ghost" onClick={fahrzeugAnlegen} disabled={saving || !neuFahrzeug.kennzeichen}>
            + Fahrzeug
          </button>
        </div>
      </div>

      {fahrzeugId && (
        <>
          {/* Zusammenfassung */}
          {summary && summary.gesamt_km > 0 && (
            <div className="ac-card" style={{ marginBottom: 16, borderColor: "rgba(198,255,60,.2)" }}>
              <div className="ac-section-title">Jahresübersicht {jahr} — {aktivesFahrzeug?.kennzeichen}</div>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap", fontSize: ".85rem" }}>
                <div><span style={{ color: "var(--ink2)" }}>Gesamt: </span><strong>{fmtKm(summary.gesamt_km)}</strong></div>
                {Object.entries(summary.nach_kategorie || {}).map(([k, v]) => (
                  <div key={k}><span style={{ color: "var(--ink2)" }}>{KAT_LABEL[k] || k}: </span><strong>{fmtKm(v.km)}</strong></div>
                ))}
                <div><span style={{ color: "var(--ink2)" }}>Privatanteil: </span>
                  <strong style={{ color: "var(--accent)" }}>{summary.privatanteil_prozent} %</strong></div>
              </div>
              {summary.hinweis && <div style={{ marginTop: 8, fontSize: ".75rem", color: "var(--ink2)" }}>{summary.hinweis}</div>}
            </div>
          )}

          {/* Neue Fahrt */}
          <div className="ac-card" style={{ marginBottom: 16 }}>
            <div className="ac-section-title">Fahrt erfassen</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div className="ac-form-col" style={{ maxWidth: 140 }}>
                <label className="ac-label">Datum</label>
                <input className="ac-input" type="date" value={fahrt.datum}
                  onChange={e => setFahrt({ ...fahrt, datum: e.target.value })}/>
              </div>
              <div className="ac-form-col" style={{ maxWidth: 160 }}>
                <label className="ac-label" htmlFor="fb-kat">Kategorie</label>
                <select id="fb-kat" className="ac-select" value={fahrt.kategorie}
                  onChange={e => setFahrt({ ...fahrt, kategorie: e.target.value })}>
                  {KATEGORIEN.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
                </select>
              </div>
              <div className="ac-form-col" style={{ maxWidth: 120 }}>
                <label className="ac-label">km Start</label>
                <input className="ac-input" type="number" step="0.1" value={fahrt.km_start}
                  placeholder={aktivesFahrzeug ? String(aktivesFahrzeug.km_aktuell) : ""}
                  onChange={e => setFahrt({ ...fahrt, km_start: e.target.value })}/>
              </div>
              <div className="ac-form-col" style={{ maxWidth: 120 }}>
                <label className="ac-label">km Ende</label>
                <input className="ac-input" type="number" step="0.1" value={fahrt.km_ende}
                  onChange={e => setFahrt({ ...fahrt, km_ende: e.target.value })}/>
              </div>
            </div>
            {istBetrieblich && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginTop: 10 }}>
                <div className="ac-form-col" style={{ maxWidth: 170 }}>
                  <label className="ac-label">Start-Ort</label>
                  <input className="ac-input" value={fahrt.start_ort} onChange={e => setFahrt({ ...fahrt, start_ort: e.target.value })}/>
                </div>
                <div className="ac-form-col" style={{ maxWidth: 170 }}>
                  <label className="ac-label">Reiseziel *</label>
                  <input className="ac-input" value={fahrt.ziel_ort} onChange={e => setFahrt({ ...fahrt, ziel_ort: e.target.value })}/>
                </div>
                <div className="ac-form-col" style={{ maxWidth: 220 }}>
                  <label className="ac-label">Reisezweck *</label>
                  <input className="ac-input" value={fahrt.zweck} onChange={e => setFahrt({ ...fahrt, zweck: e.target.value })}/>
                </div>
                <div className="ac-form-col" style={{ maxWidth: 200 }}>
                  <label className="ac-label">Geschäftspartner</label>
                  <input className="ac-input" value={fahrt.geschaeftspartner} onChange={e => setFahrt({ ...fahrt, geschaeftspartner: e.target.value })}/>
                </div>
                <div className="ac-form-col" style={{ maxWidth: 200 }}>
                  <label className="ac-label">Route (bei Umweg)</label>
                  <input className="ac-input" value={fahrt.route_hinweis} onChange={e => setFahrt({ ...fahrt, route_hinweis: e.target.value })}/>
                </div>
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <button className="ac-btn ac-btn-primary" onClick={fahrtSpeichern}
                disabled={saving || !fahrt.km_start || !fahrt.km_ende || (istBetrieblich && (!fahrt.ziel_ort || !fahrt.zweck))}>
                {saving ? "…" : "Fahrt speichern (endgültig)"}
              </button>
            </div>
          </div>

          {/* Fahrtenliste */}
          <div className="ac-card" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 20, color: "var(--ink2)" }}>Wird geladen…</div>
            ) : fahrten.length === 0 ? (
              <div style={{ padding: 20, color: "var(--ink2)", fontSize: ".85rem" }}>
                Noch keine Fahrten erfasst. GoBD-Tipp: Fahrten zeitnah (innerhalb von 7 Tagen) eintragen.
              </div>
            ) : (
              <table className="ac-table" aria-label="Fahrten">
                <thead>
                  <tr>
                    <th>Datum</th><th>km Start</th><th>km Ende</th><th>km</th>
                    <th>Ziel / Zweck</th><th>Kategorie</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {fahrten.map(f => (
                    <tr key={f.id} style={f.storniert ? { opacity: .45, textDecoration: "line-through" } : undefined}>
                      <td>{f.datum}</td>
                      <td>{fmtKm(f.km_start)}</td>
                      <td>{fmtKm(f.km_ende)}</td>
                      <td>{fmtKm(f.km_ende - f.km_start)}</td>
                      <td style={{ maxWidth: 320 }}>
                        {f.kategorie === "betrieblich"
                          ? <>{f.ziel_ort}{f.zweck ? ` — ${f.zweck}` : ""}{f.geschaeftspartner ? ` (${f.geschaeftspartner})` : ""}</>
                          : <span style={{ color: "var(--ink2)" }}>{KAT_LABEL[f.kategorie]}</span>}
                        {f.storniert && <div style={{ fontSize: ".7rem", textDecoration: "none" }}>Storno: {f.storno_grund}</div>}
                      </td>
                      <td>{KAT_LABEL[f.kategorie] || f.kategorie}</td>
                      <td>
                        {!f.storniert && (
                          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => stornieren(f.id)}>Storno</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
