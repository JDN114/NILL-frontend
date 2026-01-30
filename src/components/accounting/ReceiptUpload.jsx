// src/components/accounting/ReceiptUpload.jsx
import { useState } from "react";
import api from "../../services/api";

export default function ReceiptUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Nur PDF, JPG oder PNG Dateien erlaubt.");
      return;
    }

    if (selected.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      setError(`Datei darf maximal ${MAX_FILE_SIZE_MB} MB groß sein.`);
      return;
    }

    setError(null);
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const res = await api.post("/accounting/upload-receipt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Callback an Parent
      onUpload?.(res.data);

      setFile(null);
    } catch (err) {
      console.error("Receipt upload error:", err);
      setError(
        err?.response?.data?.message || "Beleg konnte nicht hochgeladen werden."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">
          {error}
        </div>
      )}

      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
        onChange={handleFileChange}
        disabled={uploading}
        className="text-sm text-gray-300"
      />

      {file && (
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
          <span className="truncate">{file.name}</span>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            {uploading ? "Upload…" : "Hochladen"}
          </button>
        </div>
      )}
    </div>
  );
}
