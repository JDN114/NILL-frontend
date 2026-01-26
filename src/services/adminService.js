// src/services/adminService.js
import api from "./api";

// Helper für sichere API Calls
const safeApiCall = async (fn, defaultValue = null) => {
  try {
    const res = await fn();
    return res?.data ?? defaultValue;
  } catch (err) {
    console.error("API Fehler:", err?.response?.data || err.message || err);
    return defaultValue;
  }
};

// ============================
// PLÄNE
// ============================
export const fetchPlans = async () => safeApiCall(() => api.get("/admin/plans"), []);
export const createPlan = async (plan) => safeApiCall(() => api.post("/admin/plans", plan), null);

// ============================
// COUPONS
// ============================
export const fetchCoupons = async () => safeApiCall(() => api.get("/admin/coupons"), []);
export const createCoupon = async (coupon) => safeApiCall(() => api.post("/admin/coupons", coupon), null);

// ============================
// ANALYTICS
// ============================
export const fetchAnalytics = async () => safeApiCall(() => api.get("/admin/analytics"), {});
