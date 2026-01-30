export default function ReceiptDropzone({ onFileSelected }) {
  return (
    <label className="border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
      <input
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files[0])}
      />
      <p className="text-gray-300 mb-2">Beleg hochladen oder Foto aufnehmen</p>
      <p className="text-xs text-gray-500">
        JPG, PNG oder PDF – max. 10MB
      </p>
    </label>
  );
}
