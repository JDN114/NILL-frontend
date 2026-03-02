// src/components/accounting/ReceiptUploadModal.jsx
import Modal from "../ui/Modal";
import ReceiptForm from "./ReceiptForm";
import { useState } from "react";
import api from "../../services/api";

export default function ReceiptUploadModal({ open, onClose, onCreated }) {
  const [file, setFile] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleUpload = async (selectedFile) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await api.post("/accounting/invoices/from-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setInvoice(res.data); // AI-extracted + created invoice
      setFile(selectedFile);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail || "Beleg konnte nicht verarbeitet werden."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    handleUpload(e.target.files[0]);
  };

  const handleClose = () => {
    setFile(null);
    setInvoice(null);
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Beleg scannen">
      {error && (
        <div className="text-red-500 bg-red-500/10 p-2 rounded text-sm mb-3">
          {error}
        </div>
      )}

      {!invoice ? (
        <div className="flex flex-col gap-4 items-center">
          {/* Datei-Auswahl Button */}
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
            Datei auswählen
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>

          <p className="text-gray-400 text-sm">oder ziehe die Datei hierher</p>
        </div>
      ) : (
        <ReceiptForm
          invoice={invoice}
          onSaved={(updatedInvoice) => {
            onCreated?.(updatedInvoice);
            handleClose();
          }}
          onCancel={handleClose}
        />
      )}
    </Modal>
  );
}
