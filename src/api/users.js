import { apiClient } from "./client";
import { mockCurrentUser } from "./mocks/users";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export function getCurrentUser() {
  if (USE_MOCKS) {
    return Promise.resolve(mockCurrentUser);
  }
  return apiClient.get("/users/me");
}
