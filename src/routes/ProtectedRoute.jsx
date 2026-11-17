import { Navigate, Outlet } from "react-router";
import { useSession } from "../hooks/useSession";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";

export function ProtectedRoute() {
  const { loading, error, isAuthenticated, refetch } = useSession();

  if (loading) {
    return <LoadingSkeleton height={200} />;
  }

  if (error) {
    return <ErrorState message="Unable to verify your session." onRetry={refetch} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
