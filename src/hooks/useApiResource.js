import { useState, useEffect, useCallback, useRef } from "react";

export function useApiResource(fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);
  const mounted = useRef(false);

  const load = useCallback((showLoading = true) => {
    const currentRequest = ++requestId.current;
    if (showLoading) {
      setLoading(true);
      setError(null);
    }
    return fetchFn()
      .then((result) => {
        if (mounted.current && currentRequest === requestId.current) {
          setData(result);
        }
      })
      .catch((err) => {
        if (mounted.current && currentRequest === requestId.current) {
          setError(err);
        }
      })
      .finally(() => {
        if (mounted.current && currentRequest === requestId.current) {
          setLoading(false);
        }
      });
  }, [fetchFn]);

  useEffect(() => {
    mounted.current = true;
    load(false);
    return () => {
      mounted.current = false;
      requestId.current += 1;
    };
  }, [load]);

  return { data, loading, error, refetch: load };
}
