import {
  Activity,
  Zap,
  Heading1,
  ImageOff,
  BookOpen,
  Tag,
  AlignLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRightLeft,
} from 'lucide-react';

import MetricCard from './MetricCard';
import CopyButton from './CopyButton';
import StatusCard from './StatusCard';

function timingBadge(ms) {
  if (ms < 1000) return <span className="metric-badge badge-success">Fast</span>;
  if (ms < 3000) return <span className="metric-badge badge-warning">Moderate</span>;
  return <span className="metric-badge badge-error">Slow</span>;
}

function altBadge(count) {
  if (count === 0) {
    return (
      <span className="metric-badge badge-success">
        <CheckCircle2 size={10} />
        All images described
      </span>
    );
  }
  return (
    <span className="metric-badge badge-warning">
      <AlertTriangle size={10} />
      {count} missing
    </span>
  );
}

function h1Badge(count) {
  if (count === 1)
    return (
      <span className="metric-badge badge-success">
        <CheckCircle2 size={10} /> Optimal
      </span>
    );
  if (count === 0)
    return (
      <span className="metric-badge badge-error">
        <XCircle size={10} /> Missing H1
      </span>
    );
  return (
    <span className="metric-badge badge-warning">
      <AlertTriangle size={10} /> Multiple H1s
    </span>
  );
}

/**
 * Renders the full analysis report as a responsive metric grid.
 * The HTTP Status card receives special prominent treatment.
 */
export default function ResultsGrid({ data }) {
  const {
    status,
    responseTime,
    title,
    metaDescription,
    h1Count,
    missingAltImages,
    wordCount,
  } = data;

  return (
    <div className="metrics-grid" role="region" aria-label="Analysis results">
      {/* ── HTTP Status — prominent standalone card ── */}
      <StatusCard status={status} />

      {/* ── Response Time ── */}
      <MetricCard
        icon={<Zap size={14} />}
        iconBg="rgba(251, 191, 36, 0.10)"
        iconColor="#fbbf24"
        label="Response Time"
        value={responseTime}
        unit="ms"
        badge={timingBadge(responseTime)}
      />

      {/* ── H1 Count ── */}
      <MetricCard
        icon={<Heading1 size={14} />}
        iconBg="rgba(52, 211, 153, 0.10)"
        iconColor="#34d399"
        label="H1 Tags"
        value={h1Count}
        badge={h1Badge(h1Count)}
      />

      {/* ── Missing Alt Text ── */}
      <MetricCard
        icon={<ImageOff size={14} />}
        iconBg="rgba(248, 113, 113, 0.10)"
        iconColor="#f87171"
        label="Missing Alt Text"
        value={missingAltImages}
        badge={altBadge(missingAltImages)}
      />

      {/* ── Word Count ── */}
      <MetricCard
        icon={<BookOpen size={14} />}
        iconBg="rgba(255, 255, 255, 0.06)"
        iconColor="#888888"
        label="Approx. Word Count"
        value={wordCount.toLocaleString()}
      />

      {/* ── Page Title — wide ── */}
      <MetricCard
        icon={<Tag size={14} />}
        iconBg="rgba(56, 189, 248, 0.10)"
        iconColor="#38bdf8"
        label="Page Title"
        value={title || 'No title found'}
        wide
        small
        badge={
          !title ? (
            <span className="metric-badge badge-warning">
              <AlertTriangle size={10} /> Missing title tag
            </span>
          ) : null
        }
      />

      {/* ── Meta Description — wide ── */}
      <MetricCard
        icon={<AlignLeft size={14} />}
        iconBg="rgba(52, 211, 153, 0.08)"
        iconColor="#34d399"
        label="Meta Description"
        value={metaDescription || 'No meta description found'}
        wide
        small
        badge={
          !metaDescription ? (
            <span className="metric-badge badge-warning">
              <AlertTriangle size={10} /> Missing meta description
            </span>
          ) : null
        }
      />
    </div>
  );
}
