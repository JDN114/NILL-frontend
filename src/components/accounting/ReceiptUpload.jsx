import Modal from "../ui/Modal";
import ReceiptDropzone from "./ReceiptDropzone";
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

      // Backend Endpoint für AI-Extraktion + Invoice-Erstellung
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
        <ReceiptDropzone
          onFileSelected={handleUpload}
          loading={loading}
        />
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
