/**
 * Turns the raw, human-edited `data.ts` into a clean, render-ready model.
 *
 * This is the single place where optional data is validated. Anything blank,
 * malformed or missing is dropped here, so components can follow one simple
 * rule: "if the value exists, render it; otherwise render nothing".
 */
import type { SocialPlatform, VCardData } from "@/types";
import { resolveSocialUrl, SOCIAL_PLATFORMS } from "./social";
import { resolveTheme, type ResolvedTheme } from "./theme";
import { cleanList, cleanText, digitsOnly, isFiniteNumber, isValidEmail, isValidImageSrc, isValidPhone, normalizeUrl } from "./validation";
import { buildWhatsAppUrl, serviceEnquiryMessage, toWhatsAppNumber } from "./whatsapp";
import { getYouTubeId, youTubeThumbnail, youTubeWatchUrl } from "./youtube";

export interface ResolvedCard {
  profile: {
    name: string;
    firstName: string;
    initials: string;
    designation?: string;
    company?: string;
    tagline?: string;
    profileImage?: string;
    coverImage?: string;
  };
  contact: {
    phone?: { display: string; href: string };
    whatsapp?: { number: string; href: string };
    email?: { address: string; href: string };
    website?: { url: string; display: string };
  };
  about?: { title: string; paragraphs: string[]; highlights: { value: string; label: string }[] };
  social: { platform: SocialPlatform; label: string; url: string }[];
  services: { title: string; description?: string; image?: string; enquiryUrl?: string }[];
  videos: { id: string; title: string; url: string; thumbnail: string }[];
  gallery: { image: string; caption?: string; url?: string }[];
  location?: {
    address?: string;
    mapUrl?: string;
    /** Button text, e.g. "Open in Google Maps" – only set when mapUrl is. */
    mapLabel?: string;
    mapEmbedUrl?: string;
    latitude?: number;
    longitude?: number;
    hours: { days: string; hours: string }[];
  };
  contactExchange?: {
    title: string;
    description?: string;
    channel: "whatsapp" | "email";
    /** WhatsApp number (digits) or email address the details are sent to. */
    target: string;
  };
  links: { title: string; url: string; description?: string; host: string }[];
  theme: ResolvedTheme;
  seo: { siteUrl?: string; title: string; description?: string; keywords: string[] };
  footer: { credit?: { label: string; url?: string } };
}

export interface ResolveOptions {
  /** Lets the server drop references to images that don't exist in /public. */
  imageExists?: (src: string) => boolean;
}

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter((p) => /^[\p{L}\p{N}]/u.test(p) && !/\.$/.test(p));
  const letters = (parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts).map((p) => p[0]);
  return letters.join("").toUpperCase() || name.slice(0, 1).toUpperCase();
}

/** First name, skipping honorifics such as "Dr." or "Adv.". */
function getFirstName(name: string): string {
  const parts = name.split(/\s+/);
  return parts.find((p) => !/\.$/.test(p)) ?? parts[0];
}

function mapLabel(url: string): string {
  const host = hostOf(url);
  if (/(^|\.)google\.|goo\.gl$|maps\.app\.goo\.gl/.test(host)) return "Open in Google Maps";
  if (/(^|\.)apple\.com$/.test(host)) return "Open in Apple Maps";
  return "Open in Maps";
}

