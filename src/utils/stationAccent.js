// src/utils/stationAccent.js
//
// The ArbeitsStation module accents (neon teal/lime/pink/…) are tuned for
// the dark kiosk background and read fine there, but used verbatim as text
// color they fail contrast against the light theme's cream background
// (~1.1–2.5:1, need 4.5:1). This maps each accent to a darkened, same-hue
// variant for use wherever the accent is rendered as *text* in light mode.
// Decorative fills/borders (low-opacity backgrounds, dots, spinners) keep
// the original bright value — only text needs the swap.
const LIGHT_TEXT_VARIANTS = {
  "#fbbf24": "#815d00", // amber  — HR & Listen, Ausstehend/Mittel
  "#38f5d0": "#03735d", // teal   — Kalender, Schichtplan
  "#c6ff3c": "#4f6f00", // lime   — Aufgaben
  "#ff4d8d": "#c70048", // pink   — Zeiterfassung (Kommen)
  "#fb923c": "#a34900", // orange — Lieferscheine
  "#a78bfa": "#6938fc", // purple — Inventur
  "#f87171": "#cb0505", // red    — Hoch/Abgelehnt/Überfällig status badges
  "#86efac": "#0c7432", // green  — Niedrig/Bestätigt/Genehmigt status badges
  "#c5a572": "#806228", // gold   — kiosk brand accent (matches --as-accent light variant)
};

export function accentText(hex, theme) {
  return theme === "light" ? (LIGHT_TEXT_VARIANTS[hex] || hex) : hex;
}
