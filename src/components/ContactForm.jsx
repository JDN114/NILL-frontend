import React, { useState } from "react";
import axios from "axios";

export default function ContactForm(){
  const [email,setEmail] = useState("");
  const [msg,setMsg] = useState("");
  const [ok,setOk] = useState(null);

  async function submit(e){
    e.preventDefault();
    try{
      // Beispiel: POST an /api/contact (backend muss existieren)
      await axios.post("/api/contact", { email, message: msg });
      setOk(true);
      setEmail(""); setMsg("");
    }catch(err){
      setOk(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto">
      <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="Ihre E-Mail" className="w-full p-3 rounded-lg bg-[#0b1220] border border-white/5 mb-3" />
      <textarea value={msg} onChange={e=>setMsg(e.target.value)} required placeholder="Nachricht" rows={5} className="w-full p-3 rounded-lg bg-[#0b1220] border border-white/5 mb-3" />
      <button type="submit" className="px-6 py-3 rounded bg-[var(--brand)] text-white">Senden</button>
      {ok === true && <p className="mt-3 text-green-400">Danke — wir melden uns.</p>}
      {ok === false && <p className="mt-3 text-red-400">Fehler beim Senden.</p>}
    </form>
  );
}
