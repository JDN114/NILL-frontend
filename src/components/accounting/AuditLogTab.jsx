// src/components/accounting/AuditLogTab.jsx
// GoBD §146 Abs. 4 AO — unveränderlicher Buchungs-Audit-Trail
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("de-DE", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
};

const OP_COLOR = {
  INSERT: "#16a34a",
  UPDATE: "#d97706",
  DELETE: "#dc2626",
};

const TABELLE_LABEL = {
  buchungssaetze:      "Buchungssatz",
  ausgangsrechnungen:  "Ausgangsrechnung",
  invoices:            "Eingangsrechnung",
  konten:              "Konto",
  tagesabschluesse:    "Tagesabschluss",
  mahnungen:           "Mahnung",
  buchungsperioden:    "Buchungsperiode",
  anlagen:             "Anlage",
  ust_perioden:        "UStVA",
  geschaeftspartner:   "Geschäftspartner",
  unternehmensprofil:  "Unternehmensprofil",
};

const S = `
.al-wrap{padding:20px;max-width:1200px;margin:0 auto;}
.al-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:18px;}
.al-title{font-family:Fraunces,serif;font-size:1.2rem;font-weight:700;color:#1c1c2e;}
.al-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:0.72rem;font-weight:700;color:#fff;}
.al-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
.al-filters select,.al-filters input{padding:6px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:0.85rem;background:#fff;color:#1c1c2e;}
.al-filters input{min-width:130px;}
.al-table{width:100%;border-collapse:collapse;font-size:0.83rem;}
.al-table th{background:#f4f6f8;padding:8px 10px;text-align:left;font-weight:600;color:#374151;border-bottom:2px solid #e5e7eb;white-space:nowrap;}
.al-table td{padding:7px 10px;border-bottom:1px solid #f0f0f0;vertical-align:top;color:#374151;}
.al-table tr:hover td{background:#f9fafb;}
.al-detail-btn{background:none;border:none;color:#1a5276;cursor:pointer;font-size:0.8rem;text-decoration:underline;padding:0;}
.al-diff{font-size:0.78rem;font-family:monospace;background:#f8f9fa;border:1px solid #e5e7eb;border-radius:4px;padding:8px 10px;max-height:240px;overflow:auto;white-space:pre-wrap;word-break:break-all;}
.al-diff-key{color:#6b7280;font-weight:600;}
.al-diff-old{color:#dc2626;}
.al-diff-new{color:#16a34a;}
.al-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;}
.al-modal{background:#fff;border-radius:10px;padding:24px;max-width:640px;width:100%;max-height:80vh;overflow-y:auto;}
.al-modal-title{font-family:Fraunces,serif;font-size:1rem;font-weight:700;margin-bottom:16px;color:#1c1c2e;}
.al-modal-close{float:right;background:none;border:none;font-size:1.2rem;cursor:pointer;color:#6b7280;}
.al-empty{text-align:center;color:#9ca3af;padding:40px 0;}
.al-pager{display:flex;align-items:center;gap:8px;margin-top:16px;font-size:0.85rem;}
.al-pager button{padding:4px 12px;border:1px solid #d1d5db;border-radius:6px;background:#fff;cursor:pointer;font-size:0.83rem;}
.al-pager button:disabled{opacity:.4;cursor:default;}
.al-info{font-size:0.78rem;color:#6b7280;margin-top:4px;}
`;

function DiffView({ alteWerte, neueWerte, operation }) {
  if (!alteWerte && !neueWerte) return <p style={{color:"#9ca3af",fontSize:"0.8rem"}}>Keine Wertänderung erfasst.</p>;

  if (operation === "INSERT") {
    return (
      <div className="al-diff">
        {Object.entries(neueWerte || {}).map(([k, v]) => (
          <div key={k}>
            <span className="al-diff-key">{k}: </span>
            <span className="al-diff-new">{JSON.stringify(v)}</span>
          </div>
        ))}
      </div>
    );
  }

  if (operation === "DELETE") {
    return (
      <div className="al-diff">
        {Object.entries(alteWerte || {}).map(([k, v]) => (
          <div key={k}>
            <span className="al-diff-key">{k}: </span>
            <span className="al-diff-old">{JSON.stringify(v)}</span>
          </div>
        ))}
      </div>
    );
  }

  // UPDATE: show only changed keys
  const alt = alteWerte || {};
  const neu = neueWerte || {};
  const allKeys = [...new Set([...Object.keys(alt), ...Object.keys(neu)])];
  const changed = allKeys.filter(k => JSON.stringify(alt[k]) !== JSON.stringify(neu[k]));
  if (!changed.length) return <p style={{color:"#9ca3af",fontSize:"0.8rem"}}>Keine Feldänderungen (Metadaten-Update).</p>;

  return (
    <div className="al-diff">
      {changed.map(k => (
        <div key={k} style={{marginBottom:4}}>
          <span className="al-diff-key">{k}:</span>{" "}
          <span className="al-diff-old">‑ {JSON.stringify(alt[k])}</span>{" "}
          <span className="al-diff-new">+ {JSON.stringify(neu[k])}</span>
        </div>
      ))}
    </div>
  );
}

