import type { ResolvedCard } from "@/lib/card";
import { Section } from "@/components/ui/Section";
import { Videos } from "./Videos";

export function VideosSection({ videos }: { videos: ResolvedCard["videos"] }) {
  if (videos.length === 0) return null;
  return (
    <Section id="videos" title="Videos">
      <Videos videos={videos} />
    </Section>
  );
}
