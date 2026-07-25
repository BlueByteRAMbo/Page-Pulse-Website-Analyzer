import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="site-header">
      <a href="/" className="logo" aria-label="Page Pulse home">
        <span className="logo-icon" aria-hidden="true">
          <Activity size={16} strokeWidth={2.5} />
        </span>
        <span className="logo-text">
          Page<span>Pulse</span>
        </span>
      </a>
      <span className="header-tag">Webpage Analyzer</span>
    </header>
  );
}
