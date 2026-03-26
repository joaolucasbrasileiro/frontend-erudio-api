import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [modes, setModes] = useState({ adhd: false })

  // Carrega preferência salva (Nielsen #3 — controle e liberdade do usuário)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('a11y-modes')
      if (saved) setModes(JSON.parse(saved))
    } catch (_) {}
  }, [])

  // Aplica/remove o atributo no <html> e persiste
  useEffect(() => {
    try {
      localStorage.setItem('a11y-modes', JSON.stringify(modes))
    } catch (_) {}

    const root = document.documentElement
    if (modes.adhd) {
      root.setAttribute('data-a11y-adhd', 'true')
    } else {
      root.removeAttribute('data-a11y-adhd')
    }
  }, [modes])

  const toggle = (mode) =>
    setModes((prev) => ({ ...prev, [mode]: !prev[mode] }))

  return (
    <AccessibilityContext.Provider value={{ modes, toggle }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility must be used inside AccessibilityProvider')
  return ctx
}
