// src/pages/AccountingPage.jsx
import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import api from "../services/api";
import ExpensePieChart from "../components/accounting/ExpensePieChart";
import ReceiptUpload from "../components/accounting/ReceiptUpload";

export default function AccountingPage() {
  const [expenses, setExpenses] = useState({
    stats: [],
    receipts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------- Daten laden ----------------
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/accounting/dashboard");
        setExpenses(res.data || { stats: [], receipts: [] });
      } catch (err) {
        console.error("Accounting API Error:", err);
        setError("Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <p className="text-gray-400 text-center py-10">Lade Buchhaltungsdaten…</p>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <p className="text-red-500 text-center py-10">{error}</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Buchhaltung</h1>

      {/* ================= Stats Sektion ================= */}
      <Card className="mb-6 p-4">
        <h2 className="text-lg font-semibold mb-4">Ausgaben nach Kategorie</h2>

        {expenses?.stats?.length > 0 ? (
          <ExpensePieChart data={expenses.stats} />
        ) : (
          <p className="text-gray-400">Keine Ausgaben-Daten verfügbar</p>
        )}
      </Card>

      {/* ================= Rechnungserstellung & Upload ================= */}
      <Card className="mb-6 p-4">
        <h2 className="text-lg font-semibold mb-4">Neue Rechnung</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => alert("Rechnung erstellen (Demo)") }
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Neue Rechnung erstellen
          </button>

          <ReceiptUpload onUpload={(newReceipt) => {
            setExpenses((prev) => ({
              ...prev,
              receipts: [...prev.receipts, newReceipt]
            }));
          }} />
        </div>
      </Card>

      {/* ================= Rechnungen Übersicht ================= */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Rechnungen & Belege</h2>
        {expenses?.receipts?.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {expenses.receipts.map((r) => (
              <li key={r.id} className="py-2 flex justify-between items-center">
                <span>{r.name || "(Unbekannter Beleg)"}</span>
                <span className="text-sm text-gray-400">{r.amount ? `${r.amount} €` : ""}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Noch keine Rechnungen hochgeladen</p>
        )}
      </Card>
    </PageLayout>
  );
}
