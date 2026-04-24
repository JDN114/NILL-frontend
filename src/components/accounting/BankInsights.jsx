// src/components/accounting/BankInsights.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} EUR`;

const TXN_COLORS = {
  income:   "#c6ff3c",
  expense:  "#ff4d8d",
  transfer: "#7a5cff",
  unknown:  "#9b9890",
};

export default function BankInsights() {
  const [status, setStatus]     = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/bank/status").catch(() => null),
      api.get("/bank/activity").catch(() => null),
    ]).then(([s, a]) => {
      setStatus(s?.data || null);
      setActivity(a?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Bankdaten...</div>;

  const income  = activity.filter(t => t.type === "income").reduce((s,t)  => s + Number(t.amount||0), 0);
  const expense = activity.filter(t => t.type === "expense").reduce((s,t) => s + Number(t.amount||0), 0);

  const monthMap = {};
  activity.forEach(t => {
    const m = (t.date || "").slice(0,7);
    if (!m) return;
    if (!monthMap[m]) monthMap[m] = { name: m, Einnahmen: 0, Ausgaben: 0 };
    if (t.type === "income")  monthMap[m].Einnahmen += Number(t.amount||0);
    if (t.type === "expense") monthMap[m].Ausgaben  += Number(t.amount||0);
  });
  const chartData = Object.values(monthMap).sort((a,b) => a.name.localeCompare(b.name)).slice(-6);

  const filtered = activity.filter(t =>
    !filter ||
    (t.description || "").toLowerCase().includes(filter.toLowerCase()) ||
    (t.counterpart  || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="ac-kpi-grid" style={{ marginBottom:16 }}>
        {status && (
          <div className="ac-kpi">
            <div className="ac-kpi-label">Kontostand</div>
            <div className={`ac-kpi-value ${(status.balance||0) >= 0 ? "green" : "pink"}`}>{fmtEur(status.balance)}</div>
            <div className="ac-kpi-delta">{status.bank_name || ""} {status.iban ? `- ${status.iban}` : ""}</div>
          </div>
        )}
        <div className="ac-kpi"><div className="ac-kpi-label">Eingange (sichtbar)</div><div className="ac-kpi-value green">{fmtEur(income)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Ausgange (sichtbar)</div><div className="ac-kpi-value pink">{fmtEur(expense)}</div></div>
        <div className="ac-kpi"><div className="ac-kpi-label">Transaktionen</div><div className="ac-kpi-value">{activity.length}</div></div>
      </div>

      {chartData.length > 0 && (
        <div className="ac-card" style={{ marginBottom:16 }}>
          <div className="ac-section-title">Monatlicher Cashflow</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.05)" />
              <XAxis dataKey="name" tick={{ fill:"#9b9890", fontSize:11 }} />
              <YAxis tick={{ fill:"#9b9890", fontSize:11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => fmtEur(v)} contentStyle={{ background:"#0d0d14", border:"1px solid rgba(239,237,231,.08)", borderRadius:8 }} />
              <Bar dataKey="Einnahmen" fill="#c6ff3c" radius={[4,4,0,0]} />
              <Bar dataKey="Ausgaben"  fill="#ff4d8d" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ marginBottom:12 }}>
        <input className="ac-input" style={{ maxWidth:320 }} placeholder="Transaktionen durchsuchen..."
          value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <div className="ac-card" style={{ padding:0 }}>
        <table className="ac-table">
          <thead>
            <tr><th>Datum</th><th>Beschreibung</th><th>Gegenseite</th><th>Typ</th><th style={{textAlign:"right"}}>Betrag</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={5} className="ac-empty">Keine Transaktionen gefunden.</td></tr>}
            {filtered.slice(0, 100).map((t, i) => (
              <tr key={i}>
                <td className="ac-mono">{t.date || "--"}</td>
                <td style={{ maxWidth:300, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.description || "--"}</td>
                <td style={{ color:"var(--ink2)", fontSize:".82rem" }}>{t.counterpart || "--"}</td>
                <td>
                  <span className="ac-badge"
                    style={{ background: `${TXN_COLORS[t.type||"unknown"]}20`, color: TXN_COLORS[t.type||"unknown"] }}>
                    {t.type || "--"}
                  </span>
                </td>
                <td className="ac-mono" style={{ textAlign:"right",
                  color: t.type === "income" ? "var(--accent)" : t.type === "expense" ? "var(--a3)" : "var(--ink)" }}>
                  {t.type === "expense" ? "-" : "+"}{fmtEur(Math.abs(t.amount||0))}
                </td>
              </tr>
            ))}
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
