import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import axios from "axios";
import dayjs from "dayjs";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function TaxDashboard({ companies = [] }) {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [profile, setProfile] = useState({ legal_form: null });
  const [taxCalculated, setTaxCalculated] = useState(false);

  const [summary, setSummary] = useState({});
  const [refundSummary, setRefundSummary] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [yearFilter, setYearFilter] = useState(dayjs().year());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiClient = axios.create({
    baseURL: "/tax",
    withCredentials: true
  });

  // -------------------
  // Save Profile / Legal Form
  // -------------------
  const saveProfile = async () => {
    if (!profile.legal_form) return;

    try {
      const res = await apiClient.post("/business-profile", { legal_form: profile.legal_form });
      setProfile(res.data);
      setTaxCalculated(true);
      fetchData(); // direkt laden nach Rechtsform
    } catch (err) {
      console.error("Fehler beim Speichern der Rechtsform:", err);
      setError("Rechtsform konnte nicht gespeichert werden");
    }
  };

  // -------------------
  // Fetch Data
  // -------------------
  const fetchData = async () => {
    if (!taxCalculated) return;

    setLoading(true);
    setError(null);

    try {
      const params = { year: yearFilter };
      if (selectedCompany?.id) params.company_id = selectedCompany.id;

      const [sRes, rRes, mRes, cRes, rollRes] = await Promise.all([
        apiClient.get("/summary", { params }),
        apiClient.get("/refund-summary", { params }),
        apiClient.get("/chart/monthly", { params }),
        apiClient.get("/chart/category", { params }),
        apiClient.get("/chart/rolling", { params })
      ]);

      setSummary(sRes.data || {});
      setRefundSummary(rRes.data || {});
      setMonthly(Array.isArray(mRes.data?.monthly_data) ? mRes.data.monthly_data : []);
      setCategory(Array.isArray(cRes.data?.categories) ? cRes.data.categories : []);
      setRolling(Array.isArray(rollRes.data?.rolling) ? rollRes.data.rolling : []);
    } catch (err) {
      console.error("Fehler beim Laden der Steuerdaten:", err);
      setError("Steuerdaten konnten nicht geladen werden");
      setSummary({});
      setRefundSummary({});
      setMonthly([]);
      setCategory([]);
      setRolling([]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // Effect: Reload on year or company change
  // -------------------
  useEffect(() => {
    fetchData();
  }, [yearFilter, selectedCompany, taxCalculated]);

  // -------------------
  // Loader
  // -------------------
  if (loading) return <div className="text-center py-10">Lade Steuerdaten...</div>;

  // -------------------
  // Overlay wenn keine Rechtsform
  // -------------------
  if (!taxCalculated) {
    return (
      <div className="relative w-full h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-20 flex justify-center items-center transition duration-500">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-96 text-center animate-fade-in">
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
              🚀 Bitte Rechtsform angeben
            </h2>
            <select
              value={profile.legal_form || ""}
              onChange={(e) => setProfile({ ...profile, legal_form: e.target.value })}
              className="
                border border-gray-300 dark:border-gray-600 
                rounded-xl px-4 py-2 mb-6 w-full 
                text-gray-900 dark:text-gray-100 
                bg-gray-100 dark:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition
              "
            >
              <option value="">-- Rechtsform wählen --</option>
              <option value="Einzelunternehmer">Einzelunternehmer</option>
              <option value="Freiberufler">Freiberufler</option>
              <option value="GmbH">GmbH</option>
              <option value="UG">UG</option>
            </select>
            <button
              onClick={saveProfile}
              className="
                bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-indigo-600 hover:to-blue-600
                text-white font-bold 
                rounded-xl px-6 py-3
                shadow-lg hover:shadow-xl
                transition-all duration-300
                transform hover:-translate-y-1
              "
            >
              Rechtsform speichern
            </button>
          </div>
        </div>

        <div className="blur-sm pointer-events-none w-full h-full">
          {/* Dashboard im Hintergrund als sexy Preview */}
        </div>
      </div>
    );
  }

  // -------------------
  // Dashboard
  // -------------------
  return (
    <div className="space-y-8 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">
      {error && <div className="text-red-500">{error}</div>}

      {/* Company Filter */}
      {companies.length > 0 && (
        <div className="flex justify-end space-x-2 mb-4">
          <label className="text-gray-700 dark:text-gray-200 font-medium">Firma:</label>
          <select
            value={selectedCompany?.id || ""}
            onChange={(e) => {
              const company = companies.find(c => c.id === e.target.value);
              setSelectedCompany(company || null);
            }}
            className="
              border rounded px-2 py-1 bg-gray-100 dark:bg-gray-700
              text-gray-900 dark:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition
            "
          >
            <option value="">-- Alle Firmen --</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Jahr Filter */}
      <div className="flex justify-end space-x-2 mb-4">
        <label className="text-gray-700 dark:text-gray-200 font-medium">Jahr:</label>
        <input
          type="number"
          value={yearFilter}
          onChange={(e) => setYearFilter(Number(e.target.value))}
          className="
            border rounded px-2 py-1 w-24
            bg-gray-100 dark:bg-gray-800
            text-gray-900 dark:text-gray-200
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition
          "
          placeholder="Jahr"
        />
      </div>

      {/* Gesamtübersicht */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Vorsteuer gesamt" value={summary.vat?.input || 0} color="text-green-600" />
        <Card title="Umsatzsteuer gesamt" value={summary.vat?.output || 0} color="text-red-600" />
        <Card title="Rückerstattung" value={summary.vat?.refund || 0} color="text-blue-600" />
      </div>

      {/* Steuerrückerstattung Vorjahr vs. Aktuelles Jahr */}
      <div className="bg-gray-100 dark:bg-gray-700 shadow rounded p-4 flex justify-around">
        <YearRefundCard
          year={refundSummary.last_year?.year || yearFilter - 1}
          refund={refundSummary.last_year?.vat_balance || 0}
          label="Letztes Jahr"
        />
        <YearRefundCard
          year={refundSummary.current_year?.year || yearFilter}
          refund={refundSummary.current_year?.vat_balance || 0}
          label="Aktuelles Jahr"
        />
      </div>

      {/* Monatliche Steuerübersicht */}
      <ChartSection title={`Monatliche Steuerübersicht ${yearFilter}`}>
        <ResponsiveWrapper>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="input_vat" fill={COLORS[0]} name="Vorsteuer" />
            <Bar dataKey="output_vat" fill={COLORS[1]} name="Umsatzsteuer" />
            <Bar dataKey="refund" fill={COLORS[2]} name="Rückerstattung" />
          </BarChart>
        </ResponsiveWrapper>
      </ChartSection>

      {/* Kategorienübersicht */}
      <ChartSection title="Steuern nach Kategorie">
        <ResponsiveWrapper>
          <PieChart>
            <Pie
              data={category}
              dataKey="refund"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {category.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveWrapper>
      </ChartSection>

      {/* Rolling 12 Monate */}
      <ChartSection title="Trend der letzten 12 Monate">
        <ResponsiveWrapper>
          <LineChart data={rolling}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
            <XAxis
              dataKey="month"
              tickFormatter={(m, i) => {
                const item = rolling[i] || {};
                return `${item.year || yearFilter}-${String(m || 1).padStart(2, "0")}`;
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="input_vat" stroke={COLORS[0]} name="Vorsteuer" />
            <Line type="monotone" dataKey="output_vat" stroke={COLORS[1]} name="Umsatzsteuer" />
            <Line type="monotone" dataKey="refund" stroke={COLORS[2]} name="Rückerstattung" />
          </LineChart>
        </ResponsiveWrapper>
      </ChartSection>

      {/* DATEV Export */}
      <div className="flex space-x-4 mt-4">
        <a
          href="/tax/export/datev"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          DATEV Export (Gesamt)
        </a>
        <a
          href={`/tax/export/datev-filtered?year=${yearFilter}${selectedCompany?.id ? `&company_id=${selectedCompany.id}` : ""}`}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          DATEV Export (Jahr {yearFilter})
        </a>
      </div>
    </div>
  );
}

// -------------------
// Kleine Komponenten
// -------------------
function Card({ title, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 text-center">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className={`text-2xl ${color}`}>{Number(value || 0).toFixed(2)} €</p>
    </div>
  );
}

function YearRefundCard({ year, refund, label }) {
  return (
    <div className="text-center flex-1">
      <p className="font-medium">{label} ({year})</p>
      <p className="text-2xl text-blue-600">{Number(refund || 0).toFixed(2)} €</p>
    </div>
  );
}

function ChartSection({ title, children }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 shadow rounded p-4 overflow-auto">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      {children}
    </div>
  );
}

function ResponsiveWrapper({ children }) {
  return (
    <div className="w-full overflow-auto">
      <div className="min-w-[700px]">{children}</div>
    </div>
  );
}
