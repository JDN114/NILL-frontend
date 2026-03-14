// src/components/AccountingSettings.jsx
import { useEffect, useState } from "react";
import Card from "./ui/Card";
import api from "../services/api";

export default function AccountingSettings() {
  const [bankAccount, setBankAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [standardCurrency, setStandardCurrency] = useState("EUR");
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------------
  // Lade Buchhaltungseinstellungen & Bankstatus
  // -------------------------------
  useEffect(() => {
    let mounted = true;

    const loadAccountingSettings = async () => {
      setLoading(true);
      setError(null);

      try {
        const [settingsRes, bankRes] = await Promise.all([
          api.get("/accounting/settings"),
          api.get("/accounting/bank-accounts"),
        ]);

        if (!mounted) return;

        setStandardCurrency(settingsRes.data.standardCurrency || "EUR");

        if (bankRes.data?.length > 0) {
          const account = bankRes.data[0]; // aktuell nur 1 Konto pro User
          setBankAccount(account);
          setConnected(account.connected);
          setLastSync(account.lastSync);
        } else {
          setBankAccount(null);
          setConnected(false);
        }
      } catch (err) {
        console.error("Accounting settings load failed", err);
        if (mounted) setError("Einstellungen konnten nicht geladen werden.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAccountingSettings();

    return () => { mounted = false; };
  }, []);

  // -------------------------------
  // Bank verbinden
  // -------------------------------
  const handleConnectBank = async () => {
    try {
      const res = await api.post("/accounting/bank-accounts/connect");
      if (res.data?.oauthUrl) {
        window.location.href = res.data.oauthUrl;
      }
    } catch (err) {
      console.error("Bank connect failed", err);
      setError("Bankverbindung konnte nicht gestartet werden.");
    }
  };

  // -------------------------------
  // Bank trennen
  // -------------------------------
  const handleDisconnectBank = async () => {
    try {
      await api.post("/accounting/bank-accounts/disconnect");
      setConnected(false);
      setBankAccount(null);
      setLastSync(null);
    } catch (err) {
      console.error("Bank disconnect failed", err);
      setError("Bankverbindung konnte nicht getrennt werden.");
    }
  };

  // -------------------------------
  // Steuer-Export
  // -------------------------------
  const handleExport = async () => {
    try {
      setExportLoading(true);
      const res = await api.get("/accounting/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoices_export.xlsx");
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
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Bankkonto */}
      <div>
        <p className="text-sm text-gray-400">Bankkonto</p>
        {connected ? (
          <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
            <span>{bankAccount?.bankName || "Verbundenes Konto"}</span>
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
        {lastSync && (
          <p className="text-xs text-gray-500 mt-1">
            Letzte Synchronisation: {new Date(lastSync).toLocaleString()}
          </p>
        )}
      </div>

      {/* Standardwährung */}
      <div>
        <p className="text-sm text-gray-400">Standardwährung</p>
        <select
          value={standardCurrency}
          onChange={e => setStandardCurrency(e.target.value)}
          className="mt-2 p-2 rounded-xl bg-gray-800 text-white w-full"
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Export / Steuer-Vorbereitung */}
      <div>
        <button
          onClick={handleExport}
          disabled={exportLoading || !connected}
          className={`px-4 py-2 rounded-xl text-white transition ${
            connected
              ? "bg-green-600 hover:bg-green-500"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          {exportLoading ? "Export läuft..." : "Export / Steuer-Vorbereitung"}
        </button>
        {!connected && (
          <p className="text-xs text-gray-500 mt-1">
            Bitte zuerst ein Bankkonto verbinden.
          </p>
        )}
      </div>
    </Card>
  );
}
