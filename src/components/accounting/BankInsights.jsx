// src/components/accounting/BankInsights.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;

// /bank/status   → { connected, soft_disconnected }
// /bank/activity → { connected, activity: [{id,vendor,description,amount,currency,date,status,matched_invoice_id}] }

const STATUS_META = {
  matched:         { label:"Zugeordnet",     color:"#c6ff3c" },
  possible_match:  { label:"Mögl. Match",    color:"#7a5cff" },
  missing_invoice: { label:"Keine Rechnung", color:"#ff4d8d" },
  unknown:         { label:"Unbekannt",      color:"#9b9890" },
};

export default function BankInsights() {
  const [connected, setConnected]         = useState(false);
  const [softDisc, setSoftDisc]           = useState(false);
  const [activity, setActivity]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]                 = useState(null);
  const [filter, setFilter]               = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/bank/status").catch(() => null),
      api.get("/bank/activity").catch(() => null),
    ]).then(([s, a]) => {
      try {
        const st = s?.data || {};
        setConnected(!!st.connected);
        setSoftDisc(!!st.soft_disconnected);
        // Backend: { connected, activity: [...] }
        const raw = a?.data?.activity ?? a?.data ?? [];
        setActivity(Array.isArray(raw) ? raw : []);
      } catch (err) {
        setError(err.message || "Datenfehler");
      }
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const connectBank = () => {
    // GET /bank/connect gibt einen OAuth-Redirect zurück → direkt navigieren
    window.location.href = `${import.meta.env.VITE_API_URL}/bank/connect`;
  };

  const disconnectBank = async () => {
    setActionLoading(true);
    try { await api.post("/bank/disconnect"); setConnected(false); setSoftDisc(true); } catch {}
    setActionLoading(false);
  };

  const reconnectBank = async () => {
    setActionLoading(true);
    try { await api.post("/bank/reconnect"); setConnected(true); setSoftDisc(false); load(); } catch {}
    setActionLoading(false);
  };

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Bankdaten…</div>;

  if (error) return (
    <div className="ac-card" style={{ textAlign:"center", padding:40, color:"var(--ink2)" }}>
      <div style={{ fontSize:"1.5rem", marginBottom:8 }}>⚠</div>
      <div>Banking-Daten konnten nicht geladen werden.</div>
      <div style={{ fontSize:".8rem", marginTop:6, opacity:.5 }}>{error}</div>
    </div>
  );

  // ── Nicht verbunden ─────────────────────────────────────────────────────────
  if (!connected) {
    return (
      <div className="ac-card" style={{ textAlign:"center", padding:56 }}>
        <div style={{ fontSize:"2.8rem", marginBottom:20 }}>🏦</div>
        <div style={{
          fontFamily:"Fraunces,serif", fontSize:"1.3rem", fontWeight:600,
          marginBottom:10, color:"var(--ink)",
        }}>
          Bankkonto verknüpfen
        </div>
        <div style={{
          color:"var(--ink2)", fontSize:".88rem", lineHeight:1.6,
          maxWidth:380, margin:"0 auto 28px",
        }}>
          Verbinde dein Bankkonto über TrueLayer, um Transaktionen automatisch
          abzugleichen und deinen Cashflow in Echtzeit zu sehen.
        </div>

        {softDisc ? (
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <button className="ac-btn ac-btn-ghost" onClick={reconnectBank} disabled={actionLoading}>
              {actionLoading ? "…" : "↩ Wiederverbinden"}
            </button>
            <button className="ac-btn ac-btn-primary" onClick={connectBank}>
              Neu verknüpfen
            </button>
          </div>
        ) : (
          <button
            className="ac-btn ac-btn-primary"
            onClick={connectBank}
            style={{ fontSize:"1rem", padding:"13px 36px" }}
          >
            Konto verknüpfen
          </button>
        )}
      </div>
    );
  }

  // ── Verbunden ───────────────────────────────────────────────────────────────
  const total   = activity.reduce((s, t) => s + Number(t.amount || 0), 0);
  const matched = activity.filter(t => t.status === "matched").length;

  const monthMap = {};
  activity.forEach(t => {
    const m = (t.date || "").slice(0, 7);
    if (!m) return;
    if (!monthMap[m]) monthMap[m] = { name: m, Umsatz: 0 };
    monthMap[m].Umsatz += Number(t.amount || 0);
  });
  const chartData = Object.values(monthMap).sort((a,b) => a.name.localeCompare(b.name)).slice(-6);

  const lc = filter.toLowerCase();
  const filtered = activity.filter(t =>
    !filter ||
    (t.vendor       || "").toLowerCase().includes(lc) ||
    (t.description  || "").toLowerCase().includes(lc)
  );

  return (
    <div>
      {/* KPIs + Aktionen */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:16, flexWrap:"wrap" }}>
        <div className="ac-kpi-grid" style={{ flex:1, marginBottom:0 }}>
          <div className="ac-kpi">
            <div className="ac-kpi-label">Transaktionen</div>
            <div className="ac-kpi-value">{activity.length}</div>
          </div>
          <div className="ac-kpi">
            <div className="ac-kpi-label">Gesamtvolumen</div>
            <div className="ac-kpi-value green">{fmtEur(total)}</div>
          </div>
          <div className="ac-kpi">
            <div className="ac-kpi-label">Zugeordnet</div>
            <div className="ac-kpi-value">
              {matched}
              <span style={{ color:"var(--ink2)", fontWeight:400, fontSize:".9rem" }}> / {activity.length}</span>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, paddingTop:4 }}>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={connectBank}>
            ↻ Neu verknüpfen
          </button>
          <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={disconnectBank} disabled={actionLoading}>
            {actionLoading ? "…" : "Trennen"}
          </button>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="ac-card" style={{ marginBottom:16 }}>
          <div className="ac-section-title">Monatliches Transaktionsvolumen</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,237,231,.05)" />
              <XAxis dataKey="name" tick={{ fill:"#9b9890", fontSize:11 }} />
              <YAxis tick={{ fill:"#9b9890", fontSize:11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={v => fmtEur(v)}
                contentStyle={{ background:"#0d0d14", border:"1px solid rgba(239,237,231,.08)", borderRadius:8 }}
              />
              <Bar dataKey="Umsatz" fill="#c6ff3c" radius={[4,4,0,0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Suche */}
      <div style={{ marginBottom:12 }}>
        <input className="ac-input" style={{ maxWidth:320 }} placeholder="Vendor, Beschreibung…"
          value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      {/* Tabelle */}
      <div className="ac-card" style={{ padding:0 }}>
        <table className="ac-table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Vendor</th>
              <th>Beschreibung</th>
              <th>Status</th>
              <th style={{textAlign:"right"}}>Betrag</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="ac-empty">
                {activity.length === 0
                  ? "Noch keine Transaktionen synchronisiert."
                  : "Keine Treffer."}
              </td></tr>
            )}
            {filtered.slice(0, 100).map(t => {
              const sm = STATUS_META[t.status] || STATUS_META.unknown;
              return (
                <tr key={t.id}>
                  <td className="ac-mono" style={{ whiteSpace:"nowrap" }}>
                    {(t.date || "").slice(0, 10) || "—"}
                  </td>
                  <td style={{ maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:500 }}>
                    {t.vendor || "—"}
                  </td>
                  <td style={{ maxWidth:260, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"var(--ink2)", fontSize:".82rem" }}>
                    {t.description || "—"}
                  </td>
                  <td>
                    <span className="ac-badge" style={{ background:`${sm.color}20`, color:sm.color }}>
                      {sm.label}
                    </span>
                  </td>
                  <td className="ac-mono" style={{ textAlign:"right", fontWeight:600 }}>
                    {fmtEur(t.amount)}
                    {t.currency && t.currency !== "EUR" && (
                      <span style={{ fontSize:".72rem", color:"var(--ink2)", marginLeft:4 }}>{t.currency}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length > 100 && (
          <div style={{ textAlign:"center", padding:12, color:"var(--ink2)", fontSize:".82rem" }}>
            + {filtered.length - 100} weitere (Suchfilter verfeinern)
          </div>
        )}
      </div>
    </div>
  );
}
