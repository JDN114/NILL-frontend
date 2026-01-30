import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import InvoiceCreateModal from "../components/accounting/InvoiceCreateModal";
import api from "../services/api";

export default function AccountingPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/accounting/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
      setError("Rechnungen konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Buchhaltung</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          Neue Rechnung
        </button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <Card>
        {loading ? (
          <p className="text-gray-400">Lade Rechnungen…</p>
        ) : invoices.length === 0 ? (
          <p className="text-gray-400">Noch keine Rechnungen</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th>Nr.</th>
                <th>Betrag</th>
                <th>Status</th>
                <th>Fällig</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-800">
                  <td>{inv.invoice_number}</td>
                  <td>{inv.total_amount} €</td>
                  <td>{inv.status}</td>
                  <td>{inv.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <InvoiceCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={loadInvoices}
      />
    </PageLayout>
  );
}
