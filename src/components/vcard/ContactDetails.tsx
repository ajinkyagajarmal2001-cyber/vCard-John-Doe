import { ArrowUpRight, Globe, Mail, Phone, type LucideIcon } from "lucide-react";
import type { ResolvedCard } from "@/lib/card";
import { Section } from "@/components/ui/Section";
import { CopyButton } from "./CopyButton";

interface Row {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
  copy?: boolean;
}

/** Readable list of contact values (with copy buttons). Hidden when nothing is set. */
export function ContactDetails({ contact }: { contact: ResolvedCard["contact"] }) {
  const rows: Array<Row | undefined> = [
    contact.phone && { label: "Phone", value: contact.phone.display, href: contact.phone.href, icon: Phone, copy: true },
    contact.email && { label: "Email", value: contact.email.address, href: contact.email.href, icon: Mail, copy: true },
    contact.website && {
      label: "Website",
      value: contact.website.display,
      href: contact.website.url,
      icon: Globe,
      external: true,
    },
  ];
  const items = rows.filter((r): r is Row => !!r);
  if (items.length === 0) return null;

  return (
    <Section id="contact" title="Contact">
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {items.map(({ label, value, href, icon: Icon, external, copy }) => (
          <li key={label} className="flex items-center gap-1 pr-2">
            <a
              href={href}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="group flex min-w-0 flex-1 items-center gap-4 px-4 py-3.5 transition-colors hover:bg-subtle"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted">{label}</span>
                <span className="block text-[15px] font-medium [overflow-wrap:anywhere] text-ink">{value}</span>
              </span>
              {external && (
                <>
                  <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </>
              )}
            </a>
            {copy && <CopyButton value={value} label={label.toLowerCase()} />}
          </li>
        ))}
      </ul>
    </Section>
  );
}
