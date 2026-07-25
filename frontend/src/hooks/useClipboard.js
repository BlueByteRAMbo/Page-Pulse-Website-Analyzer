import { useState, useCallback } from 'react';

/**
 * Copies text to clipboard. Returns `copied` boolean for feedback.
 * Auto-resets after `resetDelay` ms.
 */
export function useClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      } catch {
        // Clipboard API not available — fail silently
      }
    },
    [resetDelay]
  );

  return { copied, copy };
}
