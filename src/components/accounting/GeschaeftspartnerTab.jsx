// src/components/accounting/GeschaeftspartnerTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} EUR`;

const MAHNSTUFEN = {
  "erste":   { label: "1. Mahnung",  color: "ac-badge-gray"   },
  "zweite":  { label: "2. Mahnung",  color: "ac-badge-purple" },
  "dritte":  { label: "3. Mahnung",  color: "ac-badge-pink"   },
  "inkasso": { label: "Inkasso",     color: "ac-badge-pink"   },
};

function NeuPartnerModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    nummer: "", firmenname: "", ist_debitor: true, ist_kreditor: false,
    strasse: "", plz: "", ort: "", land: "DE", email: "", ust_id: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.nummer) return;
    setLoading(true);
    try { await api.post("/api/v1/buchhaltung/geschaeftspartner", form); onSaved(); onClose(); }
    catch(e) { alert(e.response?.data?.detail || "Fehler"); }
    finally { setLoading(false); }
  };
  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal">
        <div className="ac-modal-title">Geschaftspartner anlegen</div>
        <div className="ac-form-row">
          <div className="ac-form-col" style={{ maxWidth:130 }}><label className="ac-label">Nummer *</label><input className="ac-input ac-mono" value={form.nummer} placeholder="KD-001" onChange={e => set("nummer", e.target.value)} /></div>
          <div className="ac-form-col" style={{ flex:2 }}><label className="ac-label">Firmenname</label><input className="ac-input" value={form.firmenname} onChange={e => set("firmenname", e.target.value)} /></div>
        </div>
        <div className="ac-form-row" style={{ gap:24 }}>
          <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:".9rem" }}>
            <input type="checkbox" checked={form.ist_debitor} onChange={e => set("ist_debitor", e.target.checked)} />
            Debitor (Kunde)
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:".9rem" }}>
            <input type="checkbox" checked={form.ist_kreditor} onChange={e => set("ist_kreditor", e.target.checked)} />
            Kreditor (Lieferant)
          </label>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col" style={{ flex:2 }}><label className="ac-label">Strasse</label><input className="ac-input" value={form.strasse} onChange={e => set("strasse", e.target.value)} /></div>
          <div className="ac-form-col" style={{ maxWidth:100 }}><label className="ac-label">PLZ</label><input className="ac-input" value={form.plz} onChange={e => set("plz", e.target.value)} maxLength={10} /></div>
          <div className="ac-form-col"><label className="ac-label">Ort</label><input className="ac-input" value={form.ort} onChange={e => set("ort", e.target.value)} /></div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Land</label><input className="ac-input" value={form.land} onChange={e => set("land", e.target.value)} maxLength={2} /></div>
          <div className="ac-form-col"><label className="ac-label">E-Mail</label><input className="ac-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} /></div>
          <div className="ac-form-col"><label className="ac-label">USt-ID</label><input className="ac-input ac-mono" value={form.ust_id} onChange={e => set("ust_id", e.target.value)} placeholder="DE123456789" /></div>
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={loading || !form.nummer}>{loading ? "..." : "Anlegen"}</button>
        </div>
      </div>
    </div>
  );
}

function MahnungModal({ partner, onClose, onSaved }) {
  const today = new Date().toISOString().slice(0, 10);
  const defaultFaellig = new Date(Date.now() + 14*24*60*60*1000).toISOString().slice(0, 10);
  const [form, setForm] = useState({
    mahnstufe: "erste", gesamtbetrag_offen: "", faelligkeitsdatum: defaultFaellig,
    mahnungsdatum: today, mahngebuehr: "0",
  });
  const [loading, setLoading] = useState(false);
  const save = async () => {
    setLoading(true);
    try {
      await api.post("/api/v1/buchhaltung/mahnungen", {
        geschaeftspartner_id: partner.id,
        mahnstufe:            form.mahnstufe,
        mahnungsdatum:        form.mahnungsdatum,
        faelligkeitsdatum:    form.faelligkeitsdatum,
        gesamtbetrag_offen:   parseFloat(form.gesamtbetrag_offen || 0),
        mahngebuehr:          parseFloat(form.mahngebuehr || 0),
        zinsen:               0,
      });
      onSaved(); onClose();
    } catch(e) { alert(e.response?.data?.detail || "Fehler"); }
    finally { setLoading(false); }
  };
  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal">
        <div className="ac-modal-title">Mahnung erstellen - {partner.firmenname || partner.nummer}</div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Mahnstufe</label>
            <select className="ac-select" value={form.mahnstufe} onChange={e => setForm(f => ({...f, mahnstufe: e.target.value}))}>
              <option value="erste">1. Mahnung (freundlich)</option>
              <option value="zweite">2. Mahnung (mit Frist)</option>
              <option value="dritte">3. Mahnung (letzte)</option>
              <option value="inkasso">Inkasso</option>
            </select>
          </div>
          <div className="ac-form-col"><label className="ac-label">Offener Betrag (EUR)</label><input className="ac-input ac-mono" type="number" step="0.01" value={form.gesamtbetrag_offen} onChange={e => setForm(f => ({...f, gesamtbetrag_offen: e.target.value}))} /></div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col"><label className="ac-label">Mahndatum</label><input className="ac-input" type="date" value={form.mahnungsdatum} onChange={e => setForm(f => ({...f, mahnungsdatum: e.target.value}))} /></div>
          <div className="ac-form-col"><label className="ac-label">Falligkeitsdatum</label><input className="ac-input" type="date" value={form.faelligkeitsdatum} onChange={e => setForm(f => ({...f, faelligkeitsdatum: e.target.value}))} /></div>
          <div className="ac-form-col"><label className="ac-label">Mahngebuhr (EUR)</label><input className="ac-input ac-mono" type="number" step="0.01" value={form.mahngebuehr} onChange={e => setForm(f => ({...f, mahngebuehr: e.target.value}))} /></div>
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={loading}>{loading ? "..." : "Mahnung erstellen"}</button>
        </div>
      </div>
    </div>
  );
}

