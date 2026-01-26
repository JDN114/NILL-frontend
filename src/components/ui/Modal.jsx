// src/components/ui/Modal.jsx
import React, { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  // Escape-Taste schließt Modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose} // Klick außerhalb schließt Modal
    >
      <div
        className="bg-gray-900 dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg relative shadow-xl"
        onClick={(e) => e.stopPropagation()} // Klick innerhalb Modal blockiert Schließen
      >
        {title && (
          <h2 id="modal-title" className="text-lg font-bold mb-4 text-white dark:text-gray-100">
            {title}
          </h2>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded"
          aria-label="Schließen"
        >
          ✕
        </button>

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
