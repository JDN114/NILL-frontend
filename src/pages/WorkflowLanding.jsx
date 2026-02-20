import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";

const API_BASE = "https://api.nillai.de";

export default function WorkflowLanding() {
  const [stats, setStats] = useState({
    openTasks: 0,
    overdueTasks: 0,
    activeProjects: 0,
    teamMembers: 0,
  });

  const [userRole, setUserRole] = useState("member"); // später dynamisch aus API

  useEffect(() => {
    async function fetchStats() {
      try {
        const [tasksRes, rolesRes] = await Promise.all([
          fetch(`${API_BASE}/workflow/tasks?status=open`, {
            credentials: "include",
          }),
          fetch(`${API_BASE}/workflow/roles`, {
            credentials: "include",
          }),
        ]);

        const tasksData = await tasksRes.json();
        const rolesData = await rolesRes.json();

        setStats({
          openTasks: tasksData.total || 0,
          overdueTasks: 0, // optional später berechnen
          activeProjects: 0, // später über Projekte API
          teamMembers: rolesData.total || 0,
        });

        // TODO: User Rolle sauber aus API bestimmen
        setUserRole("admin"); 
      } catch (err) {
        console.error("Workflow Stats Error:", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">
        Organisationszentrale
      </h1>

      {/* ================= KPI SECTION ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Offene Aufgaben" value={stats.openTasks} />
        <KpiCard label="Überfällig" value={stats.overdueTasks} />
        <KpiCard label="Aktive Projekte" value={stats.activeProjects} />
        <KpiCard label="Team-Mitglieder" value={stats.teamMembers} />
      </div>

      {/* ================= ARBEITSORGANISATION ================= */}
      <Section title="Arbeitsorganisation">
        <ModuleLink
          to="/workflow/tasks"
          title="Aufgaben"
          description="Plane, weise zu und erledige Aufgaben mit Deadlines."
        />
        <ModuleLink
          to="/workflow/projects"
          title="Projekte"
          description="Strukturiere Arbeit in Projekten und verfolge Fortschritt."
        />
      </Section>

      {/* ================= TEAM ================= */}
      <Section title="Team & Struktur">
        <ModuleLink
          to="/workflow/team"
          title="Team"
          description="Mitglieder und Rollen im Unternehmen einsehen."
        />
        <ModuleLink
          to="/workflow/roles"
          title="Rollen"
          description="Verantwortlichkeiten und Zugriffsrechte verwalten."
        />
      </Section>

      {/* ================= ZEIT ================= */}
      <Section title="Zeit & Kontrolle">
        <ModuleLink
          to="/workflow/time"
          title="Arbeitszeit"
          description="Ein- und Ausstempeln sowie Arbeitszeiten einsehen."
        />
        <ModuleLink
          to="/workflow/activity"
          title="Aktivitäten"
          description="Nachvollziehbarkeit von Änderungen und Prozessen."
        />
      </Section>

      {/* ================= ADMIN ================= */}
      {userRole === "admin" && (
        <Section title="Verwaltung">
          <ModuleLink
            to="/workflow/admin"
            title="Systemverwaltung"
            description="Globale Einstellungen und Konfiguration."
          />
        </Section>
      )}
    </PageLayout>
  );
}

/* ================= COMPONENTS ================= */

function KpiCard({ label, value }) {
  return (
    <div className="bg-[#0a1120] p-4 rounded-lg shadow-inner hover:shadow-lg transition">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function ModuleLink({ to, title, description }) {
  return (
    <Link
      to={to}
      className="bg-[#0a1120] p-6 rounded-lg hover:shadow-xl transition border border-white/5"
    >
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </Link>
  );
}
