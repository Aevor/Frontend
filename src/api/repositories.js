import { apiClient } from "./client";
import { mockRepositories } from "./mocks/repositories";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";
let mockSelectedRepositories = [];

// Repositories & Contributions. Expanding a row shows description
// and contributors — a read-through view, not a separate table or route.
export function getRepositories() {
  if (USE_MOCKS) {
    return Promise.resolve({ repositories: mockRepositories, next_cursor: null });
  }
  return apiClient.get("/repositories");
}

export function selectRepository(repositoryId) {
  if (USE_MOCKS) {
    const repository = mockRepositories.find(({ id }) => id === repositoryId);
    if (!repository) {
      return Promise.reject(new Error("Repository not found"));
    }
    if (!mockSelectedRepositories.some(({ id }) => id === repositoryId)) {
      mockSelectedRepositories = [...mockSelectedRepositories, repository];
    }
    return Promise.resolve(repository);
  }
  return apiClient.post(`/repositories/${repositoryId}/select`);
}

export async function prepareRepository(repositoryId) {
  if (USE_MOCKS) {
    return Promise.resolve({ id: repositoryId, status: "indexed" });
  }
  await apiClient.post(`/repositories/${repositoryId}/clone`);
  return apiClient.post(`/repositories/${repositoryId}/index`);
}

export function getSelectedRepositories() {
  if (USE_MOCKS) {
    return Promise.resolve({ repositories: mockSelectedRepositories });
  }
  return apiClient.get("/repositories/selected");
}

export function removeSelectedRepository(repositoryId) {
  if (USE_MOCKS) {
    mockSelectedRepositories = mockSelectedRepositories.filter(({ id }) => id !== repositoryId);
    return Promise.resolve();
  }
  return apiClient.delete(`/repositories/selected/${repositoryId}`);
}

export function analyzeRepository(repositoryId, query) {
  if (USE_MOCKS) {
    return Promise.resolve({ summary: "Mock analysis", insights: [] });
  }
  return apiClient.post(`/repositories/${repositoryId}/analyze`, { query });
}
