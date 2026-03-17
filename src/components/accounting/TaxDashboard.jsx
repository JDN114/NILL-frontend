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
  const [companyProfile, setCompanyProfile] = useState(null);
  const [summary, setSummary] = useState({ profit: 0, tax_total: 0, vat: { input: 0, output: 0, refund: 0 }, net_after_tax: 0 });
  const [refundSummary, setRefundSummary] = useState({ last_year: {}, current_year: {} });
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [yearFilter, setYearFilter] = useState(dayjs().year());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [legalFormModalOpen, setLegalFormModalOpen] = useState(false);
  const [legalFormData, setLegalFormData] = useState({ legal_form: "", vat_registered: true });

  const apiClient = axios.create({
    baseURL: "/tax",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  });

  // =========================================================
  // LOAD COMPANY PROFILE
  // =========================================================
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiClient.get("/business-profile");
        setCompanyProfile(res.data);
        setLegalFormData({
          legal_form: res.data.legal_form || "",
          vat_registered: res.data.vat_registered ?? true
        });
      } catch (err) {
        console.warn("No company profile found, user must set legal form.");
        setLegalFormModalOpen(true);
      }
    }
    loadProfile();
  }, []);

  // =========================================================
  // SAVE LEGAL FORM
  // =========================================================
  const saveLegalForm = async () => {
    if (!legalFormData.legal_form) return alert("Bitte Rechtsform auswählen");

    try {
      const res = await apiClient.post("/business-profile", legalFormData);
      setCompanyProfile(res.data);
      setLegalFormModalOpen(false);
    } catch (err) {
      console.error("Fehler beim Speichern der Rechtsform:", err);
      alert("Fehler beim Speichern der Rechtsform");
    }
  };

  // =========================================================
  // LOAD TAX DATA
  // =========================================================
  useEffect(() => {
    if (!companyProfile) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const params = { year: yearFilter };
        const [sRes, rRes, mRes, cRes, rollRes] = await Promise.all([
          apiClient.get("/summary", { params }),
          apiClient.get("/refund-summary", { params }),
          apiClient.get("/chart/monthly", { params }),
          apiClient.get("/chart/category", { params }),
          apiClient.get("/chart/rolling", { params })
        ]);

        setSummary(sRes.data || summary);
        setRefundSummary(rRes.data || refundSummary);
        setMonthly(Array.isArray(mRes.data?.monthly_data) ? mRes.data.monthly_data : []);
        setCategory(Array.isArray(cRes.data?.categories) ? cRes.data.categories : []);
        setRolling(Array.isArray(rollRes.data?.rolling) ? rollRes.data.rolling : []);
      } catch (err) {
        console.error("Tax Dashboard Error:", err);
        setError("Fehler beim Laden der Steuerdaten");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [yearFilter, companyProfile]);

  // =========================================================
  // RENDER
  // =========================================================
  if (!companyProfile || legalFormModalOpen) {
    return (
      <div className="relative w-full h-[80vh] flex items-center justify-center">
        {/* Sexy Blur Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl z-10 rounded-xl flex flex-col items-center justify-center space-y-4">
          <h2 className="text-white text-2xl font-semibold">Bitte Rechtsform angeben</h2>
          <select
            value={legalFormData.legal_form}
            onChange={(e) => setLegalFormData({ ...legalFormData, legal_form: e.target.value })}
            className="px-4 py-2 rounded bg-white text-black font-medium"
          >
            <option value="">-- auswählen --</option>
            <option value="Einzelunternehmer">Einzelunternehmer</option>
            <option value="Freiberufler">Freiberufler</option>
            <option value="GmbH">GmbH</option>
            <option value="UG">UG</option>
          </select>
          <button
            onClick={saveLegalForm}
            className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Rechtsform speichern
          </button>
        </div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
      </div>
    );
  }

  if (loading) return <div className="text-center py-10 text-white">Lade Steuerdaten...</div>;

  return (
    <div className="space-y-8 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">

      {/* Jahr Filter */}
      <div className="flex justify-end space-x-2 mb-4">
        <label className="text-gray-700 dark:text-gray-200 font-medium">Jahr:</label>
        <input
          type="number"
          value={yearFilter}
          onChange={(e) => setYearFilter(Number(e.target.value))}
          className="
            border
            rounded
            px-2
            py-1
            w-24
            bg-gray-100 dark:bg-gray-800
            text-gray-900 dark:text-gray-200
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            transition
          "
          placeholder="Jahr"
        />
      </div>

      {/* Gesamtübersicht */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Vorsteuer gesamt" value={summary.vat.input} color="text-green-600" />
        <Card title="Umsatzsteuer gesamt" value={summary.vat.output} color="text-red-600" />
        <Card title="Rückerstattung" value={summary.vat.refund} color="text-blue-600" />
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

      {/* Charts */}
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
          href={`/tax/export/datev-filtered?year=${yearFilter}`}
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
