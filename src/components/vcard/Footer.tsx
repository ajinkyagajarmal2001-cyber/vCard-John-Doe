import type { ResolvedCard } from "@/lib/card";

export function Footer({ footer }: { footer: ResolvedCard["footer"] }) {
  return (
    <footer className="border-t border-line px-5 pt-8 pb-28 text-center text-xs text-muted sm:px-8 sm:pb-8">
      <p>{footer.copyright}</p>
      {footer.credit && (
        <p className="mt-1.5">
          {footer.credit.url ? (
            <a href={footer.credit.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-ink hover:underline">
              {footer.credit.label}
            </a>
          ) : (
            footer.credit.label
          )}
        </p>
      )}
    </footer>
  );
}
