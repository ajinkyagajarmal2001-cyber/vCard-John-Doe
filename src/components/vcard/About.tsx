import type { ResolvedCard } from "@/lib/card";
import { Section } from "@/components/ui/Section";

export function About({ about }: { about: ResolvedCard["about"] }) {
  if (!about) return null;

  return (
    <Section id="about" title={about.title}>
      <div className="max-w-prose space-y-4 text-[15px] leading-7 text-pretty text-ink-soft">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {about.highlights.length > 0 && (
        <dl className="mt-7 grid grid-flow-col auto-cols-fr divide-x divide-line rounded-2xl border border-line bg-subtle">
          {about.highlights.map(({ value, label }) => (
            <div key={label} className="flex flex-col-reverse items-center justify-end gap-1 px-2 py-4 text-center">
              <dt className="text-xs leading-snug text-muted">{label}</dt>
              <dd className="font-display text-2xl font-semibold tracking-tight text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Section>
  );
}
