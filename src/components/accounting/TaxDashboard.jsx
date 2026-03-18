import React, { useEffect, useState } from "react";
import api from "../../services/api";
import dayjs from "dayjs";

const LOCAL_STORAGE_KEY = "nill_legal_form";

export default function TaxDashboard() {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [refundSummary, setRefundSummary] = useState(null);

  const [legalForm, setLegalForm] = useState(
    localStorage.getItem(LOCAL_STORAGE_KEY) || ""
  );

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // LOAD PROFILE
  // -----------------------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/tax/business-profile");

        if (!res.data?.legal_form) {
          setShowModal(true);
        } else {
          setLegalForm(res.data.legal_form);
          localStorage.setItem(LOCAL_STORAGE_KEY, res.data.legal_form);
          setShowModal(false);
        }
      } catch (e) {
        console.error("Profile load failed", e);
        setShowModal(true);
      }
    };

    if (!legalForm) loadProfile();
  }, []);

  // -----------------------------
  // LOAD DASHBOARD
  // -----------------------------
  useEffect(() => {
    if (!legalForm) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [s, r, m, c, roll] = await Promise.all([
          api.get("/tax/summary"),
          api.get("/tax/refund-summary"),
          api.get("/tax/chart/monthly"),
          api.get("/tax/chart/category"),
          api.get("/tax/chart/rolling"),
        ]);

        setSummary(s.data || {});
        setRefundSummary(r.data || {});
        setMonthly(m.data?.monthly_data || []);
        setCategory(c.data?.categories || []);
        setRolling(roll.data?.rolling || []);
      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [legalForm]);

  // -----------------------------
  // SAVE PROFILE
  // -----------------------------
  const saveProfile = async () => {
    if (!legalForm) return;

    try {
      await api.post("/tax/business-profile", {
        legal_form: legalForm,
      });

      localStorage.setItem(LOCAL_STORAGE_KEY, legalForm);
      setShowModal(false);
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  // -----------------------------
  // MODAL
  // -----------------------------
  if (!legalForm && showModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl">
        <div className="bg-zinc-900 p-8 rounded-2xl w-[400px] text-center shadow-xl">
          <h2 className="text-white text-xl mb-4">
            Rechtsform angeben
          </h2>

          <select
            value={legalForm}
            onChange={(e) => setLegalForm(e.target.value)}
            className="w-full p-3 rounded bg-zinc-800 text-white mb-4"
          >
            <option value="">Auswählen</option>
            <option value="Einzelunternehmer">Einzelunternehmer</option>
            <option value="Freiberufler">Freiberufler</option>
            <option value="GmbH">GmbH</option>
            <option value="UG">UG</option>
          </select>

          <button
            onClick={saveProfile}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded text-white"
          >
            Speichern
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return <div className="text-center p-10">Lade...</div>;
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-6 space-y-6">

      <div className="grid grid-cols-3 gap-4">
        <Card title="Gewinn" value={summary?.profit} />
        <Card title="Steuern" value={summary?.tax_total} />
        <Card title="Netto" value={summary?.net_after_tax} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Vorsteuer" value={summary?.vat?.input} />
        <Card title="USt" value={summary?.vat?.output} />
        <Card title="Erstattung" value={summary?.vat?.refund} />
      </div>

      <div className="bg-zinc-900 p-4 rounded">
        <h3 className="text-white mb-2">Refund Übersicht</h3>
        <p className="text-gray-400">
          {refundSummary?.current_year?.year}:{" "}
          {refundSummary?.current_year?.vat_balance || 0} €
        </p>
        <p className="text-gray-400">
          {refundSummary?.last_year?.year}:{" "}
          {refundSummary?.last_year?.vat_balance || 0} €
        </p>
      </div>

    </div>
  );
}

// -----------------------------
// CARD
// -----------------------------
function Card({ title, value }) {
  return (
    <div className="bg-zinc-900 p-4 rounded text-center">
      <p className="text-gray-400">{title}</p>
      <p className="text-xl text-white">
        {Number(value || 0).toFixed(2)} €
      </p>
    </div>
  );
}
