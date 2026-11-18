import { useEffect, useMemo, useState } from 'react'
import { Droplet, Moon, Sun } from 'lucide-react'
import kfdLogo from '/kfd_logo_black.svg'
import Kidney from './components/Kidney'
import GFRGauge from './components/GFRGauge'
import Controls from './components/Controls'
import About from './components/About'
import { useAnimation } from './hooks/useAnimation'
import { useTheme } from './hooks/useTheme'
import { STAGES, HEALTHY_GFR } from './data/stages'

const STAGE_SECONDS = 8

function Panel({ title, accentClass, subtitle, gfr, drops, children }) {
  return (
    <section className="flex flex-col">
      <header className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className={`font-display text-2xl ${accentClass}`}>{title}</h2>
        {subtitle && <span className="text-sm text-muted text-right">{subtitle}</span>}
      </header>
      {children}
      <footer className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <GFRGauge value={gfr} label="Glomerular filtration rate" />
        <div className="flex items-center gap-2 pb-2 text-sm text-muted">
          <Droplet size={14} />
          <span className="tabular-nums text-ink">{drops}</span> drops
        </div>
      </footer>
    </section>
  )
}

export default function App() {
  const anim = useAnimation(1)
  const { dark, toggle: toggleTheme } = useTheme()

  const [view, setView] = useState('both')
  const [stage, setStage] = useState(3)
  const [autoCycle, setAutoCycle] = useState(false)
  const [showLabels, setShowLabels] = useState(true)

  // Optional stage cycling while playing.
  useEffect(() => {
    if (!autoCycle || !anim.isPlaying) return
    const id = setInterval(() => setStage((s) => (s % 5) + 1), STAGE_SECONDS * 1000)
    return () => clearInterval(id)
  }, [autoCycle, anim.isPlaying])

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      if (e.code === 'Space') {
        e.preventDefault()
        anim.toggle()
      } else if (e.key === 'r') anim.reset()
      else if (e.key === 'ArrowLeft') setStage((s) => Math.max(1, s - 1))
      else if (e.key === 'ArrowRight') setStage((s) => Math.min(5, s + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [anim.toggle, anim.reset])

  const current = STAGES.find((s) => s.id === stage)
  const wobble = Math.sin(anim.time * Math.PI * 2)
  const healthyGFR = HEALTHY_GFR + wobble * 5
  const ckdGFR = Math.max(0, current.gfr + wobble * 3)

  // Drops per completed cycle scale with GFR relative to healthy.
  const drops = useMemo(
    () => ({
      healthy: anim.cycles * 10,
      ckd: Math.round(anim.cycles * 10 * (current.gfr / HEALTHY_GFR)),
    }),
    [anim.cycles, current.gfr],
  )

  const healthyPanel = (
    <Panel title="Healthy" accentClass="text-healthy" gfr={healthyGFR} drops={drops.healthy}>
      <Kidney variant="healthy" time={anim.time} showLabels={showLabels} />
    </Panel>
  )
  const ckdPanel = (
    <Panel
      title="Chronic kidney disease"
      accentClass="text-ckd"
      subtitle={`${current.label}, ${current.description.toLowerCase()}`}
      gfr={ckdGFR}
      drops={drops.ckd}
    >
      <Kidney variant="ckd" stage={stage} time={anim.time} showLabels={showLabels} />
    </Panel>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 pt-6">
        <img src={kfdLogo} alt="KFD, Kidney Filtration Dynamics" className="logo h-12 md:h-14 w-auto" />
        <button
          onClick={toggleTheme}
          className="h-9 w-9 grid place-items-center rounded-md border border-line/20 bg-surface text-ink hover:bg-line/5 transition-colors"
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <main className="flex-1 px-6 md:px-10 py-8 max-w-7xl w-full mx-auto">
        <div className="mb-8 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink">
            Healthy vs. chronic kidney disease
          </h1>
          <p className="mt-3 text-base text-muted max-w-prose">
            Glomerular filtration in a normal kidney beside one at any of the five KDIGO stages. Step through the stages or let
            them cycle.
          </p>
        </div>

        <div className={`grid gap-10 mb-8 ${view === 'both' ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-xl'}`}>
          {view !== 'ckd' && healthyPanel}
          {view !== 'healthy' && ckdPanel}
        </div>

        <Controls
          view={view}
          setView={setView}
          isPlaying={anim.isPlaying}
          toggle={anim.toggle}
          reset={anim.reset}
          speed={anim.speed}
          setSpeed={anim.setSpeed}
          stage={stage}
          setStage={setStage}
          autoCycle={autoCycle}
          setAutoCycle={setAutoCycle}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
        />

        <p className="mt-3 text-xs text-muted hidden md:block">
          Space play or pause, R reset, arrow keys change stage.
        </p>

        <div className="mt-10">
          <About />
        </div>
      </main>

      <footer className="px-6 md:px-10 py-6 text-xs text-muted border-t border-line/10">
        © {new Date().getFullYear()} Leon Shpaner. Educational use.
      </footer>
    </div>
  )
}
