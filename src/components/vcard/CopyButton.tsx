"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Small icon button that copies a value (phone, email, address) to the clipboard. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard unavailable. */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink"
    >
      {copied ? <Check className="size-4 text-brand-ink" aria-hidden /> : <Copy className="size-4" aria-hidden />}
    </button>
  );
}
