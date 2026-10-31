import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { AuthCallback } from "./AuthCallback";

// setAuthToken is a no-op stub here — the test only verifies routing behavior.
vi.mock("../api/client", () => ({
  setAuthToken: vi.fn(),
}));

describe("AuthCallback", () => {
  test("redirects to dashboard when a token is present", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/auth/callback?token=abc"]}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(container.textContent).toBe("Dashboard");
    });
  });

  test("redirects to landing with error flag when no token", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/auth/callback"]}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<div>Landing</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(container.textContent).toBe("Landing");
    });
  });
});