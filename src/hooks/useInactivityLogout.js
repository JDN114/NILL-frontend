import { useEffect, useRef } from "react";
import api from "../services/api";

const INACTIVITY_MS = 60 * 60 * 1000; // 60 minutes

export default function useInactivityLogout(isAuthenticated) {
  const timer = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const reset = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        try { await api.post("/auth/logout"); } catch {}
        window.location.href = "/login?reason=inactivity";
      }, INACTIVITY_MS);
    };

    const events = ["mousemove", "keydown", "pointerdown", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(timer.current);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [isAuthenticated]);
}
