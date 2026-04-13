import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function WorkflowTimePage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const [activeEntry, setActiveEntry] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [actionLoading, setActionLoading] = useState(false);

  // live timer
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchTimeEntries();
    fetchActive();
  }, [selectedMonth]);

  async function fetchActive() {
    try {
      const res = await api.get("/workflow/time/summary");
      setActiveEntry(res.data?.active_entry || null);
    } catch (e) {
      console.error("active fetch failed", e);
    }
  }

  async function fetchTimeEntries() {
    setLoading(true);
    try {
      const res = await api.get("/workflow/time", {
        params: {
          start: format(startOfMonth(selectedMonth), "yyyy-MM-dd"),
          end: format(endOfMonth(selectedMonth), "yyyy-MM-dd"),
        },
      });

      setEntries(res.data?.items || res.data?.entries || []);
      setError(false);
    } catch (err) {
      console.error("Workflow Time fetch error:", err);
      setEntries([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function clockIn() {
    setActionLoading(true);
    try {
      const res = await api.post("/workflow/time/clock-in");
      setActiveEntry(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  }

  async function clockOut() {
    setActionLoading(true);
    try {
      await api.post("/workflow/time/clock-out");
      setActiveEntry(null);
      fetchTimeEntries();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  }

  const startTime = activeEntry?.clock_in
    ? new Date(activeEntry.clock_in).getTime()
    : null;

  const workedMs = startTime ? now - startTime : 0;

  const formatHM = (ms) => {
    const totalMin = Math.floor(ms / 1000 / 60);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h ${m}m`;
  };

  const formatDecimal = (ms) =>
    (ms / 1000 / 60 / 60).toFixed(2);

  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0);

  const handleMonthChange = (delta) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setSelectedMonth(newMonth);
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-4 text-white">Zeiterfassung</h1>

      {/* LIVE CLOCK CARD */}
      <div className="mb-6 p-4 bg-[#0a1120] border border-white/10 rounded-lg text-white">
        {activeEntry ? (
          <>
            <p className="text-green-400 font-semibold">
              🟢 Aktuell eingestempelt
            </p>
            <p className="text-gray-300 mt-1">
              Seit: {new Date(activeEntry.clock_in).toLocaleString()}
            </p>

            <p className="mt-2 text-lg">
              Arbeitszeit: {formatHM(workedMs)} ({formatDecimal(workedMs)}h)
            </p>

            <button
              disabled={actionLoading}
              onClick={clockOut}
              className="mt-3 px-4 py-2 bg-red-600 rounded text-white"
            >
              Ausstempeln
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-400">Nicht eingestempelt</p>
            <button
              disabled={actionLoading}
              onClick={clockIn}
              className="mt-3 px-4 py-2 bg-green-600 rounded text-white"
            >
              Einstempeln
            </button>
          </>
        )}
      </div>

      {/* MONTH CONTROL */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleMonthChange(-1)}
            className="px-3 py-1 bg-[var(--accent)]/80 rounded text-white"
          >
            ← Vorheriger Monat
          </button>

          <span className="font-semibold text-white">
            {format(selectedMonth, "MMMM yyyy")}
          </span>

          <button
            onClick={() => handleMonthChange(1)}
            className="px-3 py-1 bg-[var(--accent)]/80 rounded text-white"
          >
            Nächster Monat →
          </button>
        </div>

        <div className="font-semibold text-white">
          Gesamtstunden: {totalHours.toFixed(2)}h
        </div>
      </div>

      {/* LIST */}
      {loading && <p className="text-gray-400">Lade Zeiteinträge...</p>}

      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400">
          Fehler beim Laden der Zeiteinträge
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="text-gray-400">Keine Zeiteinträge vorhanden</p>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((e) => (
            <div
              key={e.id}
              className="bg-[#0a1120] p-4 rounded-lg border border-white/5"
            >
              <p className="font-semibold text-white">
                {e.taskTitle || "Arbeitszeit"}
              </p>

              <p className="text-gray-400 text-sm">
                {e.clock_in && format(new Date(e.clock_in), "dd.MM.yyyy HH:mm")}
              </p>

              <p className="text-yellow-400 mt-2">
                {e.hours?.toFixed(2) || 0} h
              </p>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
