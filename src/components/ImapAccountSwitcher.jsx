// src/components/ImapAccountSwitcher.jsx
import React, { useContext, useState } from "react";
import { ImapContext } from "../context/ImapContext";
import ImapConnectModal from "./ImapConnectModal";

function StatusDot({ status }) {
  const color = status === "active" ? "bg-emerald-400" : status === "needs_reauth" ? "bg-amber-400" : "bg-red-400";
  return <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />;
}

export default function ImapAccountSwitcher() {
  const imap = useContext(ImapContext);
  const [open,      setOpen]      = useState(false);
  const [addOpen,   setAddOpen]   = useState(false);
  const [reauthAcc, setReauthAcc] = useState(null);

  const accounts = imap?.accounts ?? [];
  const active   = imap?.activeAccount ?? null;

  const handleConnected = async () => {
    await imap?.fetchStatus?.();
    setAddOpen(false);
    setReauthAcc(null);
  };

  if (!active) return null;

  // Single account — compact row with status
  if (accounts.length === 1) {
    const needsReauth = active.status === "needs_reauth";
    return (
      <>
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <StatusDot status={active.status} />
            <span className="text-xs text-gray-400 truncate">{active.email}</span>
          </div>
          {needsReauth && (
            <button
              onClick={() => { setReauthAcc(active); setAddOpen(true); }}
              className="text-[10px] text-amber-400 hover:text-amber-300 transition whitespace-nowrap"
            >
              Erneuern
            </button>
          )}
        </div>
        <ImapConnectModal
          open={addOpen}
          account={reauthAcc}
          onClose={() => { setAddOpen(false); setReauthAcc(null); }}
          onConnected={handleConnected}
        />
      </>
    );
  }

  // Multiple accounts — dropdown switcher
  return (
    <>
      <div className="relative px-2 py-1">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition"
        >
          <StatusDot status={active.status} />
          <span className="truncate flex-1 text-left">{active.email}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-2 right-2 mt-1 bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-20 overflow-hidden">
              {accounts.map(a => (
                <button
                  key={a.id}
                  onClick={() => {
                    if (a.status === "needs_reauth") {
                      setReauthAcc(a); setAddOpen(true); setOpen(false);
                    } else {
                      imap.setActiveAccount(a.id); setOpen(false);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition flex items-center gap-2 ${
                    a.id === active.id ? "bg-white/8 text-white" : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <StatusDot status={a.status} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{a.email}</div>
                    {a.status === "needs_reauth" && (
                      <div className="text-amber-400 text-[10px]">Verbindung erneuern →</div>
                    )}
                  </div>
                  {a.id === active.id && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
              <div className="border-t border-gray-800">
                <button
                  onClick={() => { setReauthAcc(null); setAddOpen(true); setOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition flex items-center gap-2"
                >
                  <span className="text-gray-600">+</span> Weiteres Postfach verbinden
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ImapConnectModal
        open={addOpen}
        account={reauthAcc}
        onClose={() => { setAddOpen(false); setReauthAcc(null); }}
        onConnected={handleConnected}
      />
    </>
  );
}
