import type { MetadataRoute } from "next";
import { card } from "@/lib/card.server";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: card.seo.siteUrl ? new URL("/sitemap.xml", card.seo.siteUrl).toString() : undefined,
  };
}
