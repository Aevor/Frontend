import { useState } from "react";
import { useApiResource } from "../hooks/useApiResource";
import { getRepositories } from "../api/repositories";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import styles from "./Repositories.module.css";

export function Repositories() {
  const { data, loading, error, refetch } = useApiResource(getRepositories);
  const [expandedId, setExpandedId] = useState(null);
  const repositories = data?.repositories || [];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Repositories</h1>

      {loading && <LoadingSkeleton height={200} />}
      {error && <ErrorState onRetry={refetch} />}
      {!loading && !error && repositories.length === 0 && <EmptyState message="No repositories found." />}

      {repositories.length > 0 && (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.headerRow}`}>
            <span className={styles.colRepo}>Repo</span>
            <span className={styles.colLang}>Default branch</span>
            <span className={styles.colNum}>Access</span>
            <span className={styles.colNum}>Owner</span>
            <span className={styles.colExpand} />
          </div>
          {repositories.map((repo) => (
            <div key={repo.id}>
              <div
                className={styles.row}
                role="button"
                tabIndex={0}
                aria-expanded={expandedId === repo.id}
                onClick={() => setExpandedId(expandedId === repo.id ? null : repo.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedId(expandedId === repo.id ? null : repo.id);
                  }
                }}
              >
                <span className={styles.colRepo}>{repo.full_name || repo.fullName}</span>
                <span className={styles.colLang}>{repo.default_branch || repo.language || "—"}</span>
                <span className={`${styles.colNum} ${styles.count}`}>{repo.access || "—"}</span>
                <span className={`${styles.colNum} ${styles.count}`}>
                  {repo.owner?.login || repo.owner || "—"}
                </span>
                <span className={styles.colExpand}>{expandedId === repo.id ? "▴" : "▾"}</span>
              </div>
              {expandedId === repo.id && (
                <div className={styles.expanded}>
                  <p className={styles.description}>{repo.description || "No description provided."}</p>
                  <p className={styles.contributors}>
                    {(repo.link || repo.html_url || repo.url) ? (
                      <a
                        href={repo.link || repo.html_url || repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.link || repo.html_url || repo.url}
                      </a>
                    ) : "Repository link unavailable."}
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
