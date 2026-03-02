// src/components/accounting/InvoiceCreateModal.jsx
import React, { useState } from "react";
import Modal from "../ui/Modal";
import api from "../../services/api";

export default function InvoiceCreateModal(props) {
  const open = props.open;
  const onClose = props.onClose;
  const onCreated = props.onCreated;

  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) {
    return null;
  }

  const handleCreate = async function () {
    if (!title || !amount) {
      setError("Titel und Betrag sind erforderlich");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post("/accounting/invoices", {
        title: title,
        vendor: vendor,
        category: category,
        amount: parseFloat(amount),
        currency: "EUR",
        invoice_date: new Date().toISOString().slice(0, 10),
        payment_deadline: dueDate ? dueDate : null,
        notes: notes,
      });

      if (onCreated) {
        onCreated();
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Create invoice error:", err);
      setError("Rechnung konnte nicht erstellt werden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Neue Rechnung">
      <div className="space-y-4">

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={function (e) { setTitle(e.target.value); }}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <input
          type="text"
          placeholder="Anbieter"
          value={vendor}
          onChange={function (e) { setVendor(e.target.value); }}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <input
          type="text"
          placeholder="Kategorie"
          value={category}
          onChange={function (e) { setCategory(e.target.value); }}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <input
          type="number"
          placeholder="Betrag (€)"
          value={amount}
          onChange={function (e) { setAmount(e.target.value); }}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <input
          type="date"
          value={dueDate}
          onChange={function (e) { setDueDate(e.target.value); }}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <textarea
          placeholder="Notizen"
          value={notes}
          onChange={function (e) { setNotes(e.target.value); }}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded"
          >
            Abbrechen
          </button>

          <button
            type="button"
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
