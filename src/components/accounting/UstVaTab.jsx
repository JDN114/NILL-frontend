// src/components/accounting/UstVaTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmt    = (n) => Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtEur = (n) => `${fmt(n)} EUR`;

const faelligkeitsDatum = (periode_bis) => {
  if (!periode_bis) return "--";
  const d = new Date(periode_bis);
  const next = new Date(d.getFullYear(), d.getMonth() + 1, 10);
  return next.toLocaleDateString("de-DE");
};

const KZ_BESCHREIBUNG = {
  kz_21_umsaetze_19:          { kz:"21", label:"Steuerpfl. Umsatze 19%",           typ:"umsatz" },
  kz_35_umsaetze_7:           { kz:"35", label:"Steuerpfl. Umsatze 7%",            typ:"umsatz" },
  kz_86_ig_lieferungen:       { kz:"86", label:"Innergemeinschaftliche Lieferungen", typ:"umsatz" },
  kz_81_steuerfreie_umsaetze: { kz:"81", label:"Steuerfreie Umsatze",              typ:"umsatz" },
  kz_41_ust_19:               { kz:"41", label:"Umsatzsteuer 19%",                 typ:"steuer" },
  kz_44_ust_7:                { kz:"44", label:"Umsatzsteuer 7%",                  typ:"steuer" },
  kz_59_vorsteuer_allgemein:  { kz:"59", label:"Vorsteuer (allgemein)",             typ:"vorsteuer" },
  kz_61_vorsteuer_ig_erwerb:  { kz:"61", label:"Vorsteuer ig-Erwerb",              typ:"vorsteuer" },
  kz_65_zahllast:             { kz:"65", label:"Zahllast / Erstattung",             typ:"zahllast" },
};

