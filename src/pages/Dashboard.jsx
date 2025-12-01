kimport React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // -----------------------------
    // Load emails from backend
    // -----------------------------
    const loadEmails = async () => {
        try {
            const res = await axios.get("/email-pipeline/all");
            setEmails(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Manual Re-Analyze
    // -----------------------------
    const reanalyzeEmail = async (id) => {
        try {
            await axios.post(`/email-pipeline/analyze/${id}`);
            loadEmails();
        } catch (err) {
            console.error(err);
        }
    };

    // -----------------------------
    // Refresh ALL emails
    // -----------------------------
    const refreshAll = async () => {
        setRefreshing(true);
        try {
            await axios.post("/email-pipeline/refresh");
            await loadEmails();
        } catch (err) {
            console.error(err);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        loadEmails();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <h1 className="text-4xl font-bold mb-6">📨 KI Email Dashboard</h1>

            {/* Refresh all button */}
            <button
                onClick={refreshAll}
                className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
            >
                {refreshing ? "Verarbeite..." : "🔄 Alle neu analysieren"}
            </button>

            {/* Loading state */}
            {loading && <p className="text-gray-400">Lade Emails...</p>}

            {/* No emails */}
            {!loading && emails.length === 0 && (
                <p className="text-gray-500 mt-4">Keine Emails vorhanden.</p>
            )}

            {/* Email Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {emails.map((email) => (
                    <motion.div
                        key={email.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition"
                    >
                        <h2 className="text-xl font-bold">{email.subject}</h2>
                        <p className="text-gray-300 mt-2">{email.body}</p>

                        {/* AI summary */}
                        {email.summary && (
                            <p className="mt-3 text-gray-400 italic">
                                🧠 Zusammenfassung: {email.summary}
                            </p>
                        )}

                        {/* Priority badge */}
                        {email.priority && (
                            <span className="inline-block mt-3 px-3 py-1 bg-red-600 text-white rounded">
                                PRIORITÄT: {email.priority}
                            </span>
                        )}

                        {/* Action items */}
                        {email.actions && (
                            <div className="mt-3 text-sm text-blue-300">
                                📌 Aktionen:
                                <ul className="list-disc ml-6">
                                    {email.actions.map((a, i) => (
                                        <li key={i}>{a}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={() => reanalyzeEmail(email.id)}
                            className="mt-4 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                        >
                            🔁 Neu analysieren
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
