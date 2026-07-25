/**
 * Displays a single metric within a card layout.
 *
 * @param {object}        props
 * @param {React.ReactNode} props.icon     - Lucide icon component (already rendered)
 * @param {string}        props.iconBg    - CSS background for the icon bubble
 * @param {string}        props.iconColor - CSS color for the icon stroke
 * @param {string}        props.label
 * @param {string|number} props.value
 * @param {string}        [props.unit]
 * @param {boolean}       [props.wide]    - Spans two columns
 * @param {React.ReactNode} [props.badge]
 * @param {boolean}       [props.mono]
 * @param {boolean}       [props.small]
 */
export default function MetricCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  unit,
  wide = false,
  badge,
  mono = false,
  small = false,
}) {
  const valueClass = ['metric-value', mono && 'mono', small && 'small']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`metric-card${wide ? ' wide' : ''}`}>
      <div className="metric-header">
        <span
          className="metric-icon"
          style={{ background: iconBg, color: iconColor }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="metric-label">{label}</span>
      </div>

      <div className={valueClass}>
        {value ?? '—'}
        {unit && !small && <span className="metric-unit">{unit}</span>}
      </div>

      {badge && <div>{badge}</div>}
    </div>
  );
}
