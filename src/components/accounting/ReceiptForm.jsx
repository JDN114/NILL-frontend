// src/components/accounting/ReceiptForm.jsx
import { useState } from "react";
import api from "../../services/api";

export default function ReceiptForm({ invoice, onSaved, onCancel }) {
  const [form, setForm] = useState(invoice);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch(
        `/accounting/invoices/${form.id}`,
        form
      );
      onSaved(res.data);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        className="bg-gray-800 p-2 rounded"
        value={form.title || ""}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Titel"
      />

      <input
        className="bg-gray-800 p-2 rounded"
        value={form.vendor || ""}
        onChange={(e) => handleChange("vendor", e.target.value)}
        placeholder="Anbieter"
      />

      <input
        type="number"
        className="bg-gray-800 p-2 rounded"
        value={form.amount || ""}
        onChange={(e) => handleChange("amount", e.target.value)}
        placeholder="Betrag"
      />

      <input
        type="date"
        className="bg-gray-800 p-2 rounded"
        value={form.payment_deadline || ""}
        onChange={(e) =>
          handleChange("payment_deadline", e.target.value)
        }
      />

      <input
        className="bg-gray-800 p-2 rounded"
        value={form.category || ""}
        onChange={(e) => handleChange("category", e.target.value)}
        placeholder="Kategorie"
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          Abbrechen
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          {saving ? "Speichern…" : "Speichern"}
        </button>
      </div>
    </div>
  );
}
