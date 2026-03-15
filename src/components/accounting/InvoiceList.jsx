import { useState, useMemo } from "react";
import api from "../../services/api";

export default function InvoiceList({ invoices = [], onUpdated }) {

  const [sort, setSort] = useState("date_desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("");

  // -----------------------------
  // Filter + Sort
  // -----------------------------

  const processedInvoices = useMemo(() => {

    let data = Array.isArray(invoices) ? [...invoices] : [];

    // Status Filter
    if (statusFilter !== "all") {
      data = data.filter((i) => i?.payment_status === statusFilter);
    }

    // Vendor Filter
    if (vendorFilter.trim()) {
      const q = vendorFilter.toLowerCase();
      data = data.filter((i) =>
        (i?.vendor || "").toLowerCase().includes(q)
      );
    }

    // Sorting
    data.sort((a, b) => {

      if (sort === "date_desc") {
        return new Date(b?.invoice_date || 0) - new Date(a?.invoice_date || 0);
      }

      if (sort === "date_asc") {
        return new Date(a?.invoice_date || 0) - new Date(b?.invoice_date || 0);
      }

      if (sort === "amount_desc") {
        return (b?.amount || 0) - (a?.amount || 0);
      }

      if (sort === "amount_asc") {
        return (a?.amount || 0) - (b?.amount || 0);
      }

      return 0;

    });

    return data;

  }, [invoices, sort, statusFilter, vendorFilter]);

  // -----------------------------
  // Actions
  // -----------------------------

  const markPaid = async (id) => {

    try {

      await api.post(`/accounting/invoices/${id}/mark-paid`);

      onUpdated?.();

    } catch (e) {

      console.error("mark paid failed", e);

    }

  };

  const deleteInvoice = async (id) => {

    try {

      await api.delete(`/accounting/invoices/${id}`);

      onUpdated?.();

    } catch (e) {

      console.error("delete failed", e);

    }

  };

  // -----------------------------
  // Render
  // -----------------------------

  return (

    <div>

      {/* Controls */}

      <div className="flex flex-wrap gap-3 mb-4">

        {/* Sort */}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >

          <option value="date_desc">Datum ↓</option>
          <option value="date_asc">Datum ↑</option>
          <option value="amount_desc">Preis ↓</option>
          <option value="amount_asc">Preis ↑</option>

        </select>

        {/* Status */}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >

          <option value="all">Alle</option>
          <option value="paid">Bezahlt</option>
          <option value="unpaid">Unbezahlt</option>

        </select>

        {/* Vendor Search */}

        <input
          type="text"
          placeholder="Anbieter suchen..."
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        />

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b border-gray-700">

            <tr>

              <th className="text-left py-2">Datum</th>
              <th className="text-left py-2">Anbieter</th>
              <th className="text-left py-2">Betrag</th>
              <th className="text-left py-2">Status</th>
              <th className="text-right py-2">Aktionen</th>

            </tr>

          </thead>

          <tbody>

            {processedInvoices.map((inv) => {

              if (!inv?.id) return null;

              return (

                <tr key={inv.id} className="border-b border-gray-800">

                  <td className="py-2">
                    {inv.invoice_date
                      ? new Date(inv.invoice_date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{inv.vendor || "-"}</td>

                  <td>
                    {inv.amount?.toFixed
                      ? `${inv.amount.toFixed(2)} €`
                      : "-"}
                  </td>

                  <td>

                    {inv.payment_status === "paid" ? (
                      <span className="text-green-400">Bezahlt</span>
                    ) : (
                      <span className="text-yellow-400">Offen</span>
                    )}

                  </td>

                  <td className="text-right space-x-2">

                    {inv.payment_status !== "paid" && (
                      <button
                        onClick={() => markPaid(inv.id)}
                        className="bg-green-600 px-2 py-1 rounded text-xs"
                      >
                        Bezahlt
                      </button>
                    )}

                    <button
                      onClick={() => deleteInvoice(inv.id)}
                      className="bg-red-600 px-2 py-1 rounded text-xs"
                    >
                      Löschen
                    </button>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

}
