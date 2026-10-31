import { apiClient } from "./client";
import { mockSkills } from "./mocks/skills";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export function getSkills() {
  if (USE_MOCKS) {
    return Promise.resolve(mockSkills);
  }
  return apiClient.get("/skills");
}
