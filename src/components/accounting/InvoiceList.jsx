// src/components/accounting/InvoiceList.jsx
import React from "react";

export default function InvoiceList({ invoices }) {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return <p className="text-gray-400 text-sm">Keine Rechnungen vorhanden</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 text-gray-200">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Rechnungsdatum</th>
            <th className="px-4 py-2">Kunde</th>
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
                {inv.date ? new Date(inv.date).toLocaleDateString() : "-"}
              </td>
              <td className="px-4 py-2">{inv.client || "-"}</td>
              <td className="px-4 py-2">
                {inv.amount ? `${inv.amount.toFixed(2)} €` : "-"}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    inv.status === "paid"
                      ? "bg-green-600 text-white"
                      : inv.status === "pending"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {inv.status || "Unbekannt"}
                </span>
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm">
                  Ansehen
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm">
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
