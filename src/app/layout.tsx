import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { card } from "@/lib/card.server";
import { buildMetadata, buildViewport } from "@/lib/seo";
import { modeBootScript, themeToCss } from "@/lib/theme";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
});

// Only downloaded by the browser when theme.fontStyle is "classic".
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif-face",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = buildMetadata(card);
export const viewport: Viewport = buildViewport(card);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-font={card.theme.fontStyle}
      data-mode={card.theme.defaultMode === "dark" ? "dark" : "light"}
      className={`${sans.variable} ${serif.variable}`}
      // The boot script below may switch data-mode before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeToCss(card.theme) }} />
        <script dangerouslySetInnerHTML={{ __html: modeBootScript(card.theme) }} />
      </head>
      <body className="min-h-dvh">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