export default function GeschaeftspartnerTab() {
  const [partner, setPartner]     = useState([]);
  const [mahnungen, setMahnungen] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showNew, setShowNew]     = useState(false);
  const [mahnPartner, setMahnPartner] = useState(null);
  const [subtab, setSubtab]       = useState("partner");
  const [filter, setFilter]       = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/v1/buchhaltung/geschaeftspartner"),
      api.get("/api/v1/buchhaltung/mahnungen"),
    ]).then(([p, m]) => {
      setPartner(p.data || []);
      setMahnungen(m.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = partner.filter(p => !filter || (p.firmenname || "").toLowerCase().includes(filter.toLowerCase()) || (p.nummer || "").toLowerCase().includes(filter.toLowerCase()) || (p.ort || "").toLowerCase().includes(filter.toLowerCase()));

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Geschaftspartner...</div>;

  return (
    <div>
      <div style={{ display:"flex", gap:4, marginBottom:16 }}>
        {["partner","mahnwesen"].map(s => (
          <button key={s} className={`ac-btn ${subtab===s?"ac-btn-primary":"ac-btn-ghost"}`} onClick={() => setSubtab(s)}>
            {s==="partner" ? "Geschaftspartner" : `Mahnwesen (${mahnungen.length})`}
          </button>
        ))}
      </div>
      {subtab === "partner" && (
        <>
          <div style={{ display:"flex", gap:12, marginBottom:16, alignItems:"center" }}>
            <input className="ac-input" style={{ maxWidth:300 }} placeholder="Suche..." value={filter} onChange={e => setFilter(e.target.value)} />
            <div style={{ flex:1 }} />
            <button className="ac-btn ac-btn-primary" onClick={() => setShowNew(true)}>+ Partner</button>
          </div>
          <div className="ac-card" style={{ padding:0 }}>
            <table className="ac-table">
              <thead><tr><th>Name / Firma</th><th>Typ</th><th>Ort</th><th>Land</th><th>USt-ID</th><th>E-Mail</th><th></th></tr></thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={7} className="ac-empty">Noch keine Geschaftspartner angelegt.</td></tr>}
                {filtered.map(p => {
                  const typ = p.ist_debitor && p.ist_kreditor ? "beide" : p.ist_debitor ? "debitor" : "kreditor";
                  return (
                  <tr key={p.id}>
                    <td style={{ fontWeight:500 }}>{p.firmenname || p.nummer}</td>
                    <td><span className={`ac-badge ${typ==="debitor"?"ac-badge-green":typ==="kreditor"?"ac-badge-purple":"ac-badge-gray"}`}>{typ}</span></td>
                    <td>{p.ort || "--"}</td>
                    <td className="ac-mono">{p.land || "DE"}</td>
                    <td className="ac-mono" style={{ color:"var(--ink2)", fontSize:".8rem" }}>{p.ust_id || "--"}</td>
                    <td style={{ fontSize:".82rem" }}>{p.email || "--"}</td>
                    <td>
                      {p.ist_debitor ? (
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setMahnPartner(p)}>Mahnen</button>
                      ) : null}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {subtab === "mahnwesen" && (
        <div className="ac-card" style={{ padding:0 }}>
          <table className="ac-table">
            <thead><tr><th>Geschaftspartner</th><th>Mahnstufe</th><th>Mahndatum</th><th>Falligkeit</th><th style={{textAlign:"right"}}>Betrag</th><th style={{textAlign:"right"}}>Gebuhr</th><th>Status</th></tr></thead>
            <tbody>
              {mahnungen.length === 0 && <tr><td colSpan={7} className="ac-empty">Keine Mahnungen vorhanden.</td></tr>}
              {mahnungen.map(m => {
                const stufe = MAHNSTUFEN[m.mahnstufe] || { label: m.mahnstufe, color: "ac-badge-gray" };
                return (
                  <tr key={m.id}>
                    <td>{m.geschaeftspartner_name || m.geschaeftspartner_id}</td>
                    <td><span className={`ac-badge ${stufe.color}`}>{stufe.label}</span></td>
                    <td className="ac-mono">{m.mahnungsdatum}</td>
                    <td className="ac-mono">{m.faelligkeitsdatum || "--"}</td>
                    <td className="ac-mono" style={{textAlign:"right"}}>{fmtEur(m.gesamtbetrag_offen)}</td>
                    <td className="ac-mono" style={{textAlign:"right", color:"var(--ink2)"}}>{fmtEur(m.mahngebuehr)}</td>
                    <td>{m.bezahlt ? <span className="ac-badge ac-badge-green">Bezahlt</span> : <span className="ac-badge ac-badge-gray">Offen</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {showNew && <NeuPartnerModal onClose={() => setShowNew(false)} onSaved={load} />}
      {mahnPartner && <MahnungModal partner={mahnPartner} onClose={() => setMahnPartner(null)} onSaved={load} />}
    </div>
  );
}
