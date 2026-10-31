import { apiClient } from "./client";
import { mockRepositories } from "./mocks/repositories";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

// Repositories & Contributions. Expanding a row shows description
// and contributors — a read-through view, not a separate table or route.
export function getRepositories() {
  if (USE_MOCKS) {
    return Promise.resolve(mockRepositories);
  }
  return apiClient.get("/repositories");
}
