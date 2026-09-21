export const mockAnalysis = {
  repository_id: "mock-repo-id",
  issue_id: "mock-issue-id",
  analysis_id: "mock-analysis-id",
  summary:
    "The JWT authentication middleware rejects valid sessions because it reads from a stale cache key after key rotation. Sessions issued with the previous key are not found, causing a 401.",
  root_cause:
    "Session lookup uses a fixed cache key rather than scanning both the current and previous key window. After a rotation, valid tokens referencing the old key are treated as missing.",
  affected_files: [
    "services/api/internal/auth/middleware.go",
    "services/api/internal/sessions/cache.go",
  ],
  status: "analyzed",
  analyzed_at: "2026-09-16T12:00:00Z",
};

export const mockProposal = {
  repository_id: "mock-repo-id",
  issue_id: "mock-issue-id",
  proposal_id: "mock-proposal-id",
  summary:
    "Extend the session cache to read from both the current and previous key window, with a fallback path for tokens issued during rotation.",
  approach:
    "Update session_cache.Get to accept a list of active keys and try each in order. Add a unit test covering the fallback path. No breaking API changes.",
  risks: [
    "If key rotation frequency increases, the fallback window may need to be bounded.",
    "Concurrent rotations during in-flight requests could produce brief stale reads.",
  ],
  status: "proposed",
  proposed_at: "2026-09-16T12:05:00Z",
};

export const mockGenerated = {
  repository_id: "mock-repo-id",
  issue_id: "mock-issue-id",
  summary:
    "Extended the session cache to scan multiple active keys with a fallback path, added a unit test, and removed the stale-only lookup.",
  changes: [
    {
      file_path: "services/api/internal/sessions/cache.go",
      operation: "modify",
      symbol: "Get",
      rationale:
        "Accept multiple active keys and try each before returning ErrSessionNotFound.",
      diff: [
        "@@ -10,10 +10,16 @@",
        " package sessions",
        " ",
        "-func Get(ctx context.Context, key string) (*Session, error) {",
        "+func Get(ctx context.Context, keys ...string) (*Session, error) {",
        " \t// Try each active key until one matches.",
        "+\tfor _, k := range keys {",
        "+\t\ts, err := lookup(ctx, k)",
        "+\t\tif err == nil {",
        "+\t\t\treturn s, nil",
        "+\t\t}",
        "+\t}",
        "\treturn nil, ErrSessionNotFound",
        " }",
      ].join("\n"),
    },
    {
      file_path: "services/api/internal/sessions/cache_test.go",
      operation: "modify",
      symbol: "TestGet",
      rationale:
        "Add a test case where the first key is stale and the second key resolves successfully.",
      diff: [
        "@@ -42,6 +42,14 @@",
        " \tassert.ErrorIs(t, err, ErrSessionNotFound)",
        " }",
        " ",
        "+func TestGet_FallbackOnStaleKey(t *testing.T) {",
        "+\tseed(t, previousKey, sess)",
        "+\tseed(t, currentKey, sess)",
        "+\tgot, err := Get(ctx, previousKey, currentKey)",
        "+\tassert.NoError(t, err)",
        "+\tassert.Equal(t, sess.ID, got.ID)",
        "+}",
      ].join("\n"),
    },
  ],
  tests: [
    {
      file_path: "services/api/internal/sessions/cache_test.go",
      operation: "add",
      proposed_content: "package sessions_test\n\nfunc TestGet_MultipleKeys(t *testing.T) {}\n",
      rationale: "Placeholder test for multiple-key lookup behavior.",
    },
  ],
  assumptions: [
    "The session store supports looking up a token by its raw key string.",
    "Only two key windows (current and previous) are active at any time.",
  ],
  uncertainty:
    "If the key rotation frequency increases, a bounded time window may be needed to avoid unbounded lookups.",
  status: "generated",
  generated_at: "2026-09-16T12:10:00Z",
};
