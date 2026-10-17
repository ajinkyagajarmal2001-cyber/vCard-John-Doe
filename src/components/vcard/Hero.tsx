import { Building2 } from "lucide-react";
import type { ResolvedCard } from "@/lib/card";
import { SafeImage } from "@/components/ui/SafeImage";
import { ContactActions } from "./ContactActions";

interface HeroProps {
  card: ResolvedCard;
}

function CoverPattern() {
  return (
    <div aria-hidden className="absolute inset-0 bg-brand">
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 90% at 50% 0%, black, transparent)",
        }}
      />
    </div>
  );
}

function Initials({ initials }: { initials: string }) {
  return (
    <div aria-hidden className="flex size-full items-center justify-center bg-brand-soft font-display text-[2.5rem] font-semibold text-brand-ink">
      {initials}
    </div>
  );
}

export function Hero({ card }: HeroProps) {
  const { profile } = card;

  return (
    <header>
      {/* Cover */}
      <div className="relative h-40 overflow-hidden sm:h-52">
        {profile.coverImage ? (
          <SafeImage
            src={profile.coverImage}
            alt=""
            fill
            preload
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover"
            fallback={<CoverPattern />}
          />
        ) : (
          <CoverPattern />
        )}
        <div aria-hidden className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent" />
      </div>

      {/* Identity */}
      <div className="relative px-5 text-center sm:px-8">
        <div className="mx-auto -mt-14 size-28 overflow-hidden rounded-full bg-surface ring-4 ring-surface shadow-card motion-safe:animate-rise sm:-mt-16 sm:size-32">
          <div className="relative size-full overflow-hidden rounded-full">
            {profile.profileImage ? (
              <SafeImage
                src={profile.profileImage}
                alt={`Portrait of ${profile.name}`}
                fill
                loading="eager"
                sizes="128px"
                className="object-cover"
                fallback={<Initials initials={profile.initials} />}
              />
            ) : (
              <Initials initials={profile.initials} />
            )}
          </div>
        </div>

        <div className="mt-5 motion-safe:animate-rise [animation-delay:80ms]">
          <h1 className="font-display text-[1.75rem] leading-tight font-semibold tracking-tight text-balance text-ink sm:text-[2rem]">
            {profile.name}
          </h1>
          {profile.designation && (
            <p className="mt-1.5 text-[15px] font-medium text-brand-ink">{profile.designation}</p>
          )}
          {profile.company && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
              <Building2 className="size-4 shrink-0" aria-hidden />
              <span>{profile.company}</span>
            </p>
          )}
          {profile.tagline && (
            <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-pretty text-ink-soft">
              {profile.tagline}
            </p>
          )}
        </div>

        <div className="mt-7 mb-10 motion-safe:animate-rise [animation-delay:160ms]">
          <ContactActions card={card} />
        </div>
      </div>
    </header>
  );
}
