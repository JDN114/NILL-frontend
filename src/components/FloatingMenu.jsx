import React from "react";

export default function FloatingMenu({ items = [], onClose = () => {} }) {
  return (
    <div className="fixed top-20 right-6 bg-white/90 rounded-xl shadow-lg p-4 z-40">
      <ul className="flex flex-col gap-3">
        {items.map((it) => (
          <li key={it.label}>
            <a href={it.href} className="text-gray-700 hover:text-gray-900" onClick={onClose}>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
