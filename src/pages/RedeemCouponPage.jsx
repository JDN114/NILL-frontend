// src/pages/RedeemCouponPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* Mobile-only polish — all rules inside the media query, desktop untouched.
   16px input (no iOS zoom), 52px CTA, :active feedback, tighter card. */
const RC_MOBILE_CSS = `
  @media (max-width: 768px) {
    .rc-wrap {
      padding-left: 16px !important;
      padding-right: 16px !important;
      align-items: flex-start !important;
      padding-top: 12vh;
      min-height: 100dvh !important;
    }
    .rc-card {
      padding: 26px 20px !important;
      border-radius: 18px !important;
    }
    .rc-title {
      font-family: 'Fraunces', Georgia, serif !important;
      font-weight: 400 !important;
      font-size: 1.7rem !important;
      letter-spacing: -0.02em;
      margin-bottom: 0.6rem !important;
    }
    .rc-sub { margin-bottom: 1.4rem !important; }
    .rc-input {
      font-size: 16px !important;
      min-height: 52px;
      border-radius: 12px !important;
    }
    .rc-btn {
      min-height: 52px;
      font-size: 16px !important;
      border-radius: 12px !important;
      margin-top: 1.1rem !important;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      transition: transform 0.12s, opacity 0.15s;
    }
    .rc-btn:active { transform: scale(0.98); }
  }
`;

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
    <section className="rc-wrap min-h-screen flex items-center justify-center bg-gradient-to-br from-[#03060a] to-[#071023] text-white px-6">
      <style>{RC_MOBILE_CSS}</style>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rc-card glass max-w-md w-full p-10 rounded-2xl shadow-xl"
      >
        <h1 className="rc-title text-3xl font-bold mb-4 text-white">Coupon einlösen</h1>
        <p className="rc-sub text-gray-300 mb-8 text-sm">
          Erhalte vollen Zugriff auf alle NILL-Features. Einfach Coupon-Code eingeben.
        </p>

        <input
          type="text"
          placeholder="Coupon Code eingeben..."
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="rc-input w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white outline-none focus:border-[var(--accent)] transition"
          autoComplete="off"
        />

        <button
          onClick={handleRedeem}
          disabled={loading || !coupon.trim()}
          className={`rc-btn w-full mt-6 py-3 rounded-lg font-semibold transition
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
