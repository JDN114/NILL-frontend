// frontend/components/TaxDashboard.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import axios from "axios";
import dayjs from "dayjs";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function TaxDashboard() {
  const [summary, setSummary] = useState(null);
  const [refundSummary, setRefundSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [yearFilter, setYearFilter] = useState(dayjs().year());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiClient = axios.create({
    baseURL: "/tax",
    withCredentials: true
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [sRes, rRes, mRes, cRes, rollRes] = await Promise.all([
          apiClient.get("/summary"),
          apiClient.get("/refund-summary"),
          apiClient.get("/chart/monthly", { params: { year: yearFilter } }),
          apiClient.get("/chart/category", { params: { year: yearFilter } }),
          apiClient.get("/chart/rolling")
        ]);

        setSummary(sRes.data);
        setRefundSummary(rRes.data);
        setMonthly(mRes.data.monthly_data);
        setCategory(cRes.data.categories);
        setRolling(rollRes.data.rolling_12_months);
      } catch (err) {
        console.error("Tax Dashboard Error:", err);
        setError("Fehler beim Laden der Steuerdaten");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [yearFilter]);

  if (loading) return <div className="text-center py-10">Lade Steuerdaten...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="space-y-8 p-4">

      {/* Jahr Filter */}
      <div className="flex justify-end space-x-2">
        <label className="text-gray-700 font-medium">Jahr:</label>
        <input
          type="number"
          value={yearFilter}
          onChange={(e) => setYearFilter(Number(e.target.value))}
          className="border rounded px-2 py-1 w-24"
        />
      </div>

      {/* Gesamtübersicht */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Vorsteuer gesamt" value={summary.input_vat_total} color="text-green-600" />
        <Card title="Umsatzsteuer gesamt" value={summary.output_vat_total} color="text-red-600" />
        <Card title="Rückerstattung" value={summary.refund_total} color="text-blue-600" />
      </div>

      {/* Steuerrückerstattung Vorjahr vs. Aktuelles Jahr */}
      <div className="bg-white shadow rounded p-4 flex justify-around">
        <YearRefundCard year={refundSummary.last_year.year} refund={refundSummary.last_year.refund} label="Letztes Jahr" />
        <YearRefundCard year={refundSummary.current_year.year} refund={refundSummary.current_year.refund} label="Aktuelles Jahr" />
      </div>

      {/* Monatliche Steuerübersicht */}
      <ChartSection title={`Monatliche Steuerübersicht ${yearFilter}`}>
        <BarChart width={700} height={300} data={monthly}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="input_vat" fill={COLORS[0]} name="Vorsteuer" />
          <Bar dataKey="output_vat" fill={COLORS[1]} name="Umsatzsteuer" />
          <Bar dataKey="refund" fill={COLORS[2]} name="Rückerstattung" />
        </BarChart>
      </ChartSection>

      {/* Kategorienübersicht */}
      <ChartSection title="Steuern nach Kategorie">
        <PieChart width={400} height={300}>
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
      </ChartSection>

      {/* Rolling 12 Monate */}
      <ChartSection title="Trend der letzten 12 Monate">
        <LineChart width={700} height={300} data={rolling}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(m, i) => `${rolling[i].year}-${String(m).padStart(2, "0")}`}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="input_vat" stroke={COLORS[0]} name="Vorsteuer" />
          <Line type="monotone" dataKey="output_vat" stroke={COLORS[1]} name="Umsatzsteuer" />
          <Line type="monotone" dataKey="refund" stroke={COLORS[2]} name="Rückerstattung" />
        </LineChart>
      </ChartSection>

      {/* DATEV Export */}
      <div className="flex space-x-4">
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
    <div className="bg-white shadow rounded p-4 text-center">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className={`text-2xl ${color}`}>{Number(value).toFixed(2)} €</p>
    </div>
  );
}

function YearRefundCard({ year, refund, label }) {
  return (
    <div className="text-center flex-1">
      <p className="font-medium">{label} ({year})</p>
      <p className="text-2xl text-blue-600">{Number(refund).toFixed(2)} €</p>
    </div>
  );
}

function ChartSection({ title, children }) {
  return (
    <div className="bg-white shadow rounded p-4 overflow-auto">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      {children}
    </div>
  );
}
