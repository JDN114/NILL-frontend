import DOMPurify from "dompurify";

export default function SafeEmailHtml({ html }) {
  if (!html) return <i className="text-gray-400">Kein Inhalt</i>;

  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    RETURN_TRUSTED_TYPE: false,
    ADD_TAGS: ["style", "img"],
    ADD_ATTR: ["target", "rel", "src", "width", "height", "style"],
    FORBID_ATTR: ["onclick", "onerror", "onload"],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "video"],
  });

  return (
    <div
      className="
        email-body-render
        prose prose-invert max-w-none
        text-[13px] leading-relaxed
        break-words
      "
      style={{
        width: "100%",
        maxHeight: "calc(80vh - 140px)",
        overflowY: "auto",
        overflowX: "hidden",

        /* 👇 DAS ist der Schlüssel für Interface-Mails */
        transform: "scale(0.92)",
        transformOrigin: "top left",

        /* 👇 erzwingt helle Schrift, auch gegen Inline-Styles */
        color: "#e5e7eb", // Tailwind gray-200
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
