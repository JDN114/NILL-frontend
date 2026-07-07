import { useEffect, useRef } from "react";
import api, { refreshSession } from "../services/api";

const LS_KEY         = "nill_last_activity";
const PREF_KEY       = "nill_inactivity_pref";   // stores the chosen option `id`
const CHECK_INTERVAL = 30 * 1000;                 // poll every 30 s
const REFRESH_MIN_GAP = 5 * 60 * 1000;            // slide the server session at most every 5 min
const PREF_EVENT     = "nill-inactivity-pref-changed";

// Ordered list shown in Settings. `ms` is the idle window before auto-logout;
// `serverSeconds` is the cookie/JWT lifetime the backend is asked to hold
// (clamped server-side to [5 min, 7 days]).
//   "always" → log out the moment the tab is hidden / left (client-side).
//   "never"  → never auto-log-out client-side; server keeps the max sliding window.
export const INACTIVITY_OPTIONS = [
  // "always": client logs out immediately when the tab is hidden; the server
  // window only needs headroom over REFRESH_MIN_GAP so an *active* tab never
  // expires mid-use. It also caps the residual session after an unclean close.
  { id: "always", label: "Immer – sofort beim Verlassen", ms: 0,                         serverSeconds: 15 * 60 },
  { id: "15m",    label: "Nach 15 Minuten",               ms: 15 * 60 * 1000,            serverSeconds: 15 * 60 },
  { id: "1h",     label: "Nach 1 Stunde",                 ms: 60 * 60 * 1000,            serverSeconds: 60 * 60 },
  { id: "8h",     label: "Nach 8 Stunden",                ms: 8 * 60 * 60 * 1000,        serverSeconds: 8 * 60 * 60 },
  { id: "1d",     label: "Nach 1 Tag",                    ms: 24 * 60 * 60 * 1000,       serverSeconds: 24 * 60 * 60 },
  { id: "3d",     label: "Nach 3 Tagen (Standard)",       ms: 3 * 24 * 60 * 60 * 1000,   serverSeconds: 3 * 24 * 60 * 60 },
  { id: "7d",     label: "Nach 7 Tagen",                  ms: 7 * 24 * 60 * 60 * 1000,   serverSeconds: 7 * 24 * 60 * 60 },
  { id: "never",  label: "Nie – bis zur manuellen Abmeldung", ms: Infinity,             serverSeconds: 7 * 24 * 60 * 60 },
];

export const DEFAULT_INACTIVITY_ID = "3d";

export function getInactivityOption(id) {
  return (
    INACTIVITY_OPTIONS.find((o) => o.id === id) ||
    INACTIVITY_OPTIONS.find((o) => o.id === DEFAULT_INACTIVITY_ID)
  );
}

export function getInactivityPref() {
  return localStorage.getItem(PREF_KEY) || DEFAULT_INACTIVITY_ID;
}

// Persist the choice, re-scope the server session immediately, and notify the
// running hook in this tab (the `storage` event only fires in *other* tabs).
export function setInactivityPref(id) {
  const opt = getInactivityOption(id);
  localStorage.setItem(PREF_KEY, opt.id);
  refreshSession(opt.serverSeconds);
  window.dispatchEvent(new Event(PREF_EVENT));
}

async function doLogout() {
  try { await api.post("/auth/logout"); } catch { /* ignore */ }
  localStorage.removeItem("nill_imap_saved");
  window.location.href = "/login?reason=inactivity";
}

export default function useInactivityLogout(isAuthenticated) {
  const intervalRef    = useRef(null);
  const lastRefreshRef = useRef(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Stamp activity into localStorage so all tabs share the same clock.
    const stamp = () => localStorage.setItem(LS_KEY, String(Date.now()));

    // Push the server session forward, throttled, so an active user's cookie/JWT
    // never expires under them regardless of the chosen window.
    const slide = () => {
      const now = Date.now();
      if (now - lastRefreshRef.current < REFRESH_MIN_GAP) return;
      lastRefreshRef.current = now;
      refreshSession(getInactivityOption(getInactivityPref()).serverSeconds);
    };

    const onActivity = () => { stamp(); slide(); };

    // Idle deadline check. "always" is handled purely by the visibility handler;
    // "never" disables the client-side auto-logout entirely.
    const check = () => {
      const opt = getInactivityOption(getInactivityPref());
      if (opt.id === "always" || opt.id === "never") return;
      const last = parseInt(localStorage.getItem(LS_KEY) || "0", 10);
      if (Date.now() - last >= opt.ms) doLogout();
    };

    const events = ["mousemove", "keydown", "pointerdown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    // On "always", log out as soon as the tab is hidden/left. Otherwise just
    // re-check the deadline when the tab becomes visible again.
    const onVisible = () => {
      if (document.visibilityState === "visible") { check(); return; }
      if (getInactivityPref() === "always") doLogout();
    };
    document.addEventListener("visibilitychange", onVisible);

    // Re-align the server session immediately whenever the choice changes
    // (same tab via custom event, other tabs via storage event).
    const onPrefChange = () => { lastRefreshRef.current = 0; slide(); };
    const onStorage = (e) => { if (e.key === PREF_KEY) onPrefChange(); };
    window.addEventListener(PREF_EVENT, onPrefChange);
    window.addEventListener("storage", onStorage);

    stamp();
    // Align the server cookie/JWT lifetime to the stored choice on mount — login
    // only issues the 3-day default, so a longer/shorter choice takes effect here.
    lastRefreshRef.current = 0;
    slide();

    // Poll every 30 s — short enough to catch the deadline regardless of throttling.
    intervalRef.current = setInterval(check, CHECK_INTERVAL);

    return () => {
      clearInterval(intervalRef.current);
      events.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener(PREF_EVENT, onPrefChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [isAuthenticated]);
}
