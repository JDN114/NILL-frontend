import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../ui/Card";

export default function BankInsights({ onUpload }) {

  const [activity, setActivity] = useState([]);
  const [connected, setConnected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMissing, setShowMissing] = useState(false);

  const load = async () => {

    try {

      const res = await api.get("/bank/activity");

      const data = res.data || {};

      setConnected(data.connected ?? false);
      setActivity(Array.isArray(data.activity) ? data.activity : []);

    } catch (e) {

      console.error("bank activity failed", e);

      setConnected(false);
      setActivity([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    load();

  }, []);

  const missing = activity.filter(a => a.status === "missing_invoice");

  if (loading) {

    return (
      <Card className="mb-6 p-4">
        Lade Bank Aktivität...
      </Card>
    );

  }

  return (

    <Card className="mb-6 p-4">

      <h2 className="font-semibold mb-4">Bank Aktivität</h2>

      {/* BANK NICHT VERBUNDEN */}

      {connected === false && (

        <div className="text-sm text-gray-400">

          Keine Bank verbunden.

        </div>

      )}

      {/* BANK VERBUNDEN ABER KEINE TRANSACTIONS */}

      {connected === true && activity.length === 0 && (

        <div className="text-sm text-gray-400">

          Mache deine erste Geschäftsausgabe.

        </div>

      )}

      {/* NORMALER STATE */}

      {activity.length > 0 && (

        <>

          {missing.length > 0 && (

            <div className="bg-yellow-900 p-3 rounded mb-4 flex justify-between items-center">

              <span>
                ⚠ {missing.length} Ausgaben ohne Rechnung
              </span>

              <button
                onClick={() => setShowMissing(true)}
                className="bg-yellow-600 px-3 py-1 rounded text-sm"
              >
                Anzeigen
              </button>

            </div>

          )}

          <div className="space-y-2">

            {activity.slice(0, 5).map((a) => (

              <div
                key={a.id}
                className="flex justify-between items-center text-sm border-b border-gray-800 pb-2"
              >

                <div>

                  <p className="font-medium">
                    {a.vendor || "Unbekannt"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(a.date).toLocaleDateString()}
                  </p>

                </div>

                <div className="text-right">

                  <p>
                    {a.amount.toFixed(2)} {a.currency}
                  </p>

                  {a.status === "matched" && (
                    <span className="text-green-400 text-xs">
                      ✓ Rechnung gefunden
                    </span>
                  )}

                  {a.status === "missing_invoice" && (
                    <span className="text-yellow-400 text-xs">
                      ⚠ Rechnung fehlt
                    </span>
                  )}

                  {a.status === "possible_match" && (
                    <span className="text-blue-400 text-xs">
                      mögliches Match
                    </span>
                  )}

                </div>

              </div>

            ))}

          </div>

        </>

      )}

      {showMissing && (

        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">

          <div className="bg-gray-900 p-6 rounded w-[500px] max-h-[80vh] overflow-y-auto">

            <h3 className="text-lg font-semibold mb-4">
              Fehlende Rechnungen
            </h3>

            {missing.map((m) => (

              <div
                key={m.id}
                className="flex justify-between items-center border-b border-gray-800 py-2"
              >

                <div>

                  <p>{m.vendor}</p>

                  <p className="text-xs text-gray-400">
                    {new Date(m.date).toLocaleDateString()}
                  </p>

                </div>

                <div className="text-right">

                  <p>
                    {m.amount.toFixed(2)} {m.currency}
                  </p>

                  <button
                    onClick={() => onUpload?.()}
                    className="bg-blue-600 px-2 py-1 rounded text-xs mt-1"
                  >
                    Rechnung hochladen
                  </button>

                </div>

              </div>

            ))}

            <div className="text-right mt-4">

              <button
                onClick={() => setShowMissing(false)}
                className="bg-gray-700 px-3 py-1 rounded"
              >
                Schließen
              </button>

            </div>

          </div>

        </div>

      )}

    </Card>

  );

}
