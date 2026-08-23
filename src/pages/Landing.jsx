import { Navigate } from "react-router";
import { useSession } from "../hooks/useSession";
import { BASE_URL } from "../api/client";
import styles from "./Landing.module.css";

export function Landing() {
  const { loading, isAuthenticated } = useSession();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.page}>
      <span className={styles.logo}>Aevor</span>
      <h1 className={styles.headline}>
        Evidence-backed developer skills,
        <br />
        matched to real open-source issues.
      </h1>
      <a className={styles.button} href={`${BASE_URL}/auth/github/login`}>
        Continue with GitHub
      </a>
      <p className={styles.disclaimer}>
        We read public repos, PRs and issues. Nothing is posted on your behalf.
      </p>
    </div>
  );
}
