// src/services/AdminService.js
import api from "./api";

/**
 * Interner Helper: standardisierte Fehler
 */
function handleAdminError(err, fallbackMessage) {
  const status = err?.response?.status;

  if (status === 401) {
    throw new Error("Nicht authentifiziert");
  }

  if (status === 403) {
    throw new Error("Keine Admin-Berechtigung");
  }

  throw new Error(
    err?.response?.data?.detail ||
    fallbackMessage ||
    "Unerwarteter Serverfehler"
  );
}

// ----------------------------
// PLANS
// ----------------------------
export async function fetchPlans() {
  try {
    const res = await api.get("/admin/plans");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    handleAdminError(err, "Pläne konnten nicht geladen werden");
    return []; // unreachable, aber für Type-Safety
  }
}

export async function createPlan(plan) {
  if (!plan || typeof plan !== "object") {
    throw new Error("Ungültige Plan-Daten");
  }

  try {
    const res = await api.post("/admin/plans", plan);
    return res.data;
  } catch (err) {
    handleAdminError(err, "Plan konnte nicht erstellt werden");
  }
}

// ----------------------------
// COUPONS
// ----------------------------
export async function fetchCoupons() {
  try {
    const res = await api.get("/admin/coupons");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    handleAdminError(err, "Coupons konnten nicht geladen werden");
    return [];
  }
}

export async function createCoupon(coupon) {
  if (!coupon || typeof coupon !== "object") {
    throw new Error("Ungültige Coupon-Daten");
  }

  try {
    const res = await api.post("/admin/coupons", coupon);
    return res.data;
  } catch (err) {
    handleAdminError(err, "Coupon konnte nicht erstellt werden");
  }
}

// ----------------------------
// ANALYTICS
// ----------------------------
export async function fetchAnalytics() {
  try {
    const res = await api.get("/admin/analytics");
    return res.data ?? {
      total_users: 0,
      active_subscriptions: 0,
      redeemed_coupons: 0,
    };
  } catch (err) {
    handleAdminError(err, "Analytics konnten nicht geladen werden");
    return {
      total_users: 0,
      active_subscriptions: 0,
      redeemed_coupons: 0,
    };
  }
}
