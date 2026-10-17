import { Globe, Mail, Phone, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import type { ResolvedCard } from "@/lib/card";
import { WhatsAppIcon, type IconProps } from "@/components/ui/BrandIcons";
import { cx } from "@/lib/cx";
import { SaveContactButton } from "./SaveContactButton";

interface Action {
  label: string;
  href: string;
  icon: LucideIcon | ComponentType<IconProps>;
  external?: boolean;
  description: string;
}

// Four tiles drop to a 2×2 grid on very narrow phones (< 360px).
const GRID_COLUMNS = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-2 min-[360px]:grid-cols-4"];

export function buildPrimaryActions({ contact, profile }: ResolvedCard): Action[] {
  const actions: Array<Action | false | undefined> = [
    contact.phone && { label: "Call", href: contact.phone.href, icon: Phone, description: `Call ${profile.name}` },
    contact.whatsapp && {
      label: "WhatsApp",
      href: contact.whatsapp.href,
      icon: WhatsAppIcon,
      external: true,
      description: `Message ${profile.name} on WhatsApp`,
    },
    contact.email && { label: "Email", href: contact.email.href, icon: Mail, description: `Email ${profile.name}` },
    contact.website && {
      label: "Website",
      href: contact.website.url,
      icon: Globe,
      external: true,
      description: `Visit website of ${profile.name}`,
    },
  ];
  return actions.filter((a): a is Action => !!a);
}

/** Call / WhatsApp / Email / Website tiles plus the Save Contact button. */
export function ContactActions({ card }: { card: ResolvedCard }) {
  const actions = buildPrimaryActions(card);

  return (
    <div id="primary-actions" className="space-y-3">
      {actions.length > 0 && (
        <ul className={cx("grid gap-2.5", GRID_COLUMNS[actions.length])}>
          {actions.map(({ label, href, icon: Icon, external, description }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={external ? `${description} (opens in a new tab)` : description}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className="group flex h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-surface text-ink transition-[background-color,border-color,transform] duration-150 hover:border-brand-line hover:bg-brand-soft active:scale-[0.97]"
              >
                <Icon className="size-5 text-brand-ink" aria-hidden />
                <span className="text-[13px] font-medium">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <SaveContactButton
        className="w-full"
        source={{ profile: card.profile, contact: card.contact, social: card.social, location: card.location }}
      />
    </div>
  );
}
