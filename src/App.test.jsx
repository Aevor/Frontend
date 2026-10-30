import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

vi.mock("./api/client", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    setAuthToken: vi.fn(),
  };
});

describe("App routes", () => {
  test("renders the OAuth callback route", async () => {
    render(
      <MemoryRouter initialEntries={["/auth/callback"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Couldn't sign you in. Try again.")).toBeInTheDocument();
    });
  });
});