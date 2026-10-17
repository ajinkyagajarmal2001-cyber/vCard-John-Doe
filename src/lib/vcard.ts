/**
 * Client-side vCard (.vcf) generation. Version 3.0 is used because it is the
 * most widely supported format across iOS, Android, Outlook and Google Contacts.
 * Every field is optional except the name; missing values are simply omitted.
 */
import type { ResolvedCard } from "./card";

export type VCardSource = Pick<ResolvedCard, "profile" | "contact" | "social" | "location">;

/** Escapes text values per RFC 6350 §3.4. */
const escape = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** Folds long lines to 75 characters (continuation lines start with a space). */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) chunks.push(" " + line.slice(i, i + 74));
  return chunks.join("\r\n");
}

function splitName(fullName: string): { given: string; family: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { given: parts[0], family: "" };
  return { given: parts.slice(0, -1).join(" "), family: parts[parts.length - 1] };
}

export interface VCardPhoto {
  base64: string;
  type: "JPEG" | "PNG";
}

export function buildVCard(card: VCardSource, photo?: VCardPhoto): string {
  const { profile, contact, social, location } = card;
  const { given, family } = splitName(profile.name);
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  const add = (line: string | false | undefined) => line && lines.push(line);

  add(`N:${escape(family)};${escape(given)};;;`);
  add(`FN:${escape(profile.name)}`);
  add(profile.company && `ORG:${escape(profile.company)}`);
  add(profile.designation && `TITLE:${escape(profile.designation)}`);
  add(contact.phone && `TEL;TYPE=CELL,VOICE:${contact.phone.href.replace(/^tel:/, "")}`);
  if (contact.whatsapp && contact.phone?.href.replace(/\D/g, "") !== contact.whatsapp.number) {
    add(`TEL;TYPE=CELL:+${contact.whatsapp.number}`);
  }
  add(contact.email && `EMAIL;TYPE=INTERNET,WORK:${contact.email.address}`);
  add(contact.website && `URL;TYPE=WORK:${contact.website.url}`);
  add(location?.address && `ADR;TYPE=WORK:;;${escape(location.address)};;;;`);
  add(
    location?.latitude !== undefined &&
      location?.longitude !== undefined &&
      `GEO:${location.latitude};${location.longitude}`,
  );
  for (const s of social) add(`X-SOCIALPROFILE;TYPE=${s.platform}:${s.url}`);
  add(profile.tagline && `NOTE:${escape(profile.tagline)}`);
  add(photo && `PHOTO;ENCODING=b;TYPE=${photo.type}:${photo.base64}`);
  lines.push("END:VCARD");

  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Fetches the (resized) profile photo so it can be embedded in the contact. */
async function loadPhoto(src: string | undefined): Promise<VCardPhoto | undefined> {
  if (!src) return undefined;
  try {
    // Ask the Next.js image optimizer for a small JPEG/PNG; fall back to the original.
    const optimized = src.startsWith("/") ? `/_next/image?url=${encodeURIComponent(src)}&w=256&q=75` : src;
    const response = await fetch(optimized, { headers: { Accept: "image/jpeg,image/png" } });
    if (!response.ok) return undefined;
    const blob = await response.blob();
    const type = blob.type === "image/png" ? "PNG" : blob.type === "image/jpeg" ? "JPEG" : undefined;
    if (!type || blob.size > 300_000) return undefined;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return { base64: btoa(binary), type };
  } catch {
    return undefined;
  }
}

export function vCardFileName(name: string): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  return `${slug || "contact"}.vcf`;
}

/** Builds the .vcf (with photo when available) and triggers a download. */
export async function downloadVCard(card: VCardSource): Promise<void> {
  const photo = await loadPhoto(card.profile.profileImage);
  const blob = new Blob([buildVCard(card, photo)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = vCardFileName(card.profile.name);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
