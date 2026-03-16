import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import axios from "axios";
import dayjs from "dayjs";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function TaxDashboard() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [summary, setSummary] = useState({});
  const [refundSummary, setRefundSummary] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [yearFilter, setYearFilter] = useState(dayjs().year());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiClient = axios.create({ baseURL: "/tax", withCredentials: true });
  const companiesClient = axios.create({ baseURL: "/companies", withCredentials: true });

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await companiesClient.get("/");
        const list = Array.isArray(res.data) ? res.data : [];
        setCompanies(list);
        setSelectedCompany(list[0] ?? null);
      } catch (err) {
        console.error("Fehler beim Laden der Firmen:", err);
        setCompanies([]);
        setSelectedCompany(null);
      }
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const params = { year: yearFilter, company_id: selectedCompany.id };
        const [sRes, rRes, mRes, cRes, rollRes] = await Promise.all([
          apiClient.get("/summary", { params }),
          apiClient.get("/refund-summary", { params }),
          apiClient.get("/chart/monthly", { params }),
          apiClient.get("/chart/category", { params }),
          apiClient.get("/chart/rolling", { params })
        ]);

        setSummary(sRes.data || {});
        setRefundSummary(rRes.data || {});
        setMonthly(mRes.data?.monthly_data ?? []);
        setCategory(cRes.data?.categories ?? []);
        setRolling(rollRes.data?.rolling_12_months ?? []);
      } catch (err) {
        console.error("Tax Dashboard Error:", err);
        setError("Fehler beim Laden der Steuerdaten");
        setMonthly([]);
        setCategory([]);
        setRolling([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [yearFilter, selectedCompany]);

  if (loading) return <div className="text-center py-10">Lade Steuerdaten...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="space-y-8 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">

      {/* Firmen Dropdown */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 dark:text-gray-200 font-medium">Firma:</label>
          <select
            value={selectedCompany?.id ?? ""}
            onChange={(e) => {
              const company = companies.find(c => c.id === e.target.value);
              setSelectedCompany(company ?? null);
            }}
            className="border rounded px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            {(Array.isArray(companies) ? companies : []).map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.legal_form ?? "–"})</option>
            ))}
          </select>
        </div>

        {/* Jahr Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 dark:text-gray-200 font-medium">Jahr:</label>
          <input
            type="number"
            value={yearFilter || dayjs().year()}
            onChange={(e) => setYearFilter(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Gesamtübersicht */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Vorsteuer gesamt" value={summary.input_vat_total ?? 0} color="text-green-600" />
        <Card title="Umsatzsteuer gesamt" value={summary.output_vat_total ?? 0} color="text-red-600" />
        <Card title="Rückerstattung" value={summary.refund_total ?? 0} color="text-blue-600" />
      </div>

      {/* Steuerrückerstattung Vorjahr vs. Aktuelles Jahr */}
      <div className="bg-gray-100 dark:bg-gray-700 shadow rounded p-4 flex justify-around">
        <YearRefundCard
          year={refundSummary.last_year?.year ?? (yearFilter - 1)}
          refund={refundSummary.last_year?.refund ?? 0}
          label="Letztes Jahr"
        />
        <YearRefundCard
          year={refundSummary.current_year?.year ?? yearFilter}
          refund={refundSummary.current_year?.refund ?? 0}
          label="Aktuelles Jahr"
        />
      </div>

      {/* Charts */}
      <ChartSection title={`Monatliche Steuerübersicht ${yearFilter}`}>
        <ResponsiveWrapper>
          <BarChart data={Array.isArray(monthly) ? monthly : []}>
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

      <ChartSection title="Steuern nach Kategorie">
        <ResponsiveWrapper>
          <PieChart>
            <Pie
              data={Array.isArray(category) ? category : []}
              dataKey="refund"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {(Array.isArray(category) ? category : []).map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveWrapper>
      </ChartSection>

      <ChartSection title="Trend der letzten 12 Monate">
        <ResponsiveWrapper>
          <LineChart data={Array.isArray(rolling) ? rolling : []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
            <XAxis
              dataKey="month"
              tickFormatter={(m, i) => {
                const item = Array.isArray(rolling) ? rolling[i] || {} : {};
                return `${item.year ?? yearFilter}-${String(m ?? 1).padStart(2, "0")}`;
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
        <a href={`/tax/export/datev-filtered?year=${yearFilter}&company_id=${selectedCompany?.id}`}
           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          DATEV Export (Firma {selectedCompany?.name ?? "–"})
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
      <p className={`text-2xl ${color}`}>{Number(value ?? 0).toFixed(2)} €</p>
    </div>
  );
}

function YearRefundCard({ year, refund, label }) {
  return (
    <div className="text-center flex-1">
      <p className="font-medium">{label} ({year ?? "–"})</p>
      <p className="text-2xl text-blue-600">{Number(refund ?? 0).toFixed(2)} €</p>
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
