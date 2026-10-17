import type { Metadata, Viewport } from "next";
import type { ResolvedCard } from "./card";

export function buildMetadata(card: ResolvedCard): Metadata {
  const { profile, seo } = card;
  const siteName = profile.company ?? profile.name;
  const [firstName, ...rest] = profile.name.split(/\s+/);

  return {
    metadataBase: seo.siteUrl ? new URL(seo.siteUrl) : undefined,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    authors: [{ name: profile.name, url: card.contact.website?.url }],
    creator: profile.name,
    alternates: seo.siteUrl ? { canonical: "/" } : undefined,
    robots: { index: true, follow: true },
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      type: "profile",
      title: seo.title,
      description: seo.description,
      siteName,
      url: seo.siteUrl ? "/" : undefined,
      firstName,
      lastName: rest.join(" ") || undefined,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export function buildViewport(card: ResolvedCard): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: card.theme.surface,
  };
}

/** schema.org Person structured data for search engines. */
export function buildJsonLd(card: ResolvedCard): Record<string, unknown> {
  const { profile, contact, location, social, seo } = card;
  const absolute = (src?: string) => (src && seo.siteUrl ? new URL(src, seo.siteUrl).toString() : undefined);
  const sameAs = [...social.map((s) => s.url), ...(contact.website ? [contact.website.url] : [])];

  const entries: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.designation,
    description: seo.description,
    url: seo.siteUrl ?? contact.website?.url,
    image: absolute(profile.profileImage),
    telephone: contact.phone?.display,
    email: contact.email?.address,
    worksFor: profile.company ? { "@type": "Organization", name: profile.company } : undefined,
    address: location?.address ? { "@type": "PostalAddress", streetAddress: location.address } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };

  return Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== undefined));
}
