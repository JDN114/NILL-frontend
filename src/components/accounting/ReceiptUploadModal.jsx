// src/components/accounting/InvoiceUploadModal.jsx
import Modal from "../ui/Modal";
import { useState } from "react";
import api from "../../services/api";

export default function InvoiceUploadModal({ open, onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState(null);

  if (!open) return null;

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/accounting/invoices/from-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setInvoice(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Beleg konnte nicht verarbeitet werden.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleClose = () => {
    setInvoice(null);
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={invoice ? "Upload erfolgreich" : "Rechnung hochladen"}>
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

      {!invoice ? (
        <>
          <label className="cursor-pointer block w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-center
            hover:border-blue-500 hover:bg-gray-800 transition-colors">
            Datei auswählen oder hierher ziehen
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>

          {loading && <p className="mt-2 text-blue-400 text-sm">🤖 KI analysiert den Beleg…</p>}
        </>
      ) : (
        <div className="space-y-2 text-sm text-white">
          <p><b>Titel:</b> {invoice.title}</p>
          <p><b>Anbieter:</b> {invoice.vendor || "-"}</p>
          <p><b>Betrag:</b> {invoice.amount?.toFixed(2) || "-"} €</p>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-gray-700 px-4 py-2 rounded"
              onClick={handleClose}
            >
              Schließen
            </button>
            <button
              className="bg-green-600 px-4 py-2 rounded text-white"
              onClick={() => {
                onCreated?.(invoice);
                handleClose();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
