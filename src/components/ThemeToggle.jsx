// src/components/ThemeToggle.jsx
//
// Small floating light/dark switch. Mounted once at the app root and shown only
// on authenticated dashboard surfaces (the dashboard has no single shared
// chrome, so a global gated control reaches every sub-category at once).
import { useLocation } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

// Authenticated surfaces where the toggle should appear.
const SHOW_ON = ["/dashboard", "/station", "/ausweis", "/admin", "/upgrade", "/onboarding"];

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  if (!SHOW_ON.some((p) => pathname.startsWith(p))) return null;

  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Auf dunkles Design wechseln" : "Auf helles Design wechseln"}
      title={isLight ? "Dunkles Design" : "Helles Design"}
      style={{
        position: "fixed",
        left: "max(16px, env(safe-area-inset-left))",
        bottom: "max(16px, env(safe-area-inset-bottom))",
        zIndex: 2147483000,
        width: 42,
        height: 42,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        border: "1px solid var(--nill-border, rgba(var(--tint),0.12))",
        background: "var(--nill-panel, rgba(var(--tint),0.06))",
        color: "var(--nill-text, #e2e8f0)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        cursor: "pointer",
        transition: "background .2s, border-color .2s, transform .15s",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {isLight ? <FiMoon size={18} aria-hidden /> : <FiSun size={18} aria-hidden />}
    </button>
  );
}
