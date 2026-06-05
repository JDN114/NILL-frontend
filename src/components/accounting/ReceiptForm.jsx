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
      const res = await api.patch(`/accounting/invoices/${form.id}`, form);
      onSaved(res.data);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div className="ac-form-col">
        <label className="ac-label">Titel</label>
        <input className="ac-input" value={form.title || ""} placeholder="z.B. Rechnung Druckerei GmbH"
          onChange={e => handleChange("title", e.target.value)} />
      </div>
      <div className="ac-form-col">
        <label className="ac-label">Anbieter / Lieferant</label>
        <input className="ac-input" value={form.vendor || ""} placeholder="Firmenname des Absenders"
          onChange={e => handleChange("vendor", e.target.value)} />
      </div>
      <div className="ac-form-col">
        <label className="ac-label">Betrag (€)</label>
        <input type="number" className="ac-input ac-mono" value={form.amount || ""} placeholder="0,00"
          onChange={e => handleChange("amount", e.target.value)} />
      </div>
      <div className="ac-form-col">
        <label className="ac-label">Zahlungsziel</label>
        <input type="date" className="ac-input" value={form.payment_deadline || ""}
          onChange={e => handleChange("payment_deadline", e.target.value)} />
      </div>
      <div className="ac-form-col">
        <label className="ac-label">Kategorie</label>
        <input className="ac-input" value={form.category || ""} placeholder="z.B. Bürobedarf, Reise, Software"
          onChange={e => handleChange("category", e.target.value)} />
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:8 }}>
        <button className="ac-btn ac-btn-ghost" onClick={onCancel}>Abbrechen</button>
        <button className="ac-btn ac-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Speichere…" : "Speichern"}
        </button>
      </div>
    </div>
  );
}
