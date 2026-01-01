// src/pages/RedeemCouponPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RedeemCouponPage() {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const authToken = localStorage.getItem("token"); // Auth-Header

  const handleRedeem = async () => {
    if (!coupon.trim()) {
      setMessage({ text: "❌ Bitte einen Coupon-Code eingeben", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.post(
        "http://YOUR_SERVER_IP:8000/subscription/redeem-coupon",
        { code: coupon.trim() },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (res.data.status === "success") {
        setMessage({ text: "🎉 Coupon erfolgreich eingelöst! Features freigeschaltet!", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1800);
      } else {
        setMessage({ text: "❌ Ungültiger oder abgelaufener Coupon", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "❌ Fehler beim Einlösen des Coupons", type: "error" });
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#03060a] to-[#071023] text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass max-w-md w-full p-10 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-4 text-white">Coupon einlösen</h1>
        <p className="text-gray-300 mb-8 text-sm">
          Erhalte vollen Zugriff auf alle NILL-Features. Einfach Coupon-Code eingeben.
        </p>

        <input
          type="text"
          placeholder="Coupon Code eingeben..."
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white outline-none focus:border-[var(--accent)] transition"
        />

        <button
          onClick={handleRedeem}
          disabled={loading || !coupon.trim()}
          className={`w-full mt-6 py-3 rounded-lg font-semibold transition
            ${loading || !coupon.trim() ? "bg-gray-700 cursor-not-allowed" : "bg-[var(--accent)] hover:opacity-90"}`}
        >
          {loading ? "Überprüfung..." : "Einlösen"}
        </button>

        {message.text && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`text-center mt-4 font-medium ${message.type === "success" ? "text-green-400" : "text-red-400"}`}
          >
            {message.text}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
