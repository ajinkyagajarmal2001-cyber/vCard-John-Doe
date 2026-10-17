import type { MetadataRoute } from "next";
import { card } from "@/lib/card.server";

export default function sitemap(): MetadataRoute.Sitemap {
  return card.seo.siteUrl ? [{ url: card.seo.siteUrl, changeFrequency: "monthly", priority: 1 }] : [];
}
