// src/components/accounting/InvoiceCreateModal.jsx
import { useState, useRef, useCallback } from "react";
import Modal from "../ui/Modal";
import api from "../../services/api";

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export default function InvoiceCreateModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [file, setFile] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setTitle(""); setVendor(""); setCategory(""); setAmount(""); setDueDate(""); setNotes("");
    setFile(null); setInvoice(null); setError(null); setLoading(false);
  };

  const handleUploadFile = useCallback(
    async (selectedFile) => {
      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        setError("Nur PDF, JPG, PNG oder WEBP erlaubt.");
        return;
      }
      if (selectedFile.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
        setError(`Datei darf maximal ${MAX_FILE_SIZE_MB} MB groß sein.`);
        return;
      }

      setFile(selectedFile);
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await api.post("/accounting/invoices/from-photo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setInvoice(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.detail || "Beleg konnte nicht verarbeitet werden."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleCreateInvoice = async () => {
    if (!title || !amount) {
      setError("Titel und Betrag sind erforderlich");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        title, vendor, category,
        amount: parseFloat(amount),
        currency: "EUR",
        invoice_date: new Date().toISOString().slice(0, 10),
        payment_deadline: dueDate || null,
        notes,
      };
      if (file && !invoice) {
        // Wenn Datei hochgeladen, AI erstellt invoice
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post("/accounting/invoices/from-photo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onCreated?.(res.data);
      } else {
        const res = await api.post("/accounting/invoices", payload);
        onCreated?.(res.data);
      }
      reset();
      onClose?.();
    } catch (err) {
      console.error(err);
      setError("Rechnung konnte nicht erstellt werden.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={() => { reset(); onClose?.(); }} title="Neue Rechnung">
      {error && <p className="text-red-400">{error}</p>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleUploadFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer mb-3
          ${dragOver ? "border-blue-500 bg-gray-800" : "border-gray-600 bg-gray-900"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="hidden"
          disabled={loading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUploadFile(f);
          }}
        />
        <p className="text-gray-300">
          {loading ? "Analysiere Beleg…" : "Beleg hochladen oder Foto auswählen"}
        </p>
        <p className="text-xs text-gray-500">JPG, PNG, WEBP oder PDF – max. 10MB</p>
      </div>

      <input placeholder="Titel" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white mb-2" />
      <input placeholder="Anbieter" value={vendor} onChange={e => setVendor(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white mb-2" />
      <input placeholder="Kategorie" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white mb-2" />
      <input type="number" placeholder="Betrag (€)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white mb-2" />
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white mb-2" />
      <textarea placeholder="Notizen" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white mb-2" />

      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={() => { reset(); onClose?.(); }} className="bg-gray-700 px-4 py-2 rounded">Abbrechen</button>
        <button type="button" onClick={handleCreateInvoice} disabled={loading} className="bg-blue-600 px-4 py-2 rounded text-white">
          {loading ? "Erstelle…" : "Erstellen"}
        </button>
      </div>
    </Modal>
  );
}
