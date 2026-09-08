import { Link } from "react-router";
import { useSession } from "../hooks/useSession";
import { useApiResource } from "../hooks/useApiResource";
import { getContributionSummary } from "../api/contributions";
import { getSkills } from "../api/skills";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";
import styles from "./Profile.module.css";

export function Profile() {
  const { user } = useSession();
  const pulse = useApiResource(getContributionSummary);
  const skills = useApiResource(getSkills);

  const topSkillNames = skills.data?.slice(0, 3).map((s) => s.name).join(", ");

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.identityRow}>
          <img src={user?.avatarUrl} alt="" className={styles.avatar} />
          <div className={styles.nameCol}>
            <span className={styles.name}>{user?.displayName}</span>
            <span className={styles.handle}>@{user?.username} · github.com/{user?.username}</span>
          </div>
        </div>

        {pulse.loading && <LoadingSkeleton height={16} width={220} />}
        {pulse.error && <ErrorState onRetry={pulse.refetch} />}
        {pulse.data && (
          <p className={styles.stat}>
            {pulse.data.prs} PRs across {pulse.data.repos} repositories
          </p>
        )}

        {skills.loading && <LoadingSkeleton height={16} width={260} />}
        {topSkillNames && <p className={styles.stat}>Top skills: {topSkillNames}</p>}

        <div className={styles.links}>
          <Link to="/skills" className={styles.link}>View Skill Signature →</Link>
          <Link to="/repositories" className={styles.link}>View Repositories →</Link>
        </div>
      </div>
    </div>
  );
}
