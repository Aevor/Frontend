import { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../api/users";
import { ApiError } from "../api/client";

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(() => getCurrentUser())
      .then((data) => {
        if (active) setUser(data);
      })
      .catch((requestError) => {
        if (!active) return;

        setUser(null);
        if (!(requestError instanceof ApiError) || requestError.status !== 401) {
          setError(requestError);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [requestVersion]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refetch,
  };
}
