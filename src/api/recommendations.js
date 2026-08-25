import { apiClient } from "./client";
import { mockRecommendations } from "./mocks/recommendations";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export function getRecommendations() {
  if (USE_MOCKS) {
    return Promise.resolve(mockRecommendations);
  }
  return apiClient.get("/recommendations");
}
