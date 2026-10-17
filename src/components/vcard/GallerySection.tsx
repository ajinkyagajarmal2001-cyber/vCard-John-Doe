import type { ResolvedCard } from "@/lib/card";
import { Section } from "@/components/ui/Section";
import { Gallery } from "./Gallery";

export function GallerySection({ items }: { items: ResolvedCard["gallery"] }) {
  if (items.length === 0) return null;
  return (
    <Section id="gallery" title="Gallery">
      <Gallery items={items} />
    </Section>
  );
}
