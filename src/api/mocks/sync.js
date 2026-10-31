// Simulates a real sync taking a few seconds, so the polling loop
// in useSyncStatus has something real to demonstrate against.
let mockSyncStartedAt = null;
let mockLastSyncedAt = "2026-09-05T10:00:00.000Z";
const MOCK_SYNC_DURATION_MS = 6000;

export function mockTriggerSync() {
  mockSyncStartedAt = Date.now();
  return Promise.resolve({ started: true });
}

export function mockGetSyncStatus() {
  if (mockSyncStartedAt !== null) {
    const elapsed = Date.now() - mockSyncStartedAt;
    if (elapsed < MOCK_SYNC_DURATION_MS) {
      return Promise.resolve({ status: "syncing", lastSyncedAt: mockLastSyncedAt });
    }
    mockLastSyncedAt = new Date().toISOString();
    mockSyncStartedAt = null;
  }
  return Promise.resolve({ status: "idle", lastSyncedAt: mockLastSyncedAt });
}
