// src/services/mailApi.js
//
// Provider-aware send/reply/aiReply/attachmentUrl-Layer.
// Existierende Modals (EmailComposeModal, EmailReplyModal) müssen lediglich
// statt direkt `api.post('/gmail/send', …)` aufzurufen, hier durchlaufen —
// dann funktionieren sie für Gmail, Outlook und IMAP.

import api from "./api";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

/**
 * Provider-aware POST /send.
 *   provider:  "gmail" | "outlook" | "imap"
 *   accountId: erforderlich für IMAP (User kann mehrere Postfächer haben).
 *   payload:   Standard-Send-Schema deiner App: {to, subject, body, cc?, bcc?,
 *              reply_to_id?, use_template?, template_id?}
 */
export async function sendEmail({ provider, accountId, payload }) {
  if (provider === "imap") {
    return api.post("/imap/send", { account_id: accountId, ...payload }, { timeout: 60000 });
  }
  if (provider === "outlook") {
    return api.post("/outlook/send", payload);
  }
  return api.post("/gmail/send", payload);
}

/** Form-Data Variante für Anhänge. files = UploadFile[] vom Input. */
export async function sendEmailWithAttachments({
  provider, accountId, payload, files,
}) {
  const form = new FormData();
  if (provider === "imap") form.append("account_id", accountId);
  form.append("to", payload.to ?? "");
  form.append("subject", payload.subject ?? "");
  form.append("body", payload.body ?? "");
  if (payload.cc)          form.append("cc", payload.cc);
  if (payload.bcc)         form.append("bcc", payload.bcc);
  if (payload.reply_to_id) form.append("reply_to_id", payload.reply_to_id);
  if (payload.use_template) form.append("use_template", "true");
  if (payload.template_id) form.append("template_id", payload.template_id);
  for (const f of files ?? []) form.append("files", f);

  const path = (
    provider === "imap"    ? "/imap/send-with-attachments" :
    provider === "outlook" ? "/outlook/send-with-attachments" :
                             "/gmail/send-with-attachments"
  );
  return api.post(path, form, { timeout: 60000 });
}

/** Reply mit FormData (Anhänge optional). */
export async function replyToEmail({ provider, emailId, body, cc, files,
                                    use_template, template_id }) {
  const form = new FormData();
  if (body !== undefined) form.append("body", body);
  if (cc)          form.append("cc", cc);
  if (use_template) form.append("use_template", "true");
  if (template_id) form.append("template_id", template_id);
  for (const f of files ?? []) form.append("files", f);

  const path = (
    provider === "imap"    ? `/imap/emails/${emailId}/reply` :
    provider === "outlook" ? `/outlook/emails/${emailId}/reply` :
                             `/gmail/emails/${emailId}/reply`
  );
  return api.post(path, form, { timeout: 60000 });
}

/** AI-Reply: derselbe Endpoint-Pfad-Stil wie der manuelle Reply. */
export async function aiReply({ provider, emailId }) {
  const path = (
    provider === "imap"    ? `/imap/emails/${emailId}/ai-reply` :
    provider === "outlook" ? `/outlook/emails/${emailId}/ai-reply` :
                             `/gmail/emails/${emailId}/ai-reply`
  );
  const r = await api.post(path);
  return r.data?.reply ?? "";
}

/** Mark as read */
export async function markRead({ provider, emailId }) {
  const path = (
    provider === "imap"    ? `/imap/emails/${emailId}/read` :
    provider === "outlook" ? `/outlook/emails/${emailId}/read` :
                             `/gmail/emails/${emailId}/read`
  );
  return api.patch(path);
}

/** Attachment-Download-URL für <a href=…> — provider-aware. */
export function attachmentUrl({ email, attachmentId }) {
  const provider = detectProvider(email) || email?.provider;
  const path = provider === "imap"    ? `/imap/attachments/${attachmentId}`
             : provider === "outlook" ? `/outlook/attachments/${attachmentId}`
             :                          `/gmail/attachments/${attachmentId}`;
  return `${API_BASE}${path}`;
}

/** Bestimme Provider eines geöffneten Email-Detail-Objekts. */
export function detectProvider(email) {
  if (!email) return null;
  if (email.imap_account_id) return "imap";
  if (email.outlook_account_id) return "outlook";
  if (email.gmail_account_id || email.external_id?.startsWith?.("ms_")) return "gmail";
  return null;
}
