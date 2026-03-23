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
  const getGross = (inv) => inv?.gross_amount ?? inv?.amount ?? 0;
  const getNet = (inv) => inv?.net_amount ?? inv?.amount ?? 0;
  const getVat = (inv) => inv?.vat_amount ?? inv?.vat ?? 0;

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
      if (sort === "date_desc") return new Date(b?.invoice_date || 0) - new Date(a?.invoice_date || 0);
      if (sort === "date_asc") return new Date(a?.invoice_date || 0) - new Date(b?.invoice_date || 0);
      if (sort === "amount_desc") return getGross(b) - getGross(a);
      if (sort === "amount_asc") return getGross(a) - getGross(b);
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
          <option value="amount_desc">Betrag ↓</option>
          <option value="amount_asc">Betrag ↑</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          <option value="all">Alle</option>
          <option value="paid">Bezahlt</option>
          <option value="unpaid">Offen</option>
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
              <th className="text-left py-2">Brutto</th>
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
                    {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : "-"}
                  </td>
                  <td>{inv.vendor || "-"}</td>
                  <td>{getGross(inv).toFixed(2)} €</td>
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

      {/* Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelectedInvoice(null)}
          />
          <div className="relative z-10 bg-gray-900 text-white w-[700px] max-h-[85vh] overflow-y-auto rounded-xl p-6 shadow-xl border border-gray-700">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{selectedInvoice.title}</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-gray-400">Anbieter</p>
                <p>{selectedInvoice.vendor || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400">Datum</p>
                <p>{selectedInvoice.invoice_date ? new Date(selectedInvoice.invoice_date).toLocaleDateString() : "-"}</p>
              </div>
              <div>
                <p className="text-gray-400">Brutto</p>
                <p>{getGross(selectedInvoice).toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-gray-400">Netto</p>
                <p>{getNet(selectedInvoice).toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-gray-400">MwSt</p>
                <p>{getVat(selectedInvoice).toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-gray-400">MwSt Satz</p>
                <p>{selectedInvoice.vat_rate || "-"}%</p>
              </div>
            </div>

            {/* File Preview */}
            {selectedInvoice.file_url && (
              <div className="mb-6">
                <iframe
                  src={`${api.defaults.baseURL}${selectedInvoice.file_url}`}
                  className="w-full h-[300px] rounded border border-gray-700"
                  title="Rechnung"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {selectedInvoice.payment_status !== "paid" && (
                <button
                  onClick={() => markPaid(selectedInvoice.id)}
                  className="bg-green-600 px-4 py-2 rounded text-sm"
                >
                  Als bezahlt markieren
                </button>
              )}
              <button
                onClick={() => deleteInvoice(selectedInvoice.id)}
                className="bg-red-600 px-4 py-2 rounded text-sm"
              >
                Löschen
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
