import DOMPurify from "dompurify";

export default function SafeEmailHtml({ html }) {
  if (!html) return <i>Kein Inhalt</i>;

  // 1️⃣ Plain-Text erkennen
  const isPlainText = !/<[a-z][\s\S]*>/i.test(html);

  // 2️⃣ Hell-Dunkel HTML Hintergrund erkennen
  const hasLightBg = /background\s*:\s*(#fff|white)/i.test(html);

  // 3️⃣ Sauberer HTML-Inhalt
  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    RETURN_TRUSTED_TYPE: false,
    ADD_TAGS: ["style", "img"],
    ADD_ATTR: ["target", "rel", "src", "width", "height", "style"],
    FORBID_ATTR: ["onclick", "onerror", "onload"],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "video"],
  });

  // 4️⃣ Dynamische Klassen setzen
  const classes = [
    "email-body-render",
    "prose",
    "prose-invert",
    "max-w-none",
    "text-sm",
    "leading-relaxed",
    "break-words",
    isPlainText ? "plain-text" : "",
    hasLightBg ? "has-light-bg" : (!isPlainText ? "html-mail" : ""),
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
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
