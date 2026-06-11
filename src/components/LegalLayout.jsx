import React from "react";
import { useNavigate } from "react-router-dom";

const bg     = "#040407";
const ink    = "#efede7";
const inkDim = "rgba(239,237,231,0.5)";
const line   = "rgba(239,237,231,0.07)";
const accent = "#c6ff3c";
const serif  = "'Fraunces','Iowan Old Style',Georgia,serif";
const mono   = "'JetBrains Mono',monospace";
const sans   = "'Inter',system-ui,sans-serif";

export default function LegalLayout({ title, children, fillViewport = false }) {
  const navigate = useNavigate();
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate("/"));

  const header = (
    <>
      {/* Back button */}
      <button
        onClick={goBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "none", border: "none", cursor: "pointer", padding: 0,
          marginBottom: 36, color: ink, flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.querySelector("span").style.color = accent}
        onMouseLeave={e => e.currentTarget.querySelector("span").style.color = ink}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: `conic-gradient(from 210deg, ${accent}, #38f5d0, #7a5cff, #ff4d8d, ${accent})`,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 4, borderRadius: 5, background: bg }} />
        </div>
        <span style={{ fontFamily: serif, fontSize: 20, letterSpacing: "-0.02em", color: ink, transition: "color 0.2s" }}>
          NILL
        </span>
      </button>

      {/* Eyebrow */}
      <div style={{
        fontFamily: mono, fontSize: 11, letterSpacing: "0.22em",
        textTransform: "uppercase", color: inkDim,
        display: "inline-flex", alignItems: "center", gap: 10,
        marginBottom: 16, flexShrink: 0,
      }}>
        <span style={{ width: 22, height: 1, background: inkDim, display: "inline-block", opacity: 0.6 }} />
        Rechtliche Informationen
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: serif, fontWeight: 400,
        fontSize: "clamp(28px, 5vw, 56px)",
        letterSpacing: "-0.025em", lineHeight: 0.95,
        margin: "0 0 20px", color: ink, flexShrink: 0,
      }}>
        {title}
      </h1>

      {/* Accent divider */}
      <div style={{
        height: 1, width: "100%", marginBottom: 28, flexShrink: 0,
        background: "linear-gradient(to right, rgba(198,255,60,0.3), rgba(239,237,231,0.07) 40%, transparent)",
      }} />
    </>
  );

  /* ── Viewport-locked layout (iframe pages) ── */
  if (fillViewport) {
    return (
      <div style={{
        background: bg, color: ink, fontFamily: sans,
        height: "100dvh", overflow: "hidden",
        display: "flex", flexDirection: "column",
        position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: -200, left: -150, width: 500, height: 500, borderRadius: "50%", background: "rgba(198,255,60,0.04)", filter: "blur(80px)" }} />
        </div>

        <div style={{
          position: "relative", zIndex: 10,
          width: "min(920px, 100% - 48px)", margin: "0 auto",
          padding: "40px 0 24px",
          flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
          minHeight: 0,
        }}>
          {header}

          {/* Card fills remaining space; iframe inside scrolls */}
          <div style={{
            flex: 1, minHeight: 0, overflow: "hidden",
            borderRadius: 28,
            border: `1px solid ${line}`,
            background: "linear-gradient(180deg,#0a0a0e,#060609)",
          }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  /* ── Default scrollable layout ── */
  return (
    <div style={{ background: bg, color: ink, fontFamily: sans, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -200, left: -150, width: 500, height: 500, borderRadius: "50%", background: "rgba(198,255,60,0.04)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: -250, right: -150, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.015)", filter: "blur(80px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, width: "min(860px, 100% - 48px)", margin: "0 auto", padding: "60px 0 80px" }}>
        {header}

        <div style={{
          borderRadius: 28,
          border: `1px solid ${line}`,
          background: "linear-gradient(180deg,#0a0a0e,#060609)",
          padding: "40px 44px",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
