// src/components/accounting/InvoiceList.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;

const AI_BADGE_STYLE = {
  display:"inline-flex", alignItems:"center", gap:3,
  padding:"1px 6px", borderRadius:99, marginLeft:6,
  fontSize:9, fontFamily:"JetBrains Mono,monospace", letterSpacing:"0.1em",
  background:"rgba(122,92,255,0.12)", border:"1px solid rgba(122,92,255,0.25)",
  color:"rgba(122,92,255,0.8)", verticalAlign:"middle", userSelect:"none",
};

const STATUS_META = {
  paid:    { label:"Bezahlt",    cls:"ac-badge-green"  },
  open:    { label:"Offen",      cls:"ac-badge-gray"   },
  overdue: { label:"Überfällig", cls:"ac-badge-pink"   },
  draft:   { label:"Entwurf",    cls:"ac-badge-gray"   },
  unpaid:  { label:"Offen",      cls:"ac-badge-gray"   },
};

const norm = (inv) => {
  const rawStatus = inv.payment_status || inv.status || "open";
  return {
    ...inv,
    date:   inv.invoice_date || inv.date,
    amount: inv.gross_amount || inv.amount,
    status: rawStatus === "unpaid" ? "open" : rawStatus,
  };
};

// ── Booking Confirm + Edit Modal ───────────────────────────────────────────────
function BookingConfirmModal({ invoice, onClose, onBooked, setMsg }) {
  const [form, setForm] = useState({
    vendor:         invoice.vendor         || "",
    invoice_number: invoice.invoice_number || "",
    invoice_date:   invoice.date           || "",
    net_amount:     invoice.net_amount     != null ? String(invoice.net_amount) : "",
    vat_rate:       invoice.vat_rate       != null ? String(invoice.vat_rate)   : "",
    gross_amount:   invoice.amount         != null ? String(invoice.amount)     : "",
    notes:          invoice.notes          || "",
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handle = async () => {
    setSaving(true); setErr(null);
    try {
      const patch = {};
      if (form.vendor         !== (invoice.vendor         || "")) patch.vendor         = form.vendor;
      if (form.invoice_number !== (invoice.invoice_number || "")) patch.invoice_number  = form.invoice_number;
      if (form.invoice_date   !== (invoice.date           || "")) patch.invoice_date    = form.invoice_date;
      if (form.notes          !== (invoice.notes          || "")) patch.notes           = form.notes;
      const origNet   = invoice.net_amount  != null ? String(invoice.net_amount)  : "";
      const origVat   = invoice.vat_rate    != null ? String(invoice.vat_rate)    : "";
      const origBrutto= invoice.amount      != null ? String(invoice.amount)      : "";
      if (form.net_amount   !== origNet   && form.net_amount)   patch.net_amount   = parseFloat(form.net_amount.replace(",","."));
      if (form.vat_rate     !== origVat   && form.vat_rate)     patch.vat_rate     = parseFloat(form.vat_rate.replace(",","."));
      if (form.gross_amount !== origBrutto && form.gross_amount) patch.gross_amount = parseFloat(form.gross_amount.replace(",","."));

      if (Object.keys(patch).length > 0) {
        await api.patch(`/accounting/invoices/${invoice.id}`, patch);
      }
      await api.post(`/api/v1/buchhaltung/buchungen/auto/${invoice.id}`);
      setMsg({ type:"ok", text:`Rechnung ${form.invoice_number || invoice.id} erfolgreich gebucht.` });
      onBooked();
    } catch(e) {
      setErr(e.response?.data?.detail || "Fehler beim Buchen. Bitte prüfen.");
    } finally {
      setSaving(false);
    }
  };

  const inp = (label, key, type="text", placeholder="") => (
    <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1, minWidth:130 }}>
      <label style={{ fontSize:".73rem", color:"var(--ink2)", fontFamily:"Inter,sans-serif" }}>{label}</label>
      <input
        className="ac-input"
        type={type}
        step={type==="number" ? "0.01" : undefined}
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth:560 }}>
        <div className="ac-modal-title">
          Rechnung prüfen &amp; buchen
        </div>

        {/* GoBD notice */}
        <div style={{
          background:"rgba(198,255,60,0.07)", border:"1px solid rgba(198,255,60,0.2)",
          borderRadius:8, padding:"10px 14px", marginBottom:18,
          fontSize:".78rem", color:"rgba(198,255,60,0.8)", lineHeight:1.55,
        }}>
          <strong>GoBD-Hinweis:</strong> Vor dem Buchen können alle Felder frei bearbeitet werden.
          Nach dem Buchen sind Rechnungsnummer, Datum und Beträge unveränderlich (§146 AO).
        </div>

        {err && (
          <div className="ac-alert ac-alert-err" style={{ marginBottom:14 }}>{err}</div>
        )}

        <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
          {inp("Lieferant", "vendor", "text", "Lieferantenname")}
          {inp("Rechnungsnr.", "invoice_number", "text", "RE-2024-0001")}
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
          {inp("Rechnungsdatum", "invoice_date", "date")}
          {inp("MwSt-Satz (%)", "vat_rate", "number", "19")}
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
          {inp("Nettobetrag (€)", "net_amount", "number", "0,00")}
          {inp("Bruttobetrag (€)", "gross_amount", "number", "0,00")}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:18 }}>
          <label style={{ fontSize:".73rem", color:"var(--ink2)" }}>Notiz</label>
          <input className="ac-input" value={form.notes} onChange={set("notes")} placeholder="Optional…" />
        </div>

        {/* Preview */}
        <div style={{
          background:"var(--surface2)", borderRadius:8, padding:"12px 14px",
          marginBottom:18, fontSize:".82rem",
        }}>
          <div style={{ fontSize:".7rem", color:"var(--ink2)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>
            Buchungsvorschau
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", color:"var(--ink2)", marginBottom:4 }}>
            <span>Netto</span>
            <span className="ac-mono" style={{ color:"var(--ink)" }}>
              {form.net_amount ? fmtEur(parseFloat(form.net_amount)||0) : "—"}
            </span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", color:"var(--ink2)", marginBottom:4 }}>
            <span>MwSt {form.vat_rate ? `(${form.vat_rate} %)` : ""}</span>
            <span className="ac-mono" style={{ color:"var(--ink)" }}>
              {(form.net_amount && form.vat_rate)
                ? fmtEur((parseFloat(form.net_amount)||0) * (parseFloat(form.vat_rate)||0) / 100)
                : "—"}
            </span>
          </div>
          <div style={{
            display:"flex", justifyContent:"space-between", fontWeight:700,
            borderTop:"1px solid var(--border)", paddingTop:8, marginTop:4,
          }}>
            <span>Brutto</span>
            <span className="ac-mono" style={{ color:"var(--accent)" }}>
              {form.gross_amount ? fmtEur(parseFloat(form.gross_amount)||0) : "—"}
            </span>
          </div>
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose} disabled={saving}>
            Abbrechen
          </button>
          <button className="ac-btn ac-btn-primary" onClick={handle} disabled={saving}>
            {saving ? "…" : "Jetzt buchen"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── InvoiceList ────────────────────────────────────────────────────────────────
export default function InvoiceList() {
  const [invoices,    setInvoices]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState("");
  const [statusFilter,setStatusFilter]= useState("all");
  const [sortKey,     setSortKey]     = useState("date");
  const [sortAsc,     setSortAsc]     = useState(false);
  const [msg,         setMsg]         = useState(null);
  const [bookingInv,  setBookingInv]  = useState(null); // invoice being confirmed

  const load = useCallback(() => {
    setLoading(true);
    api.get("/accounting/invoices")
      .then(r => {
        const raw = r.data;
        const list = Array.isArray(raw) ? raw : [];
        setInvoices(list.map(norm));
      })
      .catch(() => setInvoices([]))
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
              return (
                <tr key={inv.id}>
                  <td className="ac-mono" style={{color:"var(--accent)", fontSize:".82rem", whiteSpace:"nowrap"}}>
                    {inv.invoice_number || <span style={{color:"var(--ink2)",fontStyle:"italic"}}>—</span>}
                  </td>
                  <td style={{maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                    {inv.vendor || inv.description || "—"}
                    {inv.ai_status === "completed" && (
                      <span style={AI_BADGE_STYLE} title="KI-verarbeitet">◈ KI</span>
                    )}
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
                        onClick={() => setBookingInv(inv)}
                        title="Rechnung prüfen und buchen"
                      >
                        Buchen
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

      {bookingInv && (
        <BookingConfirmModal
          invoice={bookingInv}
          onClose={() => setBookingInv(null)}
          onBooked={() => { setBookingInv(null); load(); }}
          setMsg={setMsg}
        />
      )}
    </div>
  );
}
