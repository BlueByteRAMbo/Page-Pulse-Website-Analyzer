import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';

const PLACEHOLDER = 'https://example.com';

/**
 * URL input form with inline format validation before submission.
 */
export default function UrlForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');
  const [inlineError, setInlineError] = useState('');

  function handleChange(e) {
    setUrl(e.target.value);
    if (inlineError) setInlineError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setInlineError('Please enter a URL.');
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setInlineError('URL must start with http:// or https://');
      return;
    }
    onSubmit(trimmed);
  }

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="url-input" className="form-label">
          Website URL
        </label>
        <div className="input-row">
          <input
            id="url-input"
            type="url"
            className="url-input"
            placeholder={PLACEHOLDER}
            value={url}
            onChange={handleChange}
            disabled={isLoading}
            aria-label="Website URL to analyze"
            aria-invalid={Boolean(inlineError)}
            aria-describedby={inlineError ? 'url-error' : undefined}
            autoComplete="url"
            spellCheck={false}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 0.6s linear infinite' }} />
                Analyzing…
              </>
            ) : (
              <>
                <Zap size={14} />
                Analyze
              </>
            )}
          </button>
        </div>
        {inlineError && (
          <p id="url-error" className="form-error-text" role="alert">
            {inlineError}
          </p>
        )}
      </form>
    </div>
  );
}
