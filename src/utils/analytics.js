const GA_ID = import.meta.env.VITE_GA_ID;
let ready = false;

export function initAnalytics() {
  if (!GA_ID || ready) return;
  ready = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied" });
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true, send_page_view: false });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function trackPage(path, title) {
  if (!window.gtag || !GA_ID) return;
  const cleanPath = path.split("?")[0].split("#")[0];
  window.gtag("event", "page_view", {
    page_path: cleanPath,
    page_title: title || document.title,
    page_location: window.location.origin + cleanPath,
  });
}

export function trackEvent(name, params = {}) {
  if (!window.gtag) return;
  window.gtag("event", name, params);
}
