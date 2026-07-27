import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'

type ThemeContextValue = {
  theme: 'light'
  density: 'comfortable' | 'compact'
  reducedMotion: boolean
  setDensity: (density: 'comfortable' | 'compact') => void
  setReducedMotion: (reduced: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() =>
    localStorage.getItem('simpkl-density') === 'compact'
      ? 'compact'
      : 'comfortable',
  )
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      localStorage.getItem('simpkl-reduced-motion') === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    localStorage.setItem('simpkl-density', density)
  }, [density])

  useEffect(() => {
    localStorage.setItem('simpkl-reduced-motion', String(reducedMotion))
  }, [reducedMotion])

  return (
    <ThemeContext.Provider
      value={{
        theme: 'light',
        density,
        reducedMotion,
        setDensity,
        setReducedMotion,
      }}
    >
      <div
        data-theme="light"
        data-density={density}
        data-motion={reducedMotion ? 'reduced' : 'full'}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme harus digunakan di dalam ThemeProvider')
  }
  return context
}
