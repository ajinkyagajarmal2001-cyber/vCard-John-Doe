"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { MODE_STORAGE_KEY, type ColorMode } from "@/lib/theme";

const readMode = (): ColorMode => (document.documentElement.dataset.mode === "dark" ? "dark" : "light");

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  return () => observer.disconnect();
}

interface ModeToggleProps {
  /** Mode rendered on the server (before the saved preference is known). */
  initialMode: ColorMode;
  /** Browser UI colour (address bar) for each mode. */
  themeColors: Record<ColorMode, string>;
}

/** Day/Night switch. The choice is remembered on this device. */
export function ModeToggle({ initialMode, themeColors }: ModeToggleProps) {
  const mode = useSyncExternalStore(subscribe, readMode, () => initialMode);
  const next: ColorMode = mode === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Switch to night mode" : "Switch to day mode";

  function toggle() {
    document.documentElement.dataset.mode = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[next]);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* Storage unavailable (private mode) – the switch still works for this visit. */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm ring-1 ring-black/5 backdrop-blur transition-colors hover:bg-surface"
    >
      {mode === "dark" ? <Sun className="size-[18px]" aria-hidden /> : <Moon className="size-[18px]" aria-hidden />}
    </button>
  );
}
