// src/components/accounting/ReceiptDropzone.jsx
import { useRef, useState, useCallback } from "react";

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export default function ReceiptDropzone({ onFileSelected, loading }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    []
  );

  const handleFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Nur PDF, JPG, PNG oder WEBP Dateien erlaubt.");
      return;
    }
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      alert(`Datei darf maximal ${MAX_FILE_SIZE_MB} MB groß sein.`);
      return;
    }
    onFileSelected(file);
  };

  return (
    <div
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
