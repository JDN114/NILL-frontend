// src/components/accounting/GewerbesteuerTab.jsx — Gewerbesteuer-Voranmeldung (F15) + ZM (F16) + Verfahrensdoku (F17)
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const QUARTALE = [
  { q: 1, label: "Q1 (Jan–Mär)", faell: "10. März" },
  { q: 2, label: "Q2 (Apr–Jun)", faell: "10. Juni" },
  { q: 3, label: "Q3 (Jul–Sep)", faell: "10. September" },
  { q: 4, label: "Q4 (Okt–Dez)", faell: "10. Dezember" },
];

const MONATE = [
  "Januar","Februar","März","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember"
];

function GewerbesteuerPanel() {
  const yr = new Date().getFullYear();
  const curQ = Math.ceil((new Date().getMonth() + 1) / 3);
  const [quartal, setQuartal] = useState(curQ);
  const [jahr, setJahr]       = useState(yr);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/tax/gewerbesteuer-voranmeldung/${jahr}/${quartal}`)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [quartal, jahr]);

  return (
    <div className="ac-card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "Fraunces,serif", fontSize: "1.05rem", fontWeight: 600 }}>
          Gewerbesteuer-Voranmeldung (§19 GewStG)
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select className="ac-select" style={{ fontSize: ".82rem" }} value={quartal} onChange={e => setQuartal(+e.target.value)}>
            {QUARTALE.map(q => <option key={q.q} value={q.q}>{q.label}</option>)}
          </select>
          <select className="ac-select" style={{ fontSize: ".82rem" }} value={jahr} onChange={e => setJahr(+e.target.value)}>
            {[yr - 1, yr, yr + 1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loading && <div className="ac-loading" style={{ padding: 20 }}><span className="ac-spinner" />Berechne…</div>}
      {!loading && data && (
        data.gewerbesteuerpflichtig === false ? (
          <div className="ac-alert ac-alert-warn">{data.hinweis}</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 14 }}>
              {[
                ["Einnahmen Quartal", data.einnahmen_netto, "green"],
                ["Ausgaben Quartal", data.ausgaben_netto, "pink"],
                ["Gewinn Quartal", data.gewinn_quartal, ""],
                ["Freibetrag (anteilig)", data.freibetrag_anteil, ""],
                ["Gewerbegewinn", data.gewerbegewinn, ""],
                ["Messbetrag (3,5%)", data.messbetrag, "purple"],
                ["Hebesatz", `${data.hebesatz_prozent}%`, ""],
                ["Vorauszahlung", data.vorauszahlung, "pink"],
              ].map(([label, val, col]) => (
                <div key={label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: ".7rem", color: "var(--ink2)", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                  <div className="ac-mono" style={{ fontWeight: 700, color: col === "green" ? "var(--accent)" : col === "pink" ? "var(--a3)" : col === "purple" ? "var(--a2)" : "var(--ink)" }}>
                    {typeof val === "number" ? fmtEur(val) : val}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: ".82rem", color: "var(--ink2)" }}>
                Fälligkeit: <strong style={{ color: "var(--ink)" }}>{data.faelligkeit}</strong>
                {" · "}Zeitraum: {data.zeitraum_von} – {data.zeitraum_bis}
              </div>
            </div>
            <div style={{ fontSize: ".75rem", color: "var(--ink2)", marginTop: 10, fontStyle: "italic" }}>{data.hinweis}</div>
          </>
        )
      )}
    </div>
  );
}

function ZMPanel() {
  const now = new Date();
  const [monat, setMonat]   = useState(now.getMonth() + 1);
  const [jahr, setJahr]     = useState(now.getFullYear());
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/tax/zusammenfassende-meldung/${jahr}/${monat}`)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [monat, jahr]);

  return (
    <div className="ac-card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "Fraunces,serif", fontSize: "1.05rem", fontWeight: 600 }}>
          Zusammenfassende Meldung — ZM (§ 18a UStG)
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="ac-select" style={{ fontSize: ".82rem" }} value={monat} onChange={e => setMonat(+e.target.value)}>
            {MONATE.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
          </select>
          <select className="ac-select" style={{ fontSize: ".82rem" }} value={jahr} onChange={e => setJahr(+e.target.value)}>
            {[now.getFullYear() - 1, now.getFullYear()].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loading && <div className="ac-loading" style={{ padding: 16 }}><span className="ac-spinner" />Lade…</div>}
      {!loading && data && (
        <>
          {!data.meldepflichtig ? (
            <div className="ac-alert ac-alert-ok" style={{ marginBottom: 8 }}>
              Kein ZM-Meldebedarf für {MONATE[monat - 1]} {jahr} — keine IG-Lieferungen erkannt.
            </div>
          ) : (
            <>
              <div className="ac-alert ac-alert-warn" style={{ marginBottom: 12 }}>
                ZM-Meldepflicht! {data.anzahl} IG-Lieferung{data.anzahl !== 1 ? "en" : ""} · Gesamt {fmtEur(data.gesamt_betrag)} · Fälligkeit: {data.faelligkeit}
              </div>
              <div className="ac-table-wrap">
                <table className="ac-table">
                  <thead>
                    <tr><th>Empfänger</th><th>USt-IdNr.</th><th>Land</th><th>Rechnung</th><th style={{ textAlign: "right" }}>Betrag netto</th></tr>
                  </thead>
                  <tbody>
                    {data.ig_positionen.map((p, i) => (
                      <tr key={i}>
                        <td>{p.empfaenger_name}</td>
                        <td className="ac-mono" style={{ fontSize: ".82rem" }}>{p.ust_id}</td>
                        <td><span className="ac-badge ac-badge-purple">{p.land}</span></td>
                        <td className="ac-mono" style={{ fontSize: ".82rem" }}>{p.rechnungsnummer}</td>
                        <td className="ac-mono" style={{ textAlign: "right" }}>{fmtEur(p.betrag_netto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <div style={{ fontSize: ".75rem", color: "var(--ink2)", marginTop: 8, fontStyle: "italic" }}>{data.hinweis}</div>
        </>
      )}
    </div>
  );
}

function VerfahrensdokuPanel() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]   = useState(false);

  const load = () => {
    if (data) { setOpen(true); return; }
    setLoading(true);
    api.get("/tax/verfahrensdokumentation")
      .then(r => { setData(r.data); setOpen(true); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const print = () => window.print();

  return (
    <div className="ac-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: open && data ? 16 : 0 }}>
        <div>
          <div style={{ fontFamily: "Fraunces,serif", fontSize: "1.05rem", fontWeight: 600, marginBottom: 4 }}>
            Verfahrensdokumentation (GoBD § 14 UStG)
          </div>
          <div style={{ fontSize: ".82rem", color: "var(--ink2)" }}>
            Bei Betriebsprüfung als erstes gefordert. Semi-automatisch generiert aus Ihren Systemdaten.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {open && data && <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={print}>🖨 Drucken</button>}
          <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={load} disabled={loading}>
            {loading ? "…" : open ? "Schließen" : "Generieren"}
          </button>
        </div>
      </div>

      {open && data && (
        <div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 4 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{data.titel}</div>
            <div style={{ fontSize: ".8rem", color: "var(--ink2)", marginBottom: 16 }}>
              Erstellt: {data.erstellt_am} · Version {data.version} · {data.unternehmen} ({data.rechtsform})
            </div>
            {data.abschnitte.map(s => (
              <div key={s.nr} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 4, fontSize: ".9rem" }}>
                  {s.nr}. {s.titel}
                </div>
                <div style={{ fontSize: ".85rem", color: "var(--ink2)", lineHeight: 1.7 }}>{s.inhalt}</div>
              </div>
            ))}
            <div style={{
              background: "rgba(198,255,60,.07)", border: "1px solid rgba(198,255,60,.2)",
              borderRadius: 8, padding: "10px 14px", fontSize: ".8rem", color: "var(--ink2)", marginTop: 8,
            }}>
              ⚖️ {data.hinweis}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GewerbesteuerTab() {
  return (
    <div>
      <GewerbesteuerPanel />
      <ZMPanel />
      <VerfahrensdokuPanel />
    </div>
  );
}
