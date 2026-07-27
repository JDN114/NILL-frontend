import React from "react";

/**
 * NILL Brandmark — Monogramm-N als Aussparung in einer abgerundeten Kachel.
 * Der rechte Stamm steigt über die Versalhöhe: das ist die Signatur der Marke.
 *
 * Die Geometrie ist mit src/styles/brand.css (Mask-Data-URI), index.html
 * (Boot-Loader) und den PNG/ICO-Assets in /public identisch — Änderungen hier
 * müssen dort nachgezogen werden.
 *
 * Die Kachel nimmt `currentColor` an, die Aussparung bleibt transparent.
 */
const TILE =
  "M27 0H73A27 27 0 0 1 100 27V73A27 27 0 0 1 73 100H27A27 27 0 0 1 0 73V27A27 27 0 0 1 27 0Z";
const GLYPH_N =
  "M26 26 41 26 64 49.9583 64 13 74 13 74 76 36 36.4167 36 76 26 76Z";

export const NILL_MARK_PATH = TILE + GLYPH_N;

export default function BrandMark({ size = 26, className = "", style, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ flexShrink: 0, display: "block", ...style }}
      role="img"
      aria-label="NILL"
      {...rest}
    >
      <path fillRule="evenodd" d={NILL_MARK_PATH} fill="currentColor" />
    </svg>
  );
}
