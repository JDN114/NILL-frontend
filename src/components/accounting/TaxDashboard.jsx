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
  const [profile, setProfile] = useState({});
  const [options, setOptions] = useState([]);

  const [summary, setSummary] = useState({});
  const [refundSummary, setRefundSummary] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [yearFilter, setYearFilter] = useState(dayjs().year());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiClient = axios.create({ baseURL: "/tax", withCredentials: true });
  const companyClient = axios.create({ baseURL: "/companies", withCredentials: true });

  // --- Laden aller Firmen & Optionen ---
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const [cRes, oRes] = await Promise.all([
          companyClient.get("/"),
          apiClient.get("/business-profile/options")
        ]);
        setCompanies(cRes.data || []);
        setOptions(oRes.data || []);
        if (cRes.data.length > 0) {
          setSelectedCompany(cRes.data[0]);
        }
      } catch (err) {
        console.error("Fehler beim Laden der Firmen/Optionen", err);
      }
    }
    fetchCompanies();
  }, []);

  // --- Laden des Business Profiles ---
  useEffect(() => {
    if (!selectedCompany) return;

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/business-profile", { params: { company_id: selectedCompany.id } });
        setProfile(res.data || {});
      } catch (err) {
        console.error("Fehler beim Laden des Business Profiles", err);
        setError("Fehler beim Laden des Firmenprofils");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [selectedCompany]);

  // --- Laden der Steuerdaten ---
  useEffect(() => {
    if (!selectedCompany) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [sRes, rRes, mRes, cRes, rollRes] = await Promise.all([
          apiClient.get("/summary", { params: { company_id: selectedCompany.id } }),
          apiClient.get("/refund-summary", { params: { company_id: selectedCompany.id } }),
          apiClient.get("/chart/monthly", { params: { year: yearFilter, company_id: selectedCompany.id } }),
          apiClient.get("/chart/category", { params: { year: yearFilter, company_id: selectedCompany.id } }),
          apiClient.get("/chart/rolling", { params: { company_id: selectedCompany.id } })
        ]);

        setSummary(sRes.data || {});
        setRefundSummary(rRes.data || {});
        setMonthly(mRes.data?.monthly_data || []);
        setCategory(cRes.data?.categories || []);
        setRolling(rollRes.data?.rolling_12_months || []);
      } catch (err) {
        console.error("Tax Dashboard Error:", err);
        setError("Fehler beim Laden der Steuerdaten");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCompany, yearFilter]);

  if (loading) return <div className="text-center py-10">Lade Steuerdaten...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="space-y-8 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">

      {/* --- Firmen Auswahl --- */}
      <div className="flex items-center justify-between mb-4 space-x-4">
        <div>
          <label className="font-medium text-gray-700 dark:text-gray-200 mr-2">Firma:</label>
          <select
            value={selectedCompany?.id || ""}
            onChange={(e) => {
              const comp = companies.find(c => c.id === Number(e.target.value));
              setSelectedCompany(comp);
            }}
            className="border rounded px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium text-gray-700 dark:text-gray-200 mr-2">Rechtsform:</label>
          <select
            value={profile.legal_form || ""}
            onChange={async (e) => {
              const newForm = e.target.value;
              setProfile(prev => ({ ...prev, legal_form: newForm }));

              // Update Backend
              await apiClient.post("/business-profile", { legal_form: newForm, company_id: selectedCompany.id });
            }}
            className="border rounded px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            {options.map(o => (
              <option key={o.legal_form} value={o.legal_form}>{o.legal_form}</option>
            ))}
          </select>
        </div>

      </div>

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
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition
          "
          placeholder="Jahr"
        />
      </div>

      {/* Gesamtübersicht */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Vorsteuer gesamt" value={summary.input_vat_total} color="text-green-600" />
        <Card title="Umsatzsteuer gesamt" value={summary.output_vat_total} color="text-red-600" />
        <Card title="Rückerstattung" value={summary.refund_total} color="text-blue-600" />
      </div>

      {/* Steuerrückerstattung Vorjahr vs. Aktuelles Jahr */}
      <div className="bg-gray-100 dark:bg-gray-700 shadow rounded p-4 flex justify-around">
        <YearRefundCard
          year={refundSummary.last_year?.year || yearFilter - 1}
          refund={refundSummary.last_year?.refund || 0}
          label="Letztes Jahr"
        />
        <YearRefundCard
          year={refundSummary.current_year?.year || yearFilter}
          refund={refundSummary.current_year?.refund || 0}
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
          href={`/tax/export/datev?company_id=${selectedCompany?.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          DATEV Export (Gesamt)
        </a>
        <a
          href={`/tax/export/datev-filtered?year=${yearFilter}&company_id=${selectedCompany?.id}`}
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
