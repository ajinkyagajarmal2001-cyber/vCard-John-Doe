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
  defaultMode: "light",
} as const;

/** Neutral night palette; the brand colour is adapted to it automatically. */
const NIGHT = {
  background: "#0A0C10",
  surface: "#13161C",
  text: "#ECEEF2",
  mutedText: "#9BA3AF",
} as const;

export type ColorMode = "light" | "dark";

/** One complete set of colours (day or night). */
export interface Palette {
  brand: string;
  /** Brand colour adjusted (if needed) to stay readable as text on the surface. */
  brandInk: string;
  /** Text colour that is readable on top of a brand-filled button. */
  onBrand: string;
  canvas: string;
  surface: string;
  ink: string;
  muted: string;
}

export interface ResolvedTheme {
  primary: string;
  primaryInk: string;
  onPrimary: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  fontStyle: "modern" | "classic";
  /** Mode shown to first-time visitors ("system" follows the phone's setting). */
  defaultMode: ColorMode | "system";
  dark: Palette;
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

/**
 * Moves `color` away from `against` (darker on light backgrounds, lighter on
 * dark ones) until it reaches `ratio` contrast.
 */
function ensureContrast(color: Rgb, against: Rgb, ratio: number): Rgb {
  const lighten = luminance(against) < 0.2;
  let current = color;
  for (let step = 0; step < 24 && contrast(current, against) < ratio; step++) {
    current = current.map((c) => (lighten ? c + (255 - c) * 0.12 : c * 0.9)) as Rgb;
  }
  return current;
}

/** White or near-black, whichever reads better on `fill`. */
function readableOn(fill: Rgb): string {
  const white: Rgb = [255, 255, 255];
  const ink: Rgb = [17, 24, 39];
  return contrast(fill, white) >= contrast(fill, ink) ? "#FFFFFF" : toHex(ink);
}

const pick = (value: unknown, fallback: string) => (parseHex(value) ? toHex(parseHex(value)!) : fallback);

export function resolveTheme(theme: ThemeData | null | undefined): ResolvedTheme {
  const primary = pick(theme?.primary, DEFAULT_THEME.primary);
  const surface = pick(theme?.surface, DEFAULT_THEME.surface);
  const primaryRgb = parseHex(primary)!;
  const nightSurface = parseHex(NIGHT.surface)!;
  // Keep brand-filled buttons distinguishable from the dark surface.
  const nightBrand = ensureContrast(primaryRgb, nightSurface, 2);
  const mode = theme?.defaultMode;

  return {
    primary,
    primaryInk: toHex(ensureContrast(primaryRgb, parseHex(surface)!, 4.5)),
    onPrimary: readableOn(primaryRgb),
    background: pick(theme?.background, DEFAULT_THEME.background),
    surface,
    text: pick(theme?.text, DEFAULT_THEME.text),
    mutedText: pick(theme?.mutedText, DEFAULT_THEME.mutedText),
    fontStyle: theme?.fontStyle === "classic" ? "classic" : "modern",
    defaultMode: mode === "dark" || mode === "system" ? mode : DEFAULT_THEME.defaultMode,
    dark: {
      brand: toHex(nightBrand),
      brandInk: toHex(ensureContrast(primaryRgb, nightSurface, 4.5)),
      onBrand: readableOn(nightBrand),
      canvas: NIGHT.background,
      surface: NIGHT.surface,
      ink: NIGHT.text,
      muted: NIGHT.mutedText,
    },
  };
}

export function dayPalette(theme: ResolvedTheme): Palette {
  return {
    brand: theme.primary,
    brandInk: theme.primaryInk,
    onBrand: theme.onPrimary,
    canvas: theme.background,
    surface: theme.surface,
    ink: theme.text,
    muted: theme.mutedText,
  };
}

const paletteVars = (p: Palette) =>
  `--brand:${p.brand};--brand-ink:${p.brandInk};--on-brand:${p.onBrand};--canvas:${p.canvas};--surface:${p.surface};--ink:${p.ink};--muted:${p.muted};`;

/** Stylesheet with the day palette on :root and the night palette under [data-mode="dark"]. */
export function themeToCss(theme: ResolvedTheme): string {
  return (
    // `html:root` outranks the fallback `:root` tokens in globals.css regardless of load order.
    `html:root{${paletteVars(dayPalette(theme))}color-scheme:light}` +
    `html:root[data-mode="dark"]{${paletteVars(theme.dark)}color-scheme:dark}`
  );
}

/** localStorage key that remembers a visitor's Day/Night choice. */
export const MODE_STORAGE_KEY = "vcard-color-mode";

/**
 * Inline script that applies the saved (or default) mode before the first
 * paint, so visitors never see a flash of the wrong colours.
 */
export function modeBootScript(theme: ResolvedTheme): string {
  const config = JSON.stringify({
    key: MODE_STORAGE_KEY,
    fallback: theme.defaultMode,
    colors: { light: theme.surface, dark: theme.dark.surface },
  });
  return `(function(c){var m;try{m=localStorage.getItem(c.key)}catch(e){}if(m!=="light"&&m!=="dark"){m=c.fallback==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):c.fallback}var d=document.documentElement;d.setAttribute("data-mode",m);var t=document.querySelector('meta[name="theme-color"]');if(t)t.setAttribute("content",c.colors[m])})(${config})`;
}
