import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import InvoiceList from "../components/accounting/InvoiceList";
import BankInsights from "../components/accounting/BankInsights";
import TaxDashboard from "../components/accounting/TaxDashboard";
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
  LabelList,
} from "recharts";

const COLORS = ["#6366F1", "#EF4444", "#FBBF24", "#10B981", "#8B5CF6"];
const CATEGORY_MAP = {
  Food: "Essen",
  Transport: "Transport",
  Office: "Büro",
  Travel: "Reisen",
  Other: "Sonstiges",
};

export default function AccountingPage() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [bankStatus, setBankStatus] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [chartInitialized, setChartInitialized] = useState(false);

  // -------------------------
  // Helpers
  // -------------------------

  const buildMonthly = (data) => {
    const map = {};
    data.forEach((i) => {
      if (!i?.invoice_date || !i?.amount) return;
      const d = new Date(i.invoice_date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!map[key]) map[key] = 0;
      map[key] += Number(i.amount);
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
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get("/accounting/stats");
      const s = res.data;
      setStats([
        { label: "Total", value: s.total_amount },
        { label: "Unpaid", value: s.unpaid_count },
        { label: "Overdue", value: s.overdue_count },
        { label: "Categories", value: s.by_category?.length || 0 },
      ]);
    } catch (e) {
      console.error("stats failed", e);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/accounting/category-stats");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("category stats failed", e);
    }
  };

  const loadBank = async () => {
    try {
      const res = await api.get("/bank/status");
      setBankStatus(res.data);
    } catch {
      console.warn("bank status not available");
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

    // Charts Animation einmal initial
    setTimeout(() => setChartInitialized(true), 1500);

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

  const exportDATEV = () => {
    window.open(`${api.defaults.baseURL}/tax/export/datev`, "_blank");
  };

  const overdue = invoices.filter(
    (i) =>
      i?.payment_deadline &&
      i?.payment_status === "unpaid" &&
      new Date(i.payment_deadline) < new Date()
  );

  const mappedCategories = categories.map((c) => ({
    ...c,
    category: CATEGORY_MAP[c.category] || c.category,
  }));

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
        {stats.map((s, i) => {
          let label = s.label;
          if (label === "Categories") label = "Kategorien";
          if (label === "Total") label = "Total";

          return (
            <Card
              key={i}
              className="p-4 transition transform hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <p className="text-sm text-gray-400">{label}</p>
              <p className="text-xl font-bold">
                {s.value}
                {label === "Total" ? " €" : ""}
              </p>
            </Card>
          );
        })}
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
                data={mappedCategories}
                dataKey="total"
                nameKey="category"
                outerRadius={90}
                paddingAngle={4}
                label={(entry) => `${entry.category}: ${entry.value} €`}
                isAnimationActive={!chartInitialized}
              >
                {mappedCategories.map((c, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const total = mappedCategories.reduce((acc, c) => acc + c.total, 0);
                  const percent = total ? ((props.payload.total / total) * 100).toFixed(1) : 0;
                  return [`${value} € (${percent}%)`, props.payload.category];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h2 className="mb-4 font-semibold">Monatliche Ausgaben</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthly} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} €`} />
              <Bar
                dataKey="total"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                isAnimationActive={!chartInitialized}
              >
                <LabelList dataKey="total" position="top" formatter={(v) => `${v} €`} />
              </Bar>
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
        <InvoiceList invoices={invoices} onUpdated={loadInvoices} />
      </Card>

      {/* Steuer-Dashboard */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Steuer-Dashboard</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
          <TaxDashboard />
        </div>
      </section>

      <InvoiceCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={loadInvoices}
      />
      <ReceiptUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onCreated={loadInvoices}
      />
    </PageLayout>
  );
}
