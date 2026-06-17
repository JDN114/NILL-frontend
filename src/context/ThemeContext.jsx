// src/context/ThemeContext.jsx
//
// Global light/dark theme for the whole dashboard.
//
// Strategy: a single `data-theme` attribute on <html> ("dark" | "light").
// All dashboard CSS is variable-driven; src/styles/theme-modes.css redefines
// the design tokens under html[data-theme="light"]. Dark stays the default so
// existing users see no change unless they opt in.
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "nill-theme";
const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {}, setTheme: () => {} });

function readInitialTheme() {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage blocked (private mode) — fall back to default */
  }
  // No stored preference: honour the OS setting on first visit, default dark.
  try {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
  } catch {
    /* matchMedia unavailable */
  }
  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitialTheme);

  // Persist the preference. The *effective* data-theme attribute is applied
  // per-route by <ThemeApplier> so it only affects dashboard surfaces — the
  // landing/marketing/legal pages stay dark regardless of the saved choice.
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

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
