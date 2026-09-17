import { useState } from "react";
import { useNavigate } from "react-router";
import { getSelectedRepositories, removeSelectedRepository } from "../../api/repositories";
import { useApiResource } from "../../hooks/useApiResource";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import styles from "./SelectedRepositoryList.module.css";

export function SelectedRepositoryList() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApiResource(getSelectedRepositories);
  const [deletingId, setDeletingId] = useState(null);

  async function handleRemove(id) {
    if (!confirm("Remove this repository from your workspace?")) return;
    
    setDeletingId(id);
    try {
      await removeSelectedRepository(id);
      refetch(); // Refresh the list after deletion
    } catch (err) {
      alert("Failed to remove repository: " + (err.message || "Unknown error"));
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSkeleton height={60} />
        <LoadingSkeleton height={60} />
      </div>
    );
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  // The backend ToSelectedListResponse returns { "repositories": [...] }
  const repos = data?.repositories || [];

  if (repos.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <EmptyState message="No repositories selected. Select one from the list above to get started." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {repos.map((repo) => (
          <div key={repo.id} className={styles.row}>
            <div className={styles.info}>
              <span className={styles.repoName}>{repo.full_name}</span>
              <span className={styles.repoId}>ID: {repo.id.slice(0, 8)}...</span>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.viewButton} 
                onClick={() => navigate(`/repositories/${repo.id}`)}
              >
                View Workspace
              </button>
              <button 
                className={styles.removeButton} 
                onClick={() => handleRemove(repo.id)}
                disabled={deletingId === repo.id}
              >
                {deletingId === repo.id ? "..." : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
