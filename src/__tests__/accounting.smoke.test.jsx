// Smoke tests for critical accounting actions.
// These mutations (chart-of-accounts init, ELSTER + DATEV export) all run
// through the shared api.js instance, so they must reach the right endpoints
// and — being state-changing — carry CSRF protection.
import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted runs before the hoisted vi.mock factory below.
const { captured, post, get, instance } = vi.hoisted(() => {
  const captured = { requestInterceptor: null };
  const post = vi.fn();
  const get = vi.fn();
  const instance = {
    post,
    get,
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: (fn) => { captured.requestInterceptor = fn; } },
    },
  };
  return { captured, post, get, instance };
});

vi.mock("axios", () => ({ default: { create: () => instance } }));

import api from "../services/api";

beforeEach(() => {
  post.mockReset();
  get.mockReset();
  document.cookie = "csrf_t=acct-csrf;path=/";
});

describe("critical accounting actions", () => {
  it("initializes the chart of accounts (kontenrahmen) via POST", async () => {
    post.mockResolvedValue({ data: {} });
    await api.post("/api/v1/buchhaltung/kontenrahmen/init");
    expect(post).toHaveBeenCalledWith("/api/v1/buchhaltung/kontenrahmen/init");
  });

  it("submits an ELSTER export as a blob download", async () => {
    post.mockResolvedValue({ data: new Blob(["<xml/>"]) });
    const payload = { von: "2026-01-01", bis: "2026-03-31", steuernummer: "12345" };
    const r = await api.post("/api/v1/buchhaltung/export/elster", payload, { responseType: "blob" });
    expect(post).toHaveBeenCalledWith(
      "/api/v1/buchhaltung/export/elster",
      payload,
      { responseType: "blob" }
    );
    expect(r.data).toBeInstanceOf(Blob);
  });

  it("protects state-changing accounting requests with the CSRF token", () => {
    const cfg = captured.requestInterceptor({
      method: "post",
      url: "/api/v1/buchhaltung/export/elster",
      headers: {},
    });
    expect(cfg.headers["X-CSRF-Token"]).toBe("acct-csrf");
  });

  it("does not attach a CSRF token to read-only report fetches", () => {
    const cfg = captured.requestInterceptor({
      method: "get",
      url: "/api/v1/buchhaltung/datev",
      headers: {},
    });
    expect(cfg.headers["X-CSRF-Token"]).toBeUndefined();
  });
});
