import { useState, useEffect, useCallback, useRef } from "react";
import { getSyncStatus, triggerSync } from "../api/sync";

const POLL_INTERVAL_MS = 3000;

function formatRelativeTime(isoString) {
  if (!isoString) return null;
  const minutes = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export function useSyncStatus() {
  const [status, setStatus] = useState("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const intervalRef = useRef(null);
  const requestId = useRef(0);
  const mounted = useRef(false);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const checkStatus = useCallback(() => {
    const currentRequest = ++requestId.current;
    getSyncStatus()
      .then((data) => {
        if (!mounted.current || currentRequest !== requestId.current) return;
        setStatus(data.status);
        setLastSyncedAt(data.lastSyncedAt);
        if (data.status !== "syncing") stopPolling();
      })
      .catch(() => {
        if (!mounted.current || currentRequest !== requestId.current) return;
        setStatus("error");
        stopPolling();
      });
  }, [stopPolling]);

  const startSync = useCallback(() => {
    stopPolling();
    ++requestId.current;
    setStatus("syncing");
    triggerSync()
      .then(() => {
        if (!mounted.current) return;
        intervalRef.current = setInterval(checkStatus, POLL_INTERVAL_MS);
        checkStatus();
      })
      .catch(() => {
        if (mounted.current) setStatus("error");
      });
  }, [checkStatus, stopPolling]);

  useEffect(() => {
    mounted.current = true;
    checkStatus();
    return () => {
      mounted.current = false;
      stopPolling();
    };
  }, [checkStatus, stopPolling]);

  return { status, lastSyncedLabel: formatRelativeTime(lastSyncedAt), startSync };
}
