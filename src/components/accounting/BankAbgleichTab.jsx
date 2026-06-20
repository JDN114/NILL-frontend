import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const EUR = (n) =>
  Number(n || 0).toLocaleString("de-DE", {
    minimumFractionDigits: 2, maximumFractionDigits: 2, style: "currency", currency: "EUR",
  });

const DATE = (d) => d ? new Date(d).toLocaleDateString("de-DE") : "—";

const STATUS_BADGE = {
  offen:       { label: "Offen",        bg: "rgba(255,180,0,.15)",  col: "#ffb400" },
  abgeglichen: { label: "Abgeglichen",  bg: "rgba(100,220,120,.15)", col: "#44cc66" },
  gecleared:   { label: "Gecleared",    bg: "rgba(100,160,255,.15)", col: "#6699ff" },
  ignoriert:   { label: "Ignoriert",    bg: "rgba(160,160,160,.15)", col: "#999" },
};

const FILTERS = ["offen", "abgeglichen", "gecleared", ""];

// ── Konfidenz-Balken ──────────────────────────────────────────────────────────
function KonfidenzBar({ score = 0 }) {
  const pct = Math.min(100, Math.max(0, score));
  const col = pct >= 70 ? "#44cc66" : pct >= 40 ? "#ffb400" : "#ff6655";
  const label = pct >= 70 ? "hoch" : pct >= 40 ? "mittel" : "niedrig";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}
         aria-label={`Konfidenz: ${pct}% (${label})`}>
      <div style={{
        flex: 1, height: 5, background: "rgba(var(--tint),.08)",
        borderRadius: 3, overflow: "hidden",
      }} aria-hidden="true">
        <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: ".7rem", fontFamily: "JetBrains Mono,monospace",
                     minWidth: 28, textAlign: "right" }} aria-hidden="true">
        <span style={{ color: col }}>{pct}%</span>
        {" "}<span style={{ color: "var(--ink2)", fontSize: ".65rem" }}>({label})</span>
      </span>
    </div>
  );
}

