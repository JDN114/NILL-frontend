// src/components/AccountingSettings.jsx
import { useEffect, useState } from "react";
import Card from "./ui/Card";
import api from "../services/api";

export default function AccountingSettings() {
  const [connected, setConnected] = useState(false);
  const [standardCurrency, setStandardCurrency] = useState("EUR");
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const [settingsRes, bankRes] = await Promise.all([
        api.get("/api/v1/bank/settings"),
        api.get("/api/v1/bank/status"),
      ]);

      setStandardCurrency(settingsRes.data.standardCurrency || "EUR");
      setConnected(bankRes.data.connected || false);
    } catch (err) {
      console.error("Accounting settings load failed", err);
      setError("Einstellungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleConnectBank = () => {
    window.location.href = `${api.defaults.baseURL}/api/v1/bank/connect`;
  };

  const handleDisconnectBank = async () => {
    try {
      await api.post("/api/v1/bank/disconnect");
      setConnected(false);
    } catch (err) {
      console.error("Bank disconnect failed", err);
      setError("Bankverbindung konnte nicht getrennt werden.");
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);

      const res = await api.get("/api/v1/buchhaltung/export/datev", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "datev_export.csv");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
      setError("Export konnte nicht durchgeführt werden.");
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <Card title="Buchhaltung" className="rounded-2xl shadow-md">
        <p className="text-gray-400">Lade Buchhaltungseinstellungen...</p>
      </Card>
    );
  }

  return (
    <Card title="Buchhaltung" className="rounded-2xl shadow-md space-y-6">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div>
        <p className="text-sm text-gray-400">Bankverbindung</p>

        {connected ? (
          <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
            <span className="text-green-400">✓ Bank verbunden</span>

            <button
              onClick={handleDisconnectBank}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-white transition"
            >
              Trennen
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectBank}
            className="px-4 py-2 bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] rounded-xl text-white transition"
          >
            Bank verbinden
          </button>
        )}
      </div>

      <div>
        <label htmlFor="currency-select" className="text-sm text-gray-400">Standardwährung</label>

        <select
          id="currency-select"
          value={standardCurrency}
          onChange={(e) => setStandardCurrency(e.target.value)}
          className="mt-2 p-2 rounded-xl bg-gray-800 text-white w-full"
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      <div>
        <button
          onClick={handleExport}
          disabled={exportLoading}
          className="px-4 py-2 rounded-xl text-white transition bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportLoading ? "Export läuft..." : "DATEV-Export / Steuer-Vorbereitung"}
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Exportiert alle Buchungen als DATEV-CSV für Ihren Steuerberater.
          {!connected && " (Tipp: Bankkonto verbinden für vollständige Kontoumsätze.)"}
        </p>
      </div>
    </Card>
  );
}
