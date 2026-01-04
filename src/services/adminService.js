// src/services/adminService.js
import api from "./api";

// Pläne
export const fetchPlans = async () => {
  const res = await api.get("/admin/plans");
  return res.data;
};

export const createPlan = async (plan) => {
  const res = await api.post("/admin/plans", plan);
  return res.data;
};

// Coupons
export const fetchCoupons = async () => {
  const res = await api.get("/admin/coupons");
  return res.data;
};

export const createCoupon = async (coupon) => {
  const res = await api.post("/admin/coupons", coupon);
  return res.data;
};

// Analytics
export const fetchAnalytics = async () => {
  const res = await api.get("/admin/analytics");
  return res.data;
};
