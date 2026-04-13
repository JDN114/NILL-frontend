import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";

export default function WorkflowTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await api.get("/workflow/tasks");
      setTasks(res.data?.items || []);
      setError(false);
    } catch (err) {
      console.error("fetchTasks error:", err);
      setTasks([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // ---------- CREATE TASK ----------
  async function createTask() {
    if (!newTaskTitle) return;

    setActionLoading(true);
    try {
      await api.post("/workflow/tasks", {
        title: newTaskTitle,
        description: newTaskDesc,
      });

      setNewTaskTitle("");
      setNewTaskDesc("");
      fetchTasks();
    } catch (e) {
      console.error("createTask failed", e);
    } finally {
      setActionLoading(false);
    }
  }

  // ---------- ASSIGN ----------
  async function assignTask(taskId, userId) {
    setActionLoading(true);
    try {
      await api.post(`/workflow/tasks/${taskId}/assign`, {
        assignee_id: userId,
      });

      fetchTasks();
    } catch (e) {
      console.error("assign failed", e);
    } finally {
      setActionLoading(false);
    }
  }

  // ---------- COMPLETE ----------
  async function completeTask(taskId) {
    setActionLoading(true);
    try {
      await api.post(`/workflow/tasks/${taskId}/complete`, {
        result_data: {},
      });

      fetchTasks();
    } catch (e) {
      console.error("complete failed", e);
    } finally {
      setActionLoading(false);
    }
  }

  // ---------- ESCALATE ----------
  async function escalateTask(taskId) {
    const reason = prompt("Grund für Eskalation?");
    if (!reason) return;

    setActionLoading(true);
    try {
      await api.post(`/workflow/tasks/${taskId}/escalate`, {
        reason,
      });

      fetchTasks();
    } catch (e) {
      console.error("escalate failed", e);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Workflow Tasks</h1>

      {/* CREATE TASK */}
      <div className="mb-6 p-4 bg-[#0a1120] border border-white/10 rounded-lg">
        <h2 className="text-white font-semibold mb-2">Neue Aufgabe</h2>

        <input
          className="w-full mb-2 p-2 rounded bg-black/40 text-white"
          placeholder="Titel"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />

        <textarea
          className="w-full mb-2 p-2 rounded bg-black/40 text-white"
          placeholder="Beschreibung"
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
        />

        <button
          onClick={createTask}
          disabled={actionLoading}
          className="px-4 py-2 bg-green-600 rounded text-white"
        >
          Task erstellen
        </button>
      </div>

      {/* STATES */}
      {loading && <p className="text-gray-400">Lade Tasks...</p>}

      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400">
          Fehler beim Laden der Tasks
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-400">Keine Tasks vorhanden</p>
      )}

      {/* LIST */}
      {!loading && !error && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="bg-[#0a1120] border border-white/10 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">{t.title}</p>
                  <p className="text-gray-400 text-sm">
                    {t.description || "Keine Beschreibung"}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 text-xs rounded ${
                    t.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : t.status === "escalated"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => completeTask(t.id)}
                  className="px-3 py-1 bg-green-600 rounded text-white text-sm"
                >
                  Erledigen
                </button>

                <button
                  onClick={() => escalateTask(t.id)}
                  className="px-3 py-1 bg-red-600 rounded text-white text-sm"
                >
                  Eskalieren
                </button>

                <button
                  onClick={() => assignTask(t.id, prompt("User-ID?"))}
                  className="px-3 py-1 bg-blue-600 rounded text-white text-sm"
                >
                  Zuweisen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
