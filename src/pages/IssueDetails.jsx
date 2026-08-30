import { Link, useParams } from "react-router";
import { useApiResource } from "../hooks/useApiResource";
import { getRecommendations } from "../api/recommendations";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";
import styles from "./IssueDetails.module.css";

export function IssueDetails() {
  const { id } = useParams();
  const { data: recommendations, loading, error, refetch } = useApiResource(getRecommendations);
  const issue = recommendations?.find((rec) => rec.id === id);

  if (loading) {
    return <LoadingSkeleton height={400} />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!issue) {
    return (
      <div className={styles.page}>
        <Link to="/recommendations" className={styles.back}>← Back to recommendations</Link>
        <ErrorState message="Couldn't find this issue." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/recommendations" className={styles.back}>← Back to recommendations</Link>

      <h1 className={styles.title}>{issue.title}</h1>
      <p className={styles.meta}>{issue.repository} · opened by @octocat</p>

      <div className={styles.chips}>
        <span className={styles.chip}>enhancement</span>
        <span className={styles.chip}>good-first-issue</span>
      </div>

      <div className={styles.body}>Issue body …</div>

      <div className={styles.statsRow}>
        <p className={styles.required}>Required: {issue.skills.join(" · ")}</p>
        <div className={styles.statsGroup}>
          <span>Difficulty: {issue.difficulty}</span>
          <span className={styles.score}>Match: {issue.score}%</span>
        </div>
      </div>

      <div className={styles.whyPanel}>
        <h2 className={styles.whyTitle}>Why Aevor recommended this</h2>
        <p className={styles.whyLine}>✓ {issue.why}</p>
        <p className={styles.whyLine}>✓ Difficulty matches your evidence</p>
      </div>

      <div className={styles.ctaRow}>
        <a href="#" className={styles.cta}>View on GitHub</a>
      </div>
    </div>
  );
}
