// src/components/accounting/BankSyncTab.jsx — Bank-Sync / Kontoabgleich
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

export default function BankSyncTab() {
  const [transactions, setTransactions] = useState([]);
  const [balance,      setBalance]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [syncing,      setSyncing]      = useState(false);
  const [msg,          setMsg]          = useState(null);
  const [filter,       setFilter]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busy,         setBusy]         = useState({});
  const [matchInput,   setMatchInput]   = useState({});

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/v1/bank/transactions", { params: { limit: 100 } }),
      api.get("/api/v1/bank/balance").catch(() => null),
    ])
      .then(([t, b]) => {
        setTransactions(t.data?.transactions || t.data || []);
        setBalance(b?.data?.balance ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const sync = async () => {
    setSyncing(true);
    setMsg(null);
    try {
      await api.post("/api/v1/bank/sync");
      setMsg({ type: "ok", text: "Sync erfolgreich — Transaktionen aktualisiert." });
      load();
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Sync fehlgeschlagen. Bank-Verbindung prüfen." });
    } finally { setSyncing(false); }
  };

  const matchTx = async (txId) => {
    const rid = parseInt(matchInput[txId]);
    if (!rid) { alert("Rechnungs-ID eingeben."); return; }
    setBusy(b => ({ ...b, [txId]: true }));
    try {
      await api.post(`/api/v1/bank/transactions/${txId}/match`, { rechnung_id: rid });
      setMatchInput(m => ({ ...m, [txId]: "" }));
      load();
    } catch (e) {
      alert(e.response?.data?.detail || "Zuordnung fehlgeschlagen.");
    } finally { setBusy(b => ({ ...b, [txId]: false })); }
  };

  const unmatch = async (txId) => {
    setBusy(b => ({ ...b, [txId]: true }));
    try {
      await api.delete(`/api/v1/bank/transactions/${txId}/match`);
      load();
    } catch { alert("Fehler beim Aufheben."); }
    finally { setBusy(b => ({ ...b, [txId]: false })); }
  };

  const shown = transactions.filter(tx => {
    const q = filter.toLowerCase();
    const matchText = !q || [tx.description, tx.vendor, String(tx.amount)]
      .some(s => (s || "").toLowerCase().includes(q));
    const matchStatus = !statusFilter || tx.status === statusFilter;
    return matchText && matchStatus;
  });

  if (loading) return <div className="ac-loading"><span className="ac-spinner" />Lade Transaktionen…</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        {balance !== null && (
          <div style={{
            padding: "8px 16px", background: "var(--surface2)",
            borderRadius: 10, fontFamily: "JetBrains Mono, monospace",
          }}>
            <span style={{ fontSize: ".72rem", color: "var(--ink2)", textTransform: "uppercase" }}>
              Saldo{" "}
            </span>
            <span style={{ fontWeight: 700, color: balance >= 0 ? "var(--accent)" : "var(--a3)" }}>
              {fmtEur(balance)}
            </span>
          </div>
        )}
        <input className="ac-input" style={{ maxWidth: 220 }}
          placeholder="Suche Transaktion…"
          value={filter} onChange={e => setFilter(e.target.value)} />
        <select className="ac-select" value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Alle</option>
          <option value="matched">Zugeordnet</option>
          <option value="unmatched">Nicht zugeordnet</option>
        </select>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={load}>↺</button>
        <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={sync} disabled={syncing}
          style={{ marginLeft: "auto" }}>
          {syncing ? "Sync läuft…" : "⟳ Bank synchronisieren"}
        </button>
      </div>

      {msg && (
        <div className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
          style={{ marginBottom: 14, cursor: "pointer" }} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      {shown.length === 0 ? (
        <div className="ac-card">
          <div className="ac-empty">
            {transactions.length === 0
              ? "Keine Transaktionen. Bank verbinden und synchronisieren."
              : "Keine Treffer für den Filter."}
          </div>
        </div>
      ) : (
        <div className="ac-card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="ac-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Beschreibung</th>
                <th style={{ textAlign: "right" }}>Betrag</th>
                <th>Status</th>
                <th>Rechnung</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(tx => (
                <tr key={tx.id}>
                  <td className="ac-mono">{tx.date || "—"}</td>
                  <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {tx.description || tx.vendor || "—"}
                  </td>
                  <td className="ac-mono" style={{
                    textAlign: "right", fontWeight: 600,
                    color: tx.amount >= 0 ? "var(--accent)" : "var(--a3)",
                  }}>
                    {fmtEur(tx.amount)}
                  </td>
                  <td>
                    {tx.matched_invoice_id
                      ? <span className="ac-badge ac-badge-green" style={{ fontSize: ".7rem" }}>Zugeordnet</span>
                      : <span className="ac-badge ac-badge-gray"  style={{ fontSize: ".7rem" }}>Offen</span>}
                  </td>
                  <td className="ac-mono" style={{ color: "var(--ink2)", fontSize: ".82rem" }}>
                    {tx.matched_invoice_id ? `#${tx.matched_invoice_id}` : "—"}
                  </td>
                  <td>
                    {tx.matched_invoice_id ? (
                      <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={busy[tx.id]}
                        style={{ color: "var(--a3)" }} onClick={() => unmatch(tx.id)}>
                        Aufheben
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <input
                          className="ac-input ac-mono"
                          style={{ width: 70, padding: "4px 8px", fontSize: ".8rem" }}
                          type="number"
                          placeholder="RE-ID"
                          value={matchInput[tx.id] || ""}
                          onChange={e => setMatchInput(m => ({ ...m, [tx.id]: e.target.value }))}
                          onKeyDown={e => e.key === "Enter" && matchTx(tx.id)}
                        />
                        <button className="ac-btn ac-btn-primary ac-btn-sm" disabled={busy[tx.id]}
                          onClick={() => matchTx(tx.id)}>
                          Zuordnen
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{
        marginTop: 20, padding: "12px 16px",
        background: "rgba(198,255,60,.05)", border: "1px solid rgba(198,255,60,.12)",
        borderRadius: 10, fontSize: ".8rem", color: "var(--ink2)", lineHeight: 1.6,
      }}>
        Bank-Sync über <strong style={{ color: "var(--ink)" }}>TrueLayer</strong> (PSD2 Open Banking).
        Transaktionen werden deinen Ausgangsrechnungen zugeordnet und automatisch als bezahlt markiert.
      </div>
    </div>
  );
}
