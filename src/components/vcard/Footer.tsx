import { Phone } from "lucide-react";
import { agencyBranding } from "@/branding";
import type { ResolvedCard } from "@/lib/card";
import { cleanText, digitsOnly, isValidPhone } from "@/lib/validation";

/** Template owner's credit from src/branding.ts (same on every client card). */
function AgencyCredit() {
  const name = cleanText(agencyBranding.name);
  if (!name) return null;
  const label = cleanText(agencyBranding.label);
  const phone = cleanText(agencyBranding.phone);
  const tel = phone && isValidPhone(phone) ? `tel:${phone.startsWith("+") ? "+" : ""}${digitsOnly(phone)}` : undefined;

  return (
    <div>
      {label && <p className="text-[10px] font-semibold tracking-[0.18em] uppercase">{label}</p>}
      <p className="mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[13px]">
        <span className="font-semibold text-ink">{name}</span>
        {tel && (
          <>
            <span aria-hidden className="h-3.5 w-px bg-line-strong" />
            <a
              href={tel}
              aria-label={`Call ${name} on ${phone}`}
              className="inline-flex items-center gap-1.5 tabular-nums transition-colors hover:text-ink"
            >
              <Phone className="size-3.5" aria-hidden />
              {phone}
            </a>
          </>
        )}
      </p>
    </div>
  );
}

export function Footer({ footer }: { footer: ResolvedCard["footer"] }) {
  return (
    <footer className="space-y-4 border-t border-line px-5 pt-8 pb-28 text-center text-xs text-muted sm:px-8 sm:pb-8">
      {footer.credit && (
        <p>
          {footer.credit.url ? (
            <a href={footer.credit.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-ink hover:underline">
              {footer.credit.label}
            </a>
          ) : (
            footer.credit.label
          )}
        </p>
      )}
      <AgencyCredit />
    </footer>
  );
}
