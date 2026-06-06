// src/components/accounting/ReceiptDropzone.jsx
import { useRef, useState, useCallback } from "react";

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

// Read first 12 bytes and verify against known magic signatures.
// file.type is browser-supplied from the filename extension and can be spoofed.
function checkMagicBytes(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const b = new Uint8Array(e.target.result);
      const isPdf  = b[0]===0x25 && b[1]===0x50 && b[2]===0x44 && b[3]===0x46;
      const isJpeg = b[0]===0xFF && b[1]===0xD8;
      const isPng  = b[0]===0x89 && b[1]===0x50 && b[2]===0x4E && b[3]===0x47;
      const isWebp = b[0]===0x52 && b[1]===0x49 && b[2]===0x46 && b[3]===0x46 &&
                     b[8]===0x57 && b[9]===0x45 && b[10]===0x42 && b[11]===0x50;
      resolve(isPdf || isJpeg || isPng || isWebp);
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
}

export default function ReceiptDropzone({ onFileSelected, loading }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Nur PDF, JPG, PNG oder WEBP Dateien erlaubt.");
      return;
    }
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      alert(`Datei darf maximal ${MAX_FILE_SIZE_MB} MB groß sein.`);
      return;
    }
    const valid = await checkMagicBytes(file);
    if (!valid) {
      alert("Ungültiger Dateityp – bitte nur echte PDF-, JPG-, PNG- oder WEBP-Dateien hochladen.");
      return;
    }
    onFileSelected(file);
  }, [onFileSelected]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Beleg hochladen – Datei hierher ziehen oder Enter drücken"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition
        ${dragOver ? "border-blue-500 bg-gray-800" : "border-gray-600 bg-gray-900"}
      `}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); }
      }}
    >
      {/* Unsichtbares Input für Button/Click */}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="hidden"
        disabled={loading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <p className="text-gray-300 mb-2">
        {loading ? "Analysiere Beleg…" : "Beleg hochladen oder Foto aufnehmen"}
      </p>
      <p className="text-xs text-gray-500">
        JPG, PNG, WEBP oder PDF – max. {MAX_FILE_SIZE_MB}MB
      </p>

      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Datei auswählen
      </button>
    </div>
  );
}
