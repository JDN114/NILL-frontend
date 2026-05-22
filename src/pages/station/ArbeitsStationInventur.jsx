import { useEffect, useState } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../lib/api";

const ACCENT = "#a78bfa";

function Spinner() {
  return (
    <div style={{
      width: 18, height: 18,
      border: "2px solid rgba(255,255,255,0.08)",
      borderTopColor: ACCENT, borderRadius: "50%",
      animation: "as-spin 0.75s linear infinite",
    }} />
  );
}

export default function ArbeitsStationInventur() {
  const [lists, setLists]               = useState([]);
  const [activeList, setActiveList]     = useState(null);
  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [busy, setBusy]                 = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await api.get("/inventory/lists");
        const l = r.data?.lists || [];
        setLists(l);
        if (l.length > 0) setActiveList(l[0]);
      } catch { setLists([]); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!activeList) return;
    (async () => {
      setLoadingItems(true);
      try {
        const r = await api.get(`/inventory/lists/${activeList.id}/items`);
        setItems(r.data?.items || []);
      } catch { setItems([]); }
      finally { setLoadingItems(false); }
    })();
  }, [activeList]);

  async function updateQty(item, delta) {
    const newQty = Math.max(0, parseFloat(item.quantity) + delta);
    setBusy(item.id);
    try {
      await api.patch(`/inventory/items/${item.id}/quantity`, { quantity: newQty });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i));
    } catch {}
    finally { setBusy(null); }
  }

  const lowStock = items.filter(
    i => i.min_quantity > 0 && parseFloat(i.quantity) <= parseFloat(i.min_quantity)
  );

  return (
    <ArbeitsStationLayout title="Inventur" icon="◫" accent={ACCENT} maxWidth={1020}>
      <style>{`@keyframes as-spin { to { transform: rotate(360deg); } }`}</style>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}><Spinner /></div>
      ) : lists.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          border: "1px solid rgba(239,237,231,0.06)", borderRadius: 20,
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>◫</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "rgba(239,237,231,0.4)" }}>
            Keine Inventarlisten vorhanden
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 20, height: "100%" }}>

          {/* Listen-Sidebar */}
          <div style={{ width: 190, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {lists.map(list => (
              <button key={list.id} onClick={() => setActiveList(list)} style={{
                padding: "12px 14px", borderRadius: 14, textAlign: "left", cursor: "pointer",
                border: activeList?.id === list.id
                  ? "1px solid rgba(167,139,250,0.4)"
                  : "1px solid rgba(239,237,231,0.07)",
                background: activeList?.id === list.id
                  ? "rgba(167,139,250,0.1)"
                  : "rgba(255,255,255,0.03)",
                transition: "background 0.15s, border-color 0.15s",
              }}>
                <div style={{ fontSize: "1.2rem", marginBottom: 4 }}>{list.icon}</div>
                <div style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "0.9rem", color: "#efede7", letterSpacing: "-0.01em", lineHeight: 1.2,
                }}>{list.name}</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.58rem", color: "rgba(239,237,231,0.35)", marginTop: 4,
                }}>{list.item_count || 0} Artikel</div>
              </button>
            ))}
          </div>

          {/* Artikel-Bereich */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Mindestbestand-Warnung */}
            {lowStock.length > 0 && (
              <div style={{
                padding: "10px 16px", borderRadius: 12, flexShrink: 0,
                border: "1px solid rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.06)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: "0.9rem" }}>⚠</span>
                <span style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.76rem", color: "#f87171",
                }}>
                  {lowStock.length} Artikel unter Mindestbestand:{" "}
                  <strong>{lowStock.map(i => i.name).join(", ")}</strong>
                </span>
              </div>
            )}

            {loadingItems ? (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}><Spinner /></div>
            ) : items.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "3rem 2rem",
                border: "1px solid rgba(239,237,231,0.06)", borderRadius: 20,
                background: "rgba(255,255,255,0.02)",
              }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", color: "rgba(239,237,231,0.4)" }}>
                  Keine Artikel in dieser Liste
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Spaltenheader */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 170px 110px 110px",
                  gap: 12, padding: "0 16px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.56rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.12em",
                  color: "rgba(239,237,231,0.28)",
                }}>
                  <span>Artikel</span>
                  <span style={{ textAlign: "center" }}>Bestand</span>
                  <span>Kategorie</span>
                  <span>Ort</span>
                </div>

                {items.map(item => {
                  const qty   = parseFloat(item.quantity);
                  const minQ  = parseFloat(item.min_quantity || 0);
                  const isLow = item.min_quantity > 0 && qty <= minQ;
                  const isBusy = busy === item.id;

                  return (
                    <div key={item.id} style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 170px 110px 110px",
                      gap: 12, alignItems: "center",
                      padding: "12px 16px", borderRadius: 14,
                      border: `1px solid ${isLow ? "rgba(248,113,113,0.25)" : "rgba(239,237,231,0.07)"}`,
                      background: isLow ? "rgba(248,113,113,0.04)" : "rgba(255,255,255,0.025)",
                      transition: "border-color 0.15s",
                    }}>
                      <div>
                        <div style={{
                          fontFamily: "'Fraunces', Georgia, serif",
                          fontSize: "0.95rem", color: "#efede7", letterSpacing: "-0.01em",
                        }}>{item.name}</div>
                        {item.sku && (
                          <div style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.58rem", color: "rgba(239,237,231,0.28)", marginTop: 2,
                          }}>SKU: {item.sku}</div>
                        )}
                      </div>

                      {/* Mengen-Stepper */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <button
                          onClick={() => updateQty(item, -1)} disabled={isBusy}
                          style={{
                            width: 28, height: 28, borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.04)", color: "#efede7",
                            cursor: isBusy ? "not-allowed" : "pointer",
                            fontSize: "1rem", lineHeight: 1,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: isBusy ? 0.5 : 1,
                          }}
                        >−</button>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.9rem", fontWeight: 700,
                          color: isLow ? "#f87171" : "#efede7",
                          minWidth: 44, textAlign: "center",
                        }}>
                          {qty.toLocaleString("de-DE")}
                          <span style={{
                            fontSize: "0.6rem", fontWeight: 400,
                            color: "rgba(239,237,231,0.35)", marginLeft: 3,
                          }}>{item.unit}</span>
                        </span>
                        <button
                          onClick={() => updateQty(item, 1)} disabled={isBusy}
                          style={{
                            width: 28, height: 28, borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.04)", color: "#efede7",
                            cursor: isBusy ? "not-allowed" : "pointer",
                            fontSize: "1rem", lineHeight: 1,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: isBusy ? 0.5 : 1,
                          }}
                        >+</button>
                      </div>

                      <div style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: "0.72rem", color: "rgba(239,237,231,0.4)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{item.category || "—"}</div>
                      <div style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: "0.72rem", color: "rgba(239,237,231,0.4)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{item.location || "—"}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </ArbeitsStationLayout>
  );
}
