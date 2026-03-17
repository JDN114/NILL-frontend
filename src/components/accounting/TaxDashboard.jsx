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
        {/* Sexy Blur Overlay */}
        <div className="absolute inset-0 z-20 flex justify-center items-center">
          <div className="backdrop-blur-3xl bg-white/20 dark:bg-gray-800/20 rounded-3xl p-8 w-96 flex flex-col items-center space-y-6 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
              Bitte Rechtsform angeben
            </h2>
            <select
              value={profile.legal_form || ""}
              onChange={(e) => setProfile({ ...profile, legal_form: e.target.value })}
              className="
                border border-gray-300 dark:border-gray-600 
                rounded-xl px-4 py-2 w-full
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
              Speichern
            </button>
          </div>
        </div>

        {/* Dashboard als Blur Preview */}
        <div className="blur-xl pointer-events-none w-full h-full">
          {/* Optionale Vorschau des Dashboards */}
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
      {/* Hier geht es weiter wie vorher... */}
      {/* Company Filter, Year Filter, Charts, DATEV Export */}
    </div>
  );
}
