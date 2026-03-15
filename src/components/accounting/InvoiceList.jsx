// src/components/accounting/InvoiceList.jsx

import React from "react";
import api from "../../services/api";

export default function InvoiceList({ invoices, onUpdated }) {

  // ---------- SAFE DATA ----------
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  if (safeInvoices.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        Keine Rechnungen vorhanden
      </p>
    );
  }

  // ---------- HELPERS ----------
  const safeDate = (d) => {
    try {
      if (!d) return "-";
      return new Date(d).toLocaleDateString();
    } catch {
      return "-";
    }
  };

  const safeAmount = (a) => {
    try {
      const num = Number(a);
      if (Number.isNaN(num)) return "-";
      return `${num.toFixed(2)} €`;
    } catch {
      return "-";
    }
  };

  // ---------- ACTIONS ----------
  const togglePaid = async (invoice) => {

    try {

      const status = invoice?.payment_status || "unpaid";

      const endpoint =
        status === "paid"
          ? `/accounting/invoices/${invoice.id}/mark-unpaid`
          : `/accounting/invoices/${invoice.id}/mark-paid`;

      await api.post(endpoint);

      onUpdated?.();

    } catch (err) {

      console.error("Status update failed", err);

    }

  };

  const deleteInvoice = async (invoice) => {

    try {

      if (!invoice?.id) return;

      await api.delete(`/accounting/invoices/${invoice.id}`);

      onUpdated?.();

    } catch (err) {

      console.error("Invoice delete failed", err);

    }

  };

  // ---------- RENDER ----------
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

          {safeInvoices
            .filter((inv) => inv && inv.id)
            .map((inv, idx) => {

              try {

                const paid = inv.payment_status === "paid";

                return (

                  <tr
                    key={inv.id || idx}
                    className="border-b border-gray-700 hover:bg-gray-900 transition"
                  >

                    <td className="px-4 py-2">
                      {idx + 1}
                    </td>

                    <td className="px-4 py-2">

                      <div className="flex flex-col">

                        <span>
                          {inv.title || "-"}
                        </span>

                        {inv.category && (
                          <span className="text-xs text-gray-400">
                            {inv.category}
                          </span>
                        )}

                      </div>

                    </td>

                    <td className="px-4 py-2">
                      {inv.vendor || "-"}
                    </td>

                    <td className="px-4 py-2">
                      {safeDate(inv.payment_deadline)}
                    </td>

                    <td className="px-4 py-2">
                      {safeAmount(inv.amount)}
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

              } catch (rowError) {

                console.error("Invoice row crash prevented", rowError);

                return null;

              }

            })}

        </tbody>

      </table>

    </div>

  );

}
