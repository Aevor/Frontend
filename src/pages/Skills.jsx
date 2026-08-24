import { useApiResource } from "../hooks/useApiResource";
import { getSkills } from "../api/skills";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import styles from "./Skills.module.css";

export function Skills() {
  const { data: skills, loading, error, refetch } = useApiResource(getSkills);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Skill Signature</h1>

      {loading && (
        <div className={styles.list}>
          <LoadingSkeleton height={90} />
          <LoadingSkeleton height={90} />
          <LoadingSkeleton height={90} />
        </div>
      )}

      {error && <ErrorState onRetry={refetch} />}

      {skills?.length === 0 && (
        <EmptyState message="No skills detected yet — sync your GitHub activity to get started." />
      )}

      {skills?.length > 0 && (
        <div className={styles.list}>
          {skills.map((skill, i) => (
            <div key={skill.id} className={i > 0 ? `${styles.card} ${styles.divider}` : styles.card}>
              <div className={styles.header}>
                <span className={styles.name}>{skill.name}</span>
                <span className={styles.score}>{skill.score}</span>
              </div>
              <p className={styles.evidence}>{skill.evidence}</p>
              <div className={styles.chips}>
                {skill.repos.map((repo) => (
                  <span key={repo} className={styles.chip}>{repo}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
