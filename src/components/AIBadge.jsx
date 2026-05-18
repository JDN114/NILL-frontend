/**
 * AIBadge — EU AI Act Art. 52 transparency label for AI-generated content.
 * Renders a small inline chip next to any AI-generated output.
 */
export default function AIBadge({ style = {} }) {
  return (
    <span
      title="Dieser Inhalt wurde durch künstliche Intelligenz generiert."
      aria-label="KI-generierter Inhalt"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        color: "rgba(139, 92, 246, 0.9)",
        background: "rgba(139, 92, 246, 0.12)",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        borderRadius: "4px",
        padding: "1px 6px",
        userSelect: "none",
        verticalAlign: "middle",
        ...style,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 1a1 1 0 0 1 .894.553l1.618 3.276 3.613.525a1 1 0 0 1 .554 1.706l-2.615 2.55.617 3.597a1 1 0 0 1-1.451 1.054L8 12.347l-3.23 1.914a1 1 0 0 1-1.451-1.054l.617-3.597-2.615-2.55a1 1 0 0 1 .554-1.706l3.613-.525L7.106 1.553A1 1 0 0 1 8 1z"/>
      </svg>
      KI
    </span>
  );
}
