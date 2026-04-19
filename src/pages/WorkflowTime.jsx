import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function WorkflowTimePage() {
  const { isCompanyAdmin, isSolo, org } = useAuth();
  const isAdmin = isCompanyAdmin || isSolo;

  const [entries, setEntries]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activeEntry, setActiveEntry]   = useState(null);
  const [now, setNow]                   = useState(Date.now());
  const [actionLoading, setActionLoading] = useState(false);
  const [autoHours, setAutoHours]       = useState(10);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved]   = useState(false);

  // live timer
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchTimeEntries();
    fetchActive();
  }, [selectedMonth]);

  // Auto-Clockout Setting aus Org laden
  useEffect(() => {
    if (org?.auto_clockout_hours) setAutoHours(org.auto_clockout_hours);
  }, [org]);

  async function fetchActive() {
    try {
      const res = await api.get("/workflow/time/active");
      if (res.data && res.data.clock_in) {
        setActiveEntry(res.data);
      } else {
        setActiveEntry(null);
      }
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
          end:   format(endOfMonth(selectedMonth),   "yyyy-MM-dd"),
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

  async function saveSettings() {
    setSavingSettings(true);
    try {
      await api.post("/workflow/time/settings", { auto_clockout_hours: autoHours });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  }

  const startTime  = activeEntry?.clock_in ? new Date(activeEntry.clock_in).getTime() : null;
  const workedMs   = startTime ? now - startTime : 0;

  const formatHM = (ms) => {
    const totalMin = Math.floor(ms / 1000 / 60);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h ${m}m`;
  };

  const formatDecimal = (ms) => (ms / 1000 / 60 / 60).toFixed(2);
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
            <p className="text-green-400 font-semibold"> Aktuell eingestempelt</p>
            <p className="text-gray-300 mt-1">
              Seit: {new Date(activeEntry.clock_in).toLocaleString("de-DE")}
            </p>
            <p className="text-white text-lg font-mono mt-1">
              {formatHM(workedMs)} <span className="text-gray-400 text-sm">({formatDecimal(workedMs)} h)</span>
            </p>
            <button onClick={clockOut} disabled={actionLoading}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded text-sm font-semibold">
              {actionLoading ? "..." : "Ausstempeln"}
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-400"> Nicht eingestempelt</p>
            <button onClick={clockIn} disabled={actionLoading}
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-sm font-semibold">
              {actionLoading ? "..." : "Einstempeln"}
            </button>
          </>
        )}
      </div>

      {/* ADMIN: Auto-Clockout Einstellung */}
      {isAdmin && (
        <div className="mb-6 p-4 bg-[#0a1120] border border-white/10 rounded-lg text-white">
          <p className="text-sm font-semibold text-gray-300 mb-2">
            ⚙️ Auto-Ausstempeln (Admin)
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Mitarbeiter werden automatisch ausgestempelt wenn sie vergessen es zu tun.
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Nach</label>
            <input
              type="number" min="1" max="24" step="0.5"
              value={autoHours}
              onChange={e => setAutoHours(parseFloat(e.target.value))}
              className="w-20 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm text-center"
            />
            <label className="text-sm text-gray-400">Stunden automatisch ausstempeln</label>
            <button onClick={saveSettings} disabled={savingSettings}
              className="px-3 py-1 bg-[#C5A572] hover:opacity-90 disabled:opacity-50 rounded text-sm font-semibold text-black">
              {savingSettings ? "..." : settingsSaved ? "✓ Gespeichert" : "Speichern"}
            </button>
          </div>
        </div>
      )}

      {/* MONAT NAVIGATION */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => handleMonthChange(-1)}
          className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white text-sm">← Zurück</button>
        <span className="text-white font-semibold">
          {format(selectedMonth, "MMMM yyyy")}
        </span>
        <button onClick={() => handleMonthChange(1)}
          className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white text-sm">Weiter →</button>
      </div>

      {/* GESAMT */}
      <div className="mb-4 p-3 bg-[#0a1120] border border-white/10 rounded-lg">
        <p className="text-gray-400 text-sm">Gesamt diesen Monat</p>
        <p className="text-white text-xl font-bold">{totalHours.toFixed(2)} h</p>
      </div>

      {/* EINTRÄGE */}
      {loading ? (
        <p className="text-gray-400">Lädt...</p>
      ) : error ? (
        <p className="text-red-400">Fehler beim Laden.</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-500">Keine Einträge in diesem Monat.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((e, i) => (
            <div key={i} className="p-3 bg-[#0a1120] border border-white/10 rounded-lg text-white flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">
                  {e.clock_in && format(new Date(e.clock_in), "dd.MM.yyyy")}
                </p>
                <p className="text-xs text-gray-400">
                  {e.clock_in && format(new Date(e.clock_in), "HH:mm")} –{" "}
                  {e.clock_out ? format(new Date(e.clock_out), "HH:mm") : <span className="text-green-400">läuft</span>}
                </p>
              </div>
              <p className="text-sm font-mono text-[#C5A572]">{(e.hours || 0).toFixed(2)} h</p>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
