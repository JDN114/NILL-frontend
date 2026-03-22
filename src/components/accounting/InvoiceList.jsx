import { useState, useMemo } from "react";
import api from "../../services/api";

export default function InvoiceList({ invoices = [], onUpdated }) {

  const [sort, setSort] = useState("date_desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // -----------------------------
  // Helpers
  // -----------------------------

  const getDisplayAmount = (inv) => {
    return inv?.gross_amount ?? inv?.amount ?? 0;
  };

  // -----------------------------
  // Filter + Sort
  // -----------------------------

  const processedInvoices = useMemo(() => {

    let data = Array.isArray(invoices) ? [...invoices] : [];

    if (statusFilter !== "all") {
      data = data.filter((i) => i?.payment_status === statusFilter);
    }

    if (vendorFilter.trim()) {
      const q = vendorFilter.toLowerCase();
      data = data.filter((i) =>
        (i?.vendor || "").toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => {

      if (sort === "date_desc") {
        return new Date(b?.invoice_date || 0) - new Date(a?.invoice_date || 0);
      }

      if (sort === "date_asc") {
        return new Date(a?.invoice_date || 0) - new Date(b?.invoice_date || 0);
      }

      if (sort === "amount_desc") {
        return getDisplayAmount(b) - getDisplayAmount(a);
      }

      if (sort === "amount_asc") {
        return getDisplayAmount(a) - getDisplayAmount(b);
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
      setSelectedInvoice(null);
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          <option value="all">Alle</option>
          <option value="paid">Bezahlt</option>
          <option value="unpaid">Unbezahlt</option>
        </select>

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

                <tr
                  key={inv.id}
                  className="border-b border-gray-800 hover:bg-gray-900 cursor-pointer"
                  onClick={() => setSelectedInvoice(inv)}
                >

                  <td className="py-2">
                    {inv.invoice_date
                      ? new Date(inv.invoice_date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{inv.vendor || "-"}</td>

                  <td>
                    {getDisplayAmount(inv).toFixed(2)} €
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
                        onClick={(e) => {
                          e.stopPropagation();
                          markPaid(inv.id);
                        }}
                        className="bg-green-600 px-2 py-1 rounded text-xs"
                      >
                        Bezahlt
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteInvoice(inv.id);
                      }}
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

      {/* MODAL */}

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-zinc-900 w-[900px] max-w-[95%] rounded-xl shadow-lg overflow-hidden flex">

            {/* LEFT: PDF */}

            <div className="w-1/2 border-r border-zinc-800">

              {selectedInvoice.file_url ? (
                <iframe
                  src={`${api.defaults.baseURL}${selectedInvoice.file_url}`}
                  className="w-full h-[500px]"
                />
              ) : (
                <div className="p-6 text-gray-400">
                  Keine Datei vorhanden
                </div>
              )}

            </div>

            {/* RIGHT: DETAILS */}

            <div className="w-1/2 p-6 text-sm text-white space-y-3">

              <h2 className="text-lg font-semibold mb-2">
                {selectedInvoice.title}
              </h2>

              <p><b>Anbieter:</b> {selectedInvoice.vendor || "-"}</p>
              <p><b>Kategorie:</b> {selectedInvoice.category || "-"}</p>

              <div className="pt-2 border-t border-zinc-700 space-y-1">

                <p><b>Netto:</b> {selectedInvoice.net_amount?.toFixed?.(2) || "-"} €</p>
                <p><b>Steuer:</b> {selectedInvoice.vat?.toFixed?.(2) || "-"} €</p>
                <p className="text-green-400 font-semibold">
                  <b>Brutto:</b> {getDisplayAmount(selectedInvoice).toFixed(2)} €
                </p>

              </div>

              <p><b>Datum:</b> {selectedInvoice.invoice_date}</p>

              <p>
                <b>Status:</b>{" "}
                {selectedInvoice.payment_status === "paid"
                  ? "Bezahlt"
                  : "Offen"}
              </p>

              {/* ACTIONS */}

              <div className="flex gap-2 pt-4">

                {selectedInvoice.payment_status !== "paid" && (
                  <button
                    onClick={() => markPaid(selectedInvoice.id)}
                    className="bg-green-600 px-3 py-1 rounded text-sm"
                  >
                    Als bezahlt markieren
                  </button>
                )}

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="bg-gray-700 px-3 py-1 rounded text-sm"
                >
                  Schließen
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>

  );

}
