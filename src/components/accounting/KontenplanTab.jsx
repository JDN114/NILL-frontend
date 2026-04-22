// src/components/accounting/KontenplanTab.jsx
// SKR03 chart of accounts grouped by class
import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";

const KLASSEN = {
  "0": "Klasse 0 – Anlagevermögen",
  "1": "Klasse 1 – Umlaufvermögen",
  "2": "Klasse 2 – Eigenkapital",
  "3": "Klasse 3 – Verbindlichkeiten",
  "4": "Klasse 4 – Betriebliche Aufwendungen",
  "5": "Klasse 5 – Wareneinsatz",
  "6": "Klasse 6 – Sonstige Kosten",
  "7": "Klasse 7 – Erträge (Sonderposten)",
  "8": "Klasse 8 – Erlöse / Erträge",
  "9": "Klasse 9 – Vor- und Abschlusskonten",
};

const KONTOART_BADGE = {
  "aktiv":         "ac-badge-green",
  "passiv":        "ac-badge-purple",
  "ertrag":        "ac-badge-green",
  "aufwand":       "ac-badge-pink",
  "kasse":         "ac-badge-gray",
  "bank":          "ac-badge-gray",
};

export default function KontenplanTab() {
  const [konten, setKonten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newKonto, setNewKonto] = useState({ kontonummer: "", bezeichnung: "", kontoart: "aufwand" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/konten")
      .then(r => setKonten(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!filter) return konten;
    const q = filter.toLowerCase();
    return konten.filter(k =>
      k.kontonummer.includes(q) ||
      (k.bezeichnung || "").toLowerCase().includes(q)
    );
  }, [konten, filter]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(k => {
      const cls = k.kontonummer[0] || "?";
      if (!g[cls]) g[cls] = [];
      g[cls].push(k);
    });
    return g;
  }, [filtered]);

  const save = async () => {
    if (!newKonto.kontonummer || !newKonto.bezeichnung) return;
    setSaving(true);
    try {
      await api.post("/api/v1/buchhaltung/konten", newKonto);
      setShowModal(false);
      setNewKonto({ kontonummer: "", bezeichnung: "", kontoart: "aufwand" });
      load();
    } catch (e) {
      alert(e.response?.data?.detail || "Fehler");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Kontenplan…</div>;

  return (
    <div>
      <div style={{ display:"flex", gap:12, marginBottom:16, alignItems:"center" }}>
        <input className="ac-input" style={{ maxWidth:300 }} placeholder="Suche (Nr. oder Bezeichnung)…"
          value={filter} onChange={e => setFilter(e.target.value)} />
        <span style={{ color:"var(--ink2)", fontSize:".85rem" }}>{konten.length} Konten</span>
        <div style={{ flex:1 }} />
        <button className="ac-btn ac-btn-primary" onClick={() => setShowModal(true)}>+ Konto</button>
      </div>

      {Object.keys(grouped).sort().map(cls => (
        <div key={cls} className="ac-card" style={{ marginBottom:12, padding:0 }}>
          <div
            style={{ padding:"14px 20px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}
            onClick={() => setExpanded(e => ({ ...e, [cls]: !e[cls] }))}
          >
            <span style={{ fontFamily:"Fraunces,serif", fontWeight:600 }}>
              {KLASSEN[cls] || `Klasse ${cls}`}
            </span>
            <span style={{ color:"var(--ink2)", fontSize:".8rem" }}>
              {grouped[cls].length} Konten {expanded[cls] ? "▲" : "▼"}
            </span>
          </div>
          {(expanded[cls] !== false && cls in expanded ? expanded[cls] : true) && (
            <table className="ac-table">
              <thead>
                <tr>
                  <th style={{width:100}}>Nr.</th>
                  <th>Bezeichnung</th>
                  <th>Art</th>
                  <th style={{textAlign:"right"}}>Saldo</th>
                  <th>USt</th>
                </tr>
              </thead>
              <tbody>
                {grouped[cls].map(k => (
                  <tr key={k.id}>
                    <td className="ac-mono" style={{ color:"var(--accent)" }}>{k.kontonummer}</td>
                    <td>{k.bezeichnung}</td>
                    <td>
                      <span className={`ac-badge ${KONTOART_BADGE[k.kontoart] || "ac-badge-gray"}`}>
                        {k.kontoart}
                      </span>
                    </td>
                    <td className="ac-mono" style={{ textAlign:"right", color:"var(--ink2)" }}>
                      {k.saldo !== undefined ? `${Number(k.saldo).toLocaleString("de-DE",{minimumFractionDigits:2})} €` : "—"}
                    </td>
                    <td style={{ fontSize:".75rem", color:"var(--ink2)" }}>
                      {k.ust_schluessel || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      {showModal && (
        <div className="ac-modal-backdrop">
          <div className="ac-modal">
            <div className="ac-modal-title">Neues Konto anlegen</div>
            <div className="ac-form-col" style={{ marginBottom:12 }}>
              <label className="ac-label">Kontonummer (SKR03)</label>
              <input className="ac-input ac-mono" value={newKonto.kontonummer}
                onChange={e => setNewKonto(n => ({ ...n, kontonummer: e.target.value }))}
                placeholder="z.B. 4820" maxLength={8} />
            </div>
            <div className="ac-form-col" style={{ marginBottom:12 }}>
              <label className="ac-label">Bezeichnung</label>
              <input className="ac-input" value={newKonto.bezeichnung}
                onChange={e => setNewKonto(n => ({ ...n, bezeichnung: e.target.value }))}
                placeholder="Kontobeschreibung" />
            </div>
            <div className="ac-form-col" style={{ marginBottom:20 }}>
              <label className="ac-label">Kontoart</label>
              <select className="ac-select" value={newKonto.kontoart}
                onChange={e => setNewKonto(n => ({ ...n, kontoart: e.target.value }))}>
                <option value="aktiv">Aktiv</option>
                <option value="passiv">Passiv</option>
                <option value="ertrag">Ertrag</option>
                <option value="aufwand">Aufwand</option>
                <option value="bank">Bank</option>
                <option value="kasse">Kasse</option>
              </select>
            </div>
            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-ghost" onClick={() => setShowModal(false)}>Abbrechen</button>
              <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
                {saving ? "…" : "Anlegen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
