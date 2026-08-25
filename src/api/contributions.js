import { apiClient } from "./client";
import { mockContributionSummary } from "./mocks/contributions";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export function getContributionSummary() {
  if (USE_MOCKS) {
    return Promise.resolve(mockContributionSummary);
  }
  return apiClient.get("/contribution-summary");
}
