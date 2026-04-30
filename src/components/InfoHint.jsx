// src/components/InfoHint.jsx
//
// Subtiler Tooltip neben Form-Labels. Pure-CSS via Tailwind group-hover —
// kein State, kein useEffect, kein Layout-Flicker.
//
// Nutzung:
//   <label>
//     IMAP Host <InfoHint>Adresse des Eingangs-Servers …</InfoHint>
//   </label>

import React from "react";

/**
 * Kleines (i)-Icon das beim Hovern eine dunkle Tooltip-Box zeigt.
 *
 * Props:
 *   children: ReactNode — der Hint-Text. Kann auch JSX enthalten (z.B. <strong>).
 *   placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right"
 *               Default: "bottom-left".
 *   width?: Tailwind-Width-Class — Default "w-72".
 */
export default function InfoHint({ children, placement = "bottom-left", width = "w-72" }) {
  const pos =
    placement === "bottom-right" ? "left-auto right-0 top-full mt-1.5"  :
    placement === "top-left"     ? "left-0 bottom-full mb-1.5"          :
    placement === "top-right"    ? "left-auto right-0 bottom-full mb-1.5":
                                   "left-0 top-full mt-1.5";

  return (
    <span className="relative inline-flex group ml-1.5 align-middle leading-none">
      {/* Icon */}
      <span
        className="
          w-3.5 h-3.5 rounded-full
          border border-gray-600 text-gray-500
          text-[10px] leading-none
          flex items-center justify-center
          cursor-help select-none
          transition-colors
          group-hover:border-gray-400 group-hover:text-gray-300
        "
        aria-label="Hilfe"
      >
        i
      </span>

      {/* Tooltip */}
      <span
        role="tooltip"
        className={`
          ${width} ${pos}
          absolute z-50
          invisible opacity-0
          group-hover:visible group-hover:opacity-100
          transition-opacity duration-150
          p-3
          bg-gray-950 border border-gray-700 rounded-lg shadow-xl
          text-xs text-gray-300 leading-relaxed
          font-normal normal-case tracking-normal
          pointer-events-none
        `}
      >
        {children}
      </span>
    </span>
  );
}
