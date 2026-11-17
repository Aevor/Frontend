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

export function selectRepository(repositoryId) {
  return apiClient.post(`/repositories/${repositoryId}/select`);
}

export function prepareRepository(repositoryId) {
  return apiClient.post(`/repositories/${repositoryId}/prepare`);
}

export function getSelectedRepositories() {
  return apiClient.get("/repositories/selected");
}

export function removeSelectedRepository(repositoryId) {
  return apiClient.delete(`/repositories/selected/${repositoryId}`);
}

export function analyzeRepository(repositoryId, query) {
  return apiClient.post(`/repositories/${repositoryId}/analyze`, { query });
}
