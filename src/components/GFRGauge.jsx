import { GFR_BANDS, GFR_MAX, bandFor } from '../data/stages'

const CX = 90
const CY = 86
const R = 70
const W = 10

// Map a GFR value to an angle on a left-to-right semicircle (180° -> 360°).
const angle = (v) => Math.PI + (Math.min(Math.max(v, 0), GFR_MAX) / GFR_MAX) * Math.PI
const pt = (a, r = R) => [CX + r * Math.cos(a), CY + r * Math.sin(a)]

function arc(from, to, r = R) {
  const [x1, y1] = pt(angle(from), r)
  const [x2, y2] = pt(angle(to), r)
  const large = to - from > GFR_MAX / 2 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

/**
 * Semicircular GFR gauge on the KDIGO heat-map scale.
 * Faint bands show the categories; the filled arc tracks the live value.
 */
export default function GFRGauge({ value, label }) {
  const band = bandFor(value)
  const [nx, ny] = pt(angle(value), R - W / 2 - 6)

  return (
    <div className="flex items-end gap-4">
      <svg viewBox="0 0 180 93" className="w-36 md:w-44 shrink-0" aria-hidden="true">
        {GFR_BANDS.map((b) => (
          <path
            key={b.min}
            d={arc(b.min + 0.6, b.max - 0.6)}
            stroke={b.color}
            strokeOpacity="0.22"
            strokeWidth={W}
            fill="none"
          />
        ))}
        {value > 0.5 && (
          <path d={arc(0, value)} stroke={band.color} strokeWidth={W} fill="none" strokeLinecap="butt" />
        )}
        <circle cx={nx} cy={ny} r="2.5" fill="rgb(var(--c-ink))" />
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          fontSize="30"
          fontWeight="500"
          fill="rgb(var(--c-ink))"
          fontFamily="'IBM Plex Sans', system-ui, sans-serif"
        >
          {value.toFixed(0)}
        </text>
      </svg>
      <div className="pb-2 leading-tight">
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="text-xs text-muted">mL/min/1.73 m²</div>
      </div>
    </div>
  )
}
