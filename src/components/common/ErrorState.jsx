import styles from "./ErrorState.module.css";

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className={styles.error}>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
