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
      {!loading && !error && repositories.length === 0 && (
        <EmptyState message="No GitHub repositories found." />
      )}

      {repositories.length > 0 && (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.headerRow}`}>
            <span className={styles.colRepo}>Repository</span>
            <span className={styles.colLang}>Default branch</span>
            <span className={styles.colNum}>Access</span>
            <span className={styles.colExpand} />
          </div>
          {repositories.map((repository) => (
            <div key={repository.id}>
              <div
                className={styles.row}
                role="button"
                tabIndex={0}
                aria-expanded={expandedId === repository.id}
                onClick={() =>
                  setExpandedId(
                    expandedId === repository.id ? null : repository.id
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setExpandedId(
                      expandedId === repository.id ? null : repository.id
                    );
                  }
                }}
              >
                <span className={styles.colRepo}>
                  {repository.full_name}
                </span>
                <span className={styles.colLang}>
                  {repository.default_branch || "—"}
                </span>
                <span className={`${styles.colNum} ${styles.count}`}>
                  {repository.private ? "Private" : "Public"}
                </span>
                <span className={styles.colExpand}>
                  {expandedId === repository.id ? "▴" : "▾"}
                </span>
              </div>
              {expandedId === repository.id && (
                <div className={styles.expanded}>
                  <p className={styles.description}>
                    {repository.description || "No description provided."}
                  </p>
                  <p className={styles.contributors}>
                    Owner: {repository.owner_login || "Unknown"}
                    {repository.html_url ? (
                      <>
                        {" · "}
                        <a
                          href={repository.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open on GitHub
                        </a>
                      </>
                    ) : null}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className={styles.note}>
        Repository details come from the authenticated GitHub account. Pull-request and star totals are not part of this API response.
      </p>
    </div>
  );
}
