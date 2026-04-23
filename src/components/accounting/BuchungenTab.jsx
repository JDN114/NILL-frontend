// src/components/accounting/BuchungenTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmt    = (n) => Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtEur = (n) => `${fmt(n)} EUR`;

const UST_OPTIONS = [
  { value: "",             label: "Kein Kennzeichen" },
  { value: "ust_19",       label: "USt 19%" },
  { value: "ust_7",        label: "USt 7%" },
  { value: "kein_ust",     label: "Steuerfrei §4 UStG" },
  { value: "ig_lieferung", label: "ig-Lieferung §4 Nr. 1b" },
  { value: "ig_erwerb",    label: "ig-Erwerb" },
  { value: "reverse_charge", label: "Reverse Charge §13b" },
  { value: "drittland",    label: "Drittland §6" },
  { value: "oss",          label: "OSS §18j" },
];

function NeuBuchungModal({ konten, perioden, onClose, onSaved }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    buchungsdatum: today, buchungstext: "", beleg_nummer: "",
    periode_id: perioden[0]?.id || "", buchungstyp: "standard",
  });
  const [zeilen, setZeilen] = useState([
    { konto_id: "", soll: "", haben: "", ust_kennzeichen: "" },
    { konto_id: "", soll: "", haben: "", ust_kennzeichen: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sollSumme  = zeilen.reduce((s, z) => s + parseFloat(z.soll  || 0), 0);
  const habenSumme = zeilen.reduce((s, z) => s + parseFloat(z.haben || 0), 0);
  const balanced   = Math.abs(sollSumme - habenSumme) < 0.005;

  const addZeile    = () => setZeilen(z => [...z, { konto_id: "", soll: "", haben: "", ust_kennzeichen: "" }]);
  const removeZeile = (i) => setZeilen(z => z.filter((_, idx) => idx !== i));
  const setZeile    = (i, key, val) => setZeilen(z => z.map((row, idx) => idx === i ? { ...row, [key]: val } : row));

  const save = async () => {
    setError("");
    if (!balanced) { setError("Soll != Haben - Buchungssatz nicht ausgeglichen."); return; }
    if (zeilen.some(z => !z.konto_id)) { setError("Alle Zeilen brauchen ein Konto."); return; }
    setLoading(true);
    try {
      await api.post("/api/v1/buchhaltung/buchungen", {
        ...form,
        periode_id: form.periode_id || null,
        zeilen: zeilen.map(z => ({
          konto_id: z.konto_id,
          soll:  parseFloat(z.soll  || 0),
          haben: parseFloat(z.haben || 0),
          ust_kennzeichen: z.ust_kennzeichen || null,
        })),
      });
      onSaved(); onClose();
    } catch (e) {
      setError(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setLoading(false); }
  };

  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal" style={{ maxWidth: 680 }}>
        <div className="ac-modal-title">Neuer Buchungssatz</div>
        {error && <div className="ac-alert ac-alert-err">{error}</div>}
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Buchungsdatum</label>
            <input className="ac-input" type="date" value={form.buchungsdatum}
              onChange={e => setForm(f => ({ ...f, buchungsdatum: e.target.value }))} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Beleg-Nr.</label>
            <input className="ac-input" value={form.beleg_nummer} placeholder="RE-2024-001"
              onChange={e => setForm(f => ({ ...f, beleg_nummer: e.target.value }))} />
          </div>
          <div className="ac-form-col" style={{ flex: 2 }}>
            <label className="ac-label">Buchungstext</label>
            <input className="ac-input" value={form.buchungstext} placeholder="Beschreibung..."
              onChange={e => setForm(f => ({ ...f, buchungstext: e.target.value }))} />
          </div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Periode</label>
            <select className="ac-select" value={form.periode_id}
              onChange={e => setForm(f => ({ ...f, periode_id: e.target.value }))}>
              {perioden.map(p => (
                <option key={p.id} value={p.id}>{p.bezeichnung || `${p.monat}/${p.jahr}`}</option>
              ))}
            </select>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Typ</label>
            <select className="ac-select" value={form.buchungstyp}
              onChange={e => setForm(f => ({ ...f, buchungstyp: e.target.value }))}>
              <option value="standard">Standard</option>
              <option value="eingangsrechnung">Eingangsrechnung</option>
              <option value="ausgangsrechnung">Ausgangsrechnung</option>
              <option value="zahlung">Zahlung</option>
              <option value="abschreibung">Abschreibung</option>
              <option value="umbuchung">Umbuchung</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span className="ac-label">Buchungszeilen</span>
            <span style={{ fontSize:".8rem", color: balanced ? "var(--accent)" : "var(--a3)" }}>
              Soll: {fmt(sollSumme)} | Haben: {fmt(habenSumme)} {balanced ? "OK" : "X"}
            </span>
          </div>
          {zeilen.map((z, i) => (
            <div key={i} className="ac-form-row" style={{ marginBottom: 8 }}>
              <div className="ac-form-col" style={{ flex: 3 }}>
                <select className="ac-select" value={z.konto_id}
                  onChange={e => setZeile(i, "konto_id", e.target.value)}>
                  <option value="">-- Konto wahlen --</option>
                  {konten.map(k => (
                    <option key={k.id} value={k.id}>{k.kontonummer} - {k.bezeichnung}</option>
                  ))}
                </select>
              </div>
              <div className="ac-form-col">
                <input className="ac-input ac-mono" placeholder="Soll" type="number" step="0.01"
                  value={z.soll} onChange={e => setZeile(i, "soll", e.target.value)} />
              </div>
              <div className="ac-form-col">
                <input className="ac-input ac-mono" placeholder="Haben" type="number" step="0.01"
                  value={z.haben} onChange={e => setZeile(i, "haben", e.target.value)} />
              </div>
              <div className="ac-form-col" style={{ flex: 2 }}>
                <select className="ac-select" value={z.ust_kennzeichen}
                  onChange={e => setZeile(i, "ust_kennzeichen", e.target.value)}>
                  {UST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => removeZeile(i)}
                disabled={zeilen.length <= 2}>x</button>
            </div>
          ))}
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={addZeile}>+ Zeile</button>
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={loading || !balanced}>
            {loading ? "..." : "Buchen"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuchungenTab() {
  const [buchungen, setBuchungen] = useState([]);
  const [konten, setKonten]       = useState([]);
  const [perioden, setPerioden]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded]   = useState({});
  const [filter, setFilter]       = useState("");
  const [msg, setMsg]             = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/v1/buchhaltung/buchungen"),
      api.get("/api/v1/buchhaltung/konten"),
      api.get("/api/v1/buchhaltung/perioden"),
    ]).then(([b, k, p]) => {
      setBuchungen(b.data || []);
      setKonten(k.data || []);
      setPerioden(p.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const storno = async (id) => {
    if (!window.confirm("Buchungssatz stornieren?")) return;
    try {
      await api.post(`/api/v1/buchhaltung/buchungen/${id}/storno`);
      setMsg({ type: "ok", text: "Storno-Buchung erstellt." });
      load();
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Storno fehlgeschlagen." });
    }
  };

  const filtered = buchungen.filter(b =>
    !filter ||
    (b.buchungstext || "").toLowerCase().includes(filter.toLowerCase()) ||
    (b.beleg_nummer || "").toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Journal...</div>;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <input className="ac-input" style={{ maxWidth: 300 }} placeholder="Suche (Text, Belegnr.)..."
          value={filter} onChange={e => setFilter(e.target.value)} />
        <button className="ac-btn ac-btn-primary" onClick={() => setShowModal(true)}>+ Buchungssatz</button>
      </div>
      {msg && (
        <div className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
          style={{ cursor:"pointer" }} onClick={() => setMsg(null)}>{msg.text}</div>
      )}
      <div className="ac-card" style={{ padding: 0 }}>
        <table className="ac-table">
          <thead>
            <tr><th>Datum</th><th>Beleg</th><th>Text</th><th>Typ</th><th style={{textAlign:"right"}}>Betrag</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="ac-empty">Keine Buchungen gefunden.</td></tr>
            )}
            {filtered.map(b => (
              <React.Fragment key={b.id}>
                <tr style={{ cursor:"pointer" }} onClick={() => setExpanded(e => ({ ...e, [b.id]: !e[b.id] }))}>
                  <td className="ac-mono">{b.buchungsdatum}</td>
                  <td className="ac-mono" style={{ color:"var(--ink2)" }}>{b.beleg_nummer || "--"}</td>
                  <td>{b.buchungstext || "--"}</td>
                  <td>
                    <span className="ac-badge ac-badge-gray">{b.buchungstyp}</span>
                    {b.ist_storno && <span className="ac-badge ac-badge-pink" style={{marginLeft:4}}>STORNO</span>}
                  </td>
                  <td className="ac-mono" style={{ textAlign:"right" }}>{fmtEur(b.betrag)}</td>
                  <td>
                    {b.festgeschrieben
                      ? <span className="ac-badge ac-badge-green">Fest</span>
                      : <span className="ac-badge ac-badge-gray">Offen</span>}
                  </td>
                  <td>
                    {!b.festgeschrieben && !b.ist_storno && (
                      <button className="ac-btn ac-btn-danger ac-btn-sm"
                        onClick={e => { e.stopPropagation(); storno(b.id); }}>Storno</button>
                    )}
                  </td>
                </tr>
                {expanded[b.id] && b.zeilen?.length > 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "0 0 0 32px" }}>
                      <table className="ac-table" style={{ fontSize:".8rem", margin:"8px 0" }}>
                        <thead><tr><th>Konto</th><th style={{textAlign:"right"}}>Soll</th><th style={{textAlign:"right"}}>Haben</th><th>USt-Kennzeichen</th></tr></thead>
                        <tbody>
                          {b.zeilen.map(z => (
                            <tr key={z.id}>
                              <td className="ac-mono">{z.konto_id}</td>
                              <td className="ac-mono" style={{ textAlign:"right", color: z.soll > 0 ? "var(--accent)" : "var(--ink2)" }}>
                                {z.soll > 0 ? fmtEur(z.soll) : "--"}
                              </td>
                              <td className="ac-mono" style={{ textAlign:"right", color: z.haben > 0 ? "var(--a2)" : "var(--ink2)" }}>
                                {z.haben > 0 ? fmtEur(z.haben) : "--"}
                              </td>
                              <td style={{ color:"var(--ink2)" }}>{z.ust_kennzeichen || "--"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <NeuBuchungModal konten={konten} perioden={perioden}
          onClose={() => setShowModal(false)} onSaved={load} />
      )}
    </div>
  );
}
