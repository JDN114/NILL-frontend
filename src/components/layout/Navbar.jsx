import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname.startsWith(path)
        ? "bg-[var(--bg-panel)] text-[var(--nill-primary)]"
        : "text-[var(--text-muted)] hover:text-white"
    }`;

  return (
    <header className="bg-[var(--bg-panel)] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-[var(--nill-primary)]">
          NILL
        </span>

        <nav className="flex gap-2">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/dashboard/emails" className={linkClass("/dashboard/emails")}>
            Emails
          </Link>
          <Link to="/dashboard/settings" className={linkClass("/dashboard/settings")}>
            Einstellungen
          </Link>
        </nav>
      </div>
    </header>
  );
}
