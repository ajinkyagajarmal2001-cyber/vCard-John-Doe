import { ArrowUpRight, Link2 } from "lucide-react";
import type { ResolvedCard } from "@/lib/card";
import { Section } from "@/components/ui/Section";

export function AdditionalLinks({ links }: { links: ResolvedCard["links"] }) {
  if (links.length === 0) return null;

  return (
    <Section id="links" title="Links">
      <ul className="space-y-2.5">
        {links.map(({ title, url, description, host }) => (
          <li key={url + title}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition-[border-color,background-color] hover:border-brand-line hover:bg-brand-soft"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-subtle text-brand-ink transition-colors group-hover:bg-surface">
                <Link2 className="size-[18px]" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-ink">{title}</span>
                <span className="block truncate text-xs text-muted">{description ?? host}</span>
              </span>
              <ArrowUpRight className="size-[18px] shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-ink" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
