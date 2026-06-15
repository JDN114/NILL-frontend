// NILL PWA Service Worker — push notifications + offline caching
const CACHE = "nill-v6";

// ── Install: cache essential shell ──────────────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll(["/", "/offline.html"]).catch(() => {})
    )
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ───────────────────────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

// ── Fetch: network-first, offline fallback ───────────────────────────────────
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api")) return;

  // Navigation requests (HTML documents) — e.g. opening /emails from a push
  // notification. Always go network-first, and on failure fall back to the
  // single cached app shell, NEVER to a per-route cached document. A stale
  // per-route document references hashed JS bundles that no longer exist after
  // a deploy (Vercel only serves the latest build's /assets), which renders a
  // blank, unrendered page. The shell is re-fetched by the live index.html.
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put("/index.html", clone));
          }
          return res;
        })
        .catch(async () =>
          (await caches.match("/index.html")) ||
          (await caches.match("/")) ||
          caches.match("/offline.html")
        )
    );
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(e.request);
        if (cached) return cached;
        // Never hand the HTML offline page back for a script/style/asset
        // request: the browser would try to evaluate offline.html as an ES
        // module and throw "Importing a module script failed" (guaranteed
        // under X-Content-Type-Options: nosniff). Only real document requests
        // may fall back to offline.html; everything else fails as a network
        // error so the app's lazyWithRetry can reload instead.
        if (e.request.destination === "document") {
          return caches.match("/offline.html");
        }
        return Response.error();
      })
  );
});

// ── Push: receive and display notification ───────────────────────────────────
self.addEventListener("push", (e) => {
  let data = { title: "NILL", body: "Neue Benachrichtigung", url: "/" };
  if (e.data) {
    try {
      data = { ...data, ...JSON.parse(e.data.text()) };
    } catch {}
  }

  // Broadcast to any open clients so the app can show an in-app toast
  // even when the OS blocks the system notification.
  self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    clients.forEach((c) => c.postMessage({ type: "PUSH", ...data }));
  });

  // Use minimal options — vibrate/badge/renotify are unsupported on macOS
  // Safari and can silently cause showNotification to fail.
  const show = (opts) => self.registration.showNotification(data.title, opts);

  e.waitUntil(
    show({ body: data.body, icon: "/logo192.png", data: { url: data.url } })
      .catch(() =>
        // Retry without icon in case the browser can't resolve it
        show({ body: data.body, data: { url: data.url } })
      )
      .catch(() => {}) // swallow if showNotification is entirely blocked
  );
});

// ── Notification click: focus/open the app ───────────────────────────────────
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const raw = e.notification.data?.url || "/";
  const target = raw.startsWith("http") ? raw : self.location.origin + raw;
  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Reuse an already-open app window when possible. We focus it first
        // (focus works on any client) and then hand the route to the SPA via
        // postMessage. We intentionally avoid WindowClient.navigate(): it only
        // works on clients *controlled* by this worker and silently rejects for
        // uncontrolled windows (which matchAll returns here), which would leave
        // the click dead and never reach the destination.
        const appClient =
          clients.find((c) => c.url === target) ||
          clients.find((c) => c.url.startsWith(self.location.origin));
        if (appClient) {
          return Promise.resolve(appClient.focus())
            .then((c) => (c || appClient).postMessage({ type: "NAVIGATE", url: raw }))
            .catch(() => self.clients.openWindow(target));
        }
        return self.clients.openWindow(target);
      })
  );
});
