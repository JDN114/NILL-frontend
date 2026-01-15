import DOMPurify from "dompurify";

export default function SafeEmailHtml({ html }) {
  if (!html) return <i>Kein Inhalt</i>;

  // Prüfen, ob die Email nur Plain-Text ist (keine HTML-Tags)
  const isPlainText = !/<[a-z][\s\S]*>/i.test(html);

  // HTML sanitizen, aber keine Farbänderungen erzwingen
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
      className={`email-body-render
        prose prose-invert max-w-none
        text-sm leading-relaxed break-words
        ${isPlainText ? "plain-text" : "html-mail"}
      `}
      style={{
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        maxHeight: "calc(88vh - 150px)",
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
