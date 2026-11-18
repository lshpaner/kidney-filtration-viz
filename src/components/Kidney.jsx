import { useId } from 'react'
import kidneyImage from '../assets/kidney-cross-section.webp'

const VIEWBOX = '-55 95 460 270'

// Particle paths are in the SVG's own coordinate space (image at x=25..325, y=10..440).
function bloodParticles(time, variant, count = 15) {
  const out = []
  const slow = variant === 'ckd'
  for (let i = 0; i < count; i++) {
    const p = (time + i / count) % 1
    let x, y, o
    const inEnd = slow ? 0.35 : 0.3
    const loopEnd = slow ? 0.7 : 0.6
    const outEnd = slow ? 0.95 : 0.85
    if (p < inEnd) {
      const t = p / inEnd
      x = 50 + t * (slow ? 115 : 120)
      y = 200 + Math.sin(t * Math.PI * (slow ? 0.8 : 1)) * (slow ? 12 : 10)
      o = slow ? 0.6 : 0.85
    } else if (p < loopEnd) {
      const t = (p - inEnd) / (loopEnd - inEnd)
      const a = t * Math.PI * (slow ? 3 : 4)
      const r = slow ? 25 : 30
      x = 175 + Math.cos(a) * r
      y = 200 + Math.sin(a) * r
      o = slow ? 0.65 : 0.9
    } else if (p < outEnd) {
      const t = (p - loopEnd) / (outEnd - loopEnd)
      x = 175 - t * (slow ? 115 : 120)
      y = 220 + Math.sin(t * Math.PI * (slow ? 0.8 : 1)) * (slow ? 12 : 10)
      o = (slow ? 0.6 : 0.85) - t * 0.5
    } else continue
    out.push({ x, y, o, id: i })
  }
  return out
}

function filtrateParticles(time, count = 10) {
  const out = []
  for (let i = 0; i < count; i++) {
    const p = (time + i / count + 0.35) % 1
    if (p > 0.4 && p < 0.75) {
      const t = (p - 0.4) / 0.35
      out.push({ x: 119 + t * 10, y: 230 + t * 130, o: 1 - t * 0.2, id: i })
    }
  }
  return out
}

function albuminParticles(time, count) {
  const out = []
  for (let i = 0; i < count; i++) {
    const p = (time + i * 0.2 + 0.45) % 1
    if (p > 0.4 && p < 0.75) {
      const t = (p - 0.4) / 0.35
      out.push({ x: 120 + t * 2, y: 230 + t * 75, o: 1 - t * 0.2, id: i })
    }
  }
  return out
}

const HEALTHY_LABELS = [
  { text: ['Renal artery'], x: -50, y: 207, line: [75, 204, 115, 215] },
  { text: ['Renal vein'], x: -50, y: 242, line: [45, 239, 115, 230] },
  { text: ['Capsule'], x: 328, y: 120, line: [325, 123, 225, 130] },
  { text: ['Cortex'], x: 328, y: 175, line: [325, 178, 240, 185] },
  { text: ['Medulla'], x: 328, y: 240, line: [325, 243, 230, 250] },
  { text: ['Calyx'], x: 328, y: 295, line: [325, 298, 210, 280] },
  { text: ['Pelvis'], x: 250, y: 360, line: [250, 357, 185, 310] },
  { text: ['Ureter'], x: 40, y: 352, line: [78, 348, 104, 334] },
]

const CKD_LABELS = [
  { text: ['Narrowed', 'artery'], x: -50, y: 197, line: [35, 203, 115, 215] },
  { text: ['Congested', 'vein'], x: -50, y: 237, line: [40, 243, 115, 230] },
  { text: ['Thinned', 'capsule'], x: 328, y: 110, line: [325, 116, 225, 130] },
  { text: ['Atrophied', 'cortex'], x: 328, y: 165, line: [325, 171, 240, 185] },
  { text: ['Fibrotic', 'medulla'], x: 328, y: 230, line: [325, 236, 230, 250] },
  { text: ['Blunted', 'calyx'], x: 328, y: 285, line: [325, 291, 210, 280] },
  { text: ['Dilated', 'pelvis'], x: 235, y: 350, line: [235, 356, 185, 310] },
  { text: ['Ureter'], x: 40, y: 352, line: [78, 348, 104, 334] },
]

