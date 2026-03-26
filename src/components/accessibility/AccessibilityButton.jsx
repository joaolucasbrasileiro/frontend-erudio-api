import { useState } from 'react'
import { useAccessibility } from './AccessibilityContext'
import './AccessibilityButton.css'

const MODES = [
  {
    key: 'adhd',
    label: 'TDAH',
    description: 'Reduz distrações e melhora o foco',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l2 2" />
      </svg>
    ),
  },
]

export default function AccessibilityButton() {
  const [open, setOpen] = useState(false)
  const { modes, toggle } = useAccessibility()

  const anyActive = Object.values(modes).some(Boolean)

  return (
    <div
  className={`a11y-wrapper ${open ? 'a11y-wrapper--open' : ''}`}
  role="region"
  aria-label="Opções de acessibilidade"
>

      {/* Painel deslizante */}
      <div
        className={`a11y-panel ${open ? 'a11y-panel--open' : ''}`}
        aria-hidden={!open}
        role="menu"
      >
        <p className="a11y-panel__title">Acessibilidade</p>

        {MODES.map((mode) => {
          const active = modes[mode.key]
          return (
            <button
              key={mode.key}
              role="menuitemcheckbox"
              aria-checked={active}
              className={`a11y-mode-btn ${active ? 'a11y-mode-btn--active' : ''}`}
              onClick={() => toggle(mode.key)}
            >
              <span className="a11y-mode-btn__icon">{mode.icon}</span>
              <span className="a11y-mode-btn__text">
                <strong>{mode.label}</strong>
                <small>{mode.description}</small>
              </span>
              <span className="a11y-mode-btn__check" aria-hidden="true">
                {active && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* Botão flutuante principal */}
      <button
        className={`a11y-fab ${open ? 'a11y-fab--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? 'Fechar opções de acessibilidade' : 'Abrir opções de acessibilidade'}
        title="Acessibilidade"
      >
        {/* Ícone de pessoa com acessibilidade */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="5" r="2" />
          <path d="M12 10v6" />
          <path d="M9 13l-3 5" />
          <path d="M15 13l3 5" />
          <path d="M9 10h6" />
        </svg>

        {/* Badge verde quando algum modo está ativo (Nielsen #1 — visibilidade do status) */}
        {anyActive && (
          <span className="a11y-fab__badge" aria-label="Modo de acessibilidade ativo" />
        )}
      </button>

    </div>
  )
}
