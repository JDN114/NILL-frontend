// src/components/accounting/InvoiceList.jsx
import React from "react";
import api from "../../services/api";

export default function InvoiceList({ invoices, setInvoices }) {

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return <p className="text-gray-400 text-sm">Keine Rechnungen vorhanden</p>;
  }

  const togglePaid = async (invoice) => {

    const newStatus =
      invoice.payment_status === "paid" ? "unpaid" : "paid";

    // 🔹 Sofort UI aktualisieren
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id
          ? { ...inv, payment_status: newStatus }
          : inv
      )
    );

    try {

      const endpoint =
        newStatus === "paid"
          ? `/accounting/invoices/${invoice.id}/mark-paid`
          : `/accounting/invoices/${invoice.id}/mark-unpaid`;

      await api.post(endpoint);

    } catch (err) {

      console.error("Status update failed", err);

      // 🔹 rollback falls API fehlschlägt
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoice.id
            ? { ...inv, payment_status: invoice.payment_status }
            : inv
        )
      );

    }
  };

  const deleteInvoice = async (invoice) => {

    // 🔹 Sofort aus UI entfernen
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id));

    try {

      await api.delete(`/accounting/invoices/${invoice.id}`);

    } catch (err) {

      console.error("Delete failed", err);

      // 🔹 rollback
      setInvoices((prev) => [...prev, invoice]);

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

          {invoices.map((inv, idx) => {

            const paid = inv.payment_status === "paid";

            return (
              <tr
                key={inv.id}
                className="border-b border-gray-700 hover:bg-gray-900 transition"
              >

                <td className="px-4 py-2">{idx + 1}</td>

                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span>{inv.title || "-"}</span>
                    {inv.category && (
                      <span className="text-xs text-gray-400">
                        {inv.category}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-2">{inv.vendor || "-"}</td>

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
                      paid
                        ? "bg-green-600 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {paid ? "Bezahlt" : "Offen"}
                  </span>

                </td>

                <td className="px-4 py-2 flex gap-2">

                  {!paid ? (
                    <button
                      onClick={() => togglePaid(inv)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
                    >
                      Als bezahlt markieren
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteInvoice(inv)}
                      className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Rechnung löschen
                    </button>
                  )}

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}
