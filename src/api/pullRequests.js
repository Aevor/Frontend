import { apiClient } from "./client";
import { mockPullRequestDetails, mockPullRequestFeedback } from "./mocks/pullRequests";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

// Pull request details + AI feedback analysis for a selected repository.
// These mirror the Aevor backend endpoints
// GET /repositories/:id/pull-requests/:number and
// POST /repositories/:id/pull-requests/:number/analyze-feedback.

// Fetches a pull request's live details: the PR record, its CI checks, and
// all feedback inputs (reviews, review comments, issue comments, changed
// files) in GitHub's own vocabulary.
export function getPullRequestDetails(repositoryId, number) {
  if (USE_MOCKS) {
    return Promise.resolve({ ...mockPullRequestDetails, number });
  }
  return apiClient.get(`/repositories/${repositoryId}/pull-requests/${number}`);
}

// Runs the AI feedback analysis for a pull request. The backend gathers the
// PR's live GitHub facts, grounds the analysis in the index, and returns
// blocking/non-blocking actionable items kept separate from GitHub's own
// record (POST /repositories/:id/pull-requests/:number/analyze-feedback).
export function analyzePullRequestFeedback(repositoryId, number) {
  if (USE_MOCKS) {
    return Promise.resolve(mockPullRequestFeedback);
  }
  return apiClient.post(`/repositories/${repositoryId}/pull-requests/${number}/analyze-feedback`);
}