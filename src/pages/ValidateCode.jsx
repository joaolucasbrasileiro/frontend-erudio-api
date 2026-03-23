import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './AuthFlow.css'

const API_URL = import.meta.env.VITE_API_URL

function ValidateCode() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const email     = location.state?.email || ''

  const [digits, setDigits]   = useState(['', '', '', '', '', ''])
  const [codeErro, setCodeErro] = useState(false)
  const [erros, setErros]     = useState([])
  const [tipoMsg, setTipoMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const inputs = useRef([])

  function handleDigit(index, value) {
    const v = value.replace(/\D/g, '').slice(-1)
    const novo = [...digits]
    novo[index] = v
    setDigits(novo)
    setCodeErro(false)
    if (v && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(''))
      inputs.current[5]?.focus()
    }
    e.preventDefault()
  }

  async function handleValidate() {
    setCodeErro(false)
    setErros([])

    const code = digits.join('')

    if (code.length < 6) {
      setCodeErro(true)
      setErros(['Preencha o código de 6 dígitos!'])
      setTipoMsg('erro')
      return
    }

    setLoading(true)

    const response = await fetch(`${API_URL}/auth/validate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    })

    setLoading(false)

    if (response.ok) {
      setErros(['Código válido! Redirecionando...'])
      setTipoMsg('success')
      setTimeout(() => navigate('/reset-password', { state: { email, code } }), 1500)
    } else {
      setCodeErro(true)
      setErros(['Código inválido ou expirado. Tente novamente.'])
      setTipoMsg('erro')
      setDigits(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    }
  }

  async function handleResend() {
    setErros([])
    await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    setErros(['Novo código enviado para o seu email.'])
    setTipoMsg('success')
    setDigits(['', '', '', '', '', ''])
    inputs.current[0]?.focus()
  }

  return (
    <div className="page">
      <div className="auth-container">

        <button className="back-btn" onClick={() => navigate('/forgot-password')}>
          ← Voltar
        </button>

        <h1 className="heading">Validar código</h1>
        <p className="subheading">
          Digite o código de 6 dígitos enviado para <strong>{email || 'seu email'}</strong>
        </p>

        {erros.length > 0 && (
          <ul className={`msg ${tipoMsg}`}>
            {erros.map((erro, index) => (
              <li key={index}>{erro}</li>
            ))}
          </ul>
        )}

        <div className="code-inputs">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              className={codeErro ? 'code-digit erro' : 'code-digit'}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <button className="btn" onClick={handleValidate} disabled={loading}>
          <span>{loading ? 'Validando...' : 'Validar código →'}</span>
        </button>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">não recebeu o código?</span>
          <div className="divider-line"></div>
        </div>

        <button className="btn-secondary" onClick={handleResend}>
          <span>Reenviar código</span>
        </button>

      </div>
    </div>
  )
}

export default ValidateCode
