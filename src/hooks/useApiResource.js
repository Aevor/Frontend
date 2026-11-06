import { useState, useEffect, useCallback } from "react";

export function useApiResource(fetchFn) {
  const [data, setData] = useState(null);
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
      .then(() => fetchFn())
      .then((result) => {
        if (active) setData(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchFn, requestVersion]);

  return { data, loading, error, refetch };
}
