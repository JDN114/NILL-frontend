// src/services/adminService.js
import api from "./api";

// ----------------------------
// PLANS
// ----------------------------
export const fetchPlans = async () => {
  const res = await api.get("/admin/plans");
  return res.data;
};

export const createPlan = async (plan) => {
  // plan = { name, price, features: ["f1", "f2"], stripe_product_id?, stripe_price_id? }
  const res = await api.post("/admin/plans", plan);
  return res.data;
};

// ----------------------------
// COUPONS
// ----------------------------
export const fetchCoupons = async () => {
  const res = await api.get("/admin/coupons");
  return res.data;
};

export const createCoupon = async (coupon) => {
  // coupon = { code, discount_amount, valid_days, max_uses }
  const res = await api.post("/admin/coupons", coupon);
  return res.data;
};

// ----------------------------
// ANALYTICS
// ----------------------------
export const fetchAnalytics = async () => {
  const res = await api.get("/admin/analytics");
  return res.data;
};
