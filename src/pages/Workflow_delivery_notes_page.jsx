import { useEffect, useState, useRef } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";

const statusLabel = { pending: "Ausstehend", confirmed: "Bestätigt", rejected: "Abgelehnt" };
const statusColor = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected:  "bg-red-500/10 text-red-400 border-red-500/20",
};

const inputCls = "w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-lg text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[rgba(197,165,114,0.4)] transition-all";

// ── Bestätigungs-Modal ────────────────────────────────────────────────
function ConfirmModal({ note, inventoryItems, onConfirm, onReject, onClose }) {
  const [items, setItems] = useState(
    (note?.items || []).map(i => ({
      ...i,
      inventory_item_id: i.inventory_item_id || null,
      quantity: i.quantity || 1,
    }))
  );

  if (!note) return null;

  function updateItem(idx, key, val) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [key]: val } : it));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="bg-[#0d1628] border border-[rgba(255,255,255,0.1)] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.07)]">
          <div>
            <h2 className="text-white font-bold">Lieferschein bestätigen</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {note.supplier || "Unbekannter Lieferant"}
              {note.delivery_number && ` · Nr. ${note.delivery_number}`}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <p className="text-xs text-slate-500 mb-2">
            Bitte prüfe die erkannten Positionen. Du kannst Mengen anpassen und Artikel zuordnen.
          </p>
          {items.map((item, idx) => (
            <div key={idx} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.matched ? "bg-green-400" : "bg-amber-400"}`}/>
                <span className="text-white text-sm font-medium">{item.name}</span>
                {item.matched && <span className="text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">✓ Gefunden</span>}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1">Menge</label>
                  <input type="number" value={item.quantity} min="0" step="0.1"
                    onChange={e => updateItem(idx, "quantity", parseFloat(e.target.value))}
                    className={inputCls}/>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1">Einheit</label>
                  <input value={item.unit || "Stück"} onChange={e => updateItem(idx, "unit", e.target.value)}
                    className={inputCls}/>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1">Inventar-Artikel</label>
                  <select value={item.inventory_item_id || ""}
                    onChange={e => updateItem(idx, "inventory_item_id", e.target.value || null)}
                    className={inputCls}>
                    <option value="">+ Neu anlegen</option>
                    {inventoryItems.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.name} ({inv.quantity} {inv.unit})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between px-6 py-4 border-t border-[rgba(255,255,255,0.07)]">
          <button onClick={() => onReject(note.delivery_note_id || note.id)}
            className="px-4 py-2 text-sm text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all">
            Ablehnen
          </button>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5">
              Abbrechen
            </button>
            <button onClick={() => onConfirm(note.delivery_note_id || note.id, items)}
              className="px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all">
              ✓ Bestätigen & Inventar updaten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inventar-Tab ──────────────────────────────────────────────────────
function InventoryTab({ items, onRefresh }) {
  const [newItem, setNewItem] = useState({ name:"", unit:"Stück", quantity:0, category:"", location:"" });
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!newItem.name.trim()) return;
    setSaving(true);
    try {
      await api.post("/inventory/items", newItem);
      setNewItem({ name:"", unit:"Stück", quantity:0, category:"", location:"" });
      setAdding(false);
      onRefresh();
    } catch(e) { console.error(e); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Artikel löschen?")) return;
    try { await api.delete(`/inventory/items/${id}`); onRefresh(); }
    catch(e) { console.error(e); }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-slate-400 text-sm">{items.length} Artikel im Inventar</p>
        <button onClick={() => setAdding(v => !v)}
          className="px-3 py-1.5 text-sm font-semibold bg-[#C5A572] hover:opacity-90 text-black rounded-lg">
          + Artikel hinzufügen
        </button>
      </div>

      {adding && (
        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(197,165,114,0.2)] rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C5A572]">Neuer Artikel</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-600 mb-1">Name *</label>
              <input value={newItem.name} onChange={e => setNewItem(f=>({...f,name:e.target.value}))}
                placeholder="z.B. Motoröl 5W-40" className={inputCls}/>
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 mb-1">Einheit</label>
              <input value={newItem.unit} onChange={e => setNewItem(f=>({...f,unit:e.target.value}))}
                placeholder="Stück, Liter, kg..." className={inputCls}/>
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 mb-1">Anfangsbestand</label>
              <input type="number" value={newItem.quantity} onChange={e => setNewItem(f=>({...f,quantity:parseFloat(e.target.value)||0}))}
                className={inputCls}/>
            </div>
            <div>
              <label className="block text-[10px] text-slate-600 mb-1">Kategorie</label>
              <input value={newItem.category} onChange={e => setNewItem(f=>({...f,category:e.target.value}))}
                placeholder="z.B. Öle, Ersatzteile..." className={inputCls}/>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5">Abbrechen</button>
            <button onClick={handleAdd} disabled={saving || !newItem.name.trim()}
              className="px-4 py-1.5 text-sm font-semibold bg-[#C5A572] hover:opacity-90 disabled:opacity-50 text-black rounded-lg">
              {saving ? "..." : "Speichern"}
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-10 text-slate-600 text-sm border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
          Noch keine Artikel. Füge deinen ersten Inventar-Artikel hinzu.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-all">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📦</div>
                <div>
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-slate-500 text-xs">{item.category || "Keine Kategorie"} · {item.location || "Kein Lagerort"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-sm font-bold ${parseFloat(item.quantity) <= parseFloat(item.min_quantity||0) ? "text-red-400" : "text-white"}`}>
                    {parseFloat(item.quantity).toLocaleString("de-DE")} {item.unit}
                  </p>
                  {item.min_quantity > 0 && (
                    <p className="text-[10px] text-slate-600">Min: {item.min_quantity} {item.unit}</p>
                  )}
                </div>
                <button onClick={() => handleDelete(item.id)}
                  className="text-slate-600 hover:text-red-400 transition-colors text-xs">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Haupt-Komponente ──────────────────────────────────────────────────
export default function DeliveryNotesPage() {
  const [tab, setTab]                   = useState("notes"); // notes | inventory
  const [notes, setNotes]               = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [analyzing, setAnalyzing]       = useState(false);
  const [confirmNote, setConfirmNote]   = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError]               = useState(null);
  const fileRef                         = useRef();

  useEffect(() => { fetchAll(); }, [statusFilter]);

  async function fetchAll() {
    setLoading(true);
    try {
      const [nr, ir] = await Promise.all([
        api.get("/inventory/delivery-notes", { params: statusFilter ? { status: statusFilter } : {} }),
        api.get("/inventory/items"),
      ]);
      setNotes(nr.data?.delivery_notes || []);
      setInventoryItems(ir.data?.items || []);
    } catch(e) { setError("Laden fehlgeschlagen."); }
    finally { setLoading(false); }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/inventory/delivery-notes/from-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res.data?.is_delivery_note) {
        setError("Kein Lieferschein erkannt. Bitte ein klareres Bild hochladen.");
        return;
      }
      await fetchAll();
      // Direkt zur Bestätigung öffnen
      setConfirmNote(res.data);
    } catch(e) { setError("Analyse fehlgeschlagen."); }
    finally { setAnalyzing(false); e.target.value = ""; }
  }

  async function handleConfirm(noteId, items) {
    try {
      await api.post(`/inventory/delivery-notes/${noteId}/confirm`, { items });
      setConfirmNote(null);
      await fetchAll();
    } catch(e) { console.error(e); }
  }

  async function handleReject(noteId) {
    try {
      await api.post(`/inventory/delivery-notes/${noteId}/reject`);
      setConfirmNote(null);
      await fetchAll();
    } catch(e) { console.error(e); }
  }

  const pendingCount = notes.filter(n => n.status === "pending").length;

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Lieferscheine & Inventar</h1>
          <p className="text-slate-500 text-sm mt-1">KI-gestützte Lieferscheinerkennung und Bestandsverwaltung</p>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={analyzing}
          className="px-4 py-2 text-sm font-semibold bg-[#C5A572] hover:opacity-90 disabled:opacity-50 text-black rounded-lg flex items-center gap-2">
          {analyzing ? <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>Analysiere...</> : "📷 Foto hochladen"}
        </button>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleImageUpload}/>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "notes", label: `Lieferscheine${pendingCount > 0 ? ` (${pendingCount} offen)` : ""}` },
          { key: "inventory", label: `Inventar (${inventoryItems.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              tab === t.key
                ? "bg-[rgba(197,165,114,0.15)] border-[rgba(197,165,114,0.4)] text-[#C5A572]"
                : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-slate-500 hover:text-slate-300"
            }`}>{t.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-500 py-10 justify-center">
          <span className="w-5 h-5 border-2 border-[#C5A572] border-t-transparent rounded-full animate-spin"/>
          Lädt...
        </div>
      ) : tab === "inventory" ? (
        <InventoryTab items={inventoryItems} onRefresh={fetchAll}/>
      ) : (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2">
            {["", "pending", "confirmed", "rejected"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  statusFilter === s
                    ? "bg-[rgba(197,165,114,0.15)] border-[rgba(197,165,114,0.4)] text-[#C5A572]"
                    : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-slate-500 hover:text-slate-300"
                }`}>
                {s === "" ? "Alle" : statusLabel[s]}
              </button>
            ))}
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-12 text-slate-600 border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm">Noch keine Lieferscheine</p>
              <p className="text-xs mt-1">Lade ein Foto hoch oder öffne eine Email mit Lieferschein</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map(note => (
                <div key={note.id} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.05)] transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{note.source === "photo" ? "📷" : "✉️"}</span>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm">{note.supplier || "Unbekannter Lieferant"}</p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {note.delivery_number && `Nr. ${note.delivery_number} · `}
                          {note.delivery_date || new Date(note.created_at).toLocaleDateString("de-DE")}
                          {" · "}{note.items?.length || 0} Position{note.items?.length !== 1 ? "en" : ""}
                        </p>
                        {/* Positionen Vorschau */}
                        {note.items?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {note.items.slice(0,3).map((item, i) => (
                              <span key={i} className="text-[10px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-full px-2 py-0.5 text-slate-400">
                                {item.quantity} {item.unit} {item.name}
                              </span>
                            ))}
                            {note.items.length > 3 && (
                              <span className="text-[10px] text-slate-600">+{note.items.length - 3} weitere</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColor[note.status]}`}>
                        {statusLabel[note.status]}
                      </span>
                      {note.status === "pending" && (
                        <button onClick={() => setConfirmNote(note)}
                          className="px-3 py-1.5 text-xs font-semibold bg-[rgba(197,165,114,0.15)] border border-[rgba(197,165,114,0.3)] text-[#C5A572] rounded-lg hover:bg-[rgba(197,165,114,0.25)] transition-all">
                          Prüfen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bestätigungs-Modal */}
      {confirmNote && (
        <ConfirmModal
          note={confirmNote}
          inventoryItems={inventoryItems}
          onConfirm={handleConfirm}
          onReject={handleReject}
          onClose={() => setConfirmNote(null)}
        />
      )}
    </PageLayout>
  );
}
