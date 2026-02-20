import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";

export default function WorkflowTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await api.get("/workflow/tasks");
      setTasks(res.data?.items || []);
      setError(false);
    } catch (err) {
      console.error("Workflow Tasks fetch error:", err);
      setTasks([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Aufgaben</h1>

      {loading && <p className="text-gray-400">Lade Aufgaben...</p>}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400">
          Aufgaben konnten nicht geladen werden.
        </div>
      )}
      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-400">Keine Aufgaben vorhanden.</p>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#0a1120] p-4 rounded-lg border border-white/5 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="text-gray-400 text-sm">
                  Deadline: {task.deadline || "keine"}
                </p>
              </div>
              <p className={`px-2 py-1 text-xs rounded ${task.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                {task.status || "offen"}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
