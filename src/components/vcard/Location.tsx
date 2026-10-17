import { Clock, MapPin, Navigation } from "lucide-react";
import type { ResolvedCard } from "@/lib/card";
import { Section } from "@/components/ui/Section";
import { CopyButton } from "./CopyButton";

export function Location({ location }: { location: ResolvedCard["location"] }) {
  if (!location) return null;
  const { address, mapUrl, mapLabel, mapEmbedUrl, hours } = location;

  return (
    <Section id="location" title="Location">
      <div className="overflow-hidden rounded-2xl border border-line">
        {mapEmbedUrl && (
          <div className="relative aspect-[16/9] border-b border-line bg-subtle">
            <iframe
              src={mapEmbedUrl}
              title={address ? `Map showing ${address}` : "Map"}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full grayscale-[35%]"
            />
          </div>
        )}

        <div className="space-y-5 p-5">
          {address && (
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                <MapPin className="size-[18px]" aria-hidden />
              </span>
              <address className="min-w-0 flex-1 pt-0.5 text-[15px] leading-relaxed text-ink not-italic">{address}</address>
              <CopyButton value={address} label="address" />
            </div>
          )}

          {hours.length > 0 && (
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                <Clock className="size-[18px]" aria-hidden />
              </span>
              <dl aria-label="Business hours" className="flex-1 space-y-1.5 pt-0.5 text-sm">
                {hours.map(({ days, hours: time }) => (
                  <div key={days} className="flex justify-between gap-4">
                    <dt className="text-muted">{days}</dt>
                    <dd className="text-right font-medium text-ink tabular-nums">{time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-line bg-brand-soft text-[15px] font-semibold text-brand-ink transition-colors hover:bg-brand hover:text-on-brand"
            >
              <Navigation className="size-[18px]" aria-hidden />
              {mapLabel}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
