"use client";

import { Check, LoaderCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { cx } from "@/lib/cx";
import { downloadVCard, type VCardSource } from "@/lib/vcard";

interface SaveContactButtonProps {
  source: VCardSource;
  className?: string;
  label?: string;
}

/** Generates a .vcf from the card data in the browser and downloads it. */
export function SaveContactButton({ source, className, label = "Save Contact" }: SaveContactButtonProps) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  async function handleClick() {
    if (state === "busy") return;
    setState("busy");
    try {
      await downloadVCard(source);
      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("idle");
    }
  }

  const Icon = state === "busy" ? LoaderCircle : state === "done" ? Check : UserPlus;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-busy={state === "busy"}
      className={cx(
        "inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-brand px-5 text-[15px] font-semibold text-on-brand",
        "transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.985]",
        className,
      )}
    >
      <Icon className={cx("size-[18px]", state === "busy" && "animate-spin")} aria-hidden />
      <span>{state === "done" ? "Contact downloaded" : label}</span>
      <span className="sr-only" aria-live="polite">
        {state === "done" ? "Contact card downloaded. Open it to add to your contacts." : ""}
      </span>
    </button>
  );
}
