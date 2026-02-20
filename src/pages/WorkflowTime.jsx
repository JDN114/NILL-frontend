import { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/layout/PageLayout";

const API_BASE = "https://api.nillai.de";

export default function WorkflowTime() {
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const res = await fetch(`${API_BASE}/workflow/time`, {
        credentials: "include",
      });
      const data = await res.json();

      const items = data.items || [];
      setEntries(items);

      const running = items.find((e) => !e.end_time);
      setActiveEntry(running || null);
    } catch (err) {
      console.error("Time fetch error:", err);
    }
  }

  async function clockIn() {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/workflow/time/clock-in`, {
        method: "POST",
        credentials: "include",
      });
      fetchEntries();
    } catch (err) {
      console.error("Clock in error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function clockOut() {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/workflow/time/clock-out`, {
        method: "POST",
        credentials: "include",
      });
      fetchEntries();
    } catch (err) {
      console.error("Clock out error:", err);
    } finally {
      setLoading(false);
    }
  }

  function getDurationSeconds(start, end) {
    return (new Date(end) - new Date(start)) / 1000;
  }

  function formatSeconds(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }

  /* ================= BERECHNUNGEN ================= */

  const now = new Date();

  const monthlySeconds = useMemo(() => {
    return entries.reduce((acc, e) => {
      if (!e.end_time) return acc;

      const start = new Date(e.start_time);
      if (
        start.getMonth() === now.getMonth() &&
        start.getFullYear() === now.getFullYear()
      ) {
        return acc + getDurationSeconds(e.start_time, e.end_time);
      }

      return acc;
    }, 0);
  }, [entries]);

  const weeklySeconds = useMemo(() => {
    const weekStart = new Date();
    weekStart.setDate(now.getDate() - now.getDay());

    return entries.reduce((acc, e) => {
      if (!e.end_time) return acc;

      const start = new Date(e.start_time);
      if (start >= weekStart) {
        return acc + getDurationSeconds(e.start_time, e.end_time);
      }

      return acc;
    }, 0);
  }, [entries]);

  const todaySeconds = useMemo(() => {
    return entries.reduce((acc, e) => {
      if (!e.end_time) return acc;

      const start = new Date(e.start_time);
      if (
        start.getDate() === now.getDate() &&
        start.getMonth() === now.getMonth()
      ) {
        return acc + getDurationSeconds(e.start_time, e.end_time);
      }

      return acc;
    }, 0);
  }, [entries]);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">
        Arbeitszeit
      </h1>

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <KpiCard label="Heute" value={formatSeconds(todaySeconds)} />
        <KpiCard label="Diese Woche" value={formatSeconds(weeklySeconds)} />
        <KpiCard label="Dieser Monat" value={formatSeconds(monthlySeconds)} />
      </div>

      {/* STATUS CARD */}
      <div className="bg-[#0a1120] p-6 rounded-lg border border-white/5 mb-10">
        {activeEntry ? (
          <>
            <p className="text-green-400 font-semibold">
              Eingestempelt
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Seit:{" "}
              {new Date(activeEntry.start_time).toLocaleTimeString()}
            </p>
            <button
              onClick={clockOut}
              disabled={loading}
              className="mt-4 bg-red-600 px-4 py-2 rounded-lg text-white hover:opacity-90 transition"
            >
              Ausstempeln
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-400 font-semibold">
              Nicht eingestempelt
            </p>
            <button
              onClick={clockIn}
              disabled={loading}
              className="mt-4 bg-[var(--accent)] px-4 py-2 rounded-lg text-white hover:opacity-90 transition"
            >
              Einstempeln
            </button>
          </>
        )}
      </div>

      {/* MONATSÜBERSICHT */}
      <h2 className="text-lg font-semibold text-white mb-4">
        Einträge im aktuellen Monat
      </h2>

      <div className="space-y-3">
        {entries
          .filter((e) => {
            const start = new Date(e.start_time);
            return (
              start.getMonth() === now.getMonth() &&
              start.getFullYear() === now.getFullYear()
            );
          })
          .map((entry) => (
            <TimeRow key={entry.id} entry={entry} />
          ))}
      </div>
    </PageLayout>
  );
}

/* ================= COMPONENTS ================= */

function KpiCard({ label, value }) {
  return (
    <div className="bg-[#0a1120] p-5 rounded-lg border border-white/5">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function TimeRow({ entry }) {
  function getDurationSeconds(start, end) {
    return (new Date(end) - new Date(start)) / 1000;
  }

  function formatSeconds(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }

  const duration =
    entry.end_time &&
    formatSeconds(
      getDurationSeconds(entry.start_time, entry.end_time)
    );

  return (
    <div className="bg-[#0a1120] p-4 rounded-lg border border-white/5 flex justify-between items-center">
      <div>
        <div className="text-white text-sm">
          {new Date(entry.start_time).toLocaleDateString()}
        </div>
        <div className="text-gray-400 text-xs">
          {new Date(entry.start_time).toLocaleTimeString()} –{" "}
          {entry.end_time
            ? new Date(entry.end_time).toLocaleTimeString()
            : "Laufend"}
        </div>
      </div>

      <div className="text-sm text-gray-300">
        {duration || (
          <span className="text-yellow-400">Aktiv</span>
        )}
      </div>
    </div>
  );
}
