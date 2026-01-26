import React, { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import {
  fetchPlans,
  fetchCoupons,
  fetchAnalytics,
  createPlan,
  createCoupon,
} from "../services/adminService";

export default function AdminPage() {
  const [plans, setPlans] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_users: 0,
    active_subscriptions: 0,
    redeemed_coupons: 0,
  });

  const [newPlan, setNewPlan] = useState({ name: "", price: "", features: "" });
  const [newCoupon, setNewCoupon] = useState({ code: "", discount_amount: "", valid_days: 30 });

  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [errorPlan, setErrorPlan] = useState(null);
  const [errorCoupon, setErrorCoupon] = useState(null);

  // ----------------------------
  // Daten laden
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
      setAnalytics({
        total_users: analyticsRes?.total_users ?? 0,
        active_subscriptions: analyticsRes?.active_subscriptions ?? 0,
        redeemed_coupons: analyticsRes?.redeemed_coupons ?? 0,
      });
    } catch (err) {
      console.error("Fehler beim Laden der Admin-Daten:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ----------------------------
  // Plan erstellen
  // ----------------------------
  const handleCreatePlan = async () => {
    setErrorPlan(null);

    if (!newPlan.name.trim() || !newPlan.price || !newPlan.features.trim()) {
      setErrorPlan("Bitte Name, Preis und Features angeben.");
      return;
    }

    const price = parseFloat(newPlan.price);
    if (isNaN(price) || price < 0) {
      setErrorPlan("Preis muss eine positive Zahl sein.");
      return;
    }

    const features = newPlan.features
      .split(",")
      .map(f => f.trim())
      .filter(f => f);

    if (features.length === 0) {
      setErrorPlan("Bitte mindestens ein Feature angeben.");
      return;
    }

    setLoadingPlan(true);
    try {
      const plan = await createPlan({ name: newPlan.name.trim(), price, features });
      setPlans(prev => [...prev, plan]);
      setNewPlan({ name: "", price: "", features: "" });
    } catch (err) {
      console.error(err);
      setErrorPlan("Plan konnte nicht erstellt werden.");
    } finally {
      setLoadingPlan(false);
    }
  };

  // ----------------------------
  // Coupon erstellen
  // ----------------------------
  const handleCreateCoupon = async () => {
    setErrorCoupon(null);

    if (!newCoupon.code.trim() || !newCoupon.discount_amount) {
      setErrorCoupon("Bitte Code und Rabattbetrag angeben.");
      return;
    }

    const discount = parseFloat(newCoupon.discount_amount);
    const validDays = parseInt(newCoupon.valid_days, 10);

    if (isNaN(discount) || discount <= 0) {
      setErrorCoupon("Rabattbetrag muss positiv sein.");
      return;
    }

    if (isNaN(validDays) || validDays <= 0) {
      setErrorCoupon("Gültigkeit muss positiv sein.");
      return;
    }

    setLoadingCoupon(true);
    try {
      const coupon = await createCoupon({
        code: newCoupon.code.trim(),
        discount_amount: discount,
        valid_days: validDays,
      });
      setCoupons(prev => [...prev, coupon]);
      setNewCoupon({ code: "", discount_amount: "", valid_days: 30 });
    } catch (err) {
      console.error(err);
      setErrorCoupon("Coupon konnte nicht erstellt werden.");
    } finally {
      setLoadingCoupon(false);
    }
  };

  // ----------------------------
  // JSX
  // ----------------------------
  return (
    <PageLayout>
      <h1 className="text-4xl font-bold mb-8 text-white">Admin Dashboard</h1>

      {/* ANALYTICS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Users" className="text-center text-lg font-semibold">{analytics.total_users}</Card>
        <Card title="Active Subscriptions" className="text-center text-lg font-semibold text-green-400">{analytics.active_subscriptions}</Card>
        <Card title="Redeemed Coupons" className="text-center text-lg font-semibold text-red-400">{analytics.redeemed_coupons}</Card>
      </div>

      {/* PLAN VERWALTUNG */}
      <Card title="Pläne verwalten" className="mb-8">
        {errorPlan && <p className="text-red-400 mb-2">{errorPlan}</p>}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input type="text" placeholder="Name" value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"/>
          <input type="number" placeholder="Preis" value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: e.target.value })} className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"/>
          <input type="text" placeholder="Features (kommagetrennt)" value={newPlan.features} onChange={e => setNewPlan({ ...newPlan, features: e.target.value })} className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"/>
          <button onClick={handleCreatePlan} disabled={loadingPlan} className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:opacity-90 disabled:opacity-50">
            {loadingPlan ? "Erstellt..." : "Plan erstellen"}
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((p, idx) => (
            <div key={p.id || idx} className="p-4 bg-gray-900 rounded-lg shadow hover:shadow-lg transition">
              <h4 className="font-bold text-lg">{p.name}</h4>
              <p>{p.price}€/Monat</p>
              <p>Features: {Array.isArray(p.features) ? p.features.join(", ") : p.features}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* COUPON VERWALTUNG */}
      <Card title="Coupons verwalten">
        {errorCoupon && <p className="text-red-400 mb-2">{errorCoupon}</p>}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input type="text" placeholder="Coupon Code" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"/>
          <input type="number" placeholder="Discount Betrag" value={newCoupon.discount_amount} onChange={e => setNewCoupon({ ...newCoupon, discount_amount: e.target.value })} className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"/>
          <input type="number" placeholder="Gültigkeit (Tage)" value={newCoupon.valid_days} onChange={e => setNewCoupon({ ...newCoupon, valid_days: e.target.value })} className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"/>
          <button onClick={handleCreateCoupon} disabled={loadingCoupon} className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:opacity-90 disabled:opacity-50">
            {loadingCoupon ? "Erstellt..." : "Coupon erstellen"}
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {coupons.map((c, idx) => (
            <div key={c.id || idx} className={`p-3 rounded-lg shadow ${c.is_active ? "bg-green-900" : "bg-red-900"} text-white`}>
              <h5 className="font-bold">{c.code}</h5>
              <p>Betrag: {c.amount}€</p>
              <p>Gültig bis: {c.valid_until ? new Date(c.valid_until).toLocaleDateString() : "N/A"}</p>
              <p>Status: {c.is_active ? "Aktiv" : "Inaktiv"}</p>
            </div>
          ))}
        </div>
      </Card>
    </PageLayout>
  );
}
