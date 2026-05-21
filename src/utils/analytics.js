const GA_ID = import.meta.env.VITE_GA_ID;
let loaded = false;

function _gtag(...args) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function initAnalytics() {
  if (!GA_ID || loaded) return;
  loaded = true;

  window.gtag = _gtag;
  _gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied" });
  _gtag("js", new Date());
  _gtag("config", GA_ID, { anonymize_ip: true, send_page_view: false });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function grantAnalytics() {
  if (!GA_ID) return;
  if (!loaded) initAnalytics();
  _gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied" });
}

export function denyAnalytics() {
  if (!loaded) return;
  _gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
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
