import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { useSession } from "../hooks/useSession";

vi.mock("../hooks/useSession", () => ({
  useSession: vi.fn(),
}));

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/" element={<div>Landing page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("shows a loading skeleton while the session is resolving", () => {
    useSession.mockReturnValue({ loading: true, isAuthenticated: false });
    renderProtectedRoute();
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument();
  });

  it("redirects to / when the session resolves to signed out", () => {
    useSession.mockReturnValue({ loading: false, isAuthenticated: false });
    renderProtectedRoute();
    expect(screen.getByText("Landing page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument();
  });

  it("renders the protected content when the session resolves to signed in", () => {
    useSession.mockReturnValue({ loading: false, isAuthenticated: true });
    renderProtectedRoute();
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
    expect(screen.queryByText("Landing page")).not.toBeInTheDocument();
  });
});
