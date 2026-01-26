import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";

export default function DashboardLanding() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>

      {/* 🔙 Zurück zur allgemeinen Landingpage */}
      <div className="mb-6 flex justify-center">
        <Link to="/">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            Zur Landingpage
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/dashboard/emails" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
          <Card
            title="Emails"
            description="Postfach, Filter & Kategorien"
            className="hover:shadow-lg transition"
          />
        </Link>

        <Link to="/dashboard/settings" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
          <Card
            title="Einstellungen"
            description="Gmail Verbindung & Account"
            className="hover:shadow-lg transition"
          />
        </Link>
      </div>
    </PageLayout>
  );
}
