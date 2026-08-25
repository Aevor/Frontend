import { Link } from "react-router";
import { useApiResource } from "../hooks/useApiResource";
import { getRecommendations } from "../api/recommendations";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import styles from "./Recommendations.module.css";

export function Recommendations() {
  const { data: recommendations, loading, error, refetch } = useApiResource(getRecommendations);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recommended for you</h1>
        <button className={styles.filterButton}>Filters ▾</button>
      </div>

      {loading && (
        <div className={styles.list}>
          <LoadingSkeleton height={140} />
          <LoadingSkeleton height={140} />
        </div>
      )}

      {error && <ErrorState onRetry={refetch} />}

      {recommendations?.length === 0 && (
        <EmptyState message="No recommendations yet — we need a bit more contribution evidence first." />
      )}

      {recommendations?.length > 0 && (
        <div className={styles.list}>
          {recommendations.map((rec) => (
            <div key={rec.id} className={styles.card}>
              <p className={styles.cardTitle}>{rec.title}</p>
              <p className={styles.cardMeta}>
                {rec.repository} · {rec.difficulty} · {rec.score}%
              </p>
              <div className={styles.chips}>
                {rec.skills.map((skill) => (
                  <span key={skill} className={styles.chip}>{skill}</span>
                ))}
              </div>
              <p className={styles.why}>Why: {rec.why}</p>
              <div className={styles.ctaRow}>
                <Link to={`/issues/${rec.id}`} className={styles.cta}>
                  View Issue
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
