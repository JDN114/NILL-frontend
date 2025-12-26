import DOMPurify from "dompurify";

export default function SafeEmailHtml({ html }) {
  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    RETURN_TRUSTED_TYPE: false,
    ADD_TAGS: ["style"],
    ADD_ATTR: ["target", "rel"],
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
        maxHeight: "60vh",
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
