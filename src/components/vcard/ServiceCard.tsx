import type { ResolvedCard } from "@/lib/card";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { ImageFallback } from "@/components/ui/ImageFallback";
import { SafeImage } from "@/components/ui/SafeImage";
import { cx } from "@/lib/cx";

type ServiceItem = ResolvedCard["services"][number];

/** `wide` lays the card out horizontally when it spans both grid columns. */
export function ServiceCard({ service, wide }: { service: ServiceItem; wide?: boolean }) {
  const { title, description, image, enquiryUrl } = service;

  return (
    <article
      className={cx(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-card",
        wide && "sm:flex-row",
      )}
    >
      {image && (
        <div className={cx("relative aspect-[2/1] overflow-hidden bg-subtle sm:aspect-[16/10]", wide && "sm:aspect-auto sm:w-[48%] sm:shrink-0")}>
          <SafeImage
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 296px, (min-width: 640px) 256px, 100vw"
            className="object-cover"
            fallback={<ImageFallback />}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[17px] font-semibold tracking-tight text-ink">{title}</h3>
        {description && <p className="mt-2 text-sm leading-6 text-muted">{description}</p>}
        {enquiryUrl && (
          <div className="mt-auto pt-5">
            <a
              href={enquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enquire about ${title} on WhatsApp (opens in a new tab)`}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium text-ink transition-colors hover:border-brand-line hover:bg-brand-soft"
            >
              <WhatsAppIcon className="size-4 text-brand-ink" />
              Enquire on WhatsApp
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
