// src/components/SafeEmailHtml.jsx
import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import DOMPurify from "dompurify";
import { useTheme } from "../context/ThemeContext";

// ─────────────────────────────────────────────
// Farb-Normalisierung
// Entfernt problematische Farb-Inline-Styles aus Email-HTML
// damit weder Dark- noch Light-Theme zerstört werden.
// ─────────────────────────────────────────────

const DARK_BG_THRESHOLD = 30;   // RGB-Helligkeit unter der eine BG als "dunkel" gilt

// Helligkeit des Panel-Hintergrunds, auf dem der Mail-Body ohne eigene
// Hintergrundfarbe landet (Detail-View Surface je Theme).
const THEME_BASE_LUM = { light: 245, dark: 16 };
// Mindest-Helligkeitsabstand Text↔Hintergrund, darunter greifen wir ein.
const MIN_LUM_DELTA = 90;

function parseRgb(str) {
  const m = str.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  const hex = str.match(/^#([0-9a-f]{3,6})$/i);
  if (hex) {
    const h = hex[1].length === 3
      ? hex[1].split("").map((c) => c + c).join("")
      : hex[1];
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  return null;
}

function luminance({ r, g, b }) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Entfernt oder neutralisiert problematische Farb-Properties in einem style-String
function neutralizeStyle(styleStr) {
  if (!styleStr) return styleStr;

  // Block CSS exfiltration and legacy IE/Mozilla execution vectors
  const dangerous = /url\s*\(|expression\s*\(|javascript\s*:|-moz-binding\s*:|behavior\s*:/i;
  if (dangerous.test(styleStr)) return "";

  return styleStr
    // Entferne explizit weiße/helle Backgrounds
    .replace(/background(?:-color)?\s*:\s*([^;]+)/gi, (match, val) => {
      const trimmed = val.trim().toLowerCase();
      // Transparente Werte behalten
      if (trimmed === "transparent" || trimmed === "none") return match;
      const rgb = parseRgb(trimmed);
      if (rgb && luminance(rgb) > 200) return "background: transparent";
      // Sehr dunkle Backgrounds (fast schwarz) auch entfernen
      if (rgb && luminance(rgb) < DARK_BG_THRESHOLD) return "background: transparent";
      return match;
    });
}

// Effektiver Hintergrund eines Elements: nächste explizite Inline-BG/bgcolor
// auf dem Element selbst oder einem Vorfahren, sonst der Theme-Grund.
function effectiveBgLum(el, baseLum) {
  let node = el;
  while (node && node.nodeType === 1) {
    const style = node.getAttribute("style") || "";
    const m = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
    const candidates = [];
    if (m) candidates.push(m[1]);
    const bgAttr = node.getAttribute("bgcolor");
    if (bgAttr) candidates.push(bgAttr);
    for (const c of candidates) {
      const t = c.trim().toLowerCase();
      if (t === "transparent" || t === "none" || t === "inherit") continue;
      const rgb = parseRgb(t);
      if (rgb) return luminance(rgb);
    }
    node = node.parentElement;
  }
  return baseLum;
}

// Prüft jede explizite Textfarbe gegen ihren effektiven Hintergrund und
// erzwingt Mindestkontrast — theme-abhängig (weißer Newsletter-Text wäre
// im Light-Mode sonst unsichtbar, dunkler Text im Dark-Mode ebenso).
function ensureTextContrast(doc, baseLum) {
  doc.querySelectorAll("[style], font[color]").forEach((el) => {
    const style = el.getAttribute("style") || "";
    const m = style.match(/(?<![a-z-])color\s*:\s*([^;]+)/i);
    let colorVal = m ? m[1].trim().toLowerCase() : null;
    const fromFontAttr = !colorVal && el.tagName === "FONT" && el.getAttribute("color");
    if (fromFontAttr) colorVal = el.getAttribute("color").trim().toLowerCase();
    if (!colorVal || colorVal === "inherit" || colorVal === "currentcolor") return;
    const rgb = parseRgb(colorVal);
    if (!rgb) return;
    const bgLum = effectiveBgLum(el, baseLum);
    if (Math.abs(luminance(rgb) - bgLum) >= MIN_LUM_DELTA) return;
    // Auf Theme-Grund darf das Theme-CSS färben (inherit); auf explizitem
    // Mail-Hintergrund braucht es eine harte Gegenfarbe.
    const replacement = bgLum === baseLum
      ? "inherit"
      : bgLum < 128 ? "#f4f4f5" : "#1f2937";
    if (m) {
      el.setAttribute("style", style.replace(m[0], `color: ${replacement}`));
    } else if (replacement === "inherit") {
      el.removeAttribute("color");
    } else {
      el.setAttribute("color", replacement);
    }
  });
}

// Traversiert den DOM-Baum nach DOMPurify und normalisiert style-Attribute
function normalizeEmailDom(doc, baseLum) {
  const allElements = doc.querySelectorAll("[style]");
  allElements.forEach((el) => {
    const normalized = neutralizeStyle(el.getAttribute("style"));
    if (normalized !== el.getAttribute("style")) {
      el.setAttribute("style", normalized);
    }
  });

  // Explizit bgcolor-Attribute auf Tabellen/TDs entfernen (altes Email-HTML)
  doc.querySelectorAll("[bgcolor]").forEach((el) => {
    const rgb = parseRgb(el.getAttribute("bgcolor") || "");
    if (rgb && luminance(rgb) > 180) el.removeAttribute("bgcolor");
  });

  // Erst nach dem BG-Stripping prüfen — der effektive Hintergrund steht dann fest
  ensureTextContrast(doc, baseLum);

  return doc;
}

// ─────────────────────────────────────────────
// Haupt-Komponente
// ─────────────────────────────────────────────
export default function SafeEmailHtml({ html }) {
  const { theme } = useTheme();
  const baseLum = THEME_BASE_LUM[theme] ?? THEME_BASE_LUM.dark;
  const isPlainText = html ? !/<\/?[a-z][\s\S]*>/i.test(html) : false;

  const cleanHtml = useMemo(() => {
    if (!html) return "";

    // DOMPurify mit FORCE_BODY damit wir einen vollständigen DOM traversieren können
    const dirty = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      FORCE_BODY: true,
      ADD_TAGS: ["img", "a"],
      ADD_ATTR: [
        "href", "src", "alt", "title",
        "width", "height", "target", "rel",
        "style", "bgcolor", "color",
        "cellpadding", "cellspacing", "border",
      ],
      FORBID_TAGS: [
        "script", "iframe", "object", "embed",
        "video", "audio", "svg", "math",
        "form", "input", "button", "textarea",
      ],
      FORBID_ATTR: [
        "onerror", "onload", "onclick",
        "onmouseover", "onfocus", "onmouseenter",
      ],
      ALLOWED_URI_REGEXP:
        /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    });

    if (isPlainText) return dirty;

    // DOM-Normalisierung nach Sanitize
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirty, "text/html");
    normalizeEmailDom(doc, baseLum);

    // Links absichern
    doc.querySelectorAll('a[target="_blank"]').forEach((a) => {
      a.setAttribute("rel", "noopener noreferrer");
    });
    // Alle externen Links in neuem Tab öffnen
    doc.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("http")) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });

    return doc.body.innerHTML;
  }, [html, isPlainText, baseLum]);

  // ── Scale-to-fit (mobile) ──────────────────────────────────────────────
  // Fixed-width HTML newsletters (600–700px tables) don't reflow to a phone.
  // Rather than clip them (right half hidden — and pinch-zoom is disabled) or
  // force an awkward horizontal scroll, we measure the email's real width and
  // shrink the whole thing with a CSS transform so it fits the screen, exactly
  // like Apple Mail / Gmail. On desktop (wide pane) this is a no-op.
  const wrapRef  = useRef(null);
  const innerRef = useRef(null);
  const [, setScale]     = useState(1);
  const [wrapH, setWrapH]     = useState(null);
  const lastWidth = useRef(0);

  useLayoutEffect(() => {
    const wrap = wrapRef.current, inner = innerRef.current;
    if (!wrap || !inner) return;

    const fit = () => {
      const avail = wrap.clientWidth;
      if (!avail) return;
      // Reset before measuring so we read the email's natural width, not a
      // previously-scaled one.
      inner.style.transform = "none";
      inner.style.width = "";
      const onMobile = window.matchMedia("(max-width: 768px)").matches;
      const natural = inner.scrollWidth;
      if (onMobile && natural > avail + 2) {
        const s = avail / natural;
        inner.style.width = natural + "px";
        inner.style.transform = `scale(${s})`;
        inner.style.transformOrigin = "top left";
        setScale(s);
        setWrapH(inner.scrollHeight * s);
      } else {
        inner.style.width = "";
        inner.style.transform = "none";
        setScale(1);
        setWrapH(null);
      }
      lastWidth.current = avail;
    };

    fit();
    // Re-fit on container width changes (rotation, split-view) — guarded so the
    // height we set doesn't retrigger an infinite loop (width stays the same).
    const ro = new ResizeObserver(() => {
      if (wrap.clientWidth !== lastWidth.current) fit();
    });
    ro.observe(wrap);
    // Images load asynchronously and change the natural size — re-fit then.
    const imgs = inner.querySelectorAll("img");
    imgs.forEach((img) => { if (!img.complete) img.addEventListener("load", fit, { once: true }); });
    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", fit));
    };
  }, [cleanHtml]);

  if (!html) return <i className="text-gray-400">Kein Inhalt</i>;

  if (isPlainText) {
    return (
      <div className="email-body-render plain-text">
        <pre>{html.replace(/<[^>]+>/g, "")}</pre>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", overflow: wrapH ? "hidden" : undefined, height: wrapH ? `${wrapH}px` : undefined }}
    >
      <div
        ref={innerRef}
        className="email-body-render html-mail"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
}
