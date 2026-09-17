import { Link } from "react-router";
import { useSession } from "../hooks/useSession";
import { useApiResource } from "../hooks/useApiResource";
import { getContributionSummary } from "../api/contributions";
import { getSkills } from "../api/skills";
import { getRecommendations } from "../api/recommendations";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { RepositoryList } from "../components/common/RepositoryList";
import { SelectedRepositoryList } from "../components/common/SelectedRepositoryList";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const { user } = useSession();
  const pulse = useApiResource(getContributionSummary);
  const skills = useApiResource(getSkills);
  const recommendations = useApiResource(getRecommendations);

  return (
    <div className={styles.page}>
      {user && (
        <p className={styles.identity}>
          @{user.username} · {user.displayName}
        </p>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>My Aevor Workspace</h2>
        </div>
        <SelectedRepositoryList />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your Repositories</h2>
        </div>
        <RepositoryList />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contribution Pulse</h2>
        {pulse.loading && <LoadingSkeleton height={72} />}
        {pulse.error && <ErrorState onRetry={pulse.refetch} />}
        {pulse.data && (
          <div className={styles.pulseRow}>
            <div className={styles.pulseChip}>
              <span className={styles.pulseNumber}>{pulse.data.prs}</span>
              <span className={styles.pulseLabel}>PRs</span>
            </div>
            <div className={styles.pulseChip}>
              <span className={styles.pulseNumber}>{pulse.data.repos}</span>
              <span className={styles.pulseLabel}>Repos</span>
            </div>
            <div className={styles.pulseChip}>
              <span className={styles.pulseNumber}>{pulse.data.issues}</span>
              <span className={styles.pulseLabel}>Issues</span>
            </div>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Skill Signature</h2>
          <Link to="/skills" className={styles.viewAll}>View all →</Link>
        </div>
        {skills.loading && <LoadingSkeleton height={60} />}
        {skills.error && <ErrorState onRetry={skills.refetch} />}
        {skills.data?.length === 0 && (
          <EmptyState message="No skills detected yet — sync your GitHub activity to get started." />
        )}
        {skills.data?.length > 0 && (
          <div className={styles.skillList}>
            {skills.data.slice(0, 4).map((skill) => (
              <div key={skill.id} className={styles.skillRow}>
                <span className={styles.skillName}>{skill.name}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${skill.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recommended for you</h2>
          <Link to="/recommendations" className={styles.viewAll}>View all →</Link>
        </div>
        {recommendations.loading && <LoadingSkeleton height={90} />}
        {recommendations.error && <ErrorState onRetry={recommendations.refetch} />}
        {recommendations.data?.length === 0 && (
          <EmptyState message="No recommendations yet — we need a bit more contribution evidence first." />
        )}
        {recommendations.data?.length > 0 && (
          <div className={styles.recRow}>
            {recommendations.data.slice(0, 2).map((rec) => (
              <div key={rec.id} className={styles.recCard}>
                <p className={styles.recTitle}>{rec.title}</p>
                <p className={styles.recMeta}>{rec.repository} · {rec.score}%</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
