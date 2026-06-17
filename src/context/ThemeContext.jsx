// src/context/ThemeContext.jsx
//
// Global light/dark theme for the whole dashboard.
//
// Strategy: a single `data-theme` attribute on <html> ("dark" | "light").
// All dashboard CSS is variable-driven; src/styles/theme-modes.css redefines
// the design tokens under html[data-theme="light"]. Dark stays the default so
// existing users see no change unless they opt in.
//
// The attribute is written to <html> by <ThemeApplier> (mounted inside the
// Router) so the light theme only affects authenticated dashboard surfaces —
// the landing/marketing/legal/auth pages always stay dark regardless of the
// saved preference.
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "nill-theme";

// Authenticated dashboard surfaces where the light theme is allowed to apply.
// Any route whose pathname starts with one of these prefixes counts as a
// dashboard surface (this covers every /dashboard/* sub-page in one shot).
export const DASHBOARD_ROUTE_PREFIXES = [
  "/dashboard",
  "/station",
  "/ausweis",
  "/admin",
  "/upgrade",
  "/onboarding",
  "/redeem-coupon",
];

export function isDashboardPath(pathname) {
  return DASHBOARD_ROUTE_PREFIXES.some((p) => pathname.startsWith(p));
}

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {}, setTheme: () => {} });

function readInitialTheme() {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage blocked (private mode) — fall back to default */
  }
  // No stored preference: dark is the standard mode.
  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitialTheme);

  // Persist the preference. The *effective* data-theme attribute is applied
  // per-route by <ThemeApplier>.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore persistence errors */
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState(next === "light" ? "light" : "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Writes the effective `data-theme` onto <html>. Light only applies on
// dashboard surfaces; everywhere else (and as the default) it stays dark.
// Must be rendered inside <Router> because it reads the current location.
export function ThemeApplier() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    const effective = theme === "light" && isDashboardPath(pathname) ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", effective);
  }, [theme, pathname]);

  return null;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
