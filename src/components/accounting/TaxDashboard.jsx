import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import axios from "axios";
import dayjs from "dayjs";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function TaxDashboard({ companies = [] }) {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [summary, setSummary] = useState({
    profit: 0,
    tax_total: 0,
    vat: { input: 0, output: 0, refund: 0 },
    net_after_tax: 0
  });
  const [refundSummary, setRefundSummary] = useState({
    last_year: { year: dayjs().year() - 1, vat_balance: 0 },
    current_year: { year: dayjs().year(), vat_balance: 0 }
  });
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [yearFilter, setYearFilter] = useState(dayjs().year());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [legalForm, setLegalForm] = useState("");

  const apiClient = axios.create({
    baseURL: "/tax",
    withCredentials: true
  });

  useEffect(() => {
    async function checkProfile() {
      try {
        const res = await apiClient.get("/business-profile");
        if (!res.data?.legal_form) {
          setShowProfileModal(true);
        } else {
          setLegalForm(res.data.legal_form);
        }
      } catch {
        setShowProfileModal(true);
      }
    }
    checkProfile();
  }, []);

  useEffect(() => {
    if (!legalForm) return; // nur laden, wenn Rechtsform vorhanden
    async function fetchData() {
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

        setSummary(sRes.data || {
          profit: 0,
          tax_total: 0,
          vat: { input: 0, output: 0, refund: 0 },
          net_after_tax: 0
        });
        setRefundSummary(rRes.data || {
          last_year: { year: yearFilter - 1, vat_balance: 0 },
          current_year: { year: yearFilter, vat_balance: 0 }
        });
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
  }, [yearFilter, selectedCompany, legalForm]);

  const saveProfile = async () => {
    try {
      await apiClient.post("/business-profile", { legal_form: legalForm });
      setShowProfileModal(false);
    } catch (err) {
      console.error("Fehler beim Speichern der Rechtsform:", err);
      alert("Fehler beim Speichern der Rechtsform.");
    }
  };

  if (!legalForm) {
    return (
      <AnimatePresence>
        {showProfileModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 backdrop-blur-2xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)] text-center">
                <h2 className="text-2xl font-semibold text-white mb-6">Rechtsform angeben</h2>
                <select
                  className="w-full p-2 rounded text-black mb-4"
                  value={legalForm}
                  onChange={(e) => setLegalForm(e.target.value)}
                >
                  <option value="">-- auswählen --</option>
                  <option value="Einzelunternehmer">Einzelunternehmer</option>
                  <option value="Freiberufler">Freiberufler</option>
                  <option value="GmbH">GmbH</option>
                  <option value="UG">UG</option>
                </select>
                <button
                  onClick={saveProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
                >
                  Speichern
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (loading) return <div className="text-center py-10">Lade Steuerdaten...</div>;

  return (
    <div className="space-y-8 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow relative">
      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Company Filter */}
      {companies.length > 0 && (
        <div className="flex justify-end space-x-2 mb-4">
          <label className="text-gray-700 dark:text-gray-200 font-medium">Firma:</label>
          <select
            value={selectedCompany?.id || ""}
            onChange={(e) => setSelectedCompany(companies.find(c => c.id === e.target.value) || null)}
            className="border rounded px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">-- Alle Firmen --</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
          className="border rounded px-2 py-1 w-24 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Gesamtübersicht */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Vorsteuer gesamt" value={summary?.vat?.input ?? 0} color="text-green-600" />
        <Card title="Umsatzsteuer gesamt" value={summary?.vat?.output ?? 0} color="text-red-600" />
        <Card title="Rückerstattung" value={summary?.vat?.refund ?? 0} color="text-blue-600" />
      </div>

      {/* Rückerstattung Vorjahr vs Aktuelles Jahr */}
      <div className="bg-gray-100 dark:bg-gray-700 shadow rounded p-4 flex justify-around">
        <YearRefundCard year={refundSummary.last_year?.year} refund={refundSummary.last_year?.vat_balance} label="Letztes Jahr" />
        <YearRefundCard year={refundSummary.current_year?.year} refund={refundSummary.current_year?.vat_balance} label="Aktuelles Jahr" />
      </div>

      {/* Charts */}
      <ChartSection title={`Monatliche Steuerübersicht ${yearFilter}`}>
        <ResponsiveWrapper>
          <BarChart data={monthly ?? []}>
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
              data={category ?? []}
              dataKey="refund"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {Array.isArray(category) ? category.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />) : null}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveWrapper>
      </ChartSection>

      <ChartSection title="Trend der letzten 12 Monate">
        <ResponsiveWrapper>
          <LineChart data={rolling ?? []}>
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
        <a href="/tax/export/datev" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">DATEV Export (Gesamt)</a>
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
      <p className={`text-2xl ${color}`}>{Number(value ?? 0).toFixed(2)} €</p>
    </div>
  );
}

function YearRefundCard({ year, refund, label }) {
  return (
    <div className="text-center flex-1">
      <p className="font-medium">{label} ({year ?? ""})</p>
      <p className="text-2xl text-blue-600">{Number(refund ?? 0).toFixed(2)} €</p>
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
  return (
    <div className="w-full overflow-auto">
      <div className="min-w-[700px]">{children}</div>
    </div>
  );
}
