import { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";

// Kiosk-QR-Scanner: Kamera + Hardware-Barcode-Scanner (Keyboard-Emulation)
// Ruft onScan(payload) auf, wenn ein gültiger QR-Code erkannt wird.
export default function QrScannerStation({ onScan, accent = "#c5a572", label = "Mitarbeiterausweis scannen", disabled = false }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef    = useRef(null);
  const lastScanTs = useRef(0);
  const kbBuf     = useRef("");
  const kbTimer   = useRef(null);

  const [camState, setCamState] = useState("requesting"); // requesting | active | denied
  const [detected, setDetected] = useState(false);        // brief flash when QR found

  const triggerScan = useCallback((payload) => {
    const now = Date.now();
    if (now - lastScanTs.current < 2500) return;
    lastScanTs.current = now;
    setDetected(true);
    setTimeout(() => setDetected(false), 400);
    onScan(payload.trim());
  }, [onScan]);

  // Camera start — try environment-facing first, fall back to any available camera.
  // Using { ideal: "environment" } instead of a hard constraint avoids failures on
  // desktop kiosks that have only a single front-facing webcam.
  useEffect(() => {
    if (disabled) return;
    let alive = true;

    async function startCamera() {
      try {
        return await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width:  { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        // Fallback: accept whatever camera the device has
        return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
    }

    startCamera()
      .then(stream => {
        if (!alive) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        // Don't assign to videoRef here — the <video> element is only rendered
        // after setCamState("active") triggers a re-render. The stream is attached
        // in the separate useEffect below that runs once camState becomes "active".
        setCamState("active");
      })
      .catch(() => { if (alive) setCamState("denied"); });

    return () => {
      alive = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(rafRef.current);
    };
  }, [disabled]);

  // Attach the stream to the <video> element once it's in the DOM.
  // This runs after React renders the video element (camState === "active"),
  // which is why it can't be done inside the camera-start effect above.
  useEffect(() => {
    if (camState !== "active" || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch(() => {});
  }, [camState]);

  // RAF scan loop — runs at ~30 fps to keep CPU reasonable.
  // inversionAttempts: "attemptBoth" catches inverted QR codes (white on dark background,
  // or when camera exposure flips perceived contrast on a phone screen).
  useEffect(() => {
    if (camState !== "active") return;
    let frame = 0;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      // Only process every other frame (~30 fps instead of 60) to reduce CPU load
      if (++frame % 2 !== 0) return;
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== 4) return;
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
      if (code?.data) triggerScan(code.data);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [camState, triggerScan]);

  // Hardware barcode scanner (USB/Bluetooth, keyboard-emulation: characters → Enter)
  useEffect(() => {
    if (disabled) return;
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
  }, [triggerScan, disabled]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>

      {/* ── Camera view ─────────────────────────────────────────────────── */}
      {camState === "active" && (
        <div style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          width: "100%", maxWidth: 480,
          aspectRatio: "4/3",
          background: "#000",
          boxShadow: detected
            ? `0 0 0 3px ${accent}, 0 0 32px ${accent}55`
            : "0 0 0 1px rgba(255,255,255,0.08)",
          transition: "box-shadow 0.15s",
        }}>
          {/* Live camera feed */}
          <video
            ref={videoRef}
            autoPlay playsInline muted
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {/* Dark overlay + scan frame */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            {/* Outer dim */}
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(4,4,15,0.35)",
              maskImage: "radial-gradient(ellipse 200px 200px at center, transparent 60%, black 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 200px 200px at center, transparent 60%, black 100%)",
            }} />

            {/* Scan frame */}
            <div style={{
              position: "relative",
              width: 200, height: 200,
              border: `2px solid ${detected ? accent : "rgba(255,255,255,0.5)"}`,
              borderRadius: 16,
              transition: "border-color 0.15s",
            }}>
              {/* Corner marks */}
              {[
                { top: -2,   left: -2,  borderTop:    `3px solid ${accent}`, borderLeft:   `3px solid ${accent}`, borderRadius: "6px 0 0 0" },
                { top: -2,   right: -2, borderTop:    `3px solid ${accent}`, borderRight:  `3px solid ${accent}`, borderRadius: "0 6px 0 0" },
                { bottom: -2, left: -2, borderBottom: `3px solid ${accent}`, borderLeft:   `3px solid ${accent}`, borderRadius: "0 0 0 6px" },
                { bottom: -2, right: -2, borderBottom:`3px solid ${accent}`, borderRight:  `3px solid ${accent}`, borderRadius: "0 0 6px 0" },
              ].map((s, i) => (
                <div key={i} style={{ position: "absolute", width: 24, height: 24, ...s }} />
              ))}

              {/* Scan line */}
              <div style={{
                position: "absolute",
                left: 4, right: 4,
                height: 2,
                top: "calc(50% - 100px)",
                background: `linear-gradient(90deg, transparent, ${accent}cc, transparent)`,
                animation: "qr-scan-line 2s ease-in-out infinite",
                borderRadius: 2,
              }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Requesting permission ─────────────────────────────────────── */}
      {camState === "requesting" && (
        <div style={{
          width: "100%", maxWidth: 480, aspectRatio: "4/3", borderRadius: 20,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
        }}>
          <div style={{
            width: 36, height: 36,
            border: `3px solid rgba(255,255,255,0.08)`,
            borderTopColor: accent,
            borderRadius: "50%",
            animation: "qr-spin 0.8s linear infinite",
          }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(239,237,231,0.3)", letterSpacing: "0.1em" }}>
            Kamera wird geöffnet…
          </span>
        </div>
      )}

      {/* ── Camera denied / unavailable ──────────────────────────────── */}
      {camState === "denied" && (
        <div style={{
          width: "100%", maxWidth: 480, borderRadius: 20,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "2.5rem 1.5rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center",
        }}>
          <div style={{ fontSize: "2.5rem", opacity: 0.4 }}>📷</div>
          <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(239,237,231,0.5)", lineHeight: 1.6 }}>
            Kamerazugriff nicht möglich.<br />
            <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              Bitte Kamerazugriff im Browser erlauben oder<br />Hardware-Barcode-Scanner verwenden.
            </span>
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
        @keyframes qr-spin { to { transform: rotate(360deg); } }
        @keyframes qr-scan-line {
          0%   { top: 4px;           opacity: 0.9; }
          50%  { top: calc(100% - 6px); opacity: 0.9; }
          100% { top: 4px;           opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