function PeriodStatus({ perioden, onReload }) {
  const [marking, setMarking] = useState(null);
  const [msg, setMsg]         = useState(null);

  const markEingereicht = async (id) => {
    setMarking(id);
    try {
      await api.patch(`/api/v1/buchhaltung/ust/perioden/${id}/eingereicht`);
      setMsg({ type:"ok", text:"Periode als eingereicht markiert." });
      if (onReload) onReload();
    } catch(e) {
      setMsg({ type:"err", text: e.response?.data?.detail || "Fehler" });
    } finally { setMarking(null); }
  };

  return (
    <div className="ac-card" style={{ marginBottom:16 }}>
      <div className="ac-section-title">USt-Voranmeldungen</div>
      {msg && (
        <div className={`ac-alert ${msg.type==="ok"?"ac-alert-ok":"ac-alert-err"}`}
          style={{cursor:"pointer",marginBottom:12}} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}
      <table className="ac-table">
        <thead>
          <tr>
            <th>Periode</th><th>Typ</th><th>Status</th>
            <th style={{textAlign:"right"}}>Zahllast</th>
            <th>Fälligkeit</th><th></th>
          </tr>
        </thead>
        <tbody>
          {perioden.length === 0 && <tr><td colSpan={6} className="ac-empty">Noch keine USt-Perioden.</td></tr>}
          {perioden.map(p => (
            <tr key={p.id}>
              <td className="ac-mono">{`${p.periode_von} – ${p.periode_bis}`}</td>
              <td><span className="ac-badge ac-badge-gray">{p.art || "monatlich"}</span></td>
              <td>
                {p.status === "eingereicht"
                  ? <span className="ac-badge ac-badge-green">Eingereicht</span>
                  : <span className="ac-badge ac-badge-gray">Offen</span>}
              </td>
              <td className="ac-mono" style={{ textAlign:"right", color: (p.kz_65_zahllast || 0) >= 0 ? "var(--a3)" : "var(--accent)" }}>
                {fmtEur(p.kz_65_zahllast)}
              </td>
              <td className="ac-mono">{faelligkeitsDatum(p.periode_bis)}</td>
              <td>
                {p.status !== "eingereicht" && (
                  <button
                    className="ac-btn ac-btn-ghost ac-btn-sm"
                    onClick={() => markEingereicht(p.id)}
                    disabled={marking === p.id}
                    title="Als an ELSTER eingereicht markieren"
                  >
                    {marking === p.id ? "…" : "Eingereicht"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SchnellElster({ von, bis }) {
  const [loading, setLoading] = useState(false);
  const [steuernr, setSteuernr] = useState("");
  const [msg, setMsg] = useState(null);

  const einreichen = async () => {
    if (!steuernr.trim()) { setMsg({ type:"err", text:"Steuernummer eingeben." }); return; }
    setLoading(true); setMsg(null);
    try {
      const resp = await api.post("/api/v1/buchhaltung/export/elster", {
        von, bis, steuernummer: steuernr.trim(), finanzamt_id: "9300",
        zeitraum: String(new Date(von).getMonth()+1).padStart(2,"0"), test_modus: false,
      }, { responseType: "blob" });
      const url = URL.createObjectURL(resp.data);
      const a = document.createElement("a"); a.href=url; a.download=`ELSTER_UStVA_${von.slice(0,7)}.xml`; a.click();
      URL.revokeObjectURL(url);
      setMsg({ type:"ok", text:"ELSTER XML heruntergeladen. Auf elster.de hochladen." });
    } catch { setMsg({ type:"err", text:"Export fehlgeschlagen. Steuernummer prüfen." }); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      background:"rgba(198,255,60,.06)", border:"1px solid rgba(198,255,60,.25)",
      borderRadius:10, padding:"14px 18px", marginBottom:16,
    }}>
      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
        <div style={{ fontWeight:700, fontSize:".9rem" }}>⚡ UStVA in 2 Klicks einreichen</div>
        <span style={{ fontSize:".72rem", padding:"2px 8px", borderRadius:10, background:"rgba(198,255,60,.15)", color:"var(--accent)" }}>D Feature</span>
      </div>
      {msg && <div className={`ac-alert ${msg.type==="ok"?"ac-alert-ok":"ac-alert-err"}`} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>setMsg(null)}>{msg.text}</div>}
      <div style={{ display:"flex", gap:8, alignItems:"flex-end", flexWrap:"wrap" }}>
        <div className="ac-form-col" style={{ flex:2, minWidth:160 }}>
          <label className="ac-label">Steuernummer</label>
          <input className="ac-input ac-mono" value={steuernr} placeholder="21/815/08150"
            onChange={e=>setSteuernr(e.target.value)} />
        </div>
        <button className="ac-btn ac-btn-primary" onClick={einreichen} disabled={loading} style={{background:"var(--accent)",color:"#000"}}>
          {loading ? "…" : "📤 ELSTER XML herunterladen"}
        </button>
      </div>
      <div style={{fontSize:".74rem",color:"var(--ink2)",marginTop:8}}>
        Für Zeitraum {von} – {bis}. XML auf <strong style={{color:"var(--ink)"}}>elster.de</strong> unter Formulare → UStVA → Datei hochladen einreichen.
      </div>
    </div>
  );
}

export default function UstVaTab() {
  const today = new Date();
  const firstOfMonth = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-01`;
  const [von, setVon]               = useState(firstOfMonth);
  const [bis, setBis]               = useState(today.toISOString().slice(0,10));
  const [berechnung, setBerechnung] = useState(null);
  const [perioden, setPerioden]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [periodLoading, setPeriodLoading] = useState(true);
  const [savingPeriod, setSavingPeriod]   = useState(false);
  const [periodMsg, setPeriodMsg]         = useState(null);

  const loadPerioden = useCallback(() => {
    api.get("/api/v1/buchhaltung/ust/perioden")
      .then(r => setPerioden(r.data || [])).catch(() => {}).finally(() => setPeriodLoading(false));
  }, []);
  useEffect(() => { loadPerioden(); }, [loadPerioden]);

  const berechnen = () => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/ust/berechnung", { params: { von, bis } })
      .then(r => setBerechnung(r.data)).catch(() => setBerechnung(null)).finally(() => setLoading(false));
  };

  const savePeriode = async () => {
    setSavingPeriod(true); setPeriodMsg(null);
    try {
      await api.post("/api/v1/buchhaltung/ust/perioden", {
        periode_von: von, periode_bis: bis, art: "monatlich",
      });
      setPeriodMsg({ type:"ok", text:"Periode gespeichert." });
      loadPerioden();
    } catch(e) {
      setPeriodMsg({ type:"err", text: e.response?.data?.detail || "Fehler beim Speichern." });
    } finally { setSavingPeriod(false); }
  };

  const zahllast = berechnung?.kz_65_zahllast || 0;

  return (
    <div>
      <SchnellElster von={von} bis={bis} />
      {!periodLoading && <PeriodStatus perioden={perioden} onReload={loadPerioden} />}
      <div className="ac-card" style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div className="ac-section-title" style={{ marginBottom:0 }}>UStVA berechnen</div>
        </div>
        {periodMsg && (
          <div className={`ac-alert ${periodMsg.type==="ok"?"ac-alert-ok":"ac-alert-err"}`}
            style={{cursor:"pointer",marginBottom:12}} onClick={() => setPeriodMsg(null)}>
            {periodMsg.text}
          </div>
        )}
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Von</label><input className="ac-input" type="date" value={von} onChange={e => setVon(e.target.value)} /></div>
          <div className="ac-form-col"><label className="ac-label">Bis</label><input className="ac-input" type="date" value={bis} onChange={e => setBis(e.target.value)} /></div>
          <button className="ac-btn ac-btn-primary" onClick={berechnen} disabled={loading}>{loading ? "…" : "Berechnen"}</button>
          <button className="ac-btn ac-btn-ghost" onClick={savePeriode} disabled={savingPeriod} title="Periode mit aktueller Berechnung speichern">
            {savingPeriod ? "…" : "Periode speichern"}
          </button>
        </div>
      </div>
      {berechnung && (
        <>
          <div className="ac-kpi-grid" style={{ marginBottom:16 }}>
            <div className="ac-kpi"><div className="ac-kpi-label">Umsatzsteuer gesamt</div><div className="ac-kpi-value pink">{fmtEur((berechnung.kz_41_ust_19 || 0) + (berechnung.kz_44_ust_7 || 0))}</div></div>
            <div className="ac-kpi"><div className="ac-kpi-label">Vorsteuer gesamt</div><div className="ac-kpi-value purple">{fmtEur((berechnung.kz_59_vorsteuer_allgemein || 0) + (berechnung.kz_61_vorsteuer_ig_erwerb || 0))}</div></div>
            <div className="ac-kpi"><div className="ac-kpi-label">Zahllast / Erstattung (KZ 65)</div><div className={`ac-kpi-value ${zahllast >= 0 ? "pink" : "green"}`}>{fmtEur(zahllast)}</div></div>
          </div>
          <div className="ac-card" style={{ padding:0 }}>
            <div style={{ padding:"16px 20px" }}><span className="ac-section-title">Kennzahlen-Ubersicht</span></div>
            <table className="ac-table">
              <thead><tr><th style={{width:60}}>KZ</th><th>Beschreibung</th><th style={{textAlign:"right"}}>Betrag</th></tr></thead>
              <tbody>
                {Object.entries(KZ_BESCHREIBUNG).map(([key, meta]) => {
                  const wert = berechnung[key] || 0;
                  const color = meta.typ === "zahllast" ? (wert >= 0 ? "var(--a3)" : "var(--accent)") : meta.typ === "steuer" ? "var(--a3)" : meta.typ === "vorsteuer" ? "var(--a2)" : "var(--ink)";
                  return (
                    <tr key={key}>
                      <td className="ac-mono" style={{ color:"var(--accent)", fontWeight:700 }}>{meta.kz}</td>
                      <td style={{ fontSize:".85rem" }}>{meta.label}</td>
                      <td className="ac-mono" style={{ textAlign:"right", color, fontWeight: meta.typ==="zahllast" ? 700 : 400 }}>{fmtEur(wert)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="ac-alert ac-alert-warn" style={{ marginTop:16 }}>
            Diese Berechnung dient als Vorbereitung. Bitte mit Steuerberater abstimmen und uber ELSTER einreichen.
          </div>
        </>
      )}
    </div>
  );
}
