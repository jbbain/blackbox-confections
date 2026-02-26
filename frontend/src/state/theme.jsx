import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeCtx = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('bb_theme') || 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (mode === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('bb_theme', mode)
  }, [mode])

  const value = useMemo(() => ({ mode, setMode, toggle: () => setMode(m => (m === 'dark' ? 'light' : 'dark')) }), [mode])
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
