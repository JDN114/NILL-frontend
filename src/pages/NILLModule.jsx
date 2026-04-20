// src/pages/NILLModule.jsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";

const MODULES = [
  { id: "overview",     label: "Übersicht",           icon: "🤖", color: "#6366f1" },
  { id: "applications", label: "Bewerbungen",          icon: "👤", color: "#0891b2" },
  { id: "travel",       label: "Geschäftsreisen",      icon: "✈️", color: "#059669" },
  { id: "contracts",    label: "Verträge",             icon: "📄", color: "#7c3aed" },
  { id: "onboarding",   label: "Onboarding",           icon: "🚀", color: "#db2777" },
  { id: "competitors",  label: "Wettbewerber",         icon: "🔍", color: "#d97706" },
  { id: "meetings",     label: "Meeting-Vorbereitung", icon: "📅", color: "#dc2626" },
];

const STATUS_CFG = {
  new:         { label: "Neu",         color: "#6366f1", bg: "#eef2ff" },
  interesting: { label: "Interessant", color: "#0891b2", bg: "#ecfeff" },
  interview:   { label: "Interview",   color: "#059669", bg: "#ecfdf5" },
  rejected:    { label: "Abgelehnt",   color: "#dc2626", bg: "#fef2f2" },
  hired:       { label: "Eingestellt", color: "#7c3aed", bg: "#f5f3ff" },
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

function ScoreBadge({ score }) {
  const color = score>=90?"#059669":score>=75?"#0891b2":score>=60?"#d97706":score>=40?"#ea580c":"#dc2626";
  return (
    <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:44,height:44,borderRadius:"50%",border:`2px solid ${color}`,color,fontWeight:700,fontSize:14,flexShrink:0 }}>
      {Math.round(score)}
    </span>
  );
}

