import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Skills } from "./pages/Skills";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skills" element={<Skills />} />
        </Route>
      </Route>
    </Routes>
  );
}
