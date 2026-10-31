import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { analyzeRepository } from "../api/repositories";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";
import styles from "./RepositoryWorkspace.module.css";

export function RepositoryWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeRepository(id, query);
      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred during analysis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
        <h1 className={styles.title}>Repository Analysis</h1>
      </div>

      <form onSubmit={handleAnalyze} className={styles.queryForm}>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Ask a question about the codebase (e.g., 'How does auth work?')"
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton} disabled={loading || !query.trim()}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </form>

      {error && <ErrorState message={error} onRetry={() => handleAnalyze({ preventDefault: () => {} })} />}

      {loading && (
        <div className={styles.loadingContainer}>
          <LoadingSkeleton height={100} />
          <LoadingSkeleton height={200} />
        </div>
      )}

      {result && (
        <div className={styles.resultContainer}>
          <div className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>Analysis Summary</h2>
            <p className={styles.summaryText}>{result.summary}</p>
          </div>

          <div className={styles.insightsGrid}>
            {result.insights.map((insight, i) => (
              <div key={i} className={styles.insightCard}>
                <div className={styles.insightHeader}>
                  <span className={styles.insightType}>{insight.type}</span>
                  <span className={styles.confidence}>{Math.round(insight.confidence * 100)}% confident</span>
                </div>
                <p className={styles.insightMessage}>{insight.message}</p>
                <div className={styles.insightLocation}>
                  {insight.file_path}:{insight.start_line}-{insight.end_line}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
