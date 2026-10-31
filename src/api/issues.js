import { apiClient } from "./client";
import { mockAnalysis, mockGenerated, mockProposal } from "./mocks/issues";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

// Issue solution pipeline: Analyze Issue → Propose Solution → Generate
// Changes. These mirror the Aevor backend endpoints
// POST /repositories/:id/issues/:issueID/{analyze,propose,generate-changes}.
// The recommendation data supplies `selected_repository_id` + `issue_id` so the
// page can target the correct repository workspace and synced issue.

// Runs the AI issue analysis step
// (POST /repositories/:id/issues/:issueID/analyze).
export function analyzeIssue(repositoryId, issueID) {
  if (USE_MOCKS) {
    return Promise.resolve(mockAnalysis);
  }
  return apiClient.post(`/repositories/${repositoryId}/issues/${issueID}/analyze`);
}

// Runs the AI solution proposal step, grounded in the issue's existing
// analysis (POST /repositories/:id/issues/:issueID/propose).
export function proposeSolution(repositoryId, issueID) {
  if (USE_MOCKS) {
    return Promise.resolve(mockProposal);
  }
  return apiClient.post(`/repositories/${repositoryId}/issues/${issueID}/propose`);
}

// Generates structured code changes with an actual diff from the issue's
// analysis and solution proposal
// (POST /repositories/:id/issues/:issueID/generate-changes).
export function generateChanges(repositoryId, issueID) {
  if (USE_MOCKS) {
    return Promise.resolve(mockGenerated);
  }
  return apiClient.post(`/repositories/${repositoryId}/issues/${issueID}/generate-changes`);
}