export function resolveCard(data: VCardData, options: ResolveOptions = {}): ResolvedCard {
  const image = (src: unknown) => {
    const value = cleanText(src);
    if (!value || !isValidImageSrc(value)) return undefined;
    if (value.startsWith("/") && options.imageExists && !options.imageExists(value)) return undefined;
    return value;
  };

  /* Profile ---------------------------------------------------------------- */
  // `name` is required; fall back to the company so the card never shows a blank header.
  const name = cleanText(data.profile?.name) ?? cleanText(data.profile?.company) ?? "Contact";
  const profile: ResolvedCard["profile"] = {
    name,
    firstName: getFirstName(name),
    initials: getInitials(name),
    designation: cleanText(data.profile?.designation),
    company: cleanText(data.profile?.company),
    tagline: cleanText(data.profile?.tagline),
    profileImage: image(data.profile?.profileImage),
    coverImage: image(data.profile?.coverImage),
  };

  /* Contact ---------------------------------------------------------------- */
  const raw = data.contact ?? {};
  const phone = cleanText(raw.phone);
  const whatsappNumber = toWhatsAppNumber(raw.whatsapp);
  const email = cleanText(raw.email);
  const website = normalizeUrl(raw.website);
  const contact: ResolvedCard["contact"] = {
    phone:
      phone && isValidPhone(phone)
        ? { display: phone, href: `tel:${phone.trim().startsWith("+") ? "+" : ""}${digitsOnly(phone)}` }
        : undefined,
    whatsapp: whatsappNumber ? { number: whatsappNumber, href: buildWhatsAppUrl(whatsappNumber) } : undefined,
    email: email && isValidEmail(email) ? { address: email, href: `mailto:${email}` } : undefined,
    website: website
      ? { url: website, display: website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") }
      : undefined,
  };

  /* About ------------------------------------------------------------------ */
  const paragraphs = (cleanText(data.about?.description) ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const about = paragraphs.length
    ? {
        title: cleanText(data.about?.title) ?? "About",
        paragraphs,
        highlights: cleanList(data.about?.highlights)
          .map((h) => ({ value: cleanText(h.value), label: cleanText(h.label) }))
          .filter((h): h is { value: string; label: string } => !!h.value && !!h.label)
          .slice(0, 3),
      }
    : undefined;

  /* Social ----------------------------------------------------------------- */
  const social = (Object.keys(SOCIAL_PLATFORMS) as SocialPlatform[]).flatMap((platform) => {
    const url = resolveSocialUrl(platform, data.social?.[platform]);
    return url ? [{ platform, label: SOCIAL_PLATFORMS[platform].label, url }] : [];
  });

  /* Services --------------------------------------------------------------- */
  const services = cleanList(data.services).flatMap((s) => {
    const title = cleanText(s.title);
    if (!title) return [];
    const message = cleanText(s.whatsappMessage) ?? serviceEnquiryMessage(profile.firstName, title);
    return [
      {
        title,
        description: cleanText(s.description),
        image: image(s.image),
        enquiryUrl: whatsappNumber ? buildWhatsAppUrl(whatsappNumber, message) : undefined,
      },
    ];
  });

  /* Videos ----------------------------------------------------------------- */
  const videos = cleanList(data.videos).flatMap((v) => {
    const id = getYouTubeId(v.url);
    const title = cleanText(v.title);
    return id && title ? [{ id, title, url: youTubeWatchUrl(id), thumbnail: youTubeThumbnail(id) }] : [];
  });

  /* Gallery ---------------------------------------------------------------- */
  const gallery = cleanList(data.gallery).flatMap((g) => {
    const src = image(g.image);
    return src ? [{ image: src, caption: cleanText(g.caption), url: normalizeUrl(g.url) }] : [];
  });

  /* Location --------------------------------------------------------------- */
  const loc = data.location ?? {};
  const address = cleanText(loc.address);
  const mapUrl = normalizeUrl(loc.mapUrl);
  const mapEmbedUrl = normalizeUrl(loc.mapEmbedUrl);
  const hours = cleanList(loc.businessHours)
    .map((h) => ({ days: cleanText(h.days), hours: cleanText(h.hours) }))
    .filter((h): h is { days: string; hours: string } => !!h.days && !!h.hours);
  const location =
    address || mapUrl || mapEmbedUrl || hours.length
      ? {
          address,
          mapUrl,
          mapLabel: mapUrl ? mapLabel(mapUrl) : undefined,
          mapEmbedUrl,
          latitude: isFiniteNumber(loc.latitude) ? loc.latitude : undefined,
          longitude: isFiniteNumber(loc.longitude) ? loc.longitude : undefined,
          hours,
        }
      : undefined;

  /* Contact exchange ------------------------------------------------------- */
  const ex = data.contactExchange;
  const channels = { whatsapp: contact.whatsapp?.number, email: contact.email?.address };
  type Channel = keyof typeof channels;
  const preferred: Channel = ex?.deliverVia === "email" ? "email" : "whatsapp";
  const fallback: Channel = preferred === "email" ? "whatsapp" : "email";
  const channel = channels[preferred] ? preferred : channels[fallback] ? fallback : undefined;
  const contactExchange =
    ex?.enabled && channel
      ? {
          title: cleanText(ex.title) ?? "Share your contact",
          description: cleanText(ex.description),
          channel,
          target: channels[channel]!,
        }
      : undefined;

  /* Additional links ------------------------------------------------------- */
  const links = cleanList(data.additionalLinks).flatMap((l) => {
    const title = cleanText(l.title);
    const url = normalizeUrl(l.url);
    return title && url ? [{ title, url, description: cleanText(l.description), host: hostOf(url) }] : [];
  });

  /* SEO & footer ----------------------------------------------------------- */
  const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? normalizeUrl(data.seo?.siteUrl);
  const seo = {
    siteUrl,
    title: cleanText(data.seo?.title) ?? [name, profile.designation].filter(Boolean).join(" | "),
    description:
      cleanText(data.seo?.description) ??
      profile.tagline ??
      paragraphs[0] ??
      ([profile.designation, profile.company].filter(Boolean).join(" at ") || undefined),
    keywords: cleanList(data.seo?.keywords).map(cleanText).filter((k): k is string => !!k),
  };

  const creditLabel = cleanText(data.footer?.credit?.label);
  const footer = {
    credit: creditLabel ? { label: creditLabel, url: normalizeUrl(data.footer?.credit?.url) } : undefined,
  };

  return {
    profile,
    contact,
    about,
    social,
    services,
    videos,
    gallery,
    location,
    contactExchange,
    links,
    theme: resolveTheme(data.theme),
    seo,
    footer,
  };
}
