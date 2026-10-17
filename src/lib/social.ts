import type { SocialPlatform } from "@/types";
import { cleanText, normalizeUrl } from "./validation";

interface PlatformConfig {
  label: string;
  /** Builds a profile URL from a bare handle such as "@johndoe". */
  fromHandle?: (handle: string) => string;
}

/** Display order and handle support for each supported platform. */
export const SOCIAL_PLATFORMS: Record<SocialPlatform, PlatformConfig> = {
  linkedin: { label: "LinkedIn" },
  instagram: { label: "Instagram", fromHandle: (h) => `https://www.instagram.com/${h}` },
  facebook: { label: "Facebook", fromHandle: (h) => `https://www.facebook.com/${h}` },
  youtube: { label: "YouTube", fromHandle: (h) => `https://www.youtube.com/@${h}` },
  twitter: { label: "X (Twitter)", fromHandle: (h) => `https://x.com/${h}` },
};

const HANDLE_PATTERN = /^@?([\w.]{1,60})$/;

/** Accepts a full URL, a URL without https://, or (where supported) an @handle. */
export function resolveSocialUrl(platform: SocialPlatform, value: unknown): string | undefined {
  const text = cleanText(value);
  if (!text) return undefined;

  const handle = text.match(HANDLE_PATTERN)?.[1];
  const { fromHandle } = SOCIAL_PLATFORMS[platform];
  if (handle && !handle.includes(".") && fromHandle) return fromHandle(handle);

  return normalizeUrl(text);
}
