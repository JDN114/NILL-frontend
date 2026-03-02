// src/components/accounting/ReceiptDropzone.jsx
export default function ReceiptDropzone({ onFileSelected, loading }) {
  return (
    <label className="border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={loading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
      <p className="text-gray-300 mb-2">
        {loading ? "Analysiere Beleg…" : "Beleg hochladen oder Foto aufnehmen"}
      </p>
      <p className="text-xs text-gray-500">
        JPG, PNG oder WEBP – max. 10MB
      </p>
    </label>
  );
}
