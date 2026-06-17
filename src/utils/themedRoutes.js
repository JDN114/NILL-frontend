// Routes where the user's light/dark preference applies. Everywhere else
// (landing, marketing, legal, auth) is always rendered dark.
// NOTE: index.html has an inline copy of this list for the pre-paint script —
// keep them in sync.
export const THEMED_ROUTES = [
  "/dashboard",
  "/station",
  "/ausweis",
  "/admin",
  "/upgrade",
  "/onboarding",
];

export function isThemedRoute(pathname) {
  return THEMED_ROUTES.some((p) => pathname.startsWith(p));
}
