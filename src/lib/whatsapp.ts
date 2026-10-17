import { digitsOnly, isValidPhone } from "./validation";

/** Digits-only WhatsApp number (wa.me format), or undefined when invalid. */
export function toWhatsAppNumber(value: unknown): string | undefined {
  return isValidPhone(value) ? digitsOnly(value) : undefined;
}

/** https://wa.me/<number>?text=<encoded message> */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const base = `https://wa.me/${digitsOnly(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Default enquiry text for a service, e.g. "Hi Priya, I am interested in Tax Planning." */
export function serviceEnquiryMessage(firstName: string, serviceTitle: string): string {
  return `Hi ${firstName}, I am interested in ${serviceTitle}.`;
}
