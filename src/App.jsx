import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Skills } from "./pages/Skills";
import { Recommendations } from "./pages/Recommendations";
import { IssueDetails } from "./pages/IssueDetails";
import { AuthCallback } from "./pages/AuthCallback";
import { RepositoryWorkspace } from "./pages/RepositoryWorkspace";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/issues/:id" element={<IssueDetails />} />
          <Route path="/repositories/:id" element={<RepositoryWorkspace />} />
        </Route>
      </Route>
    </Routes>
  );
}
