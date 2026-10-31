import { apiClient } from "./client";
import { mockTriggerSync, mockGetSyncStatus } from "./mocks/sync";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

// Draft endpoints — POST /sync and GET /sync/status, per the proposal doc.
export function triggerSync() {
  if (USE_MOCKS) return mockTriggerSync();
  return apiClient.post("/sync");
}

export function getSyncStatus() {
  if (USE_MOCKS) return mockGetSyncStatus();
  return apiClient.get("/sync/status");
}
