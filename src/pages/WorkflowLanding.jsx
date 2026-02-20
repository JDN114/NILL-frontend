import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";

export default function WorkflowLanding() {
  const buttons = [
    { title: "Team", description: "Teams & Rollen verwalten", to: "/dashboard/workflow/team" },
    { title: "Aufgaben", description: "Deine Aufgaben & Deadlines", to: "/dashboard/workflow/tasks" },
    { title: "Projekte", description: "Projekte & Fortschritt", to: "/dashboard/workflow/projects" },
    { title: "Zeiterfassung", description: "Arbeitszeiten & Monatsübersicht", to: "/dashboard/workflow/time" },
    { title: "Audit & Events", description: "Logs & Trigger überwachen", to: "/dashboard/workflow/audit" },
  ];

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Workflow</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buttons.map((b) => (
          <Link key={b.title} to={b.to} className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title={b.title} description={b.description} className="hover:shadow-lg transition" />
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
