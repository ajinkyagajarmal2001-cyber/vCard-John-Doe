"use client";

import { AnimatePresence, m } from "framer-motion";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import type { ResolvedCard } from "@/lib/card";
import type { VCardSource } from "@/lib/vcard";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { SaveContactButton } from "./SaveContactButton";

interface StickyActionBarProps {
  source: VCardSource;
  contact: ResolvedCard["contact"];
}

/** Keeps the key actions within reach once the header actions scroll out of view. */
export function StickyActionBar({ source, contact }: StickyActionBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("primary-actions");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const iconButton =
    "inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-brand-ink transition-colors hover:bg-brand-soft";

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <nav
            aria-label="Quick actions"
            className="mx-auto flex max-w-xl gap-2 rounded-2xl border border-line bg-surface/95 p-2 shadow-float backdrop-blur md:max-w-2xl"
          >
            <SaveContactButton source={source} className="min-w-0 flex-1" />
            {contact.phone && (
              <a href={contact.phone.href} aria-label="Call" className={iconButton}>
                <Phone className="size-5" aria-hidden />
              </a>
            )}
            {contact.whatsapp && (
              <a
                href={contact.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp (opens in a new tab)"
                className={iconButton}
              >
                <WhatsAppIcon className="size-5" />
              </a>
            )}
          </nav>
        </m.div>
      )}
    </AnimatePresence>
  );
}
