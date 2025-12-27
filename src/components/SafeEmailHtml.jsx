import DOMPurify from "dompurify";

export default function SafeEmailHtml({ html }) {
  if (!html) return <i>Kein Inhalt</i>;

  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    RETURN_TRUSTED_TYPE: false,
    ADD_TAGS: ["style", "img"],
    ADD_ATTR: ["target", "rel", "src", "width", "height", "style"],
    FORBID_ATTR: ["onclick", "onerror", "onload"], // unsichere JS-Events
    FORBID_TAGS: ["script", "iframe", "object", "embed", "video"], // potentiell gefährlich
  });

  return (
    <div
      className="
        email-body-render
        prose prose-invert max-w-none
        text-sm leading-relaxed
        break-words
      "
      style={{
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        maxHeight: "calc(88vh - 150px)", // dynamisch für Header & Buttons
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
