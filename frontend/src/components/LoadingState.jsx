import { Loader2 } from 'lucide-react';

/**
 * Animated loading state displayed while the API request is in flight.
 */
export default function LoadingState({ currentStep, stepProgress }) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="spinner-ring" aria-hidden="true" />
      <p className="loading-step">{currentStep}</p>
      <p className="loading-hint">This usually takes a few seconds</p>
      <div className="progress-bar-track" aria-hidden="true">
        <div
          className="progress-bar-fill"
          style={{ width: `${stepProgress}%` }}
        />
      </div>
      <div className="skeleton-grid" style={{ marginTop: 32 }}>
        {Array.from({ length: 7 }, (_, i) => (
          <SkeletonCard key={i} wide={i >= 5} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard({ wide }) {
  return (
    <div className={`skeleton-card${wide ? ' metric-card wide' : ''}`}>
      <div className="skeleton-line short" />
      <div className="skeleton-line medium" />
      <div className="skeleton-value" />
    </div>
  );
}
