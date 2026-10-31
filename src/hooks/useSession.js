import { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../api/users";
import { ApiError } from "../api/client";

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkSession = useCallback(() => {
    setLoading(true);
    setError(null);
    getCurrentUser()
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        setUser(null);
        if (!(err instanceof ApiError) || err.status !== 401) {
          setError(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refetch: checkSession,
  };
}
