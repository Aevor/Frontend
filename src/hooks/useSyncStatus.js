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

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const checkStatus = useCallback(() => {
    getSyncStatus()
      .then((data) => {
        setStatus(data.status);
        setLastSyncedAt(data.lastSyncedAt);
        if (data.status !== "syncing") stopPolling();
      })
      .catch(() => {
        setStatus("error");
        stopPolling();
      });
  }, [stopPolling]);

  const startSync = useCallback(() => {
    setStatus("syncing");
    triggerSync()
      .then(() => {
        intervalRef.current = setInterval(checkStatus, POLL_INTERVAL_MS);
      })
      .catch(() => setStatus("error"));
  }, [checkStatus]);

  useEffect(() => {
    checkStatus();
    return stopPolling;
  }, [checkStatus, stopPolling]);

  return { status, lastSyncedLabel: formatRelativeTime(lastSyncedAt), startSync };
}
