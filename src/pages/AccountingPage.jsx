import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import InvoiceList from "../components/accounting/InvoiceList";
import BankInsights from "../components/accounting/BankInsights";
import TaxDashboard from "../components/accounting/TaxDashboard";
import ReceiptUploadModal from "../components/accounting/ReceiptUpload";
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
  const [chartAnimated, setChartAnimated] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // -------------------------
  // Helpers
  // -------------------------

  const buildMonthly = (data) => {
    const map = {};
    (data || []).forEach((i) => {
      if (!i?.invoice_date || !i?.amount) return;
      const d = new Date(i.invoice_date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!map[key]) map[key] = 0;
      map[key] += Number(i.amount) || 0;
    });
    return Object.entries(map).map(([k, v]) => ({ month: k, total: v }));
  };

  // -------------------------
  // API LOADERS
  // -------------------------

  const loadInvoices = async () => {
    try {
      const res = await api.get("/accounting/invoices");
      const data = Array.isArray(res.data) ? res.data : [];
      setInvoices(data);
      setMonthly(buildMonthly(data));
    } catch (e) {
      console.error("invoice load failed", e);
      setInvoices([]); // 🔥 wichtig
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get("/accounting/stats");
      const s = res.data || {};
      setStats([
        { label: "Gesamt", value: s.total_amount || 0, showEuro: true },
        { label: "Offen", value: s.unpaid_count || 0 },
        { label: "Überfällig", value: s.overdue_count || 0 },
        { label: "Kategorien", value: s.by_category?.length || 0 },
      ]);
    } catch (e) {
      console.error("stats failed", e);
      setStats([]);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/accounting/category-stats");

      let data = Array.isArray(res.data) ? res.data : [];

      // 🔥 FIX: null-safe machen
      data = data.map((c) => ({
        ...c,
        category: c?.category || "Unbekannt",
        total: Number(c?.total) || 0,
      }));

      data.sort((a, b) => b.total - a.total);

      setCategories(data);
    } catch (e) {
      console.error("category stats failed", e);
      setCategories([]);
    }
  };

  const loadBank = async () => {
    try {
      const res = await api.get("/bank/status");
      setBankStatus(res.data);
    } catch {
      console.warn("bank status not available");
      setBankStatus(null);
    }
  };

  // -------------------------
  // INIT
  // -------------------------

  useEffect(() => {
    loadInvoices();
    loadStats();
    loadCategories();
    loadBank();

    const invoiceInterval = setInterval(loadInvoices, 15000);
    const statsInterval = setInterval(loadStats, 60000);
    const bankInterval = setInterval(loadBank, 120000);

    return () => {
      clearInterval(invoiceInterval);
      clearInterval(statsInterval);
      clearInterval(bankInterval);
    };
  }, []);

  // -------------------------
  // Bank Actions
  // -------------------------

  const connectBank = () => {
    window.location.href = `${api.defaults.baseURL}/bank/connect`;
  };

  const disconnectBank = async () => {
    try {
      await api.post("/bank/disconnect");
      loadBank();
    } catch (e) {
      console.error("disconnect failed", e);
    }
  };

  const overdue = (invoices || []).filter(
    (i) =>
      i?.payment_deadline &&
      i?.payment_status === "unpaid" &&
      new Date(i.payment_deadline) < new Date()
  );

  const pieColors = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];

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
            <p className="text-xl font-bold">
              {s.value} {s.showEuro ? "€" : ""}
            </p>
          </Card>
        ))}
      </div>

      {/* Bank */}
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
        <BankInsights onUpload={() => setUploadOpen(true)} />
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h2 className="mb-4 font-semibold">Kategorie Ausgaben</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categories || []}
                dataKey="total"
                nameKey="category"
                outerRadius={90}
                innerRadius={40}
                isAnimationActive={!chartAnimated}
                onAnimationEnd={() => setChartAnimated(true)}
                label={({ name, percent }) => {
                  const safeName = name || "Unbekannt";
                  const short =
                    safeName.length > 10
                      ? safeName.slice(0, 10) + "…"
                      : safeName;
                  return `${short} (${((percent || 0) * 100).toFixed(0)}%)`;
                }}
                labelLine={false}
              >
                {(categories || []).map((c, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} €`, name || "Unbekannt"]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h2 className="mb-4 font-semibold">Monatliche Ausgaben</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthly || []}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} €`} />
              <Bar dataKey="total" fill="#4F46E5" />
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
              Beleg scannen
            </button>
          </div>
        </div>
        <InvoiceList invoices={invoices || []} onUpdated={loadInvoices} />
      </Card>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Steuer-Dashboard</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
          <TaxDashboard />
        </div>
      </section>

     <ReceiptUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onCreated={loadInvoices}
      />
    </PageLayout>
  );
}
