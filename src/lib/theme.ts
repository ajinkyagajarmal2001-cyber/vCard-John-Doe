import type { ThemeData } from "@/types";
import { cleanText } from "./validation";

/** Used whenever a theme value is missing or not a valid hex colour. */
export const DEFAULT_THEME = {
  primary: "#1E3A5F",
  background: "#F4F4F1",
  surface: "#FFFFFF",
  text: "#16191F",
  mutedText: "#5F6672",
  fontStyle: "modern",
} as const;

export interface ResolvedTheme {
  primary: string;
  /** Primary adjusted (if needed) to stay readable as text on the surface. */
  primaryInk: string;
  /** Text colour that is readable on top of a primary-filled button. */
  onPrimary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  fontStyle: "modern" | "classic";
}

type Rgb = [number, number, number];

function parseHex(value: unknown): Rgb | undefined {
  const text = cleanText(value)?.replace(/^#/, "");
  if (!text || !/^([\da-f]{3}|[\da-f]{6})$/i.test(text)) return undefined;
  const full = text.length === 3 ? [...text].map((c) => c + c).join("") : text;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

const toHex = (rgb: Rgb) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

function luminance([r, g, b]: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Darkens `color` towards black until it reaches `ratio` contrast against `against`. */
function ensureContrast(color: Rgb, against: Rgb, ratio: number): Rgb {
  let current = color;
  for (let step = 0; step < 20 && contrast(current, against) < ratio; step++) {
    current = current.map((c) => c * 0.9) as Rgb;
  }
  return current;
}

const pick = (value: unknown, fallback: string) => (parseHex(value) ? toHex(parseHex(value)!) : fallback);

export function resolveTheme(theme: ThemeData | null | undefined): ResolvedTheme {
  const primary = pick(theme?.primary, DEFAULT_THEME.primary);
  const surface = pick(theme?.surface, DEFAULT_THEME.surface);
  const primaryRgb = parseHex(primary)!;
  const surfaceRgb = parseHex(surface)!;
  const white: Rgb = [255, 255, 255];
  const ink: Rgb = [17, 24, 39];

  return {
    primary,
    primaryInk: toHex(ensureContrast(primaryRgb, surfaceRgb, 4.5)),
    onPrimary: contrast(primaryRgb, white) >= contrast(primaryRgb, ink) ? "#FFFFFF" : toHex(ink),
    background: pick(theme?.background, DEFAULT_THEME.background),
    surface,
    text: pick(theme?.text, DEFAULT_THEME.text),
    mutedText: pick(theme?.mutedText, DEFAULT_THEME.mutedText),
    fontStyle: theme?.fontStyle === "classic" ? "classic" : "modern",
  };
}

/** CSS custom properties consumed by globals.css / Tailwind tokens. */
export function themeToCssVars(theme: ResolvedTheme): Record<string, string> {
  return {
    "--brand": theme.primary,
    "--brand-ink": theme.primaryInk,
    "--on-brand": theme.onPrimary,
    "--canvas": theme.background,
    "--surface": theme.surface,
    "--ink": theme.text,
    "--muted": theme.mutedText,
  };
}
