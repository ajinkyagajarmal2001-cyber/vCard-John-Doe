import fs from "node:fs";
import path from "node:path";
import { vCardData } from "@/data";
import { resolveCard } from "./card";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** True when a site-relative image path (e.g. "/images/a.jpg") exists in /public. */
export function localImageExists(src: string): boolean {
  const file = path.normalize(path.join(PUBLIC_DIR, decodeURI(src.split(/[?#]/)[0])));
  return file.startsWith(PUBLIC_DIR) && fs.existsSync(file) && fs.statSync(file).isFile();
}

/** Reads a /public image as a data URL (for generated social/icon images). */
export function readLocalImageAsDataUrl(src: string | undefined): string | undefined {
  if (!src || !src.startsWith("/") || !localImageExists(src)) return undefined;
  const ext = path.extname(src).toLowerCase();
  const mime = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" }[ext];
  if (!mime) return undefined;
  const data = fs.readFileSync(path.join(PUBLIC_DIR, decodeURI(src)));
  return `data:${mime};base64,${data.toString("base64")}`;
}

/**
 * The resolved card for this deployment. Server-only: images referenced in
 * data.ts that are missing from /public are dropped at build time, so a typo
 * in a file name never produces a broken image.
 */
export const card = resolveCard(vCardData, { imageExists: localImageExists });
