// PWA service worker registration
if ("serviceWorker" in navigator) {
  // When a new service worker takes control, reload once so the page runs the
  // latest shell + assets. Without this, an old SW can keep serving a stale
  // app shell that points at deleted JS bundles → blank, unrendered page.
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // Check for an updated SW immediately and whenever the app regains focus.
        reg.update();
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") reg.update();
        });
      })
      .catch((err) => console.warn("SW registration failed:", err));
  });
}
