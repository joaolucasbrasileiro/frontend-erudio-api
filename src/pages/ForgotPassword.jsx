import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AuthFlow.css'

const API_URL = import.meta.env.VITE_API_URL

function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail]     = useState('')
  const [emailErro, setEmailErro] = useState(false)
  const [erros, setErros]     = useState([])
  const [tipoMsg, setTipoMsg] = useState('')
  const [loading, setLoading] = useState(false)

  function emailValido(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }

  async function handleSubmit() {
    setEmailErro(false)
    setErros([])

    if (email === '') {
      setEmailErro(true)
      setErros(['Preencha o email!'])
      setTipoMsg('erro')
      return
    }

    if (!emailValido(email)) {
      setEmailErro(true)
      setErros(['Email inválido!'])
      setTipoMsg('erro')
      return
    }

    setLoading(true)

    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    setLoading(false)

    if (response.ok) {
      setErros(['Se o email estiver cadastrado, você receberá o código em breve.'])
      setTipoMsg('success')
      setTimeout(() => navigate('/validate-code', { state: { email } }), 2500)
    } else {
      setErros(['Erro ao enviar o código. Tente novamente.'])
      setTipoMsg('erro')
    }
  }

  return (
    <div className="page">
      <div className="auth-container">

        <button className="back-btn" onClick={() => navigate('/')}>
          ← Voltar
        </button>

        <h1 className="heading">Esqueci minha senha</h1>
        <p className="subheading">Digite seu email para receber o código de recuperação</p>

        {erros.length > 0 && (
          <ul className={`msg ${tipoMsg}`}>
            {erros.map((erro, index) => (
              <li key={index}>{erro}</li>
            ))}
          </ul>
        )}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu email"
            className={emailErro ? 'erro' : email && emailValido(email) ? 'valido' : ''}
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailErro(false) }}
          />
          <span className="field-hint">Email inválido</span>
          {email && emailValido(email) && (
            <span className="field-ok">✓ Email válido</span>
          )}
        </div>

        <button className="btn" onClick={handleSubmit} disabled={loading}>
          <span>{loading ? 'Enviando...' : 'Enviar código →'}</span>
        </button>

      </div>
    </div>
  )
}

export default ForgotPassword
