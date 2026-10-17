"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ResolvedCard } from "@/lib/card";
import { Dialog } from "@/components/ui/Dialog";
import { ImageFallback } from "@/components/ui/ImageFallback";
import { SafeImage } from "@/components/ui/SafeImage";

type GalleryItems = ResolvedCard["gallery"];

function Lightbox({ items, index, onClose, onNavigate }: {
  items: GalleryItems;
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const item = index === null ? undefined : items[index];
  const many = items.length > 1;

  const go = useCallback(
    (step: number) => index !== null && onNavigate((index + step + items.length) % items.length),
    [index, items.length, onNavigate],
  );

  useEffect(() => {
    if (index === null || !many) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, many, go]);

  const navButton = "inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";

  return (
    <Dialog open={!!item} onClose={onClose} title={item?.caption ?? `Image ${(index ?? 0) + 1}`} variant="media">
      {item && (
        <figure>
          <div className="relative aspect-[4/3] max-h-[72dvh] w-full overflow-hidden rounded-2xl bg-black/40">
            <SafeImage
              key={item.image}
              src={item.image}
              alt={item.caption ?? ""}
              fill
              sizes="(min-width: 960px) 960px, 100vw"
              className="object-contain"
              fallback={<ImageFallback className="bg-white/5 text-white/30" />}
            />
          </div>
          <figcaption className="mt-4 flex items-center gap-3 text-white">
            {many && (
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={navButton}>
                <ChevronLeft className="size-5" aria-hidden />
              </button>
            )}
            <div className="min-w-0 flex-1 text-center">
              {many && (
                <p className="text-xs tracking-wide text-white/60 tabular-nums" aria-live="polite">
                  {(index ?? 0) + 1} / {items.length}
                </p>
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-white underline-offset-4 hover:underline"
                >
                  View more <ArrowUpRight className="size-4" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
            {many && (
              <button type="button" onClick={() => go(1)} aria-label="Next image" className={navButton}>
                <ChevronRight className="size-5" aria-hidden />
              </button>
            )}
          </figcaption>
        </figure>
      )}
    </Dialog>
  );
}

/** Responsive image grid; tapping an image opens it full-size. */
export function Gallery({ items }: { items: GalleryItems }) {
  const [active, setActive] = useState<number | null>(null);
  if (items.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.image + index}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Open image${item.caption ? `: ${item.caption}` : ` ${index + 1}`}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-subtle"
            >
              <SafeImage
                src={item.image}
                alt={item.caption ?? ""}
                fill
                sizes="(min-width: 768px) 210px, (min-width: 640px) 180px, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                fallback={<ImageFallback />}
              />
              <span aria-hidden className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              <Expand aria-hidden className="absolute right-2 bottom-2 size-7 rounded-full bg-black/45 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={active} onClose={() => setActive(null)} onNavigate={setActive} />
    </>
  );
}
