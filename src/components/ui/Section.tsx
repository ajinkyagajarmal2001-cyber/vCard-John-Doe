import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

/** Standard section shell: accessible heading + scroll reveal. */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-6">
      <Reveal>
        <h2
          id={headingId}
          className="mb-5 flex items-center gap-4 text-[11px] font-semibold tracking-[0.2em] text-muted uppercase"
        >
          <span className="shrink-0">{title}</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
        </h2>
        {children}
      </Reveal>
    </section>
  );
}
