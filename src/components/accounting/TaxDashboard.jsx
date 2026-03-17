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
  const [profile, setProfile] = useState({
    legal_form: "",
    vat_registered: true,
    tax_rate_income: 0.25,
    tax_rate_corporate: 0.3,
    tax_rate_trade: 0.15,
  });
  const [summary, setSummary] = useState({});
  const [refundSummary, setRefundSummary] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [yearFilter, setYearFilter] = useState(dayjs().year());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taxCalculated, setTaxCalculated] = useState(false);

  const apiClient = axios.create({ baseURL: "/tax", withCredentials: true });

  // ==========================
  // FETCH BUSINESS PROFILE
  // ==========================
  const fetchProfile = async () => {
    try {
      const res = await apiClient.get("/business-profile");
      if (res.data?.legal_form) {
        setProfile(res.data);
        setTaxCalculated(true);
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  };

  // ==========================
  // FETCH TAX DATA
  // ==========================
  const fetchData = async () => {
    if (!taxCalculated) return;

    setLoading(true);
    setError(null);
    try {
      const params = { year: yearFilter };
      if (selectedCompany?.id) params.company_id = selectedCompany.id;

      const [sRes, rRes, mRes, cRes, rollRes] = await Promise.all([
        apiClient.get("/summary", { params }).catch(() => ({ data: {} })),
        apiClient.get("/refund-summary", { params }).catch(() => ({ data: {} })),
        apiClient.get("/chart/monthly", { params }).catch(() => ({ data: { monthly_data: [] } })),
        apiClient.get("/chart/category", { params }).catch(() => ({ data: { categories: [] } })),
        apiClient.get("/chart/rolling", { params }).catch(() => ({ data: { rolling: [] } }))
      ]);

      setSummary(sRes.data || {});
      setRefundSummary(rRes.data || {});
      setMonthly(Array.isArray(mRes.data?.monthly_data) ? mRes.data.monthly_data : []);
      setCategory(Array.isArray(cRes.data?.categories) ? cRes.data.categories : []);
      setRolling(Array.isArray(rollRes.data?.rolling) ? rollRes.data.rolling : []);
    } catch (err) {
      console.error("Tax Dashboard Error:", err);
      setError("Fehler beim Laden der Steuerdaten");
      setSummary({});
      setRefundSummary({});
      setMonthly([]);
      setCategory([]);
      setRolling([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchData();
  }, [taxCalculated, yearFilter, selectedCompany]);

  // ==========================
  // SAVE BUSINESS PROFILE
  // ==========================
  const saveProfile = async () => {
    try {
      await apiClient.post("/business-profile", profile);
      setTaxCalculated(true);
      fetchData();
    } catch (err) {
      console.error("Save profile failed:", err);
      alert("Fehler beim Speichern des Profils");
    }
  };

  // ==========================
  // RECALCULATE TAX FROM INVOICES
  // ==========================
  const recalcTax = async () => {
    try {
      const res = await apiClient.post("/recalculate");
      alert(`Steuern für ${res.data.created || 0} Rechnungen berechnet`);
      fetchData();
    } catch (err) {
      console.error("Recalculate failed:", err);
      alert("Fehler beim Berechnen der Steuern");
    }
  };

  // ==========================
  // Dashboard Overlay wenn keine Rechtsform
  // ==========================
  if (!taxCalculated) {
    return (
      <div className="relative w-full h-full flex justify-center items-center">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-900 bg-opacity-70 backdrop-blur-md z-10 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Bitte Rechtsform angeben
          </h2>
          <select
            value={profile.legal_form || ""}
            onChange={(e) => setProfile({ ...profile, legal_form: e.target.value })}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-700"
          >
            <option value="">-- Rechtsform wählen --</option>
            <option value="Einzelunternehmer">Einzelunternehmer</option>
            <option value="Freiberufler">Freiberufler</option>
            <option value="GmbH">GmbH</option>
            <option value="UG">UG</option>
          </select>
          <button
            onClick={saveProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Rechtsform speichern
          </button>
        </div>
        <div className="blur-sm pointer-events-none w-full h-full">
          {/* Optional: Das Dashboard im Hintergrund zeigen */}
        </div>
      </div>
    );
  }

  // ==========================
  // Dashboard Anzeige
  // ==========================
  if (loading) return <div className="text-center py-10">Lade Steuerdaten...</div>;

  return (
    <div className="space-y-8 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">

      {/* Company & Year Filter */}
      <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-4 mb-4">
        {companies.length > 0 && (
          <div className="flex items-center space-x-2">
            <label>Firma:</label>
            <select
              value={selectedCompany?.id || ""}
              onChange={(e) => {
                const company = companies.find(c => c.id === e.target.value);
                setSelectedCompany(company || null);
              }}
              className="border rounded px-2 py-1 bg-gray-100 dark:bg-gray-700"
            >
              <option value="">-- Alle Firmen --</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <label>Jahr:</label>
          <input
            type="number"
            value={yearFilter}
            onChange={(e) => setYearFilter(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24 bg-gray-100 dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Steuern berechnen */}
      <button
        onClick={recalcTax}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mb-4"
      >
        Steuern berechnen
      </button>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <Card title="Einnahmen" value={summary.income} color="text-green-600" />
        <Card title="Ausgaben" value={summary.expenses} color="text-red-600" />
        <Card title="Gewinn nach Steuern" value={summary.net_after_tax} color="text-blue-600" />
      </div>

      {/* Refund Summary */}
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

      {/* Charts */}
      <ChartSection title={`Monatliche Übersicht ${yearFilter}`}>
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

      <ChartSection title="Kategorienübersicht">
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

      <ChartSection title="Rolling 12 Monate">
        <ResponsiveWrapper>
          <LineChart data={rolling}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
            <XAxis dataKey="month"
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
        <a href="/tax/export/datev" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
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
    <div className="bg-gray-100 dark:bg-gray-700 shadow rounded p-4 overflow-auto mb-4">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      {children}
    </div>
  );
}

function ResponsiveWrapper({ children }) {
  return <div className="w-full overflow-auto"><div className="min-w-[700px]">{children}</div></div>;
}
