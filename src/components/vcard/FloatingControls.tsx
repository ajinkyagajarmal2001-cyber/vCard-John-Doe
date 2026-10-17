import type { ResolvedCard } from "@/lib/card";
import { ModeToggle } from "./ModeToggle";
import { ShareButton } from "./ShareButton";

/**
 * Day/Night and Share buttons, fixed to the top of the screen so they stay
 * reachable while scrolling. Aligned to the card's width (and its top edge on
 * larger screens) so they sit over the card's cover at first.
 */
export function FloatingControls({ card }: { card: ResolvedCard }) {
  const { profile, seo, theme } = card;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-12 md:pt-16">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between px-3 sm:px-8 md:max-w-2xl [&>*]:pointer-events-auto">
        <ModeToggle
          initialMode={theme.defaultMode === "dark" ? "dark" : "light"}
          themeColors={{ light: theme.surface, dark: theme.dark.surface }}
        />
        <ShareButton title={seo.title} text={profile.tagline ?? seo.description} />
      </div>
    </div>
  );
}
