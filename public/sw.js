// NILL PWA Service Worker — push notifications + offline caching
const CACHE = "nill-v3";

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
        return cached || caches.match("/offline.html");
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
  const target = e.notification.data?.url || "/";
  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((c) => c.url.includes(self.location.origin));
        if (existing) {
          existing.focus();
          existing.navigate(target);
        } else {
          self.clients.openWindow(target);
        }
      })
  );
});
