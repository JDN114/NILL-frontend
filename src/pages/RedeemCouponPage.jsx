// src/pages/RedeemCouponPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RedeemCouponPage() {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleRedeem = async () => {
    const code = coupon.trim();
    if (!code) {
      setMessage({ text: "❌ Bitte einen Coupon-Code eingeben", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await api.post("/subscription/redeem-coupon", { code });

      if (res?.data?.status === "success") {
        setMessage({
          text: "🎉 Coupon erfolgreich eingelöst! Features freigeschaltet!",
          type: "success",
        });

        // Kurze Verzögerung für UX, danach weiterleiten
        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
      } else {
        setMessage({
          text: res?.data?.message || "❌ Ungültiger oder abgelaufener Coupon",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Coupon redeem error:", err);
      setMessage({
        text: "❌ Fehler beim Einlösen des Coupons. Bitte versuche es später erneut.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
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
          autoComplete="off"
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
            className={`text-center mt-4 font-medium ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
