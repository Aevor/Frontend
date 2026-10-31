import styles from "./EmptyState.module.css";

export function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <button className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
