import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

vi.mock("./hooks/useSession", () => ({
  useSession: () => ({ loading: true, isAuthenticated: false }),
}));

test("renders the public route from the application route tree", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: /Evidence-backed developer skills/i })
  ).toBeInTheDocument();
});