function DetailModal({ entry, onClose }) {
  if (!entry) return null;
  return (
    <div className="al-modal-overlay" onClick={onClose}>
      <div className="al-modal" onClick={e => e.stopPropagation()}>
        <button className="al-modal-close" onClick={onClose}>✕</button>
        <p className="al-modal-title">
          Audit-Eintrag #{entry.id} —{" "}
          <span className="al-badge" style={{background: OP_COLOR[entry.operation] || "#6b7280"}}>
            {entry.operation}
          </span>{" "}
          {TABELLE_LABEL[entry.tabelle] || entry.tabelle}
        </p>
        <table style={{fontSize:"0.82rem",width:"100%",marginBottom:12}}>
          <tbody>
            <tr><td style={{color:"#6b7280",paddingRight:12,whiteSpace:"nowrap"}}>Datensatz-ID</td><td>{entry.datensatz_id}</td></tr>
            <tr><td style={{color:"#6b7280",paddingRight:12,whiteSpace:"nowrap"}}>Zeitpunkt</td><td>{fmtDate(entry.geaendert_am)}</td></tr>
            {entry.grund && <tr><td style={{color:"#6b7280",paddingRight:12,whiteSpace:"nowrap"}}>Grund</td><td>{entry.grund}</td></tr>}
          </tbody>
        </table>
        <p style={{fontWeight:600,fontSize:"0.83rem",marginBottom:6}}>Änderungen</p>
        <DiffView alteWerte={entry.alte_werte} neueWerte={entry.neue_werte} operation={entry.operation} />
      </div>
    </div>
  );
}

export default function AuditLogTab() {
  const [data, setData]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [detail, setDetail]     = useState(null);
  const [page, setPage]         = useState(0);
  const [filterTabelle, setFilterTabelle] = useState("");
  const [filterOp, setFilterOp]           = useState("");
  const [filterVon, setFilterVon]         = useState("");
  const [filterBis, setFilterBis]         = useState("");

  const PAGE_SIZE = 50;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      if (filterTabelle) params.append("tabelle", filterTabelle);
      if (filterOp)      params.append("operation", filterOp);
      if (filterVon)     params.append("von", filterVon + "T00:00:00");
      if (filterBis)     params.append("bis", filterBis + "T23:59:59");
      const res = await api.get(`/api/v1/buchhaltung/audit-log?${params}`);
      setData(res.data.eintraege || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      setError("Audit-Log konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [page, filterTabelle, filterOp, filterVon, filterBis]);

  useEffect(() => { load(); }, [load]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(0);
    load();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <style>{S}</style>
      <div className="al-wrap">
        <div className="al-header">
          <span className="al-title">GoBD Audit-Log</span>
          <span className="al-info">§146 Abs. 4 AO — unveränderlicher Buchungs-Trail · {total} Einträge gesamt</span>
        </div>

        <form className="al-filters" onSubmit={handleFilter}>
          <select value={filterTabelle} onChange={e => { setFilterTabelle(e.target.value); setPage(0); }}>
            <option value="">Alle Tabellen</option>
            <option value="buchungssaetze">Buchungssätze</option>
            <option value="ausgangsrechnungen">Ausgangsrechnungen</option>
            <option value="invoices">Eingangsrechnungen</option>
            <option value="mahnungen">Mahnungen</option>
            <option value="anlagen">Anlagen</option>
            <option value="buchungsperioden">Buchungsperioden</option>
            <option value="ust_perioden">UStVA</option>
            <option value="geschaeftspartner">Geschäftspartner</option>
            <option value="tagesabschluesse">Tagesabschlüsse</option>
            <option value="unternehmensprofil">Unternehmensprofil</option>
          </select>
          <select value={filterOp} onChange={e => { setFilterOp(e.target.value); setPage(0); }}>
            <option value="">Alle Operationen</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input type="date" value={filterVon} onChange={e => { setFilterVon(e.target.value); setPage(0); }} title="Von" />
          <input type="date" value={filterBis} onChange={e => { setFilterBis(e.target.value); setPage(0); }} title="Bis" />
        </form>

        {error && <p style={{color:"#dc2626",marginBottom:12}}>{error}</p>}

        {loading ? (
          <p className="al-empty">Lade Audit-Log …</p>
        ) : data.length === 0 ? (
          <p className="al-empty">Keine Einträge gefunden.</p>
        ) : (
          <div style={{overflowX:"auto"}}>
            <table className="al-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Zeitpunkt</th>
                  <th>Operation</th>
                  <th>Tabelle</th>
                  <th>Datensatz</th>
                  <th>Grund</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map(e => (
                  <tr key={e.id}>
                    <td style={{color:"#9ca3af",fontSize:"0.76rem"}}>{e.id}</td>
                    <td style={{whiteSpace:"nowrap"}}>{fmtDate(e.geaendert_am)}</td>
                    <td>
                      <span className="al-badge" style={{background: OP_COLOR[e.operation] || "#6b7280"}}>
                        {e.operation}
                      </span>
                    </td>
                    <td>{TABELLE_LABEL[e.tabelle] || e.tabelle}</td>
                    <td style={{fontFamily:"monospace",fontSize:"0.78rem"}}>{e.datensatz_id}</td>
                    <td style={{color:"#6b7280",fontSize:"0.8rem",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {e.grund || "—"}
                    </td>
                    <td>
                      <button className="al-detail-btn" onClick={() => setDetail(e)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="al-pager">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Zurück</button>
            <span>Seite {page + 1} / {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Weiter →</button>
          </div>
        )}

        {detail && <DetailModal entry={detail} onClose={() => setDetail(null)} />}
      </div>
    </>
  );
}
