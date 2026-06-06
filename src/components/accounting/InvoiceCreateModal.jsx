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

        const res = await api.post("/accounting/invoices/from-photo", formData);

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
        const res = await api.post("/accounting/invoices/from-photo", formData);
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

      <div className="ac-form-col" style={{ marginBottom:8 }}>
        <label className="ac-label">Titel *</label>
        <input aria-required="true" className="ac-input" placeholder="z.B. Rechnung Druckerei GmbH" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="ac-form-col" style={{ marginBottom:8 }}>
        <label className="ac-label">Anbieter / Lieferant</label>
        <input className="ac-input" placeholder="Firmenname" value={vendor} onChange={e => setVendor(e.target.value)} />
      </div>
      <div className="ac-form-row" style={{ marginBottom:8 }}>
        <div className="ac-form-col">
          <label className="ac-label">Betrag (€) *</label>
          <input aria-required="true" type="number" className="ac-input ac-mono" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Kategorie</label>
          <input className="ac-input" placeholder="z.B. Bürobedarf" value={category} onChange={e => setCategory(e.target.value)} />
        </div>
      </div>
      <div className="ac-form-col" style={{ marginBottom:8 }}>
        <label className="ac-label">Zahlungsziel</label>
        <input type="date" className="ac-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>
      <div className="ac-form-col" style={{ marginBottom:8 }}>
        <label className="ac-label">Notizen</label>
        <textarea className="ac-input" placeholder="Optionale Anmerkungen" value={notes} onChange={e => setNotes(e.target.value)} style={{ resize:"vertical", minHeight:64 }} />
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:8 }}>
        <button type="button" className="ac-btn ac-btn-ghost" onClick={() => { reset(); onClose?.(); }}>Abbrechen</button>
        <button type="button" className="ac-btn ac-btn-primary" onClick={handleCreateInvoice} disabled={loading}>
          {loading ? "Erstelle…" : "Erstellen"}
        </button>
      </div>
    </Modal>
  );
}
