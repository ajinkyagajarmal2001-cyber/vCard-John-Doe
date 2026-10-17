import type { ResolvedCard } from "@/lib/card";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "./ServiceCard";

export function Services({ services }: { services: ResolvedCard["services"] }) {
  if (services.length === 0) return null;

  return (
    <Section id="services" title="Services">
      <ul className="grid gap-4 sm:grid-cols-2">
        {services.map((service, index) => {
          // An odd last card spans both columns instead of leaving a gap.
          const wide = services.length > 1 && services.length % 2 === 1 && index === services.length - 1;
          return (
            <li key={service.title} className={wide ? "sm:col-span-2" : undefined}>
              <ServiceCard service={service} wide={wide} />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
