import { useCallback, useEffect, useRef, useState } from 'react'

// One cycle (time 0 -> 1) at speed 1 takes CYCLE_MS.
const CYCLE_MS = 2600

/**
 * requestAnimationFrame loop that yields a normalized phase in [0, 1)
 * and counts completed cycles. Honors prefers-reduced-motion by starting paused.
 */
export function useAnimation(initialSpeed = 1) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [isPlaying, setIsPlaying] = useState(!reduced)
  const [speed, setSpeed] = useState(initialSpeed)
  const [time, setTime] = useState(0)
  const [cycles, setCycles] = useState(0)

  const speedRef = useRef(speed)
  const phaseRef = useRef(0)
  const lastRef = useRef(null)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    if (!isPlaying) {
      lastRef.current = null
      return
    }
    let raf
    const step = (now) => {
      if (lastRef.current == null) lastRef.current = now
      const dt = now - lastRef.current
      lastRef.current = now
      let next = phaseRef.current + (dt / CYCLE_MS) * speedRef.current
      if (next >= 1) {
        next -= Math.floor(next)
        setCycles((c) => c + 1)
      }
      phaseRef.current = next
      setTime(next)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [isPlaying])

  const toggle = useCallback(() => setIsPlaying((p) => !p), [])
  const reset = useCallback(() => {
    phaseRef.current = 0
    lastRef.current = null
    setTime(0)
    setCycles(0)
    setIsPlaying(false)
  }, [])

  return { time, cycles, isPlaying, speed, setSpeed, toggle, reset }
}
