/**
 * Lightweight, dependency-free helpers for checking optional client data.
 * Every helper is defensive: it accepts anything and never throws.
 */

/** True when a value is "filled in": non-blank string, finite number, true, non-empty array/object. */
export function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.some(hasValue);
  if (typeof value === "object") return Object.values(value).some(hasValue);
  return false;
}

/** Returns a trimmed string, or undefined for blank / non-string values. */
export function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Returns the list without null/undefined items; a null/undefined list becomes []. */
export function cleanList<T>(list: readonly T[] | null | undefined): T[] {
  return Array.isArray(list) ? list.filter((item) => item !== null && item !== undefined) : [];
}

export function isValidUrl(value: unknown): boolean {
  const text = cleanText(value);
  if (!text) return false;
  try {
    const url = new URL(text);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

/**
 * Turns user-entered links like "example.com" into "https://example.com".
 * Returns undefined when the value can't become a valid web URL.
 */
export function normalizeUrl(value: unknown): string | undefined {
  const text = cleanText(value);
  if (!text) return undefined;
  const withProtocol = /^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text.replace(/^\/+/, "")}`;
  return isValidUrl(withProtocol) ? withProtocol : undefined;
}

/** Strips everything except digits (keeps no "+"). */
export function digitsOnly(value: unknown): string {
  return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

/** Accepts international formats with spaces, dashes, dots and brackets; 7–15 digits (E.164). */
export function isValidPhone(value: unknown): boolean {
  const text = cleanText(value);
  if (!text || !/^\+?[\d\s().-]+$/.test(text)) return false;
  const digits = digitsOnly(text);
  return digits.length >= 7 && digits.length <= 15;
}

export function isValidEmail(value: unknown): boolean {
  const text = cleanText(value);
  return !!text && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text);
}

/** True for site-relative paths (e.g. "/images/a.jpg") or valid http(s) URLs. */
export function isValidImageSrc(value: unknown): boolean {
  const text = cleanText(value);
  if (!text) return false;
  return (text.startsWith("/") && !text.startsWith("//")) || isValidUrl(text);
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
