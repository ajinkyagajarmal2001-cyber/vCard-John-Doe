import { ImageResponse } from "next/og";
import { Monogram } from "@/components/og/Monogram";
import { card } from "@/lib/card.server";

// Favicon generated from the client's initials and brand colour.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<Monogram initials={card.profile.initials} theme={card.theme} size={64} radius={14} />, size);
}
