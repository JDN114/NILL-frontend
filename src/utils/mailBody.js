// Shared helpers for the e-mail composer/reply modals.
//
// The body the user types is plain text but is delivered inside an HTML MIME
// part, so raw newlines would collapse into one wall of text at the recipient.
// We escape first (no injection) and then turn newlines into <br/>. The compose
// preview uses the exact same output, so what you preview is what is received.

export const MAX_BODY_LENGTH = 5000;

export function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function textToHtml(text, max = MAX_BODY_LENGTH) {
  return escapeHtml((text ?? "").slice(0, max)).replace(/\r\n|\r|\n/g, "<br/>");
}

// Renders the message exactly the way the recipient's mail client will, wrapping
// the body in the same markup the backend (services/gmail_helper.py:apply_template)
// applies — 680px + colored border-left.
export function buildPreviewHtml({ bodyHtml, template, dark }) {
  const pageBg = dark ? "#15151f" : "#f4f4f5";
  const inner = bodyHtml || `<span style="color:#9ca3af;">Hier erscheint Ihre Nachricht …</span>`;

  const card = template
    ? `<div style="font-family:sans-serif;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
         ${template.header_html || ""}
         <div style="padding:24px;color:#333333;border-left:4px solid ${template.brand_color || "#000000"};line-height:1.5;">
           ${inner}
         </div>
         ${template.footer_html || ""}
       </div>`
    : `<div style="font-family:sans-serif;background:#ffffff;border-radius:8px;padding:24px;color:#333333;box-shadow:0 1px 4px rgba(0,0,0,0.08);line-height:1.5;">
         ${inner}
       </div>`;

  return `<!doctype html><html><body style="margin:0;padding:20px;background:${pageBg};">
    <div style="max-width:680px;margin:0 auto;">${card}</div>
  </body></html>`;
}

// True for a syntactically valid single e-mail address.
export function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v ?? "").trim());
}

// Classify a send error: a timeout (client abort OR the backend's deliberate
// 504 "DELIVERY_UNCERTAIN") means the mail was very likely delivered anyway, so
// it should surface as a soft amber warning rather than a red failure.
export function isUncertainDelivery(err) {
  const status = err?.response?.status;
  const detail = err?.response?.data?.detail;
  return (
    err?.code === "ECONNABORTED" ||
    /timeout/i.test(err?.message || "") ||
    status === 504 ||
    detail === "DELIVERY_UNCERTAIN"
  );
}
