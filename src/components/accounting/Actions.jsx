export default function AccountingActions({ onRefresh }) {
  return (
    <div className="flex gap-4 mt-6">
      <button className="bg-blue-600 px-4 py-2 rounded text-white">
        ➕ Neue Rechnung
      </button>

      <button className="bg-green-600 px-4 py-2 rounded text-white">
        📸 Beleg scannen
      </button>
    </div>
  );
}
