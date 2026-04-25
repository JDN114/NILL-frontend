// src/components/accounting/BankInsights.jsx
// Updated: migrated from Tailwind to ac-* design system + defensive hardening
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;

const TXN_COLORS = {
  income:   "#c6ff3c",
  expense:  "#ff4d8d",
  transfer: "#7a5cff",
  unknown:  "#9b9890",
};

// Normalize raw API response to a plain array of transactions
const toArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  // Wrapped: { items: [...] } or { transactions: [...] } or { data: [...] }
  if (Array.isArray(raw.items))        return raw.items;
  if (Array.isArray(raw.transactions)) return raw.transactions;
  if (Array.isArray(raw.data))         return raw.data;
  return [];
};

// Normalize one transaction to consistent field names
const normTxn = (t) => {
  if (!t || typeof t !== "object") return null;
  const rawAmt = t.amount ?? t.betrag ?? t.value ?? 0;
  const amt    = parseFloat(rawAmt);
  const rawDir = (t.type || t.direction || t.transaction_type || "").toLowerCase();
  // Map various backend spellings to income / expense / transfer / unknown
  const type =
    rawDir === "income"   || rawDir === "credit" || rawDir === "einnahme" ? "income"   :
    rawDir === "expense"  || rawDir === "debit"  || rawDir === "ausgabe"  ? "expense"  :
    rawDir === "transfer"                                                  ? "transfer" :
    "unknown";
  return {
    date:        t.date || t.booking_date || t.value_date || "",
    description: t.description || t.purpose || t.reference || t.memo || "",
    counterpart: t.counterpart || t.name || t.creditor_name || t.debtor_name || "",
    type,
    amount:      isNaN(amt) ? 0 : Math.abs(amt),
    _raw:        t,
  };
};

export default function BankInsights() {
  const [status, setStatus]     = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/bank/status").catch(() => null),
      api.get("/bank/activity").catch(() => null),
    ]).then(([s, a]) => {
      try {
        setStatus(s?.data || null);
        const raw  = toArray(a?.data);
        const txns = raw.map(normTxn).filter(Boolean);
        setActivity(txns);
      } catch (err) {
        console.error("BankInsights: data normalization failed", err);
        setError(err.message || "Datenfehler");
      }
    }).catch(err => {
      setError(err.message || "Ladefehler");
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Bankdaten…</div>;

  if (error) return (
    <div className="ac-card" style={{ textAlign:"center", padding:40, color:"var(--ink2)" }}>
      <div style={{ fontSize:"1.5rem", marginBottom:8 }}>⚠</div>
      <div>Banking-Daten konnten nicht geladen werden.</div>
      <div style={{ fontSize:".8rem", marginTop:6, opacity:.5 }}>{error}</div>
    </div>
  );

  const income  = activity.filter(t => t.type === "income") .reduce((s,t) => s + t.amount, 0);
  const expense = activity.filter(t => t.type === "expense").reduce((s,t) => s + t.amount, 0);

  // Group by month for chart
  const monthMap = {};
  activity.forEach(t => {
    const m = (t.date || "").slice(0,7);
    if (!m) return;
    if (!monthMap[m]) monthMap[m] = { name: m, Einnahmen: 0, Ausgaben: 0 };
    if (t.type === "income")  monthMap[m].Einnahmen += t.amount;
    if (t.type === "expense") monthMap[m].Ausgaben  += t.amount;
  });
  const chartData = Object.values(monthMap).sort((a,b) => a.name.localeCompare(b.name)).slice(-6);

  const lc = filter.toLowerCase();
  const filtered = activity.filter(t =>
    !filter ||
    t.description.toLowerCase().includes(lc) ||
    t.counterpart.toLowerCase().includes(lc)
  );

  return (
    <div>
      <div className="ac-kpi-grid" style={{ marginBottom:16 }}>
        {status && (
          <div className="ac-kpi">
            <div className="ac-kpi-label">Kontostand</div>
            <div className={`ac-kpi-value ${Number(status.balance||0) >= 0 ? "green" : "pink"}`}>
              {fmtEur(status.balance)}
            </div>
            <div className="ac-kpi-delta">{status.bank_name || ""}{status.iban ? ` • ${status.iban}` : ""}</div>
          </div>
        )}
        <div className="ac-kpi">
          <div className="ac-kpi-label">Eingänge (sichtbar)</div>
          <div className="ac-kpi-value green">{fmtEur(income)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Ausgänge (sichtbar)</div>
          <div className="ac-kpi-value pink">{fmtEur(expense)}</div>
        </div>
        <div className="ac-kpi">
          <div className="ac-kpi-label">Transaktionen</div>
          <div className="ac-kpi-value">{activity.length}</div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="ac-card" style={{ marginBottom:16 }}>
          <div className="ac-section-title">Monatlicher Cashflow</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.05)" />
              <XAxis dataKey="name" tick={{ fill:"#9b9890", fontSize:11 }} />
              <YAxis tick={{ fill:"#9b9890", fontSize:11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={v => fmtEur(v)}
                contentStyle={{ background:"#0d0d14", border:"1px solid rgba(239,237,231,.08)", borderRadius:8 }}
              />
              <Bar dataKey="Einnahmen" fill="#c6ff3c" radius={[4,4,0,0]} isAnimationActive />
              <Bar dataKey="Ausgaben"  fill="#ff4d8d" radius={[4,4,0,0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ marginBottom:12 }}>
        <input className="ac-input" style={{ maxWidth:320 }} placeholder="Transaktionen durchsuchen…"
          value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <div className="ac-card" style={{ padding:0 }}>
        <table className="ac-table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Beschreibung</th>
              <th>Gegenseite</th>
              <th>Typ</th>
              <th style={{textAlign:"right"}}>Betrag</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="ac-empty">
                {activity.length === 0 ? "Keine Bankdaten vorhanden." : "Keine Transaktionen gefunden."}
              </td></tr>
            )}
            {filtered.slice(0, 100).map((t, i) => {
              const col = TXN_COLORS[t.type] || TXN_COLORS.unknown;
              return (
                <tr key={i}>
                  <td className="ac-mono">{t.date || "—"}</td>
                  <td style={{ maxWidth:300, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {t.description || "—"}
                  </td>
                  <td style={{ color:"var(--ink2)", fontSize:".82rem" }}>{t.counterpart || "—"}</td>
                  <td>
                    <span className="ac-badge" style={{ background:`${col}20`, color:col }}>
                      {t.type}
                    </span>
                  </td>
                  <td className="ac-mono" style={{
                    textAlign:"right",
                    color: t.type === "income" ? "var(--accent)" : t.type === "expense" ? "var(--a3)" : "var(--ink)"
                  }}>
                    {t.type === "expense" ? "−" : "+"}{fmtEur(t.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length > 100 && (
          <div style={{ textAlign:"center", padding:12, color:"var(--ink2)", fontSize:".82rem" }}>
            + {filtered.length - 100} weitere Transaktionen (Suchfilter verfeinern)
          </div>
        )}
      </div>
    </div>
  );
}
