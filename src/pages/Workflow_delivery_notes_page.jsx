import { useEffect, useState, useRef } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";

// ── Helpers ───────────────────────────────────────────────────────────
const statusLabel = { pending:"Ausstehend", confirmed:"Bestätigt", rejected:"Abgelehnt" };
const statusColor = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected:  "bg-red-500/10 text-red-400 border-red-500/20",
};
const LIST_ICONS = ["📦","🧴","🌲","🛒","🔧","⚗️","📋","🏭","🚗","💊","🎨","🔩","📏","🧪","🏪"];
const DOC_ICONS  = ["📝","📊","🌡️","⚡","💧","🔬","📐","🗒️","📈","🔍","🧮","📉"];

const inputCls = "w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-lg text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-[rgba(197,165,114,0.4)] transition-all";
const labelCls = "block text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1";

function fmtUser(email) {
  if (!email) return "Unbekannt";
  return email.split("@")[0];
}
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("de-DE", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

// ── Modal Wrapper ─────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, maxWidth="max-w-xl" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`bg-[#0d1628] border border-[rgba(255,255,255,0.1)] rounded-xl w-full ${maxWidth} max-h-[90vh] flex flex-col shadow-2xl`} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.07)] flex-shrink-0">
          <h2 className="text-white font-bold text-base">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

// ── Icon Picker ───────────────────────────────────────────────────────
function IconPicker({ value, onChange, icons }) {
  return (
    <div className="flex flex-wrap gap-2">
      {icons.map(ic => (
        <button key={ic} onClick={() => onChange(ic)}
          className={`w-8 h-8 rounded-lg text-base transition-all ${value===ic ? "bg-[rgba(197,165,114,0.2)] border border-[rgba(197,165,114,0.4)]" : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.08)]"}`}>
          {ic}
        </button>
      ))}
    </div>
  );
}

// ── Lieferschein Bestätigungs-Modal ───────────────────────────────────
function ConfirmModal({ note, inventoryItems, onConfirm, onReject, onClose }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (note) setItems((note.items||[]).map(i => ({...i, quantity: i.quantity||1})));
  }, [note]);
  if (!note) return null;

  function updateItem(idx, key, val) {
    setItems(prev => prev.map((it,i) => i===idx ? {...it,[key]:val} : it));
  }

  return (
    <Modal open={!!note} onClose={onClose} title="Lieferschein prüfen & bestätigen" maxWidth="max-w-2xl">
      <p className="text-slate-500 text-xs mb-4">
        Von: <strong className="text-slate-300">{note.supplier||"Unbekannt"}</strong>
        {note.delivery_number && <> · Nr. {note.delivery_number}</>}
        {note.delivery_date && <> · {note.delivery_date}</>}
      </p>
      <div className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.matched?"bg-green-400":"bg-amber-400"}`}/>
              <span className="text-white text-sm font-medium">{item.name}</span>
              {item.matched && <span className="text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2">✓ Gefunden</span>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={labelCls}>Menge</label>
                <input type="number" value={item.quantity} min="0" step="0.1"
                  onChange={e=>updateItem(idx,"quantity",parseFloat(e.target.value))} className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Einheit</label>
                <input value={item.unit||"Stück"} onChange={e=>updateItem(idx,"unit",e.target.value)} className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Inventar-Artikel</label>
                <select value={item.inventory_item_id||""} onChange={e=>updateItem(idx,"inventory_item_id",e.target.value||null)} className={inputCls}>
                  <option value="">+ Neu anlegen</option>
                  {inventoryItems.map(inv => <option key={inv.id} value={inv.id}>{inv.name} ({inv.quantity} {inv.unit})</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button onClick={()=>onReject(note.delivery_note_id||note.id)}
          className="px-4 py-2 text-sm text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all">
          Ablehnen
        </button>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5">Abbrechen</button>
          <button onClick={()=>onConfirm(note.delivery_note_id||note.id, items)}
            className="px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg">
            ✓ Bestätigen & Inventar updaten
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Inventar-Tab ──────────────────────────────────────────────────────
function InventoryTab() {
  const [lists, setLists]       = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [items, setItems]       = useState([]);
  const [listModal, setListModal] = useState(null); // null|"new"|{...}
  const [itemModal, setItemModal] = useState(null);
  const [listForm, setListForm] = useState({ name:"", description:"", icon:"📦", color:"#C5A572" });
  const [itemForm, setItemForm] = useState({ name:"", unit:"Stück", quantity:0, min_quantity:0, category:"", location:"", price_per_unit:"", notes:"" });
  const [loading, setLoading]   = useState(false);

  useEffect(() => { fetchLists(); }, []);
  useEffect(() => { if (activeList) fetchItems(activeList.id); }, [activeList]);

  async function fetchLists() {
    try { const r = await api.get("/inventory/lists"); setLists(r.data?.lists||[]); }
    catch(e) { console.error(e); }
  }
  async function fetchItems(lid) {
    setLoading(true);
    try { const r = await api.get(`/inventory/lists/${lid}/items`); setItems(r.data?.items||[]); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function saveList() {
    if (!listForm.name.trim()) return;
    if (listModal?.id) await api.patch(`/inventory/lists/${listModal.id}`, listForm);
    else await api.post("/inventory/lists", listForm);
    await fetchLists(); setListModal(null);
  }

  async function deleteList(id) {
    if (!window.confirm("Liste und alle Artikel löschen?")) return;
    await api.delete(`/inventory/lists/${id}`);
    if (activeList?.id === id) setActiveList(null);
    await fetchLists();
  }

  async function saveItem() {
    if (!itemForm.name.trim() || !activeList) return;
    const payload = { ...itemForm, list_id: activeList.id };
    if (itemModal?.id) await api.patch(`/inventory/items/${itemModal.id}`, payload);
    else await api.post("/inventory/items", payload);
    await fetchItems(activeList.id); setItemModal(null);
  }

  async function updateQty(item, delta) {
    const newQty = Math.max(0, parseFloat(item.quantity) + delta);
    await api.patch(`/inventory/items/${item.id}/quantity`, { quantity: newQty });
    await fetchItems(activeList.id);
  }

  async function deleteItem(id) {
    await api.delete(`/inventory/items/${id}`);
    await fetchItems(activeList.id);
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Listen-Sidebar */}
      <div className="w-56 flex-shrink-0 space-y-2">
        <button onClick={() => { setListForm({name:"",description:"",icon:"📦",color:"#C5A572"}); setListModal("new"); }}
          className="w-full px-3 py-2 text-sm font-semibold bg-[#C5A572] hover:opacity-90 text-black rounded-lg mb-3">
          + Neue Liste
        </button>
        {lists.length === 0 && <p className="text-slate-600 text-xs text-center py-4">Noch keine Listen</p>}
        {lists.map(list => (
          <div key={list.id} onClick={() => setActiveList(list)}
            className={`cursor-pointer p-3 rounded-xl border transition-all group ${activeList?.id===list.id ? "border-[rgba(197,165,114,0.4)] bg-[rgba(197,165,114,0.1)]" : "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span>{list.icon}</span>
                <span className="text-sm text-white font-medium truncate">{list.name}</span>
              </div>
              <button onClick={e=>{e.stopPropagation(); setListForm({name:list.name,description:list.description||"",icon:list.icon,color:list.color}); setListModal(list);}}
                className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-[#C5A572] text-xs transition-all">✏️</button>
            </div>
            <p className="text-[10px] text-slate-600 mt-1">{list.item_count||0} Artikel</p>
            {list.updated_by_email && (
              <p className="text-[10px] text-slate-700 mt-0.5">
                {fmtUser(list.updated_by_email)} · {fmtDate(list.updated_at).split(",")[0]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Artikel-Bereich */}
      <div className="flex-1 min-w-0">
        {!activeList ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
            <span className="text-4xl mb-3">📦</span>
            <p className="text-sm">Wähle eine Liste aus</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeList.icon}</span>
                <div>
                  <h3 className="text-white font-bold">{activeList.name}</h3>
                  {activeList.description && <p className="text-slate-500 text-xs">{activeList.description}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>deleteList(activeList.id)}
                  className="px-3 py-1.5 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10">
                  Liste löschen
                </button>
                <button onClick={()=>{ setItemForm({name:"",unit:"Stück",quantity:0,min_quantity:0,category:"",location:"",price_per_unit:"",notes:""}); setItemModal("new"); }}
                  className="px-3 py-1.5 text-sm font-semibold bg-[#C5A572] hover:opacity-90 text-black rounded-lg">
                  + Artikel
                </button>
              </div>
            </div>

            {loading ? <p className="text-slate-500 text-sm">Lädt...</p> :
             items.length === 0 ? (
              <div className="text-center py-10 text-slate-600 text-sm border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
                Noch keine Artikel in dieser Liste
              </div>
            ) : (
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  <div className="col-span-4">Artikel</div>
                  <div className="col-span-2 text-center">Bestand</div>
                  <div className="col-span-2">Kategorie</div>
                  <div className="col-span-2">Ort</div>
                  <div className="col-span-2">Zuletzt geändert</div>
                </div>
                {items.map(item => (
                  <div key={item.id} className={`grid grid-cols-12 gap-2 items-center p-3 rounded-xl border transition-all group ${parseFloat(item.quantity)<=parseFloat(item.min_quantity||0)&&item.min_quantity>0 ? "border-red-500/20 bg-red-500/5" : "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]"}`}>
                    <div className="col-span-4">
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      {item.sku && <p className="text-slate-600 text-[10px]">SKU: {item.sku}</p>}
                    </div>
                    <div className="col-span-2 flex items-center justify-center gap-1">
                      <button onClick={()=>updateQty(item,-1)} className="w-6 h-6 rounded bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] text-slate-300 text-sm leading-none">−</button>
                      <span className={`text-sm font-bold mx-1 min-w-[40px] text-center ${parseFloat(item.quantity)<=parseFloat(item.min_quantity||0)&&item.min_quantity>0?"text-red-400":"text-white"}`}>
                        {parseFloat(item.quantity).toLocaleString("de-DE")} <span className="text-slate-500 font-normal text-xs">{item.unit}</span>
                      </span>
                      <button onClick={()=>updateQty(item,1)} className="w-6 h-6 rounded bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] text-slate-300 text-sm leading-none">+</button>
                    </div>
                    <div className="col-span-2 text-slate-500 text-xs">{item.category||"—"}</div>
                    <div className="col-span-2 text-slate-500 text-xs">{item.location||"—"}</div>
                    <div className="col-span-2 flex items-center justify-between">
                      <div>
                        {item.updated_by_email && <p className="text-[10px] text-slate-600">{fmtUser(item.updated_by_email)}</p>}
                        {item.updated_at && <p className="text-[10px] text-slate-700">{fmtDate(item.updated_at)}</p>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={()=>{ setItemForm({name:item.name,unit:item.unit,quantity:item.quantity,min_quantity:item.min_quantity||0,category:item.category||"",location:item.location||"",price_per_unit:item.price_per_unit||"",notes:item.notes||""}); setItemModal(item); }}
                          className="text-slate-600 hover:text-[#C5A572] text-xs">✏️</button>
                        <button onClick={()=>deleteItem(item.id)} className="text-slate-600 hover:text-red-400 text-xs">✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Listen-Modal */}
      <Modal open={!!listModal} onClose={()=>setListModal(null)} title={listModal?.id ? "Liste bearbeiten" : "Neue Liste"}>
        <div className="space-y-3">
          <div><label className={labelCls}>Name *</label><input value={listForm.name} onChange={e=>setListForm(f=>({...f,name:e.target.value}))} placeholder="z.B. Bestand Chemie" className={inputCls}/></div>
          <div><label className={labelCls}>Beschreibung</label><input value={listForm.description} onChange={e=>setListForm(f=>({...f,description:e.target.value}))} placeholder="Optional" className={inputCls}/></div>
          <div><label className={labelCls}>Farbe</label><input type="color" value={listForm.color} onChange={e=>setListForm(f=>({...f,color:e.target.value}))} className="w-10 h-9 rounded cursor-pointer"/></div>
          <div><label className={labelCls}>Icon</label><IconPicker value={listForm.icon} onChange={ic=>setListForm(f=>({...f,icon:ic}))} icons={LIST_ICONS}/></div>
          <div className="flex justify-between pt-2">
            {listModal?.id && <button onClick={()=>deleteList(listModal.id)} className="px-3 py-2 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10">Löschen</button>}
            <div className="flex gap-2 ml-auto">
              <button onClick={()=>setListModal(null)} className="px-4 py-2 text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5">Abbrechen</button>
              <button onClick={saveList} disabled={!listForm.name.trim()} className="px-4 py-2 text-sm font-semibold bg-[#C5A572] hover:opacity-90 disabled:opacity-50 text-black rounded-lg">Speichern</button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Artikel-Modal */}
      <Modal open={!!itemModal} onClose={()=>setItemModal(null)} title={itemModal?.id ? "Artikel bearbeiten" : "Neuer Artikel"}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={labelCls}>Name *</label><input value={itemForm.name} onChange={e=>setItemForm(f=>({...f,name:e.target.value}))} placeholder="z.B. Motoröl 5W-40" className={inputCls}/></div>
            <div><label className={labelCls}>Einheit</label><input value={itemForm.unit} onChange={e=>setItemForm(f=>({...f,unit:e.target.value}))} placeholder="Stück, L, kg..." className={inputCls}/></div>
            <div><label className={labelCls}>Bestand</label><input type="number" value={itemForm.quantity} onChange={e=>setItemForm(f=>({...f,quantity:parseFloat(e.target.value)||0}))} className={inputCls}/></div>
            <div><label className={labelCls}>Mindestbestand</label><input type="number" value={itemForm.min_quantity} onChange={e=>setItemForm(f=>({...f,min_quantity:parseFloat(e.target.value)||0}))} className={inputCls}/></div>
            <div><label className={labelCls}>Preis/Einheit (€)</label><input type="number" value={itemForm.price_per_unit} onChange={e=>setItemForm(f=>({...f,price_per_unit:e.target.value}))} className={inputCls}/></div>
            <div><label className={labelCls}>Kategorie</label><input value={itemForm.category} onChange={e=>setItemForm(f=>({...f,category:e.target.value}))} placeholder="z.B. Öle" className={inputCls}/></div>
            <div><label className={labelCls}>Lagerort</label><input value={itemForm.location} onChange={e=>setItemForm(f=>({...f,location:e.target.value}))} placeholder="z.B. Regal A3" className={inputCls}/></div>
            <div className="col-span-2"><label className={labelCls}>Notizen</label><textarea value={itemForm.notes} onChange={e=>setItemForm(f=>({...f,notes:e.target.value}))} rows={2} className={`${inputCls} resize-none`}/></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={()=>setItemModal(null)} className="px-4 py-2 text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5">Abbrechen</button>
            <button onClick={saveItem} disabled={!itemForm.name.trim()} className="px-4 py-2 text-sm font-semibold bg-[#C5A572] hover:opacity-90 disabled:opacity-50 text-black rounded-lg">Speichern</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Dokumenten-Tab (Messwerte etc.) ───────────────────────────────────
function DocListsTab() {
  const [lists, setLists]         = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [entries, setEntries]     = useState([]);
  const [listModal, setListModal] = useState(null);
  const [entryModal, setEntryModal] = useState(false);
  const [listForm, setListForm]   = useState({ name:"", description:"", icon:"📝", color:"#3b82f6", columns:[] });
  const [entryData, setEntryData] = useState({});
  const [newCol, setNewCol]       = useState({ name:"", type:"text" });

  useEffect(() => { fetchLists(); }, []);
  useEffect(() => { if (activeList) fetchEntries(activeList.id); }, [activeList]);

  async function fetchLists() {
    try { const r = await api.get("/inventory/doc-lists"); setLists(r.data?.lists||[]); }
    catch(e) { console.error(e); }
  }
  async function fetchEntries(lid) {
    try { const r = await api.get(`/inventory/doc-lists/${lid}/entries`); setEntries(r.data?.entries||[]); }
    catch(e) { console.error(e); }
  }

  async function saveList() {
    if (!listForm.name.trim()) return;
    if (listModal?.id) await api.patch(`/inventory/doc-lists/${listModal.id}`, listForm);
    else await api.post("/inventory/doc-lists", listForm);
    await fetchLists(); setListModal(null);
  }

  async function saveEntry() {
    if (!activeList) return;
    await api.post(`/inventory/doc-lists/${activeList.id}/entries`, { data: entryData });
    setEntryData({}); setEntryModal(false);
    await fetchEntries(activeList.id);
  }

  async function deleteEntry(id) {
    await api.delete(`/inventory/doc-lists/${activeList.id}/entries/${id}`);
    await fetchEntries(activeList.id);
  }

  const columns = activeList?.columns || [];

  return (
    <div className="flex gap-4">
      {/* Listen-Sidebar */}
      <div className="w-56 flex-shrink-0 space-y-2">
        <button onClick={()=>{ setListForm({name:"",description:"",icon:"📝",color:"#3b82f6",columns:[]}); setListModal("new"); }}
          className="w-full px-3 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-3">
          + Neue Dokumentliste
        </button>
        {lists.map(list => (
          <div key={list.id} onClick={()=>setActiveList(list)}
            className={`cursor-pointer p-3 rounded-xl border transition-all group ${activeList?.id===list.id?"border-blue-500/40 bg-blue-500/10":"border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{list.icon}</span>
                <span className="text-sm text-white font-medium truncate">{list.name}</span>
              </div>
              <button onClick={e=>{e.stopPropagation(); setListForm({name:list.name,description:list.description||"",icon:list.icon,color:list.color,columns:list.columns||[]}); setListModal(list);}}
                className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-blue-400 text-xs">✏️</button>
            </div>
            <p className="text-[10px] text-slate-600 mt-1">{list.entry_count||0} Einträge</p>
            {list.updated_by_email && <p className="text-[10px] text-slate-700">{fmtUser(list.updated_by_email)}</p>}
          </div>
        ))}
      </div>

      {/* Einträge */}
      <div className="flex-1 min-w-0">
        {!activeList ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
            <span className="text-4xl mb-3">📝</span>
            <p className="text-sm">Wähle eine Dokumentliste aus</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeList.icon}</span>
                <h3 className="text-white font-bold">{activeList.name}</h3>
              </div>
              <button onClick={()=>{ setEntryData({}); setEntryModal(true); }}
                disabled={columns.length===0}
                className="px-3 py-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg">
                + Eintrag
              </button>
            </div>

            {columns.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-sm border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
                Keine Spalten definiert. Bearbeite die Liste um Spalten hinzuzufügen.
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-sm border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
                Noch keine Einträge
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.07)]">
                      {columns.map(col => <th key={col.name} className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{col.name}</th>)}
                      <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Von</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Datum</th>
                      <th/>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(entry => (
                      <tr key={entry.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)]">
                        {columns.map(col => <td key={col.name} className="px-3 py-2.5 text-slate-300">{entry.data?.[col.name]??""}</td>)}
                        <td className="px-3 py-2.5 text-slate-600 text-xs">{fmtUser(entry.created_by_email)}</td>
                        <td className="px-3 py-2.5 text-slate-600 text-xs">{fmtDate(entry.created_at)}</td>
                        <td className="px-3 py-2.5"><button onClick={()=>deleteEntry(entry.id)} className="text-slate-600 hover:text-red-400 text-xs">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Listen-Modal */}
      <Modal open={!!listModal} onClose={()=>setListModal(null)} title={listModal?.id?"Liste bearbeiten":"Neue Dokumentliste"} maxWidth="max-w-lg">
        <div className="space-y-4">
          <div><label className={labelCls}>Name *</label><input value={listForm.name} onChange={e=>setListForm(f=>({...f,name:e.target.value}))} placeholder="z.B. Messwerte, Protokoll..." className={inputCls}/></div>
          <div><label className={labelCls}>Beschreibung</label><input value={listForm.description} onChange={e=>setListForm(f=>({...f,description:e.target.value}))} className={inputCls}/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Farbe</label><input type="color" value={listForm.color} onChange={e=>setListForm(f=>({...f,color:e.target.value}))} className="w-full h-9 rounded cursor-pointer"/></div>
          </div>
          <div><label className={labelCls}>Icon</label><IconPicker value={listForm.icon} onChange={ic=>setListForm(f=>({...f,icon:ic}))} icons={DOC_ICONS}/></div>

          {/* Spalten */}
          <div>
            <label className={labelCls}>Spalten</label>
            <div className="space-y-2 mb-2">
              {(listForm.columns||[]).map((col,i) => (
                <div key={i} className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2">
                  <span className="text-slate-300 text-sm flex-1">{col.name}</span>
                  <span className="text-slate-600 text-xs">{col.type}</span>
                  <button onClick={()=>setListForm(f=>({...f,columns:f.columns.filter((_,j)=>j!==i)}))} className="text-slate-600 hover:text-red-400 text-xs">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newCol.name} onChange={e=>setNewCol(f=>({...f,name:e.target.value}))}
                placeholder="Spaltenname z.B. Temperatur" className={`${inputCls} flex-1`}/>
              <select value={newCol.type} onChange={e=>setNewCol(f=>({...f,type:e.target.value}))} className="px-2 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-lg text-slate-300 text-sm focus:outline-none">
                <option value="text">Text</option>
                <option value="number">Zahl</option>
                <option value="date">Datum</option>
              </select>
              <button onClick={()=>{ if(!newCol.name.trim()) return; setListForm(f=>({...f,columns:[...f.columns,{...newCol}]})); setNewCol({name:"",type:"text"}); }}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">+</button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={()=>setListModal(null)} className="px-4 py-2 text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5">Abbrechen</button>
            <button onClick={saveList} disabled={!listForm.name.trim()} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg">Speichern</button>
          </div>
        </div>
      </Modal>

      {/* Eintrag-Modal */}
      <Modal open={entryModal} onClose={()=>setEntryModal(false)} title="Neuer Eintrag">
        <div className="space-y-3">
          {columns.map(col => (
            <div key={col.name}>
              <label className={labelCls}>{col.name}</label>
              <input type={col.type==="number"?"number":col.type==="date"?"date":"text"}
                value={entryData[col.name]||""} onChange={e=>setEntryData(d=>({...d,[col.name]:e.target.value}))}
                className={inputCls}/>
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={()=>setEntryModal(false)} className="px-4 py-2 text-sm text-slate-400 border border-[rgba(255,255,255,0.07)] rounded-lg hover:bg-white/5">Abbrechen</button>
            <button onClick={saveEntry} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Speichern</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Hauptkomponente ───────────────────────────────────────────────────
export default function DeliveryNotesPage() {
  const [tab, setTab]               = useState("notes");
  const [notes, setNotes]           = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [analyzing, setAnalyzing]   = useState(false);
  const [confirmNote, setConfirmNote] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError]           = useState(null);
  const fileRef                     = useRef();

  useEffect(() => { fetchNotes(); fetchAllInventory(); }, [statusFilter]);

  async function fetchNotes() {
    setLoading(true);
    try {
      const r = await api.get("/inventory/delivery-notes", { params: statusFilter ? {status:statusFilter} : {} });
      setNotes(r.data?.delivery_notes||[]);
    } catch { setError("Laden fehlgeschlagen."); }
    finally { setLoading(false); }
  }

  async function fetchAllInventory() {
    try { const r = await api.get("/inventory/items"); setInventoryItems(r.data?.items||[]); }
    catch { }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/inventory/delivery-notes/from-image", fd, { headers: {"Content-Type":"multipart/form-data"} });
      if (!res.data?.is_delivery_note) { setError("Kein Lieferschein erkannt."); return; }
      await fetchNotes();
      setConfirmNote(res.data);
    } catch { setError("Analyse fehlgeschlagen."); }
    finally { setAnalyzing(false); e.target.value=""; }
  }

  async function handleConfirm(noteId, items) {
    try { await api.post(`/inventory/delivery-notes/${noteId}/confirm`, {items}); setConfirmNote(null); fetchNotes(); }
    catch(e) { console.error(e); }
  }

  async function handleReject(noteId) {
    try { await api.post(`/inventory/delivery-notes/${noteId}/reject`); setConfirmNote(null); fetchNotes(); }
    catch(e) { console.error(e); }
  }

  const pendingCount = notes.filter(n=>n.status==="pending").length;

  const TABS = [
    { key:"notes",     label:`Lieferscheine${pendingCount>0?` (${pendingCount})`:""}` },
    { key:"inventory", label:"Inventar" },
    { key:"docs",      label:"Dokumente" },
  ];

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Lieferscheine & Inventar</h1>
          <p className="text-slate-500 text-sm mt-1">KI-gestützte Lieferscheinerkennung, Bestandsverwaltung & Dokumentation</p>
        </div>
        {tab==="notes" && (
          <button onClick={()=>fileRef.current?.click()} disabled={analyzing}
            className="px-4 py-2 text-sm font-semibold bg-[#C5A572] hover:opacity-90 disabled:opacity-50 text-black rounded-lg flex items-center gap-2">
            {analyzing ? <><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>Analysiere...</> : "📷 Foto hochladen"}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleImageUpload}/>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${tab===t.key ? "bg-[rgba(197,165,114,0.15)] border-[rgba(197,165,114,0.4)] text-[#C5A572]" : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-slate-500 hover:text-slate-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==="inventory" ? <InventoryTab/> :
       tab==="docs"      ? <DocListsTab/> : (
        /* Lieferscheine */
        loading ? (
          <div className="flex items-center gap-3 text-slate-500 py-10 justify-center">
            <span className="w-5 h-5 border-2 border-[#C5A572] border-t-transparent rounded-full animate-spin"/>Lädt...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              {["","pending","confirmed","rejected"].map(s => (
                <button key={s} onClick={()=>setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${statusFilter===s?"bg-[rgba(197,165,114,0.15)] border-[rgba(197,165,114,0.4)] text-[#C5A572]":"bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-slate-500 hover:text-slate-300"}`}>
                  {s===""?"Alle":statusLabel[s]}
                </button>
              ))}
            </div>

            {notes.length===0 ? (
              <div className="text-center py-12 text-slate-600 border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-sm">Noch keine Lieferscheine</p>
                <p className="text-xs mt-1">Lade ein Foto hoch um einen Lieferschein zu analysieren</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map(note => (
                  <div key={note.id} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.05)] transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="text-2xl">{note.source==="photo"?"📷":"✉️"}</span>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm">{note.supplier||"Unbekannter Lieferant"}</p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {note.delivery_number&&`Nr. ${note.delivery_number} · `}
                            {note.delivery_date||new Date(note.created_at).toLocaleDateString("de-DE")}
                            {" · "}{note.items?.length||0} Position{note.items?.length!==1?"en":""}
                          </p>
                          {/* Mitarbeiter-Info */}
                          <p className="text-[10px] text-slate-600 mt-1">
                            📤 {fmtUser(note.created_by||"")} · {fmtDate(note.created_at)}
                          </p>
                          {note.items?.length>0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {note.items.slice(0,3).map((item,i)=>(
                                <span key={i} className="text-[10px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-full px-2 py-0.5 text-slate-400">
                                  {item.quantity} {item.unit} {item.name}
                                </span>
                              ))}
                              {note.items.length>3&&<span className="text-[10px] text-slate-600">+{note.items.length-3} weitere</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColor[note.status]}`}>
                          {statusLabel[note.status]}
                        </span>
                        {note.status==="pending" && (
                          <button onClick={()=>setConfirmNote(note)}
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
        )
      )}

      <ConfirmModal note={confirmNote} inventoryItems={inventoryItems}
        onConfirm={handleConfirm} onReject={handleReject} onClose={()=>setConfirmNote(null)}/>
    </PageLayout>
  );
}
