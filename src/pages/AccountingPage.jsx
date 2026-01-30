import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import StatsCards from "../components/accounting/StatsCards";
import ExpensePieChart from "../components/accounting/ExpensePieChart";
import AccountingActions from "../components/accounting/AccountingActions";
import AccountingTable from "../components/accounting/AccountingTable";
import TodosPanel from "../components/accounting/TodosPanel";
import api from "../services/api";

export default function AccountingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountingData();
  }, []);

  const fetchAccountingData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/accounting/overview");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="text-white">Lade Buchhaltung…</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Buchhaltung</h1>

      <StatsCards stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <ExpensePieChart data={data.expenseCategories} />
        <TodosPanel todos={data.todos} />
      </div>

      <AccountingActions onRefresh={fetchAccountingData} />

      <AccountingTable invoices={data.invoices} />
    </PageLayout>
  );
}
