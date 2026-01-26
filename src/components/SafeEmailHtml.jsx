// src/components/SafeEmailHtml.jsx
import React from "react";
import DOMPurify from "dompurify";

export default function SafeEmailHtml({ html }) {
  if (!html) return <i className="text-gray-400">Kein Inhalt</i>;

  const isPlainText = !/<\/?[a-z][\s\S]*>/i.test(html);

  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },

    // ❌ KEIN <style> – Mail-Client-Standard
    ADD_TAGS: ["img", "a"],

    ADD_ATTR: [
      "href",
      "src",
      "alt",
      "title",
      "width",
      "height",
      "target",
      "rel",
      "style", // erlaubt, aber weiter unten eingeschränkt
    ],

    FORBID_TAGS: [
      "script",
      "iframe",
      "object",
      "embed",
      "video",
      "audio",
      "svg",
      "math",
      "form",
      "input",
      "button",
      "textarea",
    ],

    FORBID_ATTR: [
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onfocus",
      "onmouseenter",
    ],

    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });

  // 🔐 target=_blank absichern
  const securedHtml = cleanHtml.replace(
    /<a\s+([^>]*target="_blank"[^>]*)>/gi,
    '<a $1 rel="noopener noreferrer">'
  );

  const classes = [
    "email-body-render",
    "prose",
    "prose-invert",
    "max-w-none",
    "text-sm",
    "leading-relaxed",
    "break-words",
    isPlainText ? "plain-text" : "html-mail",
  ].join(" ");

  return (
    <div
      className={classes}
      style={{
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        maxHeight: "calc(88vh - 150px)",
      }}
      dangerouslySetInnerHTML={{ __html: securedHtml }}
    />
  );
}
