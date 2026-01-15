import DOMPurify from "dompurify";

export default function SafeEmailHtml({ html }) {
  if (!html) return <i>Kein Inhalt</i>;

  // Prüfen, ob die E-Mail nur Plain-Text ist (keine HTML-Tags)
  const isPlainText = !/<[a-z][\s\S]*>/i.test(html);

  // HTML sanitizen, aber keine Farben ändern
  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["style", "img"],
    ADD_ATTR: ["target", "rel", "src", "width", "height", "style"],
    FORBID_ATTR: ["onclick", "onerror", "onload"],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "video"],
  });

  return (
    <div
      className={`email-body-render prose max-w-none break-words text-sm leading-relaxed overflow-auto ${
        isPlainText ? "text-white" : ""
      }`}
      style={{
        maxHeight: "calc(88vh - 150px)",
        width: "100%",
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
