import React, { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { fetchPlans, fetchCoupons, fetchAnalytics, createPlan, createCoupon } from "../services/adminService";

export default function AdminPage() {
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
  const loadData = async () => {
    try {
      const [plansRes, couponsRes, analyticsRes] = await Promise.all([
        fetchPlans(),
        fetchCoupons(),
        fetchAnalytics(),
      ]);

      setPlans(Array.isArray(plansRes) ? plansRes : []);
      setCoupons(Array.isArray(couponsRes) ? couponsRes : []);
      setAnalytics(analyticsRes || null);
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ----------------------------
  // CREATE PLAN
  // ----------------------------
  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.price || !newPlan.features) return;
    setLoadingPlan(true);

    try {
      const plan = await createPlan({
        ...newPlan,
        features: newPlan.features.split(",").map(f => f.trim()),
      });
      setPlans(prev => [...prev, plan]);
      setNewPlan({ name: "", price: "", features: "" });
    } catch (err) {
      console.error("Error creating plan:", err);
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
      const coupon = await createCoupon({
        ...newCoupon,
        discount_amount: parseFloat(newCoupon.discount_amount),
      });
      setCoupons(prev => [...prev, coupon]);
      setNewCoupon({ code: "", discount_amount: "", valid_days: 30 });
    } catch (err) {
      console.error("Error creating coupon:", err);
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
                {p.name} – {p.price}€ – Features: {Array.isArray(p.features) ? p.features.join(", ") : p.features}
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
            {loadingCoupon ? "Erstellt..." : "Ich habe einen Code"}
          </button>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Bestehende Coupons:</h4>
          <ul className="list-disc ml-5">
            {(coupons || []).map((c) => (
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
