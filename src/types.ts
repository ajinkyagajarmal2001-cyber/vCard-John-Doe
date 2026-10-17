/**
 * ============================================================================
 *  vCard data model
 * ============================================================================
 *  These types describe the shape of `src/data.ts`.
 *  You normally NEVER need to edit this file when creating a new client card.
 *
 *  Conventions used throughout:
 *  - Every field marked with `?` is OPTIONAL. Leave it out, set it to "",
 *    null or undefined, and the related UI is hidden automatically.
 *  - Every array may be empty (`[]`). An empty array hides its whole section.
 * ============================================================================
 */

/** A value that may be left blank. Blank values hide their UI. */
export type Optional<T> = T | null | undefined;

/** A list that may be left blank. Blank / empty lists hide their section. */
export type OptionalList<T> = T[] | null | undefined;

/* ----------------------------------------------------------------------------
 * Profile
 * ------------------------------------------------------------------------- */
export interface ProfileData {
  /** REQUIRED – full name shown in the header, page title and saved contact. */
  name: string;
  /** Job title, e.g. "Chartered Accountant". */
  designation?: Optional<string>;
  /** Company / practice / firm name. */
  company?: Optional<string>;
  /** One short line shown under the name. */
  tagline?: Optional<string>;
  /** Square photo inside /public, e.g. "/images/profile/profile.jpg". */
  profileImage?: Optional<string>;
  /** Wide banner image inside /public, e.g. "/images/cover/cover.jpg". */
  coverImage?: Optional<string>;
}

/* ----------------------------------------------------------------------------
 * Contact
 * ------------------------------------------------------------------------- */
export interface ContactData {
  /** Phone number in any readable format, e.g. "+91 90000 00000". */
  phone?: Optional<string>;
  /** WhatsApp number WITH country code, e.g. "+91 90000 00000". */
  whatsapp?: Optional<string>;
  /** Email address. */
  email?: Optional<string>;
  /** Website URL, e.g. "https://example.com" (https:// is added if missing). */
  website?: Optional<string>;
}

/* ----------------------------------------------------------------------------
 * About
 * ------------------------------------------------------------------------- */
export interface Highlight {
  /** Big figure, e.g. "12+". */
  value: string;
  /** Small caption, e.g. "Years of experience". */
  label: string;
}

export interface AboutData {
  /** Section heading. Defaults to "About". */
  title?: Optional<string>;
  /** Body text. Use a blank line ("\n\n") to start a new paragraph. */
  description?: Optional<string>;
  /** Up to 3 short stats shown under the text. */
  highlights?: OptionalList<Highlight>;
}

/* ----------------------------------------------------------------------------
 * Social
 * ------------------------------------------------------------------------- */
export interface SocialData {
  /** Full profile URL, or an @handle. */
  instagram?: Optional<string>;
  /** Full page URL, or a page username. */
  facebook?: Optional<string>;
  /** Full profile or company page URL. */
  linkedin?: Optional<string>;
  /** Full channel URL, or an @handle. */
  youtube?: Optional<string>;
  /** X / Twitter profile URL, or an @handle. */
  twitter?: Optional<string>;
}

export type SocialPlatform = keyof SocialData;

/* ----------------------------------------------------------------------------
 * Services, videos, gallery, links
 * ------------------------------------------------------------------------- */
export interface Service {
  /** REQUIRED – service name. Services without a title are skipped. */
  title: string;
  description?: Optional<string>;
  /** Image inside /public, e.g. "/images/services/consulting.jpg". */
  image?: Optional<string>;
  /**
   * Message pre-filled in WhatsApp when someone taps "Enquire".
   * Leave blank to use: "Hi <first name>, I am interested in <title>."
   */
  whatsappMessage?: Optional<string>;
}

export interface Video {
  /** REQUIRED – shown under the thumbnail. */
  title: string;
  /** REQUIRED – any YouTube link (watch, youtu.be, shorts or embed). */
  url: string;
}

