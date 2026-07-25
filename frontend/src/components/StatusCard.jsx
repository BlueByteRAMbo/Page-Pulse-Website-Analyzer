import { CheckCircle2, AlertTriangle, XCircle, ArrowRightLeft, Activity } from 'lucide-react';

/**
 * Returns display metadata for an HTTP status code.
 */
function getStatusMeta(status) {
  if (status >= 200 && status < 300) {
    return {
      label: 'Success',
      description: 'The server responded successfully.',
      accentColor: '#34d399',
      bgColor: 'rgba(52, 211, 153, 0.06)',
      borderColor: 'rgba(52, 211, 153, 0.22)',
      Icon: CheckCircle2,
      badgeClass: 'badge-success',
    };
  }
  if (status >= 300 && status < 400) {
    return {
      label: 'Redirect',
      description: 'The resource was moved.',
      accentColor: '#38bdf8',
      bgColor: 'rgba(56, 189, 248, 0.06)',
      borderColor: 'rgba(56, 189, 248, 0.22)',
      Icon: ArrowRightLeft,
      badgeClass: 'badge-neutral',
    };
  }
  if (status >= 400 && status < 500) {
    return {
      label: 'Client Error',
      description: 'The request could not be fulfilled.',
      accentColor: '#fbbf24',
      bgColor: 'rgba(251, 191, 36, 0.06)',
      borderColor: 'rgba(251, 191, 36, 0.22)',
      Icon: AlertTriangle,
      badgeClass: 'badge-warning',
    };
  }
  if (status >= 500) {
    return {
      label: 'Server Error',
      description: 'The server encountered an error.',
      accentColor: '#f87171',
      bgColor: 'rgba(248, 113, 113, 0.06)',
      borderColor: 'rgba(248, 113, 113, 0.22)',
      Icon: XCircle,
      badgeClass: 'badge-error',
    };
  }
  return {
    label: 'Unknown',
    description: 'Unrecognised status code.',
    accentColor: '#888888',
    bgColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.10)',
    Icon: Activity,
    badgeClass: 'badge-neutral',
  };
}

/**
 * A visually prominent card for the HTTP status code.
 * Spans two columns, uses a dynamic accent colour, and shows
 * a status icon, numeric code, label, and short description.
 */
export default function StatusCard({ status }) {
  const { label, description, accentColor, bgColor, borderColor, Icon, badgeClass } =
    getStatusMeta(status);

  return (
    <div
      className="status-card"
      style={{
        background: bgColor,
        borderColor: borderColor,
      }}
      aria-label={`HTTP Status: ${status} ${label}`}
    >
      {/* Left accent bar */}
      <span
        className="status-card-bar"
        style={{ background: accentColor }}
        aria-hidden="true"
      />

      <div className="status-card-inner">
        {/* Icon + label row */}
        <div className="status-card-header">
          <span
            className="status-card-icon"
            style={{ color: accentColor, background: `${accentColor}18` }}
            aria-hidden="true"
          >
            <Icon size={15} strokeWidth={2} />
          </span>
          <span className="metric-label">HTTP Status</span>
        </div>

        {/* Big status number */}
        <div className="status-card-code" style={{ color: accentColor }}>
          {status}
        </div>

        {/* Label + description */}
        <div className="status-card-meta">
          <span className={`metric-badge ${badgeClass}`} style={{ marginTop: 0 }}>
            {label}
          </span>
          <span className="status-card-desc">{description}</span>
        </div>
      </div>
    </div>
  );
}
