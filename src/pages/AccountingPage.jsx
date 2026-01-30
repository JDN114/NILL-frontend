// src/pages/AccountingPage.jsx
import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import ExpensePieChart from "../components/accounting/ExpensePieChart";
import InvoiceList from "../components/accounting/InvoiceList";
import ReceiptUpload from "../components/accounting/ReceiptUpload";
import InvoiceCreateModal from "../components/accounting/InvoiceCreateModal";
import api from "../services/api";

export default function AccountingPage() {
  const [stats, setStats] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/accounting/dashboard");
        setStats(res.data?.stats || []); // Default leer
        setInvoices(res.data?.invoices || []);
        setReceipts(res.data?.receipts || []);
      } catch (err) {
        console.error("Accounting fetch error:", err);
        setStats([]);
        setInvoices([]);
        setReceipts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Buchhaltung</h1>

      {/* 📊 Statistik Sektion */}
      <Card className="mb-6 p-4">
        <h2 className="font-semibold mb-2">Ausgaben nach Kategorie</h2>
        {stats.length > 0 ? (
          <ExpensePieChart data={stats} />
        ) : (
          <p className="text-gray-400 text-sm">Keine Daten vorhanden</p>
        )}
      </Card>

      {/* 🧾 Rechnungen */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Rechnungen</h2>
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Neue Rechnung
          </button>
        </div>
        {invoices.length > 0 ? (
          <InvoiceList invoices={invoices} />
        ) : (
          <p className="text-gray-400 text-sm">Noch keine Rechnungen vorhanden</p>
        )}
      </Card>

      {/* 📄 Beleg Upload */}
      <Card className="mb-6 p-4">
        <h2 className="font-semibold mb-2">Belege hochladen</h2>
        <ReceiptUpload
          onUpload={(newReceipt) =>
            setReceipts((prev) => [newReceipt, ...prev])
          }
        />
        {receipts.length > 0 && (
          <div className="mt-4">
            {receipts.map((r) => (
              <div
                key={r.id}
                className="text-sm text-gray-300 border-b border-gray-700 py-1"
              >
                {r.filename}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ✨ Modals */}
      <InvoiceCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(invoice) =>
          setInvoices((prev) => [invoice, ...prev])
        }
      />
    </PageLayout>
  );
}
