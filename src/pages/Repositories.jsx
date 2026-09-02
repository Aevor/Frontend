import { useState } from "react";
import { useApiResource } from "../hooks/useApiResource";
import { getRepositories } from "../api/repositories";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import styles from "./Repositories.module.css";

export function Repositories() {
  const { data: repos, loading, error, refetch } = useApiResource(getRepositories);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Repositories</h1>

      {loading && <LoadingSkeleton height={200} />}
      {error && <ErrorState onRetry={refetch} />}
      {repos?.length === 0 && <EmptyState message="No repositories found." />}

      {repos?.length > 0 && (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.headerRow}`}>
            <span className={styles.colRepo}>Repo</span>
            <span className={styles.colLang}>Language</span>
            <span className={styles.colNum}>PRs</span>
            <span className={styles.colNum}>Stars</span>
            <span className={styles.colExpand} />
          </div>
          {repos.map((repo) => (
            <div key={repo.id}>
              <div
                className={styles.row}
                onClick={() => setExpandedId(expandedId === repo.id ? null : repo.id)}
              >
                <span className={styles.colRepo}>{repo.fullName}</span>
                <span className={styles.colLang}>{repo.language}</span>
                <span className={styles.colNum}>{repo.prs}</span>
                <span className={styles.colNum}>{repo.stars}</span>
                <span className={styles.colExpand}>{expandedId === repo.id ? "▴" : "▾"}</span>
              </div>
              {expandedId === repo.id && (
                <div className={styles.expanded}>
                  <p className={styles.description}>{repo.description}</p>
                  <p className={styles.contributors}>
                    Contributors: {repo.contributors.join(", ")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className={styles.note}>
        Expanding a row shows description and contributors — read-through, not a stored table.
      </p>
    </div>
  );
}
