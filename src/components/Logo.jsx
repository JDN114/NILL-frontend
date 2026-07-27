import React from "react";
import BrandMark from "./BrandMark";

/**
 * NILL Lockup — Brandmark + Wortmarke.
 * Die Marke selbst liegt in BrandMark.jsx; hier nur die Kombination mit dem
 * Schriftzug. Farbe kommt über `color` vom Elternelement (currentColor).
 */
export default function Logo({ size = 28, showWordmark = true, className = "" }) {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.36 }}
      aria-label="NILL"
    >
      <BrandMark size={size} aria-hidden="true" role={undefined} />
      {showWordmark && (
        <span
          style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: size * 0.78,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          NILL
        </span>
      )}
    </span>
  );
}
