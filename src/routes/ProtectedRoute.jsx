import { Navigate, Outlet } from "react-router";
import { useSession } from "../hooks/useSession";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";

export function ProtectedRoute() {
  const { loading, isAuthenticated } = useSession();

  if (loading) {
    return <LoadingSkeleton height={200} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
