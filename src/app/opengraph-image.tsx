import { ImageResponse } from "next/og";
import { card, readLocalImageAsDataUrl } from "@/lib/card.server";

// Social share preview (WhatsApp, LinkedIn, X, iMessage…) generated from data.ts.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = card.seo.title;

export default function OpenGraphImage() {
  const { profile, theme, contact } = card;
  const photo = readLocalImageAsDataUrl(profile.profileImage);
  const footer = contact.website?.display ?? contact.email?.address;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: theme.surface, color: theme.text }}>
        <div style={{ width: 24, height: "100%", background: theme.primary }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 88px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
            <div
              style={{
                width: 240,
                height: 240,
                borderRadius: 999,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: theme.primary,
                color: theme.onPrimary,
                fontSize: 96,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {photo ? (
                <img src={photo} alt="" width={240} height={240} style={{ objectFit: "cover" }} />
              ) : (
                profile.initials
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{profile.name}</div>
              {profile.designation && (
                <div style={{ fontSize: 34, marginTop: 16, color: theme.primaryInk }}>{profile.designation}</div>
              )}
              {profile.company && <div style={{ fontSize: 30, marginTop: 8, color: theme.mutedText }}>{profile.company}</div>}
            </div>
          </div>
          {profile.tagline && (
            <div style={{ fontSize: 30, marginTop: 56, color: theme.mutedText, lineHeight: 1.35, maxWidth: 940 }}>
              {profile.tagline}
            </div>
          )}
          {footer && <div style={{ fontSize: 24, marginTop: 40, color: theme.primaryInk, fontWeight: 600 }}>{footer}</div>}
        </div>
      </div>
    ),
    size,
  );
}