/**
 * One kidney panel. `variant` is 'healthy' or 'ckd'; `stage` (1–5) only matters for 'ckd'.
 * `time` is the animation phase in [0, 1).
 */
export default function Kidney({ variant, stage = 3, time, showLabels = true }) {
  const uid = useId().replace(/:/g, '')
  const isCKD = variant === 'ckd'
  const ids = {
    glowRed: `${uid}-glow-r`,
    glowBlue: `${uid}-glow-b`,
    glowGold: `${uid}-glow-g`,
    pulse: `${uid}-pulse`,
    damage: `${uid}-damage`,
  }

  const blood = bloodParticles(time, variant)
  const filtrate = filtrateParticles(time)
  const albumin = isCKD ? albuminParticles(time, stage) : []

  // Progressive desaturation and darkening of the tissue as stage rises.
  const saturation = isCKD ? 0.25 + (5 - stage) * 0.15 : 1
  const brightness = isCKD ? 0.65 - (stage - 1) * 0.08 : 1

  const accent = isCKD ? 'rgb(var(--c-ckd))' : 'rgb(var(--c-healthy))'
  const bloodColor = isCKD ? '#8B1E2B' : '#C8203A'
  const labels = isCKD ? CKD_LABELS : HEALTHY_LABELS

  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      role="img"
      aria-label={isCKD ? `Chronic kidney disease, stage G${stage}` : 'Healthy kidney'}
    >
      <defs>
        <filter id={ids.glowRed} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={ids.glowBlue} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={ids.glowGold} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {isCKD && (
          <filter id={ids.damage}>
            <feColorMatrix type="saturate" values={saturation} />
            <feComponentTransfer>
              <feFuncR type="linear" slope={brightness} />
              <feFuncG type="linear" slope={brightness} />
              <feFuncB type="linear" slope={brightness} />
            </feComponentTransfer>
          </filter>
        )}
        <radialGradient id={ids.pulse}>
          <stop offset="0%" stopColor={bloodColor} stopOpacity={isCKD ? 0.6 : 0.8}>
            <animate
              attributeName="stopOpacity"
              values={isCKD ? '0.6;0.2;0.6' : '0.8;0.3;0.8'}
              dur={isCKD ? '3s' : '2s'}
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor={bloodColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="175" cy="200" r={isCKD ? 30 : 35} fill={`url(#${ids.pulse})`} opacity="0.45" />

      <image
        href={kidneyImage}
        x="25"
        y="10"
        width="300"
        height="430"
        preserveAspectRatio="xMidYMid meet"
        filter={isCKD ? `url(#${ids.damage})` : undefined}
      />

      {blood.map((p) => (
        <circle
          key={`b${p.id}`}
          cx={p.x}
          cy={p.y}
          r={isCKD ? 4 : 3.5}
          fill={bloodColor}
          opacity={p.o}
          filter={`url(#${ids.glowRed})`}
        />
      ))}
      {filtrate.map((p) => (
        <circle
          key={`f${p.id}`}
          cx={p.x}
          cy={p.y}
          r="2"
          fill="rgb(var(--c-filtrate))"
          opacity={isCKD ? p.o * 0.6 : p.o}
          filter={`url(#${ids.glowBlue})`}
        />
      ))}
      {albumin.map((p) => (
        <circle
          key={`a${p.id}`}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="rgb(var(--c-albumin))"
          opacity={p.o}
          filter={`url(#${ids.glowGold})`}
        />
      ))}

      {showLabels && (
        <g fontFamily="'IBM Plex Sans', system-ui, sans-serif" fontSize="11" fontWeight="500" fill={accent}>
          {labels.map((l) => (
            <g key={l.text.join()}>
              {l.text.map((line, i) => (
                <text key={line} x={l.x} y={l.y + i * 12}>
                  {line}
                </text>
              ))}
              <line
                x1={l.line[0]}
                y1={l.line[1]}
                x2={l.line[2]}
                y2={l.line[3]}
                stroke={accent}
                strokeWidth="1"
                strokeOpacity="0.7"
              />
            </g>
          ))}
          {isCKD && (
            <g fill="rgb(var(--c-albumin))" stroke="rgb(var(--c-albumin))">
              <text x="-50" y="322" stroke="none">
                Proteinuria
              </text>
              <line x1="12" y1="318" x2="118" y2="292" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.8" />
            </g>
          )}
        </g>
      )}
    </svg>
  )
}
