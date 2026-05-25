import { useEffect, useRef } from "react";
import api from "../services/api";

const INACTIVITY_MS  = 60 * 60 * 1000; // 60 minutes
const CHECK_INTERVAL = 30 * 1000;       // poll every 30 s
const LS_KEY         = "nill_last_activity";

async function doLogout() {
  try { await api.post("/auth/logout"); } catch {}
  window.location.href = "/login?reason=inactivity";
}

export default function useInactivityLogout(isAuthenticated) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Stamp activity into localStorage so all tabs share the same clock
    const stamp = () => localStorage.setItem(LS_KEY, String(Date.now()));

    // Check whether the stored timestamp is older than the limit
    const check = () => {
      const last = parseInt(localStorage.getItem(LS_KEY) || "0", 10);
      if (Date.now() - last >= INACTIVITY_MS) doLogout();
    };

    const events = ["mousemove", "keydown", "pointerdown", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, stamp, { passive: true }));

    // Also check immediately when tab becomes visible again
    const onVisible = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVisible);

    // Write an initial stamp so the clock starts from now
    stamp();

    // Poll every 30 s — short enough to catch the deadline regardless of throttling
    intervalRef.current = setInterval(check, CHECK_INTERVAL);

    return () => {
      clearInterval(intervalRef.current);
      events.forEach(e => window.removeEventListener(e, stamp));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isAuthenticated]);
}
