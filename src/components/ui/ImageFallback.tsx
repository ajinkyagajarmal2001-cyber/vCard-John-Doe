import { ImageOff } from "lucide-react";
import { cx } from "@/lib/cx";

/** Neutral tile shown when an image can't be loaded. */
export function ImageFallback({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx("absolute inset-0 flex items-center justify-center bg-subtle text-line-strong", className)}>
      <ImageOff className="size-7" strokeWidth={1.5} />
    </div>
  );
}
