"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { ResolvedCard } from "@/lib/card";
import { Dialog } from "@/components/ui/Dialog";
import { youTubeEmbedUrl } from "@/lib/youtube";
import { VideoCard } from "./VideoCard";

type VideoItems = ResolvedCard["videos"];

/** First video is featured; the rest sit in a two-column grid. */
export function Videos({ videos }: { videos: VideoItems }) {
  const [playing, setPlaying] = useState<VideoItems[number] | null>(null);
  if (videos.length === 0) return null;

  const [featured, ...rest] = videos;

  return (
    <>
      <div className="space-y-5">
        <VideoCard video={featured} featured onPlay={() => setPlaying(featured)} />
        {rest.length > 0 && (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-5">
            {rest.map((video) => (
              <li key={video.id}>
                <VideoCard video={video} onPlay={() => setPlaying(video)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!playing} onClose={() => setPlaying(null)} title={playing?.title ?? "Video"} variant="media">
        {playing && (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                src={youTubeEmbedUrl(playing.id)}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 size-full"
              />
            </div>
            <a
              href={playing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Watch on YouTube <ArrowUpRight className="size-4" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </>
        )}
      </Dialog>
    </>
  );
}
