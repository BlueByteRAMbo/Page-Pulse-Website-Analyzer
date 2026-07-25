import { Copy, Check } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

/**
 * Button that copies `text` to clipboard and shows brief confirmation.
 */
export default function CopyButton({ text, label = 'Copy', id }) {
  const { copied, copy } = useClipboard();

  return (
    <button
      id={id}
      type="button"
      className={`btn-copy${copied ? ' copied' : ''}`}
      onClick={() => copy(text)}
      aria-label={copied ? 'Copied!' : label}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}
