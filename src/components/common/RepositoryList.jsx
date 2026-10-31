import { useState } from "react";
import { getRepositories, selectRepository, prepareRepository } from "../../api/repositories";
import { useApiResource } from "../../hooks/useApiResource";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import styles from "./RepositoryList.module.css";

export function RepositoryList() {
  const { data, loading, error, refetch } = useApiResource(getRepositories);
  const [selectingId, setSelectingId] = useState(null);

  async function handleSelect(id) {
    setSelectingId(id);
    try {
      const selected = await selectRepository(id);
      const selectedId = selected.id;
      
      // Trigger the preparation pipeline
      await prepareRepository(selectedId);
      
      alert("Repository selected and prepared successfully!");
    } catch (err) {
      alert("Error: " + (err.message || "Failed to prepare repository"));
    } finally {
      setSelectingId(null);
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSkeleton height={80} />
        <LoadingSkeleton height={80} />
        <LoadingSkeleton height={80} />
      </div>
    );
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  const repos = data?.repositories || [];

  if (repos.length === 0) {
    return <EmptyState message="No GitHub repositories found." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {repos.map((repo) => (
          <div key={repo.id} className={styles.card}>
            <div className={styles.header}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={styles.repoLink}>
                {repo.full_name}
              </a>
              <span className={`${styles.badge} ${repo.private ? styles.badgePrivate : styles.badgePublic}`}>
                {repo.private ? "Private" : "Public"}
              </span>
            </div>
            <p className={styles.description}>{repo.description || "No description provided."}</p>
            <div className={styles.footer}>
              <button 
                className={styles.selectButton} 
                onClick={() => handleSelect(repo.id)}
                disabled={selectingId === repo.id}
              >
                {selectingId === repo.id ? "Preparing..." : "Select Repository"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
