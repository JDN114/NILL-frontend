// Smoke tests for the checkout flow.
//  - PricingPage: clicking a plan starts a Stripe checkout session via api.js
//  - CheckoutPage: the public payment page loads invoice data via api.js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Mock the shared api instance (same resolved module PricingPage/CheckoutPage import).
vi.mock("../services/api", () => ({
  default: { post: vi.fn(), get: vi.fn(), request: vi.fn() },
}));

import api from "../services/api";
import PricingPage from "../pages/PricingPage";
import CheckoutPage from "../pages/CheckoutPage";

// jsdom does not implement navigation; replace window.location so href assignment is safe.
const origLocation = window.location;
beforeEach(() => {
  api.post.mockReset();
  api.get.mockReset();
  api.request.mockReset();
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: { href: "" },
  });
});
afterEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: origLocation,
  });
});

describe("checkout flow — PricingPage", () => {
  it("starts a checkout session for the selected plan", async () => {
    api.post.mockResolvedValue({ data: { checkout_url: "https://stripe.test/session" } });

    render(
      <MemoryRouter>
        <PricingPage />
      </MemoryRouter>
    );

    // Default mode is "Arbeitsstation" (the live product), so the first
    // visible plan card is the Arbeitsstation.
    const buttons = screen.getAllByText("Zahlungspflichtig abonnieren");
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/billing/create-checkout-session",
        { plan: "arbeitsstation", billing_cycle: "monthly" }
      );
    });
    expect(window.location.href).toBe("https://stripe.test/session");
  });

  it("shows an error when the session cannot be created", async () => {
    api.post.mockRejectedValue({ response: { data: { detail: "Zahlung nicht verfügbar" } } });

    render(
      <MemoryRouter>
        <PricingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByText("Zahlungspflichtig abonnieren")[0]);

    expect(await screen.findByText("Zahlung nicht verfügbar")).toBeInTheDocument();
  });
});

describe("checkout flow — public CheckoutPage", () => {
  it("loads invoice/seller data through the api instance", async () => {
    api.request.mockResolvedValue({
      data: {
        rechnung: { rechnungsnummer: "R-1", brutto_summe: 119, waehrung: "EUR" },
        verkäufer: { name: "Beispiel GmbH" },
        rechtliches: {},
      },
    });

    render(
      <MemoryRouter initialEntries={["/zahlen/tok-abc"]}>
        <Routes>
          <Route path="/zahlen/:token" element={<CheckoutPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(api.request).toHaveBeenCalledWith(
        expect.objectContaining({ url: "/public/zahlen/tok-abc", method: "GET" })
      );
    });
    expect(await screen.findByText("Beispiel GmbH")).toBeInTheDocument();
  });
});
