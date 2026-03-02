// src/components/accounting/InvoiceList.jsx
import React from "react";
import api from "../../services/api";

export default function InvoiceList({ invoices, onUpdated }) {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        Keine Rechnungen vorhanden
      </p>
    );
  }

  const togglePaid = async (invoice) => {
    try {
      const endpoint = invoice.paid
        ? `/accounting/invoices/${invoice.id}/mark-unpaid`
        : `/accounting/invoices/${invoice.id}/mark-paid`;

      const res = await api.post(endpoint);
      onUpdated?.(res.data);
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 text-gray-200">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Titel</th>
            <th className="px-4 py-2">Anbieter</th>
            <th className="px-4 py-2">Fällig am</th>
            <th className="px-4 py-2">Betrag</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, idx) => (
            <tr
              key={inv.id}
              className="border-b border-gray-700 hover:bg-gray-900 transition"
            >
              <td className="px-4 py-2">{idx + 1}</td>

              <td className="px-4 py-2">
                {inv.title || "-"}
              </td>

              <td className="px-4 py-2">
                {inv.vendor || "-"}
              </td>

              <td className="px-4 py-2">
                {inv.payment_deadline
                  ? new Date(inv.payment_deadline).toLocaleDateString()
                  : "-"}
              </td>

              <td className="px-4 py-2">
                {typeof inv.amount === "number"
                  ? `${inv.amount.toFixed(2)} €`
                  : "-"}
              </td>

              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    inv.paid
                      ? "bg-green-600 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {inv.paid ? "Bezahlt" : "Offen"}
                </span>
              </td>

              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => togglePaid(inv)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
                >
                  {inv.paid ? "Als offen markieren" : "Als bezahlt markieren"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
