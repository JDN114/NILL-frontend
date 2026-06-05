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

      const res = await api.post("/accounting/invoices/from-photo", formData);

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
        <div style={{ display:"flex", flexDirection:"column", gap:16, alignItems:"center" }}>
          <label
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) { handleFileChange({ target: { files: [f] } }); }
            }}
            style={{
              border:"2px dashed var(--border)", borderRadius:12,
              padding:"28px 40px", textAlign:"center", cursor:"pointer",
              width:"100%", boxSizing:"border-box",
            }}
          >
            <div style={{ fontSize:"1.8rem", marginBottom:8 }}>📁</div>
            <div style={{ fontWeight:600, marginBottom:4 }}>
              {loading ? "Analysiere Beleg…" : "Datei auswählen oder hierher ziehen"}
            </div>
            <div style={{ fontSize:".8rem", color:"var(--ink2)" }}>
              JPG, PNG, WEBP oder PDF · max. 20 MB
            </div>
            <input
              type="file"
              accept="image/*,application/pdf"
              style={{ display:"none" }}
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
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
