/**
 * Contact exchange — lets a visitor send their details to the card owner.
 *
 * The default implementation is serverless: it builds a pre-filled WhatsApp
 * message or email that the visitor sends from their own device.
 *
 * To use a backend later (CRM, Google Sheet, email service…), replace the body
 * of `deliverContactExchange` with a `fetch()` to your endpoint. Nothing else
 * in the template needs to change.
 */
import type { ResolvedCard } from "./card";
import { buildWhatsAppUrl } from "./whatsapp";

export interface ContactExchangeForm {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  message?: string;
}

export type ContactExchangeTarget = NonNullable<ResolvedCard["contactExchange"]>;

export function buildExchangeMessage(form: ContactExchangeForm, ownerFirstName: string): string {
  const field = (label: string, value?: string) => (value?.trim() ? `${label}: ${value.trim()}` : undefined);
  const note = form.message?.trim();
  const lines = [
    `Hi ${ownerFirstName}, I'd like to connect. Here are my details:`,
    "",
    field("Name", form.name),
    field("Phone", form.phone),
    field("Email", form.email),
    field("Company", form.company),
    note && `\n${note}`,
  ];
  return lines.filter((line): line is string => typeof line === "string").join("\n");
}

/** Returns the URL that hands the visitor's details to the owner. */
export function deliverContactExchange(
  form: ContactExchangeForm,
  target: ContactExchangeTarget,
  ownerFirstName: string,
): string {
  const message = buildExchangeMessage(form, ownerFirstName);
  if (target.channel === "whatsapp") return buildWhatsAppUrl(target.target, message);
  const subject = `New contact: ${form.name.trim()}`;
  return `mailto:${target.target}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}