// ── Kandidaten-Panel ──────────────────────────────────────────────────────────
function KandidatenPanel({ tx, onMatched }) {
  const [busy, setBusy] = useState(null);
  const [clearNote, setClearNote] = useState("");
  const [showClear, setShowClear] = useState(false);

  const doMatch = async (k) => {
    setBusy(k.id);
    try {
      const endpoint = k.typ === "invoice"
        ? `/bank/abgleich/${tx.id}/match-invoice`
        : `/bank/abgleich/${tx.id}/match-buchung`;
      const body = k.typ === "invoice"
        ? { invoice_id: k.id }
        : { buchungssatz_id: k.id };
      await api.post(endpoint, body);
      onMatched();
    } catch (e) {
      alert(`Fehler: ${e?.response?.data?.detail || e.message}`);
    } finally {
      setBusy(null);
    }
  };

  const doClear = async () => {
    setBusy("clear");
    try {
      await api.post(`/bank/abgleich/${tx.id}/clear`, { notiz: clearNote });
      onMatched();
    } catch (e) {
      alert(`Fehler: ${e?.response?.data?.detail || e.message}`);
    } finally {
      setBusy(null);
    }
  };

  const kandidaten = tx.kandidaten || [];

  return (
    <div style={{ padding: "10px 14px", background: "rgba(var(--tint),.025)",
                  borderTop: "1px solid var(--border)" }}>
      {kandidaten.length === 0 ? (
        <div style={{ color: "var(--ink2)", fontSize: ".78rem", padding: "4px 0" }}>
          Keine passenden Belege gefunden.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: ".72rem", color: "var(--ink2)",
                        letterSpacing: ".05em", textTransform: "uppercase",
                        marginBottom: 2 }}>Vorgeschlagene Zuordnungen</div>
          {kandidaten.map((k) => (
            <div key={`${k.typ}-${k.id}`} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "6px 10px", borderRadius: 6,
              background: "rgba(var(--tint),.03)",
              border: "1px solid var(--border)",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: ".8rem", color: "var(--ink)",
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {k.bezeichnung}
                </div>
                <div style={{ fontSize: ".72rem", color: "var(--ink2)", marginTop: 1 }}>
                  {EUR(k.betrag)} · {DATE(k.datum)} · {k.typ === "invoice" ? "Rechnung" : "Buchung"}
                  {k.referenz && ` · ${k.referenz}`}
                </div>
                <KonfidenzBar score={k.konfidenz} />
              </div>
              <button
                disabled={busy !== null}
                onClick={() => doMatch(k)}
                style={{
                  padding: "4px 12px", borderRadius: 5, border: "none",
                  background: busy === k.id ? "rgba(100,220,120,.2)" : "rgba(100,220,120,.12)",
                  color: "#44cc66", cursor: "pointer", fontSize: ".75rem", fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {busy === k.id ? "…" : "Zuordnen"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 8, borderTop: "1px solid var(--border)", paddingTop: 8 }}>
        {showClear ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              placeholder="Notiz (optional, z.B. Kontoführungsgebühr)"
              value={clearNote}
              onChange={(e) => setClearNote(e.target.value)}
              style={{
                flex: 1, padding: "4px 8px", borderRadius: 5,
                background: "var(--surface)", border: "1px solid var(--border)",
                color: "var(--ink)", fontSize: ".78rem",
              }}
            />
            <button
              disabled={busy !== null}
              onClick={doClear}
              style={{
                padding: "4px 12px", borderRadius: 5, border: "none",
                background: "rgba(100,160,255,.15)", color: "#6699ff",
                cursor: "pointer", fontSize: ".75rem",
              }}
            >
              {busy === "clear" ? "…" : "Bestätigen"}
            </button>
            <button
              onClick={() => setShowClear(false)}
              style={{
                padding: "4px 8px", borderRadius: 5, border: "1px solid var(--border)",
                background: "transparent", color: "var(--ink2)", cursor: "pointer", fontSize: ".75rem",
              }}
            >
              Abbrechen
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowClear(true)}
            style={{
              padding: "4px 12px", borderRadius: 5, border: "1px solid var(--border)",
              background: "transparent", color: "var(--ink2)", cursor: "pointer", fontSize: ".75rem",
            }}
          >
            Ohne Beleg clearen
          </button>
        )}
      </div>
    </div>
  );
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export default function BankAbgleichTab() {
  const [filter, setFilter]         = useState("offen");
  const [data, setData]             = useState(null);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage]             = useState(0);
  const PER_PAGE = 25;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        api.get("/bank/abgleich", {
          params: { status: filter || undefined, limit: PER_PAGE, offset: page * PER_PAGE },
        }),
        api.get("/bank/abgleich/status"),
      ]);
      setData(listRes.data);
      setStats(statsRes.data);
    } catch (e) {
      console.error("Bank-Abgleich Ladefehler:", e);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { setPage(0); }, [filter]);
  useEffect(() => { load(); }, [load]);

  const doUnmatch = async (txId) => {
    try {
      await api.delete(`/bank/abgleich/${txId}/match`);
      load();
    } catch (e) {
      alert(`Fehler: ${e?.response?.data?.detail || e.message}`);
    }
  };

  const txList = data?.transaktionen || [];
  const total  = data?.total || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Stats ── */}
      {stats && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Offen",       val: stats.offen,       col: "#ffb400" },
            { label: "Abgeglichen", val: stats.abgeglichen, col: "#44cc66" },
            { label: "Gecleared",   val: stats.gecleared,   col: "#6699ff" },
            { label: "Abgleich-Quote", val: `${stats.abgleich_quote}%`, col: "var(--accent)" },
          ].map((s) => (
            <div key={s.label} style={{
              padding: "8px 16px", borderRadius: 8,
              background: "var(--surface)", border: "1px solid var(--border)",
              minWidth: 100,
            }}>
              <div style={{ fontSize: ".68rem", color: "var(--ink2)",
                            textTransform: "uppercase", letterSpacing: ".06em" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: s.col,
                            fontFamily: "JetBrains Mono,monospace" }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filter ── */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f || "alle"}
            onClick={() => setFilter(f)}
            style={{
              padding: "4px 12px", borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: ".75rem", fontWeight: filter === f ? 700 : 400,
              background: filter === f ? "var(--accent)" : "rgba(var(--tint),.06)",
              color: filter === f ? "#000" : "var(--ink2)",
            }}
          >
            {f === "" ? "Alle" : STATUS_BADGE[f]?.label || f}
          </button>
        ))}
      </div>

      {/* ── Liste ── */}
      {loading && (
        <div style={{ color: "var(--ink2)", fontSize: ".8rem", padding: "20px 0" }}>
          Lade Transaktionen…
        </div>
      )}

      {!loading && txList.length === 0 && (
        <div style={{
          padding: "40px 20px", textAlign: "center",
          color: "var(--ink2)", fontSize: ".85rem",
        }}>
          Keine Transaktionen mit Status &quot;{STATUS_BADGE[filter]?.label || filter || "Alle"}&quot;.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {txList.map((tx) => {
          const expanded  = expandedId === tx.id;
          const badge     = STATUS_BADGE[tx.abgleich_status] || STATUS_BADGE.offen;
          const isIncome  = parseFloat(tx.amount || 0) > 0;

          return (
            <div key={tx.id} style={{
              border: "1px solid var(--border)", borderRadius: 8,
              overflow: "hidden", background: "var(--surface)",
            }}>
              {/* Row */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                aria-label={`Transaktion ${tx.vendor_name || tx.description || "—"} ${EUR(tx.amount)} – ${expanded ? "zuklappen" : "aufklappen"}`}
                onClick={() => setExpandedId(expanded ? null : tx.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedId(expanded ? null : tx.id); } }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", cursor: "pointer",
                  background: expanded ? "rgba(var(--tint),.04)" : "transparent",
                }}
              >
                {/* Datum */}
                <div style={{ minWidth: 80, fontSize: ".78rem",
                               color: "var(--ink2)", flexShrink: 0 }}>
                  {DATE(tx.transaction_date)}
                </div>

                {/* Vendor + Description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: ".85rem", color: "var(--ink)",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tx.vendor_name || tx.description || "—"}
                  </div>
                  {tx.description && tx.vendor_name && (
                    <div style={{ fontSize: ".72rem", color: "var(--ink2)",
                                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {tx.description}
                    </div>
                  )}
                </div>

                {/* Betrag */}
                <div style={{
                  fontSize: ".9rem", fontWeight: 700, flexShrink: 0,
                  fontFamily: "JetBrains Mono,monospace",
                  color: isIncome ? "#44cc66" : "#ff6655",
                }}>
                  {isIncome ? "+" : ""}{EUR(tx.amount)}
                </div>

                {/* Status */}
                <div style={{
                  padding: "2px 8px", borderRadius: 10, flexShrink: 0,
                  background: badge.bg, color: badge.col,
                  fontSize: ".7rem", fontWeight: 600,
                }}>
                  {badge.label}
                </div>

                {/* Unmatch (wenn abgeglichen) */}
                {(tx.abgleich_status === "abgeglichen" || tx.abgleich_status === "gecleared") && (
                  <button
                    onClick={(e) => { e.stopPropagation(); doUnmatch(tx.id); }}
                    style={{
                      padding: "2px 8px", borderRadius: 5, flexShrink: 0,
                      border: "1px solid var(--border)", background: "transparent",
                      color: "var(--ink2)", cursor: "pointer", fontSize: ".7rem",
                    }}
                    title="Zuordnung aufheben"
                  >
                    ↩
                  </button>
                )}

                {/* Expand chevron */}
                {tx.abgleich_status === "offen" && (
                  <div style={{ color: "var(--ink2)", fontSize: ".75rem", flexShrink: 0 }}>
                    {expanded ? "▲" : "▼"}
                  </div>
                )}
              </div>

              {/* Kandidaten-Panel */}
              {expanded && tx.abgleich_status === "offen" && (
                <KandidatenPanel tx={tx} onMatched={load} />
              )}

              {/* Abgleich-Info wenn bereits zugeordnet */}
              {expanded && tx.abgleich_status !== "offen" && (
                <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border)",
                               fontSize: ".76rem", color: "var(--ink2)" }}>
                  {tx.abgleich_typ === "invoice" && `Rechnung #${tx.abgleich_ref_id}`}
                  {tx.abgleich_typ === "buchungssatz" && `Buchungssatz #${tx.abgleich_ref_id}`}
                  {tx.abgleich_typ === "manuell" && "Manuell gecleared"}
                  {tx.abgleich_notiz && ` — ${tx.abgleich_notiz}`}
                  {tx.abgleich_am && ` (${DATE(tx.abgleich_am)})`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      {total > PER_PAGE && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 4 }}>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            style={{
              padding: "4px 12px", borderRadius: 5,
              border: "1px solid var(--border)", background: "transparent",
              color: page === 0 ? "var(--ink2)" : "var(--ink)", cursor: page === 0 ? "default" : "pointer",
            }}
          >
            ← Zurück
          </button>
          <span style={{ alignSelf: "center", fontSize: ".78rem", color: "var(--ink2)" }}>
            {page + 1} / {Math.ceil(total / PER_PAGE)}
          </span>
          <button
            disabled={(page + 1) * PER_PAGE >= total}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "4px 12px", borderRadius: 5,
              border: "1px solid var(--border)", background: "transparent",
              color: (page + 1) * PER_PAGE >= total ? "var(--ink2)" : "var(--ink)",
              cursor: (page + 1) * PER_PAGE >= total ? "default" : "pointer",
            }}
          >
            Weiter →
          </button>
        </div>
      )}
    </div>
  );
}