function StatusPill({ status, onChange }) {
  const cfg = STATUS_CFG[status]||STATUS_CFG.new;
  const [open,setOpen] = useState(false);
  return (
    <div style={{ position:"relative",display:"inline-block" }}>
      <button onClick={e=>{e.stopPropagation();setOpen(o=>!o);}} style={{ background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}40`,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600,cursor:"pointer" }}>
        {cfg.label} ▾
      </button>
      {open&&(
        <div onClick={e=>e.stopPropagation()} style={{ position:"absolute",top:"110%",left:0,zIndex:100,background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.10)",minWidth:140,overflow:"hidden" }}>
          {Object.entries(STATUS_CFG).map(([k,v])=>(
            <button key={k} onClick={()=>{onChange(k);setOpen(false);}} style={{ display:"block",width:"100%",textAlign:"left",padding:"8px 14px",background:"none",border:"none",fontSize:13,color:v.color,cursor:"pointer",fontWeight:status===k?700:400 }}>{v.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom:24 }}>
      <h2 style={{ margin:0,fontSize:20,fontWeight:700,color:"#111827" }}>{title}</h2>
      {subtitle&&<p style={{ margin:"4px 0 0",fontSize:14,color:"#6b7280" }}>{subtitle}</p>}
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign:"center",padding:"48px 24px",border:"2px dashed #e5e7eb",borderRadius:12,color:"#9ca3af" }}>
      <div style={{ fontSize:36,marginBottom:12 }}>{icon}</div>
      <p style={{ margin:0,fontSize:15,fontWeight:600,color:"#6b7280" }}>{title}</p>
      {subtitle&&<p style={{ margin:"6px 0 0",fontSize:13 }}>{subtitle}</p>}
    </div>
  );
}

function Modal({ onClose, maxWidth=600, children }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{ background:"#fff",borderRadius:16,width:"100%",maxWidth,maxHeight:"90vh",overflowY:"auto",padding:"28px 32px" }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
      <div>
        <h2 style={{ margin:0,fontSize:18,color:"#111827" }}>{title}</h2>
        {subtitle&&<p style={{ margin:"4px 0 0",fontSize:13,color:"#6b7280" }}>{subtitle}</p>}
      </div>
      <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#9ca3af",flexShrink:0,marginLeft:12 }}>✕</button>
    </div>
  );
}

function FormField({ label, value, onChange, type="text", placeholder="", rows }) {
  const style = { width:"100%",padding:"8px 10px",border:"1px solid #d1d5db",borderRadius:7,fontSize:13,boxSizing:"border-box" };
  return (
    <div>
      <label style={{ fontSize:12,color:"#6b7280",display:"block",marginBottom:4 }}>{label}</label>
      {rows
        ? <textarea rows={rows} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} style={{ ...style,resize:"vertical" }} />
        : <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} style={style} />
      }
    </div>
  );
}

function PrimaryButton({ onClick, disabled, color="#6366f1", children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background:color,color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",fontSize:13,fontWeight:600,cursor:"pointer" }}>
      {children}
    </button>
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ background:"none",border:"1px solid #d1d5db",borderRadius:7,padding:"8px 18px",fontSize:13,cursor:"pointer",color:"#6b7280" }}>
      {children}
    </button>
  );
}

function UploadZone({ onFiles, loading, color="#6366f1", accept=".pdf", label="PDF ablegen oder klicken" }) {
  const ref = useRef();
  return (
    <div
      onDragOver={e=>e.preventDefault()}
      onDrop={e=>{e.preventDefault();Array.from(e.dataTransfer.files).forEach(onFiles);}}
      onClick={()=>ref.current?.click()}
      style={{ border:"2px dashed #d1d5db",borderRadius:10,padding:"20px 16px",textAlign:"center",cursor:"pointer",background:"#fafafa",marginBottom:20 }}
    >
      <input ref={ref} type="file" accept={accept} multiple style={{ display:"none" }} onChange={e=>Array.from(e.target.files).forEach(onFiles)} />
      {loading
        ? <p style={{ margin:0,fontSize:14,color,fontWeight:500 }}>🤖 NILL analysiert…</p>
        : <p style={{ margin:0,fontSize:14,color:"#6b7280" }}>📎 {label}</p>
      }
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewModule({ nillNotifications, dailySummary }) {
  const pending = nillNotifications.filter(n=>n.requires_action);
  const stats = [
    { label:"Offene Aktionen",   value: pending.length },
    { label:"Bewerbungen heute", value: dailySummary?.applications?.total_received??"—" },
    { label:"Ø Score",           value: dailySummary?.applications?.average_score?`${dailySummary.applications.average_score}`:"—" },
    { label:"Reisen ausstehend", value: dailySummary?.travel?.pending??"—" },
  ];
  return (
    <div>
      <SectionHeader title="NILL Übersicht" subtitle="Tagesabschluss & offene Aktionen" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:24 }}>
        {stats.map(s=>(
          <div key={s.label} style={{ background:"#f9fafb",borderRadius:10,padding:"14px 16px" }}>
            <p style={{ margin:0,fontSize:12,color:"#9ca3af" }}>{s.label}</p>
            <p style={{ margin:"4px 0 0",fontSize:26,fontWeight:700,color:"#111827" }}>{s.value}</p>
          </div>
        ))}
      </div>
      {dailySummary?.message&&(
        <div style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:12,padding:"18px 22px",marginBottom:24,color:"#fff" }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
            <span style={{ fontSize:16 }}>🤖</span>
            <span style={{ fontWeight:700,fontSize:14 }}>NILL Tagesabschluss</span>
            <span style={{ fontSize:12,opacity:0.75,marginLeft:"auto" }}>{new Date().toLocaleDateString("de-DE")}</span>
          </div>
          <p style={{ margin:0,fontSize:13,opacity:0.95,lineHeight:1.6 }}>{dailySummary.message}</p>
        </div>
      )}
      {pending.length>0?(
        <div>
          <h3 style={{ fontSize:14,fontWeight:600,color:"#374151",margin:"0 0 10px" }}>Offene Aktionen</h3>
          {pending.map((n,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:12,background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:10,padding:"12px 16px",marginBottom:8 }}>
              <span style={{ fontSize:18 }}>⚠️</span>
              <p style={{ flex:1,margin:0,fontSize:13,color:"#92400e" }}>{n.message}</p>
              <span style={{ background:"#f59e0b",color:"#fff",border:"none",borderRadius:6,padding:"5px 12px",fontSize:12,fontWeight:600 }}>Aktion</span>
            </div>
          ))}
        </div>
      ):(
        <EmptyState icon="✅" title="Alles erledigt" subtitle="Keine offenen Aktionen für heute." />
      )}
    </div>
  );
}

// ─── Applications ─────────────────────────────────────────────────────────────

function ApplicationsModule() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState(null);

  useEffect(()=>{ fetchApps(); },[filterStatus]);

  async function fetchApps() {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (filterStatus) p.set("status",filterStatus);
      const res = await api.get(`/nill/applications?${p}`);
      setApplications(res.data);
    } catch { setError("Fehler beim Laden."); }
    finally { setLoading(false); }
  }

  async function handleUpload(file) {
    setUploading(true); setError(null);
    try {
      const form = new FormData();
      form.append("file",file);
      if(position) form.append("position",position);
      const res = await api.post("/nill/applications/upload",form,{ headers:{"Content-Type":"multipart/form-data"} });
      setApplications(prev=>[res.data,...prev]);
    } catch { setError("Upload fehlgeschlagen."); }
    finally { setUploading(false); }
  }

  async function handleStatusChange(id,status) {
    try {
      const res = await api.patch(`/nill/applications/${id}/status`,{ status });
      setApplications(prev=>prev.map(a=>a.id===id?res.data:a));
      if(selected?.id===id) setSelected(res.data);
    } catch {}
  }

  return (
    <div>
      <SectionHeader title="Bewerbungen" subtitle={`${applications.length} Bewerbung${applications.length!==1?"en":""} gesamt`} />
      <div style={{ display:"flex",gap:8,marginBottom:20,flexWrap:"wrap" }}>
        {["","new","interesting","interview","rejected","hired"].map(s=>(
          <button key={s} onClick={()=>setFilterStatus(s)} style={{ padding:"5px 14px",borderRadius:20,fontSize:12,cursor:"pointer",border:`1px solid ${filterStatus===s?"#6366f1":"#d1d5db"}`,background:filterStatus===s?"#eff6ff":"#fff",color:filterStatus===s?"#6366f1":"#6b7280",fontWeight:filterStatus===s?600:400 }}>
            {s?STATUS_CFG[s]?.label:"Alle"}
          </button>
        ))}
      </div>
      <UploadZone onFiles={handleUpload} loading={uploading} />
      <input type="text" placeholder="Stelle (optional)" value={position} onChange={e=>setPosition(e.target.value)}
        style={{ marginTop:-12,marginBottom:16,width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:13,boxSizing:"border-box" }} />
      {error&&<div style={{ background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#dc2626" }}>{error}</div>}
      {loading?<div style={{ textAlign:"center",padding:40,color:"#9ca3af" }}>Lade…</div>
      :applications.length===0?<EmptyState icon="📭" title="Noch keine Bewerbungen" subtitle="PDF hochladen um zu starten." />
      :(
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {applications.map(app=>(
            <div key={app.id} onClick={()=>setSelected(app)} style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 18px",cursor:"pointer",display:"flex",gap:14,alignItems:"flex-start" }}>
              <ScoreBadge score={app.ai_score??0} />
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap" }}>
                  <span style={{ fontWeight:600,fontSize:15,color:"#111827" }}>{app.candidate_name}</span>
                  {app.position&&<span style={{ fontSize:12,color:"#6b7280",background:"#f3f4f6",borderRadius:4,padding:"1px 7px" }}>{app.position}</span>}
                </div>
                <p style={{ fontSize:13,color:"#6b7280",margin:"0 0 8px",lineHeight:1.4 }}>{app.ai_summary?.slice(0,110)}{app.ai_summary?.length>110?"…":""}</p>
                <StatusPill status={app.status} onChange={s=>handleStatusChange(app.id,s)} />
              </div>
            </div>
          ))}
        </div>
      )}
      {selected&&(
        <Modal onClose={()=>setSelected(null)} maxWidth={600}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 }}>
            <div>
              <h2 style={{ margin:0,fontSize:22,color:"#111827" }}>{selected.candidate_name}</h2>
              {selected.email&&<p style={{ margin:"4px 0 0",fontSize:13,color:"#6b7280" }}>{selected.email}</p>}
              {selected.position&&<p style={{ margin:"2px 0 0",fontSize:13,color:"#6b7280" }}>Stelle: {selected.position}</p>}
            </div>
            <div style={{ display:"flex",gap:12,alignItems:"center" }}>
              <ScoreBadge score={selected.ai_score??0} />
              <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#9ca3af" }}>✕</button>
            </div>
          </div>
          <section style={{ marginBottom:20 }}>
            <h3 style={{ fontSize:12,fontWeight:600,color:"#6b7280",letterSpacing:"0.05em",margin:"0 0 8px" }}>ZUSAMMENFASSUNG</h3>
            <p style={{ fontSize:14,color:"#374151",lineHeight:1.6,margin:0 }}>{selected.ai_summary}</p>
          </section>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20 }}>
            <section style={{ background:"#f0fdf4",borderRadius:8,padding:"12px 16px" }}>
              <h3 style={{ fontSize:12,fontWeight:600,color:"#15803d",margin:"0 0 8px" }}>STÄRKEN</h3>
              <ul style={{ margin:0,padding:"0 0 0 16px" }}>{(selected.ai_strengths||[]).map((s,i)=><li key={i} style={{ fontSize:13,color:"#166534",marginBottom:4 }}>{s}</li>)}</ul>
            </section>
            <section style={{ background:"#fef2f2",borderRadius:8,padding:"12px 16px" }}>
              <h3 style={{ fontSize:12,fontWeight:600,color:"#dc2626",margin:"0 0 8px" }}>SCHWÄCHEN</h3>
              <ul style={{ margin:0,padding:"0 0 0 16px" }}>{(selected.ai_weaknesses||[]).map((w,i)=><li key={i} style={{ fontSize:13,color:"#991b1b",marginBottom:4 }}>{w}</li>)}</ul>
            </section>
          </div>
          <section style={{ background:"#eff6ff",borderRadius:8,padding:"12px 16px",marginBottom:24 }}>
            <h3 style={{ fontSize:12,fontWeight:600,color:"#1d4ed8",margin:"0 0 6px" }}>NILL-EMPFEHLUNG</h3>
            <p style={{ fontSize:13,color:"#1e40af",margin:0,lineHeight:1.5 }}>{selected.ai_recommendation}</p>
          </section>
          <div style={{ display:"flex",gap:10,alignItems:"center" }}>
            <span style={{ fontSize:13,color:"#6b7280" }}>Status:</span>
            <StatusPill status={selected.status} onChange={s=>handleStatusChange(selected.id,s)} />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Travel ───────────────────────────────────────────────────────────────────

const TRAVEL_STATUS = {
  pending_approval:{ label:"Wartet",    color:"#d97706",bg:"#fffbeb" },
  approved:        { label:"Genehmigt", color:"#059669",bg:"#ecfdf5" },
  booked:          { label:"Gebucht",   color:"#6366f1",bg:"#eef2ff" },
  cancelled:       { label:"Abgesagt",  color:"#dc2626",bg:"#fef2f2" },
};

function TravelModule() {
  const [trips,setTrips] = useState([]);
  const [loading,setLoading] = useState(true);
  const [showForm,setShowForm] = useState(false);
  const [form,setForm] = useState({ destination:"",purpose:"",departure_date:"",return_date:"",budget:"",notes:"" });
  const [submitting,setSubmitting] = useState(false);

  useEffect(()=>{ api.get("/nill/travel").then(r=>setTrips(r.data)).finally(()=>setLoading(false)); },[]);

  async function handleSubmit() {
    setSubmitting(true);
    try { const r=await api.post("/nill/travel",form); setTrips(p=>[r.data,...p]); setShowForm(false); setForm({ destination:"",purpose:"",departure_date:"",return_date:"",budget:"",notes:"" }); }
    catch {} finally { setSubmitting(false); }
  }

  async function handleConfirm(id) {
    try { const r=await api.patch(`/nill/travel/${id}/confirm`); setTrips(p=>p.map(t=>t.id===id?r.data:t)); }
    catch {}
  }

  const fields = [
    {key:"destination",label:"Reiseziel",placeholder:"z.B. Berlin"},
    {key:"purpose",label:"Zweck",placeholder:"z.B. Kundengespräch"},
    {key:"departure_date",label:"Abreise",type:"date"},
    {key:"return_date",label:"Rückkehr",type:"date"},
    {key:"budget",label:"Budget (€)",placeholder:"z.B. 800"},
  ];

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 }}>
        <SectionHeader title="Geschäftsreisen" subtitle="NILL plant, du bestätigst." />
        <PrimaryButton onClick={()=>setShowForm(v=>!v)} color="#059669">+ Neue Reise</PrimaryButton>
      </div>
      {showForm&&(
        <div style={{ background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:20,marginBottom:20 }}>
          <h3 style={{ margin:"0 0 14px",fontSize:15,fontWeight:600 }}>Reiseanfrage an NILL</h3>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
            {fields.map(f=><FormField key={f.key} label={f.label} value={form[f.key]} onChange={v=>setForm(p=>({...p,[f.key]:v}))} type={f.type||"text"} placeholder={f.placeholder||""} />)}
          </div>
          <FormField label="Notizen" value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} rows={2} placeholder="Besondere Anforderungen…" />
          <div style={{ display:"flex",gap:10,marginTop:14 }}>
            <PrimaryButton onClick={handleSubmit} disabled={submitting} color="#059669">{submitting?"NILL plant…":"An NILL senden"}</PrimaryButton>
            <GhostButton onClick={()=>setShowForm(false)}>Abbrechen</GhostButton>
          </div>
        </div>
      )}
      {loading?<div style={{ textAlign:"center",padding:40,color:"#9ca3af" }}>Lade…</div>
      :trips.length===0?<EmptyState icon="✈️" title="Keine Reisen geplant" subtitle="Reiseanfrage stellen – NILL übernimmt die Planung." />
      :(
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {trips.map(t=>{
            const cfg=TRAVEL_STATUS[t.status]||TRAVEL_STATUS.pending_approval;
            return (
              <div key={t.id} style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 18px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
                  <div>
                    <p style={{ margin:0,fontWeight:600,fontSize:15,color:"#111827" }}>✈️ {t.destination}</p>
                    <p style={{ margin:"2px 0 0",fontSize:13,color:"#6b7280" }}>{t.purpose}</p>
                  </div>
                  <span style={{ background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}30`,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600 }}>{cfg.label}</span>
                </div>
                <div style={{ display:"flex",gap:16,fontSize:12,color:"#9ca3af" }}>
                  {t.departure_date&&<span>📅 {t.departure_date} → {t.return_date}</span>}
                  {t.budget&&<span>💶 {t.budget} €</span>}
                </div>
                {t.ai_suggestion&&<div style={{ background:"#eff6ff",borderRadius:8,padding:"8px 12px",marginTop:10 }}><p style={{ margin:0,fontSize:12,color:"#1e40af" }}>🤖 {t.ai_suggestion}</p></div>}
                {t.status==="pending_approval"&&<button onClick={()=>handleConfirm(t.id)} style={{ marginTop:10,background:"#059669",color:"#fff",border:"none",borderRadius:7,padding:"7px 16px",fontSize:13,fontWeight:600,cursor:"pointer" }}>✓ Bestätigen & Buchen</button>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Contracts ────────────────────────────────────────────────────────────────

function ContractsModule() {
  const [contracts,setContracts] = useState([]);
  const [loading,setLoading] = useState(true);
  const [uploading,setUploading] = useState(false);
  const [selected,setSelected] = useState(null);

  useEffect(()=>{ api.get("/nill/contracts").then(r=>setContracts(r.data)).finally(()=>setLoading(false)); },[]);

  async function handleUpload(file) {
    setUploading(true);
    try { const form=new FormData(); form.append("file",file); const r=await api.post("/nill/contracts/upload",form,{headers:{"Content-Type":"multipart/form-data"}}); setContracts(p=>[r.data,...p]); }
    catch {} finally { setUploading(false); }
  }

  const URGENCY={ high:{color:"#dc2626",bg:"#fef2f2",label:"Dringend"},medium:{color:"#d97706",bg:"#fffbeb",label:"Normal"},low:{color:"#059669",bg:"#ecfdf5",label:"Niedrig"} };

  return (
    <div>
      <SectionHeader title="Verträge" subtitle="NILL liest, fasst zusammen und warnt vor Fristen." />
      <UploadZone onFiles={handleUpload} loading={uploading} accept=".pdf,.docx" label="PDF oder DOCX ablegen" color="#7c3aed" />
      {loading?<div style={{ textAlign:"center",padding:40,color:"#9ca3af" }}>Lade…</div>
      :contracts.length===0?<EmptyState icon="📄" title="Keine Verträge" subtitle="Vertrag hochladen – NILL fasst zusammen und meldet Fristen." />
      :(
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {contracts.map(c=>{
            const urg=URGENCY[c.urgency]||URGENCY.low;
            return (
              <div key={c.id} onClick={()=>setSelected(c)} style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 18px",cursor:"pointer" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                  <p style={{ margin:0,fontWeight:600,fontSize:15,color:"#111827" }}>{c.title||c.filename}</p>
                  <span style={{ background:urg.bg,color:urg.color,border:`1px solid ${urg.color}30`,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600,flexShrink:0,marginLeft:8 }}>{urg.label}</span>
                </div>
                {c.ai_summary&&<p style={{ margin:0,fontSize:13,color:"#6b7280",lineHeight:1.4 }}>{c.ai_summary.slice(0,120)}…</p>}
                {c.deadline&&<p style={{ margin:"6px 0 0",fontSize:12,color:"#dc2626",fontWeight:500 }}>⏰ Frist: {c.deadline}</p>}
              </div>
            );
          })}
        </div>
      )}
      {selected&&(
        <Modal onClose={()=>setSelected(null)} maxWidth={560}>
          <ModalHeader title={selected.title||selected.filename} onClose={()=>setSelected(null)} />
          {selected.ai_summary&&<p style={{ fontSize:14,color:"#374151",lineHeight:1.6 }}>{selected.ai_summary}</p>}
          {(selected.key_points||[]).length>0&&(
            <div style={{ background:"#f9fafb",borderRadius:8,padding:"12px 16px",marginTop:12 }}>
              <p style={{ margin:"0 0 8px",fontSize:12,fontWeight:600,color:"#6b7280" }}>KERNPUNKTE</p>
              <ul style={{ margin:0,padding:"0 0 0 16px" }}>{selected.key_points.map((k,i)=><li key={i} style={{ fontSize:13,color:"#374151",marginBottom:4 }}>{k}</li>)}</ul>
            </div>
          )}
          {selected.deadline&&<div style={{ background:"#fef2f2",borderRadius:8,padding:"10px 14px",marginTop:12 }}><p style={{ margin:0,fontSize:13,color:"#dc2626",fontWeight:600 }}>⏰ Frist: {selected.deadline}</p></div>}
        </Modal>
      )}
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

function OnboardingModule() {
  const [employees,setEmployees] = useState([]);
  const [loading,setLoading] = useState(true);
  const [showForm,setShowForm] = useState(false);
  const [form,setForm] = useState({ name:"",role:"",start_date:"",email:"" });
  const [submitting,setSubmitting] = useState(false);

  useEffect(()=>{ api.get("/nill/onboarding").then(r=>setEmployees(r.data)).finally(()=>setLoading(false)); },[]);

  async function handleSubmit() {
    setSubmitting(true);
    try { const r=await api.post("/nill/onboarding",form); setEmployees(p=>[r.data,...p]); setShowForm(false); setForm({ name:"",role:"",start_date:"",email:"" }); }
    catch {} finally { setSubmitting(false); }
  }

  async function toggleTask(eid,tid) {
    try { const r=await api.patch(`/nill/onboarding/${eid}/tasks/${tid}/toggle`); setEmployees(p=>p.map(e=>e.id===eid?r.data:e)); }
    catch {}
  }

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 }}>
        <SectionHeader title="Onboarding" subtitle="NILL erstellt Checklisten für neue Mitarbeiter." />
        <PrimaryButton onClick={()=>setShowForm(v=>!v)} color="#db2777">+ Neuer Mitarbeiter</PrimaryButton>
      </div>
      {showForm&&(
        <div style={{ background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:20,marginBottom:20 }}>
          <h3 style={{ margin:"0 0 14px",fontSize:15,fontWeight:600 }}>Neuen Mitarbeiter anlegen</h3>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
            <FormField label="Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} />
            <FormField label="Stelle" value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} />
            <FormField label="E-Mail" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} type="email" />
            <FormField label="Startdatum" value={form.start_date} onChange={v=>setForm(p=>({...p,start_date:v}))} type="date" />
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <PrimaryButton onClick={handleSubmit} disabled={submitting} color="#db2777">{submitting?"NILL erstellt Checkliste…":"Anlegen"}</PrimaryButton>
            <GhostButton onClick={()=>setShowForm(false)}>Abbrechen</GhostButton>
          </div>
        </div>
      )}
      {loading?<div style={{ textAlign:"center",padding:40,color:"#9ca3af" }}>Lade…</div>
      :employees.length===0?<EmptyState icon="🚀" title="Noch kein Onboarding" subtitle="Neuen Mitarbeiter anlegen – NILL erstellt die Checkliste automatisch." />
      :(
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {employees.map(emp=>{
            const tasks=emp.tasks||[];
            const done=tasks.filter(t=>t.done).length;
            const pct=tasks.length>0?Math.round((done/tasks.length)*100):0;
            return (
              <div key={emp.id} style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"16px 20px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                  <div>
                    <p style={{ margin:0,fontWeight:600,fontSize:15,color:"#111827" }}>{emp.name}</p>
                    <p style={{ margin:"2px 0 0",fontSize:13,color:"#6b7280" }}>{emp.role} · Start: {emp.start_date}</p>
                  </div>
                  <span style={{ fontSize:13,fontWeight:700,color:pct===100?"#059669":"#6366f1",background:pct===100?"#ecfdf5":"#eff6ff",borderRadius:20,padding:"3px 10px" }}>{pct}%</span>
                </div>
                <div style={{ background:"#e5e7eb",borderRadius:99,height:4,marginBottom:12,overflow:"hidden" }}>
                  <div style={{ height:"100%",background:pct===100?"#059669":"#6366f1",width:`${pct}%`,transition:"width 0.3s",borderRadius:99 }} />
                </div>
                {tasks.map(task=>(
                  <label key={task.id} style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:6 }}>
                    <input type="checkbox" checked={task.done} onChange={()=>toggleTask(emp.id,task.id)} style={{ width:16,height:16,accentColor:"#6366f1",cursor:"pointer" }} />
                    <span style={{ fontSize:13,color:task.done?"#9ca3af":"#374151",textDecoration:task.done?"line-through":"none" }}>{task.label}</span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Competitors ──────────────────────────────────────────────────────────────

function CompetitorsModule() {
  const [reports,setReports] = useState([]);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);
  const [selected,setSelected] = useState(null);

  useEffect(()=>{ api.get("/nill/competitors").then(r=>setReports(r.data)).finally(()=>setLoading(false)); },[]);

  async function triggerRefresh() {
    setRefreshing(true);
    try { const r=await api.post("/nill/competitors/refresh"); setReports(r.data); }
    catch {} finally { setRefreshing(false); }
  }

  const SENT={ positive:{color:"#059669",bg:"#ecfdf5",label:"Positiv"},neutral:{color:"#d97706",bg:"#fffbeb",label:"Neutral"},negative:{color:"#dc2626",bg:"#fef2f2",label:"Kritisch"} };

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 }}>
        <SectionHeader title="Wettbewerber-Monitoring" subtitle="NILL beobachtet täglich deine Mitbewerber." />
        <PrimaryButton onClick={triggerRefresh} disabled={refreshing} color="#d97706">{refreshing?"Aktualisiere…":"🔄 Jetzt aktualisieren"}</PrimaryButton>
      </div>
      {loading?<div style={{ textAlign:"center",padding:40,color:"#9ca3af" }}>Lade…</div>
      :reports.length===0?<EmptyState icon="🔍" title="Keine Berichte" subtitle="NILL sammelt täglich neue Infos über eure Wettbewerber." />
      :(
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {reports.map(r=>{
            const sent=SENT[r.sentiment]||SENT.neutral;
            return (
              <div key={r.id} onClick={()=>setSelected(r)} style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 18px",cursor:"pointer" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                  <p style={{ margin:0,fontWeight:600,fontSize:15,color:"#111827" }}>{r.competitor_name}</p>
                  <span style={{ background:sent.bg,color:sent.color,border:`1px solid ${sent.color}30`,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600,flexShrink:0,marginLeft:8 }}>{sent.label}</span>
                </div>
                <p style={{ margin:0,fontSize:13,color:"#6b7280",lineHeight:1.4 }}>{r.summary?.slice(0,130)}…</p>
                <p style={{ margin:"6px 0 0",fontSize:11,color:"#9ca3af" }}>{r.updated_at?new Date(r.updated_at).toLocaleDateString("de-DE"):""}</p>
              </div>
            );
          })}
        </div>
      )}
      {selected&&(
        <Modal onClose={()=>setSelected(null)} maxWidth={560}>
          <ModalHeader title={selected.competitor_name} onClose={()=>setSelected(null)} />
          {selected.summary&&<p style={{ fontSize:14,color:"#374151",lineHeight:1.6 }}>{selected.summary}</p>}
          {(selected.highlights||[]).length>0&&(
            <div style={{ background:"#f9fafb",borderRadius:8,padding:"12px 16px",marginTop:12 }}>
              <p style={{ margin:"0 0 8px",fontSize:12,fontWeight:600,color:"#6b7280" }}>HIGHLIGHTS</p>
              <ul style={{ margin:0,padding:"0 0 0 16px" }}>{selected.highlights.map((h,i)=><li key={i} style={{ fontSize:13,color:"#374151",marginBottom:4 }}>{h}</li>)}</ul>
            </div>
          )}
          {(selected.sources||[]).length>0&&(
            <div style={{ marginTop:12 }}>
              <p style={{ margin:"0 0 6px",fontSize:12,color:"#9ca3af" }}>Quellen</p>
              {selected.sources.map((s,i)=><a key={i} href={s} target="_blank" rel="noreferrer" style={{ display:"block",fontSize:12,color:"#6366f1",marginBottom:2 }}>{s}</a>)}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── Meetings ─────────────────────────────────────────────────────────────────

function MeetingsModule() {
  const [meetings,setMeetings] = useState([]);
  const [loading,setLoading] = useState(true);
  const [showForm,setShowForm] = useState(false);
  const [form,setForm] = useState({ title:"",date:"",participants:"",agenda:"",context:"" });
  const [submitting,setSubmitting] = useState(false);
  const [selected,setSelected] = useState(null);

  useEffect(()=>{ api.get("/nill/meetings").then(r=>setMeetings(r.data)).finally(()=>setLoading(false)); },[]);

  async function handleSubmit() {
    setSubmitting(true);
    try { const r=await api.post("/nill/meetings",form); setMeetings(p=>[r.data,...p]); setShowForm(false); setForm({ title:"",date:"",participants:"",agenda:"",context:"" }); }
    catch {} finally { setSubmitting(false); }
  }

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 }}>
        <SectionHeader title="Meeting-Vorbereitung" subtitle="NILL erstellt ein vollständiges Briefing vor jedem Meeting." />
        <PrimaryButton onClick={()=>setShowForm(v=>!v)} color="#dc2626">+ Meeting anlegen</PrimaryButton>
      </div>
      {showForm&&(
        <div style={{ background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:20,marginBottom:20 }}>
          <h3 style={{ margin:"0 0 14px",fontSize:15,fontWeight:600 }}>Meeting-Briefing anfordern</h3>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <FormField label="Titel" value={form.title} onChange={v=>setForm(p=>({...p,title:v}))} placeholder="z.B. Quartalsgespräch mit Kunde XY" />
            <FormField label="Datum & Uhrzeit" value={form.date} onChange={v=>setForm(p=>({...p,date:v}))} type="datetime-local" />
            <FormField label="Teilnehmer" value={form.participants} onChange={v=>setForm(p=>({...p,participants:v}))} placeholder="Namen oder E-Mails, kommagetrennt" />
            <FormField label="Agenda / Themen" value={form.agenda} onChange={v=>setForm(p=>({...p,agenda:v}))} rows={2} placeholder="Was soll besprochen werden?" />
            <FormField label="Kontext für NILL" value={form.context} onChange={v=>setForm(p=>({...p,context:v}))} rows={2} placeholder="Hintergrundinfos, bisherige Zusammenarbeit…" />
          </div>
          <div style={{ display:"flex",gap:10,marginTop:14 }}>
            <PrimaryButton onClick={handleSubmit} disabled={submitting} color="#dc2626">{submitting?"NILL erstellt Briefing…":"Briefing erstellen"}</PrimaryButton>
            <GhostButton onClick={()=>setShowForm(false)}>Abbrechen</GhostButton>
          </div>
        </div>
      )}
      {loading?<div style={{ textAlign:"center",padding:40,color:"#9ca3af" }}>Lade…</div>
      :meetings.length===0?<EmptyState icon="📅" title="Kein Meeting vorbereitet" subtitle="Meeting anlegen – NILL erstellt ein vollständiges Briefing." />
      :(
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {meetings.map(m=>(
            <div key={m.id} onClick={()=>setSelected(m)} style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:"14px 18px",cursor:"pointer" }}>
              <p style={{ margin:0,fontWeight:600,fontSize:15,color:"#111827" }}>{m.title}</p>
              <p style={{ margin:"3px 0 0",fontSize:13,color:"#6b7280" }}>📅 {m.date?new Date(m.date).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"}):"—"}</p>
              {m.ai_briefing&&<p style={{ margin:"6px 0 0",fontSize:13,color:"#374151",lineHeight:1.4 }}>{m.ai_briefing.slice(0,120)}…</p>}
            </div>
          ))}
        </div>
      )}
      {selected&&(
        <Modal onClose={()=>setSelected(null)} maxWidth={580}>
          <ModalHeader title={selected.title} subtitle={selected.date?new Date(selected.date).toLocaleString("de-DE",{dateStyle:"full",timeStyle:"short"}):""} onClose={()=>setSelected(null)} />
          {selected.ai_briefing&&(
            <div style={{ background:"#f9fafb",borderRadius:8,padding:"14px 16px",marginBottom:14 }}>
              <p style={{ margin:"0 0 8px",fontSize:12,fontWeight:600,color:"#6b7280" }}>NILL-BRIEFING</p>
              <p style={{ margin:0,fontSize:14,color:"#374151",lineHeight:1.6,whiteSpace:"pre-wrap" }}>{selected.ai_briefing}</p>
            </div>
          )}
          {(selected.talking_points||[]).length>0&&(
            <div>
              <p style={{ margin:"0 0 8px",fontSize:12,fontWeight:600,color:"#6b7280" }}>GESPRÄCHSPUNKTE</p>
              <ul style={{ margin:0,padding:"0 0 0 16px" }}>{selected.talking_points.map((pt,i)=><li key={i} style={{ fontSize:13,color:"#374151",marginBottom:4 }}>{pt}</li>)}</ul>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function NILLModule() {
  const [searchParams] = useSearchParams();
  const [activeModule, setActiveModule] = useState(searchParams.get("module")||"overview");
  const [nillNotifications, setNillNotifications] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);

  useEffect(()=>{
    Promise.all([
      api.get("/nill/notifications/dashboard"),
      api.get("/nill/summary/daily"),
    ]).then(([nr,sr])=>{ setNillNotifications(nr.data||[]); setDailySummary(sr.data||null); }).catch(()=>{});
  },[]);

  const pendingCount = nillNotifications.filter(n=>n.requires_action).length;

  return (
    <PageLayout>
      <div style={{ display:"flex",gap:24,minHeight:"80vh" }}>

        {/* Sidebar */}
        <aside style={{ width:220,background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,display:"flex",flexDirection:"column",padding:"20px 0",flexShrink:0,alignSelf:"flex-start",position:"sticky",top:24 }}>
          <div style={{ padding:"0 18px 16px",borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:15 }}>N</div>
              <div>
                <p style={{ margin:0,fontWeight:700,fontSize:14,color:"#111827" }}>NILL</p>
                <p style={{ margin:0,fontSize:11,color:"#9ca3af" }}>KI-Sekretärin</p>
              </div>
            </div>
          </div>
          <nav style={{ flex:1,padding:"12px 8px" }}>
            {MODULES.map(m=>{
              const active=activeModule===m.id;
              return (
                <button key={m.id} onClick={()=>setActiveModule(m.id)} style={{ display:"flex",alignItems:"center",gap:9,width:"100%",padding:"9px 10px",borderRadius:8,border:"none",cursor:"pointer",background:active?"#f5f3ff":"none",color:active?m.color:"#374151",fontWeight:active?600:400,fontSize:13,textAlign:"left",marginBottom:1,transition:"background 0.1s" }}>
                  <span style={{ fontSize:15 }}>{m.icon}</span>
                  <span style={{ flex:1 }}>{m.label}</span>
                  {m.id==="overview"&&pendingCount>0&&(
                    <span style={{ background:"#f59e0b",color:"#fff",borderRadius:99,fontSize:10,fontWeight:700,padding:"1px 6px",minWidth:16,textAlign:"center" }}>{pendingCount}</span>
                  )}
                </button>
              );
            })}
          </nav>
          <div style={{ padding:"12px 18px",borderTop:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:6 }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"#059669",display:"inline-block" }} />
            <span style={{ fontSize:12,color:"#6b7280" }}>Online</span>
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex:1,minWidth:0 }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeModule} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }} transition={{ duration:0.15 }}
              style={{ background:"#fff",border:"1px solid #e5e7eb",borderRadius:14,padding:28 }}>
              {activeModule==="overview"     && <OverviewModule nillNotifications={nillNotifications} dailySummary={dailySummary} />}
              {activeModule==="applications" && <ApplicationsModule />}
              {activeModule==="travel"       && <TravelModule />}
              {activeModule==="contracts"    && <ContractsModule />}
              {activeModule==="onboarding"   && <OnboardingModule />}
              {activeModule==="competitors"  && <CompetitorsModule />}
              {activeModule==="meetings"     && <MeetingsModule />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </PageLayout>
  );
}
