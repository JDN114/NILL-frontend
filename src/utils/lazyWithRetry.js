import { lazy } from "react";

// Drop-in replacement for React.lazy that survives a failed dynamic import.
//
// A lazy chunk import() can reject for reasons that have nothing to do with the
// route's code:
//   • stale shell after a deploy — a long-lived tab/PWA holds an entry chunk
//     that references hashed chunk names the new Vercel build already replaced,
//     so /assets/<oldhash>.js 404s,
//   • an offline blip or interrupted module fetch,
//   • a service worker handing back HTML for a .js request.
// Safari surfaces all of these as "TypeError: Importing a module script failed".
//
// On the first such failure we force one full reload: the fresh index.html pulls
// the current chunk hashes and the route recovers automatically. A sessionStorage
// guard prevents reload loops when the failure is genuinely persistent (truly
// offline, or a real bug) — the second attempt rethrows so the ErrorBoundary /
// Suspense fallback can take over.
const RELOAD_FLAG = "nill_chunk_reload";

export function lazyWithRetry(factory) {
  return lazy(async () => {
    try {
      const mod = await factory();
      // Clear the guard on success so a later unrelated failure can reload again.
      window.sessionStorage.removeItem(RELOAD_FLAG);
      return mod;
    } catch (err) {
      if (!window.sessionStorage.getItem(RELOAD_FLAG)) {
        window.sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
        // Keep the Suspense fallback up until the reload takes over instead of
        // flashing the error UI for a frame.
        return new Promise(() => {});
      }
      throw err;
    }
  });
}
