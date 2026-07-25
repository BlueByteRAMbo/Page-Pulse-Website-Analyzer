import { RotateCcw } from 'lucide-react';

/**
 * Displays an API or network error as a formatted card.
 */
export default function ErrorCard({ icon: Icon, title, message, onRetry }) {
  return (
    <div className="error-card" role="alert">
      <div className="error-icon" aria-hidden="true">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <h2 className="error-title">{title}</h2>
      <p className="error-message">{message}</p>
      {onRetry && (
        <div className="error-actions">
          <button type="button" className="btn-primary" onClick={onRetry}>
            <RotateCcw size={14} />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
