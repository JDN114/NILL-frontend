import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function WorkflowTimePage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    fetchTimeEntries();
  }, [selectedMonth]);

  async function fetchTimeEntries() {
    setLoading(true);
    try {
      const res = await api.get("/workflow/time", {
        params: {
          start: format(startOfMonth(selectedMonth), "yyyy-MM-dd"),
          end: format(endOfMonth(selectedMonth), "yyyy-MM-dd"),
        },
      });
      setEntries(res.data?.entries || []);
      setError(false);
    } catch (err) {
      console.error("Workflow Time fetch error:", err);
      setEntries([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0);

  const handleMonthChange = (delta) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setSelectedMonth(newMonth);
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Zeiterfassung</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleMonthChange(-1)}
            className="px-3 py-1 bg-[var(--accent)]/80 rounded text-white hover:bg-opacity-90 transition"
          >
            ← Vorheriger Monat
          </button>
          <span className="font-semibold text-white">{format(selectedMonth, "MMMM yyyy")}</span>
          <button
            onClick={() => handleMonthChange(1)}
            className="px-3 py-1 bg-[var(--accent)]/80 rounded text-white hover:bg-opacity-90 transition"
          >
            Nächster Monat →
          </button>
        </div>
        <div className="font-semibold text-white">
          Gesamtstunden: {totalHours.toFixed(2)}
        </div>
      </div>

      {loading && <p className="text-gray-400">Lade Zeiteinträge...</p>}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400">
          Zeiteinträge konnten nicht geladen werden.
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="text-gray-400">Keine Zeiteinträge vorhanden für diesen Monat.</p>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((e) => (
            <div
              key={e.id}
              className="bg-[#0a1120] p-4 rounded-lg border border-white/5 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{e.taskTitle || "Allgemein"}</p>
                <p className="text-gray-400 text-sm">
                  {format(new Date(e.date), "dd.MM.yyyy")}
                </p>
              </div>
              <p className="px-2 py-1 text-sm rounded bg-yellow-500/20 text-yellow-400">
                {e.hours?.toFixed(2) || 0} h
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 bg-[var(--accent)] rounded text-white hover:bg-opacity-90 transition"
          onClick={() => alert("Feature zum Hinzufügen von Zeiteinträgen noch implementieren")}
        >
          Neuer Eintrag
        </button>
      </div>
    </PageLayout>
  );
}
