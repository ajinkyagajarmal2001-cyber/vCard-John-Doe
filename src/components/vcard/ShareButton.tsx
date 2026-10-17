"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

/** Uses the native share sheet when available, otherwise copies the page link. */
export function ShareButton({ title, text }: { title: string; text?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if ((error as DOMException).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable – nothing else to do. */
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-surface/90 px-4 text-[13px] font-medium text-ink shadow-sm ring-1 ring-black/5 backdrop-blur transition-colors hover:bg-surface"
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
      <span>{copied ? "Link copied" : "Share"}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </button>
  );
}
