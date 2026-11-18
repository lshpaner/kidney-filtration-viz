import { Pause, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { STAGES } from '../data/stages'

const VIEWS = [
  { id: 'both', label: 'Compare' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'ckd', label: 'CKD' },
]

const btn =
  'inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium text-ink ' +
  'border border-line/20 bg-surface hover:bg-line/5 transition-colors'

export default function Controls({
  view,
  setView,
  isPlaying,
  toggle,
  reset,
  speed,
  setSpeed,
  stage,
  setStage,
  autoCycle,
  setAutoCycle,
  showLabels,
  setShowLabels,
}) {
  const current = STAGES.find((s) => s.id === stage)

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line/15 pt-4">
      {/* View */}
      <div role="radiogroup" aria-label="View" className="inline-flex rounded-md border border-line/20 bg-surface p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="radio"
            aria-checked={view === v.id}
            onClick={() => setView(v.id)}
            className={`h-8 px-3 rounded text-sm font-medium transition-colors ${
              view === v.id ? 'bg-ink text-base' : 'text-muted hover:text-ink'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Transport */}
      <div className="inline-flex items-center gap-2">
        <button onClick={toggle} className={btn} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span className="w-12 text-left">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        <button onClick={reset} className={btn} aria-label="Reset">
          <RotateCcw size={16} />
        </button>
        <label className="inline-flex items-center gap-2 text-sm text-muted">
          <span className="tabular-nums w-8 text-right text-ink">{speed.toFixed(2).replace(/0$/, '')}×</span>
          <input
            type="range"
            min="0.25"
            max="2"
            step="0.25"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-24"
            aria-label="Animation speed"
          />
        </label>
      </div>

      {/* Stage */}
      <div className="inline-flex items-center gap-2">
        <span className="text-sm text-muted">Stage</span>
        <div className="inline-flex items-center rounded-md border border-line/20 bg-surface">
          <button
            onClick={() => setStage(Math.max(1, stage - 1))}
            disabled={stage === 1}
            className="h-9 w-8 grid place-items-center text-ink disabled:opacity-30"
            aria-label="Previous stage"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="w-10 text-center text-sm font-medium text-ckd tabular-nums">{current.label}</span>
          <button
            onClick={() => setStage(Math.min(5, stage + 1))}
            disabled={stage === 5}
            className="h-9 w-8 grid place-items-center text-ink disabled:opacity-30"
            aria-label="Next stage"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <span className="text-sm text-muted hidden sm:inline">GFR {current.range}</span>
      </div>

      {/* Toggles */}
      <div className="inline-flex items-center gap-4 text-sm text-muted">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={autoCycle} onChange={(e) => setAutoCycle(e.target.checked)} className="accent-ink" />
          Cycle stages
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="accent-ink" />
          Labels
        </label>
      </div>
    </div>
  )
}
