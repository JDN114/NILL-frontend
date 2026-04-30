// src/components/ImapAccountSwitcher.jsx
//
// Kleines Sidebar-Element, das nur erscheint wenn der User mehrere IMAP-
// Postfächer angebunden hat. Zeigt das aktive Postfach und erlaubt Wechseln.
//
// Wird in EmailsPage.jsx oben in der Sidebar gerendert wenn provider==='imap'.

import React, { useContext, useState } from "react";
import { ImapContext } from "../context/ImapContext";

export default function ImapAccountSwitcher() {
  const imap = useContext(ImapContext);
  const [open, setOpen] = useState(false);

  const accounts = imap?.accounts ?? [];
  const active   = imap?.activeAccount ?? null;

  if (!active || accounts.length <= 1) {
    // Bei nur einem Konto zeigen wir es als statisches Label.
    if (active) {
      return (
        <div className="px-3 py-2 text-xs text-gray-400 truncate" title={active.email}>
          {active.email}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition"
        title="Postfach wechseln"
      >
        <span className="truncate flex-1 text-left">{active.email}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
            {accounts.map(a => (
              <button
                key={a.id}
                onClick={() => { imap.setActiveAccount(a.id); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs transition ${
                  a.id === active.id ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <div className="truncate font-medium">{a.email}</div>
                {a.status === "needs_reauth" && (
                  <div className="text-amber-400 text-[10px] mt-0.5">Verbindung erneuern</div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
