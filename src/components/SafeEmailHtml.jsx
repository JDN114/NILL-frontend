// src/components/SafeEmailHtml.jsx
import React, { useMemo } from "react";
import DOMPurify from "dompurify";

// ─────────────────────────────────────────────
// Farb-Normalisierung
// Entfernt problematische Farb-Inline-Styles aus Email-HTML
// damit das Dark-Theme nicht zerstört wird.
// ─────────────────────────────────────────────

const DARK_BG_THRESHOLD = 30;   // RGB-Helligkeit unter der eine BG als "dunkel" gilt
const LIGHT_TEXT_THRESHOLD = 200; // RGB-Helligkeit über der ein Text als "hell" gilt

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
    })
    // Entferne sehr dunkle oder sehr helle Textfarben
    .replace(/(?<![a-z-])color\s*:\s*([^;]+)/gi, (match, val) => {
      const trimmed = val.trim().toLowerCase();
      if (trimmed === "inherit" || trimmed === "currentcolor") return match;
      const rgb = parseRgb(trimmed);
      if (!rgb) return match;
      const lum = luminance(rgb);
      // Weißen Text (auf dunklem BG schreiben) behalten — er ist gewollt hell
      if (lum > LIGHT_TEXT_THRESHOLD) return match;
      // Sehr dunklen Text (schwarz/dunkelgrau) entfernen — wird von CSS übernommen
      if (lum < 60) return "color: inherit";
      return match;
    });
}

// Traversiert den DOM-Baum nach DOMPurify und normalisiert style-Attribute
function normalizeEmailDom(doc) {
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

  // color-Attribute auf Fonts entfernen wenn zu dunkel
  doc.querySelectorAll("font[color]").forEach((el) => {
    const rgb = parseRgb(el.getAttribute("color") || "");
    if (rgb && luminance(rgb) < 60) el.removeAttribute("color");
  });

  return doc;
}

// ─────────────────────────────────────────────
// Haupt-Komponente
// ─────────────────────────────────────────────
export default function SafeEmailHtml({ html }) {
  if (!html) return <i className="text-gray-400">Kein Inhalt</i>;

  const isPlainText = !/<\/?[a-z][\s\S]*>/i.test(html);

  const cleanHtml = useMemo(() => {
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
        /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });

    if (isPlainText) return dirty;

    // DOM-Normalisierung nach Sanitize
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirty, "text/html");
    normalizeEmailDom(doc);

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
  }, [html, isPlainText]);

  if (isPlainText) {
    return (
      <div className="email-body-render plain-text">
        <pre>{html.replace(/<[^>]+>/g, "")}</pre>
      </div>
    );
  }

  return (
    <div className="email-body-render html-mail">
      <div
        className="email-content-scroller"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
}
