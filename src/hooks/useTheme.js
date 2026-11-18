import { useCallback, useEffect, useState } from 'react'

const KEY = 'kfd-theme'

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d
      try {
        localStorage.setItem(KEY, next ? 'dark' : 'light')
      } catch {
        /* storage unavailable */
      }
      return next
    })
  }, [])

  return { dark, toggle }
}
