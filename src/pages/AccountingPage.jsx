import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import InvoiceList from "../components/accounting/InvoiceList";
import ReceiptUploadModal from "../components/accounting/ReceiptUpload";
import InvoiceCreateModal from "../components/accounting/InvoiceCreateModal";
import api from "../services/api";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function AccountingPage() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [bankStatus, setBankStatus] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const buildMonthly = (data) => {
    const map = {};
    data.forEach((i) => {
      if (!i.invoice_date) return;
      const d = new Date(i.invoice_date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!map[key]) map[key] = 0;
      map[key] += i.amount;
    });
    return Object.entries(map).map(([k, v]) => ({
      month: k,
      total: v,
    }));
  };

  const loadData = async () => {
    try {
      const invoicesRes = await api.get("/accounting/invoices");
      setInvoices(invoicesRes.data);
      setMonthly(buildMonthly(invoicesRes.data));
    } catch (e) {
      console.error("invoice load failed", e);
    }

    try {
      const statsRes = await api.get("/accounting/stats");
      const s = statsRes.data;
      setStats([
        { label: "Total", value: s.total_amount },
        { label: "Unpaid", value: s.unpaid_count },
        { label: "Overdue", value: s.overdue_count },
        { label: "Categories", value: s.by_category?.length || 0 },
      ]);
    } catch (e) {
      console.error("stats failed", e);
    }

    try {
      const catRes = await api.get("/accounting/category-stats");
      setCategories(catRes.data);
    } catch (e) {
      console.error("category stats failed", e);
    }

    try {
      const bankRes = await api.get("/bank/status");
      setBankStatus(bankRes.data);
    } catch (e) {
      console.warn("bank status not available");
    }
  };

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    if (params.get("bank") === "connected") {

      console.log("Bank successfully connected");

      // sofort Bankstatus neu laden
      loadData();

      // URL säubern (Parameter entfernen)
      window.history.replaceState({}, document.title, "/accounting");
    }

    loadData();

    const interval = setInterval(loadData, 15000);

    return () => clearInterval(interval);

  }, []);

  // Browser redirect zum Backend-Endpoint
  const connectBank = () => {
    window.location.href = `${api.defaults.baseURL}/bank/connect`;
  };

  const disconnectBank = async () => {
    try {
      await api.post("/bank/disconnect");
      loadData();
    } catch (e) {
      console.error("disconnect failed", e);
    }
  };

  const exportDATEV = () => {
    window.open(`${api.defaults.baseURL}/tax/export/datev`, "_blank");
  };

  const overdue = invoices.filter(
    (i) =>
      i.payment_deadline &&
      i.payment_status === "unpaid" &&
      new Date(i.payment_deadline) < new Date()
  );

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Buchhaltung</h1>

      {overdue.length > 0 && (
        <div className="bg-red-900 p-4 rounded mb-6">
          ⚠️ {overdue.length} überfällige Rechnungen
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <Card key={i} className="p-4">
            <p className="text-sm text-gray-400">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Bank Integration */}
      <Card className="mb-6 p-4">
        <h2 className="font-semibold mb-4">Bank Verbindung</h2>
        {bankStatus?.connected ? (
          <div className="flex justify-between items-center">
            <p className="text-green-400">Bank verbunden</p>
            <button
              onClick={disconnectBank}
              className="bg-red-600 px-3 py-1 rounded text-sm"
            >
              Trennen
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Keine Bank verbunden</p>
            <button
              onClick={connectBank}
              className="bg-blue-600 px-3 py-1 rounded text-sm"
            >
              Bank verbinden
            </button>
          </div>
        )}
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="mb-4 font-semibold">Kategorie Ausgaben</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categories} dataKey="total" nameKey="category" outerRadius={90} label>
                {categories.map((c, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h2 className="mb-4 font-semibold">Monatliche Ausgaben</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Invoices */}
      <Card className="mb-6 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Rechnungen</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCreateOpen(true)}
              className="bg-blue-600 px-3 py-1 rounded text-sm"
            >
              Neue Rechnung
            </button>
            <button
              onClick={() => setUploadOpen(true)}
              className="bg-green-600 px-3 py-1 rounded text-sm"
            >
              Beleg scannen
            </button>
          </div>
        </div>

        <InvoiceList
          invoices={invoices}
          onUpdated={(inv) =>
            setInvoices((prev) => prev.map((i) => (i.id === inv.id ? inv : i)))
          }
        />
      </Card>

      {/* DATEV Export */}
      <Card className="mb-6 p-4">
        <h2 className="font-semibold mb-3">Steuer Export</h2>
        <button onClick={exportDATEV} className="bg-green-600 px-4 py-2 rounded">
          DATEV CSV Export
        </button>
      </Card>

      <InvoiceCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(inv) => setInvoices((prev) => [inv, ...prev])}
      />

      <ReceiptUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onCreated={(inv) => setInvoices((prev) => [inv, ...prev])}
      />
    </PageLayout>
  );
}
