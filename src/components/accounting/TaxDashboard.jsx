import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function TaxDashboard() {

  const [forms, setForms] = useState([]);
  const [legalForm, setLegalForm] = useState("");
  const [selectedForm, setSelectedForm] = useState("");

  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // -----------------------------
  // LOAD OPTIONS
  // -----------------------------
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await api.get("/tax/business-profile/options");
        setForms(res.data?.forms || []);
      } catch (e) {
        console.error("Options error", e);
      }
    };

    loadOptions();
  }, []);

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
        }

      } catch (e) {
        console.error("Profile error", e);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // -----------------------------
  // LOAD SUMMARY
  // -----------------------------
  useEffect(() => {
    if (!legalForm) return;

    const loadSummary = async () => {
      try {
        const res = await api.get("/tax/summary");
        setSummary(res.data || {});
      } catch (e) {
        console.error("Summary error", e);
      }
    };

    loadSummary();
  }, [legalForm]);

  // -----------------------------
  // SAVE LEGAL FORM
  // -----------------------------
  const saveLegalForm = async () => {
    if (!selectedForm) return;

    try {
      setSaving(true);

      await api.post(
        `/tax/business-profile/legal-form?legal_form=${selectedForm}`
      );

      setLegalForm(selectedForm);
      setShowModal(false);

    } catch (e) {
      console.error("Save error", e);
      alert("Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return <div className="p-10 text-center">Lade...</div>;
  }

  return (
    <div className="relative">

      {/* DASHBOARD */}
      <div className={`${!legalForm ? "blur-md pointer-events-none" : ""} transition`}>

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

        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

          <div className="relative z-10 w-[420px] rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 shadow-xl border border-white/10">

            <h2 className="text-2xl text-white mb-6 text-center">
              Rechtsform festlegen
            </h2>

            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-6"
            >
              <option value="">Bitte wählen</option>

              {forms.map((f, i) => (
                <option key={i} value={f.legal_form}>
                  {f.legal_form}
                </option>
              ))}

            </select>

            <button
              onClick={saveLegalForm}
              disabled={!selectedForm || saving}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium"
            >
              {saving ? "Speichern..." : "Bestätigen"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

// -----------------------------
// CARD
// -----------------------------
function Card({ title, value }) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl text-center border border-white/5">
      <p className="text-gray-400">{title}</p>
      <p className="text-xl text-white">
        {Number(value || 0).toFixed(2)} €
      </p>
    </div>
  );
}
