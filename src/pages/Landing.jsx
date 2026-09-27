import { Navigate, useSearchParams } from "react-router";
import { useSession } from "../hooks/useSession";
import { BASE_URL } from "../api/client";
import styles from "./Landing.module.css";

export function Landing() {
  const { loading, isAuthenticated } = useSession();
  const [searchParams] = useSearchParams();
  const hasError = searchParams.get("error") === "oauth_failed";

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
      {hasError && <p className={styles.error}>Couldn't sign you in. Try again.</p>}
      <p className={styles.disclaimer}>
        We read public repos, PRs and issues. Nothing is posted on your behalf.
      </p>
    </div>
  );
}
