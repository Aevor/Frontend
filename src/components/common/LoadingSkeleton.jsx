import styles from "./LoadingSkeleton.module.css";

export function LoadingSkeleton({ height = 20, width = "100%" }) {
  return <div className={styles.skeleton} style={{ height, width }} />;
}
