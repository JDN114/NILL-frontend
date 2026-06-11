// Smoke tests for the auth flow (src/services/api.js).
// Verifies the auth helpers hit the correct endpoints and that the shared
// axios instance attaches the CSRF token to state-changing requests only.
import { describe, it, expect, vi, beforeEach } from "vitest";

// Capture the request interceptor and spy on the instance methods so we can
// assert what api.js does without a real network. vi.hoisted runs before the
// hoisted vi.mock factory, so the shared spies exist when axios.create is called.
const { captured, post, get, del, instance } = vi.hoisted(() => {
  const captured = { requestInterceptor: null };
  const post = vi.fn();
  const get = vi.fn();
  const del = vi.fn();
  const instance = {
    post,
    get,
    delete: del,
    interceptors: {
      request: { use: (fn) => { captured.requestInterceptor = fn; } },
    },
  };
  return { captured, post, get, del, instance };
});

vi.mock("axios", () => ({ default: { create: () => instance } }));

// Imported after the mock so api.js picks up the fake axios instance.
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../services/api";

beforeEach(() => {
  post.mockReset();
  get.mockReset();
  del.mockReset();
  // Clear cookies between tests.
  document.cookie
    .split(";")
    .forEach((c) => {
      document.cookie = c.replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
});

describe("auth flow", () => {
  it("loginUser posts credentials to /auth/login", async () => {
    post.mockResolvedValue({ data: { id: 1, email: "a@b.de" } });
    const data = await loginUser("a@b.de", "secret");
    expect(post).toHaveBeenCalledWith("/auth/login", { email: "a@b.de", password: "secret" });
    expect(data).toEqual({ id: 1, email: "a@b.de" });
  });

  it("registerUser posts to /auth/register", async () => {
    post.mockResolvedValue({ data: { ok: true } });
    await registerUser("new@b.de", "pw12345");
    expect(post).toHaveBeenCalledWith("/auth/register", { email: "new@b.de", password: "pw12345" });
  });

  it("logoutUser posts to /auth/logout", async () => {
    post.mockResolvedValue({ data: {} });
    await logoutUser();
    expect(post).toHaveBeenCalledWith("/auth/logout");
  });

  it("getCurrentUser returns the user on success", async () => {
    get.mockResolvedValue({ data: { id: 7, email: "me@b.de" } });
    const user = await getCurrentUser();
    expect(get).toHaveBeenCalledWith("/auth/me");
    expect(user).toEqual({ id: 7, email: "me@b.de" });
  });

  it("getCurrentUser swallows errors and returns null when unauthenticated", async () => {
    get.mockRejectedValue(new Error("401"));
    const user = await getCurrentUser();
    expect(user).toBeNull();
  });
});

describe("CSRF protection (double-submit)", () => {
  it("attaches X-CSRF-Token to state-changing requests when the cookie is present", () => {
    document.cookie = "csrf_t=token-123;path=/";
    const cfg = captured.requestInterceptor({ method: "post", headers: {} });
    expect(cfg.headers["X-CSRF-Token"]).toBe("token-123");
  });

  it("does NOT attach the token to safe (GET) requests", () => {
    document.cookie = "csrf_t=token-123;path=/";
    const cfg = captured.requestInterceptor({ method: "get", headers: {} });
    expect(cfg.headers["X-CSRF-Token"]).toBeUndefined();
  });
});
