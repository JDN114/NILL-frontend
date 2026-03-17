import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import dayjs from "dayjs";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function TaxDashboard({ companies = [] }) {
  const [profile, setProfile] = useState({ legal_form: null });
  const [taxReady, setTaxReady] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [yearFilter, setYearFilter] = useState(dayjs().year());

  const [summary, setSummary] = useState({});
  const [refundSummary, setRefundSummary] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiClient = axios.create({
    baseURL: "/tax",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  });

  // ---------------------------
  // Save legal form
  // ---------------------------
  const saveLegalForm = async () => {
    if (!profile.legal_form) return;
    try {
      const res = await apiClient.post("/business-profile", { legal_form: profile.legal_form });
      setProfile(res.data);
      setTaxReady(true);
      fetchData();
    } catch (err) {
      console.error("Fehler beim Speichern der Rechtsform:", err);
      setError("Rechtsform konnte nicht gespeichert werden");
    }
  };

  // ---------------------------
  // Fetch Dashboard Data
  // ---------------------------
  const fetchData = async () => {
    if (!taxReady) return;
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
      console.error(err);
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
    fetchData();
  }, [taxReady, selectedCompany, yearFilter]);

  // ---------------------------
  // Overlay wenn keine Rechtsform
  // ---------------------------
  if (!taxReady) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Sexy Blur Hintergrund */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.5 }}
            className="relative z-50 w-full max-w-md rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 backdrop-blur-3xl p-8 shadow-2xl flex flex-col items-center space-y-6"
          >
            <h2 className="text-2xl font-extrabold text-white text-center">Bitte Rechtsform angeben</h2>

            <select
              value={profile.legal_form || ""}
              onChange={(e) => setProfile({ ...profile, legal_form: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Rechtsform wählen --</option>
              <option value="Einzelunternehmer">Einzelunternehmer</option>
              <option value="Freiberufler">Freiberufler</option>
              <option value="GmbH">GmbH</option>
              <option value="UG">UG</option>
            </select>

            <button
              onClick={saveLegalForm}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Speichern
            </button>

            {error && <p className="text-red-500 text-center">{error}</p>}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ---------------------------
  // Dashboard
  // ---------------------------
  return (
    <div className="space-y-8 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">
      {loading && <div className="text-center py-4">Lade Steuerdaten...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {/* Hier kommen die Charts, Cards, Filter etc. */}
    </div>
  );
}
