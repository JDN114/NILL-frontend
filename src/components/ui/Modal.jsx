import React, { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const focusable = modalRef.current?.querySelectorAll(
      'button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])'
    );
    if (focusable?.length) focusable[0].focus();

    const handleKey = (e) => {
      if (e.key === "Escape") { onClose?.(); return; }
      if (e.key !== "Tab" || !modalRef.current) return;
      const all = [...modalRef.current.querySelectorAll(
        'button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])'
      )];
      if (!all.length) return;
      if (e.shiftKey && document.activeElement === all[0]) {
        e.preventDefault(); all[all.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === all[all.length - 1]) {
        e.preventDefault(); all[0].focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`bg-gray-900 border border-white/10 rounded-xl w-full ${maxWidth} relative shadow-2xl flex flex-col`}
        style={{ maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          {title && (
            <h2 id="modal-title" className="text-base font-bold text-white">
              {title}
            </h2>
          )}
          <button onClick={onClose}
            className="ml-auto text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded p-1 transition-colors"
            aria-label="Schließen">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scrollbarer Inhalt */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
