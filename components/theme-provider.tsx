'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{ theme: Theme; toggle: (e?: React.MouseEvent) => void }>({
  theme: 'light',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = (localStorage.getItem('traveloop-theme') as Theme) ?? 'light'
    setTheme(stored)
    document.documentElement.classList.toggle('dark', stored === 'dark')
  }, [])

  function toggle(e?: React.MouseEvent) {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    const x = e?.clientX ?? window.innerWidth / 2
    const y = e?.clientY ?? window.innerHeight / 2

    const applyTheme = () => {
      setTheme(next)
      localStorage.setItem('traveloop-theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
    }

    if (!('startViewTransition' in document)) {
      applyTheme()
      return
    }

    const transition = (document as any).startViewTransition(applyTheme)
    transition.ready.then(() => {
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
