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

export function selectRepository(id) {
  return apiClient.post(`/repositories/${id}/select`);
}

export function prepareRepository(id) {
  return apiClient.post(`/repositories/${id}/prepare`);
}

export function getSelectedRepositories() {
  return apiClient.get("/repositories/selected");
}

export function removeSelectedRepository(id) {
  return apiClient.delete(`/repositories/selected/${id}`);
}

export function analyzeRepository(id, query) {
  return apiClient.post(`/repositories/${id}/analyze`, { query });
}
