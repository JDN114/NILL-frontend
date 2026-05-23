import { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";

// Kiosk-QR-Scanner: Kamera + Hardware-Barcode-Scanner (Keyboard-Emulation)
// Ruft onScan(payload) auf, wenn ein gültiger QR-Code erkannt wird.
export default function QrScannerStation({ onScan, accent = "#c5a572", label = "Mitarbeiterausweis scannen" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const lastScanTs = useRef(0);
  const kbBuf = useRef("");
  const kbTimer = useRef(null);

  const [camState, setCamState] = useState("requesting"); // requesting | active | denied

  const triggerScan = useCallback((payload) => {
    const now = Date.now();
    if (now - lastScanTs.current < 2500) return;
    lastScanTs.current = now;
    onScan(payload.trim());
  }, [onScan]);

  // Kamera starten
  useEffect(() => {
    let alive = true;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then(stream => {
        if (!alive) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamState("active");
      })
      .catch(() => alive && setCamState("denied"));

    return () => {
      alive = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // RAF-Scan-Schleife
  useEffect(() => {
    if (camState !== "active") return;
    const tick = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === 4) {
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);
        const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
        if (code?.data) triggerScan(code.data);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [camState, triggerScan]);

  // Hardware-Barcode-Scanner (Keyboard-Emulation: Zeichen → Enter)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        clearTimeout(kbTimer.current);
        const buf = kbBuf.current;
        kbBuf.current = "";
        if (buf.length >= 8) triggerScan(buf);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        kbBuf.current += e.key;
        clearTimeout(kbTimer.current);
        kbTimer.current = setTimeout(() => { kbBuf.current = ""; }, 500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(kbTimer.current); };
  }, [triggerScan]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {camState === "active" && (
        <div style={{
          position: "relative", borderRadius: 16, overflow: "hidden",
          width: "100%", maxWidth: 320, aspectRatio: "1/1",
          background: "#000",
        }}>
          <video
            ref={videoRef}
            autoPlay playsInline muted
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Scan-Rahmen */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <div style={{
              width: 180, height: 180,
              border: `2.5px solid ${accent}`,
              borderRadius: 14,
              boxShadow: `0 0 0 9999px rgba(4,7,15,0.55), 0 0 24px ${accent}55`,
            }}>
              {/* Ecken-Highlights */}
              {[
                { top: -2, left: -2, borderTop: `3px solid ${accent}`, borderLeft: `3px solid ${accent}`, borderRadius: "4px 0 0 0" },
                { top: -2, right: -2, borderTop: `3px solid ${accent}`, borderRight: `3px solid ${accent}`, borderRadius: "0 4px 0 0" },
                { bottom: -2, left: -2, borderBottom: `3px solid ${accent}`, borderLeft: `3px solid ${accent}`, borderRadius: "0 0 0 4px" },
                { bottom: -2, right: -2, borderBottom: `3px solid ${accent}`, borderRight: `3px solid ${accent}`, borderRadius: "0 0 4px 0" },
              ].map((s, i) => (
                <div key={i} style={{ position: "absolute", width: 22, height: 22, ...s }} />
              ))}
            </div>
          </div>
          {/* Scan-Linie */}
          <div style={{
            position: "absolute",
            left: "calc(50% - 90px)", right: "calc(50% - 90px)",
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            animation: "qr-scan-line 2s ease-in-out infinite",
          }} />
        </div>
      )}

      {camState === "requesting" && (
        <div style={{
          width: 320, height: 320, borderRadius: 16,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 12,
        }}>
          <div style={{
            width: 32, height: 32,
            border: `3px solid rgba(255,255,255,0.08)`,
            borderTopColor: accent,
            borderRadius: "50%",
            animation: "qr-spin 0.8s linear infinite",
          }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(239,237,231,0.3)", letterSpacing: "0.1em" }}>
            Kamera…
          </span>
        </div>
      )}

      {camState === "denied" && (
        <div style={{
          width: 320, borderRadius: 16,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "2rem 1.5rem",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 12, textAlign: "center",
        }}>
          <div style={{ fontSize: "2rem", opacity: 0.4 }}>📷</div>
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.82rem", color: "rgba(239,237,231,0.5)", lineHeight: 1.5,
          }}>
            Kamera nicht verfügbar.<br />
            Bitte Hardware-Barcode-Scanner verwenden.
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(239,237,231,0.3)",
        textAlign: "center",
      }}>
        {label}
      </div>

      <style>{`
        @keyframes qr-spin      { to { transform: rotate(360deg); } }
        @keyframes qr-scan-line {
          0%   { top: calc(50% - 90px); opacity: 1; }
          50%  { top: calc(50% + 90px); opacity: 1; }
          100% { top: calc(50% - 90px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
