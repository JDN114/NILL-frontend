import DOMPurify from "dompurify";
import { useMemo } from "react";

function hasLightBackground(html) {
  if (!html) return false;

  const lightBgRegex =
    /(background(-color)?\s*:\s*(#fff|#ffffff|white|rgb\(255,\s*255,\s*255\))|bgcolor\s*=\s*["']?(#fff|#ffffff|white))/i;

  return lightBgRegex.test(html);
}

export default function SafeEmailHtml({ html }) {
  if (!html) return <i>Kein Inhalt</i>;

  const isLight = useMemo(() => hasLightBackground(html), [html]);

  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["style", "img"],
    ADD_ATTR: ["target", "rel", "src", "width", "height", "style"],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "video"],
    FORBID_ATTR: ["onclick", "onerror", "onload"],
  });

  return (
    <div
      className={`
        email-body-render
        prose max-w-none
        ${isLight ? "has-light-bg prose-neutral" : "plain prose-invert"}
      `}
      style={{
        transform: "scale(0.92)",
        transformOrigin: "top left",
        width: "100%",
        overflowX: "hidden",
        maxHeight: "calc(88vh - 150px)",
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
