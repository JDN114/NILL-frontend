// NILL PWA Service Worker — push notifications + offline caching
const CACHE = "nill-v1";

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
  // Don't intercept API or cross-origin requests
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

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    "/logo192.png",
      badge:   "/logo192.png",
      data:    { url: data.url },
      vibrate: [150, 50, 150],
      tag:     data.url,
      renotify: true,
    })
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
