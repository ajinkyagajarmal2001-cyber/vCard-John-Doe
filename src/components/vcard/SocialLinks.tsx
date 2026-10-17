import { ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";
import type { ResolvedCard } from "@/lib/card";
import type { SocialPlatform } from "@/types";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon, type IconProps } from "@/components/ui/BrandIcons";
import { Section } from "@/components/ui/Section";

const ICONS: Record<SocialPlatform, ComponentType<IconProps>> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  twitter: XIcon,
};

export function SocialLinks({ social }: { social: ResolvedCard["social"] }) {
  if (social.length === 0) return null;

  return (
    <Section id="social" title="Connect">
      <ul className="grid grid-cols-2 gap-2.5">
        {social.map(({ platform, label, url }) => {
          const Icon = ICONS[platform];
          return (
            <li key={platform} className="odd:last:col-span-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                className="group flex h-12 items-center gap-3 rounded-xl border border-line px-4 text-sm font-medium text-ink transition-colors hover:border-brand-line hover:bg-brand-soft"
              >
                <Icon className="size-[18px] shrink-0 text-brand-ink" />
                <span className="truncate">{label}</span>
                <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
