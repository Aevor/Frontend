export const mockPullRequestDetails = {
  id: 777001,
  number: 7,
  title: "Add keyset pagination to the API list endpoint",
  body: "Switches the list endpoint from offset paging to keyset paging using the indexed cursor column.",
  state: "open",
  author_login: "octocat",
  html_url: "https://github.com/example/project/pull/7",
  head: { ref: "aevor/7-add-keyset-pagination", sha: "c3f0a1b2c3d4e5f607182930b1c2d3e4f5a6b7c8" },
  base: { ref: "main", sha: "1a2b3c4d5e6f708192a0b1c2d3e4f5a6b7c8d9e0" },
  draft: false,
  merged: false,
  created_at: "2026-09-15T10:00:00Z",
  updated_at: "2026-09-16T09:30:00Z",
  closed_at: null,
  merged_at: null,
  checks: [
    {
      name: "CI / build",
      status: "success",
      description: "Build passed on 3.2.0",
      url: "https://github.com/example/project/actions/runs/42",
      started_at: "2026-09-16T09:00:00Z",
      completed_at: "2026-09-16T09:05:00Z",
      source: "check_run",
    },
    {
      name: "ci/tests",
      status: "failure",
      description: "1 failing test",
      url: "https://github.com/example/project/commit/c3f0a1b/runs/43",
      started_at: null,
      completed_at: null,
      source: "commit_status",
    },
  ],
  reviews: [
    {
      id: 11,
      author_login: "mikepr",
      state: "CHANGES_REQUESTED",
      body: "The cursor encoding does not round-trip special characters.",
      html_url: "https://github.com/example/project/pull/7#pullrequestreview-11",
      submitted_at: "2026-09-16T08:00:00Z",
    },
  ],
  review_comments: [
    {
      id: 22,
      author_login: "mikepr",
      body: "Escape the cursor before appending it to the query string.",
      path: "services/api/cmd/server/handlers.go",
      line: 88,
      diff_hunk: "@@ -84,7 +84,9 @@ func listHandler",
      html_url: "https://github.com/example/project/pull/7#discussion_r22",
      created_at: "2026-09-16T08:01:00Z",
    },
  ],
  issue_comments: [
    {
      id: 33,
      author_login: "jannar",
      body: "Nice — leftover_offset is removed entirely, so the response schema stays stable.",
      html_url: "https://github.com/example/project/pull/7#issuecomment-33",
      created_at: "2026-09-16T08:20:00Z",
    },
  ],
  files: [
    {
      filename: "services/api/cmd/server/handlers.go",
      status: "modified",
      additions: 32,
      deletions: 18,
      changes: 50,
    },
    {
      filename: "services/api/internal/store/cursor.go",
      status: "added",
      additions: 64,
      deletions: 0,
      changes: 64,
    },
    {
      filename: "services/api/internal/store/cursor_test.go",
      status: "added",
      additions: 41,
      deletions: 0,
      changes: 41,
    },
  ],
};

export const mockPullRequestFeedback = {
  pull_request_number: 7,
  summary:
    "The PR is close to ready. One review requests a change: the cursor must be escaped before it is appended to the query string so page keys survive special characters.",
  blocking: [
    {
      severity: "critical",
      source: "review_comment",
      author_login: "mikepr",
      file_path: "services/api/cmd/server/handlers.go",
      line: 88,
      original_text: "Escape the cursor before appending it to the query string.",
      recommendation:
        "URL-escape the cursor value when building the next-page link so special characters round-trip.",
      reason: "Unescaped cursors break the next page for titles containing reserved characters.",
    },
  ],
  non_blocking: [
    {
      severity: "info",
      source: "issue_comment",
      author_login: "jannar",
      file_path: "",
      line: null,
      original_text: "Nice — leftover_offset is removed entirely, so the response schema stays stable.",
      recommendation: "No change required; acknowledged as positive feedback.",
      reason: "The comment confirms the response schema remains stable.",
    },
  ],
  insufficient_context: false,
  status: "analyzed",
};