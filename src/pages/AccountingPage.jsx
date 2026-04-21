// src/pages/AccountingPage.jsx
import { useEffect, useState, useMemo } from "react";
import PageLayout from "../components/layout/PageLayout";
import InvoiceList from "../components/accounting/InvoiceList";
import BankInsights from "../components/accounting/BankInsights";
import TaxDashboard from "../components/accounting/TaxDashboard";
import ReceiptUploadModal from "../components/accounting/ReceiptUpload";
import api from "../services/api";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Area, AreaChart,
} from "recharts";

/* ─── Design tokens ─────────────────────────────────────────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .ac { --bg:#040407;--bg2:#08080c;--ink:#efede7;--ink-dim:rgba(239,237,231,.5);--ink-faint:rgba(239,237,231,.12);--line:rgba(239,237,231,.07);--glass:rgba(255,255,255,.035);--accent:#c6ff3c;--a2:#7a5cff;--a3:#ff4d8d;--a4:#38f5d0;--serif:"Fraunces",Georgia,serif;--sans:"Inter",system-ui,sans-serif;--mono:"JetBrains Mono",monospace;--r:12px;--r2:20px; }

  /* Layout */
  .ac { font-family:var(--sans); color:var(--ink); -webkit-font-smoothing:antialiased; }

  /* Page header */
  .ac-header { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:32px; flex-wrap:wrap; }
  .ac-header-left {}
  .ac-eyebrow { font-family:var(--mono); font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--ink-dim); display:flex; align-items:center; gap:8px; margin-bottom:10px; }
  .ac-eyebrow::before { content:""; width:16px; height:1px; background:currentColor; opacity:.5; }
  .ac-title { font-family:var(--serif); font-weight:400; font-size:clamp(28px,4vw,44px); letter-spacing:-.025em; line-height:.95; margin:0; }
  .ac-title em { font-style:italic; color:var(--accent); }
  .ac-header-actions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

  /* Buttons */
  .ac-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:99px; font-size:13px; font-weight:500; font-family:var(--sans); cursor:pointer; transition:all .25s; border:none; white-space:nowrap; }
  .ac-btn-primary { background:var(--accent); color:#050505; }
  .ac-btn-primary:hover { background:#fff; }
  .ac-btn-ghost { background:transparent; color:var(--ink); border:1px solid var(--line); }
  .ac-btn-ghost:hover { border-color:var(--ink-faint); background:var(--glass); }
  .ac-btn-danger { background:rgba(255,77,141,.1); color:var(--a3); border:1px solid rgba(255,77,141,.2); }
  .ac-btn-danger:hover { background:rgba(255,77,141,.18); }
  .ac-btn-sm { padding:6px 12px; font-size:12px; }

  /* Alert */
  .ac-alert { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:var(--r); margin-bottom:24px; font-size:13px; }
  .ac-alert-warn { background:rgba(255,77,141,.07); border:1px solid rgba(255,77,141,.2); color:var(--a3); }
  .ac-alert-info { background:rgba(122,92,255,.07); border:1px solid rgba(122,92,255,.2); color:var(--a2); }

  /* Tabs */
  .ac-tabs { display:flex; gap:2px; border-bottom:1px solid var(--line); margin-bottom:28px; overflow-x:auto; }
  .ac-tab { font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; padding:10px 16px; cursor:pointer; color:var(--ink-dim); border:none; background:none; border-bottom:2px solid transparent; transition:color .2s,border-color .2s; white-space:nowrap; }
  .ac-tab:hover { color:var(--ink); }
  .ac-tab.active { color:var(--accent); border-bottom-color:var(--accent); }

  /* Stats row */
  .ac-stats { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:12px; margin-bottom:28px; }
  .ac-stat { background:var(--glass); border:1px solid var(--line); border-radius:var(--r2); padding:20px 22px; }
  .ac-stat-label { font-family:var(--mono); font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--ink-dim); margin-bottom:8px; }
  .ac-stat-val { font-family:var(--serif); font-size:28px; letter-spacing:-.03em; line-height:1; color:var(--ink); }
  .ac-stat-val em { font-style:normal; color:var(--accent); }
  .ac-stat-val.neg { color:var(--a3); }
  .ac-stat-val.pos { color:var(--accent); }
  .ac-stat-sub { font-size:11px; color:var(--ink-dim); margin-top:6px; }

  /* Cards */
  .ac-card { background:var(--glass); border:1px solid var(--line); border-radius:var(--r2); padding:24px; }
  .ac-card-title { font-family:var(--serif); font-weight:400; font-size:20px; letter-spacing:-.02em; margin:0 0 18px; display:flex; align-items:center; gap:10px; }
  .ac-card-title span { font-family:var(--mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-dim); font-weight:400; margin-left:auto; }

  /* Grid layouts */
  .ac-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .ac-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
  @media(max-width:900px) { .ac-grid-2,.ac-grid-3 { grid-template-columns:1fr; } }

  /* Chart custom styles */
  .ac-chart-wrap { margin-top:8px; }

  /* Section label */
  .ac-section-label { font-family:var(--mono); font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--ink-dim); margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .ac-section-label::after { content:""; flex:1; height:1px; background:var(--line); }

  /* Table */
  .ac-table-wrap { overflow-x:auto; }
  .ac-table { width:100%; border-collapse:collapse; font-size:13px; }
  .ac-table th { font-family:var(--mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-dim); padding:8px 12px; text-align:left; border-bottom:1px solid var(--line); white-space:nowrap; }
  .ac-table td { padding:11px 12px; border-bottom:1px solid rgba(239,237,231,.04); color:var(--ink); vertical-align:middle; }
  .ac-table tr { cursor:pointer; transition:background .15s; }
  .ac-table tr:hover td { background:rgba(255,255,255,.025); }
  .ac-table tr:last-child td { border-bottom:none; }
  .ac-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:99px; font-family:var(--mono); font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
  .ac-badge-paid { background:rgba(198,255,60,.1); color:var(--accent); border:1px solid rgba(198,255,60,.2); }
  .ac-badge-open { background:rgba(255,77,141,.08); color:var(--a3); border:1px solid rgba(255,77,141,.18); }
  .ac-badge-overdue { background:rgba(255,77,141,.15); color:var(--a3); border:1px solid rgba(255,77,141,.3); }
  .ac-badge-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

  /* Filters bar */
  .ac-filters { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; align-items:center; }
  .ac-select { background:rgba(255,255,255,.04); border:1px solid var(--line); border-radius:8px; padding:7px 12px; color:var(--ink); font-size:13px; font-family:var(--sans); outline:none; transition:border-color .2s; appearance:none; cursor:pointer; }
  .ac-select:focus { border-color:rgba(198,255,60,.3); }
  .ac-input { background:rgba(255,255,255,.04); border:1px solid var(--line); border-radius:8px; padding:7px 12px; color:var(--ink); font-size:13px; font-family:var(--sans); outline:none; transition:border-color .2s; }
  .ac-input::placeholder { color:var(--ink-dim); }
  .ac-input:focus { border-color:rgba(198,255,60,.3); }

  /* Bank status */
  .ac-bank-status { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:10px; font-size:13px; }
  .ac-bank-ok { background:rgba(198,255,60,.06); border:1px solid rgba(198,255,60,.18); color:var(--accent); }
  .ac-bank-off { background:rgba(255,255,255,.03); border:1px solid var(--line); color:var(--ink-dim); }
  .ac-bank-dot { width:7px; height:7px; border-radius:50%; background:currentColor; flex-shrink:0; }

  /* Activity list */
  .ac-activity-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--line); font-size:13px; gap:12px; }
  .ac-activity-row:last-child { border-bottom:none; }
  .ac-activity-vendor { font-weight:500; color:var(--ink); }
  .ac-activity-date { font-family:var(--mono); font-size:11px; color:var(--ink-dim); margin-top:2px; }
  .ac-activity-amount { font-family:var(--mono); font-size:13px; text-align:right; }
  .ac-match { font-size:11px; margin-top:2px; }
  .ac-match-ok { color:var(--accent); }
  .ac-match-warn { color:var(--a3); }
  .ac-match-maybe { color:var(--a2); }

  /* Empty state */
  .ac-empty { text-align:center; padding:48px 20px; color:var(--ink-dim); }
  .ac-empty-icon { font-size:32px; margin-bottom:12px; opacity:.4; }
  .ac-empty-text { font-size:14px; }

  /* Modal overlay */
  .ac-modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.7); backdrop-filter:blur(6px); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
  .ac-modal { position:relative; width:100%; max-width:660px; max-height:90vh; overflow-y:auto; background:#08080c; border:1px solid var(--line); border-radius:var(--r2); padding:32px; }
  .ac-modal-title { font-family:var(--serif); font-size:26px; letter-spacing:-.02em; margin:0 0 24px; }
  .ac-modal-title em { font-style:italic; color:var(--accent); }
  .ac-modal-close { position:absolute; top:16px; right:16px; width:32px; height:32px; border-radius:50%; background:var(--glass); border:1px solid var(--line); color:var(--ink-dim); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:16px; transition:color .2s; }
  .ac-modal-close:hover { color:var(--ink); }
  .ac-detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
  .ac-detail-item label { font-family:var(--mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-dim); display:block; margin-bottom:4px; }
  .ac-detail-item p { font-size:14px; color:var(--ink); margin:0; }

  /* Tax cards */
  .ac-tax-card { background:linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.02)); border:1px solid var(--line); border-radius:var(--r2); padding:20px; text-align:center; }
  .ac-tax-val { font-family:var(--serif); font-size:26px; letter-spacing:-.03em; color:var(--ink); }
  .ac-tax-val em { font-style:normal; color:var(--accent); }
  .ac-tax-label { font-family:var(--mono); font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--ink-dim); margin-top:6px; }

  /* Tooltip custom */
  .ac-tooltip { background:#0d0d14 !important; border:1px solid var(--line) !important; border-radius:8px !important; font-family:var(--mono); font-size:11px; color:var(--ink) !important; }

  /* Progress bar */
  .ac-progress-bar { height:4px; background:var(--line); border-radius:99px; overflow:hidden; margin-top:8px; }
  .ac-progress-fill { height:100%; border-radius:99px; background:var(--accent); transition:width .6s cubic-bezier(.16,1,.3,1); }

  /* Export row */
  .ac-export-row { display:flex; gap:10px; flex-wrap:wrap; padding-top:16px; border-top:1px solid var(--line); margin-top:16px; }
`;

/* ─── Custom tooltip ──────────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label, prefix = "", suffix = " €" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ac-tooltip" style={{ padding: "8px 12px" }}>
      {label && <div style={{ color: "var(--ink-dim)", marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: "var(--accent)" }}>
          {prefix}{Number(p.value || 0).toFixed(2)}{suffix}
        </div>
      ))}
    </div>
  );
};

const PIE_COLORS = ["#c6ff3c", "#7a5cff", "#38f5d0", "#ff4d8d", "#a78bfa", "#34d399"];

const TABS = ["Übersicht", "Rechnungen", "Bank", "Steuern", "Export"];

/* ─── Helpers ─────────────────────────────────────────────────────── */
const fmt = (v) => Number(v || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const safeDate = (d) => { try { return d ? new Date(d).toLocaleDateString("de-DE") : "—"; } catch { return "—"; } };
const buildMonthly = (data) => {
  const map = {};
  (data || []).forEach((i) => {
    if (!i?.invoice_date || !i?.amount) return;
    const d = new Date(i.invoice_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = (map[key] || 0) + (Number(i.amount) || 0);
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => ({ month: k, total: v }));
};

/* ═══════════════════════════════════════════════════════════════════ */
export default function AccountingPage() {
  const [tab, setTab]                   = useState(0);
  const [invoices, setInvoices]         = useState([]);
  const [stats, setStats]               = useState(null);
  const [categories, setCategories]     = useState([]);
  const [monthly, setMonthly]           = useState([]);
  const [bankStatus, setBankStatus]     = useState(null);
  const [uploadOpen, setUploadOpen]     = useState(false);
  const [selectedInvoice, setSelected]  = useState(null);

  /* ── load ── */
  const loadInvoices = async () => {
    try { const r = await api.get("/accounting/invoices"); const d = Array.isArray(r.data) ? r.data : []; setInvoices(d); setMonthly(buildMonthly(d)); } catch { setInvoices([]); }
  };
  const loadStats = async () => {
    try { const r = await api.get("/accounting/stats"); setStats(r.data || {}); } catch { setStats({}); }
  };
  const loadCategories = async () => {
    try { const r = await api.get("/accounting/category-stats"); let d = Array.isArray(r.data) ? r.data : []; d = d.map(c => ({ ...c, category: c?.category || "Unbekannt", total: Number(c?.total) || 0 })).sort((a,b)=>b.total-a.total); setCategories(d); } catch { setCategories([]); }
  };
  const loadBank = async () => {
    try { const r = await api.get("/bank/status"); setBankStatus(r.data); } catch { setBankStatus(null); }
  };

  useEffect(() => {
    loadInvoices(); loadStats(); loadCategories(); loadBank();
    const iv1 = setInterval(loadInvoices, 15000);
    const iv2 = setInterval(loadStats, 60000);
    const iv3 = setInterval(loadBank, 120000);
    return () => { clearInterval(iv1); clearInterval(iv2); clearInterval(iv3); };
  }, []);

  /* ── derived ── */
  const overdue = invoices.filter(i => i?.payment_deadline && i?.payment_status === "unpaid" && new Date(i.payment_deadline) < new Date());
  const totalIncome  = invoices.filter(i => i?.type === "income" || !i?.type).reduce((s,i) => s + (Number(i.amount)||0), 0);
  const totalExpense = invoices.filter(i => i?.type === "expense").reduce((s,i) => s + (Number(i.amount)||0), 0);
  const profit       = totalIncome - totalExpense;

  /* ── bank actions ── */
  const connectBank    = () => { window.location.href = `${api.defaults.baseURL}/bank/connect`; };
  const disconnectBank = async () => { try { await api.post("/bank/disconnect"); loadBank(); } catch {} };

  /* ── invoice actions ── */
  const markPaid = async (id) => { try { await api.post(`/accounting/invoices/${id}/mark-paid`); loadInvoices(); setSelected(null); } catch {} };
  const deleteInvoice = async (id) => { if (!confirm("Rechnung wirklich löschen?")) return; try { await api.delete(`/accounting/invoices/${id}`); loadInvoices(); setSelected(null); } catch {} };

  /* ── export ── */
  const exportCSV = async () => {
    try {
      const r = await api.get("/accounting/export/csv", { responseType: "blob" });
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a"); a.href = url; a.download = "buchhaltung.csv"; a.click();
    } catch { alert("Export fehlgeschlagen"); }
  };
  const exportDATEV = async () => {
    try {
      const r = await api.get("/accounting/export/datev", { responseType: "blob" });
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a"); a.href = url; a.download = "datev-export.zip"; a.click();
    } catch { alert("DATEV Export fehlgeschlagen"); }
  };

  return (
    <>
      <style>{S}</style>
      <PageLayout>
        <div className="ac">

          {/* ── Header ── */}
          <div className="ac-header">
            <div className="ac-header-left">
              <div className="ac-eyebrow">Finanzen</div>
              <h1 className="ac-title">Buch<em>haltung.</em></h1>
            </div>
            <div className="ac-header-actions">
              <button className="ac-btn ac-btn-ghost" onClick={() => setUploadOpen(true)}>
                ＋ Beleg scannen
              </button>
              <button className="ac-btn ac-btn-primary" onClick={() => setTab(3)}>
                Steuern →
              </button>
            </div>
          </div>

          {/* ── Overdue alert ── */}
          {overdue.length > 0 && (
            <div className="ac-alert ac-alert-warn">
              <span>⚠</span>
              <span><strong>{overdue.length} überfällige Rechnung{overdue.length !== 1 ? "en" : ""}</strong> — bitte prüfen</span>
              <button className="ac-btn ac-btn-sm ac-btn-danger" style={{ marginLeft: "auto" }} onClick={() => setTab(1)}>Anzeigen</button>
            </div>
          )}

          {/* ── Tabs ── */}
          <div className="ac-tabs">
            {TABS.map((t, i) => (
              <button key={t} className={`ac-tab${tab === i ? " active" : ""}`} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>

          {/* ══════════════ TAB 0: ÜBERSICHT ══════════════ */}
          {tab === 0 && (
            <>
              {/* Stats */}
              <div className="ac-stats">
                {[
                  { label: "Einnahmen", val: fmt(totalIncome) + " €", cls: "pos" },
                  { label: "Ausgaben",  val: fmt(totalExpense) + " €", cls: "neg" },
                  { label: "Gewinn",    val: fmt(profit) + " €",       cls: profit >= 0 ? "pos" : "neg" },
                  { label: "Offen",     val: stats?.unpaid_count ?? "—" },
                  { label: "Überfällig",val: overdue.length, cls: overdue.length > 0 ? "neg" : "" },
                  { label: "Rechnungen",val: invoices.length },
                ].map((s, i) => (
                  <div key={i} className="ac-stat">
                    <div className="ac-stat-label">{s.label}</div>
                    <div className={`ac-stat-val ${s.cls || ""}`}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="ac-grid-2" style={{ marginBottom: 16 }}>
                <div className="ac-card">
                  <div className="ac-card-title">Monatliche Ausgaben <span>12 Monate</span></div>
                  <div className="ac-chart-wrap">
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={monthly}>
                        <defs>
                          <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c6ff3c" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#c6ff3c" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(239,237,231,.04)" vertical={false}/>
                        <XAxis dataKey="month" tick={{ fill: "var(--ink-dim)", fontSize: 10, fontFamily: "var(--mono)" }} axisLine={false} tickLine={false}/>
                        <YAxis tick={{ fill: "var(--ink-dim)", fontSize: 10, fontFamily: "var(--mono)" }} axisLine={false} tickLine={false} tickFormatter={v => v + " €"}/>
                        <Tooltip content={<ChartTooltip/>}/>
                        <Area type="monotone" dataKey="total" stroke="#c6ff3c" strokeWidth={2} fill="url(#areaG)" dot={false}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="ac-card">
                  <div className="ac-card-title">Kategorien <span>nach Volumen</span></div>
                  {categories.length > 0 ? (
                    <div className="ac-chart-wrap">
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={categories} dataKey="total" nameKey="category" outerRadius={80} innerRadius={36} paddingAngle={2}>
                            {categories.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                          </Pie>
                          <Tooltip content={<ChartTooltip/>}/>
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 14px", marginTop: 8 }}>
                        {categories.slice(0, 6).map((c, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--mono)" }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }}/>
                            {c.category}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="ac-empty"><div className="ac-empty-icon">◎</div><div className="ac-empty-text">Keine Kategoriedaten</div></div>
                  )}
                </div>
              </div>

              {/* Top 5 recent invoices */}
              <div className="ac-card">
                <div className="ac-card-title">Letzte Buchungen <span><button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setTab(1)}>Alle anzeigen →</button></span></div>
                <div className="ac-table-wrap">
                  <table className="ac-table">
                    <thead><tr>
                      <th>Datum</th><th>Anbieter</th><th>Betrag</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {invoices.slice(0, 5).map(inv => inv?.id && (
                        <tr key={inv.id} onClick={() => { setSelected(inv); setTab(1); }}>
                          <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{safeDate(inv.invoice_date)}</td>
                          <td>{inv.vendor || "—"}</td>
                          <td style={{ fontFamily: "var(--mono)" }}>{fmt(inv.amount)} €</td>
                          <td><StatusBadge status={inv.payment_status} deadline={inv.payment_deadline}/></td>
                        </tr>
                      ))}
                      {invoices.length === 0 && (
                        <tr><td colSpan={4}><div className="ac-empty"><div className="ac-empty-icon">◎</div><div className="ac-empty-text">Noch keine Rechnungen</div></div></td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ══════════════ TAB 1: RECHNUNGEN ══════════════ */}
          {tab === 1 && (
            <InvoiceTab
              invoices={invoices}
              onUpdated={loadInvoices}
              initialSelected={selectedInvoice}
              onClearSelected={() => setSelected(null)}
              onUpload={() => setUploadOpen(true)}
            />
          )}

          {/* ══════════════ TAB 2: BANK ══════════════ */}
          {tab === 2 && (
            <BankTab
              bankStatus={bankStatus}
              onConnect={connectBank}
              onDisconnect={disconnectBank}
              onUpload={() => setUploadOpen(true)}
            />
          )}

          {/* ══════════════ TAB 3: STEUERN ══════════════ */}
          {tab === 3 && (
            <div>
              <div className="ac-section-label">Steuer-Übersicht</div>
              <TaxDashboard/>
            </div>
          )}

          {/* ══════════════ TAB 4: EXPORT ══════════════ */}
          {tab === 4 && (
            <ExportTab onCSV={exportCSV} onDATEV={exportDATEV} invoices={invoices}/>
          )}

        </div>

        <ReceiptUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onCreated={loadInvoices}/>
      </PageLayout>
    </>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────── */
function StatusBadge({ status, deadline }) {
  const isOverdue = status === "unpaid" && deadline && new Date(deadline) < new Date();
  if (isOverdue)       return <span className="ac-badge ac-badge-overdue"><span className="ac-badge-dot"/>Überfällig</span>;
  if (status === "paid") return <span className="ac-badge ac-badge-paid"><span className="ac-badge-dot"/>Bezahlt</span>;
  return <span className="ac-badge ac-badge-open"><span className="ac-badge-dot"/>Offen</span>;
}

/* ─── Invoice Tab ────────────────────────────────────────────────── */
function InvoiceTab({ invoices, onUpdated, initialSelected, onClearSelected, onUpload }) {
  const [sort, setSort]         = useState("date_desc");
  const [statusFilter, setStatus] = useState("all");
  const [vendorFilter, setVendor] = useState("");
  const [selected, setSelected] = useState(initialSelected || null);

  const getGross = (inv) => Number(inv?.gross_amount ?? inv?.amount ?? 0);
  const getNet   = (inv) => Number(inv?.net_amount   ?? inv?.amount ?? 0);
  const getVat   = (inv) => Number(inv?.vat_amount   ?? inv?.vat   ?? 0);

  const processed = useMemo(() => {
    let d = (invoices || []).filter(Boolean);
    if (statusFilter !== "all") d = d.filter(i => i?.payment_status === statusFilter);
    if (vendorFilter.trim()) { const q = vendorFilter.toLowerCase(); d = d.filter(i => (i?.vendor || "").toLowerCase().includes(q)); }
    d.sort((a, b) => {
      if (sort === "date_desc") return new Date(b?.invoice_date||0) - new Date(a?.invoice_date||0);
      if (sort === "date_asc")  return new Date(a?.invoice_date||0) - new Date(b?.invoice_date||0);
      if (sort === "amount_desc") return getGross(b) - getGross(a);
      if (sort === "amount_asc")  return getGross(a) - getGross(b);
      return 0;
    });
    return d;
  }, [invoices, sort, statusFilter, vendorFilter]);

  const markPaid = async (id) => { try { await api.post(`/accounting/invoices/${id}/mark-paid`); onUpdated?.(); setSelected(null); } catch {} };
  const del      = async (id) => { if (!confirm("Rechnung löschen?")) return; try { await api.delete(`/accounting/invoices/${id}`); onUpdated?.(); setSelected(null); onClearSelected?.(); } catch {} };

  return (
    <>
      <div className="ac-filters">
        <select className="ac-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="date_desc">Datum ↓</option>
          <option value="date_asc">Datum ↑</option>
          <option value="amount_desc">Betrag ↓</option>
          <option value="amount_asc">Betrag ↑</option>
        </select>
        <select className="ac-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="all">Alle Status</option>
          <option value="paid">Bezahlt</option>
          <option value="unpaid">Offen</option>
        </select>
        <input className="ac-input" placeholder="Anbieter suchen…" value={vendorFilter} onChange={e => setVendor(e.target.value)}/>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" style={{ marginLeft: "auto" }} onClick={onUpload}>＋ Beleg hochladen</button>
      </div>

      <div className="ac-card">
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead><tr>
              <th>Datum</th><th>Anbieter</th><th>Kategorie</th><th>Brutto</th><th>Fälligkeit</th><th>Status</th><th style={{ textAlign: "right" }}>Aktionen</th>
            </tr></thead>
            <tbody>
              {processed.map(inv => inv?.id && (
                <tr key={inv.id} onClick={() => setSelected(inv)}>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{safeDate(inv.invoice_date)}</td>
                  <td style={{ fontWeight: 500 }}>{inv.vendor || "—"}</td>
                  <td style={{ color: "var(--ink-dim)", fontSize: 12 }}>{inv.category || "—"}</td>
                  <td style={{ fontFamily: "var(--mono)" }}>{fmt(getGross(inv))} €</td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12, color: inv.payment_deadline && new Date(inv.payment_deadline) < new Date() && inv.payment_status !== "paid" ? "var(--a3)" : "var(--ink-dim)" }}>
                    {safeDate(inv.payment_deadline)}
                  </td>
                  <td><StatusBadge status={inv.payment_status} deadline={inv.payment_deadline}/></td>
                  <td style={{ textAlign: "right" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      {inv.payment_status !== "paid" && (
                        <button className="ac-btn ac-btn-sm ac-btn-primary" onClick={() => markPaid(inv.id)}>Bezahlt</button>
                      )}
                      <button className="ac-btn ac-btn-sm ac-btn-danger" onClick={() => del(inv.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
              {processed.length === 0 && (
                <tr><td colSpan={7}><div className="ac-empty"><div className="ac-empty-icon">◎</div><div className="ac-empty-text">Keine Rechnungen gefunden</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice detail modal */}
      {selected?.id && (
        <div className="ac-modal-bg" onClick={() => { setSelected(null); onClearSelected?.(); }}>
          <div className="ac-modal" onClick={e => e.stopPropagation()}>
            <button className="ac-modal-close" onClick={() => { setSelected(null); onClearSelected?.(); }}>✕</button>
            <h2 className="ac-modal-title">{selected.title || selected.vendor || <em>Rechnung</em>}</h2>
            <div className="ac-detail-grid">
              {[
                ["Anbieter", selected.vendor || "—"],
                ["Datum",    safeDate(selected.invoice_date)],
                ["Brutto",   fmt(Number(selected.gross_amount ?? selected.amount ?? 0)) + " €"],
                ["Netto",    fmt(Number(selected.net_amount ?? selected.amount ?? 0)) + " €"],
                ["MwSt",     fmt(Number(selected.vat_amount ?? selected.vat ?? 0)) + " €"],
                ["MwSt-Satz",(selected.vat_rate ?? "—") + " %"],
                ["Fälligkeit",safeDate(selected.payment_deadline)],
                ["Kategorie", selected.category || "—"],
              ].map(([label, val]) => (
                <div key={label} className="ac-detail-item">
                  <label>{label}</label>
                  <p>{val}</p>
                </div>
              ))}
            </div>
            {selected.file_url && (
              <iframe src={`${api.defaults.baseURL}${selected.file_url}`} style={{ width: "100%", height: 280, borderRadius: 10, border: "1px solid var(--line)", marginBottom: 20 }} title="Rechnung"/>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {selected.payment_status !== "paid" && (
                <button className="ac-btn ac-btn-primary" onClick={() => markPaid(selected.id)}>Als bezahlt markieren</button>
              )}
              <button className="ac-btn ac-btn-danger" onClick={() => del(selected.id)}>Löschen</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Bank Tab ───────────────────────────────────────────────────── */
function BankTab({ bankStatus, onConnect, onDisconnect, onUpload }) {
  const [activity, setActivity]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showMissing, setShowMissing] = useState(false);

  useEffect(() => {
    api.get("/bank/activity")
      .then(r => { const d = r.data || {}; setActivity(Array.isArray(d.activity) ? d.activity : []); })
      .catch(() => setActivity([]))
      .finally(() => setLoading(false));
  }, []);

  const missing = activity.filter(a => a.status === "missing_invoice");

  return (
    <>
      <div className="ac-section-label">Bankverbindung</div>
      <div className="ac-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div className={`ac-bank-status ${bankStatus?.connected ? "ac-bank-ok" : "ac-bank-off"}`}>
            <span className="ac-bank-dot"/>
            {bankStatus?.connected ? `Verbunden${bankStatus.bank_name ? " · " + bankStatus.bank_name : ""}` : "Keine Bank verbunden"}
          </div>
          {bankStatus?.connected
            ? <button className="ac-btn ac-btn-danger" onClick={onDisconnect}>Bank trennen</button>
            : <button className="ac-btn ac-btn-primary" onClick={onConnect}>Bank verbinden →</button>
          }
        </div>
      </div>

      {missing.length > 0 && (
        <div className="ac-alert ac-alert-warn" style={{ marginBottom: 16 }}>
          <span>⚠</span>
          <span><strong>{missing.length} Ausgaben</strong> ohne Rechnung</span>
          <button className="ac-btn ac-btn-sm ac-btn-ghost" style={{ marginLeft: "auto" }} onClick={() => setShowMissing(true)}>Anzeigen</button>
        </div>
      )}

      <div className="ac-section-label">Letzte Aktivität</div>
      <div className="ac-card">
        {loading ? (
          <div className="ac-empty"><div className="ac-empty-icon" style={{ animation: "none" }}>◎</div><div className="ac-empty-text">Lade…</div></div>
        ) : activity.length === 0 ? (
          <div className="ac-empty"><div className="ac-empty-icon">◎</div><div className="ac-empty-text">{bankStatus?.connected ? "Noch keine Transaktionen" : "Bank verbinden um Aktivitäten zu sehen"}</div></div>
        ) : (
          activity.slice(0, 10).map(a => (
            <div key={a.id} className="ac-activity-row">
              <div>
                <div className="ac-activity-vendor">{a.vendor || "Unbekannt"}</div>
                <div className="ac-activity-date">{safeDate(a.date)}</div>
              </div>
              <div>
                <div className="ac-activity-amount">{Number(a.amount || 0).toFixed(2)} {a.currency}</div>
                {a.status === "matched"         && <div className="ac-match ac-match-ok">✓ Rechnung gefunden</div>}
                {a.status === "missing_invoice" && <div className="ac-match ac-match-warn">⚠ Rechnung fehlt</div>}
                {a.status === "possible_match"  && <div className="ac-match ac-match-maybe">◎ Mögliches Match</div>}
              </div>
            </div>
          ))
        )}
      </div>

      {showMissing && (
        <div className="ac-modal-bg" onClick={() => setShowMissing(false)}>
          <div className="ac-modal" onClick={e => e.stopPropagation()}>
            <button className="ac-modal-close" onClick={() => setShowMissing(false)}>✕</button>
            <h2 className="ac-modal-title">Fehlende <em>Rechnungen</em></h2>
            {missing.map(m => (
              <div key={m.id} className="ac-activity-row">
                <div><div className="ac-activity-vendor">{m.vendor}</div><div className="ac-activity-date">{safeDate(m.date)}</div></div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 13 }}>{Number(m.amount||0).toFixed(2)} {m.currency}</span>
                  <button className="ac-btn ac-btn-sm ac-btn-primary" onClick={() => { onUpload?.(); setShowMissing(false); }}>Hochladen</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Export Tab ─────────────────────────────────────────────────── */
function ExportTab({ onCSV, onDATEV, invoices }) {
  const year = new Date().getFullYear();
  const paid = invoices.filter(i => i?.payment_status === "paid").length;
  const open = invoices.filter(i => i?.payment_status !== "paid").length;

  return (
    <>
      <div className="ac-section-label">Datenexport</div>
      <div className="ac-grid-2" style={{ marginBottom: 16 }}>
        <div className="ac-card">
          <div className="ac-card-title">CSV Export</div>
          <p style={{ fontSize: 13, color: "var(--ink-dim)", marginBottom: 20, lineHeight: 1.55 }}>
            Alle Rechnungen als kommagetrennte Datei — kompatibel mit Excel, Google Sheets und gängigen Buchhaltungstools.
          </p>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <span className="ac-badge ac-badge-paid"><span className="ac-badge-dot"/>{paid} bezahlt</span>
            <span className="ac-badge ac-badge-open"><span className="ac-badge-dot"/>{open} offen</span>
          </div>
          <button className="ac-btn ac-btn-primary" onClick={onCSV}>CSV herunterladen →</button>
        </div>

        <div className="ac-card">
          <div className="ac-card-title">DATEV Export</div>
          <p style={{ fontSize: 13, color: "var(--ink-dim)", marginBottom: 20, lineHeight: 1.55 }}>
            Steuerberater-kompatibler DATEV-Export für das Wirtschaftsjahr {year}. GoBD-konform und direkt importierbar.
          </p>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <span className="ac-badge" style={{ background: "rgba(122,92,255,.1)", border: "1px solid rgba(122,92,255,.2)", color: "var(--a2)", fontFamily: "var(--mono)", fontSize: 10, padding: "3px 9px", borderRadius: 99 }}>GoBD-konform</span>
            <span className="ac-badge" style={{ background: "rgba(122,92,255,.1)", border: "1px solid rgba(122,92,255,.2)", color: "var(--a2)", fontFamily: "var(--mono)", fontSize: 10, padding: "3px 9px", borderRadius: 99 }}>DATEV v{year}</span>
          </div>
          <button className="ac-btn ac-btn-ghost" onClick={onDATEV}>DATEV herunterladen →</button>
        </div>
      </div>

      <div className="ac-section-label">Steuervorbereitung</div>
      <div className="ac-card">
        <div className="ac-card-title">Jahresabschluss {year}</div>
        <p style={{ fontSize: 13, color: "var(--ink-dim)", marginBottom: 20, lineHeight: 1.55 }}>
          Bereite alle relevanten Unterlagen für den Steuerberater vor. NILL konsolidiert Einnahmen, Ausgaben, MwSt und Belege automatisch.
        </p>
        <div style={{ marginBottom: 16 }}>
          {[
            { label: "Rechnungen erfasst",       pct: Math.min(100, Math.round(invoices.length / 50 * 100)) },
            { label: "Belege gescannt",           pct: Math.min(100, Math.round(invoices.filter(i => i?.file_url).length / Math.max(1, invoices.length) * 100)) },
            { label: "Bank-Transaktionen gematcht", pct: 0 },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>{row.label}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: row.pct === 100 ? "var(--accent)" : "var(--ink-dim)" }}>{row.pct}%</span>
              </div>
              <div className="ac-progress-bar"><div className="ac-progress-fill" style={{ width: row.pct + "%" }}/></div>
            </div>
          ))}
        </div>
        <button className="ac-btn ac-btn-ghost" onClick={onDATEV}>Vollständigen Export erstellen →</button>
      </div>
    </>
  );
}
