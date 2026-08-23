import { Navigate, Outlet } from "react-router";
import { useSession } from "../hooks/useSession";

export function ProtectedRoute() {
  const { loading, isAuthenticated } = useSession();

  if (loading) {
    return <div>Loading…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
