import type { ResolvedTheme } from "@/lib/theme";

/** Initials on the brand colour – used for generated favicons. */
export function Monogram({ initials, theme, size, radius }: { initials: string; theme: ResolvedTheme; size: number; radius: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.primary,
        color: theme.onPrimary,
        borderRadius: radius,
        fontSize: size * (initials.length > 1 ? 0.42 : 0.55),
        fontWeight: 700,
        letterSpacing: -0.5,
      }}
    >
      {initials}
    </div>
  );
}
