import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import { apiClient } from "./client";
import {
  analyzeRepository,
  getRepositories,
  getSelectedRepositories,
  prepareRepository,
  removeSelectedRepository,
  selectRepository,
} from "./repositories";

describe("repository API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists repositories using the paginated API response", async () => {
    const response = { repositories: [{ id: 123, full_name: "octocat/hello" }], page: 1, per_page: 30, has_more: false };
    apiClient.get.mockResolvedValue(response);

    await expect(getRepositories()).resolves.toEqual(response);
    expect(apiClient.get).toHaveBeenCalledWith("/repositories");
  });

  it("selects a GitHub repository by its numeric ID", async () => {
    apiClient.post.mockResolvedValue({ id: "selected-id" });

    await selectRepository("1296269");

    expect(apiClient.post).toHaveBeenCalledWith("/repositories", {
      github_repository_id: 1296269,
    });
  });

  it("lists only the current user's selected repository contexts", async () => {
    apiClient.get.mockResolvedValue({ repositories: [] });

    await getSelectedRepositories();

    expect(apiClient.get).toHaveBeenCalledWith("/repositories/selected");
  });

  it("removes a selected repository by its Aevor ID", async () => {
    apiClient.delete.mockResolvedValue(null);

    await removeSelectedRepository("selected-id");

    expect(apiClient.delete).toHaveBeenCalledWith("/repositories/selected-id");
  });

  it("prepares a selected repository", async () => {
    apiClient.post.mockResolvedValue({ status: "prepared" });

    await prepareRepository("selected-id");

    expect(apiClient.post).toHaveBeenCalledWith("/repositories/selected-id/prepare");
  });

  it("sends natural-language analysis as a query", async () => {
    apiClient.post.mockResolvedValue({ summary: "done", insights: [] });

    await analyzeRepository("selected-id", "Where is authentication handled?");

    expect(apiClient.post).toHaveBeenCalledWith(
      "/repositories/selected-id/analyze",
      { query: "Where is authentication handled?" }
    );
  });
});
