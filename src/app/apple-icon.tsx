import { ImageResponse } from "next/og";
import { Monogram } from "@/components/og/Monogram";
import { card } from "@/lib/card.server";

// Home-screen icon (iOS adds its own rounded corners).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<Monogram initials={card.profile.initials} theme={card.theme} size={180} radius={0} />, size);
}
