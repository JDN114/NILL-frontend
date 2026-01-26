// src/components/FloatingMenu.tsx
import React, { FC } from "react";

interface MenuItem {
  label: string;
  href: string;
}

interface FloatingMenuProps {
  items?: MenuItem[];
  onClose?: () => void;
}

const FloatingMenu: FC<FloatingMenuProps> = ({ items = [], onClose = () => {} }) => {
  return (
    <nav
      className="fixed top-20 right-6 bg-white/90 rounded-xl shadow-lg p-4 z-40"
      aria-label="Floating menu"
    >
      <ul className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <li key={idx}>
            <a
              href={item.href}
              className="text-gray-700 hover:text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                // Sanitize href (keine eval- oder JS-Injection)
                if (item.href.startsWith("/") || item.href.startsWith("http")) {
                  window.location.href = item.href;
                }
                onClose();
              }}
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FloatingMenu;
