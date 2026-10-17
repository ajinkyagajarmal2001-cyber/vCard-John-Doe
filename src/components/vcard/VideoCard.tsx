import { Play } from "lucide-react";
import Image from "next/image";
import type { ResolvedCard } from "@/lib/card";
import { cx } from "@/lib/cx";

type VideoItem = ResolvedCard["videos"][number];

/** Lightweight thumbnail – the YouTube player only loads after a click. */
export function VideoCard({ video, featured, onPlay }: { video: VideoItem; featured?: boolean; onPlay: () => void }) {
  return (
    <button type="button" onClick={onPlay} className="group block w-full text-left" aria-label={`Play video: ${video.title}`}>
      <span className="relative block aspect-video overflow-hidden rounded-xl bg-subtle">
        <Image
          src={video.thumbnail}
          alt=""
          fill
          unoptimized
          sizes={featured ? "(min-width: 768px) 592px, 100vw" : "(min-width: 768px) 290px, 50vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span
          aria-hidden
          className={cx(
            "absolute inset-0 m-auto flex items-center justify-center rounded-full bg-surface/95 text-brand-ink shadow-float transition-transform duration-200 group-hover:scale-105",
            featured ? "size-14" : "size-11",
          )}
        >
          <Play className={cx("translate-x-px fill-current", featured ? "size-5" : "size-4")} />
        </span>
      </span>
      <span className={cx("mt-2.5 line-clamp-2 font-medium text-ink", featured ? "text-[15px]" : "text-[13px] leading-snug")}>
        {video.title}
      </span>
    </button>
  );
}
