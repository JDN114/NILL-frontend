export default function ReceiptForm({ file, extracted, onCancel }) {
  const [amount, setAmount] = useState(extracted?.amount || "");
  const [category, setCategory] = useState(extracted?.category || "");

  const handleSave = async () => {
    // 🔌 später:
    // POST /accounting/receipts
  };

  return (
    <div className="space-y-4">
      <img
        src={URL.createObjectURL(file)}
        alt="Beleg"
        className="rounded max-h-64 mx-auto"
      />

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Betrag"
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
      >
        <option>Haushalt</option>
        <option>Geschäftlich</option>
        <option>Kind</option>
        <option>Sonstiges</option>
      </select>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded">
          Abbrechen
        </button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded">
          Speichern
        </button>
      </div>
    </div>
  );
}
