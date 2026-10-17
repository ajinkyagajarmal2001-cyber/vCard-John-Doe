import { cleanText } from "./validation";

const ID_PATTERN = /^[\w-]{11}$/;

/**
 * Extracts the 11-character video id from any common YouTube link:
 * watch?v=, youtu.be/, /shorts/, /embed/, /live/ and youtube-nocookie.com.
 */
export function getYouTubeId(value: unknown): string | undefined {
  const text = cleanText(value);
  if (!text) return undefined;
  if (ID_PATTERN.test(text)) return text;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return undefined;
  }

  const host = url.hostname.replace(/^(www|m|music)\./, "");
  let id: string | null | undefined;

  if (host === "youtu.be") {
    id = url.pathname.split("/")[1];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const [, first, second] = url.pathname.split("/");
    id = first === "watch" ? url.searchParams.get("v") : ["embed", "shorts", "live", "v"].includes(first) ? second : null;
  }

  return id && ID_PATTERN.test(id) ? id : undefined;
}

export const youTubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const youTubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youTubeEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
