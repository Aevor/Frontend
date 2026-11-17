import { useState, useEffect, useCallback, useRef } from "react";
import { getCurrentUser } from "../api/users";
import { ApiError } from "../api/client";

let sessionRequest = null;

function fetchSession() {
  if (!sessionRequest) {
    sessionRequest = getCurrentUser().finally(() => {
      sessionRequest = null;
    });
  }
  return sessionRequest;
}

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);
  const mounted = useRef(false);

  const checkSession = useCallback((showLoading = true) => {
    const currentRequest = ++requestId.current;
    if (showLoading) {
      setLoading(true);
      setError(null);
    }
    fetchSession()
      .then((data) => {
        if (mounted.current && currentRequest === requestId.current) {
          setUser(data);
        }
      })
      .catch((err) => {
        if (!mounted.current || currentRequest !== requestId.current) return;
        setUser(null);
        if (!(err instanceof ApiError) || err.status !== 401) {
          setError(err);
        }
      })
      .finally(() => {
        if (mounted.current && currentRequest === requestId.current) {
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    mounted.current = true;
    checkSession(false);
    return () => {
      mounted.current = false;
      requestId.current += 1;
    };
  }, [checkSession]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refetch: checkSession,
  };
}
