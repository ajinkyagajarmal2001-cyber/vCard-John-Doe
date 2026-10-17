"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (it is still announced to screen readers). */
  hideTitle?: boolean;
  /** "sheet" – light panel (bottom sheet on mobile). "media" – dark, wide viewer. */
  variant?: "sheet" | "media";
  children: ReactNode;
}

/**
 * Accessible modal built on the native <dialog> element:
 * focus is trapped, Escape closes it, focus returns to the trigger,
 * and content is only mounted while open (so embeds never preload).
 */
export function Dialog({ open, onClose, title, hideTitle, variant = "sheet", children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  const media = variant === "media";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      className={cx(
        "max-h-[100dvh] p-0 text-ink",
        media
          ? "m-auto w-[min(100vw-1.5rem,60rem)] max-w-none overflow-visible bg-transparent"
          : "mx-0 mt-auto mb-0 w-full max-w-none rounded-t-3xl bg-surface shadow-float sm:m-auto sm:w-[min(100vw-2rem,30rem)] sm:rounded-3xl",
      )}
    >
      {open && (
        <div className={cx("relative", !media && "max-h-[90dvh] overflow-y-auto px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7 sm:pt-7")}>
          <div className={cx("flex items-start justify-between gap-4", media ? "mb-3" : "mb-5")}>
            <h2
              id={titleId}
              className={cx(
                hideTitle && "sr-only",
                media ? "line-clamp-1 pt-2 text-sm font-medium text-white/90" : "font-display text-xl font-semibold tracking-tight",
              )}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={cx(
                "ml-auto inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
                media ? "bg-white/10 text-white hover:bg-white/20" : "bg-subtle text-ink-soft hover:bg-line",
              )}
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
