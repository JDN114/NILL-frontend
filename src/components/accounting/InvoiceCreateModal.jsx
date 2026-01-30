import { useState } from "react";
import Modal from "../ui/Modal";
import api from "../../services/api";

export default function InvoiceCreateModal({ open, onClose, onCreated }) {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleCreate = async () => {
    if (!customerId || !amount || !dueDate) return;

    try {
      setLoading(true);
      await api.post("/accounting/invoices", {
        customer_id: customerId,
        issue_date: new Date().toISOString().slice(0, 10),
        due_date: dueDate,
        total_amount: amount,
      });

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Rechnung konnte nicht erstellt werden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Neue Rechnung">
      <div className="space-y-4">
        {error && <p className="text-red-400">{error}</p>}

        <input
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <input
          placeholder="Betrag (€)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-700 px-4 py-2 rounded">
            Abbrechen
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            {loading ? "Erstelle…" : "Erstellen"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
