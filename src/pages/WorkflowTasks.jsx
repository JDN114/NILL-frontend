import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";

const API_BASE = "https://api.nillai.de";

export default function WorkflowTasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("open");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/workflow/tasks?status=${statusFilter}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setTasks(data.items || []);
    } catch (err) {
      console.error("Task fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function completeTask(taskId) {
    try {
      await fetch(`${API_BASE}/workflow/tasks/${taskId}/complete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result_data: {} }),
      });

      fetchTasks();
    } catch (err) {
      console.error("Complete task error:", err);
    }
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Aufgaben</h1>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0a1120] text-white p-2 rounded border border-white/10"
        >
          <option value="open">Offen</option>
          <option value="completed">Abgeschlossen</option>
        </select>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-400">Lade Aufgaben...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400">Keine Aufgaben vorhanden</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={completeTask}
            />
          ))
        )}
      </div>
    </PageLayout>
  );
}

/* ================= TASK CARD ================= */

function TaskCard({ task, onComplete }) {
  const deadline = task.deadline
    ? new Date(task.deadline)
    : null;

  const isOverdue =
    deadline && deadline < new Date() && task.status !== "completed";

  return (
    <div className="bg-[#0a1120] p-5 rounded-lg border border-white/5 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-400 text-sm mt-1">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400">
            {deadline && (
              <span className={isOverdue ? "text-red-400" : ""}>
                Deadline: {deadline.toLocaleDateString()}
                {isOverdue && " (Überfällig)"}
              </span>
            )}

            {task.assignee_id && (
              <span>Zugewiesen an: {task.assignee_id}</span>
            )}

            <StatusBadge status={task.status} />
          </div>
        </div>

        {task.status !== "completed" && (
          <button
            onClick={() => onComplete(task.id)}
            className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Abschließen
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  const styles = {
    open: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-green-500/20 text-green-400",
    escalated: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        styles[status] || "bg-gray-500/20 text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}
