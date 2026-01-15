import DOMPurify from "dompurify";

function isPlainText(html) {
  // kein HTML-Tag → Plain Text
  return !/<[a-z][\s\S]*>/i.test(html);
}

export default function SafeEmailHtml({ html }) {
  if (!html) return <i>Kein Inhalt</i>;

  const plainText = isPlainText(html);

  const cleanHtml = plainText
    ? html.replace(/\n/g, "<br />")
    : DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        RETURN_TRUSTED_TYPE: false,
        ADD_TAGS: ["style", "img"],
        ADD_ATTR: ["target", "rel", "src", "width", "height", "style"],
        FORBID_ATTR: ["onclick", "onerror", "onload"],
        FORBID_TAGS: ["script", "iframe", "object", "embed", "video"],
      });

  return (
    <div
      className={`email-body-render ${plainText ? "plain-text" : "html-mail"}`}
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
