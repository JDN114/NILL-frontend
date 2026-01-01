/<<<</ src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import axios from "axios";

export default function AdminPage() {
  const authToken = localStorage.getItem("token");

  // ----------------------------
  // STATES
  // ----------------------------
  const [plans, setPlans] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [newPlan, setNewPlan] = useState({ name: "", price: "", features: "" });
  const [newCoupon, setNewCoupon] = useState({ code: "", discount_amount: "", valid_days: 30 });

  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  // ----------------------------
  // FETCH DATA
  // ----------------------------
  const fetchPlans = async () => {
    try {
      const res = await axios.get("/admin/plans", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/admin/coupons", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("/admin/analytics", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchCoupons();
    fetchAnalytics();
  }, []);

  // ----------------------------
  // CREATE PLAN
  // ----------------------------
  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.price || !newPlan.features) return;

    setLoadingPlan(true);
    try {
      const res = await axios.post(
        "/admin/plans",
        { ...newPlan, features: newPlan.features.split(",") },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setPlans((prev) => [...prev, res.data]);
      setNewPlan({ name: "", price: "", features: "" });
    } catch (err) {
      console.error(err);
    }
    setLoadingPlan(false);
  };

  // ----------------------------
  // CREATE COUPON
  // ----------------------------
  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount_amount) return;

    setLoadingCoupon(true);
    try {
      const res = await axios.post(
        "/admin/coupons",
        {
          ...newCoupon,
          discount_amount: parseFloat(newCoupon.discount_amount),
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setCoupons((prev) => [...prev, res.data]);
      setNewCoupon({ code: "", discount_amount: "", valid_days: 30 });
    } catch (err) {
      console.error(err);
    }
    setLoadingCoupon(false);
  };

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* ---------------------------- */}
      {/* ANALYTICS */}
      {/* ---------------------------- */}
      <Card title="Analytics">
        <div className="space-y-2 text-sm">
          <p>Total Users: {analytics?.total_users ?? "Lädt..."}</p>
          <p>Active Subscriptions: {analytics?.active_subscriptions ?? "Lädt..."}</p>
          <div>
            <strong>Plan Distribution:</strong>
            <ul className="ml-4">
              {analytics?.plan_distribution &&
                Object.entries(analytics.plan_distribution).map(([plan, count]) => (
                  <li key={plan}>{plan}: {count}</li>
                ))
              }
            </ul>
          </div>
          <p>Redeemed Coupons: {analytics?.redeemed_coupons ?? "Lädt..."}</p>
        </div>
      </Card>

      {/* ---------------------------- */}
      {/* PLAN VERWALTUNG */}
      {/* ---------------------------- */}
      <Card title="Pläne verwalten" className="mt-6">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
          <input
            type="number"
            placeholder="Preis (EUR/Monat)"
            value={newPlan.price}
            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
          <input
            type="text"
            placeholder="Features (kommagetrennt)"
            value={newPlan.features}
            onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
          <button
            onClick={handleCreatePlan}
            disabled={loadingPlan}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:opacity-90"
          >
            {loadingPlan ? "Erstellt..." : "Plan erstellen"}
          </button>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Bestehende Pläne:</h4>
          <ul className="list-disc ml-5">
            {plans.map((p) => (
              <li key={p.id}>
                {p.name} – {p.price}€ – Features: {p.features}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* ---------------------------- */}
      {/* COUPON VERWALTUNG */}
      {/* ---------------------------- */}
      <Card title="Coupons verwalten" className="mt-6">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Coupon Code"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
          <input
            type="number"
            placeholder="Discount Betrag (EUR)"
            value={newCoupon.discount_amount}
            onChange={(e) => setNewCoupon({ ...newCoupon, discount_amount: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
          <input
            type="number"
            placeholder="Gültigkeit (Tage)"
            value={newCoupon.valid_days}
            onChange={(e) => setNewCoupon({ ...newCoupon, valid_days: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
          <button
            onClick={handleCreateCoupon}
            disabled={loadingCoupon}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:opacity-90"
          >
            {loadingCoupon ? "Erstellt..." : "Coupon erstellen"}
          </button>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Bestehende Coupons:</h4>
          <ul className="list-disc ml-5">
            {coupons.map((c) => (
              <li key={c.id}>
                {c.code} – {c.amount}€ – Gültig bis: {new Date(c.valid_until).toLocaleDateString()} – Aktiv: {c.is_active ? "Ja" : "Nein"}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </PageLayout>
  );
}
