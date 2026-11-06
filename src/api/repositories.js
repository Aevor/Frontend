import { apiClient } from "./client";
import { mockRepositories } from "./mocks/repositories";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

// GitHub's repository list is wrapped in a paginated response. Keep that
// response shape for both the live API and the local mock mode.
export function getRepositories() {
  if (USE_MOCKS) {
    return Promise.resolve({
      repositories: mockRepositories,
      page: 1,
      per_page: mockRepositories.length,
      has_more: false,
    });
  }
  return apiClient.get("/repositories");
}

export function selectRepository(githubRepositoryId) {
  if (USE_MOCKS) {
    return Promise.resolve({ id: String(githubRepositoryId) });
  }
  return apiClient.post("/repositories", {
    github_repository_id: Number(githubRepositoryId),
  });
}

export function getSelectedRepositories() {
  if (USE_MOCKS) {
    return Promise.resolve({ repositories: [] });
  }
  return apiClient.get("/repositories/selected");
}

export function removeSelectedRepository(selectedRepositoryId) {
  if (USE_MOCKS) {
    return Promise.resolve(null);
  }
  return apiClient.delete(
    `/repositories/${encodeURIComponent(selectedRepositoryId)}`
  );
}

// Preparing a selected repository uses the API's two explicit operations:
// clone creates the controlled workspace; index runs the bounded
// discover/filter/extract/chunk/represent pipeline and stores metadata.
export async function prepareRepository(selectedRepositoryId) {
  if (USE_MOCKS) {
    return { status: "indexed" };
  }

  const repositoryPath = `/repositories/${encodeURIComponent(selectedRepositoryId)}`;
  await apiClient.post(`${repositoryPath}/clone`);
  return apiClient.post(`${repositoryPath}/index`);
}

export function analyzeRepository(selectedRepositoryId, query) {
  if (USE_MOCKS) {
    return Promise.resolve({
      repository_id: String(selectedRepositoryId),
      summary: "Mock analysis is enabled. Connect the API and AI service for a live result.",
      insights: [],
      status: "mock",
    });
  }
  return apiClient.post(
    `/repositories/${encodeURIComponent(selectedRepositoryId)}/analyze`,
    { query }
  );
}
