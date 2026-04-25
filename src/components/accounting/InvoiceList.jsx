// src/components/accounting/InvoiceList.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;

const STATUS_META = {
  paid:    { label:"Bezahlt",    cls:"ac-badge-green"  },
  open:    { label:"Offen",      cls:"ac-badge-gray"   },
  overdue: { label:"Überfällig", cls:"ac-badge-pink"   },
  draft:   { label:"Entwurf",    cls:"ac-badge-gray"   },
  unpaid:  { label:"Offen",      cls:"ac-badge-gray"   },
};

const norm = (inv) => ({
  ...inv,
  date:   inv.invoice_date || inv.date,
  amount: inv.gross_amount || inv.amount,
  status: inv.payment_status || inv.status || "open",
});

export default function InvoiceList() {
  const [invoices,    setInvoices]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState("");
  const [statusFilter,setStatusFilter]= useState("all");
  const [sortKey,     setSortKey]     = useState("date");
  const [sortAsc,     setSortAsc]     = useState(false);
  const [msg,         setMsg]         = useState(null);
  const [bookingIds,  setBookingIds]  = useState(new Set());

  const load = useCallback(() => {
    setLoading(true);
    api.get("/accounting/invoices")
      .then(r => setInvoices((r.data || []).map(norm)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const markPaid = async (id) => {
    try {
      await api.post(`/accounting/invoices/${id}/mark-paid`);
      setMsg({ type:"ok", text:"Rechnung als bezahlt markiert." });
      load();
    } catch(e) {
      setMsg({ type:"err", text:"Fehler beim Aktualisieren." });
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm("Rechnung wirklich löschen?")) return;
    try {
      await api.delete(`/accounting/invoices/${id}`);
      setMsg({ type:"ok", text:"Rechnung gelöscht." });
      load();
    } catch(e) {
      setMsg({ type:"err", text:"Fehler beim Löschen." });
    }
  };

  const autoBook = async (invoice) => {
    setBookingIds(s => new Set(s).add(invoice.id));
    try {
      await api.post(`/api/v1/buchhaltung/buchungen/auto/${invoice.id}`);
      setMsg({ type:"ok", text:`Rechnung ${invoice.invoice_number || invoice.id} automatisch gebucht.` });
    } catch(e) {
      setMsg({ type:"err", text: e.response?.data?.detail || "Automatikbuchung fehlgeschlagen." });
    } finally {
      setBookingIds(s => { const n = new Set(s); n.delete(invoice.id); return n; });
    }
  };

  const sorted = useMemo(() => {
    let list = invoices.filter(inv => {
      const matchText = !filter ||
        (inv.vendor || "").toLowerCase().includes(filter.toLowerCase()) ||
        (inv.invoice_number || "").toLowerCase().includes(filter.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchText && matchStatus;
    });
    list = [...list].sort((a, b) => {
      let va = a[sortKey] ?? "";
      let vb = b[sortKey] ?? "";
      if (sortKey === "amount" || sortKey === "net_amount") {
        va = Number(va); vb = Number(vb);
      }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ?  1 : -1;
      return 0;
    });
    return list;
  }, [invoices, filter, statusFilter, sortKey, sortAsc]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const th = (key, label, right) => (
    <th
      style={{ cursor:"pointer", userSelect:"none", textAlign: right ? "right" : "left" }}
      onClick={() => toggleSort(key)}
    >
      {label}{" "}
      {sortKey === key
        ? (sortAsc ? "▲" : "▼")
        : <span style={{ opacity:0.25 }}>↕</span>}
    </th>
  );

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Rechnungen…</div>;

  const totalOpen = invoices
    .filter(i => i.status !== "paid")
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  return (
    <div>
      {msg && (
        <div className={`ac-alert ${msg.type==="ok"?"ac-alert-ok":"ac-alert-err"}`}
          style={{cursor:"pointer"}} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <input className="ac-input" style={{ maxWidth:260 }} placeholder="Suche (Lieferant, Nr.)…"
          value={filter} onChange={e => setFilter(e.target.value)} />
        <select className="ac-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Alle Status</option>
          <option value="open">Offen</option>
          <option value="paid">Bezahlt</option>
          <option value="overdue">Überfällig</option>
          <option value="draft">Entwurf</option>
        </select>
        <span style={{ color:"var(--ink2)", fontSize:".85rem", marginLeft:"auto" }}>
          Offen: <strong style={{color:"var(--a3)"}}>{fmtEur(totalOpen)}</strong>
        </span>
      </div>

      <div className="ac-card" style={{ padding:0 }}>
        <table className="ac-table">
          <thead>
            <tr>
              {th("invoice_number","Nr.")}
              {th("vendor","Lieferant")}
              {th("date","Datum")}
              {th("net_amount","Netto", true)}
              {th("vat_rate","MwSt", true)}
              {th("amount","Brutto", true)}
              {th("status","Status")}
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={8} className="ac-empty">Keine Rechnungen gefunden.</td></tr>
            )}
            {sorted.map(inv => {
              const meta = STATUS_META[inv.status] || STATUS_META.open;
              const booking = bookingIds.has(inv.id);
              return (
                <tr key={inv.id}>
                  <td className="ac-mono" style={{color:"var(--accent)", fontSize:".82rem", whiteSpace:"nowrap"}}>
                    {inv.invoice_number || <span style={{color:"var(--ink2)",fontStyle:"italic"}}>—</span>}
                  </td>
                  <td style={{maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                    {inv.vendor || inv.description || "—"}
                  </td>
                  <td className="ac-mono" style={{whiteSpace:"nowrap"}}>{inv.date || "—"}</td>
                  <td className="ac-mono" style={{textAlign:"right", color:"var(--ink2)"}}>
                    {inv.net_amount ? fmtEur(inv.net_amount) : "—"}
                  </td>
                  <td className="ac-mono" style={{textAlign:"right", color:"var(--ink2)", whiteSpace:"nowrap"}}>
                    {inv.vat_rate != null ? `${Number(inv.vat_rate).toFixed(0)} %` : "—"}
                  </td>
                  <td className="ac-mono" style={{textAlign:"right", fontWeight:600}}>{fmtEur(inv.amount)}</td>
                  <td><span className={`ac-badge ${meta.cls}`}>{meta.label}</span></td>
                  <td>
                    <div style={{ display:"flex", gap:4 }}>
                      {inv.status !== "paid" && inv.payment_status !== "paid" && (
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => markPaid(inv.id)}>
                          ✓ Bezahlt
                        </button>
                      )}
                      <button
                        className="ac-btn ac-btn-ghost ac-btn-sm"
                        onClick={() => autoBook(inv)}
                        disabled={booking}
                        title="Automatisch in die Buchhaltung buchen"
                      >
                        {booking ? "…" : "Buchen"}
                      </button>
                      <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => deleteInvoice(inv.id)}>
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