export interface GalleryItem {
  /** REQUIRED – image inside /public, e.g. "/images/gallery/event.jpg". */
  image: string;
  /** Short description, also used as the image's alt text. */
  caption?: Optional<string>;
  /** Optional link shown when the image is opened. */
  url?: Optional<string>;
}

export interface AdditionalLink {
  /** REQUIRED – button text, e.g. "Download Brochure". */
  title: string;
  /** REQUIRED – where the button goes. */
  url: string;
  /** Small helper text under the title. */
  description?: Optional<string>;
}

/* ----------------------------------------------------------------------------
 * Location
 * ------------------------------------------------------------------------- */
export interface BusinessHours {
  /** e.g. "Mon – Fri" */
  days: string;
  /** e.g. "9:30 AM – 6:30 PM" or "Closed" */
  hours: string;
}

export interface LocationData {
  /** Full postal address. */
  address?: Optional<string>;
  /** "Open in maps" link (Google Maps, Apple Maps, etc.). */
  mapUrl?: Optional<string>;
  /** Embeddable map URL (the `src` of a map's <iframe> embed code). */
  mapEmbedUrl?: Optional<string>;
  /** Used in the saved contact & search metadata. */
  latitude?: Optional<number>;
  longitude?: Optional<number>;
  /** Opening hours shown below the address. */
  businessHours?: OptionalList<BusinessHours>;
}

/* ----------------------------------------------------------------------------
 * Contact exchange
 * ------------------------------------------------------------------------- */
export interface ContactExchangeData {
  /** Turn the "Share your contact" feature on or off. */
  enabled?: Optional<boolean>;
  title?: Optional<string>;
  description?: Optional<string>;
  /**
   * How visitor details are delivered to the card owner:
   * "whatsapp" (default) or "email". Falls back to whichever is available.
   */
  deliverVia?: Optional<"whatsapp" | "email">;
}

/* ----------------------------------------------------------------------------
 * Theme, SEO, footer
 * ------------------------------------------------------------------------- */
export interface ThemeData {
  /** Brand / accent colour as a hex value, e.g. "#1E3A5F". */
  primary?: Optional<string>;
  /** Page background colour (outside the card on larger screens). */
  background?: Optional<string>;
  /** Card / panel background colour. */
  surface?: Optional<string>;
  /** Main text colour. */
  text?: Optional<string>;
  /** Secondary text colour. */
  mutedText?: Optional<string>;
  /**
   * "modern"  – clean sans-serif headings (default)
   * "classic" – refined serif headings (lawyers, doctors, finance)
   */
  fontStyle?: Optional<"modern" | "classic">;
  /**
   * Colour mode for first-time visitors (they can switch with the Day/Night button):
   * "light" (default), "dark", or "system" to follow the phone's setting.
   * The night palette is generated automatically from `primary`.
   */
  defaultMode?: Optional<"light" | "dark" | "system">;
}

export interface SeoData {
  /**
   * The live address of this card, e.g. "https://johndoe.vercel.app".
   * Used for canonical URLs and social share previews.
   * Can also be set with the NEXT_PUBLIC_SITE_URL environment variable.
   */
  siteUrl?: Optional<string>;
  /** Overrides the default "<name> | <designation>" page title. */
  title?: Optional<string>;
  /** Overrides the default description (tagline / about text). */
  description?: Optional<string>;
  keywords?: OptionalList<string>;
}

export interface FooterData {
  /** Small "Designed by …" credit link. */
  credit?: Optional<{ label: string; url?: Optional<string> }>;
}

/* ----------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------- */
export interface VCardData {
  profile: ProfileData;
  contact?: Optional<ContactData>;
  about?: Optional<AboutData>;
  social?: Optional<SocialData>;
  services?: OptionalList<Service>;
  videos?: OptionalList<Video>;
  gallery?: OptionalList<GalleryItem>;
  location?: Optional<LocationData>;
  contactExchange?: Optional<ContactExchangeData>;
  additionalLinks?: OptionalList<AdditionalLink>;
  theme?: Optional<ThemeData>;
  seo?: Optional<SeoData>;
  footer?: Optional<FooterData>;
}
