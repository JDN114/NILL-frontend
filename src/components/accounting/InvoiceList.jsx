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

  const getFileUrl = (inv) => {
    if (!inv?.file_url) return null;
    if (inv.file_url.startsWith("http")) return inv.file_url;
    return `${api.defaults.baseURL}${inv.file_url}`;
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
      setSelectedInvoice(null);
    } catch (e) {
      console.error("mark paid failed", e);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await api.delete(`/accounting/invoices/${id}`);
      onUpdated?.();
      setSelectedInvoice(null);
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
                  className="border-b border-gray-800 cursor-pointer hover:bg-gray-800/40"
                  onClick={() => setSelectedInvoice(inv)}
                >

                  <td className="py-2">
                    {inv.invoice_date
                      ? new Date(inv.invoice_date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{inv.vendor || "-"}</td>

                  <td>
                    {inv.gross_amount
                      ? `${Number(inv.gross_amount).toFixed(2)} €`
                      : inv.amount
                        ? `${Number(inv.amount).toFixed(2)} €`
                        : "-"}
                  </td>

                  <td>
                    {inv.payment_status === "paid" ? (
                      <span className="text-green-400">Bezahlt</span>
                    ) : (
                      <span className="text-yellow-400">Offen</span>
                    )}
                  </td>

                  <td
                    className="text-right space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >

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

      {/* -----------------------------
          MODAL
      ----------------------------- */}

      {selectedInvoice && (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedInvoice(null)}
          />

          <div className="relative z-10 w-[90%] h-[90%] bg-white rounded-lg overflow-hidden shadow-xl flex">

            {/* LEFT */}
            <div className="w-2/3 h-full border-r">

              <div className="p-3 border-b flex justify-between items-center">
                <span className="font-semibold">
                  {selectedInvoice.title}
                </span>

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-red-500 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="w-full h-[calc(100%-50px)]">

                {selectedInvoice.file_type === "application/pdf" ? (
                  <iframe
                    src={getFileUrl(selectedInvoice)}
                    className="w-full h-full"
                  />
                ) : (
                  <img
                    src={getFileUrl(selectedInvoice)}
                    alt="receipt"
                    className="max-h-full mx-auto"
                  />
                )}

              </div>

            </div>

            {/* RIGHT */}
            <div className="w-1/3 h-full p-4 overflow-y-auto bg-gray-50">

              <h3 className="text-lg font-semibold mb-4">Rechnungsdaten</h3>

              <div className="space-y-3 text-sm">

                <Row label="Anbieter" value={selectedInvoice.vendor} />
                <Row label="Kategorie" value={selectedInvoice.category} />
                <Row label="Datum" value={selectedInvoice.invoice_date} />

                <hr />

                <Row
                  label="Netto"
                  value={`${Number(selectedInvoice.amount || 0).toFixed(2)} €`}
                />

                <Row
                  label="MwSt"
                  value={`${Number(selectedInvoice.vat || 0).toFixed(2)} €`}
                />

                <Row
                  label="Brutto"
                  value={`${Number(selectedInvoice.gross_amount || 0).toFixed(2)} €`}
                />

                <Row
                  label="Steuersatz"
                  value={
                    selectedInvoice.vat_rate
                      ? `${selectedInvoice.vat_rate}%`
                      : "-"
                  }
                />

                <hr />

                <Row label="Status" value={selectedInvoice.payment_status} />

                {/* ACTIONS */}
                <div className="pt-4 space-y-2">

                  {selectedInvoice.payment_status !== "paid" && (
                    <button
                      onClick={() => markPaid(selectedInvoice.id)}
                      className="w-full bg-green-600 py-2 rounded text-white"
                    >
                      Als bezahlt markieren
                    </button>
                  )}

                  <button
                    onClick={() => deleteInvoice(selectedInvoice.id)}
                    className="w-full bg-red-600 py-2 rounded text-white"
                  >
                    Löschen
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

// -----------------------------
// Helper
// -----------------------------
function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">
        {value || "-"}
      </span>
    </div>
  );
}
