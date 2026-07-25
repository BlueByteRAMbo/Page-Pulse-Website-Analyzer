import { Zap, Copy, FileText, RotateCcw } from 'lucide-react';
import { useAnalyzer } from '../hooks/useAnalyzer';
import UrlForm from '../components/UrlForm';
import LoadingState from '../components/LoadingState';
import ResultsGrid from '../components/ResultsGrid';
import ErrorCard from '../components/ErrorCard';
import CopyButton from '../components/CopyButton';

/**
 * Generates a plain-text summary of the analysis for the "Copy Report" button.
 */
function buildReportText(url, data) {
  return [
    '=== Page Pulse Report ===',
    `URL: ${url}`,
    '',
    `HTTP Status:       ${data.status}`,
    `Response Time:     ${data.responseTime} ms`,
    `Page Title:        ${data.title || 'N/A'}`,
    `Meta Description:  ${data.metaDescription || 'N/A'}`,
    `H1 Count:          ${data.h1Count}`,
    `Missing Alt Tags:  ${data.missingAltImages}`,
    `Word Count:        ${data.wordCount}`,
    '',
    `Generated: ${new Date().toUTCString()}`,
  ].join('\n');
}

export default function Home() {
  const {
    status,
    data,
    errorInfo,
    currentStep,
    stepProgress,
    analyzedUrl,
    analyze,
    reset,
  } = useAnalyzer();

  const isLoading = status === 'loading';

  return (
    <main className="main-content">
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-badge" aria-hidden="true">
          <Zap size={11} />
          Instant analysis
        </div>
        <h1 id="hero-title" className="hero-title">
          Analyze any <span>webpage</span>
          <br />
          in seconds
        </h1>
        <p className="hero-subtitle">
          Get HTTP status, response time, SEO metrics, and accessibility insights
          for any public URL — instantly.
        </p>
      </section>

      {/* Form */}
      <UrlForm onSubmit={analyze} isLoading={isLoading} />

      {/* Loading */}
      {status === 'loading' && (
        <LoadingState currentStep={currentStep} stepProgress={stepProgress} />
      )}

      {/* Error */}
      {status === 'error' && errorInfo && (
        <ErrorCard
          icon={errorInfo.Icon}
          title={errorInfo.title}
          message={errorInfo.message}
          onRetry={reset}
        />
      )}

      {/* Results */}
      {status === 'success' && data && (
        <>
          <div className="results-header">
            <div>
              <p className="results-title">Analysis Report</p>
              <p className="results-url" title={analyzedUrl}>
                {analyzedUrl}
              </p>
            </div>
            <div className="results-actions">
              <CopyButton
                id="copy-json-btn"
                text={JSON.stringify(data, null, 2)}
                label="Copy JSON"
              />
              <CopyButton
                id="copy-report-btn"
                text={buildReportText(analyzedUrl, data)}
                label="Copy Report"
              />
              <button
                id="analyze-another-btn"
                type="button"
                className="btn-secondary"
                onClick={reset}
              >
                <RotateCcw size={13} />
                Analyze Another
              </button>
            </div>
          </div>

          <ResultsGrid data={data} />
        </>
      )}
    </main>
  );
}
